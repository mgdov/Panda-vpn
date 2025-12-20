"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import type { KeySearchResponse, Tariff } from "@/lib/api/types"
import { ChevronRight, Search, CheckCircle, XCircle, Loader2, Key, CreditCard } from "lucide-react"
import Link from "next/link"

type Mode = "select" | "buy" | "renew"

export default function BuyKeyPage() {
    const [mode, setMode] = useState<Mode>("select")
    const [keyIdentifier, setKeyIdentifier] = useState("")
    const [searchResult, setSearchResult] = useState<KeySearchResponse | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [tariffs, setTariffs] = useState<Tariff[]>([])
    const [isLoadingTariffs, setIsLoadingTariffs] = useState(false)
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null)
    const [isCreatingPayment, setIsCreatingPayment] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Загружаем тарифы при загрузке страницы
        loadTariffs()
    }, [])

    const loadTariffs = async () => {
        setIsLoadingTariffs(true)
        try {
            const tariffsData = await apiClient.getTariffs()
            setTariffs(tariffsData)
        } catch (err) {
            console.error("Failed to load tariffs:", err)
            setError("Не удалось загрузить тарифы")
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
        } catch (err: any) {
            setError(err.message || "Ошибка при поиске ключа")
            setSearchResult({
                found: false,
                message: "Ошибка при поиске ключа"
            })
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectTariff = (tariff: Tariff) => {
        setSelectedTariff(tariff)
    }

    const handleCreatePayment = async () => {
        if (!selectedTariff) {
            setError("Выберите тариф")
            return
        }

        setIsCreatingPayment(true)
        setError(null)

        try {
            const returnUrl = `${window.location.origin}/buy-key?success=true`
            
            if (mode === "buy") {
                // Покупка нового ключа
                const payment = await apiClient.createNewKeyPayment({
                    tariff_id: selectedTariff.code,
                    return_url: returnUrl
                })

                if (payment.confirmation_url) {
                    window.location.href = payment.confirmation_url
                } else {
                    setError("Не удалось получить ссылку на оплату")
                }
            } else if (mode === "renew" && searchResult?.client_id) {
                // Продление существующего ключа
                const payment = await apiClient.createRenewalPayment({
                    client_id: searchResult.client_id,
                    tariff_id: selectedTariff.code,
                    return_url: returnUrl
                })

                if (payment.confirmation_url) {
                    window.location.href = payment.confirmation_url
                } else {
                    setError("Не удалось получить ссылку на оплату")
                }
            }
        } catch (err: any) {
            setError(err.message || "Ошибка при создании платежа")
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

    // Выбор режима: покупка или продление
    if (mode === "select") {
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
                        <h1 className="text-3xl font-bold text-white mb-2">Купить без регистрации</h1>
                        <p className="text-gray-400">Выберите действие</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setMode("buy")}
                            className="p-6 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-emerald-500/20 rounded-lg">
                                    <CreditCard className="text-emerald-400" size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Купить новый ключ</h2>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Приобрести новый VPN ключ без регистрации. После оплаты вы получите ключ для использования.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                                Выбрать тариф
                                <ChevronRight size={16} />
                            </div>
                        </button>

                        <button
                            onClick={() => setMode("renew")}
                            className="p-6 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-emerald-500/20 rounded-lg">
                                    <Key className="text-emerald-400" size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Продлить ключ</h2>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Продлить срок действия существующего ключа. Введите subscription URL или идентификатор ключа.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                                Найти ключ
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Покупка нового ключа
    if (mode === "buy") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => setMode("select")}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            ← Назад
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Купить новый ключ</h1>
                        <p className="text-gray-400">Выберите тариф для покупки</p>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                        {isLoadingTariffs ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-emerald-400" />
                            </div>
                        ) : tariffs.length === 0 ? (
                            <p className="text-gray-400">Тарифы временно недоступны</p>
                        ) : (
                            <div className="grid gap-4 mb-6">
                                {tariffs.map((tariff) => (
                                    <button
                                        key={tariff.id}
                                        onClick={() => handleSelectTariff(tariff)}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                                            selectedTariff?.id === tariff.id
                                                ? "border-emerald-500 bg-emerald-500/10"
                                                : "border-white/10 bg-slate-900/50 hover:border-emerald-500/50"
                                        }`}
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
                                ))}
                            </div>
                        )}

                        {selectedTariff && (
                            <div className="mt-6">
                                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white">{selectedTariff.name}</span>
                                        <span className="text-emerald-400 font-bold">
                                            {selectedTariff.price_amount / 100} ₽
                                        </span>
                                    </div>
                                </div>
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
                                            Перейти к оплате
                                            <ChevronRight size={16} />
                                        </>
                                    )}
                                </button>
                                {error && (
                                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Продление ключа
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => {
                            setMode("select")
                            setSearchResult(null)
                            setKeyIdentifier("")
                            setError(null)
                        }}
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        ← Назад
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">Продление ключа</h1>
                    <p className="text-gray-400">Введите ваш ключ для продления</p>
                </div>

                {/* Поиск ключа */}
                {!searchResult && (
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
                {searchResult && (
                    <div className="space-y-6">
                        {searchResult.found && searchResult.active ? (
                            <>
                                <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                                    <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg mb-4">
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

                                    <h2 className="text-xl font-bold text-white mb-4">Выберите тариф для продления</h2>
                                    
                                    {isLoadingTariffs ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 size={24} className="animate-spin text-emerald-400" />
                                        </div>
                                    ) : tariffs.length === 0 ? (
                                        <p className="text-gray-400">Тарифы временно недоступны</p>
                                    ) : (
                                        <div className="grid gap-4 mb-6">
                                            {tariffs.map((tariff) => (
                                                <button
                                                    key={tariff.id}
                                                    onClick={() => handleSelectTariff(tariff)}
                                                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                        selectedTariff?.id === tariff.id
                                                            ? "border-emerald-500 bg-emerald-500/10"
                                                            : "border-white/10 bg-slate-900/50 hover:border-emerald-500/50"
                                                    }`}
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
                                            ))}
                                        </div>
                                    )}

                                    {selectedTariff && (
                                        <div className="mt-6">
                                            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white">{selectedTariff.name}</span>
                                                    <span className="text-emerald-400 font-bold">
                                                        {selectedTariff.price_amount / 100} ₽
                                                    </span>
                                                </div>
                                            </div>
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
                                                        Перейти к оплате
                                                        <ChevronRight size={16} />
                                                    </>
                                                )}
                                            </button>
                                            {error && (
                                                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <XCircle className="text-red-400 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold mb-1">Ключ не найден</h3>
                                        <p className="text-sm text-gray-300">{searchResult.message || "Проверьте правильность введенного ключа"}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSearchResult(null)
                                        setKeyIdentifier("")
                                        setError(null)
                                    }}
                                    className="w-full mt-4 px-6 py-2 border border-white/20 text-gray-300 hover:text-white hover:border-white/30 rounded-lg transition-colors"
                                >
                                    Начать заново
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
