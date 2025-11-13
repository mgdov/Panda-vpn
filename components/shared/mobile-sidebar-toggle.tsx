import { Menu, X } from "lucide-react"

interface MobileSidebarToggleProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export default function MobileSidebarToggle({ sidebarOpen, setSidebarOpen }: MobileSidebarToggleProps) {
    return (
        <button
            className="fixed z-40 top-4 left-4 md:hidden bg-green-800/90 hover:bg-green-700 text-white p-2.5 rounded-lg shadow-lg transition-all hover:scale-105"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Закрыть меню" : "Открыть меню"}
        >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
    )
}
