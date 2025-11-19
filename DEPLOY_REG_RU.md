# 🚀 Деплой на reg.ru - Пошаговая инструкция

## 📋 Варианты деплоя на reg.ru

Reg.ru предоставляет несколько вариантов:

1. **VPS сервер** (рекомендуется для Next.js)
2. **Хостинг с Node.js** (если доступен)
3. **Облачный сервер**

---

## 🎯 Вариант 1: VPS сервер (рекомендуется)

### Шаг 1: Подготовка проекта

#### 1.1. Создайте файл `.env.production`

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
# или
NEXT_PUBLIC_API_URL=http://103.74.92.81:8000
```

#### 1.2. Обновите `next.config.ts` для production

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Для оптимизации деплоя
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL?.replace('https://', '').replace('http://', '') + '/:path*' || 'http://103.74.92.81:8000/:path*',
      },
    ]
  },
};

export default nextConfig;
```

#### 1.3. Создайте файл `.gitignore` (если нет)

```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

### Шаг 2: Подключение к VPS

#### 2.1. Получите доступ к VPS

1. Зайдите в панель управления reg.ru
2. Перейдите в раздел "VPS"
3. Найдите ваш сервер
4. Получите:
   - IP адрес
   - Логин (обычно `root`)
   - Пароль

#### 2.2. Подключитесь по SSH

```bash
ssh root@YOUR_IP_ADDRESS
```

---

### Шаг 3: Установка Node.js на VPS

#### 3.1. Установите Node.js через nvm (рекомендуется)

```bash
# Установка nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузите терминал или выполните:
source ~/.bashrc

# Установите Node.js (LTS версия)
nvm install 20
nvm use 20
nvm alias default 20

# Проверьте установку
node -v
npm -v
```

#### 3.2. Или установите Node.js напрямую

```bash
# Для Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте
node -v
npm -v
```

---

### Шаг 4: Установка PM2 (менеджер процессов)

```bash
npm install -g pm2
```

PM2 нужен для:
- Автоматического перезапуска приложения
- Управления процессами
- Логирования

---

### Шаг 5: Установка Nginx (веб-сервер)

```bash
# Установка
sudo apt update
sudo apt install nginx -y

# Запуск
sudo systemctl start nginx
sudo systemctl enable nginx

# Проверка статуса
sudo systemctl status nginx
```

---

### Шаг 6: Загрузка проекта на сервер

#### 6.1. Вариант A: Через Git (рекомендуется)

```bash
# Установите Git
sudo apt install git -y

# Создайте директорию для проекта
mkdir -p /var/www/panda-vpn
cd /var/www/panda-vpn

# Клонируйте репозиторий (если используете Git)
git clone YOUR_REPOSITORY_URL .

# Или создайте репозиторий на сервере
git init
```

#### 6.2. Вариант B: Через SCP (если нет Git)

На вашем локальном компьютере:

```bash
# Создайте архив проекта (исключая node_modules)
tar -czf panda-vpn.tar.gz --exclude='node_modules' --exclude='.next' --exclude='.git' .

# Загрузите на сервер
scp panda-vpn.tar.gz root@YOUR_IP_ADDRESS:/var/www/

# На сервере распакуйте
ssh root@YOUR_IP_ADDRESS
cd /var/www
tar -xzf panda-vpn.tar.gz -C panda-vpn
```

#### 6.3. Вариант C: Через FTP/SFTP

1. Используйте FileZilla или другой FTP клиент
2. Подключитесь к серверу
3. Загрузите файлы в `/var/www/panda-vpn`

---

### Шаг 7: Установка зависимостей и сборка

```bash
cd /var/www/panda-vpn

# Установите зависимости
npm install

# Создайте .env.production
nano .env.production
# Добавьте:
# NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Соберите проект
npm run build
```

---

### Шаг 8: Настройка PM2

#### 8.1. Создайте файл `ecosystem.config.js`

```bash
nano /var/www/panda-vpn/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'panda-vpn',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/panda-vpn',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/panda-vpn/error.log',
    out_file: '/var/log/panda-vpn/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
```

#### 8.2. Создайте директорию для логов

```bash
sudo mkdir -p /var/log/panda-vpn
sudo chown -R $USER:$USER /var/log/panda-vpn
```

#### 8.3. Запустите приложение через PM2

```bash
cd /var/www/panda-vpn
pm2 start ecosystem.config.js

# Сохраните конфигурацию PM2
pm2 save

# Настройте автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую выведет PM2
```

---

### Шаг 9: Настройка Nginx

#### 9.1. Создайте конфигурацию Nginx

```bash
sudo nano /etc/nginx/sites-available/panda-vpn
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Редирект на HTTPS (после настройки SSL)
    # return 301 https://$server_name$request_uri;

    # Проксирование на Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Кэширование статических файлов
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 9.2. Активируйте конфигурацию

