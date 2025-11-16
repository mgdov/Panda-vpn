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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 ">Выберите тариф</h2>
            <p className=" text-gray-400 mb-6 text-xs md:text-sm">Гибкие тарифы для любых задач</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 max-w-7xl ">
                {plans.map((plan) => (
                    <div key={plan.id} className="flex">
                        <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 group w-full flex flex-col ${plan.highlighted
                            ? "border-2 border-green-500/80 bg-linear-to-br from-green-900/50 via-green-950/40 to-slate-900/90 shadow-2xl shadow-green-500/30"
                            : "border border-slate-700/50 bg-linear-to-br from-slate-800/60 to-slate-900/80 hover:border-slate-600/60 shadow-lg hover:shadow-slate-700/20 hover:scale-[1.02] hover:-translate-y-0.5"
                            }`}>
                            {plan.highlighted && (
                                <div className="absolute top-3 right-3 bg-linear-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                                    <span>🌿</span>
                                    <span>Популярный</span>
                                </div>
                            )}
                            {plan.discount && !plan.highlighted && (
                                <div className="absolute top-3 right-3 bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg">
                                    {plan.discount}
                                </div>
                            )}
                            <div className="p-6 md:p-7 flex flex-col items-start grow">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl mb-4 ${plan.highlighted ? 'bg-green-500/20' : 'bg-slate-700/50'} group-hover:scale-110 transition-transform duration-300`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-base md:text-lg font-bold mb-2 text-white">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-3">{plan.period}</p>
                                <div className="mb-4 text-sm text-gray-300 leading-relaxed grow">{plan.description}</div>
                                <div className="mb-4 flex items-baseline gap-1.5">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-sm text-gray-400">₽</span>
                                </div>
                                <div className="w-full">
                                    <a
                                        href="https://yookassa.ru/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block text-center rounded-xl py-3 px-6 font-semibold transition-all duration-300 text-sm md:text-base ${plan.highlighted
                                            ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40 hover:shadow-xl hover:scale-105"
                                            : "bg-slate-700/80 text-white hover:bg-slate-600 hover:shadow-lg hover:scale-105 border border-slate-600/50"
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

            <div className="mt-5 p-2.5 bg-green-900/20 border border-green-500/50 rounded-lg text-center">
                <p className="text-xs text-green-400">
                    💡 Все тарифы включают 7 дней бесплатного пробного периода
                </p>
            </div>
        </div>
    )
}
