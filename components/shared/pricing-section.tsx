"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"
import type { Tariff } from "@/lib/api/types"

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

const getIconForDuration = (duration: number): string => {
    const days = Math.floor(duration / 86400) // seconds to days
    if (days <= 31) return "🌿"
    if (days <= 93) return "🥋"
    if (days <= 186) return "🐉"
    return "👑"
}

const getDurationText = (duration: number): string => {
    const days = Math.floor(duration / 86400)
    if (days <= 31) return "1 месяц"
    if (days <= 93) return "3 месяца"
    if (days <= 186) return "6 месяцев"
    return "12 месяцев"
}

const getDiscount = (duration: number): string | undefined => {
    const days = Math.floor(duration / 86400)
    if (days >= 85 && days <= 93) return "-33%"
    if (days >= 175 && days <= 186) return "-38%"
    if (days >= 350) return "-44%"
    return undefined
}

export default function PricingSection() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTariffs()
    }, [])

    const loadTariffs = async () => {
        try {
            const tariffs = await apiClient.getTariffs()

            const formattedPlans: Plan[] = tariffs.map((tariff: Tariff) => ({
                id: tariff.code,
                name: tariff.name,
                icon: getIconForDuration(tariff.duration_seconds),
                price: (tariff.price_amount / 100).toString(),
                period: getDurationText(tariff.duration_seconds),
                description: tariff.description || "Доступ к VPN серверам",
                highlighted: tariff.code.includes("3") || tariff.code.includes("quarter"),
                discount: getDiscount(tariff.duration_seconds),
            }))

            setPlans(formattedPlans)
            setError(null)
        } catch (err: unknown) {
            // Silently fall back to static data if API is unavailable
            const errorMessage = err instanceof Error ? err.message : "Ошибка загрузки"

            // Only log if it's not a connection or known backend error
            if (!errorMessage.includes("API server unavailable") &&
                !errorMessage.includes("failed to list tariffs")) {
                console.error("Error loading tariffs:", err)
            }

            setError(errorMessage)

            // Fallback to static data
            setPlans([
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
            ])
        } finally {
            setIsLoading(false)
        }
    }

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

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-spin">⚡</div>
                    <p className="text-gray-400">Загрузка тарифов...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.id} className="group">
                            <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col ${plan.highlighted
                                ? "border-2 border-green-500/80 bg-linear-to-br from-green-900/50 via-green-950/40 to-slate-900/90 shadow-2xl shadow-green-500/30"
                                : "border border-slate-700/50 bg-linear-to-br from-slate-800/60 to-slate-900/80 hover:border-slate-600/70 shadow-lg hover:shadow-xl hover:shadow-slate-700/30 hover:scale-[1.02] hover:-translate-y-1"
                                }`}>
                                {plan.highlighted && (
                                    <div className="absolute top-3 right-3 bg-linear-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                                        <span>🌿</span>
                                        <span>Популярный</span>
                                    </div>
                                )}
                                {plan.discount && (
                                    <div className="absolute top-3 left-3 bg-linear-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 text-xs font-extrabold rounded-md shadow-md">
                                        {plan.discount}
                                    </div>
                                )}

                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md ${plan.highlighted
                                        ? "bg-linear-to-br from-green-600/40 to-green-500/30"
                                        : "bg-white/5 border border-white/10"
                                        }`}>
                                        <span className="text-3xl">{plan.icon}</span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold mb-2 text-white h-14 flex items-center">{plan.name}</h3>

                                    <div className="mb-4 h-20 flex flex-col justify-center">
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className={`text-3xl md:text-4xl font-black ${plan.highlighted ? "text-white" : "text-white"}`}>
                                                {plan.price}
                                            </span>
                                            <span className="text-lg text-gray-400 font-medium">₽</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium">{plan.period}</p>
                                    </div>

                                    <p className="text-xs md:text-sm text-gray-300 mb-5 leading-relaxed flex-1 min-h-20">
                                        {plan.description}
                                    </p>

                                    <button className={`w-full py-2.5 md:py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg text-sm md:text-base mt-auto ${plan.highlighted
                                        ? "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95"
                                        : "bg-white/10 text-white hover:bg-white/15 border border-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
                                        }`}>
                                        {plan.highlighted ? "⚡ Выбрать" : "Выбрать"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (error.includes("API server unavailable") || error.includes("failed to list tariffs")) && (
                <div className="mt-4 text-center text-gray-500 text-xs">
                    Режим демонстрации
                </div>
            )}
        </section>
    )
}