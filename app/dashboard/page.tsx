"use client"

import { useState } from "react"
import Link from "next/link"
import { CreditCard, Key, MessageSquare, LogOut, User, Copy, Check } from "lucide-react"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"balance" | "keys" | "support">("balance")
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    // Временные данные пользователя
    const user = {
        email: "demo@pandavpn.com",
        balance: 1250,
        plan: "💚 Панда Pro",
    }

    // Временные VPN ключи
    const vpnKeys = [
        {
            id: "1",
            name: "Основной ключ",
            key: "vless://a1b2c3d4-e5f6-7890-abcd-ef1234567890@server1.pandavpn.com:443",
            server: "🇺🇸 США, Нью-Йорк",
            expiresAt: "2025-12-13",
            status: "active",
        },
        {
            id: "2",
            name: "Резервный ключ",
            key: "vless://x9y8z7w6-v5u4-3210-zyxw-vu9876543210@server2.pandavpn.com:443",
            server: "🇩🇪 Германия, Берлин",
            expiresAt: "2025-12-13",
            status: "active",
        },
    ]

    const copyToClipboard = (text: string, keyId: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(keyId)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const handleLogout = () => {
        // Удаляем данные авторизации
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userEmail")
        window.location.href = "/auth/login"
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-accent/30 shadow-lg shadow-green-900/10">
                <div className="container-wide">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-accent transition">
                            <span className="text-3xl">🐼</span>
                            <span>Panda VPN</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                                <User size={16} />
                                <span>{user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:text-accent transition"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Выход</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container-wide py-8 md:py-12">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Личный кабинет</h1>
                    <p className="text-muted-foreground">Управляйте своим VPN аккаунтом</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                                <CreditCard size={20} className="text-white" />
                            </div>
                            <span className="text-sm text-muted-foreground">Баланс</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white">{user.balance} ₽</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                                <Key size={20} className="text-white" />
                            </div>
                            <span className="text-sm text-muted-foreground">Активных ключей</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white">{vpnKeys.length}</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                                <span className="text-lg">💚</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Тариф</span>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white">{user.plan}</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab("balance")}
                        className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === "balance"
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                            : "bg-slate-800 text-gray-400 hover:text-white"
                            }`}
                    >
                        <CreditCard size={18} className="inline mr-2" />
                        Баланс
                    </button>
                    <button
                        onClick={() => setActiveTab("keys")}
                        className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === "keys"
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                            : "bg-slate-800 text-gray-400 hover:text-white"
                            }`}
                    >
                        <Key size={18} className="inline mr-2" />
                        Мои ключи
                    </button>
                    <button
                        onClick={() => setActiveTab("support")}
                        className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${activeTab === "support"
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                            : "bg-slate-800 text-gray-400 hover:text-white"
                            }`}
                    >
                        <MessageSquare size={18} className="inline mr-2" />
                        Поддержка
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl shadow-lg p-6 md:p-8">
                    {/* Balance Tab */}
                    {activeTab === "balance" && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Пополнение баланса</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[500, 1000, 2000, 5000].map((amount) => (
                                    <button
                                        key={amount}
                                        className="p-4 bg-slate-800 hover:bg-slate-700 border border-green-700/30 hover:border-green-600/60 rounded-lg transition text-center"
                                    >
                                        <p className="text-2xl font-bold text-white mb-1">{amount} ₽</p>
                                        <p className="text-xs text-muted-foreground">Пополнить</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-white mb-2">Другая сумма</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="Введите сумму"
                                        className="flex-1 px-4 py-3 bg-slate-800 border border-green-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button className="btn-primary px-6">Пополнить</button>
                                </div>
                            </div>

                            <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                                <p className="text-sm text-green-400">
                                    💡 При пополнении от 5000 ₽ — бонус 10% на счет
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Keys Tab */}
                    {activeTab === "keys" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Мои VPN ключи</h2>
                                <button className="btn-primary px-4 py-2 text-sm">+ Создать ключ</button>
                            </div>

                            <div className="space-y-4">
                                {vpnKeys.map((vpnKey) => (
                                    <div
                                        key={vpnKey.id}
                                        className="p-5 bg-slate-800 border border-green-700/30 rounded-lg hover:border-green-600/60 transition"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-1">{vpnKey.name}</h3>
                                                <p className="text-sm text-muted-foreground">{vpnKey.server}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-xs text-green-400 font-semibold">
                                                Активен
                                            </span>
                                        </div>

                                        <div className="mb-3 p-3 bg-black/40 rounded border border-green-700/20">
                                            <div className="flex items-center justify-between gap-3">
                                                <code className="text-xs text-gray-400 break-all flex-1">{vpnKey.key}</code>
                                                <button
                                                    onClick={() => copyToClipboard(vpnKey.key, vpnKey.id)}
                                                    className="flex-shrink-0 p-2 hover:bg-slate-700 rounded transition"
                                                    title="Копировать ключ"
                                                >
                                                    {copiedKey === vpnKey.id ? (
                                                        <Check size={16} className="text-green-400" />
                                                    ) : (
                                                        <Copy size={16} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Истекает: {vpnKey.expiresAt}</span>
                                            <div className="flex gap-2">
                                                <button className="text-green-400 hover:text-green-300 transition">Продлить</button>
                                                <button className="text-red-400 hover:text-red-300 transition">Удалить</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                                <p className="text-sm text-blue-400 mb-2">
                                    📱 <strong>Как использовать:</strong>
                                </p>
                                <ol className="text-xs text-blue-300 space-y-1 ml-4">
                                    <li>1. Скопируйте ключ нажав на иконку копирования</li>
                                    <li>2. Откройте приложение v2rayN / v2rayNG / Shadowrocket</li>
                                    <li>3. Добавьте сервер через буфер обмена</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* Support Tab */}
                    {activeTab === "support" && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4">💬</div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Свяжитесь с нами</h2>
                                <p className="text-muted-foreground">Наша поддержка всегда на связи в Telegram</p>
                            </div>

                            <a
                                href="https://web.telegram.org/@mgdov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center gap-3 px-8 py-4 text-lg shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all"
                            >
                                <MessageSquare size={24} />
                                Написать в Telegram
                            </a>

                            <div className="mt-8 p-4 bg-green-900/20 border border-green-500/50 rounded-lg max-w-md">
                                <p className="text-sm text-green-400 text-center">
                                    ⚡ Быстрая поддержка 24/7
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
