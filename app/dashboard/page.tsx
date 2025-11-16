"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import DashboardPlansTab from "@/components/shared/dashboard-plans-tab"
import DashboardKeysTab from "@/components/shared/dashboard-keys-tab"
import DashboardSupportTab from "@/components/shared/dashboard-support-tab"
import StatsGrid from "@/components/shared/stats-grid"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"

const plans = [
    {
        id: "1month",
        name: "Тариф Бамбук",
        icon: "🌿",
        price: "149",
        period: "1 месяц",
        description: "Лёгкий, как первый шаг Панды на путь воина. Для тех, кто хочет попробовать и понять силу сервиса.",
        discount: "",
        highlighted: false,
    },
    {
        id: "3months",
        name: "Ученик Боевого Панды",
        icon: "🥋",
        price: "299",
        period: "3 месяца",
        description: "Входит во вкус, начинает тренировку. Популярный тариф — баланс силы и выгоды.",
        discount: "-33%",
        highlighted: true,
    },
    {
        id: "6months",
        name: "Воин Дракона",
        icon: "🐉",
        price: "549",
        period: "6 месяцев",
        description: "Тариф для тех, кто не отступает. Выбор тех, кто хочет стабильности и максимальной защиты.",
        discount: "-38%",
        highlighted: false,
    },
    {
        id: "1year",
        name: "Легендарный Мастер",
        icon: "👑",
        price: "999",
        period: "12 месяцев",
        description: "Год абсолютного спокойствия. Сила. Мудрость. Стабильность. Лучший тариф для настоящих мастеров.",
        discount: "-44%",
        highlighted: false,
    },
]

const vpnKeys = [
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
]

const DashboardPage = () => {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string>("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"plans" | "keys" | "support">("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
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

        checkAuth()
    }, [router])

    const handleLogout = () => {
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 bg-linear-to-r from-white to-green-400 bg-clip-text text-transparent">
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
