"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import DashboardPlansTab from "@/components/shared/dashboard-plans-tab"
import DashboardKeysTab from "@/components/shared/dashboard-keys-tab"
import DashboardSupportTab from "@/components/shared/dashboard-support-tab"
import StatsGrid from "@/components/shared/stats-grid"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"

const DashboardPage = () => {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string>("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"plans" | "keys" | "support">("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [plans, setPlans] = useState<any[]>([])
    const [vpnKeys, setVpnKeys] = useState<any[]>([])

    useEffect(() => {
        checkAuth()
    }, [router])

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboardData()
        }
    }, [isAuthenticated])

    const checkAuth = () => {
        const auth = localStorage.getItem("isAuthenticated")
        const email = localStorage.getItem("userEmail")

        if (auth === "true" && email) {
            setIsAuthenticated(true)
            setUserEmail(email)
        } else {
            router.push("/auth/login")
        }
        setIsLoading(false)
    }

    const loadDashboardData = async () => {
        try {
            // Load tariffs
            const tariffs = await apiClient.getTariffs()
            const formattedPlans = tariffs.map((tariff: any) => ({
                id: tariff.code,
                name: tariff.name,
                icon: getIconForDuration(tariff.duration_seconds),
                price: (tariff.price_amount / 100).toString(),
                period: getDurationText(tariff.duration_seconds),
                description: tariff.description || "Доступ к VPN серверам",
                highlighted: tariff.code.includes("3") || tariff.code.includes("quarter"),
                discount: getDiscount(tariff.duration_seconds),
            }))
            setPlans(formattedPlans)

            // Load VPN keys (из marzban_clients)
            const keys = await apiClient.getProfileKeys()
            setVpnKeys(keys.map((key) => ({
                id: key.id,
                key: key.config_text || "Generating...",
                location: "🌍 Auto-select",
                status: key.active ? "active" : "expired",
                expiresAt: key.expires_at || null,
                marzban_client_id: key.marzban_client_id, // Для использования в /configs/*
            })))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"

            // Only log if it's not a connection or known backend error
            if (!errorMessage.includes("API server unavailable") &&
                !errorMessage.includes("failed to list tariffs")) {
                console.error("Error loading dashboard data:", error)
            }

            // Fallback to static data
            loadStaticData()
        }
    }

    const loadStaticData = () => {
        setPlans([
            {
                id: "1month",
                name: "Тариф Бамбук",
                icon: "🌿",
                price: "149",
                period: "1 месяц",
                description: "Лёгкий, как первый шаг Панды на путь воина.",
                highlighted: false,
            },
            {
                id: "3months",
                name: "Ученик Боевого Панды",
                icon: "🥋",
                price: "299",
                period: "3 месяца",
                description: "Популярный тариф — баланс силы и выгоды.",
                discount: "-33%",
                highlighted: true,
            },
            {
                id: "6months",
                name: "Воин Дракона",
                icon: "🐉",
                price: "549",
                period: "6 месяцев",
                description: "Выбор тех, кто хочет стабильности.",
                discount: "-38%",
                highlighted: false,
            },
            {
                id: "1year",
                name: "Легендарный Мастер",
                icon: "👑",
                price: "999",
                period: "12 месяцев",
                description: "Год абсолютного спокойствия.",
                discount: "-44%",
                highlighted: false,
            },
        ])

        setVpnKeys([
            {
                id: "1",
                key: "ss://YWVzLTI1Ni1nY206cGFuZGF2cG4xMjM=@server1.pandavpn.com:8388",
                location: "🇺🇸 США (Нью-Йорк)",
                status: "active",
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: "2",
                key: "ss://YWVzLTI1Ni1nY206cGFuZGF2cG4xMjM=@server2.pandavpn.com:8388",
                location: "🇩🇪 Германия (Франкфурт)",
                status: "active",
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ])
    }

    const getIconForDuration = (duration: number): string => {
        const days = Math.floor(duration / 86400)
        if (days <= 31) return "🌿"
        if (days <= 93) return "🥋"
        if (days <= 186) return "🐉"
        return "👑"
    }

    const getDurationText = (duration: number): string => {
        const days = Math.floor(duration / 86400)
        if (days <= 31) return "1 месяц"
        if (days <= 93) return "3 месяца"
        if (days <= 186) return "6 месяцев"
        return "12 месяцев"
    }

    const getDiscount = (duration: number): string | undefined => {
        const days = Math.floor(duration / 86400)
        if (days >= 85 && days <= 93) return "-33%"
        if (days >= 175 && days <= 186) return "-38%"
        if (days >= 350) return "-44%"
        return undefined
    }

    const handleLogout = async () => {
        try {
            await apiClient.logout()
        } catch (error) {
            console.error("Logout error:", error)
        }
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("userEmail")
        router.push("/")
    }

    const copyToClipboard = (text: string, keyId: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(keyId)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0e151b]">
                <div className="text-center">
                    <div className="text-5xl mb-4 animate-bounce">🐼</div>
                    <p className="text-white text-lg">Загрузка...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="relative min-h-screen flex bg-[#0e151b] overflow-x-hidden">
            {/* Декоративные элементы */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-700/25 rounded-full blur-3xl opacity-50 z-0 animate-pulse" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] bg-green-400/15 rounded-full blur-2xl opacity-30 z-0" />

            {/* Sidebar */}
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                userEmail={userEmail}
                onLogout={handleLogout}
            />

            {/* Mobile sidebar toggle */}
            <MobileSidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <main className="relative flex-1 w-full ml-0 md:ml-64 px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 transition-all z-10 overflow-x-hidden">
                {/* Welcome Section */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                        Добро пожаловать, {userEmail?.split("@")[0]}!
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Управляйте вашим VPN аккаунтом</p>
                </div>

                {/* Stats Cards */}
                <StatsGrid keysCount={vpnKeys.length} />

                {/* Content Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-green-700/20 rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8">
                    {activeTab === "plans" && <DashboardPlansTab plans={plans} />}
                    {activeTab === "keys" && <DashboardKeysTab vpnKeys={vpnKeys} copiedKey={copiedKey} onCopyKey={copyToClipboard} />}
                    {activeTab === "support" && <DashboardSupportTab />}
                </div>
            </main>
        </div>
    )
}

export default DashboardPage
