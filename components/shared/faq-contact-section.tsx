import { MessageSquare } from "lucide-react"

export default function FAQContactSection() {
    return (
        <div className="mt-8 md:mt-10 relative group overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-green-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-5 md:p-6 bg-linear-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg text-center">
                <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-xl bg-linear-to-br from-green-600 to-green-700 mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="text-white" size={24} />
                </div>
                <h2 className="text-lg md:text-xl font-extrabold mb-2 md:mb-3 text-white">Не нашли ответ?</h2>
                <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 leading-relaxed max-w-md mx-auto">
                    Наша служба поддержки всегда готова помочь. Свяжитесь с нами через форму обратной связи.
                </p>
                <a
                    href="https://web.telegram.org/@mgdov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/50 hover:scale-105 transition-all duration-300 text-sm px-5 py-2.5"
                >
                    <MessageSquare size={16} />
                    Написать в поддержку
                </a>
            </div>
        </div>
    )
}
