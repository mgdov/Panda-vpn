/**
 * Адаптеры для форматов данных от Marzban API
 * 
 * ВАЖНО: Форматы ответов от Marzban могут отличаться,
 * поэтому нужны адаптеры для нормализации данных
 */

import type { UsageStats } from './types'

/**
 * Адаптирует статистику использования из Marzban API
 * Формат может быть разным: { up, down, total } или { client_id, up, down, total, expires }
 * 
 * @param data - данные от Marzban API
 * @returns нормализованный объект UsageStats
 */
export const adaptUsageStats = (data: any): UsageStats => {
  // Базовые поля всегда должны быть
  const base = {
    up: data.up || 0,
    down: data.down || 0,
    total: data.total || (data.up || 0) + (data.down || 0),
  }

  // Опциональные поля
  if (data.client_id) {
    return {
      ...base,
      client_id: data.client_id,
      expires: data.expires || undefined,
    }
  }

  return base
}

/**
 * Адаптирует конфигурацию VPN из Marzban API
 * Формат может быть разным
 * 
 * @param data - данные от Marzban API
 * @returns нормализованный объект с config и subscription_url
 */
export const adaptVPNConfig = (data: any): {
  config: string
  subscription_url: string
} => {
  // Разные возможные форматы
  if (data.config) {
    return {
      config: data.config,
      subscription_url: data.subscription_url || data.subscriptionUrl || '',
    }
  }

  // Если формат другой, пытаемся извлечь
  if (data.subscription_url) {
    return {
      config: data.subscription || data.link || '',
      subscription_url: data.subscription_url,
    }
  }

  // Fallback
  return {
    config: '',
    subscription_url: '',
  }
}

/**
 * Адаптирует данные клиента из Marzban
 * 
 * @param data - данные от Marzban API
 * @returns нормализованный объект клиента
 */
export const adaptMarzbanClient = (data: any): {
  id: string
  marzban_client_id: string
  protocol: string
  transport: string | null
  expires_at: string | null
  active: boolean
  subscription_url: string | null
  config_text: string | null
} => {
  return {
    id: data.id || data.uuid || '',
    marzban_client_id: data.marzban_client_id || data.client_id || data.id || '',
    protocol: data.protocol || 'vless',
    transport: data.transport || data.transport_type || null,
    expires_at: data.expires_at || data.expiresAt || data.expiry || null,
    active: data.active !== undefined ? data.active : (data.status === 'active'),
    subscription_url: data.subscription_url || data.subscriptionUrl || null,
    config_text: data.config_text || data.configText || data.config || null,
  }
}

/**
 * Безопасно извлекает значение из объекта с проверкой на null/undefined
 * 
 * @param obj - объект
 * @param key - ключ
 * @param defaultValue - значение по умолчанию
 * @returns значение или defaultValue
 */
export const safeGet = <T>(obj: any, key: string, defaultValue: T): T => {
  if (obj == null) return defaultValue
  const value = obj[key]
  return value != null ? value : defaultValue
}

/**
 * Безопасно извлекает строку из объекта
 */
export const safeGetString = (obj: any, key: string, defaultValue: string = ''): string => {
  return safeGet(obj, key, defaultValue)
}

/**
 * Безопасно извлекает число из объекта
 */
export const safeGetNumber = (obj: any, key: string, defaultValue: number = 0): number => {
  return safeGet(obj, key, defaultValue)
}

/**
 * Безопасно извлекает boolean из объекта
 */
export const safeGetBoolean = (obj: any, key: string, defaultValue: boolean = false): boolean => {
  return safeGet(obj, key, defaultValue)
}

