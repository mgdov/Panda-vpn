"use client"

import Link from "next/link"
import VPNKeyCard, { type VPNKey } from "./vpn-key-card"
import HappInstruction from "./happ-instruction"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/hooks/use-auth"
import { generateTelegramLink } from "@/lib/utils/telegram"

interface DashboardKeysTabProps {
    vpnKeys: VPNKey[]
    copiedKey: string | null
    onCopyKey: (text: string, keyId: string) => void
    onRefresh?: () => void
    errorMessage?: string | null
    onGoToPlans?: () => void
}

export default function DashboardKeysTab({ vpnKeys, copiedKey, onCopyKey, onRefresh, errorMessage, onGoToPlans }: DashboardKeysTabProps) {
    const { userEmail } = useAuth()

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm("Вы уверены, что хотите удалить этот ключ? Это действие нельзя отменить.")) {
            return
        }

        try {
            await apiClient.revokeClient(keyId)
            if (onRefresh) {
                setTimeout(() => onRefresh(), 500)
            }
        } catch (error) {
            console.error("Failed to revoke key:", error)
            alert("Не удалось удалить ключ. Попробуйте еще раз.")
        }
    }

    const handleTelegramConnect = () => {
        if (!userEmail) {
            alert("Email не найден. Пожалуйста, войдите в аккаунт.")
            return
        }

        const link = generateTelegramLink(userEmail, 'p_vpnbot')
        window.open(link, '_blank')
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Мои VPN ключи</h2>
                    <p className="text-gray-400 text-xs md:text-sm">Управляйте вашими подключениями VLESS</p>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold flex-1">
                        ✅ Подключите Telegram — пришлем предупреждения об окончании доступа и ключи прямо в бот.
                    </p>
                    <button
                        type="button"
                        onClick={handleTelegramConnect}
                        disabled={!userEmail}
                        className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 px-3 py-2 text-[11px] font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Подключить Telegram
                    </button>
                </div>
            </div>

            {vpnKeys.length === 0 ? (
                <div className="text-center text-[14px] py-12 text-gray-500">
                    <p>У вас пока нет ключей, приобретите их у нас</p>
                    {onGoToPlans && (
                        <button
                            type="button"
                            onClick={onGoToPlans}
                            className="mt-5 inline-flex items-center justify-center rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
                        >
                            Приобрести VPN
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div className="mb-4 rounded-lg border border-yellow-500/60 bg-yellow-900/30 px-4 py-3 text-xs text-yellow-300">
                            Возникла ошибка при загрузке ключей. Отображаем доступные данные.
                        </div>
                    )}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                        {vpnKeys.map((vpnKey) => (
                            <VPNKeyCard
                                key={vpnKey.id}
                                vpnKey={vpnKey}
                                copiedKey={copiedKey}
                                onCopy={onCopyKey}
                                onRevoke={handleRevokeKey}
                                onRefresh={onRefresh}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Инструкция по установке happ */}
            {vpnKeys.length > 0 && (() => {
                // Находим первый subscription URL среди ключей
                const subscriptionKey = vpnKeys.find(key => {
                    const hasSubscriptionUrl = key.subscription_url && (key.subscription_url.startsWith('http://') || key.subscription_url.startsWith('https://'))
                    const hasKeyAsUrl = key.key && (key.key.startsWith('http://') || key.key.startsWith('https://'))
                    return hasSubscriptionUrl || hasKeyAsUrl
                })
                const subscriptionUrl = subscriptionKey?.subscription_url || (subscriptionKey?.key?.startsWith('http') ? subscriptionKey.key : null)
                return subscriptionUrl ? (
                    <HappInstruction subscriptionUrl={subscriptionUrl} />
                ) : null
            })()}
        </div>
    )
}
