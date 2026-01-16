"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function RedirectContent() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect_to')

    const [message, setMessage] = useState('Пожалуйста, подождите')
    const [showRetry, setShowRetry] = useState(false)
    const [showSpinner, setShowSpinner] = useState(true)
    const [decodedUrl, setDecodedUrl] = useState<string | null>(null)

    useEffect(() => {
        console.log('Redirect page loaded')
        console.log('redirect_to parameter:', redirectTo)

        if (!redirectTo) {
            setMessage('Ошибка: отсутствует параметр redirect_to')
            setShowSpinner(false)
            console.error('No redirect_to parameter found')
            return
        }

        // Декодируем URL
        let decoded = redirectTo
        try {
            if (redirectTo.includes('%')) {
                decoded = decodeURIComponent(redirectTo)
                console.log('Decoded URL:', decoded)
            }
        } catch (e) {
            console.error('Error decoding URL:', e)
        }

        setDecodedUrl(decoded)

        // Автоматически пытаемся открыть приложение
        tryOpenApp(decoded)

        // Показываем кнопку retry через 2 секунды
        const timer = setTimeout(() => {
            setMessage('Приложение не открылось?')
            setShowRetry(true)
            setShowSpinner(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [redirectTo])

    // Обработка видимости страницы
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('User returned to page - app might have opened successfully')
                setMessage('Если приложение открылось, можете вернуться на сайт')
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    // Обработка blur/focus
    useEffect(() => {
        let blurTime: number | null = null

        const handleBlur = () => {
            blurTime = Date.now()
            console.log('Page lost focus - app might be opening')
        }

        const handleFocus = () => {
            if (blurTime && Date.now() - blurTime > 1000) {
                console.log('User returned after blur - app likely opened')
                setMessage('✅ Приложение, возможно, открылось. Можете вернуться на сайт.')
            }
        }

        window.addEventListener('blur', handleBlur)
        window.addEventListener('focus', handleFocus)

        return () => {
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('focus', handleFocus)
        }
    }, [])

    const tryOpenApp = (url: string) => {
        if (!url) {
            alert('Ошибка: нет ссылки для открытия приложения')
            return
        }

        console.log('Attempting to open:', url)

        // Пытаемся открыть deep link
        window.location.href = url

        // Альтернативный метод через iframe
        setTimeout(() => {
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = url
            document.body.appendChild(iframe)

            setTimeout(() => {
                try {
                    document.body.removeChild(iframe)
                } catch (e) {
                    console.log('Iframe already removed')
                }
            }, 1000)
        }, 100)

        setMessage('Открываем приложение...')
    }

    const handleRetry = () => {
        if (decodedUrl) {
            tryOpenApp(decodedUrl)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white p-5">
            <div className="text-center max-w-lg p-8 bg-white/10 rounded-3xl backdrop-blur-xl shadow-2xl border border-white/20">
                {showSpinner && (
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-5" />
                )}

                <h2 className="text-3xl font-bold mb-5">🐼 Открываем Happ...</h2>
                <p className="text-lg leading-relaxed mb-6">{message}</p>

                <div className="flex flex-col gap-3">
                    {showRetry && (
                        <button
                            onClick={handleRetry}
                            className="px-7 py-3.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl shadow-lg shadow-green-500/40"
                        >
                            🚀 Добавить VPN в приложение
                        </button>
                    )}

                    <a
                        href={`/dashboard?tab=keys`}
                        className="px-6 py-3 bg-white/15 border-2 border-white/50 rounded-xl text-white font-semibold transition-all duration-300 hover:bg-white/25 hover:border-white"
                    >
                        ← Вернуться на сайт
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function RedirectPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-5" />
                    <p className="text-lg">Загрузка...</p>
                </div>
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}
