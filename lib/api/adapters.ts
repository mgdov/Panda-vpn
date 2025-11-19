/**
 * Адаптеры для форматов данных от Marzban API
 * 
 * ВАЖНО: Форматы ответов от Marzban могут отличаться,
 * поэтому нужны адаптеры для нормализации данных
 */

import type { UsageStats } from './types'

type UnknownRecord = Record<string, unknown>

const toRecord = (data: unknown): UnknownRecord => {
  if (typeof data === 'object' && data !== null) {
    return data as UnknownRecord
  }
  return {}
}

const getNumber = (record: UnknownRecord, key: string, fallback = 0): number => {
  const value = record[key]
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

const getString = (record: UnknownRecord, key: string, fallback = ''): string => {
  const value = record[key]
  if (typeof value === 'string') return value
  return fallback
}

const getBoolean = (record: UnknownRecord, key: string, fallback = false): boolean => {
  const value = record[key]
  if (typeof value === 'boolean') return value
  return fallback
}

/**
 * Адаптирует статистику использования из Marzban API
 * Формат может быть разным: { up, down, total } или { client_id, up, down, total, expires }
 * 
 * @param data - данные от Marzban API
 * @returns нормализованный объект UsageStats
 */
export const adaptUsageStats = (data: unknown): UsageStats => {
  const record = toRecord(data)

  // Базовые поля всегда должны быть
  const base = {
    up: getNumber(record, 'up'),
    down: getNumber(record, 'down'),
    total: getNumber(record, 'total', getNumber(record, 'up') + getNumber(record, 'down')),
  }

  // Опциональные поля
  if (typeof record.client_id === 'string') {
    return {
      ...base,
      client_id: record.client_id,
      expires: typeof record.expires === 'string' ? record.expires : undefined,
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
export const adaptVPNConfig = (data: unknown): {
  config: string
  subscription_url: string
} => {
  const record = toRecord(data)

  // Разные возможные форматы
  if (typeof record.config === 'string') {
    return {
      config: record.config,
      subscription_url: getString(record, 'subscription_url', getString(record, 'subscriptionUrl')),
    }
  }

  // Если формат другой, пытаемся извлечь
  if (typeof record.subscription_url === 'string') {
    return {
      config: getString(record, 'subscription', getString(record, 'link')),
      subscription_url: record.subscription_url,
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
export const adaptMarzbanClient = (data: unknown): {
  id: string
  marzban_client_id: string
  protocol: string
  transport: string | null
  expires_at: string | null
  active: boolean
  subscription_url: string | null
  config_text: string | null
} => {
  const record = toRecord(data)
  return {
    id: getString(record, 'id', getString(record, 'uuid')),
    marzban_client_id: getString(record, 'marzban_client_id', getString(record, 'client_id', getString(record, 'id'))),
    protocol: getString(record, 'protocol', 'vless'),
    transport: getString(record, 'transport', getString(record, 'transport_type', '')) || null,
    expires_at: getString(record, 'expires_at', getString(record, 'expiresAt', getString(record, 'expiry'))) || null,
    active: record.active !== undefined ? getBoolean(record, 'active') : getString(record, 'status') === 'active',
    subscription_url: getString(record, 'subscription_url', getString(record, 'subscriptionUrl')) || null,
    config_text: getString(record, 'config_text', getString(record, 'configText', getString(record, 'config'))) || null,
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
export const safeGet = <T>(obj: UnknownRecord | null | undefined, key: string, defaultValue: T): T => {
  if (!obj) return defaultValue
  const value = obj[key]
  return value != null ? value : defaultValue
}

/**
 * Безопасно извлекает строку из объекта
 */
export const safeGetString = (obj: UnknownRecord | null | undefined, key: string, defaultValue: string = ''): string => {
  return safeGet(obj, key, defaultValue)
}

/**
 * Безопасно извлекает число из объекта
 */
export const safeGetNumber = (obj: UnknownRecord | null | undefined, key: string, defaultValue: number = 0): number => {
  return safeGet(obj, key, defaultValue)
}

/**
 * Безопасно извлекает boolean из объекта
 */
export const safeGetBoolean = (obj: UnknownRecord | null | undefined, key: string, defaultValue: boolean = false): boolean => {
  return safeGet(obj, key, defaultValue)
}

