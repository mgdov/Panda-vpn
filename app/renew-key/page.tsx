"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/errors"
import type { KeySearchResponse, Tariff } from "@/lib/api/types"
import { ChevronRight, Search, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function RenewKeyPageContent() {
    const [keyIdentifier, setKeyIdentifier] = useState("")
    const [searchResult, setSearchResult] = useState<KeySearchResponse | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)
    const [tariffs, setTariffs] = useState<Tariff[]>([])
    const [isLoadingTariffs, setIsLoadingTariffs] = useState(false)
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null)
    const [isCreatingPayment, setIsCreatingPayment] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Проверяем URL параметры при загрузке
    useEffect(() => {
        const clientId = searchParams?.get("client_id")
        const key = searchParams?.get("key")

        if (clientId) {
            // Если передан client_id, устанавливаем его как searchResult напрямую
            // client_id здесь это marzban_client_id (например "ENBBP", "TQBAX")
            setSearchResult({
                found: true,
                active: true, // Устанавливаем true чтобы пройти проверку и показать тарифы
                client_id: clientId,
                expires_at: null
            })
            // Сразу переходим к выбору тарифа
            setIsConfirming(true)
            // Загружаем тарифы
            loadTariffs()
        } else if (key) {
            // Если передан ключ, заполняем поле поиска
            setKeyIdentifier(decodeURIComponent(key))
        }
    }, [searchParams])

    const loadTariffs = async () => {
        setIsLoadingTariffs(true)
        try {
            const tariffsData = await apiClient.getTariffs()
            setTariffs(tariffsData)
        } catch (err) {
            console.error("Failed to load tariffs:", err)
        } finally {
            setIsLoadingTariffs(false)
        }
    }

    const handleSearch = async () => {
        if (!keyIdentifier.trim()) {
            setError("Введите ключ для поиска")
            return
        }

        setIsSearching(true)
        setError(null)
        setSearchResult(null)

        try {
            const result = await apiClient.searchKey({ key_identifier: keyIdentifier.trim() })
            setSearchResult(result)

            if (result.found && result.active) {
                // Загружаем тарифы для продления
                await loadTariffs()
            }
        } catch (err: any) {
            const errorMessage = getErrorMessage(err)
            setError(errorMessage)
            setSearchResult({
                found: false,
                message: errorMessage
            })
        } finally {
            setIsSearching(false)
        }
    }

    const handleConfirm = () => {
        setIsConfirming(true)
    }

    const handleSelectTariff = (tariff: Tariff) => {
        setSelectedTariff(tariff)
    }

    const handleCreatePayment = async () => {
        if (!selectedTariff || !searchResult?.client_id) {
            setError("Выберите тариф для продления")
            return
        }

        setIsCreatingPayment(true)
        setError(null)

        try {
            console.log('[Renew] Creating renewal payment with:', {
                client_id: searchResult.client_id,
                tariff_id: selectedTariff.code,
                tariff_name: selectedTariff.name
            })

            const returnUrl = `${window.location.origin}/dashboard?tab=keys&payment=success`
            const payment = await apiClient.createRenewalPayment({
                client_id: searchResult.client_id,
                tariff_id: selectedTariff.code,
                return_url: returnUrl
            })

            console.log('[Renew] Payment created:', payment)

            if (payment.confirmation_url) {
                window.location.href = payment.confirmation_url
            } else {
                setError("Не удалось получить ссылку на оплату")
            }
        } catch (err: any) {
            console.error('[Renew] Payment error:', err)
            const errorMessage = getErrorMessage(err)
            // Улучшаем сообщение об ошибке для пользователя
            if (errorMessage.includes("не найден") || errorMessage.includes("неактивен")) {
                setError("Не удалось найти ваш ключ для продления. Пожалуйста, свяжитесь с поддержкой или попробуйте купить новый ключ.")
            } else {
                setError(errorMessage)
            }
        } finally {
            setIsCreatingPayment(false)
        }
    }

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Без ограничений"
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    const formatDuration = (seconds: number) => {
        const days = Math.floor(seconds / (24 * 3600))
        if (days >= 30) {
            const months = Math.floor(days / 30)
            return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`
        }
        return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        ← Назад на главную
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Продление ключа</h1>
                    <p className="text-gray-400">Введите ваш ключ для продления без регистрации</p>
                </div>

                {/* Поиск ключа */}
                {!searchResult && !isConfirming && (
                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Введите subscription URL или идентификатор ключа
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={keyIdentifier}
                                        onChange={(e) => setKeyIdentifier(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="https://example.com/sub/... или идентификатор ключа"
                                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSearching ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Search size={16} />
                                        )}
                                        Найти
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Результат поиска */}
                {searchResult && !isConfirming && (
                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
                        {searchResult.found && searchResult.active ? (
                            <>
                                <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                    <CheckCircle className="text-emerald-400 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold mb-1">Ключ найден</h3>
                                        <div className="text-sm text-gray-300 space-y-1">
                                            <p>Идентификатор: {searchResult.marzban_client_id}</p>
                                            <p>Протокол: {searchResult.protocol?.toUpperCase() || 'N/A'}</p>
                                            <p>Истекает: {formatDate(searchResult.expires_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    Продолжить
                                    <ChevronRight size={16} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <XCircle className="text-red-400 mt-0.5" size={20} />
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold mb-1">Ключ не найден</h3>
                                    <p className="text-sm text-gray-300">{searchResult.message || "Проверьте правильность введенного ключа"}</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setSearchResult(null)
                                setKeyIdentifier("")
                                setError(null)
                            }}
                            className="w-full px-6 py-2 border border-white/20 text-gray-300 hover:text-white hover:border-white/30 rounded-lg transition-colors"
                        >
                            Начать заново
                        </button>
                    </div>
                )}

                {/* Подтверждение и выбор тарифа */}
                {isConfirming && searchResult?.found && searchResult.active && (
                    <div className="space-y-6">
                        {/* Информация о ключе */}
                        {searchResult.client_id && (
                            <div className="bg-slate-800/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-emerald-400">🔑</span>
                                    <span>Продление ключа: <span className="font-mono text-white">{searchResult.client_id}</span></span>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Выберите тариф для продления</h2>

                            {isLoadingTariffs ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={24} className="animate-spin text-emerald-400" />
                                </div>
                            ) : tariffs.length === 0 ? (
                                <p className="text-gray-400">Тарифы временно недоступны</p>
                            ) : (
                                <div className="grid gap-4">
                                    {tariffs.map((tariff) => (
                                        <div
                                            key={tariff.id}
                                            className={`p-4 rounded-lg border-2 transition-all ${selectedTariff?.id === tariff.id
                                                ? "border-emerald-500 bg-emerald-500/10"
                                                : "border-white/10 bg-slate-900/50"
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleSelectTariff(tariff)}
                                                className="w-full text-left"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-white font-semibold">{tariff.name}</h3>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {formatDuration(tariff.duration_seconds)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-white">
                                                            {tariff.price_amount / 100} ₽
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>

                                            {selectedTariff?.id === tariff.id && (
                                                <div className="mt-4 pt-4 border-t border-emerald-500/30">
                                                    <button
                                                        onClick={handleCreatePayment}
                                                        disabled={isCreatingPayment}
                                                        className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {isCreatingPayment ? (
                                                            <>
                                                                <Loader2 size={16} className="animate-spin" />
                                                                Создание платежа...
                                                            </>
                                                        ) : (
                                                            <>
                                                                💳 Перейти к оплате
                                                                <ChevronRight size={16} />
                                                            </>
                                                        )}
                                                    </button>
                                                    {error && (
                                                        <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                                            {error}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

import { Suspense } from "react"

function RenewKeyPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="h-8 bg-slate-700 rounded mb-4 w-32 animate-pulse"></div>
                <div className="h-12 bg-slate-700 rounded mb-8 animate-pulse"></div>
            </div>
        </div>
    )
}

export default function RenewKeyPage() {
    return (
        <Suspense fallback={<RenewKeyPageSkeleton />}>
            <RenewKeyPageContent />
        </Suspense>
    )
}
