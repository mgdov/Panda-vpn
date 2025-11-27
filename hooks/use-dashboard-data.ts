import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'
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

const STATIC_PLANS: DashboardPlan[] = [
    {
        id: '1month',
        name: 'Тариф Бамбук',
        icon: '🌿',
        price: '149',
        period: '1 месяц',
        description: 'Лёгкий, как первый шаг Панды на путь воина.',
        highlighted: false,
    },
    {
        id: '3months',
        name: 'Ученик Боевого Панды',
        icon: '🥋',
        price: '299',
        period: '3 месяца',
        description: 'Популярный тариф — баланс силы и выгоды.',
        discount: '-33%',
        highlighted: true,
    },
    {
        id: '6months',
        name: 'Воин Дракона',
        icon: '🐉',
        price: '549',
        period: '6 месяцев',
        description: 'Выбор тех, кто хочет стабильности.',
        discount: '-38%',
        highlighted: false,
    },
    {
        id: '1year',
        name: 'Легендарный Мастер',
        icon: '👑',
        price: '999',
        period: '12 месяцев',
        description: 'Год абсолютного спокойствия.',
        discount: '-44%',
        highlighted: false,
    },
]

const STATIC_KEYS: DashboardVPNKey[] = [
    {
        id: '1',
        key: 'ss://YWVzLTI1Ni1nY206cGFuZGF2cG4xMjM=@server1.pandavpn.com:8388',
        location: '🇺🇸 США (Нью-Йорк)',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        key: 'ss://YWVzLTI1Ni1nY206cGFuZGF2cG4xMjM=@server2.pandavpn.com:8388',
        location: '🇩🇪 Германия (Франкфурт)',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
]

export function useDashboardData() {
    const [plans, setPlans] = useState<DashboardPlan[]>([])
    const [vpnKeys, setVpnKeys] = useState<DashboardVPNKey[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadData = useCallback(async () => {
        setIsLoading(true)

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
            } else {
                // Тихая загрузка статических данных при ошибке
                setPlans(STATIC_PLANS)
            }

            // Обработка ключей
            if (keysResult.status === 'fulfilled' && keysResult.value) {
                const formattedKeys: DashboardVPNKey[] = keysResult.value.map((key: ApiVPNKey) => ({
                    id: key.id,
                    key: key.config_text || 'Generating...',
                    location: '🌍 Auto-select',
                    status: key.active ? 'active' : 'expired',
                    expiresAt: key.expires_at || null,
                    marzban_client_id: key.marzban_client_id,
                }))
                setVpnKeys(formattedKeys)
            } else {
                // Тихая загрузка статических данных при ошибке
                setVpnKeys(STATIC_KEYS)
            }
        } catch (error) {
            // Резервная загрузка статических данных
            setPlans(STATIC_PLANS)
            setVpnKeys(STATIC_KEYS)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { plans, vpnKeys, isLoading, loadData }
}
