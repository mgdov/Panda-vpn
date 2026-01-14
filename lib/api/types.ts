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

// Node selection types
export interface NodeTop {
    node_id: string
    name: string
    domain?: string | null
    ip?: string | null
    port?: number | null
    region?: string | null
    avg_latency_ms?: number | null
    p50_latency_ms?: number | null
    p95_latency_ms?: number | null
    load_factor: number
    active_connections: number
    capacity: number
    health: string
    score?: number | null
    last_checked?: string | null
}

export interface ClientMetricsRequest {
    node_id: string
    measured_latency_ms: number
    success: boolean
    error_message?: string | null
    client_id?: string | null
}

export interface NodeHealth {
    node_id: string
    name: string
    health_status: string
    avg_latency_ms?: number | null
    p50_latency_ms?: number | null
    p95_latency_ms?: number | null
    load_factor: number
    active_connections: number
    capacity: number
    consecutive_failures: number
    last_success?: string | null
    last_failure?: string | null
    checked_at?: string | null
    score?: number | null
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

// InternalClient удален - используем VPNKey для всех клиентов
// Backend возвращает ClientResponse из marzban_clients, который соответствует VPNKey

export interface User {
    id: string
    email: string | null
    telegram_id: number | null
    roles: string[]
    marzban_username: string | null
    marzban_id?: string | null // Опционально, может отсутствовать в UserResponse
    is_active: boolean
    is_admin: boolean
    email_verified: boolean // Добавлено из UserResponse
    referral_code: string
    referred_by?: string | null // Опционально
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
    preferred_method?: 'subscription' | 'config'  // Какой способ использовать (subscription_url или config_text)
    quota_bytes?: number | null // Опционально, может быть в ClientResponse
    used_bytes?: number // Опционально, может быть в ClientResponse
    updated_at?: string // Опционально, может быть в ClientResponse
    // Новые поля для ограничения устройств
    device_limit_reached?: boolean // Достигнут лимит устройств для этого ключа
    active_devices_count?: number // Количество активных устройств для этого ключа
    max_devices?: number // Максимальное количество устройств (обычно 1)
    limit_message?: string | null // Сообщение об ошибке если превышен лимит
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
    payment_id?: string
    id?: string // Backend возвращает id
    invoice_id?: string
    provider?: string
    confirmation_url?: string
    payment_url?: string // Backend может вернуть payment_url
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

export interface RegisterResponse {
    message: string
    email: string
    email_sent: boolean
}

export interface VerifyEmailRequest {
    email: string
    code: string
}

export interface ResendVerificationRequest {
    email: string
}

export interface CreatePaymentRequest {
    tariff_id: string
    return_url?: string
    amount?: number  // Опционально, если нужно передать сумму напрямую
}

export interface KeySearchRequest {
    key_identifier: string
}

export interface KeySearchResponse {
    found: boolean
    client_id?: string
    marzban_client_id?: string
    expires_at?: string | null
    active?: boolean
    protocol?: string
    message?: string
}

export interface CreateRenewalPaymentRequest {
    client_id: string
    tariff_id: string
    return_url?: string
}

export interface CreateNewKeyPaymentRequest {
    tariff_id: string
    return_url?: string
}

export interface DeepLinkResponse {
    deeplink: string
    fallback_url?: string | null
    app_name: string
    description: string
}

export type VPNAppType = "happ" | "v2rayng" | "shadowrocket" | "singbox" | "v2box" | "streisand" | "direct"

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

// Device registration
export interface DeviceRegisterRequest {
    client_id: string
    device_name?: string
    config_text: string
}

export interface DeviceRegisterResponse {
    success: boolean
    message: string
    device_id?: string
    active_devices_count: number
    max_devices: number
}

export interface DeviceInfo {
    id: string
    device_name: string | null
    last_activity_at: string
    bytes_sent: number
    bytes_received: number
    is_active: boolean
}

export interface DeviceListResponse {
    devices: DeviceInfo[]
    active_count: number
    max_devices: number
}
