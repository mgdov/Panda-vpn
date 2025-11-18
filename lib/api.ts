// Centralized API client with auth, refresh, and typed helpers
// Use Next.js API proxy to bypass CORS issues
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy"

export type JwtPair = {
	access_token: string
	refresh_token: string
}

export type AuthUser = {
	id: string
	email: string
	roles: string[]
	telegram_id?: string
	marzban_username?: string
}

export type AuthResponse = JwtPair & {
	user: AuthUser
	expires_in?: number
	refresh_expires_at?: string
	roles?: string[]
}

type ApiError = {
	error: string
	code?: string
}

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_KEY = "auth_user"

export function getAccessToken(): string | null {
	if (typeof window === "undefined") return null
	return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
	if (typeof window === "undefined") return null
	return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuth(auth: AuthResponse) {
	if (typeof window === "undefined") return
	localStorage.setItem(ACCESS_TOKEN_KEY, auth.access_token)
	localStorage.setItem(REFRESH_TOKEN_KEY, auth.refresh_token)
	localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
}

export function clearAuth() {
	if (typeof window === "undefined") return
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): AuthUser | null {
	if (typeof window === "undefined") return null
	const raw = localStorage.getItem(USER_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as AuthUser
	} catch {
		return null
	}
}

/**
 * Transform technical error messages into user-friendly messages
 */
function transformErrorMessage(message: string): string {
	const lowerMessage = message.toLowerCase()
	
	// Database errors
	if (lowerMessage.includes("relation") && lowerMessage.includes("does not exist")) {
		return "Сервис временно недоступен. Пожалуйста, попробуйте позже или свяжитесь с поддержкой."
	}
	if (lowerMessage.includes("no rows in result set") || lowerMessage.includes("no rows found")) {
		return "Тариф не найден. Пожалуйста, выберите другой тариф или свяжитесь с поддержкой."
	}
	if (lowerMessage.includes("database") || lowerMessage.includes("sqlstate")) {
		return "Ошибка базы данных. Пожалуйста, попробуйте позже."
	}
	
	// Network errors
	if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
		return "Проблема с подключением. Проверьте интернет-соединение и попробуйте снова."
	}
	
	// Authentication errors
	if (lowerMessage.includes("unauthorized") || lowerMessage.includes("invalid token")) {
		return "Сессия истекла. Пожалуйста, войдите снова."
	}
	if (lowerMessage.includes("forbidden")) {
		return "Доступ запрещен."
	}
	
	// Validation errors
	if (lowerMessage.includes("validation") || lowerMessage.includes("invalid")) {
		return "Проверьте правильность введенных данных."
	}
	
	// Server errors
	if (lowerMessage.includes("internal server error") || lowerMessage.includes("500")) {
		return "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже."
	}
	
	// Return original message if no transformation needed
	return message
}

async function tryRefreshToken(): Promise<boolean> {
	const refreshToken = getRefreshToken()
	if (!refreshToken) return false
	try {
		const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
		})
		if (!res.ok) return false
		const data = (await res.json()) as AuthResponse
		setAuth(data)
		return true
	} catch {
		return false
	}
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
	{ auth = false }: { auth?: boolean } = {}
): Promise<T> {
	const url = `${API_BASE_URL}${path}`
	const headers = new Headers(options.headers || {})
	headers.set("Content-Type", "application/json")
	if (auth) {
		const token = getAccessToken()
		if (token) headers.set("Authorization", `Bearer ${token}`)
	}
	let res = await fetch(url, {
		...options,
		headers,
	})
	if (res.status === 401 && auth) {
		const refreshed = await tryRefreshToken()
		if (refreshed) {
			const retryHeaders = new Headers(options.headers || {})
			retryHeaders.set("Content-Type", "application/json")
			const token = getAccessToken()
			if (token) retryHeaders.set("Authorization", `Bearer ${token}`)
			res = await fetch(url, { ...options, headers: retryHeaders })
		} else {
			clearAuth()
		}
	}
	if (!res.ok) {
		// Read error response body
		let payload: ApiError | any
		const contentType = res.headers.get("content-type") || ""
		
		if (contentType.includes("application/json")) {
			try {
				payload = (await res.json()) as ApiError
			} catch {
				// If JSON parsing fails, try text
				try {
					const text = await res.text()
					payload = text ? { error: text, message: text } : undefined
				} catch {
					payload = undefined
				}
			}
		} else {
			try {
				const text = await res.text()
				payload = text ? { error: text, message: text } : undefined
			} catch {
				payload = undefined
			}
		}
		
		// Try different error message fields
		let message = payload?.error || payload?.message || `Request failed with ${res.status}`
		
		// Transform technical errors into user-friendly messages
		message = transformErrorMessage(message)
		
		const error = new Error(message)
		;(error as any).status = res.status
		;(error as any).payload = payload
		throw error
	}
	
	// Read successful response
	return (await res.json()) as T
}

// Auth API
export async function register(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/register", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
}

export async function refresh(): Promise<AuthResponse> {
	const refreshToken = getRefreshToken()
	if (!refreshToken) throw new Error("No refresh token available")
	return apiFetch<AuthResponse>("/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refresh_token: refreshToken }),
	})
}

export async function logout(): Promise<void> {
	const refreshToken = getRefreshToken()
	if (refreshToken) {
		try {
			await apiFetch("/auth/logout", {
				method: "POST",
				body: JSON.stringify({ refresh_token: refreshToken }),
			})
		} catch {
			// Ignore errors on logout
		}
	}
	clearAuth()
}

