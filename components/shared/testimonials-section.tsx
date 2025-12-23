"use client"

import { useEffect, useMemo, useState } from "react"

interface Testimonial {
    handle: string
    timeAgo: string
    comment: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        handle: "ummmuaz_446",
        timeAgo: "6 нед. назад",
        comment: "Идеально работает",
        rating: 4.9,
    },
    {
        handle: "fa_tima8671",
        timeAgo: "4 нед. назад",
        comment: "Благодарю за быструю помощь — просто молодцы, супер сервис!",
        rating: 5,
    },
    {
        handle: "m_.es._",
        timeAgo: "6 нед. назад",
        comment: "Супер VPN",
        rating: 4.8,
    },
    {
        handle: "kate_chamsudinova",
        timeAgo: "6 нед. назад",
        comment: "Сегодня установила ваш VPN и не прогадала. Отличное соединение и скорость, подключение оказалось очень простым.",
        rating: 4.9,
    },
    {
        handle: "rukiia_oralova",
        timeAgo: "7 нед. назад",
        comment: "Самый лучший",
        rating: 4.7,
    },
    {
        handle: "asra_style_",
        timeAgo: "8 нед. назад",
        comment: "Лучший VPN и идеальные разработчики, которые болеют за своё дело всей душой.",
        rating: 5,
    },
    {
        handle: "saitovagulzara",
        timeAgo: "9 нед. назад",
        comment: "Пользуюсь три месяца — очень довольна, всё летает. Команда всегда помогает по любым вопросам.",
        rating: 4.8,
    },
    {
        handle: "natasha_v_repina",
        timeAgo: "13 нед. назад",
        comment: "Пользуюсь Panda VPN уже два месяца: всегда работает быстро, а поддержка решает вопросы вовремя.",
        rating: 4.9,
    },
    {
        handle: "nasihat007",
        timeAgo: "13 нед. назад",
        comment: "Хороший VPN. Всегда подскажут, если возникнут вопросы — рекомендую всем.",
        rating: 4.7,
    },
    {
        handle: "ab.dullokh333",
        timeAgo: "12 нед. назад",
        comment: "Отлично всё работает, спасибо!",
        rating: 4.8,
    },
    {
        handle: "olesya_0120",
        timeAgo: "13 нед. назад",
        comment: "Самый лучший VPN! Давно с вами и не хочу ничего другого. Поддержка — отдельная любовь.",
        rating: 5,
    },
    {
        handle: "alena_expert",
        timeAgo: "13 нед. назад",
        comment: "Подключилась больше года назад — одно удовольствие пользоваться. Поддержка решает всё мгновенно.",
        rating: 4.9,
    },
    {
        handle: "milka_lu1",
        timeAgo: "13 нед. назад",
        comment: "С самого запуска пользуюсь только вами — ни разу не подвёл. А если что, техподдержка всегда подскажет.",
        rating: 5,
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

const getStarTone = (rating: number, index: number) => {
    const starValue = index + 1
    if (rating >= starValue) return "text-amber-300"
    if (rating + 0.25 >= starValue) return "text-amber-300/60"
    return "text-white/15"
}

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const [slidesPerView, setSlidesPerView] = useState(1)

    useEffect(() => {
        setSlidesPerView(getSlidesPerView())

        const handleResize = () => setSlidesPerView(getSlidesPerView())
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const extendedTestimonials = useMemo(() => {
        return [...testimonials, ...testimonials.slice(0, slidesPerView)]
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
        if (activeIndex >= testimonials.length) {
            setIsTransitioning(false)
            setActiveIndex(0)
        }
    }

    const effectiveIndex = activeIndex % testimonials.length

    return (
        <section className="relative py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-6 left-6 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />
                <div className="absolute bottom-6 right-4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
                <div className="absolute inset-x-0 top-12 mx-auto h-px max-w-5xl bg-linear-to-r from-transparent via-pink-500/20 to-transparent" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
                <div className="space-y-3 text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-rose-100/80">
                        <span className="text-base">❤️‍🔥</span>
                        Ваши отзывы
                    </span>
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="gradient-text">Голоса тех, кто уже с Panda</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm font-medium text-gray-200 sm:text-base">
                        Реальные истории людей, которые уже избавились от блокировок и забыли, что такое нестабильный интернет.
                    </p>
                </div>

                <div className="relative w-full overflow-hidden">
                    <div
                        className={`flex mt-1 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : "transition-none"}`}
                        style={{ transform: `translateX(-${activeIndex * (100 / slidesPerView)}%)` }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedTestimonials.map((testimonial, idx) => (
                            <div
                                key={`${testimonial.handle}-${idx}`}
                                className="shrink-0 px-2"
                                style={{ flex: `0 0 ${cardWidth}` }}
                            >
                                <div className="group relative h-full">
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-pink-500/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    <div className="relative z-10 flex h-full min-h-[260px] flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/70 p-5 shadow-lg transition-all duration-300 sm:p-6 group-hover:-translate-y-1 group-hover:border-pink-300/60">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">@{testimonial.handle}</p>
                                                <p className="text-xs text-gray-400">{testimonial.timeAgo}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, starIndex) => (
                                                    <span key={`${testimonial.handle}-star-${starIndex}`} className={`text-base ${getStarTone(testimonial.rating, starIndex)}`}>
                                                        ★
                                                    </span>
                                                ))}
                                                <span className="ml-1 text-xs font-semibold text-gray-300">
                                                    {testimonial.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-gray-200">
                                            {testimonial.comment}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-gray-300">
                                            <span className="text-lg">🐼</span>
                                            Panda VPN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center gap-2">
                        {testimonials.map((testimonial, index) => (
                            <button
                                key={testimonial.handle}
                                type="button"
                                className={`h-2.5 rounded-full transition-all duration-300 ${effectiveIndex === index ? "w-8 bg-rose-400" : "w-2.5 bg-white/20 hover:bg-white/40"}`}
                                aria-label={`Показать отзыв: ${testimonial.handle}`}
                                onClick={() => {
                                    setIsTransitioning(true)
                                    setActiveIndex(index)
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center text-sm font-medium text-gray-300">
                    Средняя оценка сообщества — <span className="font-bold text-white">4.7/5</span>. Спасибо, что доверяете Panda VPN.
                </div>
            </div>
        </section>
    )
}
