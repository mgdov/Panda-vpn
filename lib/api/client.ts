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
    VPNClient,
} from "./types"

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
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const token = this.getToken()
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                ...(options.headers as Record<string, string>),
            }

            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            }

            const url = `${this.baseUrl}${endpoint}`

            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit',
            })

            if (response.status === 401) {
                // Try to refresh token
                const refreshed = await this.refreshAccessToken()
                if (refreshed) {
                    // Retry request with new token
                    return this.request<T>(endpoint, options)
                }
                // If refresh failed, clear tokens and throw
                this.clearTokens()
                throw new Error("Authentication failed")
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: "Unknown error" }))
                throw new Error(error.message || `HTTP ${response.status}`)
            }

            if (response.status === 204) {
                return {} as T
            }

            return response.json()
        } catch (error) {
            // Silently handle expected connection errors
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error(`API server unavailable at ${this.baseUrl}`)
            }
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

            if (!response.ok) return false

            const data: AuthResponse = await response.json()
            this.setTokens(data.access_token, data.refresh_token)
            return true
        } catch {
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

    async getNodes(): Promise<Node[]> {
        return this.request<Node[]>(API_CONFIG.ENDPOINTS.NODES)
    }

    // User endpoints
    async getProfile(): Promise<ProfileResponse> {
        return this.request<ProfileResponse>(API_CONFIG.ENDPOINTS.PROFILE)
    }

    async getProfileKeys(): Promise<VPNKey[]> {
        return this.request<VPNKey[]>(API_CONFIG.ENDPOINTS.PROFILE_KEYS)
    }

    async getProfileUsage(clientId?: string): Promise<UsageStats> {
        const query = clientId ? `?client_id=${clientId}` : ""
        return this.request<UsageStats>(
            `${API_CONFIG.ENDPOINTS.PROFILE_USAGE}${query}`
        )
    }

    async getMeClients(): Promise<VPNClient[]> {
        return this.request<VPNClient[]>(API_CONFIG.ENDPOINTS.ME_CLIENTS)
    }

    async createClient(data: CreateClientRequest): Promise<{ client_id: string; uuid: string }> {
        return this.request(API_CONFIG.ENDPOINTS.ME_CLIENTS, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async revokeClient(clientId: string): Promise<void> {
        return this.request(`${API_CONFIG.ENDPOINTS.ME_CLIENTS}/${clientId}/revoke`, {
            method: "POST",
        })
    }

    async getVPNConfig(clientId: string): Promise<{ config: string; subscription_url: string }> {
        return this.request(`${API_CONFIG.ENDPOINTS.VPN_CONFIG}/${clientId}`)
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

    async getBillingHistory(page = 1, limit = 20): Promise<BillingHistory> {
        return this.request<BillingHistory>(
            `${API_CONFIG.ENDPOINTS.BILLING_HISTORY}?page=${page}&limit=${limit}`
        )
    }
}

export const apiClient = new APIClient(API_CONFIG.BASE_URL)
