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
        try {
            await navigator.clipboard.writeText(text)
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
                    // Если превышен лимит устройств, показываем предупреждение
                    if (error?.response?.status === 403 || error?.status === 403) {
                        const errorMessage = error?.response?.data?.detail || error?.data?.detail || 'Достигнут лимит устройств для этого ключа'
                        console.warn('Device limit reached:', errorMessage)
                        // Показываем уведомление пользователю
                        alert(`⚠️ ${errorMessage}\n\nДля использования на другом устройстве купите новый тариф.`)
                    } else {
                        console.error('Failed to register device:', error)
                        // Не блокируем копирование, если регистрация не удалась
                    }
                }
            }
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }, [resetDelay, onDeviceRegistered])

    return { copiedText, copyToClipboard }
}
