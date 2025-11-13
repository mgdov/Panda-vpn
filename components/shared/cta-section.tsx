import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CTASection() {
    return (
        <section className="section-spacing bg-gradient-to-r from-green-950/30 via-black to-green-950/30 border-y border-green-700/30 shadow-lg relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-50"></div>
            <div className="container-wide text-center relative z-10">
                <div className="mb-4 text-3xl md:text-4xl animate-bounce">🎉</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">Готовы присоединиться? 🔓</h2>
                <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8">Первый месяц со скидкой 50% 🎁</p>
                <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 shadow-2xl shadow-green-900/40 hover:shadow-green-900/60">
                    Создать аккаунт 🎯 <ChevronRight size={20} />
                </Link>
            </div>
        </section>
    )
}
