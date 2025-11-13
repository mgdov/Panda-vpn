import { MessageSquare } from "lucide-react"

export default function DashboardSupportTab() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center mb-12">
                <div className="text-7xl mb-6 animate-bounce">💬</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Свяжитесь с нами</h2>
                <p className="text-gray-400 text-lg">Наша команда поддержки всегда готова помочь</p>
            </div>

            <a
                href="https://web.telegram.org/@mgdov"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-4 px-10 py-5 text-xl font-bold shadow-2xl shadow-green-600/50 hover:shadow-green-600/70 transform hover:scale-110 transition-all rounded-2xl"
            >
                <MessageSquare size={28} />
                Написать в Telegram
            </a>

            <div className="mt-12 p-6 bg-green-900/20 border border-green-500/50 rounded-2xl max-w-lg">
                <p className="text-base text-green-400 text-center font-semibold flex items-center justify-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Быстрая поддержка 24/7
                </p>
            </div>
        </div>
    )
}
