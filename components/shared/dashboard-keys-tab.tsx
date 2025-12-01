"use client"

import { useState } from "react"
import VPNKeyCard, { type VPNKey } from "./vpn-key-card"
import { apiClient } from "@/lib/api/client"

interface DashboardKeysTabProps {
    vpnKeys: VPNKey[]
    copiedKey: string | null
    onCopyKey: (text: string, keyId: string) => void
    onRefresh?: () => void
    errorMessage?: string | null
}

export default function DashboardKeysTab({ vpnKeys, copiedKey, onCopyKey, onRefresh, errorMessage }: DashboardKeysTabProps) {
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateKey = async () => {
        setIsCreating(true)
        try {
            // ВАЖНО: Всегда создаем только VLESS ключи
            // apiClient.createClient() уже принудительно устанавливает protocol="vless"
            await apiClient.createClient({
                protocol: "vless",  // Явно указываем VLESS (на всякий случай)
                transport: "ws",
                flow: "",
                node_id: null,
                meta: null
            })
            // Обновляем список ключей
            if (onRefresh) {
                // Небольшая задержка для обновления на бэкенде
                setTimeout(() => onRefresh(), 1000)
            }
        } catch (error) {
            console.error("Failed to create key:", error)
            const errorMessage = error instanceof Error ? error.message : "Не удалось создать ключ"
            alert(`Ошибка создания ключа: ${errorMessage}`)
        } finally {
            setIsCreating(false)
        }
    }

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm("Вы уверены, что хотите удалить этот ключ? Это действие нельзя отменить.")) {
            return
        }

        try {
            // Используем client_id из ключа (это id из таблицы clients)
            await apiClient.revokeClient(keyId)
            // Обновляем список ключей
            if (onRefresh) {
                setTimeout(() => onRefresh(), 500) // Небольшая задержка для обновления на бэкенде
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
                <button
                    onClick={handleCreateKey}
                    disabled={isCreating}
                    className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-sm group"
                >
                    <span className="inline-flex items-center gap-2">
                        {isCreating ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Создание...
                            </>
                        ) : (
                            <>
                                <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
                                Создать ключ
                            </>
                        )}
                    </span>
                </button>
            </div>

            {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Не удалось загрузить ключи: {errorMessage}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="ml-3 inline-flex items-center rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-100 transition-colors hover:border-red-300/60 hover:text-red-50"
                        >
                            Повторить попытку
                        </button>
                    )}
                </div>
            )}

            {!errorMessage && vpnKeys.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">У вас пока нет VPN ключей</p>
                    <p className="text-sm text-gray-500">Создайте первый ключ, нажав кнопку выше</p>
                </div>
            ) : !errorMessage ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                    {vpnKeys.map((vpnKey) => (
                        <VPNKeyCard
                            key={vpnKey.id}
                            vpnKey={vpnKey}
                            copiedKey={copiedKey}
                            onCopy={onCopyKey}
                            onRevoke={handleRevokeKey}
                        />
                    ))}
                </div>
            ) : null}

            <div className="mt-6 p-4 md:p-5 bg-blue-900/20 border border-blue-500/50 rounded-xl hover:border-blue-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
                <p className="text-sm md:text-base text-blue-400 mb-2.5 font-semibold flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    Как использовать ваш ключ:
                </p>
                <ol className="text-xs md:text-sm text-blue-300 space-y-1.5 ml-6 list-decimal">
                    <li>Скопируйте VLESS ключ нажав на иконку копирования</li>
                    <li>Откройте приложение v2rayN / v2rayNG / Shadowrocket / Clash</li>
                    <li>Добавьте сервер через буфер обмена (автоматически определится VLESS)</li>
                </ol>
            </div>
        </div>
    )
}
