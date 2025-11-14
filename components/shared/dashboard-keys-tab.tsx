import VPNKeyCard, { type VPNKey } from "./vpn-key-card"

interface DashboardKeysTabProps {
    vpnKeys: VPNKey[]
    copiedKey: string | null
    onCopyKey: (text: string, keyId: string) => void
}

export default function DashboardKeysTab({ vpnKeys, copiedKey, onCopyKey }: DashboardKeysTabProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Мои VPN ключи</h2>
                    <p className="text-gray-400 text-xs md:text-sm">Управляйте вашими подключениями</p>
                </div>
                <button className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-sm group">
                    <span className="inline-flex items-center gap-2">
                        <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
                        Создать ключ
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                {vpnKeys.map((vpnKey) => (
                    <VPNKeyCard
                        key={vpnKey.id}
                        vpnKey={vpnKey}
                        copiedKey={copiedKey}
                        onCopy={onCopyKey}
                    />
                ))}
            </div>

            <div className="mt-6 p-4 md:p-5 bg-blue-900/20 border border-blue-500/50 rounded-xl hover:border-blue-500/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
                <p className="text-sm md:text-base text-blue-400 mb-2.5 font-semibold flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    Как использовать ваш ключ:
                </p>
                <ol className="text-xs md:text-sm text-blue-300 space-y-1.5 ml-6 list-decimal">
                    <li>Скопируйте ключ нажав на иконку копирования</li>
                    <li>Откройте приложение v2rayN / v2rayNG / Shadowrocket</li>
                    <li>Добавьте сервер через буфер обмена</li>
                </ol>
            </div>
        </div>
    )
}
