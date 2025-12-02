import Link from "next/link"
import { CreditCard, Key, MessageSquare, LogOut, User } from "lucide-react"
import { memo, useCallback } from "react"

interface DashboardSidebarProps {
    activeTab: "plans" | "keys" | "support"
    setActiveTab: (tab: "plans" | "keys" | "support") => void
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    userEmail: string
    onLogout: () => void
}

const DashboardSidebar = memo(function DashboardSidebar({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    userEmail,
    onLogout,
}: DashboardSidebarProps) {
    const handleTabChange = useCallback((tab: "plans" | "keys" | "support") => {
        setActiveTab(tab)
        setSidebarOpen(false)
    }, [setActiveTab, setSidebarOpen])

    const handleOverlayClick = useCallback(() => {
        setSidebarOpen(false)
    }, [setSidebarOpen])

    return (
        <>
            {/* Overlay для мобильных устройств */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
                    onClick={handleOverlayClick}
                />
            )}

            <aside className={`fixed z-30 top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-2xl border-r border-green-700/20 shadow-2xl shadow-green-900/30 flex flex-col items-center transition-transform duration-200 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <Link href="/" className="flex flex-col items-center gap-1.5 py-6 w-full border-b border-green-800/20 hover:bg-green-900/10 transition-all group">
                    <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🐼</span>
                    <span className="font-extrabold text-lg text-white tracking-wide group-hover:text-green-400 transition-colors">Panda VPN</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-1.5 mt-5 w-full items-center px-3">
                    <button
                        onClick={() => handleTabChange('plans')}
                        className={`flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'plans' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-900/40' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Тарифы"
                    >
                        <CreditCard size={18} />
                        <span className="font-semibold">Тарифы</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('keys')}
                        className={`flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'keys' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-900/40' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Мои ключи"
                    >
                        <Key size={18} />
                        <span className="font-semibold">Ключи</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('support')}
                        className={`flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'support' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-900/40' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Поддержка"
                    >
                        <MessageSquare size={18} />
                        <span className="font-semibold">Поддержка</span>
                    </button>
                </nav>

                <div className="mt-auto w-full flex flex-col items-center gap-2.5 py-5 px-3 border-t border-green-800/20">
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-900/50 px-2.5 py-1.5 rounded-lg w-full justify-center">
                        <User size={12} />
                        <span className="truncate max-w-40">{userEmail}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-2 w-full justify-center text-xs text-white hover:text-accent transition-all duration-300 rounded-lg bg-linear-to-r from-red-600 to-red-700 shadow-lg hover:shadow-red-900/50 font-semibold hover:scale-105"
                    >
                        <LogOut size={14} />
                        <span>Выход</span>
                    </button>
                </div>
            </aside>
        </>
    )
})

export default DashboardSidebar
