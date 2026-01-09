/**
 * Утилиты для работы с Telegram
 */

/**
 * Кодирует email в base64 для использования в Telegram deep links
 * 
 * @param email - Email адрес для кодирования
 * @returns Закодированная строка (base64 без padding, с заменой символов)
 * 
 * @example
 * encodeEmail('khanzele16@gmail.com') // 'a2hhbnplbGUxNkBnbWFpbC5jb20'
 */
export function encodeEmail(email: string): string {
  if (!email) return "";
  
  // Кодируем в base64
  const encoded = btoa(unescape(encodeURIComponent(email)));
  
  // Убираем padding (=)
  const withoutPadding = encoded.replace(/=/g, '');
  
  // Заменяем символы для URL-safe формата
  return withoutPadding.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Генерирует ссылку для привязки Telegram аккаунта
 * 
 * @param email - Email пользователя
 * @param botUsername - Имя бота (без @), по умолчанию 'p_vpnbot'
 * @returns Ссылка вида: https://t.me/p_vpnbot?start=ENCODED_EMAIL
 * 
 * @example
 * generateTelegramLink('khanzele16@gmail.com') 
 * // 'https://t.me/p_vpnbot?start=a2hhbnplbGUxNkBnbWFpbC5jb20'
 */
export function generateTelegramLink(email: string, botUsername: string = 'p_vpnbot'): string {
  const encoded = encodeEmail(email);
  return `https://t.me/${botUsername}?start=${encoded}`;
}

