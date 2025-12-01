import Link from "next/link"
import { ChevronRight, User } from "lucide-react"

interface HeroSectionProps {
    isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden py-16 sm:py-20">
            <div className="absolute inset-0">
                <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-green-500/15 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
                <div className="absolute bottom-[-120px] left-1/5 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
                <div className="space-y-5">
                    <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-gray-100 ring-1 ring-green-500/40">
                        <span className="text-base">🐼</span>
                        Panda VPN — надёжный доступ в любое время
                    </div>

                    <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-[40px]">
                        Свобода интернета без блокировок и компромиссов
                    </h1>

                    <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-gray-200 sm:text-lg">
                        Подключайтесь к премиальным VPN-серверам за секунды, защищайте данные и обходите ограничения в
                        один клик на всех устройствах.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                href="/auth/signup"
                                className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/35"
                            >
                                Попробовать бесплатно
                                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-200 transition-all duration-300 hover:border-white/25 hover:text-white"
                            >
                                Уже есть аккаунт
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/35"
                        >
                            <User size={16} />
                            Войти в личный кабинет
                        </Link>
                    )}
                </div>

                <div className="grid w-full max-w-3xl grid-cols-1 gap-3 text-sm font-medium text-gray-200 sm:grid-cols-3">
                    {[
                        "⚡ Подключение за 30 секунд",
                        "🔒 AES-256 и отсутствие логов",
                        "🌍 40+ стран и стабильная скорость",
                    ].map((item) => (
                        <div key={item} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                            <span className="font-semibold text-white">{item.split(" ")[0]}</span>
                            <span className="text-gray-100">{item.split(" ").slice(1).join(" ")}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
