import Link from "next/link"
import { ChevronRight, User } from "lucide-react"

interface HeroSectionProps {
    isAuthenticated: boolean
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
    return (
        <section className="section-spacing container-wide relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20 hover:scale-105 transition-transform">
                        <span className="text-xl md:text-2xl animate-pulse">✨</span>
                        <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">Премиум защита</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                        <span className="text-white drop-shadow-lg">Защита вашей</span>
                        <br />
                        <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text drop-shadow-2xl">
                            конфиденциальности
                        </span>{" "}
                        <span className="inline-block animate-pulse text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">🔒</span>
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
                        <span className="text-2xl mr-2">🐼</span>
                        <span className="font-bold text-white">Panda VPN</span> — безопасное соединение и полная анонимность в интернете.
                        <span className="block mt-2 text-green-400 font-semibold">Защитите свои данные уже сегодня.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="btn-primary flex items-center gap-2 justify-center text-base md:text-lg px-8 py-4 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all">
                                <User size={22} />
                                Личный кабинет
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/signup" className="btn-primary flex items-center gap-2 justify-center text-base md:text-lg px-8 py-4 shadow-xl shadow-green-900/30 hover:shadow-green-900/50 transform hover:scale-105 transition-all">
                                    Начать сейчас 🚀 <ChevronRight size={22} />
                                </Link>
                                <Link href="#pricing" className="btn-secondary text-base md:text-lg px-8 py-4 transform hover:scale-105 transition-all">
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
