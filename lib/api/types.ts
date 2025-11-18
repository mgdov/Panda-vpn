// API Types
export interface AuthResponse {
    access_token: string
    refresh_token: string
    expires_in: number
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

export interface VPNClient {
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

export interface User {
    id: string
    email?: string
    telegram_id?: number
    roles: string[]
    marzban_username?: string
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
    transport: string
    created_at: string
    expires_at: string
    active: boolean
    subscription_url?: string
    config_text?: string
}

export interface UsageStats {
    client_id: string
    up: number
    down: number
    total: number
    expires: string
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
    user_id: string
    tariff_id: string
    amount: number
    currency: string
    status: string
    created_at: string
    updated_at: string
}

export interface Payment {
    id: string
    status: string
    amount: number
    currency: string
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
        expires_at: string
        last_sync: string
        auto_renew: boolean
        last_payment_id?: string
    }
    events: Array<{
        id: string
        action: string
        amount: number
        currency: string
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

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
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
    flow?: string
    node_id: string
    meta?: Record<string, unknown>
}
