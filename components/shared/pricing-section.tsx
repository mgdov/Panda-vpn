"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
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

const SLIDER_INTERVAL = 6000

const getSlidesPerView = () => {
    if (typeof window === "undefined") {
        return 1
    }

    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
}

interface PricingSectionProps {
    isAuthenticated: boolean
}


export default function PricingSection({ isAuthenticated }: PricingSectionProps) {
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isSliding, setIsSliding] = useState(true)
    const [slidesPerView, setSlidesPerView] = useState(1)
    const router = useRouter()

    const loadTariffs = useCallback(async () => {
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
                setError("Тарифы временно недоступны")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Тарифы временно недоступны"
            setPlans([])
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadTariffs()
    }, [loadTariffs])

    useEffect(() => {
        setSlidesPerView(getSlidesPerView())

        const handleResize = () => {
            setSlidesPerView(getSlidesPerView())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const shouldUseSlider = plans.length > slidesPerView
    const sliderPlans = useMemo(() => {
        return shouldUseSlider ? [...plans, ...plans.slice(0, slidesPerView)] : plans
    }, [plans, slidesPerView, shouldUseSlider])
    const normalizedSlide = plans.length > 0 ? activeSlide % plans.length : 0

    useEffect(() => {
        setActiveSlide(0)
        setIsSliding(true)
    }, [slidesPerView, plans.length])

    useEffect(() => {
        if (!shouldUseSlider) {
            setActiveSlide(0)
            setIsSliding(true)
            return
        }

        const id = setInterval(() => {
            setIsSliding(true)
            setActiveSlide((prev) => prev + 1)
        }, SLIDER_INTERVAL)

        return () => clearInterval(id)
    }, [shouldUseSlider, plans.length])

    useEffect(() => {
        if (!shouldUseSlider || isSliding) {
            return
        }

        const id = requestAnimationFrame(() => setIsSliding(true))
        return () => cancelAnimationFrame(id)
    }, [isSliding, shouldUseSlider])
    
    const handleSliderTransitionEnd = () => {
        if (!shouldUseSlider) {
            return
        }

        if (activeSlide >= plans.length) {
            setIsSliding(false)
            setActiveSlide(0)
        }
    }

    const handlePlanCTA = () => {
        if (isAuthenticated) {
            router.push("/dashboard/buy")
        } else {
            router.push("/auth/signup")
        }
    }

    const renderPlanCard = (plan: Plan) => {
        const perks = [
            "Моментальное подключение",
            "Работает на всех устройствах",
            "Отмена в любой момент",
        ]

        return (
            <div
                className={`group relative flex h-full flex-col justify-between rounded-[28px] border p-5 pt-8 sm:p-6 sm:pt-10 transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl ${plan.highlighted
                    ? "border-emerald-300/70 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-emerald-200/50"}
                `}
            >
                {plan.highlighted && (
                    <div className="absolute top-2 right-4 rounded-full bg-linear-to-r from-emerald-500 to-green-500 px-5 py-1 text-xs font-semibold text-white shadow-lg">
                        ⭐ Популярный
                    </div>
                )}

                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 text-left">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl sm:text-3xl">
                            {plan.icon}
                        </span>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">Тариф</p>
                            <h3 className="text-base font-bold text-white sm:text-lg">{plan.name}</h3>
                            <p className="text-xs text-gray-400 sm:text-sm">{plan.period}</p>
                        </div>
                    </div>
                    {plan.discount && (
                        <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
                            {plan.discount}
                        </span>
                    )}
                </div>

                <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-white sm:text-4xl">{plan.price}</span>
                        <div className="text-xs text-gray-300 sm:text-sm">
                            ₽
                            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                                за {plan.period.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-sm text-gray-300">
                    {plan.description}
                </p>

                <ul className="mt-4 space-y-2 text-sm text-gray-200">
                    {perks.map((perk) => (
                        <li key={`${plan.id}-${perk}`} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            <span>{perk}</span>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${plan.highlighted
                        ? "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/40 hover:-translate-y-0.5"
                        : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                    onClick={handlePlanCTA}
                >
                    {plan.highlighted ? "Выбрать план 🚀" : "Купить VPN"}
                </button>
            </div>
        )
    }

    return (
        <section className="relative py-16 sm:py-20 px-4" id="pricing">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-10 text-center space-y-2">

                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-100/80">
                        <span className="text-base">💎</span>
                        Прозрачные цены
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        <span className="gradient-text">Выбери свой идеальный тариф👇🏻</span>
                    </h2>
                    <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                        Никаких скрытых платежей. чем больше срок, тем больше скидка 😎
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
                        <p className="text-base text-red-200 mb-2">Тарифы временно недоступны</p>
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
                        <p className="text-base mb-2">Тарифы временно недоступны</p>
                        <p className="text-sm text-yellow-50/80">Попробуйте обновить страницу позже.</p>
                    </div>
                ) : (
                    <div>
                        {shouldUseSlider ? (
                            <>
                                <div className="relative bg-transparent w-full overflow-hidden">
                                    <div
                                        className={`flex ${isSliding ? "transition-transform duration-800 ease-in-out" : "transition-none"}`}
                                        style={{ transform: `translateX(-${activeSlide * (100 / slidesPerView)}%)` }}
                                        onTransitionEnd={handleSliderTransitionEnd}
                                    >
                                        {sliderPlans.map((plan, index) => (
                                            <div
                                                key={`${plan.id}-${index}`}
                                                className="px-1 sm:px-2"
                                                style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                                            >
                                                {renderPlanCard(plan)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center gap-2">
                                    {plans.map((plan, index) => (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            className={`h-2.5 rounded-full transition-all duration-300 ${normalizedSlide === index ? "w-8 bg-emerald-400" : "w-2.5 bg-white/20 hover:bg-white/40"}`}
                                            aria-label={`Показать тариф: ${plan.name}`}
                                            onClick={() => {
                                                setIsSliding(true)
                                                setActiveSlide(index)
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {plans.map((plan) => (
                                    <div key={plan.id}>{renderPlanCard(plan)}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Features list */}
                <div className="mt-12 glass-effect rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold gradient-text text-center mb-8">
                        Во все тарифы включены:
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                            { icon: "⚡", text: "Быстрая и стабильная скорость" },
                            { icon: "🌍", text: "Доступ ко всем локациям (выбирайте страну/сервер одним нажатием)" },
                            { icon: "🔒", text: "Защита ваших данных (безопасно даже в публичном Wi-Fi)" },
                            { icon: "📱", text: "Работает на всех устройствах iPhone, Android, Windows, Mac, TV" },
                            { icon: "🙈", text: "Мы не следим за вами (не храним историю сайтов и действий)" },
                            { icon: "💬", text: "Поддержка всегда на связи (поможем с подключением и настройкой)" },
                        ].map((feature) => (
                            <div
                                key={feature.text}
                                className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-gray-200 transition-colors duration-300 hover:border-emerald-300/50 hover:text-white"
                            >
                                <span className="text-lg">{feature.icon}</span>
                                <span className="flex-1 min-w-[200px] leading-snug">
                                    {feature.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
