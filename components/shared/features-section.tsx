import { Shield, Zap, MessageCircle } from "lucide-react"

interface Feature {
    icon: typeof Zap
    title: string
    description: string
}

const features: Feature[] = [
    {
        icon: Zap,
        title: "Максимальная скорость",
        description: "Высокая пропускная способность без ограничений. Наслаждайтесь молниеносной скоростью.",
    },
    {
        icon: Shield,
        title: "Абсолютная защита",
        description: "Военное шифрование AES-256. Ваши данные в безопасности 24/7.",
    },
    {
        icon: MessageCircle,
        title: "24/7 Поддержка",
        description: "Быстрая помощь на русском языке. Мы всегда рядом с вами.",
    },
]

export default function FeaturesSection() {
    return (
        <section className="section-spacing bg-card-bg border-t border-b border-border">
            <div className="container-wide">
                <div className="text-center mb-8 md:mb-12">
                    <span className="text-3xl md:text-4xl mb-4 block">⭐</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Почему выбирают Panda VPN</h2>
                    <p className="text-sm md:text-base text-gray-400">Всё необходимое для безопасного интернета</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="relative group overflow-hidden rounded-2xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-2xl hover:border-green-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-green-900/30 h-full flex flex-col">
                                    <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-sm md:text-base text-gray-400 leading-relaxed grow">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
