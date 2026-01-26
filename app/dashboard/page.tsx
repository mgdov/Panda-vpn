"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
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

function DashboardPageContent() {
    const { isAuthenticated, userEmail, isLoading: authLoading, logout } = useAuth()
    const { plans, vpnKeys, loadData, plansError, keysError } = useDashboardData()
    const { copiedText, copyToClipboard } = useClipboard(2000, loadData)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

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

    // Подгружаем ключи при переключении на вкладку «keys», если пользователь уже авторизован
    useEffect(() => {
        if (!isAuthenticated) return
        if (activeTab !== "keys") return
        loadData()
    }, [isAuthenticated, activeTab, loadData])

    // Короткое авто-обновление вкладки «Ключи» после возвращения/оплаты, чтобы новые ключи подхватывались без F5
    useEffect(() => {
        if (!isAuthenticated || activeTab !== "keys") return

        let attempts = 0
        let inFlight = false
        const maxAttempts = 6 // ~30 секунд при шаге 5с

        const tick = async () => {
            if (inFlight) return
            inFlight = true
            attempts += 1
            try {
                await loadData()
            } finally {
                inFlight = false
                if (attempts >= maxAttempts && intervalId) {
                    clearInterval(intervalId)
                }
            }
        }

        const intervalId: ReturnType<typeof setInterval> = setInterval(tick, 5000)
        tick()

        return () => clearInterval(intervalId)
    }, [isAuthenticated, activeTab, loadData])

    // Обновляем данные при возврате на вкладку/фокус, чтобы новые ключи появлялись без ручного F5
    useEffect(() => {
        if (!isAuthenticated) return

        const handleFocus = () => {
            loadData()
        }

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') handleFocus()
        }

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [isAuthenticated, loadData])

    useEffect(() => {
        const tabParam = searchParams?.get("tab")
        if (tabParam === "plans" || tabParam === "keys" || tabParam === "support") {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    useEffect(() => {
        if (!searchParams) return
        const currentTabParam = searchParams.get("tab")
        if ((activeTab === "plans" && currentTabParam === null) || currentTabParam === activeTab) {
            return
        }

        const params = new URLSearchParams(searchParams.toString())
        if (activeTab === "plans") {
            params.delete("tab")
        } else {
            params.set("tab", activeTab)
        }

        const query = params.toString()
        const target = query ? `${pathname}?${query}` : pathname
        router.replace(target, { scroll: false })
    }, [activeTab, router, pathname, searchParams])

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
            // Автоматически переключаемся на вкладку ключей при успешной оплате
            setActiveTab("keys")

            // Синхронизируем последний платеж и обрабатываем его
            const syncAndLoad = async () => {
                try {
                    // Показываем сообщение об успехе сразу
                    setPaymentSuccess(true)

                    // Небольшая задержка для того чтобы платеж успел обработаться на сервере
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Синхронизируем статус последнего платежа (до 5 попыток)
                    let syncResult = null
                    for (let attempt = 0; attempt < 5; attempt++) {
                        try {
                            syncResult = await apiClient.syncLatestPayment()
                            console.log(`Payment sync attempt ${attempt + 1} result:`, syncResult)

                            // Обновляем данные после каждой попытки
                            await loadData()

                            // Если платеж обработан или уже обработан - выходим
                            if (syncResult.status === "success" || syncResult.status === "already_processed") {
                                console.log("Payment successfully processed!")
                                break
                            }

                            // Если платеж еще pending, ждем и пробуем еще раз
                            if (attempt < 4 && syncResult.status === "pending") {
                                console.log("Payment still pending, retrying...")
                                await new Promise(resolve => setTimeout(resolve, 2000))
                                continue
                            }
                        } catch (error) {
                            console.error(`Payment sync attempt ${attempt + 1} failed:`, error)
                            if (attempt < 4) {
                                await new Promise(resolve => setTimeout(resolve, 2000))
                                continue
                            }
                        }
                    }

                    // Финальное обновление данных
                    await loadData()

                    // Скрываем сообщение через 5 секунд
                    setTimeout(() => setPaymentSuccess(false), 5000)
                } catch (error) {
                    console.error("Failed to sync payment:", error)
                    // В любом случае обновляем данные
                    await loadData()
                    // Скрываем сообщение при ошибке
                    setTimeout(() => setPaymentSuccess(false), 3000)
                }
            }

            syncAndLoad()
            // Убираем параметр payment из URL, но оставляем tab=keys
            const newParams = new URLSearchParams(params)
            newParams.delete("payment")
            newParams.set("tab", "keys")
            const newQuery = newParams.toString()
            const newUrl = `/dashboard?${newQuery}`
            window.history.replaceState({}, "", newUrl)
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

export default function DashboardPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardPageContent />
        </Suspense>
    )
}
