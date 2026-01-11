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

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-4">
                {/* Заголовок */}
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-gray-100 ring-1 ring-green-500/40">
                    <span className="text-base">🐼</span>
                    Panda VPN — быстрый и лёгкий VPN‑сервис
                </div>

                {/* Сетка кнопок 2x2 */}
                <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    {/* Кнопка 1: Попробовать бесплатно */}
                    <Link
                        href="/auth/signup"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-1 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-500/50 backdrop-blur-sm"
                    >
                        <div className="relative flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-green-500/[0.03] to-emerald-600/[0.03] px-8 py-6 text-center backdrop-blur-sm">
                            <span className="text-3xl">🎁</span>
                            <span className="text-xl font-bold text-white sm:text-2xl">Попробовать бесплатно</span>
                            <ChevronRight size={24} className="text-white/80 transition-transform group-hover:translate-x-2" />
                        </div>
                    </Link>

                    {/* Кнопка 2: Продлить мой VPN */}
                    <Link
                        href="/renew-key"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-1 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 backdrop-blur-sm"
                    >
                        <div className="relative flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-purple-500/[0.03] to-pink-600/[0.03] px-8 py-6 text-center backdrop-blur-sm">
                            <span className="text-3xl">⏰</span>
                            <span className="text-xl font-bold text-white sm:text-2xl">Продлить мой VPN</span>
                            <ChevronRight size={24} className="text-white/80 transition-transform group-hover:translate-x-2" />
                        </div>
                    </Link>

                    {/* Кнопка 3: Войти в аккаунт */}
                    <Link
                        href="/auth/login"
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-1 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 backdrop-blur-sm"
                    >
                        <div className="relative flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500/[0.03] to-cyan-600/[0.03] px-8 py-6 text-center backdrop-blur-sm">
                            <User size={36} className="text-white" />
                            <span className="text-xl font-bold text-white sm:text-2xl">Войти в аккаунт</span>
                            <ChevronRight size={24} className="text-white/80 transition-transform group-hover:translate-x-2" />
                        </div>
                    </Link>

                    {/* Кнопка 4: Видео-инструкция */}
                    <button
                        type="button"
                        onClick={openGuide}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 backdrop-blur-sm"
                    >
                        <div className="relative flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500/[0.03] to-red-600/[0.03] px-8 py-6 text-center backdrop-blur-sm">
                            <PlayCircle size={36} className="text-white" />
                            <span className="text-xl font-bold text-white sm:text-2xl">Видео-инструкция</span>
                            <span className="text-sm font-medium text-white/90">как подключить?</span>
                        </div>
                    </button>
                </div>
            </div>

            {
                isGuideOpen && (
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
                )
            }
        </section >
    )
}
