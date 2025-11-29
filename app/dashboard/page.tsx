"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/hooks/use-auth"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useClipboard } from "@/hooks/use-clipboard"
import DashboardLayout from "@/components/shared/dashboard-layout"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import DashboardPlansTab from "@/components/shared/dashboard-plans-tab"
import DashboardKeysTab from "@/components/shared/dashboard-keys-tab"
import DashboardSupportTab from "@/components/shared/dashboard-support-tab"
import StatsGrid from "@/components/shared/stats-grid"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"
import LoadingScreen from "@/components/shared/loading-screen"

type TabType = "plans" | "keys" | "support"

export default function DashboardPage() {
    const { isAuthenticated, userEmail, isLoading: authLoading, logout } = useAuth()
    const { plans, vpnKeys, isLoading: dataLoading, loadData } = useDashboardData()
    const { copiedText, copyToClipboard } = useClipboard()

    const [activeTab, setActiveTab] = useState<TabType>("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
        }
    }, [isAuthenticated, loadData])

    useEffect(() => {
        // Проверяем параметр payment=success в URL
        const params = new URLSearchParams(window.location.search)
        if (params.get("payment") === "success") {
            setPaymentSuccess(true)
            // Обновляем ключи после успешной оплаты
            loadData()
            // Убираем параметр из URL
            window.history.replaceState({}, "", "/dashboard")
            // Скрываем сообщение через 5 секунд
            setTimeout(() => setPaymentSuccess(false), 5000)
        }
    }, [loadData])

    const handleLogout = async () => {
        try {
            await apiClient.logout()
        } catch (error) {
            console.error("Logout error:", error)
        }
        logout()
    }

    if (authLoading || dataLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <DashboardLayout>
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                userEmail={userEmail}
                onLogout={handleLogout}
            />

            <MobileSidebarToggle
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main className="relative flex-1 w-full ml-0 md:ml-64 px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 transition-all z-10 overflow-x-hidden">
                <div className="mb-6 space-y-3 md:mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-100 ring-1 ring-green-500/30">
                        <span className="text-base">🐼</span>
                        Panda VPN
                    </div>
                    <h1 className="text-3xl font-semibold text-white sm:text-[34px]">
                        Привет, {userEmail.split("@")[0]} — ваш дашборд готов
                    </h1>
                    <p className="text-sm text-gray-400 sm:text-base">
                        Управляйте подпиской, ключами и обращениями в одном месте.
                    </p>
                </div>

                <StatsGrid keysCount={vpnKeys.length} />

                {paymentSuccess && (
                    <div className="mb-6 rounded-xl border border-emerald-500/50 bg-emerald-900/20 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="text-base font-semibold text-emerald-400">Оплата успешно выполнена!</p>
                                <p className="text-sm text-emerald-300/80">Ваш VLESS ключ создан или продлен. Проверьте вкладку "Ключи".</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPaymentSuccess(false)}
                            className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-xl border border-green-700/20 rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8">
                    {activeTab === "plans" && <DashboardPlansTab plans={plans} />}
                    {activeTab === "keys" && (
                        <DashboardKeysTab
                            vpnKeys={vpnKeys}
                            copiedKey={copiedText}
                            onCopyKey={copyToClipboard}
                            onRefresh={loadData}
                        />
                    )}
                    {activeTab === "support" && <DashboardSupportTab />}
                </div>
            </main>
        </DashboardLayout>
    )
}
