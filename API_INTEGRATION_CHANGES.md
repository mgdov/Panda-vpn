# 🔄 Изменения в интеграции API

## ✅ Обновления типов данных

### 1. AuthResponse
**Было:**
```typescript
{
  access_token: string
  refresh_token: string
  expires_in: number
}
```

**Стало:**
```typescript
{
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_at: string  // NEW
  user: User                  // NEW
  roles: string[]            // NEW
}
```

### 2. User
**Добавлены поля:**
- `marzban_id: string | null`
- `is_active: boolean`
- `is_admin: boolean`
- `referral_code: string | null`
- `referred_by: string | null`
- `created_at: string`
- `updated_at: string`

**Nullable поля:**
- `email: string | null` (может быть null для Telegram пользователей)
- `telegram_id: number | null`
- `marzban_username: string | null`

### 3. VPNClient и VPNKey
**Nullable поля:**
- `transport: string | null`
- `expires_at: string | null`
- `subscription_url: string | null`
- `config_text: string | null`

### 4. Новый тип: InternalClient
**Для `/me/clients` (внутренние клиенты):**
```typescript
{
  id: string
  uuid_key: string
  protocol: string
  transport: string
  flow: string | null
  status: string
  expires_at: string | null
}
```

**⚠️ ВАЖНО:** Это НЕ то же самое, что VPNClient!

### 5. UsageStats
**Опциональные поля:**
- `client_id?: string`
- `expires?: string`

Формат может отличаться в зависимости от Marzban API.

### 6. Invoice и Payment
**Добавлены поля:**
- `external_id: string | null`
- `metadata: Record<string, unknown>`
- `raw_payload: Record<string, unknown>`
- `provider: string`
- `provider_payment_id: string`

**Nullable поля:**
- `user_id: string | null`
- `tariff_id: string | null`

### 7. BillingState
**Nullable поля:**
- `expires_at: string | null`
- `last_sync: string | null`
- `last_payment_id: string | null`

**Добавлены поля:**
- `created_at: string`
- `updated_at: string`
- `event_type: string` (вместо `action`)
- `reason: string | null`
- `raw_payload: Record<string, unknown>`

### 8. RegisterRequest
**Добавлено поле:**
- `referral?: string`

### 9. CreateClientRequest
**Изменения:**
- `flow: string` (теперь обязательное)
- `node_id?: string | null` (теперь опциональное)
- `meta?: Record<string, unknown> | null`

---

## ⚠️ Критические изменения

### 1. Две таблицы клиентов

**КРИТИЧЕСКИ ВАЖНО:**

- **`/profile/keys`** → возвращает `VPNKey[]` из таблицы `marzban_clients`
- **`/me/clients`** → возвращает `InternalClient[]` из таблицы `clients`

**Это разные источники данных и могут не совпадать!**

**Использование:**
```typescript
// Для отображения VPN ключей (из Marzban)
const keys = await apiClient.getProfileKeys()
// keys[].marzban_client_id - это ID для /configs/*

// Для управления клиентами (внутренние)
const clients = await apiClient.getMeClients()
// clients[].id - это ID для /me/clients/:id/revoke
```

### 2. Форматы ID

**Внутренний UUID:**
- Из `InternalClient.id` или `VPNClient.id`
- Используется в `/me/clients/:id/revoke`

**Marzban ID:**
- Из `VPNClient.marzban_client_id` или `VPNKey.marzban_client_id`
- Используется в `/vpn/config/:client_id` и `/configs/:client_id/*`

**Пример:**
```typescript
// Для получения конфига
const keys = await apiClient.getProfileKeys()
const marzbanId = keys[0].marzban_client_id
const config = await apiClient.getVPNConfig(marzbanId)

// Для отзыва клиента
const clients = await apiClient.getMeClients()
const internalId = clients[0].id
await apiClient.revokeClient(internalId)
```

### 3. Nullable поля

