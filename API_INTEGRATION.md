# API Integration Guide

## Конфигурация

Приложение теперь интегрировано с VPN-P API. Все статические данные заменены на динамическую загрузку через API.

### Настройка

1. Создайте файл `.env.local` в корне проекта:

```bash
cp .env.local.example .env.local
```

2. Укажите URL вашего API сервера:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Для production:

```env
NEXT_PUBLIC_API_URL=https://api.pandavpn.com
```

### Интегрированные endpoints

#### Аутентификация

- ✅ `POST /auth/login` - Вход по email/password
- ✅ `POST /auth/register` - Регистрация
- ✅ `POST /auth/refresh` - Обновление токена
- ✅ `POST /auth/logout` - Выход

#### Публичные

- ✅ `GET /tariffs` - Получение тарифов
- ✅ `GET /nodes` - Получение списка нод

#### Пользователь

- ✅ `GET /profile` - Профиль пользователя
- ✅ `GET /profile/keys` - VPN ключи
- ✅ `GET /profile/usage` - Статистика использования
- ✅ `GET /me/clients` - Клиенты пользователя
- ✅ `POST /me/clients` - Создать клиента
- ✅ `POST /me/clients/:id/revoke` - Отозвать клиента

#### Платежи

- ✅ `POST /payments/create` - Создать платеж
- ✅ `GET /payments/:id` - Информация о платеже
- ✅ `POST /vpn/renew` - Продлить подписку
- ✅ `POST /vpn/topup` - Пополнить баланс

#### Биллинг

- ✅ `GET /billing/state/:client_id` - Состояние биллинга
- ✅ `GET /billing/history` - История платежей

### Fallback механизм

Если API недоступен, приложение автоматически переключается на статические данные:

- Демо тарифы
- Демо VPN ключи
- Демо профиль

### JWT Токены

Токены хранятся в localStorage:

- `vpn_access_token` - Access token
- `vpn_refresh_token` - Refresh token

При истечении access token автоматически обновляется через `/auth/refresh`.

### Использование API Client

```typescript
import { apiClient } from "@/lib/api/client";

// Login
const { access_token } = await apiClient.login({
  email: "user@example.com",
  password: "password",
});

// Get tariffs
const tariffs = await apiClient.getTariffs();

// Get profile
const profile = await apiClient.getProfile();

// Create payment
const payment = await apiClient.createPayment({
  tariff_code: "basic_month",
  payment_method: "yookassa",
  return_url: "https://example.com/return",
});
```

### Типы данных

Все типы API находятся в `/lib/api/types.ts`:

- `AuthResponse`
- `Tariff`
- `Node`
- `VPNClient`
- `ProfileResponse`
- `PaymentResponse`
- И другие...

### Обработка ошибок

```typescript
try {
  await apiClient.login(credentials);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

### Запуск без backend

Приложение работает без запущенного backend сервера, используя fallback данные. Для полной функциональности запустите VPN-P API сервер.

## Компоненты с API интеграцией

- ✅ `/app/auth/login` - Авторизация через API
- ✅ `/app/auth/signup` - Регистрация через API
- ✅ `/components/shared/pricing-section` - Загрузка тарифов из API
- ✅ `/app/dashboard` - Загрузка профиля и ключей из API

## Следующие шаги

Для администраторских функций можно расширить API client:

- Admin endpoints (пользователи, платежи, промо-коды)
- Referral система
- Email рассылки
- Backups
- Метрики и статистика
