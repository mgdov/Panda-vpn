"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, User, PlayCircle } from "lucide-react"

interface HeroSectionProps {
    isAuthenticated: boolean
}

const devices = [
    { id: "ios", label: "iOS", description: "Откройте настройки, добавьте VPN-конфигурацию и вставьте ключ из личного кабинета Panda VPN." },
    { id: "android", label: "Android", description: "Скачайте приложение WireGuard, импортируйте подписку и включите туннель одним нажатием." },
    { id: "windows", label: "Windows", description: "Скачайте официальный клиент WireGuard, вставьте выданный ключ и сохраните профиль." },
    { id: "macos", label: "macOS", description: "Используйте WireGuard для macOS или встроенный VPN, вставьте конфиг и активируйте защиту." },
    { id: "androidTv", label: "Android TV", description: "Через APK WireGuard импортируйте конфигурацию и подключитесь перед просмотром контента." },
]

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

    const activeDevice = devices.find((device) => device.id === selectedDevice)

    const openGuide = () => {
        setSelectedDevice(null)
        setIsGuideOpen(true)
    }

    const closeGuide = () => {
        setIsGuideOpen(false)
        setSelectedDevice(null)
    }

    return (
        <section className="relative overflow-hidden py-16 sm:py-20">
            <div className="absolute inset-0">
                <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-green-500/15 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
                <div className="absolute bottom-[-120px] left-1/5 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
                <div className="space-y-5">
                    <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-gray-100 ring-1 ring-green-500/40">
                        <span className="text-base">🐼</span>
                        Panda VPN — быстрый и лёгкий VPN‑сервис
                    </div>

                    <h1 className="text-[28px] font-extrabold leading-[1.1] text-white sm:text-[36px] md:text-[44px] lg:text-[54px] xl:text-[62px] tracking-tight">
                        Panda VPN - надежный Доступ в любое время
                    </h1>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    href="/auth/signup"
                                    className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/35"
                                >
                                    Попробовать бесплатно
                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-200 transition-all duration-300 hover:border-white/25 hover:text-white"
                                >
                                    Войти в аккаунт
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/35"
                            >
                                <User size={16} />
                                Войти в личный кабинет
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={openGuide}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/35"
                    >
                        <PlayCircle size={16} />
                        Смотреть инструкцию
                    </button>
                </div>

                <div className="grid w-full max-w-3xl grid-cols-1 gap-3 text-sm font-medium text-gray-200 sm:grid-cols-3">
                    {[
                        "⚡ Высокая скорость интернета",
                        "🔒 Простой в подключении и использовании",
                        "🌍 Доступ к контенту из любой точки мира",
                    ].map((item) => (
                        <div key={item} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                            <span className="font-semibold text-white">{item.split(" ")[0]}</span>
                            <span className="text-gray-100">{item.split(" ").slice(1).join(" ")}</span>
                        </div>
                    ))}
                </div>
            </div>

            {isGuideOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 sm:py-12">
                    <div className="absolute inset-0" onClick={closeGuide} />
                    <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/95 p-4 sm:p-6 text-left shadow-2xl backdrop-blur max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={closeGuide}
                            className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10"
                            aria-label="Закрыть инструкцию"
                        >
                            ×
                        </button>
                        <div className="text-left pr-12 sm:pr-14">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-200/70 sm:text-xs">
                                Вы подключаете на устройство:
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">Выберите платформу</h3>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {devices.map((device) => (
                                <button
                                    key={device.id}
                                    type="button"
                                    onClick={() => setSelectedDevice(device.id)}
                                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${selectedDevice === device.id
                                        ? "border-emerald-400 bg-emerald-400/10 text-white"
                                        : "border-white/10 bg-white/5 text-gray-200 hover:border-emerald-300/60 hover:text-white"
                                        }`}
                                >
                                    {device.label}
                                </button>
                            ))}
                        </div>

                        {activeDevice && (
                            <div className="mt-6 space-y-4">
                                <div className="aspect-video w-full rounded-xl border border-dashed border-emerald-400/50 bg-slate-900/60 flex items-center justify-center text-xs font-semibold text-emerald-200 sm:text-sm">
                                    Видеоинструкция скоро появится
                                </div>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {activeDevice.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
