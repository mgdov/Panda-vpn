"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuth } from "@/hooks/use-auth"
import DashboardLayout from "@/components/shared/dashboard-layout"
import DashboardSidebar from "@/components/shared/dashboard-sidebar"
import MobileSidebarToggle from "@/components/shared/mobile-sidebar-toggle"
import LoadingScreen from "@/components/shared/loading-screen"
import type { Tariff } from "@/lib/api/types"
import { generateTelegramLink } from "@/lib/utils/telegram"

function BuyPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isAuthenticated, userEmail, isLoading: authLoading, logout } = useAuth()

    const [tariffs, setTariffs] = useState<Tariff[]>([])
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState("")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const loadTariffs = useCallback(async () => {
        try {
            const data = await apiClient.getTariffs()
            setTariffs(data)

            const tariffId = searchParams.get("tariff")
            if (tariffId) {
                const tariff = data.find((t) => t.id === tariffId || t.code === tariffId)
                if (tariff) {
                    setSelectedTariff(tariff)
                }
            }
        } catch (error) {
            console.error("Failed to load tariffs:", error)
            setError("Не удалось загрузить тарифы")
        }
    }, [searchParams])

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            router.push("/auth/login")
            return
        }

        if (isAuthenticated) {
            loadTariffs()
        }
    }, [isAuthenticated, authLoading, router, loadTariffs])

    useEffect(() => {
        const tariffId = searchParams.get("tariff")
        if (tariffId && tariffs.length > 0) {
            const tariff = tariffs.find((t) => t.id === tariffId || t.code === tariffId)
            if (tariff) {
                setSelectedTariff(tariff)
            }
        }
    }, [searchParams, tariffs])

    const handlePayment = async () => {
        if (!selectedTariff) {
            setError("Выберите тариф")
            return
        }

        // Проверяем наличие токена перед запросом
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (!token) {
            setError('Требуется авторизация. Перенаправление на страницу входа...')
            setTimeout(() => {
                window.location.href = '/auth/login'
            }, 1000)
            return
        }

        setIsProcessing(true)
        setError("")

        try {
            const result = await apiClient.createPayment({
                tariff_id: selectedTariff.id,
                return_url: `${window.location.origin}/dashboard?payment=success&tab=keys`,
            })

            if (result.confirmation_url) {
                window.location.href = result.confirmation_url
            } else {
                setError("Не удалось получить ссылку на оплату")
                setIsProcessing(false)
            }
        } catch (error: unknown) {
            console.error("Payment creation failed:", error)
            const errorMessage = getErrorMessage(error)
            setError(errorMessage)
            setIsProcessing(false)
        }
    }

    const handleLogout = async () => {
        try {
            await apiClient.logout()
        } catch (error) {
            console.error("Logout error:", error)
        }
        logout()
    }

    const handleTelegramConnect = useCallback(() => {
        if (!userEmail) {
            alert("Email не найден. Пожалуйста, войдите в аккаунт.")
            return
        }

        const link = generateTelegramLink(userEmail, 'p_vpnbot')
        window.open(link, '_blank')
    }, [userEmail])

    if (authLoading) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <DashboardLayout>
            <DashboardSidebar
                activeTab="plans"
                setActiveTab={(tab) => {
                    if (tab === "plans") {
                        router.push("/dashboard")
                    } else {
                        router.push(`/dashboard?tab=${tab}`)
                    }
                }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                userEmail={userEmail}
                onLogout={handleLogout}
            />

            <MobileSidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="relative flex-1 w-full ml-0 md:ml-64 px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 transition-all z-10 overflow-x-hidden">
                <div className="mb-6 space-y-3 md:mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gray-100 ring-1 ring-green-500/30">
                        <span className="text-base">💳</span>
                        Оплата подписки
                    </div>
                    <h1 className="text-3xl font-semibold text-white sm:text-[34px]">
                        Выберите тариф и оплатите
                    </h1>
                    <p className="text-sm text-gray-400 sm:text-base">
                        После оплаты ваш VLESS ключ будет создан или продлен автоматически
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-xl border border-green-700/20 rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 space-y-5">
                    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 sm:px-5 sm:py-4 text-sm text-emerald-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="font-semibold flex-1">
                                📣 Подключите Telegram за 2 клика, чтобы получать уведомления об окончании подписки и не пропускать новые акции.
                            </p>
                            <button
                                type="button"
                                onClick={handleTelegramConnect}
                                disabled={!userEmail}
                                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-sky-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Подключить Telegram
                            </button>
                        </div>
                    </div>

                    {tariffs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">Тарифы не найдены</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {tariffs.map((tariff) => {
                                const isSelected = selectedTariff?.id === tariff.id
                                const days = Math.floor(tariff.duration_seconds / 86400)
                                const priceRub = tariff.price_amount / 100

                                return (
                                    <div
                                        key={tariff.id}
                                        onClick={() => setSelectedTariff(tariff)}
                                        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${isSelected
                                            ? "border-emerald-400/60 bg-linear-to-br from-emerald-900/40 via-slate-900/70 to-slate-950/80 shadow-2xl shadow-emerald-500/30"
                                            : "border-white/10 bg-slate-900/70 hover:border-emerald-400/30 hover:shadow-xl hover:shadow-black/30"
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                                                ✓ Выбран
                                            </div>
                                        )}

                                        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7 lg:p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-lg shadow-black/30 bg-emerald-500/20">
                                                    {days <= 31 ? "🌿" : days <= 93 ? "🥋" : days <= 186 ? "🐉" : "👑"}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white sm:text-xl">{tariff.name}</h3>
                                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/80 sm:text-sm">
                                                        {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-sm font-medium leading-relaxed text-gray-200 sm:text-base">
                                                {tariff.description || "Доступ к VPN серверам"}
                                            </p>

                                            <div className="mt-auto flex items-end justify-between">
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-bold text-white sm:text-4xl">{priceRub}</span>
                                                        <span className="text-sm font-semibold text-gray-400">₽</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">за весь период</span>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={isProcessing}
                                                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <span className="animate-spin">⏳</span>
                                                            Создание платежа...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>💳</span>
                                                            Оплатить тариф
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </DashboardLayout>
    )
}

export default function BuyPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <BuyPageContent />
        </Suspense>
    )
}

