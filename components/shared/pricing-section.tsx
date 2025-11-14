import PricingCard from "@/components/shared/pricing-card"

interface Plan {
    id: string
    name: string
    icon: string
    price: string
    period: string
    description: string
    discount?: string
    highlighted?: boolean
}

const plans: Plan[] = [
    {
        id: "1month",
        name: "Тариф Бамбук",
        icon: "🌿",
        price: "149",
        period: "1 месяц",
        description: "Лёгкий, как первый шаг Панды на путь воина. Для тех, кто хочет попробовать и понять силу сервиса.",
        discount: "",
        highlighted: false,
    },
    {
        id: "3months",
        name: "Ученик Боевого Панды",
        icon: "🥋",
        price: "299",
        period: "3 месяца",
        description: "Входит во вкус, начинает тренировку. Популярный тариф — баланс силы и выгоды.",
        discount: "-33%",
        highlighted: true,
    },
    {
        id: "6months",
        name: "Воин Дракона",
        icon: "🐉",
        price: "549",
        period: "6 месяцев",
        description: "Тариф для тех, кто не отступает. Выбор тех, кто хочет стабильности и максимальной защиты.",
        discount: "-38%",
        highlighted: false,
    },
    {
        id: "1year",
        name: "Легендарный Мастер",
        icon: "👑",
        price: "999",
        period: "12 месяцев",
        description: "Год абсолютного спокойствия. Сила. Мудрость. Стабильность. Лучший тариф для настоящих мастеров.",
        discount: "-44%",
        highlighted: false,
    },
]

export default function PricingSection() {
    return (
        <section id="pricing" className="py-12 md:py-16 container-wide relative z-10">
            <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
                    <span className="text-2xl">💰</span>
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Тарифы</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent">Выберите свою панду 🐼</h2>
                <p className="text-sm md:text-base text-gray-400">Гибкие тарифы для разных потребностей</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.id} className="group">
                        <div className={`relative rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col ${plan.highlighted
                            ? "border-2 border-green-500 bg-linear-to-br from-green-950/60 to-black shadow-xl shadow-green-600/40 scale-[1.02]"
                            : "border border-green-800/30 bg-black/40 hover:border-green-600/70 shadow-lg hover:shadow-xl hover:shadow-green-900/30 hover:scale-[1.02] hover:-translate-y-1"
                            }`}>
                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-green-500 to-green-600 text-white px-2.5 py-1 text-xs font-bold rounded-bl-lg shadow-lg animate-pulse">
                                    ⭐ Популярный
                                </div>
                            )}
                            {plan.discount && !plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-orange-500 to-red-600 text-white px-2.5 py-1 text-xs font-bold rounded-bl-lg shadow-lg">
                                    {plan.discount}
                                </div>
                            )}
                            <div className="p-4 md:p-5 flex flex-col items-center grow">
                                <div className="text-3xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{plan.icon}</div>
                                <h3 className="text-sm md:text-base font-bold mb-1 text-white text-center">{plan.name}</h3>
                                <div className="mb-1 text-xs text-gray-400 text-center">{plan.period}</div>
                                <div className="mb-2 text-xs text-gray-300 text-center min-h-12 flex items-center px-2">{plan.description}</div>
                                <div className="mb-3 text-center flex items-baseline justify-center gap-1">
                                    <span className="text-2xl font-black text-green-400">{plan.price}</span>
                                    <span className="text-xs text-gray-400">₽</span>
                                </div>
                                <div className="mt-auto w-full flex justify-center">
                                    <a
                                        href="https://yookassa.ru/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block text-center rounded-lg py-2 px-4 font-semibold transition-all duration-300 text-xs md:text-sm w-full ${plan.highlighted
                                            ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-600/50 hover:shadow-xl hover:scale-105"
                                            : "bg-slate-800 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105"
                                            }`}
                                    >
                                        {plan.highlighted ? "✨ Выбрать" : "Выбрать"}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/50 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <span className="text-xl">🎁</span>
                    <p className="text-xs md:text-sm text-green-400 font-medium">
                        Все тарифы включают 7 дней бесплатного пробного периода
                    </p>
                </div>
            </div>
        </section>
    )
}
