"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { VPNAppType } from "@/lib/api/types"

interface AppInfo {
    id: VPNAppType
    name: string
    description: string
    icon: string
    platform: "iOS" | "Android" | "Both"
    recommended?: boolean
}

const APPS: AppInfo[] = [
    {
        id: "happ",
        name: "Happ (Hiddify)",
        description: "Универсальный клиент с простым интерфейсом",
        icon: "🐼",
        platform: "Both",
        recommended: true,
    },
    {
        id: "v2rayng",
        name: "v2rayNG",
        description: "Популярный клиент для Android",
        icon: "📱",
        platform: "Android",
    },
    {
        id: "shadowrocket",
        name: "Shadowrocket",
        description: "Премиум клиент для iOS",
        icon: "🚀",
        platform: "iOS",
    },
    {
        id: "singbox",
        name: "sing-box",
        description: "Современный кроссплатформенный клиент",
        icon: "📦",
        platform: "Both",
    },
    {
        id: "v2box",
        name: "V2Box",
        description: "Легковесный клиент для Android",
        icon: "🔷",
        platform: "Android",
    },
    {
        id: "streisand",
        name: "Streisand",
        description: "VPN клиент для iOS",
        icon: "⭐",
        platform: "iOS",
    },
]

interface AppSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (app: VPNAppType) => void
    keyId: string
}

export default function AppSelectorModal({ isOpen, onClose, onSelect }: AppSelectorModalProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<"All" | "iOS" | "Android">("All")

    if (!isOpen) return null

    const filteredApps = APPS.filter(app => {
        if (selectedPlatform === "All") return true
        if (selectedPlatform === "iOS") return app.platform === "iOS" || app.platform === "Both"
        if (selectedPlatform === "Android") return app.platform === "Android" || app.platform === "Both"
        return true
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-green-700/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-green-700/30 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Выберите приложение</h2>
                        <p className="text-sm text-gray-400 mt-1">Добавьте ключ в ваше VPN приложение</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        aria-label="Закрыть"
                    >
                        <X className="text-gray-400 hover:text-red-400" size={24} />
                    </button>
                </div>

                {/* Platform filter */}
                <div className="p-4 border-b border-green-700/20 bg-black/20">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedPlatform("All")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedPlatform === "All"
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-700/50 text-gray-400 hover:bg-slate-700"
                            }`}
                        >
                            Все платформы
                        </button>
                        <button
                            onClick={() => setSelectedPlatform("Android")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedPlatform === "Android"
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-700/50 text-gray-400 hover:bg-slate-700"
                            }`}
                        >
                            📱 Android
                        </button>
                        <button
                            onClick={() => setSelectedPlatform("iOS")}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedPlatform === "iOS"
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-700/50 text-gray-400 hover:bg-slate-700"
                            }`}
                        >
                            🍎 iOS
                        </button>
                    </div>
                </div>

                {/* Apps list */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid gap-3">
                        {filteredApps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    onSelect(app.id)
                                    onClose()
                                }}
                                className="p-4 bg-slate-800/60 hover:bg-slate-700/60 border border-green-700/20 hover:border-green-600/50 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform">
                                        {app.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-white">{app.name}</h3>
                                            {app.recommended && (
                                                <span className="px-2 py-0.5 bg-green-600/20 border border-green-500/50 text-green-400 text-xs font-semibold rounded-full">
                                                    Рекомендуем
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{app.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded">
                                                {app.platform === "Both" ? "iOS • Android" : app.platform}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        →
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-green-700/20 bg-black/20">
                    <p className="text-xs text-gray-500 text-center">
                        💡 Если приложение не откроется автоматически, убедитесь что оно установлено
                    </p>
                </div>
            </div>
        </div>
    )
}
