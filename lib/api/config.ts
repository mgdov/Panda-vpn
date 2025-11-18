// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://103.74.92.81:8000",
  ENDPOINTS: {
    // Auth
    AUTH_TELEGRAM: "/auth/telegram",
    AUTH_REGISTER: "/auth/register",
    AUTH_LOGIN: "/auth/login",
    AUTH_REFRESH: "/auth/refresh",
    AUTH_LOGOUT: "/auth/logout",

    // Public
    TARIFFS: "/tariffs",
    NODES: "/nodes",

    // User
    ME: "/me",
    ME_CLIENTS: "/me/clients",
    PROFILE: "/profile",
    PROFILE_KEYS: "/profile/keys",
    PROFILE_USAGE: "/profile/usage",

    // VPN
    VPN_CONFIG: "/vpn/config",
    VPN_RENEW: "/vpn/renew",
    VPN_TOPUP: "/vpn/topup",

    // Payments
    PAYMENTS_CREATE: "/payments/create",
    PAYMENTS_GET: "/payments",
    PAYMENTS_WEBHOOK: "/payments/webhook",

    // Billing
    BILLING_STATE: "/billing/state",
    BILLING_HISTORY: "/billing/history",

    // Admin
    ADMIN_USERS: "/admin/users",
    ADMIN_CLIENTS: "/admin/clients",
    ADMIN_NODES: "/admin/nodes",
    ADMIN_PAYMENTS: "/admin/payments",
    ADMIN_TARIFFS: "/admin/tariffs/list",
    ADMIN_PROMOS: "/admin/promos",
    ADMIN_REFERRALS: "/admin/referral",
    ADMIN_MAIL_QUEUE: "/admin/mail/queue",
    ADMIN_MAIL_SEND: "/admin/mail/send",
    ADMIN_BACKUPS: "/admin/backups",
    ADMIN_STATS: "/admin/stats",
    ADMIN_AUDIT: "/admin/audit",
  },
} as const

export const TOKEN_STORAGE_KEY = "vpn_access_token"
export const REFRESH_TOKEN_STORAGE_KEY = "vpn_refresh_token"
