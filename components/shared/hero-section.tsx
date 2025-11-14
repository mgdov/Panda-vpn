import Link from "next/link"
import { ChevronRight, User } from "lucide-react"

interface HeroSectionProps {
    isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
    return (
        <section className="py-12 md:py-16 container-wide relative z-10">
            <div className="max-w-3xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20 hover:scale-105 transition-transform duration-300">
                        <span className="text-lg animate-pulse">✨</span>
                        <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Премиум защита</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                        <span className="text-white drop-shadow-lg">Защита вашей</span>
                        <br />
                        <span className="bg-linear-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text drop-shadow-2xl">
                            конфиденциальности
                        </span>{" "}
                        <span className="inline-block animate-pulse text-3xl md:text-4xl drop-shadow-lg">🔒</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-300 mb-5 leading-relaxed max-w-xl mx-auto">
                        <span className="text-xl mr-1">🐼</span>
                        <span className="font-semibold text-white">Panda VPN</span> — безопасное соединение и полная анонимность в интернете.
                        <span className="block mt-1.5 text-green-400 font-medium text-sm">Защитите свои данные уже сегодня.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="btn-primary flex items-center gap-2 justify-center text-sm md:text-base px-6 py-3 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all duration-300">
                                <User size={18} />
                                Личный кабинет
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/signup" className="btn-primary flex items-center gap-2 justify-center text-sm md:text-base px-6 py-3 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all duration-300 group">
                                    Начать сейчас 🚀 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="#pricing" className="btn-secondary text-sm md:text-base px-6 py-3 transform hover:scale-105 transition-all duration-300">
                                    Узнать больше 👇
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
