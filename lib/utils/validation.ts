/**
 * Утилиты для валидации данных на фронтенде
 * 
 * ВАЖНО: Бэкенд не валидирует формат email и сложность пароля,
 * поэтому валидация должна быть на фронтенде
 */

/**
 * Валидация email адреса
 * @param email - email для проверки
 * @returns true если email валидный
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim())
}

/**
 * Валидация пароля
 * @param password - пароль для проверки
 * @returns объект с результатом валидации и списком ошибок
 */
export const validatePassword = (password: string): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!password) {
    errors.push('Пароль обязателен')
    return { valid: false, errors }
  }

  if (password.length < 6) {
    errors.push('Пароль должен быть не менее 6 символов')
  }

  if (password.length > 128) {
    errors.push('Пароль не должен превышать 128 символов')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Валидация пароля (упрощенная версия)
 * @param password - пароль для проверки
 * @returns объект с результатом валидации и сообщением
 */
export const validatePasswordSimple = (password: string): {
  valid: boolean
  message: string
} => {
  if (!password) {
    return { valid: false, message: 'Пароль обязателен' }
  }

  if (password.length < 6) {
    return { valid: false, message: 'Пароль должен быть не менее 6 символов' }
  }

  if (password.length > 128) {
    return { valid: false, message: 'Пароль не должен превышать 128 символов' }
  }

  return { valid: true, message: '' }
}

/**
 * Проверка совпадения паролей
 * @param password - пароль
 * @param confirmPassword - подтверждение пароля
 * @returns true если пароли совпадают
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && password.length > 0
}

/**
 * Валидация UUID
 * @param uuid - UUID для проверки
 * @returns true если UUID валидный
 */
export const validateUUID = (uuid: string): boolean => {
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return re.test(uuid)
}

/**
 * Валидация реферального кода
 * @param code - код для проверки
 * @returns true если код валидный (не пустой, не слишком длинный)
 */
export const validateReferralCode = (code: string): boolean => {
  if (!code) return true // Реферальный код опционален

  const trimmed = code.trim()
  return trimmed.length > 0 && trimmed.length <= 50
}