export type TelegramAuthData = {
	id: number
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
	auth_date: number
	hash: string
}

export async function telegramAuth(data: TelegramAuthData): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/auth/telegram", {
		method: "POST",
		body: JSON.stringify(data),
	})
}

// Profile
export type MarzbanClient = {
	id: string
	user_id: string
	marzban_client_id: string
	protocol: string
	transport: string
	created_at: string
	expires_at: string
	active: boolean
	subscription_url?: string
	config_text?: string
}

export type ProfileResponse = {
	user: AuthUser
	stats: { clients_total: number }
	clients: MarzbanClient[]
}

export async function getProfile(): Promise<ProfileResponse> {
	return apiFetch<ProfileResponse>("/profile", { method: "GET" }, { auth: true })
}

export async function getKeys(): Promise<MarzbanClient[]> {
	return apiFetch<MarzbanClient[]>("/profile/keys", { method: "GET" }, { auth: true })
}

export type UsageResponse = {
	client_id: string
	traffic: { up: number; down: number; total: number }
	expires: number
}

export async function getUsage(clientId: string): Promise<UsageResponse> {
	const search = new URLSearchParams({ client_id: clientId }).toString()
	return apiFetch<UsageResponse>(`/profile/usage?${search}`, { method: "GET" }, { auth: true })
}

export type VpnConfigResponse = {
	client_id: string
	config: string
	expires_at: string
	protocol: string
	username: string
	created_at: string
}

export async function getVpnConfig(clientId: string): Promise<VpnConfigResponse> {
	return apiFetch<VpnConfigResponse>(`/vpn/config/${clientId}`, { method: "GET" }, { auth: true })
}

// Public endpoints
export type Node = {
	id: string
	name: string
	status: string
}

export async function getNodes(): Promise<Node[]> {
	return apiFetch<Node[]>("/nodes", { method: "GET" })
}

export type Tariff = {
	id?: string
	code: string
	name: string
	price: number
	currency: string
	duration_days?: number
	description?: string
}

export async function getTariffs(): Promise<Tariff[]> {
	return apiFetch<Tariff[]>("/tariffs", { method: "GET" })
}

export async function getPublicConfig(clientId: string): Promise<VpnConfigResponse> {
	return apiFetch<VpnConfigResponse>(`/configs/${clientId}`, { method: "GET" })
}

// User endpoints
export async function getMe(): Promise<AuthUser> {
	return apiFetch<AuthUser>("/me", { method: "GET" }, { auth: true })
}

export async function getMyClients(): Promise<MarzbanClient[]> {
	return apiFetch<MarzbanClient[]>("/me/clients", { method: "GET" }, { auth: true })
}

export type CreateClientRequest = {
	protocol: "vless" | "vmess" | "trojan"
	transport: "tcp" | "ws" | "grpc"
	flow?: string
	node_id?: string
}

export async function createClient(data: CreateClientRequest): Promise<MarzbanClient> {
	return apiFetch<MarzbanClient>("/me/clients", {
		method: "POST",
		body: JSON.stringify(data),
	}, { auth: true })
}

export async function revokeClient(clientId: string): Promise<void> {
	return apiFetch<void>(`/me/clients/${clientId}/revoke`, {
		method: "POST",
	}, { auth: true })
}

// Payments
export type PaymentCreateResponse = {
	invoice_id: string
	payment_id: string
	provider_payment_id: string
	payment_url: string
	status: "pending" | "paid" | "failed"
}

export async function createPayment(tariff_code: string, payment_method: string, return_url: string) {
	return apiFetch<PaymentCreateResponse>(
		"/payments/create",
		{
			method: "POST",
			body: JSON.stringify({ tariff_code, payment_method, return_url }),
		},
		{ auth: true }
	)
}

export type Payment = {
	id: string
	user_id: string
	tariff_id: string
	amount: number
	currency: string
	status: "pending" | "paid" | "failed"
	created_at: string
	updated_at: string
}

export async function getPayment(paymentId: string): Promise<Payment> {
	return apiFetch<Payment>(`/payments/${paymentId}`, { method: "GET" }, { auth: true })
}

// Billing
export type BillingState = {
	client_id: string
	active: boolean
	expires_at?: string
	balance?: number
	traffic_used?: { up: number; down: number; total: number }
}

export async function getBillingState(clientId: string): Promise<BillingState> {
	return apiFetch<BillingState>(`/billing/state/${clientId}`, { method: "GET" }, { auth: true })
}

export type BillingHistoryItem = {
	id: string
	amount: number
	currency: string
	status: string
	created_at: string
	tariff_code?: string
}

export type BillingHistoryResponse = {
	items: BillingHistoryItem[]
	total: number
	page: number
	limit: number
}

export async function getBillingHistory(page = 1, limit = 20): Promise<BillingHistoryResponse> {
	const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
	return apiFetch<BillingHistoryResponse>(`/billing/history?${params}`, { method: "GET" }, { auth: true })
}

// VPN operations
export type RenewVpnRequest = {
	client_id: string
	duration?: string
}

export async function renewVpn(data: RenewVpnRequest): Promise<PaymentCreateResponse> {
	return apiFetch<PaymentCreateResponse>(
		"/vpn/renew",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
		{ auth: true }
	)
}

export type TopupVpnRequest = {
	client_id: string
	amount: number
}

export async function topupVpn(data: TopupVpnRequest): Promise<PaymentCreateResponse> {
	return apiFetch<PaymentCreateResponse>(
		"/vpn/topup",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
		{ auth: true }
	)
}


