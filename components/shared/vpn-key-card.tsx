import { Copy, Check } from "lucide-react"
import { memo } from "react"

export interface VPNKey {
    id: string
    key: string
    location: string
    status: 'active' | 'expired'
    expiresAt: string | null
    protocol?: string
}

interface VPNKeyCardProps {
    vpnKey: VPNKey
    copiedKey: string | null
    onCopy: (text: string, keyId: string) => void
    onRevoke?: (keyId: string) => void
}

const VPNKeyCard = memo(function VPNKeyCard({ vpnKey, copiedKey, onCopy, onRevoke }: VPNKeyCardProps) {
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

    const isVLESS = vpnKey.key?.startsWith('vless://') || vpnKey.protocol === 'vless'
    const keyText = vpnKey.key || 'Генерация ключа...'

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
                        <h3 className="text-base md:text-lg font-bold text-white">
                            {getProtocolName(vpnKey.protocol)} {vpnKey.location}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400">{vpnKey.location}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vpnKey.status === 'active'
                    ? 'bg-green-900/40 border border-green-500/50 text-green-400 animate-pulse-glow'
                    : 'bg-red-900/40 border border-red-500/50 text-red-400'
                    }`}>
                    {vpnKey.status === 'active' ? 'Активен' : 'Истек'}
                </span>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-green-700/20 hover:border-green-600/40 transition-colors duration-300">
                <div className="flex items-center justify-between gap-2">
                    <code className="text-xs text-gray-400 break-all flex-1 font-mono">
                        {keyText}
                    </code>
                    {keyText !== 'Генерация ключа...' && (
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
                {isVLESS && (
                    <p className="text-xs text-green-400/70 mt-2">
                        🔒 VLESS протокол — безопасное подключение
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between text-xs md:text-sm flex-wrap gap-2">
                <span className="text-gray-400 font-medium">
                    Истекает: <span className="text-white">{formatExpiresAt(vpnKey.expiresAt)}</span>
                </span>
                <div className="flex gap-2.5">
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
        </div>
    )
})

export default VPNKeyCard
