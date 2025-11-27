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

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
        }
    }, [isAuthenticated, loadData])

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
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 bg-linear-to-r from-white to-green-400 bg-clip-text text-transparent">
                        Добро пожаловать, {userEmail.split("@")[0]}!
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Управляйте вашим VPN аккаунтом
                    </p>
                </div>

                <StatsGrid keysCount={vpnKeys.length} />

                <div className="bg-white/5 backdrop-blur-xl border border-green-700/20 rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8">
                    {activeTab === "plans" && <DashboardPlansTab plans={plans} />}
                    {activeTab === "keys" && (
                        <DashboardKeysTab
                            vpnKeys={vpnKeys}
                            copiedKey={copiedText}
                            onCopyKey={copyToClipboard}
                        />
                    )}
                    {activeTab === "support" && <DashboardSupportTab />}
                </div>
            </main>
        </DashboardLayout>
    )
}