**Всегда проверяйте nullable поля:**
```typescript
// ❌ ПЛОХО
const email = user.email
const transport = client.transport

// ✅ ХОРОШО
const email = user.email || ''
const transport = client.transport || 'tcp'
const expiresAt = client.expires_at ? new Date(client.expires_at) : null

// Проверка перед использованием
if (client.config_text) {
  // Использовать config_text
} else {
  // Запросить конфиг или показать сообщение
}
```

### 4. Обработка ошибок

**Новые форматы ошибок:**
```typescript
// Все ошибки возвращаются как:
{
  "message": "описание ошибки"
}

// Специфичные сообщения:
- "invalid login" - неверный email или password
- "user inactive" - пользователь деактивирован
- "invalid refresh token" - refresh token истек или невалидный
- "client not found" - клиент не найден или не принадлежит пользователю
- "no clients found" - у пользователя нет клиентов
- "client does not belong to user" - клиент принадлежит другому пользователю
```

**Обработка:**
```typescript
try {
  await apiClient.login({ email, password })
} catch (error) {
  if (error instanceof Error) {
    switch (error.message) {
      case 'invalid login':
        // Показать ошибку входа
        break
      case 'user inactive':
        // Показать сообщение о деактивации
        break
      // ...
    }
  }
}
```

### 5. Обновление токенов

**При каждом refresh генерируется новый refresh token:**
```typescript
// Старый refresh token автоматически инвалидируется
// Новый записывается поверх старого
const refreshed = await apiClient.refreshAccessToken()
// Если успешно - токены обновлены
// Если не успешно - нужно разлогинить пользователя
```

---

## 📝 Примеры использования

### Регистрация с реферальным кодом
```typescript
await apiClient.register({
  email: "user@example.com",
  password: "password123",
  referral: "ABC123" // опционально
})
```

### Получение профиля
```typescript
const profile = await apiClient.getProfile()
// profile.user.email может быть null
// profile.clients - массив из marzban_clients
```

### Работа с клиентами
```typescript
// Получить VPN ключи (из Marzban)
const keys = await apiClient.getProfileKeys()
// keys[].marzban_client_id - для /configs/*

// Получить внутренние клиенты
const clients = await apiClient.getMeClients()
// clients[].id - для /me/clients/:id/revoke

// Создать клиента
const newClient = await apiClient.createClient({
  protocol: "vless",
  transport: "tcp",
  flow: "xtls-rprx-vision",
  node_id: "1", // опционально
  meta: { device: "iPhone" } // опционально
})
// newClient.client_id - внутренний UUID
// newClient.uuid - UUID для конфига
```

### Получение статистики использования
```typescript
// Формат может отличаться
const usage = await apiClient.getProfileUsage(clientId)
// Может быть: { up, down, total }
// Или: { client_id, up, down, total, expires }
```

### Получение конфига
```typescript
// Используйте marzban_client_id
const keys = await apiClient.getProfileKeys()
const config = await apiClient.getVPNConfig(keys[0].marzban_client_id)
// config.config - текст конфига
// config.subscription_url - URL подписки
```

---

## 🔧 Обновленные компоненты

### app/dashboard/page.tsx
- Обновлена обработка nullable полей
- Добавлено сохранение `marzban_client_id` для использования в конфигах

### lib/api/types.ts
- Обновлены все типы в соответствии с реальным API
- Добавлен тип `InternalClient`
- Все nullable поля помечены как `| null`

### lib/api/client.ts
- Добавлены комментарии о различиях между таблицами клиентов
- Обновлены типы возвращаемых значений

---

## ✅ Чеклист миграции

- [x] Обновлены типы данных
- [x] Обновлен API клиент
- [x] Обновлена обработка nullable полей
- [x] Добавлены комментарии о различиях таблиц клиентов
- [ ] Обновить компоненты, использующие клиентов (если нужно)
- [ ] Обновить обработку ошибок (если нужно)
- [ ] Протестировать все endpoints

---

**Версия:** 1.0  
**Дата:** 2024-11-18

