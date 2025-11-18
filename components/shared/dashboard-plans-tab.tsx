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

import PaymentButton from "@/components/payment-button"

export default function DashboardPlansTab({ plans }: DashboardPlansTabProps) {
    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 text-center">Выберите тариф</h2>
            <p className="text-center text-gray-400 mb-6 text-xs md:text-sm">Гибкие тарифы для любых задач</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.id} className="flex">
                        <div className={`relative rounded-xl overflow-hidden transition-all duration-300 group w-full flex flex-col ${plan.highlighted
                            ? "border-2 border-green-500 bg-linear-to-br from-green-950/60 to-black shadow-xl shadow-green-600/30"
                            : "border border-green-800/30 bg-black/40 hover:border-green-600/60 shadow-lg hover:shadow-green-900/20 hover:scale-[1.02] hover:-translate-y-0.5"
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
                            <div className="p-6 md:p-7 flex flex-col items-center grow">
                                <div className="text-4xl mb-3 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{plan.icon}</div>
                                <h3 className="text-base md:text-lg font-bold mb-2 text-white text-center min-h-12 flex items-center justify-center">{plan.name}</h3>
                                <p className="text-sm text-gray-400 mb-3 h-6 flex items-center justify-center">{plan.period}</p>
                                <div className="mb-4 text-sm text-gray-300 text-center min-h-16 flex items-center justify-center px-2">{plan.description}</div>
                                <div className="mb-4 text-center h-12 flex items-center justify-center gap-1.5">
                                    <span className="text-3xl font-black text-green-400">{plan.price}</span>
                                    <span className="text-sm text-gray-400">₽</span>
                                </div>
                                <div className="mt-auto w-full flex justify-center">
                                    <div className={`inline-block w-full ${plan.highlighted
                                        ? "shadow-lg shadow-green-600/40 hover:shadow-xl"
                                        : ""}`}>
                                        <PaymentButton tariffCode={plan.id} label={plan.highlighted ? "✨ Выбрать" : "Выбрать"} />
                                    </div>
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
