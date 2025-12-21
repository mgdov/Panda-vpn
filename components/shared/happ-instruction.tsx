"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

interface HappInstructionProps {
    subscriptionUrl: string
}

export default function HappInstruction({ subscriptionUrl }: HappInstructionProps) {
    const [showOtherDevices, setShowOtherDevices] = useState(false)
    const [userAgent, setUserAgent] = useState<string>("")

    useEffect(() => {
        setUserAgent(navigator.userAgent)
    }, [])

    const isIOS = /iPhone|iPad|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    const isMac = /Mac/.test(userAgent) && !/iPhone|iPad|iPod/.test(userAgent)
    const isWindows = /Windows/.test(userAgent)

    // Deep link для добавления подписки в happ
    const addToHapp = () => {
        if (!subscriptionUrl) {
            alert("Subscription URL не найден")
            return
        }

        // Копируем в буфер обмена СИНХРОННО используя document.execCommand
        // Это работает в контексте пользовательского действия и не требует фокуса документа
        let copySuccess = false
        try {
            const textArea = document.createElement("textarea")
            textArea.value = subscriptionUrl
            textArea.style.position = "fixed"
            textArea.style.left = "-999999px"
            textArea.style.top = "-999999px"
            textArea.style.opacity = "0"
            textArea.setAttribute('readonly', '')
            document.body.appendChild(textArea)
            
            // Выбираем текст синхронно
            if (navigator.userAgent.match(/ipad|iphone/i)) {
                // Для iOS нужен другой подход
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
                console.log("✅ Subscription URL скопирован в буфер обмена")
                copySuccess = true
            } else {
                console.warn("⚠️ document.execCommand('copy') вернул false")
            }
        } catch (error) {
            console.error("Failed to copy using execCommand:", error)
        }

        // Кодируем URL для передачи в deep link
        const encodedUrl = encodeURIComponent(subscriptionUrl)
        
        // Используем формат, который работает (видно в логах: "Launched external handler for 'happ://add-subscription?url=...'")
        const deepLink = `happ://add-subscription?url=${encodedUrl}`
        
        // Открываем deep link сразу после копирования
        // Используем window.location.href для надежного открытия
        try {
            window.location.href = deepLink
            console.log("✅ Deep link opened:", deepLink)
        } catch (e) {
            console.error("Failed to open deep link:", e)
            // Fallback: создаем скрытую ссылку
            try {
                const a = document.createElement('a')
                a.href = deepLink
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()
                setTimeout(() => document.body.removeChild(a), 100)
            } catch (fallbackError) {
                console.error("Fallback deep link also failed:", fallbackError)
            }
        }
        
        // Показываем сообщение пользователю только если копирование не удалось
        // (чтобы не мешать открытию приложения)
        if (!copySuccess) {
            setTimeout(() => {
                alert(
                    "Если приложение happ не открылось автоматически:\n\n" +
                    "1. Откройте приложение happ вручную\n" +
                    "2. Добавьте подписку через меню\n" +
                    "3. Вставьте subscription URL вручную:\n\n" +
                    subscriptionUrl
                )
            }, 1500)
        }
    }

    const appStoreLinks = {
        ios: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
        android: "https://play.google.com/store/apps/details?id=com.happproxy",
        mac: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973", // Если есть Mac версия
        windows: "https://github.com/happ-proxy/happ-proxy/releases", // Пример, нужно уточнить
        androidTv: "https://play.google.com/store/apps/details?id=com.happproxy" // Android TV использует тот же APK
    }

    return (
        <div className="mt-6 p-4 md:p-5 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/50 rounded-xl">
            <div className="mb-4">
                <h3 className="text-base md:text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    ИНСТРУКЦИЯ
                </h3>
                <p className="text-xs md:text-sm text-gray-300 mb-4">
                    Установите приложение для вашего устройства по кнопке ниже, а затем вернитесь снова на сайт и нажмите вторую кнопку, чтобы добавить вашу VPN-подписку в приложение
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4"></div>
            </div>

            <div className="space-y-3">
                {/* 1️⃣ Установите приложение */}
                <div>
                    <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <span>1️⃣</span>
                        Установите приложение:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {isIOS && (
                            <a
                                href={appStoreLinks.ios}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                            >
                                <span>📲</span>
                                Айфон
                                <ExternalLink size={14} />
                            </a>
                        )}
                        {isAndroid && (
                            <a
                                href={appStoreLinks.android}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                            >
                                <span>🤖</span>
                                Андройд
                                <ExternalLink size={14} />
                            </a>
                        )}
                        {!isIOS && !isAndroid && (
                            <>
                                <a
                                    href={appStoreLinks.ios}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                                >
                                    <span>📲</span>
                                    Айфон
                                    <ExternalLink size={14} />
                                </a>
                                <a
                                    href={appStoreLinks.android}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                                >
                                    <span>🤖</span>
                                    Андройд
                                    <ExternalLink size={14} />
                                </a>
                            </>
                        )}
                        
                        {/* Выпадающий список для других устройств */}
                        <button
                            onClick={() => setShowOtherDevices(!showOtherDevices)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                        >
                            Другое устройство
                            {showOtherDevices ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>

                    {/* Выпадающий список устройств */}
                    {showOtherDevices && (
                        <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg space-y-2">
                            <a
                                href={appStoreLinks.mac}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-200 text-sm"
                            >
                                <span>💻</span>
                                MacBook
                                <ExternalLink size={12} className="ml-auto" />
                            </a>
                            <a
                                href={appStoreLinks.windows}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-200 text-sm"
                            >
                                <span>🖥️</span>
                                Windows
                                <ExternalLink size={12} className="ml-auto" />
                            </a>
                            <div className="px-3 py-2 bg-gray-700/50 text-white rounded-lg text-sm">
                                <span>📺</span>
                                <span className="ml-2">AndroidTV</span>
                                <p className="text-xs text-gray-400 mt-1 ml-6">
                                    Используйте APK для Android TV из Google Play или установите через ADB
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2️⃣ Добавить Панду в приложение */}
                <div className="pt-3 border-t border-purple-500/30">
                    <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <span>2️⃣</span>
                        Добавить подписку в приложение:
                    </p>
                    <button
                        onClick={addToHapp}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm md:text-base font-semibold shadow-lg shadow-purple-900/30"
                    >
                        <span>🐼</span>
                        Добавить Панду в приложение
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        Нажмите кнопку выше, чтобы автоматически добавить вашу VPN-подписку в приложение happ
                    </p>
                </div>
            </div>
        </div>
    )
}
