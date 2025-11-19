/**
 * Обработка ошибок API
 */

/**
 * Коды ошибок API
 */
export enum ApiErrorCode {
  INVALID_BODY = 'invalid body',
  EMAIL_ALREADY_EXISTS = 'email already exists',
  INVALID_LOGIN = 'invalid login',
  USER_INACTIVE = 'user inactive',
  INVALID_REFRESH_TOKEN = 'invalid refresh token',
  REFRESH_TOKEN_REQUIRED = 'refresh_token required',
  MISSING_CLAIMS = 'missing claims',
  USER_NOT_FOUND = 'user not found',
  INVALID_USER_ID = 'invalid user id',
  CLIENT_NOT_FOUND = 'client not found',
  ID_REQUIRED = 'id required',
  CLIENT_ID_REQUIRED = 'client_id required',
  NO_CLIENTS_FOUND = 'no clients found',
  NOT_ALLOWED = 'not allowed',
  CLIENT_DOES_NOT_BELONG_TO_USER = 'client does not belong to user',
  TARIFF_CODE_REQUIRED = 'tariff_code required',
  UNSUPPORTED_PAYMENT_METHOD = 'unsupported payment method',
  INVOICE_NOT_FOUND = 'invoice not found',
  FAILED_TO_LIST_TARIFFS = 'failed to list tariffs',
  COULD_NOT_LIST_CLIENTS = 'could not list clients',
  COULD_NOT_ISSUE_TOKENS = 'could not issue tokens',
  COULD_NOT_REVOKE_TOKEN = 'could not revoke token',
  MARZBAN_UNAVAILABLE = 'marzban unavailable',
  FAILED_TO_FETCH_USAGE = 'failed to fetch usage',
  API_SERVER_UNAVAILABLE = 'API server unavailable',
}

/**
 * Сообщения об ошибках на русском языке
 */
const ERROR_MESSAGES: Record<string, string> = {
  'invalid body': 'Неверный формат данных',
  'email already exists': 'Email уже зарегистрирован',
  'invalid login': 'Неверный email или пароль',
  'user inactive': 'Аккаунт деактивирован',
  'invalid refresh token': 'Сессия истекла. Пожалуйста, войдите снова',
  'refresh_token required': 'Токен обновления обязателен',
  'missing claims': 'Токен недействителен',
  'user not found': 'Пользователь не найден',
  'invalid user id': 'Неверный ID пользователя',
  'client not found': 'Клиент не найден',
  'id required': 'ID обязателен',
  'client_id required': 'ID клиента обязателен',
  'no clients found': 'Клиенты не найдены',
  'not allowed': 'Доступ запрещен',
  'client does not belong to user': 'Клиент не принадлежит пользователю',
  'tariff_code required': 'Код тарифа обязателен',
  'unsupported payment method': 'Неподдерживаемый метод оплаты',
  'invoice not found': 'Инвойс не найден',
  'failed to list tariffs': 'Ошибка загрузки тарифов',
  'could not list clients': 'Ошибка загрузки клиентов',
  'could not issue tokens': 'Ошибка создания токенов',
  'could not revoke token': 'Ошибка отзыва токена',
  'marzban unavailable': 'Сервис VPN временно недоступен',
  'failed to fetch usage': 'Ошибка загрузки статистики',
  'API server unavailable': 'Сервер API недоступен',
}

/**
 * Получить понятное сообщение об ошибке
 * @param error - объект ошибки или строка с кодом
 * @returns сообщение на русском языке
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    // Проверяем точное совпадение
    if (ERROR_MESSAGES[message]) {
      return ERROR_MESSAGES[message]
    }
    
    // Проверяем частичное совпадение
    for (const [code, msg] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(code)) {
        return msg
      }
    }
    
    // Если это сообщение об API недоступности
    if (message.includes('api server unavailable') || message.includes('failed to fetch')) {
      return ERROR_MESSAGES['API server unavailable']
    }
    
    return error.message
  }
  
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error.toLowerCase()] || error
  }
  
  return 'Произошла неизвестная ошибка'
}

/**
 * Проверка, является ли ошибка ошибкой аутентификации
 * @param error - объект ошибки
 * @returns true если это ошибка аутентификации
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('invalid login') ||
      message.includes('invalid refresh token') ||
      message.includes('missing claims') ||
      message.includes('user inactive') ||
      message.includes('unauthorized')
    )
  }
  return false
}

/**
 * Проверка, является ли ошибка ошибкой сети
 * @param error - объект ошибки
 * @returns true если это ошибка сети
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('failed to fetch') ||
      message.includes('network error') ||
      message.includes('api server unavailable') ||
      message.includes('marzban unavailable')
    )
  }
  return false
}

