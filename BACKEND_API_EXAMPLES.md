# 🐼 Panda VPN - API Examples (cURL)

## 🔐 Аутентификация

### 1. Регистрация
```bash
curl -X POST http://103.74.92.81:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "referral": "optional_referral_code"
  }'
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_expires_at": "2025-12-16T23:00:00Z",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "roles": ["user"]
  },
  "roles": ["user"]
}
```

---

### 2. Вход
```bash
curl -X POST http://103.74.92.81:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@pandavpn.com",
    "password": "demo123"
  }'
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_expires_at": "2025-12-16T23:00:00Z",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "roles": ["user"]
  },
  "roles": ["user"]
}
```

---

### 3. Обновление токена
```bash
curl -X POST http://103.74.92.81:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_expires_at": "2025-12-16T23:00:00Z",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "roles": ["user"]
  },
  "roles": ["user"]
}
```

---

### 4. Выход
```bash
curl -X POST http://103.74.92.81:8000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Ответ:** 200 (No Content)

---

## 🌐 Публичные endpoints

### 5. Получить тарифы
```bash
curl -X GET http://103.74.92.81:8000/tariffs
```

**Ответ:**
```json
[
  {
    "id": "1",
    "code": "basic_month",
    "name": "Тариф Бамбук",
    "description": "Лёгкий, как первый шаг Панды на путь воина",
    "price_amount": 14900,
    "currency": "RUB",
    "duration_seconds": 2592000,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 6. Получить серверы
```bash
curl -X GET http://103.74.92.81:8000/nodes
```

**Ответ:**
```json
[
  {
    "id": "node-1",
    "name": "Moscow",
    "status": "online"
  }
]
```

---

## 👤 Пользовательские endpoints

### 7. Получить профиль
```bash
curl -X GET http://103.74.92.81:8000/profile \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "telegram_id": null,
    "roles": ["user"],
    "marzban_username": "user_123"
  },
  "stats": {
    "clients_total": 2
  },
  "clients": []
}
```

---

### 8. Получить VPN ключи
```bash
curl -X GET http://103.74.92.81:8000/profile/keys \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
[
  {
    "id": "key_1",
    "user_id": "123",
    "marzban_client_id": "marzban_123",
    "protocol": "vless",
    "transport": "ws",
    "created_at": "2024-01-01T00:00:00Z",
    "expires_at": "2024-02-01T00:00:00Z",
    "active": true,
    "subscription_url": "https://example.com/sub",
    "config_text": "vless://uuid@server:port?type=ws&path=/path#name"
  }
]
```

---

### 9. Получить статистику
```bash
curl -X GET "http://103.74.92.81:8000/profile/usage?client_id=client_1" \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "client_id": "client_1",
  "up": 1073741824,
  "down": 2147483648,
  "total": 3221225472,
  "expires": "2024-02-01T00:00:00Z"
}
```

---

### 10. Получить клиентов
```bash
curl -X GET http://103.74.92.81:8000/me/clients \
  -H "Authorization: Bearer <access_token>"
```

---

### 11. Создать клиента
```bash
curl -X POST http://103.74.92.81:8000/me/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "protocol": "vless",
    "transport": "ws",
    "flow": "xtls-rprx-vision",
    "node_id": "1",
    "meta": {
      "device": "iPhone",
      "os": "iOS 17"
    }
  }'
```

**Ответ:**
```json
{
  "client_id": "client_1",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 12. Отозвать клиента
```bash
curl -X POST http://103.74.92.81:8000/me/clients/client_1/revoke \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:** 200 (No Content)

---

### 13. Получить VPN конфигурацию
```bash
curl -X GET http://103.74.92.81:8000/vpn/config/client_1 \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "config": "vless://uuid@server:port?type=ws&path=/path#name",
  "subscription_url": "https://example.com/sub"
}
```

---

## 💳 Платежи

### 14. Создать платеж
```bash
curl -X POST http://103.74.92.81:8000/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "tariff_code": "basic_month",
    "payment_method": "yookassa",
    "return_url": "https://pandavpn.com/dashboard"
  }'
```

**Ответ:**
```json
{
  "invoice_id": "inv_123",
  "payment_id": "pay_456",
  "provider_payment_id": "yookassa_789",
  "payment_url": "https://yookassa.ru/checkout/payments/...",
  "status": "pending"
}
```

---

### 15. Получить информацию о платеже
```bash
curl -X GET http://103.74.92.81:8000/payments/pay_456 \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "invoice": {
    "id": "inv_123",
    "user_id": "123",
    "tariff_id": "1",
    "amount": 14900,
    "currency": "RUB",
    "status": "paid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "payments": [
    {
      "id": "pay_456",
      "status": "succeeded",
      "amount": 14900,
      "currency": "RUB"
    }
  ]
}
```

---

### 16. Продлить подписку
```bash
curl -X POST http://103.74.92.81:8000/vpn/renew \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "tariff_code": "basic_month",
    "client_id": "client_1",
    "return_url": "https://pandavpn.com/dashboard"
  }'
```

---

### 17. Пополнить баланс
```bash
curl -X POST http://103.74.92.81:8000/vpn/topup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "tariff_code": "basic_month",
    "client_id": "client_1",
    "return_url": "https://pandavpn.com/dashboard"
  }'
```

---

## 💰 Биллинг

### 18. Получить состояние биллинга
```bash
curl -X GET http://103.74.92.81:8000/billing/state/client_1 \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "state": {
    "client_id": "client_1",
    "user_id": "123",
    "status": "active",
    "expires_at": "2024-02-01T00:00:00Z",
    "last_sync": "2024-01-15T12:00:00Z",
    "auto_renew": false,
    "last_payment_id": "pay_456"
  },
  "events": [
    {
      "id": "event_1",
      "action": "payment_received",
      "amount": 14900,
      "currency": "RUB",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 19. Получить историю платежей
```bash
curl -X GET "http://103.74.92.81:8000/billing/history?page=1&limit=20" \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": "event_1",
      "payment_id": "pay_456",
      "event_type": "payment_succeeded",
      "status": "completed",
      "received_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🔄 Полный сценарий использования

### 1. Регистрация и получение токена
```bash
# Регистрация
RESPONSE=$(curl -s -X POST http://103.74.92.81:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

# Извлечение токена (требует jq)
TOKEN=$(echo $RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"
```

### 2. Получение тарифов
```bash
curl -X GET http://103.74.92.81:8000/tariffs
```

### 3. Создание платежа
```bash
curl -X POST http://103.74.92.81:8000/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tariff_code": "basic_month",
    "payment_method": "yookassa",
    "return_url": "https://pandavpn.com/dashboard"
  }'
```

### 4. Получение профиля
```bash
curl -X GET http://103.74.92.81:8000/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Получение VPN ключей
```bash
curl -X GET http://103.74.92.81:8000/profile/keys \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Дополнительные endpoints

### 20. Скачать VLESS конфиг
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/vless \
  -H "Authorization: Bearer <access_token>" \
  --output config.txt
```

---

### 21. Скачать VMess конфиг
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/vmess \
  -H "Authorization: Bearer <access_token>" \
  --output config.txt
```

---

### 22. Скачать QR код
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/qr \
  -H "Authorization: Bearer <access_token>" \
  --output qr.png
```

---

### 23. Скачать Hiddify конфиг
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/hiddify \
  -H "Authorization: Bearer <access_token>" \
  --output config.json
```

---

### 24. Скачать Clash конфиг
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/clash \
  -H "Authorization: Bearer <access_token>" \
  --output config.yaml
```

---

### 25. Информация о доступных конфигах
```bash
curl -X GET http://103.74.92.81:8000/configs/client_1/info \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "formats": ["vless", "vmess", "qr", "hiddify", "clash"],
  "client_id": "client_1"
}
```

---

### 26. Получить реферальную ссылку
```bash
curl -X GET http://103.74.92.81:8000/referral/link \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "link": "https://pandavpn.com/ref/abc123",
  "code": "abc123"
}
```

---

### 27. Статистика по рефералам
```bash
curl -X GET http://103.74.92.81:8000/referral/stats \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "total_referrals": 10,
  "active_referrals": 7,
  "total_rewards": 5000,
  "pending_rewards": 1000
}
```

---

### 28. Список наград
```bash
curl -X GET http://103.74.92.81:8000/referral/rewards \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
[
  {
    "id": "reward_1",
    "type": "referral_bonus",
    "amount": 500,
    "currency": "RUB",
    "status": "paid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## ⚠️ Обработка ошибок

### 401 - Не авторизован
```bash
curl -X GET http://103.74.92.81:8000/profile
```

**Ответ:**
```json
{
  "message": "Unauthorized"
}
```

### 400 - Неверный запрос
```bash
curl -X POST http://103.74.92.81:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email"
  }'
```

**Ответ:**
```json
{
  "message": "Email and password are required"
}
```

### 404 - Не найдено
```bash
curl -X GET http://103.74.92.81:8000/payments/nonexistent \
  -H "Authorization: Bearer <access_token>"
```

**Ответ:**
```json
{
  "message": "Payment not found"
}
```

---

## 📝 Примечания

1. Замените `<access_token>` на реальный токен из ответа `/auth/login` или `/auth/register`
2. Все суммы в копейках (14900 = 149₽)
3. Все длительности в секундах (2592000 = 30 дней)
4. Даты в формате ISO 8601

---

**Для Postman:** Импортируйте эти примеры или создайте коллекцию на основе этих запросов.

