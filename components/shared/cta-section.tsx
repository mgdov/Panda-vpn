import Link from "next/link"

export default function CTASection() {
    return (
        <section className="relative py-32 px-4 overflow-hidden">
            {/* Dramatic background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-linear-to-br from-green-900/30 via-emerald-900/20 to-teal-900/30"></div>
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                {/* Animated badge */}
                <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-4 pulse-glow">
                    <span className="animate-pulse">🎉</span>
                    <span className="text-sm font-bold gradient-text">Специальное предложение</span>
                </div>

                {/* Main heading */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.12]">
                    <span className="gradient-text">Попробуй абсолютно бесплатно</span>
                </h2>

                {/* Subheading */}
                <p className="text-xl sm:text-xl font-semibold text-gray-200 max-w-2xl mx-auto leading-[1.4]">
                    Без привязки карты и регистрации - просто кайф от безопасного и свободного интернета.
                </p>

                {/* CTA Button */}
                <div className="pt-8">
                    <Link
                        href="/auth/signup"
                        className="group inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/45 glow-effect"
                    >
                        <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🚀</span>
                        <span>Попробовать бесплатно</span>
                        <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>

                {/* Social proof */}
                <div className="pt-8 space-y-4">
                    <p className="text-sm font-medium text-gray-300">Нам доверяют:</p>
                    <div className="flex items-center justify-center gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <div className="text-4xl">🏢</div>
                        <div className="text-4xl">🎓</div>
                        <div className="text-4xl">💼</div>
                        <div className="text-4xl">🏠</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
