import VPNKeyCard, { type VPNKey } from "./vpn-key-card"

interface DashboardKeysTabProps {
    vpnKeys: VPNKey[]
    copiedKey: string | null
    onCopyKey: (text: string, keyId: string) => void
}

export default function DashboardKeysTab({ vpnKeys, copiedKey, onCopyKey }: DashboardKeysTabProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Мои VPN ключи</h2>
                    <p className="text-gray-400">Управляйте вашими подключениями</p>
                </div>
                <button className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition font-bold">+ Создать ключ</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {vpnKeys.map((vpnKey) => (
                    <VPNKeyCard
                        key={vpnKey.id}
                        vpnKey={vpnKey}
                        copiedKey={copiedKey}
                        onCopy={onCopyKey}
                    />
                ))}
            </div>

            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/50 rounded-2xl">
                <p className="text-base text-blue-400 mb-3 font-bold flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Как использовать ваш ключ:
                </p>
                <ol className="text-sm text-blue-300 space-y-2 ml-6 list-decimal">
                    <li>Скопируйте ключ нажав на иконку копирования</li>
                    <li>Откройте приложение v2rayN / v2rayNG / Shadowrocket</li>
                    <li>Добавьте сервер через буфер обмена</li>
                </ol>
            </div>
        </div>
    )
}
