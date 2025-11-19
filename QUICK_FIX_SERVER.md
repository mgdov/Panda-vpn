# ⚡ Быстрое решение проблемы на сервере

## Проблема: `next: команда не найдена`

### Шаг 1: Установите зависимости

```bash
cd /var/www/u3327901/data/www/Panda-vpn-main
npm install
```

**Это займет 2-5 минут.** Дождитесь завершения установки.

---

### Шаг 2: Проверьте версию Node.js

```bash
node -v
```

**Нужна версия 18.x или 20.x**

Если версия меньше 18:
- Зайдите в панель управления reg.ru
- Найдите раздел "Node.js" или "Версии"
- Выберите Node.js 20.x
- Примените изменения

---

### Шаг 3: Соберите проект

```bash
# Обычная сборка (без turbopack - использует меньше памяти)
npm run build

# Или если есть проблемы с памятью:
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

### Шаг 4: Если все еще ошибка

Используйте `npx`:

```bash
npx next build
```

Или напрямую:

```bash
./node_modules/.bin/next build
```

---

## Полная последовательность команд

```bash
# 1. Перейдите в директорию
cd /var/www/u3327901/data/www/Panda-vpn-main

# 2. Проверьте Node.js
node -v
# Если версия < 18, обновите через панель reg.ru

# 3. Установите зависимости
npm install

# 4. Создайте .env.production
echo "NEXT_PUBLIC_API_URL=http://103.74.92.81:8000" > .env.production

# 5. Соберите проект
npm run build

# 6. Если успешно - запустите
npm start
```

---

## Если npm install не работает

Проверьте:

```bash
# Версия npm
npm -v

# Очистите кэш
npm cache clean --force

# Попробуйте снова
npm install
```

---

## Альтернатива: Сборка локально

Если на сервере проблемы, соберите на своем компьютере:

```bash
# На вашем Mac
npm run build

# Создайте архив
tar -czf build.tar.gz .next package.json package-lock.json

# Загрузите на сервер
scp build.tar.gz u3327901@server287.reg.ru:/var/www/u3327901/data/www/Panda-vpn-main/

# На сервере распакуйте
cd /var/www/u3327901/data/www/Panda-vpn-main
tar -xzf build.tar.gz
npm install --production
npm start
```

