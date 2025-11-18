"use client"
import { useEffect, useState } from "react"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import DashboardPlansTab from "@/components/shared/dashboard-plans-tab"
import DashboardKeysTab from "@/components/shared/dashboard-keys-tab"
import DashboardSupportTab from "@/components/shared/dashboard-support-tab"
import StatsGrid from "@/components/shared/stats-grid"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"
import { logout, getProfile, getStoredUser, type MarzbanClient } from "@/lib/api"
import type { VPNKey } from "@/components/shared/vpn-key-card"

const DashboardPage = () => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"plans" | "keys" | "support">("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [clients, setClients] = useState<MarzbanClient[]>([])
    const [userEmail, setUserEmail] = useState<string>("")

    // Load user email on client side only to avoid hydration mismatch
    useEffect(() => {
        const user = getStoredUser()
        if (user?.email) {
            setUserEmail(user.email)
        }
    }, [])

    // Тарифы (привяжите id к tariff_code бэка)
    const plans = [
        {
            id: "MONTH_50",
            name: "Тариф Бамбук",
            icon: "🌿",
            price: "149",
            period: "1 месяц",
            description: "Лёгкий, как первый шаг Панды на путь воина. Для тех, кто хочет попробовать и понять силу сервиса.",
            highlighted: false,
        },
        {
            id: "MONTH_150",
            name: "Ученик Боевого Панды",
            icon: "🥋",
            price: "299",
            period: "3 месяца",
            description: "Входит во вкус, начинает тренировку. Популярный тариф — баланс силы и выгоды.",
            discount: "-33%",
            highlighted: true,
        },
        {
            id: "MONTH_300",
            name: "Воин Дракона",
            icon: "🐉",
            price: "549",
            period: "6 месяцев",
            description: "Тариф для тех, кто не отступает. Выбор тех, кто хочет стабильности и максимальной защиты.",
            discount: "-38%",
            highlighted: false,
        },
        {
            id: "YEAR_900",
            name: "Легендарный Мастер",
            icon: "👑",
            price: "999",
            period: "12 месяцев",
            description: "Год абсолютного спокойствия. Сила. Мудрость. Стабильность. Лучший тариф для настоящих мастеров.",
            discount: "-44%",
            highlighted: false,
        },
    ]

    const vpnKeys: VPNKey[] = clients.map((c, idx) => ({
        id: c.marzban_client_id || c.id,
        name: `Ключ #${idx + 1} (${c.protocol})`,
        key: c.config_text || c.subscription_url || "",
        server: `${c.transport.toUpperCase()}`,
        expiresAt: new Date(c.expires_at).toLocaleDateString(),
        status: c.active ? "active" : "inactive",
    }))

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const profile = await getProfile()
                if (!mounted) return
                setClients(profile.clients || [])
            } catch (e: any) {
                setError(e?.message || "Ошибка загрузки профиля")
            } finally {
                setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    const handleLogout = async () => {
        await logout()
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
                {loading && <div className="text-gray-300">Загрузка...</div>}
                {!loading && error && <div className="text-red-400">{error}</div>}
                {/* Welcome Section */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 bg-linear-to-r from-white to-green-400 bg-clip-text text-transparent">Добро пожаловать!</h1>
                    <p className="text-gray-400 text-sm md:text-base">Управляйте вашим VPN аккаунтом</p>
                </div>

                {/* Stats Cards */}
                    <StatsGrid keysCount={vpnKeys.length || 0} />

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
