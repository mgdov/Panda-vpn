
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/errors"
import type { KeySearchResponse, Tariff } from "@/lib/api/types"
import { ChevronRight, Search, CheckCircle, XCircle, Loader2, Key, CreditCard, Copy, Check } from "lucide-react"
import Link from "next/link"

function RedirectToDashboard() {
    const router = useRouter();
    useEffect(() => {
        router.push("/dashboard?tab=keys");
    }, [router]);
    return null;
}

type Mode = "select" | "buy" | "renew" | "success" | "renewal_success"

function BuyKeyPageContent() {
    const [mode, setMode] = useState<Mode>("select")
    const [keyIdentifier, setKeyIdentifier] = useState("")
    const [searchResult, setSearchResult] = useState<KeySearchResponse | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [tariffs, setTariffs] = useState<Tariff[]>([])
    const [isLoadingTariffs, setIsLoadingTariffs] = useState(false)
    const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null)
    const [isCreatingPayment, setIsCreatingPayment] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentId, setPaymentId] = useState<string | null>(null)
    const [keyData, setKeyData] = useState<any>(null)
    const [isLoadingKey, setIsLoadingKey] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Загружаем тарифы при загрузке страницы
        loadTariffs()

        // Проверяем параметры URL
        const success = searchParams.get("success")
        const paymentIdParam = searchParams.get("payment_id")
        const modeParam = searchParams.get("mode")
        const keyParam = searchParams.get("key")

        if (modeParam === "renew") {
            setMode("renew")
            if (keyParam) {
                setKeyIdentifier(decodeURIComponent(keyParam))
                // Автоматически ищем ключ если он передан
                setTimeout(() => {
                    handleSearch()
                }, 500)
            }
        } else if (success === "true") {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:useEffect', 'message': 'Processing success redirect', 'data': { paymentIdParam, paymentIdParamDecoded: paymentIdParam ? decodeURIComponent(paymentIdParam) : null, localStoragePaymentId: localStorage.getItem("last_payment_id") }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
            // #endregion
            // Пробуем получить payment_id из URL или localStorage
            // Проверяем, что paymentIdParam не является плейсхолдером {payment_id}
            let idToUse = paymentIdParam
            if (idToUse && (idToUse === "{payment_id}" || decodeURIComponent(idToUse) === "{payment_id}")) {
                // YooKassa не заменила плейсхолдер - используем значение из localStorage
                console.warn("[DEBUG] YooKassa did not replace {payment_id} placeholder, using localStorage value")
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:useEffect', 'message': 'Placeholder detected, using localStorage', 'data': { localStoragePaymentId: localStorage.getItem("last_payment_id") }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
                // #endregion
                idToUse = localStorage.getItem("last_payment_id")
            }
            // Если все еще нет, пробуем localStorage
            if (!idToUse) {
                idToUse = localStorage.getItem("last_payment_id")
            }
            if (idToUse) {
                setPaymentId(idToUse)
                // Загружаем ключ сразу - режим будет определен после загрузки
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:useEffect', 'message': 'Loading key by payment', 'data': { paymentIdToUse: idToUse }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
                // #endregion
                loadKeyByPayment(idToUse)
            } else {
                // Если нет payment_id, показываем сообщение
                setError("Не найден идентификатор платежа. Проверьте URL или попробуйте позже.")
            }
        }
    }, [searchParams])

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
            if (mode === "buy") {
                // Покупка нового ключа - возвращаем на страницу buy-key
                // ЮКасса заменит {payment_id} на реальный ID платежа
                const buyReturnUrl = `${window.location.origin}/buy-key?success=true&payment_id={payment_id}`

                const payment = await apiClient.createNewKeyPayment({
                    tariff_id: selectedTariff.code,
                    return_url: buyReturnUrl
                })

                if (payment.confirmation_url) {
                    // Сохраняем payment_id в localStorage для получения после возврата (резервный метод)
                    const paymentIdToSave = payment.id || payment.payment_id || ""
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:handleCreatePayment', 'message': 'Saving payment_id to localStorage', 'data': { paymentId: paymentIdToSave, paymentObject: { id: payment.id, payment_id: payment.payment_id } }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
                    // #endregion
                    if (paymentIdToSave) {
                        localStorage.setItem("last_payment_id", paymentIdToSave)
                        console.log(`[DEBUG] Saved payment_id to localStorage: ${paymentIdToSave}`)
                    } else {
                        console.error("[DEBUG] No payment_id to save! Payment object:", payment)
                    }
                    window.location.href = payment.confirmation_url
                } else {
                    setError("Не удалось получить ссылку на оплату")
                }
            } else if (mode === "renew" && searchResult?.client_id) {
                // Продление существующего ключа - возвращаем на страницу buy-key
                // ЮКасса заменит {payment_id} на реальный ID платежа
                const renewReturnUrl = `${window.location.origin}/buy-key?success=true&payment_id={payment_id}`

                const payment = await apiClient.createRenewalPayment({
                    client_id: searchResult.client_id,
                    tariff_id: selectedTariff.code,
                    return_url: renewReturnUrl
                })

                if (payment.confirmation_url) {
                    const paymentIdToSave = payment.id || payment.payment_id || ""
                    if (paymentIdToSave) {
                        localStorage.setItem("last_payment_id", paymentIdToSave)
                    }
                    window.location.href = payment.confirmation_url
                } else {
                    setError("Не удалось получить ссылку на оплату")
                }
            }
        } catch (err: any) {
            const errorMessage = getErrorMessage(err)
            setError(errorMessage)
        } finally {
            setIsCreatingPayment(false)
        }
    }

    const loadKeyByPayment = async (paymentIdToLoad: string) => {
        setIsLoadingKey(true)
        setError(null)

        try {
            // Пробуем получить ключ несколько раз (платеж может обрабатываться)
            for (let attempt = 0; attempt < 15; attempt++) {
                try {
                    console.log(`[DEBUG] Attempt ${attempt + 1}: Requesting key for payment ${paymentIdToLoad}`)
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:loadKeyByPayment', 'message': 'Requesting key by payment', 'data': { paymentId: paymentIdToLoad, attempt: attempt + 1 }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
                    // #endregion
                    const key = await apiClient.getKeyByPayment(paymentIdToLoad)
                    console.log(`[DEBUG] Key received:`, {
                        expires_at: key.expires_at,
                        subscription_url: key.subscription_url,
                        is_renewal: key.is_renewal,
                        client_id: key.client_id
                    })
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/7ff428f3-5f7e-46d8-967f-bf80b747f512', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'buy-key/page.tsx:loadKeyByPayment', 'message': 'Key received successfully', 'data': { hasExpiresAt: !!key.expires_at, hasSubscriptionUrl: !!key.subscription_url, isRenewal: key.is_renewal, hasClientId: !!key.client_id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H1' }) }).catch(() => { });
                    // #endregion
                    setKeyData(key)
                    setIsLoadingKey(false)
                    // Определяем режим в зависимости от того, было ли это продление
                    if (key.is_renewal) {
                        setMode("renewal_success")
                    } else {
                        setMode("success")
                    }
                    // Очищаем localStorage после успешной загрузки
                    localStorage.removeItem("last_payment_id")
                    return
                } catch (err: any) {
                    // Проверяем, является ли это ошибкой "платеж обрабатывается"
                    const isProcessingError = err.message?.includes("not processed yet") ||
                        err.message?.includes("Payment not processed") ||
                        err.message?.includes("being processed") ||
                        err.status === 202 || // HTTP 202 Accepted
                        err.response?.status === 202

                    // Проверяем, является ли это ошибкой 404 (ключ не найден, но платеж может обрабатываться)
                    const isNotFoundError = err.status === 404 ||
                        err.response?.status === 404 ||
                        err.message?.includes("not found") ||
                        err.message?.includes("Key not found")

                    if (isProcessingError) {
                        // Платеж еще обрабатывается, ждем
                        if (attempt < 14) {
                            console.log(`[DEBUG] Payment still processing, waiting 2 seconds...`)
                            await new Promise(resolve => setTimeout(resolve, 2000))
                            continue
                        }
                    } else if (isNotFoundError) {
                        // Ключ не найден - возможно платеж еще обрабатывается
                        if (attempt < 14) {
                            console.log(`[DEBUG] Key not found, waiting 2 seconds...`)
                            await new Promise(resolve => setTimeout(resolve, 2000))
                            continue
                        }
                    }

                    // Если это последняя попытка или другая ошибка
                    if (attempt === 14) {
                        if (isProcessingError || (isNotFoundError && payment.status === "processing")) {
                            setError("Платеж обрабатывается. Пожалуйста, обновите страницу через несколько секунд.")
                            setIsLoadingKey(false)
                            // Автоматически обновим через 5 секунд
                            setTimeout(() => {
                                if (paymentIdToLoad) {
                                    loadKeyByPayment(paymentIdToLoad)
                                }
                            }, 5000)
                            return
                        }
                    }
                    // Для других ошибок пробрасываем исключение
                    throw err
                }
            }
        } catch (err: any) {
            setError(err.message || "Не удалось загрузить ключ")
            setIsLoadingKey(false)
        }
    }

    const handleAddToHapp = (subscriptionUrl: string) => {
        if (!subscriptionUrl) {
            alert("Subscription URL не найден")
            return
        }

        // Копируем в буфер обмена перед открытием deep link
        copyToClipboard(subscriptionUrl, "subscription")

        // Кодируем URL для передачи в deep link
        const encodedUrl = encodeURIComponent(subscriptionUrl)
        const deepLink = `happ://add-subscription?url=${encodedUrl}`

        // Открываем deep link
        window.location.href = deepLink

        // Показываем подсказку если приложение не открылось
        setTimeout(() => {
            const confirmed = confirm(
                "Если приложение не открылось автоматически:\n\n" +
                "1. Убедитесь, что приложение happ установлено\n" +
                "2. Subscription URL уже скопирован - добавьте его вручную\n\n" +
                "Открыть инструкцию по установке?"
            )
            if (confirmed) {
                window.open("https://happ.page.link/install", "_blank")
            }
        }, 1500)
    }

    const copyToClipboard = async (text: string, field: string) => {
        // Используем синхронный метод document.execCommand для надежности
        // (работает в контексте пользовательского действия и не требует фокуса документа)
        let copySuccess = false
        try {
            const textArea = document.createElement("textarea")
            textArea.value = text
            textArea.style.position = "fixed"
            textArea.style.left = "-999999px"
            textArea.style.top = "-999999px"
            textArea.style.opacity = "0"
            textArea.setAttribute('readonly', '')
            document.body.appendChild(textArea)

            // Выбираем текст синхронно
            if (navigator.userAgent.match(/ipad|iphone/i)) {
                const range = document.createRange()
                range.selectNodeContents(textArea)
                const selection = window.getSelection()
                if (selection) {
                    selection.removeAllRanges()
                    selection.addRange(range)
                }
                textArea.setSelectionRange(0, 999999)
            } else {
                textArea.select()
            }

            const successful = document.execCommand("copy")
            document.body.removeChild(textArea)

            if (successful) {
                copySuccess = true
            }
        } catch (err) {
            console.error("Failed to copy:", err)
        }

        if (copySuccess) {
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
        }
    }

    const formatDate = (dateString: string | null | undefined) => {
        console.log(`[DEBUG] formatDate called with:`, dateString, `type:`, typeof dateString)
        if (!dateString) {
            console.log(`[DEBUG] dateString is falsy, returning "Без ограничений"`)
            return "Без ограничений"
        }
        try {
            const date = new Date(dateString)
            console.log(`[DEBUG] Parsed date:`, date)
            if (isNaN(date.getTime())) {
                console.log(`[DEBUG] Invalid date, returning original string`)
                return dateString
            }
            const formatted = date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            console.log(`[DEBUG] Formatted date:`, formatted)
            return formatted
        } catch (err) {
            console.log(`[DEBUG] Error formatting date:`, err)
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

                    {/* Предупреждение о сохранении ключа */}
                    <div className="bg-red-500/20 backdrop-blur-md border-2 border-red-500 rounded-xl p-6 mb-6 shadow-lg shadow-red-500/20 animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-500/30 rounded-full flex-shrink-0">
                                <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-red-200 mb-3">⚠️ ВАЖНО! Сохраните ваш ключ!</h3>
                                <div className="space-y-2 text-red-100">
                                    <p className="font-semibold">После покупки обязательно сохраните subscription URL ключа!</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Скопируйте ключ и сохраните его в надежном месте</li>
                                        <li>Без ключа вы не сможете подключиться к VPN</li>
                                        <li>Ключ понадобится для продления подписки</li>
                                        <li>Восстановить потерянный ключ невозможно!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
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
            </div>
        )
    }

    // Страница успешного продления ключа
    if (mode === "renewal_success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            ← На главную
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Ключ успешно продлен!</h1>
                        <p className="text-gray-400">Ваш ключ продлен и готов к использованию</p>
                    </div>

                    {isLoadingKey ? (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={48} className="animate-spin text-emerald-400 mb-4" />
                                <p className="text-gray-400">Обработка платежа и продление ключа...</p>
                                <p className="text-sm text-gray-500 mt-2">Это может занять несколько секунд</p>
                            </div>
                        </div>
                    ) : keyData ? (
                        <div className="space-y-6">
                            <div className="bg-slate-800/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-6">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <CheckCircle className="text-emerald-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white mb-1">Ключ успешно продлен!</h2>
                                        <p className="text-sm text-gray-400">
                                            Новый срок действия: {formatDate(keyData.expires_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* НАПОМИНАНИЕ О СОХРАНЕНИИ КЛЮЧА */}
                                <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-500/30 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-200 text-sm mb-1">💾 Не забудьте сохранить ключ!</p>
                                            <p className="text-xs text-red-100">
                                                Убедитесь, что subscription URL сохранен в надежном месте для будущих продлений.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription URL */}
                                {keyData.subscription_url && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Subscription URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={keyData.subscription_url}
                                                readOnly
                                                className="flex-1 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(keyData.subscription_url, "subscription")}
                                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {copiedField === "subscription" ? (
                                                    <>
                                                        <Check size={16} />
                                                        Скопировано
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} />
                                                        Копировать
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {/* Кнопка для добавления в happ приложение */}
                                        <button
                                            onClick={() => handleAddToHapp(keyData.subscription_url)}
                                            className="mt-3 w-full px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] text-sm font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                                        >
                                            <span>🐼</span>
                                            Вставить в VPN приложение
                                        </button>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-200">
                                        💡 <strong>Ключ продлен!</strong> Используйте тот же subscription URL в вашем VPN приложении.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        // Переходим на страницу продления с предзаполненным ключом
                                        const keyToUse = keyData.subscription_url || keyData.marzban_client_id || keyData.client_id
                                        if (keyToUse) {
                                            router.push(`/buy-key?mode=renew&key=${encodeURIComponent(keyToUse)}`)
                                        } else {
                                            router.push("/buy-key?mode=renew")
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Key size={20} />
                                    Продлить еще раз
                                </button>
                                <Link
                                    href="/"
                                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    На главную
                                </Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Ошибка</h3>
                                    <p className="text-red-300 mb-4">{error}</p>
                                    {paymentId && (
                                        <button
                                            onClick={() => loadKeyByPayment(paymentId)}
                                            className="mt-4 w-full px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Попробовать снова
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 size={32} className="animate-spin text-emerald-400 mb-4" />
                                <p className="text-gray-400 text-center mb-2">Ожидание обработки платежа...</p>
                                <p className="text-sm text-gray-500 text-center">Ключ будет продлен автоматически после обработки платежа</p>
                            </div>
                            {paymentId && (
                                <button
                                    onClick={() => loadKeyByPayment(paymentId)}
                                    className="mt-4 w-full px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Проверить ключ сейчас
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Страница успешной оплаты (новый ключ)
    if (mode === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            ← На главную
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Ключ успешно приобретен!</h1>
                        <p className="text-gray-400">Ваш ключ готов к использованию</p>
                    </div>

                    {isLoadingKey ? (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={48} className="animate-spin text-emerald-400 mb-4" />
                                <p className="text-gray-400">Обработка платежа и создание ключа...</p>
                                <p className="text-sm text-gray-500 mt-2">Это может занять несколько секунд</p>
                            </div>
                        </div>
                    ) : keyData ? (
                        <div className="space-y-6">
                            <div className="bg-slate-800/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-6">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <CheckCircle className="text-emerald-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white mb-1">Ключ успешно создан!</h2>
                                        <p className="text-sm text-gray-400">
                                            Срок действия: {formatDate(keyData.expires_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* НАПОМИНАНИЕ О СОХРАНЕНИИ КЛЮЧА */}
                                <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-500/30 rounded-lg flex-shrink-0">
                                            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-200 text-sm mb-1">💾 ВАЖНО! Сохраните ваш ключ!</p>
                                            <p className="text-xs text-red-100">
                                                Скопируйте subscription URL и сохраните его в надежном месте. Без ключа вы не сможете подключиться к VPN и продлить подписку.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription URL */}
                                {keyData.subscription_url ? (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Subscription URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={keyData.subscription_url}
                                                readOnly
                                                className="flex-1 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white text-sm font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(keyData.subscription_url, "subscription")}
                                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {copiedField === "subscription" ? (
                                                    <>
                                                        <Check size={16} />
                                                        Скопировано
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} />
                                                        Копировать
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {/* Кнопка для добавления в happ приложение */}
                                        <button
                                            onClick={() => handleAddToHapp(keyData.subscription_url)}
                                            className="mt-3 w-full px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] text-sm font-semibold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                                        >
                                            <span>🐼</span>
                                            Вставить в VPN приложение
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                        <p className="text-sm text-yellow-200">
                                            ⚠️ Subscription URL еще генерируется. Пожалуйста, обновите страницу через несколько секунд.
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-200">
                                        💡 <strong>Используйте subscription URL</strong> в вашем VPN приложении для подключения.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        // Переходим на страницу продления с предзаполненным ключом
                                        const keyToUse = keyData.subscription_url || keyData.marzban_client_id || keyData.client_id
                                        if (keyToUse) {
                                            router.push(`/buy-key?mode=renew&key=${encodeURIComponent(keyToUse)}`)
                                        } else {
                                            router.push("/buy-key?mode=renew")
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Key size={20} />
                                    Продлить ключ
                                </button>
                                <Link
                                    href="/"
                                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    На главную
                                </Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Ошибка</h3>
                                    <p className="text-red-300 mb-4">{error}</p>
                                    {paymentId && (
                                        <button
                                            onClick={() => loadKeyByPayment(paymentId)}
                                            className="mt-4 w-full px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Попробовать снова
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 size={32} className="animate-spin text-emerald-400 mb-4" />
                                <p className="text-gray-400 text-center mb-2">Ожидание обработки платежа...</p>
                                <p className="text-sm text-gray-500 text-center">Ключ будет создан автоматически после обработки платежа</p>
                            </div>
                            {paymentId && (
                                <button
                                    onClick={() => loadKeyByPayment(paymentId)}
                                    className="mt-4 w-full px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Проверить ключ сейчас
                                </button>
                            )}
                        </div>
                    )}
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

export default function BuyKeyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-emerald-400" />
            </div>
        }>
            <BuyKeyPageContent />
        </Suspense>
    )
}
