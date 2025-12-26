#!/bin/bash

# Скрипт для быстрой настройки проекта Panda VPN Frontend

set -e

echo "🚀 Настройка Panda VPN Frontend..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) установлен"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
if command -v pnpm &> /dev/null; then
    echo "Используется pnpm"
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Используется yarn"
    yarn install
else
    echo "Используется npm"
    npm install
fi

# Создание .env.local из примера
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Создание .env.local из .env.example..."
    cp .env.example .env.local
    echo "✅ Файл .env.local создан"
    echo ""
    echo "⚠️  Не забудьте настроить NEXT_PUBLIC_API_URL в .env.local"
    echo "   Для локальной разработки: http://localhost:8000"
    echo "   Для production: https://vpn-p.ru"
else
    echo ""
    echo "ℹ️  Файл .env.local уже существует, пропускаем создание"
fi

echo ""
echo "✨ Настройка завершена!"
echo ""
echo "Для запуска dev сервера выполните:"
echo "  npm run dev"
echo "  или"
echo "  yarn dev"
echo "  или"
echo "  pnpm dev"
echo ""

