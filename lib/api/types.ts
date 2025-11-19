// API Types
export interface AuthResponse {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_at: string
    user: User
    roles: string[]
}

export interface Tariff {
    id: string
    code: string
    name: string
    description?: string
    price_amount: number
    currency: string
    duration_seconds: number
    created_at: string
    updated_at: string
}

export interface Node {
    id: string
    name: string
    status: string
    location?: string
    host?: string
    port?: number
}

// MarzbanClient - клиенты из таблицы marzban_clients (используется в /profile/keys)
export interface VPNClient {
    id: string
    user_id: string
    marzban_client_id: string
    protocol: string
    transport: string | null
    created_at: string
    expires_at: string | null
    active: boolean
    subscription_url: string | null
    config_text: string | null
}

// InternalClient - клиенты из таблицы clients (используется в /me/clients)
export interface InternalClient {
    id: string
    uuid_key: string
    protocol: string
    transport: string
    flow: string | null
    status: string
    expires_at: string | null
}

export interface User {
    id: string
    email: string | null
    telegram_id: number | null
    roles: string[]
    marzban_username: string | null
    marzban_id: string | null
    is_active: boolean
    is_admin: boolean
    referral_code: string | null
    referred_by: string | null
    created_at: string
    updated_at: string
}

export interface ProfileResponse {
    user: User
    stats: {
        clients_total: number
    }
    clients: VPNClient[]
}

export interface VPNKey {
    id: string
    user_id: string
    marzban_client_id: string
    protocol: string
    transport: string | null
    created_at: string
    expires_at: string | null
    active: boolean
    subscription_url: string | null
    config_text: string | null
}

// UsageStats - формат может отличаться в зависимости от Marzban API
export interface UsageStats {
    client_id?: string
    up: number
    down: number
    total: number
    expires?: string
}

export interface PaymentResponse {
    invoice_id: string
    payment_id: string
    provider_payment_id: string
    payment_url: string
    status: string
}

export interface Invoice {
    id: string
    user_id: string | null
    tariff_id: string | null
    amount: number
    currency: string
    status: string
    external_id: string | null
    metadata: Record<string, unknown>
    created_at: string
    updated_at: string
}

export interface Payment {
    id: string
    invoice_id: string
    provider: string
    provider_payment_id: string
    amount: number
    currency: string
    status: string
    raw_payload: Record<string, unknown>
    created_at: string
    updated_at: string
}

export interface PaymentDetails {
    invoice: Invoice
    payments: Payment[]
}

export interface BillingState {
    state: {
        client_id: string
        user_id: string
        status: string
        expires_at: string | null
        last_sync: string | null
        auto_renew: boolean
        last_payment_id: string | null
        created_at: string
        updated_at: string
    }
    events: Array<{
        id: string
        payment_id: string
        event_type: string
        reason: string | null
        raw_payload: Record<string, unknown>
        created_at: string
    }>
}

export interface BillingHistory {
    page: number
    limit: number
    items: Array<{
        id: string
        payment_id: string
        event_type: string
        status: string
        received_at: string
    }>
}

// MeResponse - ответ от /me endpoint (только JWT claims, не полный user)
export interface MeResponse {
    uid: string
    user_id: string // Дубликат uid
    roles: string[]
    exp: number // Unix timestamp (секунды)
    iat: number // Unix timestamp (секунды)
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    referral?: string
}

export interface CreatePaymentRequest {
    tariff_code: string
    payment_method?: string
    return_url?: string
}

export interface RenewRequest {
    tariff_code: string
    client_id: string
    return_url?: string
}

export interface CreateClientRequest {
    protocol: string
    transport: string
    flow: string
    node_id?: string | null
    meta?: Record<string, unknown> | null
}

// CreateClientResponse - ответ от POST /me/clients
export interface CreateClientResponse {
    client_id: string // UUID из таблицы clients (для revoke)
    uuid: string // UUID ключ для VPN конфигурации (другой UUID!)
}
