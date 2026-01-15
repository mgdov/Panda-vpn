import { Copy, Check, ChevronDown, ChevronUp, Smartphone } from "lucide-react"
import { memo, useState } from "react"
import KeyDevicesList from "./key-devices-list"
import AppSelectorModal from "./app-selector-modal"
import { apiClient } from "@/lib/api/client"
import type { VPNAppType } from "@/lib/api/types"

export interface VPNKey {
    id: string
    key: string
    location: string
    status: 'active' | 'expired'
    expiresAt: string | null
    protocol?: string
    subscription_url?: string | null  // Subscription URL (приоритетный способ)
    config_text?: string | null  // Config text (fallback)
    preferred_method?: 'subscription' | 'config'  // Какой способ использовать
    // Новые поля для ограничения устройств
    device_limit_reached?: boolean
    active_devices_count?: number
    max_devices?: number
    limit_message?: string | null
}

interface VPNKeyCardProps {
    vpnKey: VPNKey
    copiedKey: string | null
    onCopy: (text: string, keyId: string) => void
    onRevoke?: (keyId: string) => void
    onRefresh?: () => void // Callback для обновления данных после изменений
}

const VPNKeyCard = memo(function VPNKeyCard({ vpnKey, copiedKey, onCopy, onRevoke, onRefresh }: VPNKeyCardProps) {
    const [showDevices, setShowDevices] = useState(false)
    const [showAppSelector, setShowAppSelector] = useState(false)
    const [isAddingToApp, setIsAddingToApp] = useState(false)
    const [showOtherDevices, setShowOtherDevices] = useState(false)

    const formatExpiresAt = (expiresAt: string | null) => {
        if (!expiresAt) return 'Без ограничений'
        try {
            const date = new Date(expiresAt)
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return expiresAt
        }
    }

    const getProtocolName = (protocol?: string) => {
        if (!protocol) return 'VPN'
        return protocol.toUpperCase()
    }

    // Определяем тип ключа: subscription URL или vless конфиг
    const isSubscription = vpnKey.key?.startsWith('http://') || vpnKey.key?.startsWith('https://')
    const isVLESS = vpnKey.key?.startsWith('vless://') || (!isSubscription && vpnKey.protocol === 'vless')
    const keyText = vpnKey.key || 'Генерация ключа...'

    // Функция для добавления ключа в приложение
    const handleAddToApp = async (app: VPNAppType) => {
        setIsAddingToApp(true)
        try {
            // Получаем deep link для выбранного приложения
            const deepLinkData = await apiClient.getDeepLink(vpnKey.id, app)

            // ВАРИАНТ 1: Открываем в новой вкладке (для промежуточной страницы)
            // Это позволяет пользователю легко вернуться на сайт
            const newWindow = window.open(deepLinkData.deeplink, '_blank')

            // Проверяем открылась ли новая вкладка
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                // Popup blocker заблокировал - пробуем открыть в текущей вкладке
                console.log('Popup blocked, opening in current tab')
                window.location.href = deepLinkData.deeplink
            } else {
                console.log('Opened in new tab successfully')
            }

        } catch (error) {
            console.error('Failed to generate deep link:', error)
            alert('Не удалось создать ссылку для добавления в приложение. Попробуйте скопировать ключ вручную.')
        } finally {
            setIsAddingToApp(false)
        }
    }

    return (
        <div className="p-4 md:p-5 bg-linear-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-600/20 hover:scale-[1.02] hover:-translate-y-0.5 flex flex-col gap-3 group">
            {/* Заголовок с названием ключа */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg">🔐</span>
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-white">
                            Название ключа: {vpnKey.location}
                        </h3>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vpnKey.status === 'active'
                    ? 'bg-green-900/40 border border-green-500/50 text-green-400 animate-pulse-glow'
                    : 'bg-red-900/40 border border-red-500/50 text-red-400'
                    }`}>
                    {vpnKey.status === 'active' ? 'Активен' : 'Истек'}
                </span>
            </div>

            {/* Дата истечения */}
            <div className="p-2.5 bg-slate-800/50 border border-slate-600/50 rounded-lg">
                <p className="text-xs text-gray-300 flex items-center gap-2">
                    <span>⏰</span>
                    <span className="font-medium">Истекает:</span>
                    <span className="text-white font-semibold">{formatExpiresAt(vpnKey.expiresAt)}</span>
                </p>
            </div>

            {/* Информация об активных устройствах (показывается только если есть активные устройства) */}
            {vpnKey.active_devices_count !== undefined && vpnKey.active_devices_count > 0 && (
                <div className="p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                    <p className="text-xs text-blue-400 font-medium">
                        ✅ Ключ активирован на устройстве
                    </p>
                    <p className="text-xs text-blue-300/70 mt-1">
                        Активных устройств: {vpnKey.active_devices_count} / {vpnKey.max_devices || 1}
                    </p>
                </div>
            )}

            <div className="p-3 bg-black/60 rounded-lg border border-green-700/20 hover:border-green-600/40 transition-colors duration-300">
                <div className="flex items-center justify-between gap-2">
                    <code className="text-xs text-gray-400 break-all flex-1 font-mono">
                        {keyText}
                    </code>
                    {keyText !== 'Генерация ключа...' && !vpnKey.device_limit_reached && (
                        <button
                            onClick={() => onCopy(keyText, vpnKey.id)}
                            className="shrink-0 p-2 hover:bg-green-600/30 rounded-lg transition-all duration-300 hover:scale-110 group/btn"
                            title="Копировать ключ"
                        >
                            {copiedKey === vpnKey.id ? (
                                <Check size={16} className="text-green-400 animate-in" />
                            ) : (
                                <Copy size={16} className="text-gray-400 group-hover/btn:text-green-400 transition-colors" />
                            )}
                        </button>
                    )}
                </div>

                {/* Кнопки установки и добавления */}
                {keyText !== 'Генерация ключа...' && !vpnKey.device_limit_reached && (
                    <div className="mt-3 space-y-3">
                        {/* Секция 1: Установите приложение */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                                <span>1️⃣</span> Установите приложение:
                            </p>

                            {/* Основные платформы: iPhone и Android */}
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href="https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 hover:scale-105 text-xs font-semibold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-1.5"
                                >
                                    <span>📱</span>
                                    Айфон
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.happproxy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 hover:scale-105 text-xs font-semibold shadow-lg shadow-green-900/30 flex items-center justify-center gap-1.5"
                                >
                                    <span>🤖</span>
                                    Андройд
                                </a>
                            </div>

                            {/* Выпадающий список для других устройств */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowOtherDevices(!showOtherDevices)}
                                    className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium flex items-center justify-center gap-2"
                                >
                                    Другое устройство
                                    {showOtherDevices ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {showOtherDevices && (
                                    <div className="space-y-2 pl-2 border-l-2 border-slate-600/50">
                                        <a
                                            href="https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                                        >
                                            💻 MacBook
                                        </a>
                                        <a
                                            href="https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                                        >
                                            🖥️ Windows
                                        </a>
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.happproxy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-gray-300 rounded-lg transition-all duration-200 text-xs font-medium"
                                        >
                                            📺 AndroidTV
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Секция 2: Добавить Панду в приложение */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                                <span>2️⃣</span> Добавить Панду в приложение:
                            </p>
                            <button
                                onClick={() => setShowAppSelector(true)}
                                disabled={isAddingToApp}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 text-sm font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                            >
                                {isAddingToApp ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Открытие...
                                    </>
                                ) : (
                                    <>
                                        <Smartphone size={16} />
                                        🐼 Добавить Панду в приложение
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                {/* Информация об устройствах */}
                {vpnKey.active_devices_count !== undefined && vpnKey.max_devices !== undefined && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-500">
                            Устройств: {vpnKey.active_devices_count} / {vpnKey.max_devices}
                        </p>

                        <div className="flex items-center justify-end text-xs md:text-sm flex-wrap gap-2">
                            <div className="flex gap-2.5">
                                {/* Кнопка показа устройств */}
                                {vpnKey.active_devices_count !== undefined && vpnKey.active_devices_count > 0 && (
                                    <button
                                        onClick={() => setShowDevices(!showDevices)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold hover:scale-105 flex items-center gap-1"
                                        title="Показать устройства"
                                    >
                                        {showDevices ? (
                                            <>
                                                <ChevronUp size={14} />
                                                Скрыть устройства
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={14} />
                                                Устройства ({vpnKey.active_devices_count})
                                            </>
                                        )}
                                    </button>
                                )}
                                {onRevoke && (
                                    <button
                                        onClick={() => onRevoke(vpnKey.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors duration-300 font-semibold hover:scale-105"
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Список устройств */}
                        {showDevices && (
                            <KeyDevicesList
                                clientId={vpnKey.id}
                                onDeviceRemoved={() => {
                                    // Обновляем счетчик устройств локально
                                    if (vpnKey.active_devices_count !== undefined) {
                                        vpnKey.active_devices_count = Math.max(0, vpnKey.active_devices_count - 1)
                                    }
                                    // Обновляем данные с сервера
                                    if (onRefresh) {
                                        setTimeout(() => onRefresh(), 500)
                                    }
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Модальное окно выбора приложения */}
            <AppSelectorModal
                isOpen={showAppSelector}
                onClose={() => setShowAppSelector(false)}
                onSelect={handleAddToApp}
                keyId={vpnKey.id}
            />
        </div>
    )
})

export default VPNKeyCard
