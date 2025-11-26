# 🚀 Avtokond Backend - Полная документация

## 📚 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Архитектура](#архитектура)
3. [API Endpoints](#api-endpoints)
4. [Установка и запуск](#установка-и-запуск)
5. [Примеры использования](#примеры-использования)

---

## Быстрый старт

### Требования
- **Node.js 18+**
- **PostgreSQL 12+** (или Docker)
- **npm** или **yarn**

### Установка за 2 минуты

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл .env (см. .env.example)
# Обновить переменные окружения

# 3. Инициализировать БД
npm run prisma:migrate

# 4. Запустить в режиме разработки
npm run dev
```

✅ Сервер запустится на `http://localhost:3000`

---

## Архитектура

### Структура проекта

```
src/
├── config/              # Конфигурации
│   ├── database.ts      # Подключение Prisma
│   └── email.ts         # Настройка Nodemailer
│
├── controllers/         # Обработчики HTTP запросов
│   ├── AppointmentController.ts
│   └── ContactController.ts
│
├── services/           # Бизнес-логика
│   ├── AppointmentService.ts
│   └── ContactService.ts
│
├── routes/            # Определение маршрутов
│   ├── appointmentRoutes.ts
│   └── contactRoutes.ts
│
├── middleware/        # Промежуточное ПО
│   └── authMiddleware.ts
│
├── utils/            # Утилиты и помощники
│   └── helpers.ts
│
└── index.ts          # Точка входа приложения

public/
└── js/
    └── forms.js      # Фронтенд скрипт для форм

prisma/
└── schema.prisma     # Описание схемы БД
```

### Стек технологий

```
├── Express.js        - веб-фреймворк
├── TypeScript        - статическая типизация
├── Prisma            - ORM для БД
├── PostgreSQL        - реляционная БД
├── Nodemailer        - отправка email
├── JWT               - аутентификация (планируется)
└── Docker Compose    - контейнеризация
```

---

## API Endpoints

### 🎯 Публичные маршруты

#### 1. Запрос кода подтверждения
```
POST /api/appointment/request-code
Content-Type: application/json

{
  "fullName": "Иван Петров",
  "phone": "8-999-123-45-67",
  "email": "ivan@example.com",
  "vehicleType": "car",
  "vehicleModel": "BMW 320i",
  "appointmentDate": "2025-12-20",
  "appointmentTime": "10:00"
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

#### 2. Подтверждение записи по коду
```
POST /api/appointment/verify
Content-Type: application/json

{
  "email": "ivan@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "message": "Запись успешно подтверждена!",
  "appointmentId": "cly1234..."
}
```

---

#### 3. Отправка контактного сообщения
```
POST /api/contact
Content-Type: application/json

{
  "fullName": "Петр Смирнов",
  "email": "petr@example.com",
  "phone": "8-999-234-56-78",
  "subject": "Вопрос о услугах",
  "message": "Интересует информация о техосмотре грузовиков"
}
```

**Response (201):**
```json
{
  "message": "Спасибо за ваше сообщение...",
  "messageId": "cly1234..."
}
```

---

### 🔐 Административные маршруты (требуют JWT)

#### Получение всех записей
```
GET /api/admin/appointments?status=confirmed&vehicleType=car
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Получение записи по ID
```
GET /api/admin/appointments/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Отмена записи
```
PUT /api/admin/appointments/:id/cancel
Authorization: Bearer YOUR_JWT_TOKEN

{
  "reason": "Причина отмены"
}
```

#### Получение контактных сообщений
```
GET /api/admin/messages?status=unread
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Удаление сообщения
```
DELETE /api/admin/messages/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Установка и запуск

### На локальной машине

```bash
# Установка зависимостей
npm install

# Создание .env файла
cp .env.example .env

# Обновить переменные в .env:
# - DB_USER, DB_PASSWORD
# - EMAIL_USER, EMAIL_PASS
# - JWT_SECRET

# Инициализация базы данных
npm run prisma:migrate

# Запуск в режиме разработки
npm run dev
```

### С использованием Docker

```bash
# Запуск всего стека (DB + Backend)
docker-compose up --build

# Логи
docker-compose logs -f backend

# Остановка
docker-compose down
```

### В продакшене

```bash
# Сборка TypeScript
npm run build

# Запуск скомпилированного кода
npm start
```

---

## Примеры использования

### JavaScript (в браузере)

```javascript
// Пример 1: Запрос кода подтверждения
const response = await fetch('http://localhost:3000/api/appointment/request-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'Иван Петров',
    phone: '89991234567',
    email: 'ivan@example.com',
    vehicleType: 'car',
    vehicleModel: 'BMW',
    appointmentDate: '2025-12-25',
    appointmentTime: '10:00'
  })
});

