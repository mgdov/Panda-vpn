# 🚀 Быстрое исправление: Mixed Content Error

## Проблема

```
Mixed Content: The page at 'https://vpn-p.ru/auth/signup' was loaded over HTTPS, 
but requested an insecure resource 'http://103.74.92.81:8000/auth/register'.
```

## Решение (3 шага)

### 1. Создать `.env.production` на сервере

```bash
cd ~/Panda-vpn
echo "NEXT_PUBLIC_API_URL=https://vpn-p.ru" > .env.production
cat .env.production  # Проверить
```

### 2. Пересобрать фронтенд

```bash
npm run build
```

### 3. Перезапустить PM2 с обновлением переменных

```bash
# Если процесс уже запущен
pm2 restart panda-vpn-frontend --update-env

# Если процесс не запущен
pm2 start npm --name panda-vpn-frontend -- start
pm2 save
```

### 4. Проверить

```bash
# Проверить переменные в PM2
pm2 env panda-vpn-frontend | grep NEXT_PUBLIC

# Проверить логи
pm2 logs panda-vpn-frontend --lines 50
```

## Что исправлено в коде

✅ Убраны хардкоды `http://103.74.92.81:8000` из:
- `app/api/[...path]/route.ts`
- `next.config.ts`

✅ Теперь везде используется `https://vpn-p.ru` как fallback

## Проверка в браузере

1. Откройте `https://vpn-p.ru/auth/signup`
2. Откройте DevTools → Network
3. Попробуйте зарегистрироваться
4. Запрос должен идти на `https://vpn-p.ru/api/auth/register` ✅
5. НЕ должно быть запросов на `http://103.74.92.81:8000` ❌

## Если не помогло

```bash
# Полностью очистить кэш Next.js
rm -rf .next
npm run build
pm2 delete panda-vpn-frontend
pm2 start npm --name panda-vpn-frontend -- start
pm2 save
```

