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
    // Новые поля для ограничения устройств
    device_limit_reached?: boolean
    active_devices_count?: number
    max_devices?: number
    limit_message?: string | null
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

    const loadData = useCallback(async () => {
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
            if (keysResult.status === 'fulfilled' && keysResult.value) {
<<<<<<< HEAD
<<<<<<< HEAD
                const formattedKeys: DashboardVPNKey[] = keysResult.value.map((key: ApiVPNKey) => ({
                    id: key.id,
                    key: key.subscription_url || key.config_text || 'Generating...',
                    location: '🌍 Auto-select',
                    status: key.active ? 'active' : 'expired',
                    expiresAt: key.expires_at || null,
                    marzban_client_id: key.marzban_client_id,
                    protocol: key.protocol || 'vless',
                    // Новые поля для ограничения устройств
                    device_limit_reached: key.device_limit_reached || false,
                    active_devices_count: key.active_devices_count || 0,
                    max_devices: key.max_devices || 1,
                    limit_message: key.limit_message || null,
                }))

                // Тестовый ключ для дев-среды (добавляем к реальным)
                if (process.env.NODE_ENV === 'development') {
                    formattedKeys.push({
                        id: 'test-subscription-key',
                        key: 'https://example.com/vless-subscription/test-key',
                        location: '🌍 Auto-select',
=======
=======
>>>>>>> aea01da (обновление по правкам Мухаммада)
                const formattedKeys: DashboardVPNKey[] = keysResult.value.map((key: ApiVPNKey) => {
                    // Определяем ключ для отображения: приоритет subscription_url > config_text
                    const displayKey = key.preferred_method === 'subscription' 
                        ? (key.subscription_url || key.config_text || 'Generating...')
                        : (key.config_text || key.subscription_url || 'Generating...')
                    
                    return {
                        id: key.id,
                        key: displayKey,
                        subscription_url: key.subscription_url || null,
                        config_text: key.config_text || null,
                        preferred_method: key.preferred_method || (key.subscription_url ? 'subscription' : 'config'),
                        location: '🌍 Auto-select',
                        status: key.active ? 'active' : 'expired',
                        expiresAt: key.expires_at || null,
                        marzban_client_id: key.marzban_client_id,
                        protocol: key.protocol || 'vless',
                        // Новые поля для ограничения устройств
                        device_limit_reached: key.device_limit_reached || false,
                        active_devices_count: key.active_devices_count || 0,
                        max_devices: key.max_devices || 1,
                        limit_message: key.limit_message || null,
                    }
                })
=======
                const formattedKeys: DashboardVPNKey[] = keysResult.value.map((key: ApiVPNKey) => ({
                    id: key.id,
                    key: key.subscription_url || key.config_text || 'Generating...',
                    location: '🌍 Auto-select',
                    status: key.active ? 'active' : 'expired',
                    expiresAt: key.expires_at || null,
                    marzban_client_id: key.marzban_client_id,
                    protocol: key.protocol || 'vless',
                    // Новые поля для ограничения устройств
                    device_limit_reached: key.device_limit_reached || false,
                    active_devices_count: key.active_devices_count || 0,
                    max_devices: key.max_devices || 1,
                    limit_message: key.limit_message || null,
                }))

                // Тестовый ключ для дев-среды (добавляем к реальным)
                if (process.env.NODE_ENV === 'development') {
                    formattedKeys.push({
                        id: 'test-subscription-key',
                        key: 'https://example.com/vless-subscription/test-key',
                        location: '🌍 Auto-select',
>>>>>>> e76d21b (Изменение правки Мухаммада)
                        status: 'active',
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        marzban_client_id: 'test-marzban-client-id',
                        protocol: 'vless',
                        device_limit_reached: false,
                        active_devices_count: 0,
                        max_devices: 1,
                        limit_message: null,
                    })
                }
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> e76d21b (Изменение правки Мухаммада)
=======
>>>>>>> 0ddcdb9 (обновление по правкам Мухаммада)
>>>>>>> aea01da (обновление по правкам Мухаммада)
                setVpnKeys(formattedKeys)
            } else {
                const fallbackKeys: DashboardVPNKey[] = []

                // Если API ключей упало — всё равно показываем тестовый ключ в dev
                if (process.env.NODE_ENV === 'development') {
                    fallbackKeys.push({
                        id: 'test-subscription-key',
                        key: 'https://example.com/vless-subscription/test-key',
                        location: '🌍 Auto-select',
                        status: 'active',
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        marzban_client_id: 'test-marzban-client-id',
                        protocol: 'vless',
                        device_limit_reached: false,
                        active_devices_count: 0,
                        max_devices: 1,
                        limit_message: null,
                    })
                }

                setVpnKeys(fallbackKeys)
                if (keysResult.status === 'rejected') {
                    const error = keysResult.reason
                    // Если это ошибка авторизации, очищаем токены и редиректим
                    if (isAuthError(error)) {
                        localStorage.removeItem('isAuthenticated')
                        localStorage.removeItem('userEmail')
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken')
                        window.location.href = '/auth/login'
                        return
                    }
                    setKeysError(extractErrorMessage(error))
                } else {
                    setKeysError('Сервер вернул пустой список ключей')
                }
            }
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
