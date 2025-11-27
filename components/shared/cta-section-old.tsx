import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CTASection() {
    return (
        <section className="py-12 md:py-16 bg-linear-to-r from-green-950/30 via-black to-green-950/30 border-y border-green-700/30 shadow-lg relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-green-600/5 to-transparent opacity-50"></div>
            <div className="container-wide text-center relative z-10">
                <div className="mb-3 text-2xl animate-bounce">🎉</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 bg-linear-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">Готовы присоединиться? 🔓</h2>
                <p className="text-sm md:text-base text-gray-300 mb-5">Первый месяц со скидкой 50% 🎁</p>
                <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 shadow-xl shadow-green-900/40 hover:shadow-green-900/60 transition-all duration-300 text-sm md:text-base px-6 py-3 group">
                    Создать аккаунт 🎯 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    )
}
