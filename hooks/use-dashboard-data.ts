import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'
import { isAuthError } from '@/lib/api/errors'
import type { Tariff, VPNKey as ApiVPNKey } from '@/lib/api/types'

export type DashboardPlan = {
    id: string
    name: string
    icon: string
    price: string
    period: string
    description: string
    highlighted?: boolean
    discount?: string
}

export type DashboardVPNKey = {
    id: string
    key: string
    location: string
    status: 'active' | 'expired'
    expiresAt: string | null
    marzban_client_id?: string
    protocol?: string
    subscription_url?: string | null
    config_text?: string | null
    preferred_method?: 'subscription' | 'config'
    // Новые поля для ограничения устройств
    device_limit_reached?: boolean
    active_devices_count?: number
    max_devices?: number
    limit_message?: string | null
}

// Демо-ключи для показа в dev/preview или при флаге NEXT_PUBLIC_ENABLE_TEST_VPN_KEY
const TEST_VPN_KEY_ACTIVE: DashboardVPNKey = {
    id: 'test-key-demo-active',
    key: 'vless://11111111-2222-3333-4444-555555555555@demo.pandavpn.test:443?encryption=none&security=tls&type=grpc&serviceName=pandavpn&fp=chrome&sni=demo.pandavpn.test#PandaVPN-Test',
    subscription_url: 'https://example.com/subscription/pandavpn-test',
    config_text: 'vless://11111111-2222-3333-4444-555555555555@demo.pandavpn.test:443?encryption=none&security=tls&type=grpc&serviceName=pandavpn&fp=chrome&sni=demo.pandavpn.test#PandaVPN-Test',
    preferred_method: 'subscription',
    location: 'Тестовый ключ',
    status: 'active',
    expiresAt: null,
    marzban_client_id: 'DEMO1',
    protocol: 'vless',
    device_limit_reached: false,
    active_devices_count: 0,
    max_devices: 1,
    limit_message: 'Демо-ключ для тестирования интерфейса',
}

const TEST_VPN_KEY_EXPIRED: DashboardVPNKey = {
    id: 'test-key-demo-expired',
    key: 'vless://99999999-aaaa-bbbb-cccc-dddddddddddd@demo.pandavpn.test:443?encryption=none&security=tls&type=grpc&serviceName=pandavpn&fp=chrome&sni=demo.pandavpn.test#PandaVPN-Expired',
    subscription_url: 'https://example.com/subscription/pandavpn-test-expired',
    config_text: 'vless://99999999-aaaa-bbbb-cccc-dddddddddddd@demo.pandavpn.test:443?encryption=none&security=tls&type=grpc&serviceName=pandavpn&fp=chrome&sni=demo.pandavpn.test#PandaVPN-Expired',
    preferred_method: 'subscription',
    location: 'Истекший тестовый ключ',
    status: 'expired',
    expiresAt: '2024-01-01T00:00:00Z',
    marzban_client_id: 'DEMO2',
    protocol: 'vless',
    device_limit_reached: false,
    active_devices_count: 0,
    max_devices: 1,
    limit_message: 'Истёкший демо-ключ для тестирования UI',
}

const getIconForDuration = (duration: number): string => {
    const days = Math.floor(duration / 86400)
    if (days <= 31) return '🌿'
    if (days <= 93) return '🥋'
    if (days <= 186) return '🐉'
    return '👑'
}

const getDurationText = (duration: number): string => {
    const days = Math.floor(duration / 86400)
    if (days <= 31) return '1 месяц'
    if (days <= 93) return '3 месяца'
    if (days <= 186) return '6 месяцев'
    return '12 месяцев'
}

const getDiscount = (duration: number): string | undefined => {
    const days = Math.floor(duration / 86400)
    if (days >= 85 && days <= 93) return '-33%'
    if (days >= 175 && days <= 186) return '-38%'
    if (days >= 350) return '-44%'
    return undefined
}

const extractErrorMessage = (error: unknown): string => {
    if (!error) return 'Неизвестная ошибка'
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    try {
        return JSON.stringify(error)
    } catch {
        return 'Неизвестная ошибка'
    }
}


