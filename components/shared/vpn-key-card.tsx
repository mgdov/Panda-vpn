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

            {/* Дата истечения - более заметная */}
            <div className="p-3 bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-500/60 rounded-lg">
                <p className="text-sm font-bold text-orange-300 flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    Истекает: <span className="text-orange-100">{formatExpiresAt(vpnKey.expiresAt)}</span>
                </p>
            </div>

            {/* Инструкция - добавлена сверху */}
            <div className="p-3 bg-purple-900/20 border border-purple-500/40 rounded-lg">
                <p className="text-xs text-purple-300 mb-2 font-semibold">📱 Инструкция:</p>
                <ol className="text-xs text-purple-200/80 space-y-1 ml-4 list-decimal">
                    <li>Установите приложение для вашего устройства</li>
                    <li>Нажмите "Добавить VPN в приложение"</li>
                    <li>Вернитесь на сайт и снова нажмите кнопку добавления</li>
                </ol>
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
                    <div className="mt-3 space-y-2">
                        {/* Кнопка 1: Установить приложение */}
                        <a
                            href={isSubscription ? "https://hiddify.com" : "https://v2rayn.org"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-semibold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                        >
                            <span>📲</span>
                            Установить приложение
                        </a>

                        {/* Кнопка 2: Добавить VPN в приложение */}
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
                                    🔥 Добавить VPN в приложение
                                </>
                            )}
                        </button>
                    </div>
                )}
                {/* Информация об устройствах */}
                {vpnKey.active_devices_count !== undefined && vpnKey.max_devices !== undefined && (
                    <p className="text-xs text-gray-500 mt-2">
                        Устройств: {vpnKey.active_devices_count} / {vpnKey.max_devices}

                        <div className="flex items-center justify-between text-xs md:text-sm flex-wrap gap-2">
                            <span className="text-gray-400 font-medium">
                                Истекает: <span className="text-white">{formatExpiresAt(vpnKey.expiresAt)}</span>
                            </span>
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
