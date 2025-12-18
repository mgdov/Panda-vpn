"use client"

import { useEffect, useMemo, useState } from "react"

interface Feature {
    icon: string
    title: string
    description: string
    gradient: string
    shadow: string
}

const features: Feature[] = [
    {
        icon: "⚡",
        title: "Быстро, как без VPN",
        description: "Вы просто пользуетесь интернетом — без ощущения, что включён VPN. Никаких лагов, долгих загрузок и раздражения.",
        gradient: "from-emerald-500/20 via-emerald-500/0 to-transparent",
        shadow: "group-hover:shadow-emerald-500/30",
    },
    {
        icon: "🔒",
        title: "Спокойствие за свои данные",
        description: "VPN скрывает вашу активность и защищает личную информацию. Вы в безопасности везде, где бы вы не находились",
        gradient: "from-cyan-500/20 via-cyan-500/0 to-transparent",
        shadow: "group-hover:shadow-cyan-500/30",
    },
    {
        icon: "🌍",
        title: "Интернет без границ",
        description: "Ограничения больше не мешают. Доступ к сайтам, сервисам и видео — так, как если бы вы находились в другой стране.",
        gradient: "from-amber-500/20 via-amber-500/0 to-transparent",
        shadow: "group-hover:shadow-amber-500/30",
    },
    {
        icon: "📱",
        title: "На всех устройствах",
        description: "Поддержка iOS, Android, Android TV, Windows и macOS. Одна подписка — максимум свободы.",
        gradient: "from-sky-500/20 via-sky-500/0 to-transparent",
        shadow: "group-hover:shadow-sky-500/30",
    },
]

const SLIDE_INTERVAL = 6000

const getSlidesPerView = () => {
    if (typeof window === "undefined") {
        return 1
    }

    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
}

export default function FeaturesSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const [slidesPerView, setSlidesPerView] = useState(1)

    useEffect(() => {
        setSlidesPerView(getSlidesPerView())

        const handleResize = () => {
            setSlidesPerView(getSlidesPerView())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const extendedFeatures = useMemo(() => {
        return [...features, ...features.slice(0, slidesPerView)]
    }, [slidesPerView])

    const cardWidth = `${100 / slidesPerView}%`

    useEffect(() => {
        const id = setInterval(() => {
            setIsTransitioning(true)
            setActiveIndex((prev) => prev + 1)
        }, SLIDE_INTERVAL)

        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        setActiveIndex(0)
        setIsTransitioning(true)
    }, [slidesPerView])

    useEffect(() => {
        if (!isTransitioning) {
            const id = requestAnimationFrame(() => setIsTransitioning(true))
            return () => cancelAnimationFrame(id)
        }
    }, [isTransitioning])

    const handleTransitionEnd = () => {
        if (activeIndex >= features.length) {
            setIsTransitioning(false)
            setActiveIndex(0)
        }
    }

    const effectiveIndex = activeIndex % features.length

    return (
        <section className="relative py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 right-4 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-6 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute inset-x-0 top-12 mx-auto h-px max-w-5xl bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
                <div className="space-y-3 text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-emerald-200/70">
                        <span className="text-base">✨</span>
                        Преимущества
                    </span>
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="gradient-text">Почему выбирают Panda VPN</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm font-medium text-gray-200 sm:text-base">
                        Компактный набор функций, который закрывает задачи безопасности и дарит стабильный доступ к любимому контенту.
                    </p>
                </div>

                <div className="relative w-full overflow-hidden">
                    <div
                        className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : "transition-none"}`}
                        style={{ transform: `translateX(-${activeIndex * (100 / slidesPerView)}%)` }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedFeatures.map((feature, idx) => (
                            <div key={`${feature.title}-${idx}`} className="shrink-0 px-2" style={{ flex: `0 0 ${cardWidth}` }}>
                                <div className="group relative">
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                                    <div
                                        className={`relative z-10 flex h-full min-h-[260px] flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5 shadow-lg transition-all duration-300 sm:p-6 ${feature.shadow} group-hover:-translate-y-1 group-hover:border-emerald-400/40`}
                                    >
                                        <div className="flex items-center gap-3 text-lg">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-2xl sm:h-12 sm:w-12">
                                                {feature.icon}
                                            </span>
                                            <h3 className="text-base font-bold text-white sm:text-[15px]">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-gray-200 sm:text-[14px]">
                                            {feature.description}
                                        </p>
                                        <div className="mt-auto h-px w-full bg-white/5" />
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                                            <span className="text-base text-white">🐼</span>
                                            Panda VPN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center gap-2">
                        {features.map((feature, index) => (
                            <button
                                key={feature.title}
                                type="button"
                                className={`h-2.5 rounded-full transition-all duration-300 ${effectiveIndex === index ? "w-8 bg-emerald-400" : "w-2.5 bg-white/20 hover:bg-white/40"}`}
                                aria-label={`Показать блок: ${feature.title}`}
                                onClick={() => {
                                    setIsTransitioning(true)
                                    setActiveIndex(index)
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center text-sm font-medium text-gray-300">
                    Более <span className="font-bold text-white">10 000</span> клиентов уже перешли на защищенный интернет с Panda VPN.
                </div>
            </div>
        </section>
    )
}
