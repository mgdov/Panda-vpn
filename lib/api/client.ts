import { API_CONFIG, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "./config"
import type {
    AuthResponse,
    Tariff,
    Node,
    ProfileResponse,
    VPNKey,
    UsageStats,
    PaymentResponse,
    PaymentDetails,
    BillingState,
    BillingHistory,
    LoginRequest,
    RegisterRequest,
    CreatePaymentRequest,
    RenewRequest,
    CreateClientRequest,
    CreateClientResponse,
    MeResponse,
    DeviceRegisterRequest,
    DeviceRegisterResponse,
    DeviceListResponse,
    KeySearchRequest,
    KeySearchResponse,
    CreateRenewalPaymentRequest,
    CreateNewKeyPaymentRequest,
    DeepLinkResponse,
    VPNAppType,
} from "./types"
import { getErrorMessage } from "./errors"

class APIClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    private getToken(): string | null {
        if (typeof window === "undefined") return null
        return localStorage.getItem(TOKEN_STORAGE_KEY)
    }

    private getRefreshToken(): string | null {
        if (typeof window === "undefined") return null
        return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    }

    private setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === "undefined") return
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
    }

    private clearTokens(): void {
        if (typeof window === "undefined") return
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retryOn401: boolean = true
    ): Promise<T> {
        const base = this.baseUrl.replace(/\/$/, "")
        const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
        const fullUrl = base.endsWith("/api") && path.startsWith("/api/")
            ? `${base}${path.replace(/^\/api/, "")}`
            : `${base}${path}`

        // Логирование в development режиме
        if (process.env.NODE_ENV === 'development') {
            console.log('[API Request]', options.method || 'GET', fullUrl)
        }

        try {
            const token = this.getToken()
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                ...(options.headers as Record<string, string>),
            }

            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }

            let response = await fetch(fullUrl, {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit',
            })

            // Логирование ответа в development режиме
            if (process.env.NODE_ENV === 'development') {
                console.log('[API Response]', response.status, fullUrl)
            }

            // Обработка 202 Accepted - это не ошибка, но и не успех с данными
            // FastAPI возвращает 202 с текстом, а не JSON
            if (response.status === 202) {
                const text = await response.text()
                console.log(`[DEBUG API] 202 Accepted response from ${fullUrl}:`, text)
                const apiError: any = new Error(text || "Payment is being processed")
                apiError.status = response.status
                apiError.response = { status: response.status, data: { detail: text } }
                throw apiError
            }

            // Обработка 401 - автоматический refresh токена
            if (response.status === 401 && retryOn401) {
                const refreshed = await this.refreshAccessToken()
                if (refreshed) {
                    // Повторяем запрос с новым токеном
                    const newToken = this.getToken()
                    if (newToken) {
                        headers["Authorization"] = `Bearer ${newToken}`
                    }
                    response = await fetch(fullUrl, {
                        ...options,
                        headers,
                        mode: 'cors',
                        credentials: 'omit',
                    })
                } else {
                    // Если refresh не удался, разлогиниваем
                    this.clearTokens()
                    throw new Error("invalid refresh token")
                }
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    detail: `HTTP ${response.status}`
                }))

                // FastAPI возвращает ошибки в формате { "detail": "..." } или { "detail": [] }
                let errorMessage: string

                if (Array.isArray(error.detail)) {
                    // Ошибки валидации Pydantic (422)
                    const firstError = error.detail[0]
                    errorMessage = firstError?.msg || firstError?.message || `Validation error: ${firstError?.loc?.join('.')}`
                } else if (typeof error.detail === 'string') {
                    // Обычная ошибка от сервиса
                    errorMessage = error.detail
                } else {
                    // Fallback
                    errorMessage = error.message || error.detail || `HTTP ${response.status}`
                }

                const translatedMessage = getErrorMessage(errorMessage)
                // Создаем объект ошибки с дополнительной информацией для обработки
                const apiError: any = new Error(translatedMessage)
                apiError.status = response.status
                apiError.response = { status: response.status, data: error }
                throw apiError
            }

            if (response.status === 204) {
                console.log(`[DEBUG API] 204 No Content response from ${fullUrl}`)
                return {} as T
            }

            const jsonData = await response.json()
            console.log(`[DEBUG API] Response from ${fullUrl}:`, jsonData)
            console.log(`[DEBUG API] Response type:`, typeof jsonData, `Keys:`, Object.keys(jsonData || {}))
            return jsonData
        } catch (error) {
            // Обработка сетевых ошибок
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error(`API server unavailable at ${this.baseUrl}`)
            }

            // Пробрасываем ошибку дальше
            throw error
        }
    }

    // Auth endpoints
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH_LOGIN,
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        )
        this.setTokens(response.access_token, response.refresh_token)
        return response
    }

    async register(data: RegisterRequest): Promise<{ message: string; email: string; email_sent: boolean }> {
        // Регистрация возвращает сообщение о верификации, не токены
        // Токены будут получены после верификации email
        return this.request<{ message: string; email: string; email_sent: boolean }>(
            API_CONFIG.ENDPOINTS.AUTH_REGISTER,
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            false // не пытаемся refresh токен при регистрации
        )
    }

    async verifyEmail(data: { email: string; code: string }): Promise<AuthResponse> {
        // После верификации email возвращаются токены
        const response = await this.request<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH_VERIFY_EMAIL,
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            false
        )
        this.setTokens(response.access_token, response.refresh_token)
        return response
    }

    async resendVerification(data: { email: string }): Promise<{ message: string; email_sent: boolean }> {
        return this.request<{ message: string; email_sent: boolean }>(
            API_CONFIG.ENDPOINTS.AUTH_RESEND_VERIFICATION,
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            false
        )
    }

    async refreshAccessToken(): Promise<boolean> {
        try {
            const refreshToken = this.getRefreshToken()
            if (!refreshToken) return false

            const response = await fetch(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH_REFRESH}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                }
            )

            if (!response.ok) {
                // Если refresh не удался, токен истек
                this.clearTokens()
                return false
            }

            const data: AuthResponse = await response.json()
            this.setTokens(data.access_token, data.refresh_token)
            return true
        } catch {
            // При любой ошибке очищаем токены
            this.clearTokens()
            return false
        }
    }

    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken()
        if (refreshToken) {
            try {
                await this.request(API_CONFIG.ENDPOINTS.AUTH_LOGOUT, {
                    method: "POST",
                    body: JSON.stringify({ refresh_token: refreshToken }),
                })
            } catch {
                // Ignore logout errors
            }
        }
        this.clearTokens()
    }

    async telegramLogin(data: {
        id: number
        first_name: string
        last_name?: string | null
        username?: string | null
        photo_url?: string | null
        auth_date: number
        hash: string
    }): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH_TELEGRAM,
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            false // не пытаемся refresh токен при Telegram логине
        )
        this.setTokens(response.access_token, response.refresh_token)
        return response
    }

    // Public endpoints
    async getTariffs(): Promise<Tariff[]> {
        const response = await this.request<{ tariffs: Tariff[]; total: number }>(API_CONFIG.ENDPOINTS.TARIFFS)
        return response.tariffs || []
    }

    // ВАЖНО: Это заглушка - всегда возвращает один узел
    // Не использовать для реальных данных
    async getNodes(): Promise<Node[]> {
        const nodes = await this.request<Node[]>(API_CONFIG.ENDPOINTS.NODES)
        // Защита от null/undefined
        return Array.isArray(nodes) ? nodes : []
    }

    // User endpoints
    // ВАЖНО: /me возвращает только JWT claims, не полный user
    // Для получения полного профиля используйте /profile
    async getMe(): Promise<MeResponse> {
        return this.request<MeResponse>(API_CONFIG.ENDPOINTS.ME || '/me')
    }

    async getProfile(): Promise<ProfileResponse> {
        return this.request<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILE)
    }

    async getProfileKeys(): Promise<VPNKey[]> {
        const keys = await this.request<VPNKey[]>(API_CONFIG.ENDPOINTS.PROFILE_KEYS)
        // Защита от null/undefined
        return Array.isArray(keys) ? keys : []
    }

    async getProfileUsage(clientId?: string): Promise<UsageStats[]> {
        const query = clientId ? `?client_id=${clientId}` : ""
        const data = await this.request<Array<{
            client_id: string
            bytes_up: number
            bytes_down: number
            total_bytes: number
            quota_bytes: number | null
            usage_percent: number | null
            date: string
        }>>(`${API_CONFIG.ENDPOINTS.PROFILE_USAGE}${query}`)
        // Адаптируем формат - возвращаем массив
        return data.map(item => ({
            client_id: item.client_id,
            up: item.bytes_up,
            down: item.bytes_down,
            total: item.total_bytes,
            expires: undefined
        }))
    }

    // ВАЖНО: /me/clients возвращает ClientResponse[] (из таблицы marzban_clients)
    // Это то же самое, что /profile/keys (который возвращает VPNKey[] из marzban_clients)
    async getMeClients(): Promise<VPNKey[]> {
        const response = await this.request<{ clients: VPNKey[]; total: number }>(API_CONFIG.ENDPOINTS.ME_CLIENTS)
        // Защита от null/undefined
        return Array.isArray(response.clients) ? response.clients : []
    }

    async createClient(_data: CreateClientRequest): Promise<CreateClientResponse> {
        // ВАЖНО: Всегда создаем только VLESS ключи
        // Принудительно устанавливаем protocol="vless", даже если передан другой
        const vlessRequest: CreateClientRequest = {
            protocol: "vless",  // СТРОГО VLESS
            transport: "ws",    // WebSocket transport для VLESS
            flow: "",           // Пустой flow
            node_id: null,      // Используем дефолтный узел
            meta: null
        }
        
        // ВАЖНО: client_id и uuid - это РАЗНЫЕ UUID
        // client_id - для revoke
        // uuid - для конфигурации VPN
        return this.request<CreateClientResponse>(API_CONFIG.ENDPOINTS.ME_CLIENTS, {
            method: "POST",
            body: JSON.stringify(vlessRequest),  // Всегда отправляем VLESS
        })
    }

    // ВАЖНО: clientId здесь - это внутренний UUID из MarzbanClient.id (из таблицы marzban_clients)
    // Это id из VPNKey, НЕ marzban_client_id!
    async revokeClient(clientId: string): Promise<void> {
        return this.request(`${API_CONFIG.ENDPOINTS.ME_CLIENTS}/${clientId}/revoke`, {
            method: "POST",
        })
    }

    // ВАЖНО: clientId здесь - это внутренний UUID из MarzbanClient.id
    async getVPNConfig(clientId: string): Promise<{ config: string; subscription_url: string }> {
        const data = await this.request<{ client_id: string; config_text: string; subscription_url: string | null; protocol: string }>(`${API_CONFIG.ENDPOINTS.VPN_CONFIG}/${clientId}`)
        return {
            config: data.config_text || "",
            subscription_url: data.subscription_url || ""
        }
    }

    // Deep link для добавления ключа в приложение
    async getDeepLink(clientId: string, app: VPNAppType = "happ"): Promise<DeepLinkResponse> {
        return this.request<DeepLinkResponse>(`${API_CONFIG.ENDPOINTS.VPN_DEEPLINK}/${clientId}?app=${app}`)
    }

    // Payment endpoints
    async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
        const response = await this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
        })
        // Нормализуем ответ - backend возвращает { payment_id, confirmation_url, status }
        // но может также вернуть { id, payment_url, ... }
        return {
            payment_id: response.payment_id || response.id,
            confirmation_url: response.confirmation_url || response.payment_url,
            status: response.status,
            ...response
        }
    }

    async getPaymentStatus(paymentId: string): Promise<{ payment_id: string; status: string; amount: number; currency: string }> {
        return this.request(`${API_CONFIG.ENDPOINTS.PAYMENTS_STATUS}/${paymentId}`)
    }

    async syncLatestPayment(): Promise<{ status: string; message: string; payment_id?: string }> {
        return this.request(API_CONFIG.ENDPOINTS.PAYMENTS_SYNC_LATEST, {
            method: "POST",
        })
    }

    async getPayment(paymentId: string): Promise<PaymentDetails> {
        return this.request<PaymentDetails>(
            `${API_CONFIG.ENDPOINTS.PAYMENTS_GET}/${paymentId}`
        )
    }

    async renewSubscription(data: RenewRequest): Promise<PaymentResponse> {
        return this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.VPN_RENEW, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async topupSubscription(data: RenewRequest): Promise<PaymentResponse> {
        return this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.VPN_TOPUP, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    // Billing endpoints
    async getBillingState(clientId: string): Promise<BillingState> {
        return this.request<BillingState>(
            `${API_CONFIG.ENDPOINTS.BILLING_STATE}/${clientId}`
        )
    }

    // ВАЖНО: Пагинация не реализована на бэкенде
    // Всегда возвращаются все записи, но параметры можно передать
    async getBillingHistory(page = 1, limit = 20): Promise<BillingHistory> {
        return this.request<BillingHistory>(
            `${API_CONFIG.ENDPOINTS.BILLING_HISTORY}?page=${page}&limit=${limit}`
        )
    }

    // Device endpoints
    async registerDevice(data: DeviceRegisterRequest): Promise<DeviceRegisterResponse> {
        return this.request<DeviceRegisterResponse>(API_CONFIG.ENDPOINTS.DEVICES_REGISTER, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async getDevices(clientId?: string): Promise<DeviceListResponse> {
        const query = clientId ? `?client_id=${clientId}` : ""
        return this.request<DeviceListResponse>(`${API_CONFIG.ENDPOINTS.DEVICES_LIST}${query}`)
    }

    async removeDevice(deviceId: string): Promise<void> {
        return this.request(`${API_CONFIG.ENDPOINTS.DEVICES_REMOVE}/${deviceId}`, {
            method: "DELETE",
        })
    }

    // Key renewal endpoints (public, no auth required)
    async searchKey(data: KeySearchRequest): Promise<KeySearchResponse> {
        return this.request<KeySearchResponse>(API_CONFIG.ENDPOINTS.PAYMENTS_KEY_SEARCH, {
            method: "POST",
            body: JSON.stringify(data),
        }, false) // не требуется авторизация
    }

    async createRenewalPayment(data: CreateRenewalPaymentRequest): Promise<PaymentResponse> {
        return this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS_CREATE_RENEWAL, {
            method: "POST",
            body: JSON.stringify(data),
        }, false) // не требуется авторизация
    }

    async createNewKeyPayment(data: CreateNewKeyPaymentRequest): Promise<PaymentResponse> {
        return this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS_CREATE_NEW_KEY, {
            method: "POST",
            body: JSON.stringify(data),
        }, false) // не требуется авторизация
    }

    async getKeyByPayment(paymentId: string): Promise<{
        client_id: string
        marzban_client_id: string
        subscription_url: string | null
        config_text: string | null
        protocol: string
        expires_at: string | null
        active: boolean
        is_renewal?: boolean
    }> {
        return this.request(`${API_CONFIG.ENDPOINTS.PAYMENTS_KEY_BY_PAYMENT}/${paymentId}`, {
            method: "GET",
        }, false) // не требуется авторизация
    }

    // Node selection API
    async getTopNodes(n: number = 5, region?: string | null): Promise<import("./types").NodeTop[]> {
        const params = new URLSearchParams()
        params.append("n", n.toString())
        if (region) {
            params.append("region", region)
        }
        return this.request(`/api/nodes/top?${params.toString()}`, {
            method: "GET",
        }, false) // публичный endpoint
    }

    async submitClientMetrics(metrics: import("./types").ClientMetricsRequest): Promise<{ status: string; message: string }> {
        return this.request("/api/nodes/metrics", {
            method: "POST",
            body: JSON.stringify(metrics),
        }, false) // публичный endpoint
    }

    async getNodeHealth(nodeId: string): Promise<import("./types").NodeHealth> {
        return this.request(`/api/nodes/${nodeId}/health`, {
            method: "GET",
        }, false) // публичный endpoint
    }
}

export const apiClient = new APIClient(API_CONFIG.BASE_URL)
