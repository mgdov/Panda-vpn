export interface Plan {
    id: string
    name: string
    icon: string
    price: string
    period: string
    discount?: string
    highlighted?: boolean
}

interface DashboardPlansTabProps {
    plans: Plan[]
}

export default function DashboardPlansTab({ plans }: DashboardPlansTabProps) {
    return (
        <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 text-center">Выберите свой тариф</h2>
            <p className="text-center text-gray-400 mb-8 md:mb-10 text-base md:text-lg">Гибкие тарифы для любых задач</p>

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
                                <h3 className="text-base md:text-lg font-bold mb-2 text-white text-center">{plan.name}</h3>
                                <div className="mb-2 text-center flex items-end justify-center gap-1">
                                    <span className="text-2xl md:text-3xl font-black text-green-400">{plan.price}</span>
                                    <span className="text-xs text-gray-400">₽</span>
                                </div>
                                <div className="mb-2 text-xs text-gray-500 text-center">{plan.period}</div>
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

            <div className="mt-8 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
                <p className="text-sm text-green-400">
                    💡 Все тарифы включают 7 дней бесплатного пробного периода
                </p>
            </div>
        </div>
    )
}
