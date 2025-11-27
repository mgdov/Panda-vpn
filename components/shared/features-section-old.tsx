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
        <section className="py-12 md:py-16 bg-card-bg border-t border-b border-border">
            <div className="container-wide">
                <div className="text-center mb-8">
                    <span className="text-2xl md:text-3xl mb-3 block">⭐</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Почему выбирают Panda VPN</h2>
                    <p className="text-xs md:text-sm text-gray-400">Всё необходимое для безопасного интернета</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="relative group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute inset-0 bg-linear-to-br from-green-600/20 to-green-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative  p-5 md:p-6 bg-linear-to-br from-slate-900 to-slate-800 border border-green-700/30 rounded-xl hover:border-green-600/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-900/30 h-full flex flex-col">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-green-600 to-green-700 mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed grow">
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