```bash
# Создайте симлинк
sudo ln -s /etc/nginx/sites-available/panda-vpn /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

---

### Шаг 10: Настройка домена в reg.ru

#### 10.1. В панели управления reg.ru

1. Зайдите в раздел "Домены"
2. Выберите ваш домен
3. Перейдите в "DNS-записи" или "Управление DNS"
4. Добавьте/измените записи:

**Запись A:**
```
Тип: A
Имя: @ (или оставьте пустым)
Значение: IP_ВАШЕГО_VPS
TTL: 3600
```

**Запись A для www:**
```
Тип: A
Имя: www
Значение: IP_ВАШЕГО_VPS
TTL: 3600
```

#### 10.2. Подождите распространения DNS

- Обычно 5-30 минут
- Проверить можно: `nslookup your-domain.com`

---

### Шаг 11: Настройка SSL (HTTPS)

#### 11.1. Установите Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 11.2. Получите SSL сертификат

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot автоматически:
- Получит сертификат от Let's Encrypt
- Настроит Nginx для HTTPS
- Настроит автоматическое обновление

#### 11.3. Обновите конфигурацию Nginx для HTTPS

Certbot автоматически обновит конфигурацию, но можно проверить:

```bash
sudo nano /etc/nginx/sites-available/panda-vpn
```

Должно быть что-то вроде:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ... остальная конфигурация
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

### Шаг 12: Обновление переменных окружения

#### 12.1. Обновите `.env.production`

```bash
nano /var/www/panda-vpn/.env.production
```

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
# или если API на другом сервере:
NEXT_PUBLIC_API_URL=http://103.74.92.81:8000
```

#### 12.2. Перезапустите приложение

```bash
pm2 restart panda-vpn
```

---

## 🔧 Полезные команды

### Управление приложением

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs panda-vpn

# Перезапуск
pm2 restart panda-vpn

# Остановка
pm2 stop panda-vpn

# Удаление из PM2
pm2 delete panda-vpn
```

### Обновление приложения

```bash
cd /var/www/panda-vpn

# Если используете Git
git pull origin main

# Установите зависимости (если нужно)
npm install

# Пересоберите
npm run build

# Перезапустите
pm2 restart panda-vpn
```

### Проверка Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка
sudo systemctl reload nginx

# Статус
sudo systemctl status nginx
```

### Проверка портов

```bash
# Проверка, что порт 3000 слушается
sudo netstat -tlnp | grep 3000

# Или
sudo ss -tlnp | grep 3000
```

---

## 🔒 Безопасность

### Настройка Firewall

```bash
# Установите UFW (если не установлен)
sudo apt install ufw -y

# Разрешите SSH
sudo ufw allow 22/tcp

# Разрешите HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включите firewall
sudo ufw enable

# Проверьте статус
sudo ufw status
```

---

## 🎯 Вариант 2: Хостинг с Node.js (если доступен)

Если reg.ru предоставляет хостинг с поддержкой Node.js:

1. **Загрузите файлы через FTP**
   - Загрузите все файлы проекта
   - Исключите `node_modules` и `.next`

2. **Настройте переменные окружения**
   - В панели управления хостингом
   - Добавьте `NEXT_PUBLIC_API_URL`

3. **Установите зависимости**
   - Через SSH или панель управления
   - `npm install`

4. **Соберите проект**
   - `npm run build`

5. **Запустите**
   - `npm start` или через панель управления

---

## 🐳 Вариант 3: Docker (опционально)

Если хотите использовать Docker:

### Создайте `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Создайте `docker-compose.yml`

```yaml
version: '3.8'

services:
  panda-vpn:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.your-domain.com
    restart: unless-stopped
```

---

## ✅ Чеклист деплоя

- [ ] Подготовлен `.env.production`
- [ ] Обновлен `next.config.ts`
- [ ] VPS сервер настроен
- [ ] Node.js установлен
- [ ] PM2 установлен и настроен
- [ ] Nginx установлен и настроен
- [ ] Проект загружен на сервер
- [ ] Зависимости установлены
- [ ] Проект собран (`npm run build`)
- [ ] Приложение запущено через PM2
- [ ] Nginx настроен для проксирования
- [ ] DNS записи настроены в reg.ru
- [ ] SSL сертификат установлен
- [ ] Firewall настроен
- [ ] Приложение доступно по домену

---

## 🆘 Решение проблем

### Приложение не запускается

```bash
# Проверьте логи
pm2 logs panda-vpn

# Проверьте, что порт свободен
sudo lsof -i :3000
```

### Nginx не проксирует

```bash
# Проверьте конфигурацию
sudo nginx -t

# Проверьте логи
sudo tail -f /var/log/nginx/error.log
```

### DNS не работает

```bash
# Проверьте DNS записи
nslookup your-domain.com
dig your-domain.com
```

### SSL не работает

```bash
# Проверьте сертификат
sudo certbot certificates

# Обновите вручную
sudo certbot renew
```

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи PM2: `pm2 logs panda-vpn`
2. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Проверьте статус сервисов: `sudo systemctl status nginx`
4. Обратитесь в поддержку reg.ru

---

**Версия:** 1.0  
**Дата:** 2024-11-18

