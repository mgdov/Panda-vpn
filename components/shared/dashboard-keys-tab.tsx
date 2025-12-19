"use client"

import Link from "next/link"
import VPNKeyCard, { type VPNKey } from "./vpn-key-card"
import { apiClient } from "@/lib/api/client"

interface DashboardKeysTabProps {
    vpnKeys: VPNKey[]
    copiedKey: string | null
    onCopyKey: (text: string, keyId: string) => void
    onRefresh?: () => void
    errorMessage?: string | null
    onGoToPlans?: () => void
}

export default function DashboardKeysTab({ vpnKeys, copiedKey, onCopyKey, onRefresh, errorMessage, onGoToPlans }: DashboardKeysTabProps) {
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
                    <Link
                        href="https://t.me/panda_vpnp_bot"
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 px-3 py-2 text-[11px] font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Подключить Telegram
                    </Link>
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

            <div className="mt-6 p-4 md:p-5 bg-blue-900/20 border border-blue-500/50 rounded-xl hover:border-blue-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
                <p className="text-sm md:text-base text-blue-400 mb-2.5 font-semibold flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    Как использовать вашу подписку:
                </p>
                <ol className="text-xs md:text-sm text-blue-300 space-y-1.5 ml-6 list-decimal">
                    <li>Скопируйте ссылку подписки, нажав на иконку копирования</li>
                    <li>Откройте приложение v2rayN / v2rayNG / Shadowrocket / Clash</li>
                    <li>Добавьте подписку через буфер обмена (VLESS определится автоматически)</li>
                </ol>
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-400 font-semibold mb-1">⚠️ Важно:</p>
                    <p className="text-xs text-yellow-300/80">
                        Каждый ключ можно использовать только на <strong>1 устройстве</strong>. Для подключения нескольких устройств купите дополнительные тарифы.
                    </p>
                </div>
            </div>
        </div>
    )
}
