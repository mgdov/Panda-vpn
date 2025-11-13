import { Copy, Check } from "lucide-react"

export interface VPNKey {
    id: string
    name: string
    key: string
    server: string
    expiresAt: string
    status: string
}

interface VPNKeyCardProps {
    vpnKey: VPNKey
    copiedKey: string | null
    onCopy: (text: string, keyId: string) => void
}

export default function VPNKeyCard({ vpnKey, copiedKey, onCopy }: VPNKeyCardProps) {
    return (
        <div className="p-6 bg-linear-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-green-700/30 rounded-2xl hover:border-green-600/60 transition-all shadow-xl hover:shadow-2xl hover:shadow-green-600/20 hover:scale-105 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{vpnKey.name}</h3>
                        <p className="text-sm text-gray-400">{vpnKey.server}</p>
                    </div>
                </div>
                <span className="px-4 py-1.5 bg-green-900/40 border border-green-500/50 rounded-full text-xs text-green-400 font-bold">
                    Активен
                </span>
            </div>

            <div className="p-4 bg-black/60 rounded-xl border border-green-700/20">
                <div className="flex items-center justify-between gap-3">
                    <code className="text-xs text-gray-400 break-all flex-1">{vpnKey.key}</code>
                    <button
                        onClick={() => onCopy(vpnKey.key, vpnKey.id)}
                        className="shrink-0 p-2.5 hover:bg-green-600/30 rounded-lg transition"
                        title="Копировать ключ"
                    >
                        {copiedKey === vpnKey.id ? (
                            <Check size={18} className="text-green-400" />
                        ) : (
                            <Copy size={18} className="text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Истекает: <span className="text-white">{vpnKey.expiresAt}</span></span>
                <div className="flex gap-3">
                    <button className="text-green-400 hover:text-green-300 transition font-semibold">Продлить</button>
                    <button className="text-red-400 hover:text-red-300 transition font-semibold">Удалить</button>
                </div>
            </div>
        </div>
    )
}
