export interface Plan {
    id: string
    name: string
    icon: string
    price: string
    period: string
    description: string
    discount?: string
    highlighted?: boolean
}

interface DashboardPlansTabProps {
    plans: Plan[]
}

export default function DashboardPlansTab({ plans }: DashboardPlansTabProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Выберите тариф</h2>
            <p className="text-center text-gray-400 mb-8 text-sm md:text-base">Гибкие тарифы для любых задач</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.id} className="flex">
                        <div className={`relative rounded-xl overflow-hidden transition-all group w-full flex flex-col ${plan.highlighted
                            ? "border-2 border-green-500 bg-linear-to-br from-green-950/60 to-black shadow-xl shadow-green-600/30"
                            : "border border-green-800/30 bg-black/40 hover:border-green-600/60 shadow-lg hover:shadow-green-900/20 hover:scale-[1.02]"
                            }`}>
                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-green-500 to-green-600 text-white px-2.5 py-1 text-xs font-bold rounded-bl-lg shadow-lg">
                                    ⭐ Популярный
                                </div>
                            )}
                            {plan.discount && !plan.highlighted && (
                                <div className="absolute top-0 right-0 bg-linear-to-l from-orange-500 to-red-600 text-white px-2.5 py-1 text-xs font-bold rounded-bl-lg shadow-lg">
                                    {plan.discount}
                                </div>
                            )}
                            <div className="p-6 flex flex-col items-center grow">
                                <div className="text-4xl mb-3 drop-shadow-lg group-hover:scale-110 transition-transform">{plan.icon}</div>
                                <h3 className="text-base font-bold mb-2 text-white text-center h-10 flex items-center justify-center">{plan.name}</h3>
                                <p className="text-xs text-gray-400 mb-3 h-5 flex items-center justify-center">{plan.period}</p>
                                <div className="mb-4 text-xs text-gray-300 text-center h-[60px] flex items-center justify-center">{plan.description}</div>
                                <div className="mb-4 text-center h-10 flex items-center justify-center gap-1">
                                    <span className="text-2xl font-black text-green-400">{plan.price}</span>
                                    <span className="text-xs text-gray-400">₽</span>
                                </div>
                                <div className="mt-auto w-full flex justify-center">
                                    <a
                                        href="https://yookassa.ru/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block text-center rounded-lg py-2.5 px-6 font-semibold transition text-sm w-full ${plan.highlighted
                                            ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-600/40 hover:shadow-xl hover:scale-105"
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

            <div className="mt-6 p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
                <p className="text-sm text-green-400">
                    💡 Все тарифы включают 7 дней бесплатного пробного периода
                </p>
            </div>
        </div>
    )
}
