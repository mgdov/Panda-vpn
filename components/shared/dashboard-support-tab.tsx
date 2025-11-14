import { MessageSquare } from "lucide-react"

export default function DashboardSupportTab() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Свяжитесь с нами</h2>
                <p className="text-gray-400 text-base">Наша команда поддержки всегда готова помочь</p>
            </div>

            <a
                href="https://web.telegram.org/@mgdov"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold shadow-xl shadow-green-600/40 hover:shadow-green-600/60 hover:scale-105 transition-all rounded-xl w-full max-w-sm"
            >
                <MessageSquare size={20} />
                Написать в Telegram
            </a>

            <div className="mt-8 p-4 bg-green-900/20 border border-green-500/50 rounded-xl w-full max-w-sm">
                <p className="text-sm text-green-400 text-center font-semibold flex items-center justify-center gap-2">
                    <span className="text-xl">⚡</span>
                    Быстрая поддержка 24/7
                </p>
            </div>
        </div>
    )
}
