// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://vpn-p.ru",
  ENDPOINTS: {
    // Auth
    AUTH_TELEGRAM: "/api/auth/telegram",
    AUTH_REGISTER: "/api/auth/register",
    AUTH_LOGIN: "/api/auth/login",
    AUTH_REFRESH: "/api/auth/refresh",
    AUTH_LOGOUT: "/api/auth/logout",
    AUTH_VERIFY_EMAIL: "/api/auth/verify-email",
    AUTH_RESEND_VERIFICATION: "/api/auth/resend-verification",

    // Public
    TARIFFS: "/api/tariffs",
    NODES: "/api/nodes",

    // User
    ME: "/api/auth/me",
    ME_CLIENTS: "/api/me/clients",
    PROFILE: "/api/profile",
    PROFILE_KEYS: "/api/profile/keys",
    PROFILE_USAGE: "/api/profile/usage",
    
    // Devices
    DEVICES_REGISTER: "/api/devices/auto-register",
    DEVICES_LIST: "/api/devices/list",
    DEVICES_REMOVE: "/api/devices",

    // VPN
    VPN_CONFIG: "/api/me/vpn/config",
    VPN_RENEW: "/api/vpn/renew",
    VPN_TOPUP: "/api/vpn/topup",

    // Payments
    PAYMENTS_CREATE: "/api/payments/create",
    PAYMENTS_GET: "/api/payments",
    PAYMENTS_STATUS: "/api/payments/status",
    PAYMENTS_WEBHOOK: "/api/payments/webhook",

    // Billing
    BILLING_STATE: "/api/billing/state",
    BILLING_HISTORY: "/api/billing/history",

    // Admin
    ADMIN_USERS: "/api/admin/users",
    ADMIN_CLIENTS: "/api/admin/clients",
    ADMIN_NODES: "/api/admin/nodes",
    ADMIN_PAYMENTS: "/api/admin/payments",
    ADMIN_TARIFFS: "/api/admin/tariffs/list",
    ADMIN_PROMOS: "/api/admin/promos",
    ADMIN_REFERRALS: "/api/admin/referral",
    ADMIN_MAIL_QUEUE: "/api/admin/mail/queue",
    ADMIN_MAIL_SEND: "/api/admin/mail/send",
    ADMIN_BACKUPS: "/api/admin/backups",
    ADMIN_STATS: "/api/admin/stats",
    ADMIN_AUDIT: "/api/admin/audit",
  },
} as const

export const TOKEN_STORAGE_KEY = "vpn_access_token"
export const REFRESH_TOKEN_STORAGE_KEY = "vpn_refresh_token"
