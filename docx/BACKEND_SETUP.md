# Avtokond Backend - Система обработки форм

## 📋 Описание

Полнофункциональный бекенд на **Node.js + Express + TypeScript + Prisma** для обработки форм записи на техосмотр и контактных сообщений.

## ✨ Основные возможности

### 1. Запись на техосмотр (двухшаговая верификация)
- **Шаг 1**: Клиент заполняет форму и отправляет запрос
- **Шаг 2**: На email отправляется 6-значный код подтверждения
- **Шаг 3**: Клиент вводит код, запись подтверждается
- Система отправляет подтверждение клиенту и уведомление администратору

### 2. Контактные сообщения
- Форма "Связаться с нами"
- Автоматическая отправка уведомления администратору
- Хранение всех сообщений в БД для ответа

### 3. Административная панель (API)
- Просмотр всех записей и сообщений
- Фильтрация по статусу, типу ТС, датам
- Отмена записей
- Управление контактными сообщениями

---

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- PostgreSQL (или используем Docker Compose)
- npm или yarn

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка .env файла

Обновите файл `.env` с вашими данными:

```env
# === БАЗА ДАННЫХ ===
DB_USER=avtokond_admin
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD
DATABASE_URL=postgres://avtokond_admin:YOUR_STRONG_DB_PASSWORD@localhost:5432/avtokond_prod

# === ПОЧТА (Yandex SMTP) ===
EMAIL_USER=avtokond2000@yandex.ru
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD
EMAIL_TO=avtokond2000@yandex.ru

# === СЕРВЕР ===
PORT=3000
JWT_SECRET=YOUR_VERY_LONG_AND_SECURE_SECRET_STRING
```

⚠️ **Важно**: Для Яндекс почты используйте **пароль приложения**, а не основной пароль:
- https://yandex.ru/support/id/authorization/app-passwords.html

### 3. Инициализация базы данных

```bash
# Создаем миграцию и применяем ее
npm run prisma:migrate

# Или если миграция уже существует
npx prisma migrate deploy
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000`

### 5. Запуск в продакшене

```bash
# Собрать TypeScript
npm run build

# Запустить
npm start
```

---

## 🐳 Запуск с Docker Compose

```bash
docker-compose up --build
```

Это запустит:
- **PostgreSQL** на порту 5432
- **Backend** на порту 4080 (для Nginx)

---

## 📡 API Endpoints

### Публичные маршруты

#### POST `/api/appointment/request-code`
Запросить код подтверждения (1-й шаг)

**Request:**
```json
{
  "fullName": "Иван Петров",
  "phone": "8-999-123-45-67",
  "email": "ivan@example.com",
  "vehicleType": "car",
  "vehicleModel": "BMW 320i",
  "appointmentDate": "2025-12-20",
  "appointmentTime": "10:00",
  "vin": "12345678901234567",
  "licensePlate": "А123БВ86",
  "additionalInfo": "Дополнительная информация"
}
```

**Response (200):**
```json
{
  "message": "Код подтверждения отправлен на ваш email",
  "email": "ivan@example.com"
}
```

---

#### POST `/api/appointment/verify`
Подтвердить запись по коду (2-й шаг)

**Request:**
```json
{
  "email": "ivan@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "message": "Запись успешно подтверждена!",
  "appointmentId": "cly1234567890abcdef"
}
```

---

#### POST `/api/appointment/resend-code`
Повторно отправить код подтверждения

**Request:**
```json
{
  "email": "ivan@example.com"
}
```

**Response (200):**
```json
{
  "message": "Новый код отправлен на ваш email",
  "email": "ivan@example.com"
}
```

---

#### POST `/api/contact`
Отправить контактное сообщение

**Request:**
```json
{
  "fullName": "Иван Петров",
  "email": "ivan@example.com",
  "phone": "8-999-123-45-67",
  "subject": "Вопрос по услугам",
  "message": "Интересует стоимость техосмотра для грузовика"
}
```

**Response (201):**
```json
{
  "message": "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время",
  "messageId": "cly1234567890abcdef"
}
```

---

### Административные маршруты (требуют JWT токена)

#### GET `/api/admin/appointments`
Получить все записи (с фильтрацией)

**Query параметры:**
- `status` - pending, confirmed, cancelled, completed
- `vehicleType` - car, bus, truck
- `startDate` - начало диапазона (ISO 8601)
- `endDate` - конец диапазона (ISO 8601)

**Пример:**
```
GET /api/admin/appointments?status=confirmed&vehicleType=car
```

---

#### GET `/api/admin/appointments/:id`
Получить запись по ID

---

#### PUT `/api/admin/appointments/:id/cancel`
Отменить запись

**Request:**
```json
{
  "reason": "Причина отмены"
}
```

---

