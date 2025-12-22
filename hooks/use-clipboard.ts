import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'

// Тип для callback обновления данных
type RefreshCallback = (() => void) | undefined

// Функция для определения имени устройства
function getDeviceName(): string {
    const ua = navigator.userAgent
    
    if (/iPhone/.test(ua)) {
        return 'iPhone'
    } else if (/iPad/.test(ua)) {
        return 'iPad'
    } else if (/Android/.test(ua)) {
        return 'Android Device'
    } else if (/Windows/.test(ua)) {
        return 'Windows PC'
    } else if (/Mac/.test(ua)) {
        return 'Mac'
    } else if (/Linux/.test(ua)) {
        return 'Linux PC'
    }
    
    return 'Unknown Device'
}

export function useClipboard(resetDelay = 2000, onDeviceRegistered?: RefreshCallback) {
    const [copiedText, setCopiedText] = useState<string | null>(null)

    const copyToClipboard = useCallback(async (text: string, id: string) => {
        // Копируем текст в буфер обмена
        // Используем ТОЛЬКО синхронный метод document.execCommand для надежности
        // (работает в контексте пользовательского действия и не требует фокуса документа)
        // НЕ используем navigator.clipboard.writeText, так как он асинхронный и может выполняться
        // после потери фокуса документа (например, при открытии deep link)
        let copySuccess = false
        try {
            // Используем синхронный метод
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
                copySuccess = true
            }
            // Если execCommand вернул false - не критично, это может быть из-за политики браузера
            // Не логируем предупреждение, чтобы не засорять консоль
        } catch (err) {
            // НЕ используем fallback на navigator.clipboard.writeText,
            // так как он может выполняться после потери фокуса документа
            console.error("Failed to copy using execCommand:", err)
        }
        
        if (copySuccess) {
        setCopiedText(id)
        setTimeout(() => {
            setCopiedText(null)
        }, resetDelay)
            
            // Регистрируем устройство при использовании конфига
            // Только если это валидный VLESS конфиг
            if (text && text.startsWith('vless://') && text !== 'Generating...' && text !== 'Генерация ключа...') {
                try {
                    await apiClient.registerDevice({
                        client_id: id,
                        config_text: text,
                        device_name: getDeviceName()
                    })
                    console.log('Device registered successfully for key:', id)
                    // Обновляем данные после успешной регистрации
                    if (onDeviceRegistered) {
                        setTimeout(() => onDeviceRegistered(), 500)
                    }
                } catch (error: any) {
                    // Если превышен лимит устройств, просто логируем (не показываем alert при копировании)
                    if (error?.response?.status === 403 || error?.status === 403) {
                        const errorMessage = error?.response?.data?.detail || error?.data?.detail || 'Достигнут лимит устройств для этого ключа'
                        console.warn('Device limit reached:', errorMessage)
                        // НЕ показываем alert при копировании - информация об устройствах показывается в карточке ключа
                    } else {
                        console.error('Failed to register device:', error)
                        // Не блокируем копирование, если регистрация не удалась
                    }
                }
            }
        }
    }, [resetDelay, onDeviceRegistered])

    return { copiedText, copyToClipboard }
}
