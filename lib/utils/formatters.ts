/**
 * Утилиты для форматирования данных API
 */

/**
 * Форматирует цену из копеек в рубли
 * @param kopecks - цена в копейках
 * @returns отформатированная строка (например: "149.00 ₽")
 */
export const formatPrice = (kopecks: number): string => {
  return (kopecks / 100).toFixed(2) + ' ₽'
}

/**
 * Форматирует цену из копеек в рубли (без копеек)
 * @param kopecks - цена в копейках
 * @returns отформатированная строка (например: "149 ₽")
 */
export const formatPriceSimple = (kopecks: number): string => {
  return Math.round(kopecks / 100) + ' ₽'
}

/**
 * Форматирует длительность из секунд в читаемый формат
 * @param seconds - длительность в секундах
 * @returns отформатированная строка (например: "30 дн." или "1 дн. 5 ч.")
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    if (hours > 0) {
      return `${days} дн. ${hours} ч.`
    }
    return `${days} дн.`
  }

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} ч. ${minutes} мин.`
    }
    return `${hours} ч.`
  }

  return `${minutes} мин.`
}

/**
 * Форматирует длительность в месяцах
 * @param seconds - длительность в секундах
 * @returns строка с количеством месяцев (например: "1 месяц", "3 месяца")
 */
export const formatDurationMonths = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  
  if (days <= 31) return '1 месяц'
  if (days <= 93) return '3 месяца'
  if (days <= 186) return '6 месяцев'
  if (days >= 350) return '12 месяцев'
  
  return formatDuration(seconds)
}

/**
 * Форматирует размер данных из байтов в читаемый формат
 * @param bytes - размер в байтах
 * @returns отформатированная строка (например: "1.5 GB", "500 MB")
 */
export const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

/**
 * Форматирует размер данных из байтов (целое число)
 * @param bytes - размер в байтах
 * @returns отформатированная строка (например: "1 GB", "500 MB")
 */
export const formatBytesSimple = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${Math.round(size)} ${units[unitIndex]}`
}

/**
 * Форматирует дату из ISO 8601 в локальный формат
 * @param isoDate - дата в формате ISO 8601
 * @returns отформатированная строка (например: "18.11.2024, 20:00")
 */
export const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return '—'
  
  try {
    const date = new Date(isoDate)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoDate
  }
}

/**
 * Форматирует дату в короткий формат
 * @param isoDate - дата в формате ISO 8601
 * @returns отформатированная строка (например: "18.11.2024")
 */
export const formatDateShort = (isoDate: string | null): string => {
  if (!isoDate) return '—'
  
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

/**
 * Проверяет, истекла ли дата
 * @param isoDate - дата в формате ISO 8601
 * @returns true если дата в прошлом
 */
export const isExpired = (isoDate: string | null): boolean => {
  if (!isoDate) return false
  
  try {
    return new Date(isoDate) < new Date()
  } catch {
    return false
  }
}

/**
 * Вычисляет оставшееся время до истечения
 * @param isoDate - дата истечения в формате ISO 8601
 * @returns строка с оставшимся временем (например: "5 дн. 3 ч.")
 */
export const getTimeRemaining = (isoDate: string | null): string => {
  if (!isoDate) return '—'
  
  try {
    const expires = new Date(isoDate)
    const now = new Date()
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Истек'
    
    const seconds = Math.floor(diff / 1000)
    return formatDuration(seconds)
  } catch {
    return '—'
  }
}