#### GET `/api/admin/messages`
Получить все контактные сообщения

**Query параметры:**
- `status` - unread, read, replied

---

#### GET `/api/admin/messages/:id`
Получить сообщение по ID (отмечает как прочитанное)

---

#### DELETE `/api/admin/messages/:id`
Удалить сообщение

---

## 🗄️ Структура базы данных

### Модель `Appointment`
```
- id: String (уникальный ID)
- fullName: String
- phone: String
- email: String
- vehicleType: String (car, bus, truck)
- vehicleModel: String
- vin: String (опционально)
- licensePlate: String (опционально)
- appointmentDate: DateTime
- appointmentTime: String
- busCategory: String (M2, M3 для автобусов)
- additionalInfo: String
- status: String (pending, confirmed, cancelled, completed)
- verificationCode: String (код подтверждения)
- verificationCodeExpiresAt: DateTime
- isVerified: Boolean
- createdAt: DateTime
- updatedAt: DateTime
- completedAt: DateTime (опционально)
```

### Модель `ContactMessage`
```
- id: String
- fullName: String
- email: String
- phone: String (опционально)
- subject: String
- message: String
- status: String (unread, read, replied)
- createdAt: DateTime
- updatedAt: DateTime
```

### Модель `Admin`
```
- id: String
- username: String (уникальный)
- email: String (уникальный)
- passwordHash: String
- role: String (admin, moderator)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

---

## 📝 Примеры использования

### Пример 1: Запись на техосмотр легкового автомобиля

```javascript
// 1. Запрашиваем код
const step1 = await fetch('http://localhost:3000/api/appointment/request-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Петр Иванов',
    phone: '89991234567',
    email: 'petr@example.com',
    vehicleType: 'car',
    vehicleModel: 'Toyota Camry',
    appointmentDate: '2025-12-25',
    appointmentTime: '14:00'
  })
});

// 2. Пользователь вводит код из email и отправляем верификацию
const step2 = await fetch('http://localhost:3000/api/appointment/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'petr@example.com',
    code: '123456' // Код из email
  })
});
```

### Пример 2: Отправка контактного сообщения

```javascript
const response = await fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Александр Смирнов',
    email: 'alex@example.com',
    phone: '89991234567',
    subject: 'Вопрос о скидках',
    message: 'Есть ли скидки для корпоративных клиентов?'
  })
});
```

---

## 🔧 Управление базой данных

### Просмотр схемы БД
```bash
npx prisma studio
```

Откроет веб-интерфейс для управления БД на `http://localhost:5555`

### Создание миграции
```bash
npx prisma migrate dev --name init
```

### Сброс БД (⚠️ удалит все данные)
```bash
npx prisma migrate reset
```

### Генерация Prisma Client
```bash
npx prisma generate
```

---

## 🔐 Безопасность

### TODO: Реализовать

- [ ] JWT аутентификация для админ-маршрутов
- [ ] Валидация входных данных (более строгая)
- [ ] Rate limiting для предотвращения спама
- [ ] HTTPS в продакшене
- [ ] CORS с конкретным доменом вместо `*`
- [ ] Логирование и мониторинг
- [ ] Хеширование паролей администраторов (bcryptjs)

---

## 📚 Используемые зависимости

- **express** - веб-фреймворк
- **typescript** - статическая типизация
- **prisma** - ORM для БД
- **nodemailer** - отправка email
- **cors** - поддержка CORS
- **dotenv** - управление переменными окружения
- **nodemon** - автоперезагрузка в режиме разработки
- **ts-node** - выполнение TypeScript напрямую

---

## 🤝 Интеграция с фронтендом

На странице `public/index.html` подключен скрипт `forms.js`, который автоматически обрабатывает:

1. **Форму записи на техосмотр** - отправляет на `POST /api/appointment/request-code`
2. **Форму контактов** - отправляет на `POST /api/contact`

Скрипт также управляет модальным окном для ввода кода подтверждения.

---

## 🐛 Отладка

### Просмотр логов Docker Compose
```bash
docker-compose logs -f backend
docker-compose logs -f db
```

### Подключение к БД напрямую
```bash
psql -h localhost -U avtokond_admin -d avtokond_prod
```

### Тестирование API с cURL
```bash
# Запрос кода
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test",
    "phone": "89991234567",
    "email": "test@example.com",
    "vehicleType": "car",
    "vehicleModel": "BMW",
    "appointmentDate": "2025-12-25",
    "appointmentTime": "10:00"
  }'
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в Docker или консоли
2. Убедитесь, что PostgreSQL запущена
3. Проверьте, что `.env` содержит корректные данные
4. Убедитесь, что почтовые реквизиты Яндекса верны

---

## 📄 Лицензия

ООО "Автоконд" - 2025
