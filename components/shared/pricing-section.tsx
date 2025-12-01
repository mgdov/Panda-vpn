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
    const days = Math.floor(duration / 86400)
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
        setIsLoading(true)
        setError(null)
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
            if (formattedPlans.length === 0) {
                setError("Сервер вернул пустой список тарифов")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Не удалось загрузить тарифы"
            setPlans([])
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="relative py-16 sm:py-20 px-4" id="pricing">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-4">
                        <span>💎</span>
                        <span className="text-sm font-semibold gradient-text">Прозрачные цены</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className="gradient-text">Выберите свой план</span>
                    </h2>
                    <p className="text-base text-gray-400 max-w-2xl mx-auto leading-snug">
                        Никаких скрытых платежей. Отменить можно в любой момент.
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-16 text-center">
                        <div className="inline-block text-5xl animate-bounce">🐼</div>
                        <p className="text-gray-400 mt-4">Загрузка тарифов...</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-2xl">
                            ⚠️
                        </div>
                        <p className="text-base text-red-200 mb-2">Не удалось загрузить тарифы</p>
                        <p className="text-sm text-red-300/80">{error}</p>
                        <button
                            onClick={loadTariffs}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:border-red-300/60 hover:text-red-50"
                        >
                            Повторить попытку
                        </button>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="py-12 text-center text-yellow-100">
                        <p className="text-base mb-2">Сервер не вернул доступные тарифы.</p>
                        <p className="text-sm text-yellow-50/80">Попробуйте обновить страницу позже.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={`group relative glass-effect rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer ${plan.highlighted
                                    ? "ring-2 ring-green-500 shadow-2xl shadow-green-500/30"
                                    : "hover:shadow-xl hover:shadow-green-500/20"
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Popular badge */}
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-linear-to-r from-green-500 to-emerald-500 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                                            ⭐ Популярный
                                        </div>
                                    </div>
                                )}

                                {/* Discount badge */}
                                {plan.discount && (
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full text-red-400 text-xs font-bold">
                                            {plan.discount}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Icon */}
                                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                        {plan.icon}
                                    </div>

                                    {/* Plan name */}
                                    <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                                        {plan.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="space-y-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black gradient-text">{plan.price}</span>
                                            <span className="text-gray-400 text-lg">₽</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">{plan.period}</p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-400 leading-relaxed min-h-16">
                                        {plan.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted
                                            ? "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-105"
                                            : "glass-effect text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {plan.highlighted ? "Выбрать план 🚀" : "Купить →"}
                                    </button>
                                </div>

                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Features list */}
                <div className="mt-16 glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold gradient-text text-center mb-8">
                        Все планы включают:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            "⚡ Безлимитная скорость",
                            "🌍 Доступ ко всем серверам",
                            "🔒 AES-256 шифрование",
                            "📱 Все устройства",
                            "🚫 Без логов",
                            "💬 24/7 поддержка",
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <span className="text-xl">{feature.split(" ")[0]}</span>
                                <span>{feature.split(" ").slice(1).join(" ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