const data = await response.json();
console.log(data.message); // "Код отправлен..."
```

### cURL

```bash
# Запрос кода
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван",
    "phone": "89991234567",
    "email": "ivan@example.com",
    "vehicleType": "car",
    "vehicleModel": "BMW",
    "appointmentDate": "2025-12-25",
    "appointmentTime": "10:00"
  }'

# Подтверждение кода
curl -X POST http://localhost:3000/api/appointment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "code": "123456"
  }'
```

---

## 🗄️ База данных

### Модель Appointment (Запись на техосмотр)

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | String | Уникальный ID |
| `fullName` | String | Полное имя клиента |
| `phone` | String | Номер телефона |
| `email` | String | Email адрес |
| `vehicleType` | String | Тип ТС (car, bus, truck) |
| `vehicleModel` | String | Марка и модель |
| `vin` | String | VIN номер (опционально) |
| `licensePlate` | String | Гос. номер (опционально) |
| `appointmentDate` | DateTime | Дата записи |
| `appointmentTime` | String | Время записи (HH:mm) |
| `status` | String | Статус (pending, confirmed, cancelled) |
| `isVerified` | Boolean | Подтверждена ли запись |
| `verificationCode` | String | Код для подтверждения |
| `createdAt` | DateTime | Дата создания |
| `updatedAt` | DateTime | Дата обновления |

### Модель ContactMessage (Контактное сообщение)

| Поле | Тип | Описание |
|------|-----|---------|
| `id` | String | Уникальный ID |
| `fullName` | String | Имя отправителя |
| `email` | String | Email отправителя |
| `phone` | String | Телефон (опционально) |
| `subject` | String | Тема сообщения |
| `message` | String | Текст сообщения |
| `status` | String | Статус (unread, read, replied) |
| `createdAt` | DateTime | Дата создания |

---

## 🔒 Безопасность

### Текущие меры
- ✅ Валидация входных данных
- ✅ Защита от пустых полей
- ✅ Проверка формата email и телефона
- ✅ Отправка кода по email (защита от ботов)

### В планах
- 🔄 JWT аутентификация для админ-маршрутов
- 🔄 Rate limiting
- 🔄 HTTPS в продакшене
- 🔄 Логирование всех действий

---

## 📝 Переменные окружения

```env
# === БД ===
DB_USER=avtokond_admin                              # Пользователь PostgreSQL
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD                 # Пароль БД
DATABASE_URL=postgres://user:pass@host:5432/db      # URL подключения

# === EMAIL ===
EMAIL_USER=avtokond2000@yandex.ru                  # Email отправителя
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD                # Пароль приложения Яндекс
EMAIL_TO=avtokond2000@yandex.ru                    # Email администратора

# === СЕРВЕР ===
PORT=3000                                           # Порт сервера
JWT_SECRET=YOUR_VERY_LONG_RANDOM_STRING            # Ключ для JWT токенов
```

---

## 🛠️ Полезные команды

```bash
# Развитие
npm run dev                    # Запуск в режиме hot-reload
npm run build                  # Сборка TypeScript

# БД
npm run prisma:migrate         # Создать и применить миграцию
npm run prisma:studio          # Открыть веб-интерфейс Prisma
npm run prisma:reset           # Сброс БД (⚠️ удалит все данные)

# Docker
docker-compose up              # Запуск контейнеров
docker-compose down            # Остановка контейнеров
docker-compose logs -f         # Просмотр логов

# Продакшен
npm run build && npm start     # Сборка и запуск
```

---

## 🐛 Решение проблем

### Проблема: Ошибка подключения к БД
**Решение**: Проверьте `.env` файл, убедитесь что PostgreSQL запущена

### Проблема: Email не отправляются
**Решение**: Проверьте реквизиты Яндекс почты, используйте пароль приложения

### Проблема: TypeScript ошибки при запуске
**Решение**: Удалите папку `dist` и пересоберите: `npm run build`

---

## 📞 Контакты

- **Email**: avtokond2000@yandex.ru
- **Телефон**: 8 (34677) 33463
- **Адрес**: ул. Сибирская, 121, пгт. Междуреченский

---

## 📄 Лицензия

© 2025 ООО "Автоконд" - Все права защищены
