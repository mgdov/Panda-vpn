import { Copy, Check, ChevronDown, ChevronUp, Smartphone, Download, ExternalLink } from "lucide-react"
import { memo, useState, useEffect, useRef } from "react"
import KeyDevicesList from "./key-devices-list"
import { apiClient } from "@/lib/api/client"
import type { VPNAppType } from "@/lib/api/types"

export interface VPNKey {
    id: string
    key: string
    location: string
    status: 'active' | 'expired'
    expiresAt: string | null
    protocol?: string
    marzban_client_id?: string  // 5 заглавных букв - название ключа из Marzban
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
    const [isAddingToApp, setIsAddingToApp] = useState(false)
    const [showInstallOptions, setShowInstallOptions] = useState(false)
    const installOptionsRef = useRef<HTMLDivElement>(null)

    // Закрытие меню при клике вне его области
    useEffect(() => {
        if (!showInstallOptions) return

        const handleClickOutside = (event: MouseEvent) => {
            if (installOptionsRef.current && !installOptionsRef.current.contains(event.target as Node)) {
                setShowInstallOptions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showInstallOptions])

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

    const getTimeRemaining = (expiresAt: string | null) => {
        if (!expiresAt) return null
        try {
            const now = new Date()
            const expiry = new Date(expiresAt)
            const diffMs = expiry.getTime() - now.getTime()

            if (diffMs <= 0) return 'Истёк'

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

            if (days > 0) return `Осталось ${days} дн.`
            if (hours > 0) return `Осталось ${hours} ч.`
            return `Осталось ${minutes} мин.`
        } catch {
            return null
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

    // Добавить ключ в приложение Happ
    const handleAddKeyToApp = async () => {
        setIsAddingToApp(true)
        try {
            // Получаем deep link для Happ
            const deepLinkData = await apiClient.getDeepLink(vpnKey.id, 'happ')

            // Извлекаем happ:// URL из ответа API
            // API может вернуть либо прямой happ:// URL, либо URL с редиректом
            let happUrl = deepLinkData.deeplink

            // Если API вернул URL с редиректом (содержит redirect_to), извлекаем happ:// из него
            if (happUrl.includes('redirect_to=')) {
                const match = happUrl.match(/redirect_to=([^&]+)/)
                if (match && match[1]) {
                    happUrl = decodeURIComponent(match[1])
                }
            }

            // Открываем страницу редиректа с параметром redirect_to
            const redirectUrl = `/redirect?redirect_to=${encodeURIComponent(happUrl)}`

            // На мобильных используем window.location.href для надежности
            // На десктопе открываем в новой вкладке
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
            if (isMobile) {
                window.location.href = redirectUrl
            } else {
                window.open(redirectUrl, '_blank')
            }
        } catch (error) {
            console.error('Failed to generate deep link:', error)

            // Fallback: если API не работает, используем прямой subscription URL
            if (vpnKey.subscription_url) {
                console.log('Using fallback: direct subscription URL')
                const happDeepLink = `happ://install-config?url=${encodeURIComponent(vpnKey.subscription_url)}`
                const redirectUrl = `/redirect?redirect_to=${encodeURIComponent(happDeepLink)}`

                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                if (isMobile) {
                    window.location.href = redirectUrl
                } else {
                    window.open(redirectUrl, '_blank')
                }
            } else {
                alert('Не удалось создать ссылку для добавления ключа. Попробуйте скопировать ключ вручную.')
            }
        } finally {
            setIsAddingToApp(false)
        }
    }

    const installLinks = [
        { platform: 'iOS', url: 'https://apps.apple.com/fi/app/happ-proxy-utility/id6504287215', icon: '📱' },
        { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.happproxy', icon: '🤖' },
        { platform: 'macOS', url: 'https://apps.apple.com/fi/mac/search?term=happ', icon: '💻' },
        { platform: 'Windows', url: 'https://www.happ.su/happ/ru', icon: '🪟' },
    ]

    return (
        <div className="p-4 md:p-5 bg-linear-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-600/20 hover:scale-[1.02] hover:-translate-y-0.5 flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {isVLESS ? (
                            <span className="text-lg">🔐</span>
                        ) : (
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                            {vpnKey.marzban_client_id ? (
                                <>
                                    <span>Ключ</span>
                                    <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-500/50 text-blue-300 text-sm font-mono rounded">
                                        {vpnKey.marzban_client_id}
                                    </span>
                                </>
                            ) : (
                                <>{getProtocolName(vpnKey.protocol)} {vpnKey.location}</>
                            )}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400">{getProtocolName(vpnKey.protocol)}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vpnKey.status === 'active'
                    ? 'bg-green-900/40 border border-green-500/50 text-green-400 animate-pulse-glow'
                    : 'bg-red-900/40 border border-red-500/50 text-red-400'
                    }`}>
                    {vpnKey.status === 'active' ? 'Активен' : 'Истек'}
                </span>
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

            {/* Блок с датой истечения */}
            <div className="p-3 bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/50 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-orange-300 font-semibold flex items-center gap-2">
                        ⏰ Истекает: <span className="text-white">{formatExpiresAt(vpnKey.expiresAt)}</span>
                    </p>
                    {getTimeRemaining(vpnKey.expiresAt) && (
                        <span className="text-xs font-bold text-orange-200 bg-orange-600/30 px-2 py-1 rounded-md">
                            {getTimeRemaining(vpnKey.expiresAt)}
                        </span>
                    )}
                </div>
            </div>

            {/* Блок с инструкцией */}
            <div className="p-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/50 rounded-lg">
                <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    📱 Инструкция:
                </h4>
                <ol className="space-y-2 text-xs text-gray-300">
                    <li className="flex gap-2">
                        <span className="text-purple-400 font-semibold">1.</span>
                        <span>Установите приложение для VPN нажав на первую кнопку, а затем вернитесь снова на сайт</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-purple-400 font-semibold">2.</span>
                        <span>После установки приложения нажмите вторую кнопку «Добавить VPN в приложение»</span>
                    </li>

                </ol>
            </div>

            <div>

                {/* Две кнопки: Добавить ключ и Установить приложение */}
                {keyText !== 'Генерация ключа...' && !vpnKey.device_limit_reached && (
                    <div className="mt-3 flex flex-col gap-2">
                        {/* Кнопка установки приложения с выпадающим списком */}
                        <div className="relative" ref={installOptionsRef}>
                            <button

                                onClick={() => setShowInstallOptions(!showInstallOptions)}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-semibold shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                            >
                                <p>1.</p>
                                <Download size={16} />
                                Установить приложение для VPN
                                <ChevronDown size={14} className={`transition-transform duration-300 ${showInstallOptions ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Backdrop для закрытия меню */}
                            {showInstallOptions && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowInstallOptions(false)}
                                />
                            )}

                            {/* Выпадающий список платформ */}
                            {showInstallOptions && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500/50 rounded-xl shadow-2xl shadow-green-900/50 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="p-2 bg-green-600/10 border-b-2 border-green-500/30">
                                        <p className="text-xs font-semibold text-green-400 text-center">📱 Выберите вашу платформу</p>
                                    </div>
                                    {installLinks.map((link, index) => (

                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3.5 hover:bg-gradient-to-r hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-200 border-b border-green-700/20 last:border-b-0 group hover:scale-[1.02] hover:shadow-lg"
                                            onClick={() => setShowInstallOptions(false)}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
                                            <div className="flex-1">

                                                <span className="text-sm font-semibold text-white block group-hover:text-green-300 transition-colors">{link.platform}</span>
                                                <span className="text-xs text-gray-400">Скачать приложение</span>
                                            </div>
                                            <ExternalLink size={16} className="text-gray-400 group-hover:text-green-400 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Кнопка добавления ключа в приложение */}
                        <button
                            onClick={handleAddKeyToApp}
                            disabled={isAddingToApp}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 text-sm font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                        >
                            {isAddingToApp ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Добавление ключа...
                                </>
                            ) : (
                                <>
                                    <p>2.</p>
                                    <Smartphone size={16} />
                                    Добавить VPN в приложение
                                </>
                            )}
                        </button>


                    </div>
                )}
            </div>

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
    )
})

export default VPNKeyCard
