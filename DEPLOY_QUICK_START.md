# ⚡ Быстрый старт - Деплой на reg.ru

## 🎯 Минимальные шаги для деплоя

### 1. Подготовка (на вашем компьютере)

```bash
# 1. Создайте .env.production
cp .env.production.example .env.production
# Отредактируйте и укажите URL вашего API

# 2. Соберите проект локально (для проверки)
npm run build
```

### 2. На VPS сервере reg.ru

```bash
# 1. Подключитесь по SSH
ssh root@YOUR_IP

# 2. Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Установите PM2
npm install -g pm2

# 4. Установите Nginx
sudo apt update && sudo apt install nginx -y

# 5. Создайте директорию
sudo mkdir -p /var/www/panda-vpn
cd /var/www/panda-vpn

# 6. Загрузите файлы проекта (через Git, SCP или FTP)
# Например через SCP с вашего компьютера:
# scp -r . root@YOUR_IP:/var/www/panda-vpn/

# 7. Установите зависимости
npm install

# 8. Создайте .env.production
nano .env.production
# Добавьте: NEXT_PUBLIC_API_URL=https://api.your-domain.com

# 9. Соберите проект
npm run build

# 10. Настройте PM2
cp ecosystem.config.js.example ecosystem.config.js
nano ecosystem.config.js  # Проверьте пути
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Выполните команду, которую выведет PM2

# 11. Настройте Nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/panda-vpn
sudo nano /etc/nginx/sites-available/panda-vpn  # Замените your-domain.com
sudo ln -s /etc/nginx/sites-available/panda-vpn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 12. Настройте SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. В панели reg.ru

1. Зайдите в "Домены" → ваш домен
2. Перейдите в "DNS-записи"
3. Добавьте A-запись:
   - Имя: `@` (или пусто)
   - Значение: IP вашего VPS
   - TTL: 3600
4. Добавьте A-запись для www:
   - Имя: `www`
   - Значение: IP вашего VPS
   - TTL: 3600

### 4. Готово! 🎉

Через 5-30 минут ваш сайт будет доступен по домену!

---

## 📝 Важные файлы

- `DEPLOY_REG_RU.md` - полная инструкция
- `.env.production.example` - пример переменных окружения
- `ecosystem.config.js.example` - пример конфигурации PM2
- `nginx.conf.example` - пример конфигурации Nginx

---

## 🔧 Быстрые команды

```bash
# Перезапуск приложения
pm2 restart panda-vpn

# Просмотр логов
pm2 logs panda-vpn

# Обновление проекта
cd /var/www/panda-vpn
git pull  # или загрузите новые файлы
npm install
npm run build
pm2 restart panda-vpn
```

---

**Время деплоя:** ~30-60 минут  
**Сложность:** Средняя

