import { MessageSquare } from "lucide-react"

export default function DashboardSupportTab() {
    return (
        <div className="flex flex-col items-center justify-center py-8 md:py-10">
            <div className="text-center mb-6">
                <div className="text-5xl mb-3 animate-float">💬</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Свяжитесь с нами</h2>
                <p className="text-gray-400 text-xs md:text-sm">Наша команда поддержки всегда готова помочь</p>
            </div>

            <a
                href="https://web.telegram.org/@mgdov"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2.5 px-6 py-3 text-sm md:text-base font-semibold shadow-lg shadow-green-600/40 hover:shadow-xl hover:shadow-green-600/60 hover:scale-105 transition-all duration-300 rounded-lg w-full max-w-sm group"
            >
                <MessageSquare size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                Написать в Telegram
            </a>

            <div className="mt-6 p-3 bg-green-900/20 border border-green-500/50 rounded-lg w-full max-w-sm hover:scale-105 transition-transform duration-300">
                <p className="text-xs md:text-sm text-green-400 text-center font-medium flex items-center justify-center gap-2">
                    <span className="text-lg animate-pulse">⚡</span>
                    Быстрая поддержка 24/7
                </p>
            </div>
        </div>
    )
}
