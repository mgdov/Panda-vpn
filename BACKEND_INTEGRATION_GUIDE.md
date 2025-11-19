# Интеграция фронтенда с бэкендом

## Быстрый старт

### 1. Настройка CORS на бэкенде

В файле `api/.env` добавьте:

```env
# Для production - укажите домен фронтенда
APP_DOMAIN=your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Для development - можно оставить пустым (разрешены localhost:3000, localhost:5173, localhost:8080)
# Или указать конкретные origins:
# CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2. Базовый URL API

```javascript
// В вашем фронтенде создайте конфиг
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// или для production:
// const API_BASE_URL = 'https://api.your-domain.com';
```

### 3. Пример работы с API

#### Регистрация пользователя

```javascript
async function register(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  const data = await response.json();
  // Сохраняем токены
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}
```

#### Вход

```javascript
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}
```

#### Получение информации о пользователе

```javascript
async function getMe() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Токен истек, попробуем обновить
      await refreshToken();
      return getMe(); // Повторяем запрос
    }
    throw new Error('Failed to get user info');
  }
  
  return await response.json();
}
```

#### Обновление токена

```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  
  if (!response.ok) {
    // Refresh token истек, нужно перелогиниться
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw new Error('Session expired');
  }
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}
```

#### Получение списка клиентов

```javascript
async function getMyClients() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get clients');
  }
  
  return await response.json();
}
```

#### Создание клиента

```javascript
async function createClient(protocol = 'vless', transport = 'tcp', flow = 'xtls-rprx-vision') {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      protocol,
      transport,
      flow,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  
  return await response.json();
}
```

## React пример

### API Service (api.js)

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Попытка обновить токен
      try {
        await this.refreshToken();
        // Повторяем запрос с новым токеном
        config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
        const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
        if (!retryResponse.ok) throw new Error('Authentication failed');
        return await retryResponse.json();
      } catch (error) {
        // Redirect to login
        window.location.href = '/login';
        throw error;
      }
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return await response.json();
  }

  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    const data = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async getClients() {
    return this.request('/clients');
  }

  async createClient(protocol = 'vless', transport = 'tcp', flow = 'xtls-rprx-vision') {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify({ protocol, transport, flow }),
    });
  }

  async getReferralLink() {
    return this.request('/referral/link');
  }

  async getReferralStats() {
    return this.request('/referral/stats');
  }

  async downloadConfig(clientId, format) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${this.baseURL}/configs/${clientId}/${format}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to download config');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config.${format === 'qr' ? 'png' : format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default new ApiService();
```

### React Hook (useAuth.js)

```javascript
import { useState, useEffect } from 'react';
import api from './api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (email, password) => {
    const data = await api.register(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
```

## Vue пример

### API Service (api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor для обработки 401 и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Основные API endpoints

### Аутентификация

- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `POST /auth/refresh` - Обновление токена
- `POST /auth/logout` - Выход
- `GET /auth/me` - Информация о текущем пользователе

### Клиенты

- `GET /clients` - Список клиентов пользователя
- `POST /clients` - Создание клиента
- `DELETE /clients/:id` - Удаление клиента
- `GET /clients/:id/config` - Получение конфигурации клиента

### Конфигурации

- `GET /configs/:client_id/vless` - Скачать VLESS конфиг
- `GET /configs/:client_id/vmess` - Скачать VMess конфиг
- `GET /configs/:client_id/qr` - Скачать QR код
- `GET /configs/:client_id/hiddify` - Скачать Hiddify конфиг
- `GET /configs/:client_id/clash` - Скачать Clash конфиг
- `GET /configs/:client_id/info` - Информация о доступных конфигах

### Реферальная система

- `GET /referral/link` - Получить реферальную ссылку
- `GET /referral/stats` - Статистика по рефералам
- `GET /referral/rewards` - Список наград

### Платежи

- `POST /payments/create` - Создать платеж
- `GET /payments/:id` - Информация о платеже
- `POST /payments/webhook` - Webhook для обработки платежей

## Обработка ошибок

```javascript
try {
  const data = await api.getClients();
} catch (error) {
  if (error.response?.status === 401) {
    // Неавторизован - перенаправить на логин
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    // Нет доступа
    alert('У вас нет доступа к этому ресурсу');
  } else if (error.response?.status >= 500) {
    // Ошибка сервера
    alert('Ошибка сервера. Попробуйте позже.');
  } else {
    // Другие ошибки
    alert(error.message || 'Произошла ошибка');
  }
}
```

## Настройка для production

### 1. Nginx reverse proxy (рекомендуется)

```nginx
# /etc/nginx/sites-available/vpn-api
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Настройка CORS в api/.env

```env
APP_DOMAIN=your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### 3. Настройка фронтенда

```javascript
// .env.production
REACT_APP_API_URL=https://api.your-domain.com
```

## Тестирование интеграции

### Проверка CORS

```bash
# Проверка CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8000/auth/register -v
```

### Проверка API

```bash
# Регистрация
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Вход
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Частые проблемы

### 1. CORS ошибки

**Проблема:** `Access-Control-Allow-Origin` ошибка

**Решение:** 
- Проверьте `CORS_ORIGINS` в `api/.env`
- Убедитесь, что фронтенд отправляет правильный `Origin` header
- В development режиме разрешены `localhost:3000`, `localhost:5173`, `localhost:8080`

### 2. 401 Unauthorized

**Проблема:** Токен истек или не отправляется

**Решение:**
- Проверьте, что токен сохраняется после логина
- Убедитесь, что токен отправляется в header `Authorization: Bearer <token>`
- Реализуйте автоматическое обновление токена при 401

### 3. 403 Forbidden

**Проблема:** Нет доступа к ресурсу

**Решение:**
- Проверьте, что пользователь авторизован
- Убедитесь, что используете правильные endpoints
- Проверьте права доступа пользователя

## Дополнительные ресурсы

- [Полная документация API](./BACKEND_API_SPEC.md)
- [Соответствие API спецификации](./BACKEND_API_COMPLIANCE.md)
- [Примеры API запросов](./BACKEND_API_EXAMPLES.md)

