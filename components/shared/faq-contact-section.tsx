import { MessageSquare } from "lucide-react"

export default function FAQContactSection() {
    return (
        <div className="mt-12 md:mt-16 relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-2xl hover:border-green-600/60 transition-all duration-300 shadow-xl text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-600 to-green-700 mb-4 shadow-lg">
                    <MessageSquare className="text-white" size={32} />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold mb-3 md:mb-4 text-white">Не нашли ответ?</h2>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed max-w-md mx-auto">
                    Наша служба поддержки всегда готова помочь. Свяжитесь с нами через форму обратной связи.
                </p>
                <a
                    href="https://web.telegram.org/@mgdov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 hover:scale-105 transition-all"
                >
                    <MessageSquare size={18} />
                    Написать в поддержку
                </a>
            </div>
        </div>
    )
}
