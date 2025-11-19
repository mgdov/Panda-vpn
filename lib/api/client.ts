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
    VPNClient,
    InternalClient,
    MeResponse,
} from "./types"
import { getErrorMessage, isNetworkError } from "./errors"
import { adaptUsageStats, adaptVPNConfig } from "./adapters"

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
        const fullUrl = `${this.baseUrl}${endpoint}`
        
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
                    message: `HTTP ${response.status}` 
                }))
                const errorMessage = getErrorMessage(error.message || `HTTP ${response.status}`)
                throw new Error(errorMessage)
            }

            if (response.status === 204) {
                return {} as T
            }

            return response.json()
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

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH_REGISTER,
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        )
        this.setTokens(response.access_token, response.refresh_token)
        return response
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
        } catch (error) {
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

    // Public endpoints
    async getTariffs(): Promise<Tariff[]> {
        return this.request<Tariff[]>(API_CONFIG.ENDPOINTS.TARIFFS)
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

    async getProfileUsage(clientId?: string): Promise<UsageStats> {
        const query = clientId ? `?client_id=${clientId}` : ""
        const data = await this.request<any>(
            `${API_CONFIG.ENDPOINTS.PROFILE_USAGE}${query}`
        )
        // Адаптируем формат от Marzban
        return adaptUsageStats(data)
    }

    // ВАЖНО: /me/clients возвращает InternalClient[] (из таблицы clients)
    // Это НЕ то же самое, что /profile/keys (который возвращает VPNClient[] из marzban_clients)
    async getMeClients(): Promise<InternalClient[]> {
        const clients = await this.request<InternalClient[]>(API_CONFIG.ENDPOINTS.ME_CLIENTS)
        // Защита от null/undefined
        return Array.isArray(clients) ? clients : []
    }

    async createClient(data: CreateClientRequest): Promise<CreateClientResponse> {
        // ВАЖНО: client_id и uuid - это РАЗНЫЕ UUID
        // client_id - для revoke
        // uuid - для конфигурации VPN
        return this.request<CreateClientResponse>(API_CONFIG.ENDPOINTS.ME_CLIENTS, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    // ВАЖНО: clientId здесь - это внутренний UUID из InternalClient.id (из таблицы clients)
    // НЕ используйте marzban_client_id!
    async revokeClient(clientId: string): Promise<void> {
        return this.request(`${API_CONFIG.ENDPOINTS.ME_CLIENTS}/${clientId}/revoke`, {
            method: "POST",
        })
    }

    // ВАЖНО: clientId здесь - это Marzban ID (marzban_client_id), НЕ внутренний UUID
    // Используйте marzban_client_id из VPNKey или VPNClient
    async getVPNConfig(clientId: string): Promise<{ config: string; subscription_url: string }> {
        const data = await this.request<any>(`${API_CONFIG.ENDPOINTS.VPN_CONFIG}/${clientId}`)
        // Адаптируем формат от Marzban
        return adaptVPNConfig(data)
    }

    // Payment endpoints
    async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
        return this.request<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
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
}

export const apiClient = new APIClient(API_CONFIG.BASE_URL)
