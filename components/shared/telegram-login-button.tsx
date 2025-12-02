"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"

interface TelegramLoginButtonProps {
    mode: 'login' | 'signup'
    botName: string
    onSuccess?: () => void
    onError?: (error: string) => void
}

// Типы для Telegram Login Widget
declare global {
    interface Window {
        onTelegramAuth?: (user: TelegramUser) => void
    }
}

interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
    auth_date: number
    hash: string
}

export default function TelegramLoginButton({ 
    mode, 
    botName,
    onSuccess,
    onError 
}: TelegramLoginButtonProps) {
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)
    const scriptLoadedRef = useRef(false)

    useEffect(() => {
        // Проверяем, не загружен ли уже скрипт глобально
        if (scriptLoadedRef.current || document.querySelector('script[src*="telegram-widget.js"]')) {
            scriptLoadedRef.current = true
            return
        }

        // Глобальный callback для Telegram (устанавливаем один раз)
        if (!window.onTelegramAuth) {
            window.onTelegramAuth = async (user: TelegramUser) => {
                try {
                    // Отправляем данные на бэкенд
                    await apiClient.telegramLogin({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name || null,
                        username: user.username || null,
                        photo_url: user.photo_url || null,
                        auth_date: user.auth_date,
                        hash: user.hash
                    })

                    // Сохраняем состояние авторизации
                    localStorage.setItem("isAuthenticated", "true")

                    toast.success("Успешный вход через Telegram", {
                        description: `Добро пожаловать, ${user.first_name}!`,
                        duration: 3000,
                    })

                    if (onSuccess) {
                        onSuccess()
                    } else {
                        // Перенаправляем на dashboard
                        setTimeout(() => {
                            router.push("/dashboard")
                        }, 1000)
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Ошибка авторизации через Telegram"
                    console.error("Telegram login error:", error)
                    
                    toast.error("Ошибка авторизации", {
                        description: errorMessage,
                        duration: 5000,
                    })

                    if (onError) {
                        onError(errorMessage)
                    }
                }
            }
        }

        // Определяем, мобильное ли устройство
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        // Загружаем скрипт Telegram Login Widget
        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?22'
        script.setAttribute('data-telegram-login', botName)
        script.setAttribute('data-size', 'large')
        script.setAttribute('data-onauth', 'onTelegramAuth(user)')
        script.setAttribute('data-request-access', 'write')
        script.setAttribute('data-userpic', 'true')
        
        // Для мобильных устройств: открывать в приложении Telegram
        if (isMobile) {
            // Используем deep link для открытия в приложении
            script.setAttribute('data-auth-url', window.location.origin + '/auth/telegram-callback')
            // Добавляем параметр для открытия в приложении
            script.setAttribute('data-embed', 'false')
        }
        
        script.async = true

        // Добавляем скрипт в контейнер
        const container = containerRef.current
        if (container) {
            container.appendChild(script)
            scriptLoadedRef.current = true
        }

        // Cleanup - не удаляем глобальный callback, так как он может использоваться другими компонентами
        return () => {
            // Очищаем только локальный скрипт, если компонент размонтируется
            // Используем сохраненную ссылку на контейнер
            if (container && script.parentNode === container) {
                container.removeChild(script)
            }
        }
    }, [botName, router, onSuccess, onError])

    return (
        <div className="mt-6 space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-[#0e151b] text-gray-400">или продолжить с</span>
                </div>
            </div>

            {/* Контейнер для Telegram Login Widget */}
            <div 
                ref={containerRef}
                className="flex justify-center"
            >
                {/* Telegram Widget будет вставлен сюда */}
            </div>

            {/* Fallback кнопка, если виджет не загрузился */}
            <div className="text-center text-sm text-gray-400 mt-2">
                Используйте виджет Telegram выше для входа
            </div>
        </div>
    )
}

