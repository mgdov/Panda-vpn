"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import StatsGrid from "@/components/shared/stats-grid"
import DashboardPlansTab from "@/components/shared/dashboard-plans-tab"
import DashboardKeysTab from "@/components/shared/dashboard-keys-tab"
import DashboardSupportTab from "@/components/shared/dashboard-support-tab"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"plans" | "keys" | "support">("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    // Временные данные пользователя
    const user = {
        email: "demo@pandavpn.com",
    }

    // Тарифы
    const plans = [
        {
            id: "1month",
            name: "1 месяц",
            icon: "🐼",
            price: "149",
            period: "",
            highlighted: false,
        },
        {
            id: "3months",
            name: "3 месяца",
            icon: "🐼",
            price: "299",
            period: "",
            discount: "-33%",
            highlighted: true,
        },
        {
            id: "6months",
            name: "6 месяцев",
            icon: "🐼‍⬛",
            price: "549",
            period: "",
            discount: "-38%",
            highlighted: false,
        },
        {
            id: "1year",
            name: "1 год",
            icon: "👑",
            price: "999",
            period: "",
            discount: "-44%",
            highlighted: false,
        },
    ]

    // Временные VPN ключи
    const vpnKeys = [
        {
            id: "1",
            name: "Основной ключ",
            key: "vless://a1b2c3d4-e5f6-7890-abcd-ef1234567890@server1.pandavpn.com:443",
            server: "🇺🇸 США, Нью-Йорк",
            expiresAt: "2025-12-13",
            status: "active" as const,
        },
        {
            id: "2",
            name: "Резервный ключ",
            key: "vless://x9y8z7w6-v5u4-3210-zyxw-vu9876543210@server2.pandavpn.com:443",
            server: "🇩🇪 Германия, Берлин",
            expiresAt: "2025-12-13",
            status: "active" as const,
        },
    ]

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userEmail")
        window.location.href = "/"
    }

    const copyToClipboard = (text: string, keyId: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(keyId)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    return (
        <div className="relative min-h-screen flex bg-[#0e151b] overflow-x-hidden">
            {/* Декоративные элементы */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] bg-green-700/30 rounded-full blur-3xl opacity-60 z-0" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-400/20 rounded-full blur-2xl opacity-40 z-0" />


            {/* Sidebar */}
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                userEmail={user.email}
                onLogout={handleLogout}
            />

            {/* Mobile sidebar toggle */}
            <MobileSidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <main className="relative flex-1 w-full ml-0 md:ml-80 px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 transition-all z-10 overflow-x-hidden">
                {/* Welcome Section */}
                <div className="mb-8 md:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 bg-linear-to-r from-white to-green-400 bg-clip-text text-transparent">Добро пожаловать!</h1>
                    <p className="text-gray-400 text-base md:text-lg">Управляйте вашим VPN аккаунтом</p>
                </div>

                {/* Stats Cards */}
                <StatsGrid keysCount={vpnKeys.length} />

                {/* Content Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-green-700/20 rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
                    {activeTab === "plans" && <DashboardPlansTab plans={plans} />}
                    {activeTab === "keys" && <DashboardKeysTab vpnKeys={vpnKeys} copiedKey={copiedKey} onCopyKey={copyToClipboard} />}
                    {activeTab === "support" && <DashboardSupportTab />}
                </div>
            </main>
        </div>
    )
}
