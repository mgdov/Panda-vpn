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
        <section id="pricing" className="section-spacing container-wide relative z-10">
            <div className="text-center mb-8 md:mb-16">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-600/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-900/20">
                    <span className="text-3xl md:text-4xl">💰</span>
                    <span className="text-xs md:text-sm font-bold text-green-400 uppercase tracking-wider">Тарифы</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">Выберите свою панду 🐼</h2>
                <p className="text-base md:text-lg text-gray-400">Гибкие тарифы для разных потребностей</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                {plans.map((plan) => (
                    <div key={plan.id}>
                        <div className={`relative rounded-2xl overflow-hidden transition-all group h-full flex flex-col ${plan.highlighted
                            ? "border-2 border-green-500 bg-linear-to-br from-green-950/60 to-black shadow-2xl shadow-green-600/40 scale-105"
                            : "border border-green-800/30 bg-black/40 hover:border-green-600/70 shadow-lg hover:shadow-green-900/30 hover:scale-105"
                            }`}>
                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-green-500 to-green-600 text-white px-3 py-1.5 text-xs font-bold rounded-bl-xl shadow-lg animate-pulse">
                                    ⭐ Популярный
                                </div>
                            )}
                            {plan.discount && !plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-orange-500 to-red-600 text-white px-3 py-1.5 text-xs font-bold rounded-bl-xl shadow-lg">
                                    {plan.discount}
                                </div>
                            )}
                            <div className="p-5 md:p-6 flex flex-col items-center grow">
                                <div className="text-3xl md:text-4xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform">{plan.icon}</div>
                                <h3 className="text-base md:text-lg font-bold mb-1 text-white text-center">{plan.name}</h3>
                                <div className="mb-1 text-xs text-gray-400 text-center">{plan.period}</div>
                                <div className="mb-2 text-xs text-gray-300 text-center">{plan.description}</div>
                                <div className="mb-2 text-center flex items-end justify-center gap-1">
                                    <span className="text-2xl md:text-3xl font-black text-green-400">{plan.price}</span>
                                    <span className="text-xs text-gray-400">₽</span>
                                </div>
                                <div className="mt-auto w-full flex justify-center">
                                    <a
                                        href="https://yookassa.ru/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block text-center rounded-lg py-2 px-4 font-bold transition text-xs md:text-sm ${plan.highlighted
                                            ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-600/50 hover:shadow-2xl hover:scale-105"
                                            : "bg-slate-800 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105"
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

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-900/20 border border-green-500/50 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">🎁</span>
                    <p className="text-sm md:text-base text-green-400 font-semibold">
                        Все тарифы включают 7 дней бесплатного пробного периода
                    </p>
                </div>
            </div>
        </section>
    )
}
