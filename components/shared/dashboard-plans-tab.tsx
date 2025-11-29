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
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-[28px]">Выберите тариф</h2>
            <p className="mb-8 text-sm font-medium text-gray-300">Гибкие предложения под любые сценарии использования</p>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {plans.map((plan) => (
                    <article
                        key={plan.id}
                        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${plan.highlighted
                                ? "border-emerald-400/60 bg-linear-to-br from-emerald-900/40 via-slate-900/70 to-slate-950/80 shadow-2xl shadow-emerald-500/30"
                                : "border-white/10 bg-slate-900/70 hover:border-emerald-400/30 hover:shadow-xl hover:shadow-black/30"
                            }`}
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-emerald-400/60 to-transparent" />

                        {plan.highlighted && (
                            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                                <span>🌿</span>
                                Популярный выбор
                            </div>
                        )}

                        {!plan.highlighted && plan.discount && (
                            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                                {plan.discount}
                            </div>
                        )}

                        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7 lg:p-8">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-lg shadow-black/30 ${plan.highlighted ? "bg-emerald-500/20" : "bg-white/5"}`}>
                                    {plan.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white sm:text-xl">{plan.name}</h3>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/80 sm:text-sm">
                                        {plan.period}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
                                {plan.description}
                            </p>

                            <div className="mt-auto flex items-end justify-between">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white sm:text-4xl">{plan.price}</span>
                                        <span className="text-sm font-semibold text-gray-400">₽</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">в месяц при оплате онлайн</span>
                                </div>
                                <div className="hidden text-sm font-semibold text-emerald-300 sm:block">
                                    Без скрытых платежей
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    // Переход на страницу оплаты с выбранным тарифом
                                    window.location.href = `/dashboard/buy?tariff=${plan.id}`
                                }}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 sm:text-base ${plan.highlighted
                                        ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40 hover:-translate-y-0.5 hover:shadow-xl"
                                        : "bg-white/10 text-white hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-white/15"
                                    }`}
                            >
                                {plan.highlighted ? "✨ Активировать тариф" : "Выбрать тариф"}
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-center text-sm font-medium text-emerald-200">
                💡 Все тарифы включают 7 дней бесплатного доступа и не ограничивают число устройств
            </div>
        </div>
    )
}
