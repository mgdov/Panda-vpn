import Link from "next/link"
import { CreditCard, Key, MessageSquare, LogOut, User } from "lucide-react"

interface DashboardSidebarProps {
    activeTab: "plans" | "keys" | "support"
    setActiveTab: (tab: "plans" | "keys" | "support") => void
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    userEmail: string
    onLogout: () => void
}

export default function DashboardSidebar({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    userEmail,
    onLogout,
}: DashboardSidebarProps) {
    return (
        <>
            {/* Overlay для мобильных устройств */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`fixed z-30 top-0 left-0 h-screen w-64 bg-white/5 backdrop-blur-2xl border-r border-green-700/20 shadow-2xl shadow-green-900/30 flex flex-col items-center transition-transform duration-200 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <Link href="/" className="flex flex-col items-center gap-2 py-8 w-full border-b border-green-800/20 hover:bg-green-900/10 transition-all group">
                    <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">🐼</span>
                    <span className="font-extrabold text-xl text-white tracking-wide group-hover:text-green-400 transition-colors">Panda VPN</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-2 mt-6 w-full items-center px-4">
                    <button
                        onClick={() => { setActiveTab('plans'); setSidebarOpen(false); }}
                        className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all font-medium ${activeTab === 'plans' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Тарифы"
                    >
                        <CreditCard size={20} />
                        <span className="text-sm font-semibold">Тарифы</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('keys'); setSidebarOpen(false); }}
                        className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all font-medium ${activeTab === 'keys' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Мои ключи"
                    >
                        <Key size={20} />
                        <span className="text-sm font-semibold">Ключи</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('support'); setSidebarOpen(false); }}
                        className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all font-medium ${activeTab === 'support' ? 'bg-linear-to-br from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-green-700/20'}`}
                        title="Поддержка"
                    >
                        <MessageSquare size={20} />
                        <span className="text-sm font-semibold">Поддержка</span>
                    </button>
                </nav>

                <div className="mt-auto w-full flex flex-col items-center gap-3 py-6 px-4 border-t border-green-800/20">
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-900/50 px-3 py-1.5 rounded-lg w-full justify-center">
                        <User size={12} />
                        <span className="truncate max-w-[160px]">{userEmail}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2.5 w-full justify-center text-xs text-white hover:text-accent transition rounded-lg bg-linear-to-r from-red-600 to-red-700 shadow-lg hover:shadow-red-900/50 font-semibold hover:scale-105"
                    >
                        <LogOut size={16} />
                        <span>Выход</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