export function useDashboardData() {
    const [plans, setPlans] = useState<DashboardPlan[]>([])
    const [vpnKeys, setVpnKeys] = useState<DashboardVPNKey[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [plansError, setPlansError] = useState<string | null>(null)
    const [keysError, setKeysError] = useState<string | null>(null)

    // Функция для определения статуса ключа
    const determineKeyStatus = (key: any): 'active' | 'expired' => {
        // Если есть дата истечения, проверяем её
        if (key.expires_at) {
            try {
                const expiresDate = new Date(key.expires_at)
                const now = new Date()
                if (expiresDate <= now) {
                    return 'expired'
                }
            } catch (e) {
                console.error('Error parsing expires_at:', e)
            }
        }

        // Если нет даты или дата ещё не наступила, проверяем флаг active
        return key.active ? 'active' : 'expired'
    }


    const loadData = useCallback(async () => {
        // Проверяем наличие токена перед запросами
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (!token) {
            console.warn('[useDashboardData] No access token found, skipping API requests')
            setIsLoading(false)
            setPlansError('Требуется авторизация')
            setKeysError('Требуется авторизация')
            // Редиректим на страницу логина
            if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
                window.location.href = '/auth/login'
            }
            return
        }

        setIsLoading(true)
        setPlansError(null)
        setKeysError(null)

        try {
            const [tariffsResult, keysResult] = await Promise.allSettled([
                apiClient.getTariffs(),
                apiClient.getProfileKeys(),
            ])

            // Обработка тарифов
            if (tariffsResult.status === 'fulfilled' && tariffsResult.value) {
                const formattedPlans: DashboardPlan[] = tariffsResult.value.map((tariff: Tariff) => ({
                    id: tariff.code,
                    name: tariff.name,
                    icon: getIconForDuration(tariff.duration_seconds),
                    price: (tariff.price_amount / 100).toString(),
                    period: getDurationText(tariff.duration_seconds),
                    description: tariff.description || 'Доступ к VPN серверам',
                    highlighted: tariff.code.includes('3') || tariff.code.includes('quarter'),
                    discount: getDiscount(tariff.duration_seconds),
                }))
                setPlans(formattedPlans)
                if (formattedPlans.length === 0) {
                    setPlansError('Сервер вернул пустой список тарифов')
                }
            } else {
                setPlans([])
                if (tariffsResult.status === 'rejected') {
                    setPlansError(extractErrorMessage(tariffsResult.reason))
                } else {
                    setPlansError('Сервер вернул пустой список тарифов')
                }
            }

            // Обработка ключей
            let formattedKeys: DashboardVPNKey[] = []
            if (keysResult.status === 'fulfilled' && keysResult.value) {
                formattedKeys = keysResult.value.map((key: ApiVPNKey) => {
                    const prefersSubscription = key.preferred_method === 'subscription'
                        || (!key.preferred_method && !!key.subscription_url)

                    const displayKey = prefersSubscription
                        ? (key.subscription_url || key.config_text || 'Generating...')
                        : (key.config_text || key.subscription_url || 'Generating...')

                    // Calculate tariff name based on expiration duration
                    let tariffName = 'Тариф'
                    if (key.expires_at && key.created_at) {
                        try {
                            const expiresDate = new Date(key.expires_at)
                            const createdDate = new Date(key.created_at)
                            const durationMs = expiresDate.getTime() - createdDate.getTime()
                            const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24))

                            console.log(`[Tariff Debug] Key: ${key.id}, Created: ${key.created_at}, Expires: ${key.expires_at}, Duration: ${durationDays} days`)

                            if (durationDays >= 350) {
                                tariffName = 'Тариф 1 год'
                            } else if (durationDays >= 175) {
                                tariffName = 'Тариф 6 месяцев'
                            } else if (durationDays >= 85) {
                                tariffName = 'Тариф 3 месяца'
                            } else if (durationDays >= 28) {
                                tariffName = 'Тариф 1 месяц'
                            } else if (durationDays >= 6) {
                                tariffName = 'Тариф 1 неделя'
                            } else if (durationDays > 0) {
                                tariffName = `Тариф ${durationDays} дн.`
                            } else {
                                tariffName = 'Тариф'
                            }
                        } catch (e) {
                            console.error('[Tariff Error]', e, 'Key:', key)
                            tariffName = 'Тариф'
                        }
                    } else {
                        console.warn('[Tariff Warning] Missing dates for key:', key.id, 'created_at:', key.created_at, 'expires_at:', key.expires_at)
                    }

                    return {
                        id: key.id,
                        key: displayKey,
                        subscription_url: key.subscription_url || null,
                        config_text: key.config_text || null,
                        preferred_method: prefersSubscription ? 'subscription' : 'config',
                        location: tariffName,
                        status: determineKeyStatus(key),
                        expiresAt: key.expires_at || null,
                        marzban_client_id: key.marzban_client_id,
                        protocol: key.protocol || 'vless',
                        device_limit_reached: key.device_limit_reached || false,
                        active_devices_count: key.active_devices_count || 0,
                        max_devices: key.max_devices || 1,
                        limit_message: key.limit_message || null,
                    }
                })
            }

            const shouldAttachTestKey = process.env.NEXT_PUBLIC_ENABLE_TEST_VPN_KEY === 'true'
                || process.env.NODE_ENV !== 'production'

            if (shouldAttachTestKey && formattedKeys.length === 0) {
                formattedKeys = [TEST_VPN_KEY_ACTIVE, TEST_VPN_KEY_EXPIRED]
            }

            setVpnKeys(formattedKeys)
        } catch (error) {
            const message = extractErrorMessage(error)
            // Если это ошибка авторизации, очищаем токены и редиректим
            if (isAuthError(error)) {
                localStorage.removeItem('isAuthenticated')
                localStorage.removeItem('userEmail')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/auth/login'
                return
            }
            setPlans([])
            setVpnKeys([])
            setPlansError(message)
            setKeysError(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { plans, vpnKeys, isLoading, loadData, plansError, keysError }
}
