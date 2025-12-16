"use client"

import { useState, useEffect, useCallback } from "react"
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
    const { plans, vpnKeys, loadData, plansError, keysError } = useDashboardData()
    const { copiedText, copyToClipboard } = useClipboard(2000, loadData)

    const [activeTab, setActiveTab] = useState<TabType>("plans")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const handleTabChange = useCallback((tab: TabType) => {
        setActiveTab(tab)
    }, [])

    const handleGoToPlans = useCallback(() => {
        handleTabChange("plans")
    }, [handleTabChange])

    const handleSidebarToggle = useCallback((open: boolean) => {
        setSidebarOpen(open)
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
        }
    }, [isAuthenticated, loadData])

    useEffect(() => {
        // Редирект на логин если не авторизован (после загрузки)
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/auth/login'
        }
    }, [authLoading, isAuthenticated])

    useEffect(() => {
        // Проверяем параметр payment=success в URL
        const params = new URLSearchParams(window.location.search)
        if (params.get("payment") === "success") {
            // Синхронизируем последний платеж и обрабатываем его
            const syncAndLoad = async () => {
                try {
                    // Небольшая задержка для того чтобы платеж успел обработаться на сервере
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    
                    // Синхронизируем статус последнего платежа (до 3 попыток)
                    let syncResult = null
                    for (let attempt = 0; attempt < 3; attempt++) {
                        try {
                            syncResult = await apiClient.syncLatestPayment()
                            console.log(`Payment sync attempt ${attempt + 1} result:`, syncResult)
                            
                            // Если платеж обработан или уже обработан - выходим
                            if (syncResult.status === "success" || syncResult.status === "already_processed") {
                                break
                            }
                            
                            // Если платеж еще pending, ждем и пробуем еще раз
                            if (attempt < 2 && syncResult.status === "pending") {
                                await new Promise(resolve => setTimeout(resolve, 2000))
                                continue
                            }
                        } catch (error) {
                            console.error(`Payment sync attempt ${attempt + 1} failed:`, error)
                            if (attempt < 2) {
                                await new Promise(resolve => setTimeout(resolve, 2000))
                                continue
                            }
                        }
                    }
                    
                    // Обновляем ключи после синхронизации
                    await loadData()
                    
                    // Если платеж обработан, показываем успех
                    if (syncResult && (syncResult.status === "success" || syncResult.status === "already_processed")) {
                        setPaymentSuccess(true)
                        // Скрываем сообщение через 5 секунд
                        setTimeout(() => setPaymentSuccess(false), 5000)
                    }
                } catch (error) {
                    console.error("Failed to sync payment:", error)
                    // В любом случае обновляем данные
                    await loadData()
                }
            }
            
            syncAndLoad()
            // Убираем параметр из URL
            window.history.replaceState({}, "", "/dashboard")
        }
    }, [loadData])

    const handleLogout = useCallback(async () => {
        try {
            await apiClient.logout()
        } catch (error) {
            console.error("Logout error:", error)
        }
        logout()
    }, [logout])

    if (authLoading || !isAuthenticated) {
        return <LoadingScreen />
    }

    return (
        <DashboardLayout>
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={handleSidebarToggle}
                userEmail={userEmail}
                onLogout={handleLogout}
            />

            <MobileSidebarToggle
                sidebarOpen={sidebarOpen}
                setSidebarOpen={handleSidebarToggle}
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
                                <p className="text-sm text-emerald-300/80">Ваш новый VLESS ключ создан. Проверьте вкладку &quot;Ключи&quot;.</p>
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
                    {activeTab === "plans" && <DashboardPlansTab plans={plans} errorMessage={plansError} />}
                    {activeTab === "keys" && (
                        <DashboardKeysTab
                            vpnKeys={vpnKeys}
                            errorMessage={keysError}
                            copiedKey={copiedText}
                            onCopyKey={copyToClipboard}
                            onRefresh={loadData}
                            onGoToPlans={handleGoToPlans}
                        />
                    )}
                    {activeTab === "support" && <DashboardSupportTab />}
                </div>
            </main>
        </DashboardLayout>
    )
}
