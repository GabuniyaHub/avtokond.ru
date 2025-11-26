# 📁 Структура файлов проекта

## 📂 Корневая папка

```
avtokond-ugra.ru/
├── 📄 .env                           ← Переменные окружения (НУЖНО ЗАПОЛНИТЬ)
├── 📄 .gitignore                     ← Файлы для игнорирования в git
├── 📄 package.json                   ← Зависимости и скрипты npm
├── 📄 tsconfig.json                  ← Конфигурация TypeScript
├── 📄 docker-compose.yml             ← Конфигурация Docker
├── 📄 Dockerfile                     ← Образ для контейнера backend
│
├── 📚 ДОКУМЕНТАЦИЯ:
│   ├── 📄 QUICKSTART.md              ← ⭐ Начните отсюда! (5 минут)
│   ├── 📄 DEPLOYMENT.md              ← Инструкция по развертыванию
│   ├── 📄 BACKEND_README.md          ← Полная документация
│   ├── 📄 BACKEND_SETUP.md           ← Подробная настройка
│   ├── 📄 API_EXAMPLES.md            ← Примеры вызовов API
│   └── 📄 COMPLETION_SUMMARY.md      ← Что было создано
│
├── 📁 src/                           ← Исходный код TypeScript
│   ├── 📄 index.ts                   ← Точка входа (запуск Express)
│   │
│   ├── 📁 config/                    ← Конфигурационные файлы
│   │   ├── 📄 database.ts            ← Подключение Prisma
│   │   └── 📄 email.ts               ← Конфигурация Nodemailer
│   │
│   ├── 📁 controllers/               ← Обработчики HTTP запросов
│   │   ├── 📄 AppointmentController.ts   ← Обработка записей на ТО
│   │   ├── 📄 ContactController.ts      ← Обработка контактных форм
│   │   └── 📄 AdminController.ts        ← Админ функции (планируется)
│   │
│   ├── 📁 services/                  ← Бизнес-логика приложения
│   │   ├── 📄 AppointmentService.ts  ← Логика записей
│   │   └── 📄 ContactService.ts      ← Логика контактных сообщений
│   │
│   ├── 📁 routes/                    ← Определение маршрутов API
│   │   ├── 📄 appointmentRoutes.ts   ← Маршруты /api/appointment
│   │   └── 📄 contactRoutes.ts       ← Маршруты /api/contact
│   │
│   ├── 📁 middleware/                ← Промежуточное ПО (middleware)
│   │   └── 📄 authMiddleware.ts      ← Аутентификация (JWT)
│   │
│   └── 📁 utils/                     ← Вспомогательные функции
│       └── 📄 helpers.ts             ← Утилиты валидации, форматирования
│
├── 📁 prisma/                        ← ORM Prisma
│   └── 📄 schema.prisma              ← Описание модели БД ⭐ ВАЖНО
│
├── 📁 public/                        ← Статические файлы (HTML, CSS, JS)
│   ├── 📄 index.html                 ← Главная страница сайта
│   ├── 📁 js/
│   │   ├── 📄 forms.js               ← ⭐ Обработка форм (ВАЖНО)
│   │   └── 📄 validator.js           ← Валидация на клиенте
│   ├── 📁 pages/
│   │   ├── 📄 about.company.html
│   │   └── 📄 client.info.html
│   ├── 📁 certificates/              ← Сертификаты компании
│   ├── 📁 documents/                 ← Документы компании
│   └── 📁 img/                       ← Изображения
│
└── 📁 nginx/                         ← Конфигурация Nginx (для продакшена)
    ├── 📄 conf.txt                   ← Конфигурация Nginx
    └── 📄 login.to.server.txt        ← Доступ к серверу
```

---

## 🔑 Ключевые файлы для редактирования

### 1. `.env` (ПЕРВОЕ, что нужно заполнить!)
```env
# Переменные окружения для работы приложения
# Откройте этот файл и заполните значения!

DB_USER=avtokond_admin
DB_PASSWORD=YOUR_STRONG_PASSWORD      # ← Измените!
DATABASE_URL=postgres://...            # ← Автоматически генерируется
EMAIL_USER=avtokond2000@yandex.ru
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD  # ← Пароль приложения!
JWT_SECRET=YOUR_VERY_LONG_SECRET     # ← Измените!
PORT=3000
```

### 2. `prisma/schema.prisma` (Структура БД)
```prisma
model Appointment {
  // Определение таблицы записей на техосмотр
  id    String  @id @default(cuid())
  fullName String
  // ... и другие поля
}
```

### 3. `src/index.ts` (Главная точка входа)
```typescript
// Запуск Express сервера
// Подключение маршрутов
// Настройка middleware
```

### 4. `public/js/forms.js` (Обработка форм на фронтенде)
```javascript
// Класс AppointmentForm - обработка записей
// Класс ContactForm - обработка контактных сообщений
// Модальное окно для ввода кода подтверждения
```

---

## 📚 Файлы контроллеров и сервисов

### AppointmentController.ts
Методы:
- `requestAppointment()` - запрос кода подтверждения
- `verifyAppointment()` - подтверждение записи
- `getAllAppointments()` - получить все записи (admin)
- `cancelAppointment()` - отменить запись

### AppointmentService.ts
Методы бизнес-логики:
- `requestAppointment()` - создание новой записи
- `verifyAppointment()` - верификация по коду
- `resendVerificationCode()` - повторная отправка кода

### ContactController.ts
Методы:
- `createMessage()` - создать сообщение
- `getAllMessages()` - получить все (admin)
- `deleteMessage()` - удалить сообщение

### ContactService.ts
Методы бизнес-логики:
- `createMessage()` - создание сообщения
- `getAllMessages()` - получение сообщений

---

## 🔄 Поток данных

### Для записи на техосмотр:

```
1. public/index.html (форма)
   ↓
2. public/js/forms.js (AppointmentForm класс)
   ↓
3. POST /api/appointment/request-code
   ↓
4. src/routes/appointmentRoutes.ts
   ↓
5. src/controllers/AppointmentController.ts
   ↓
6. src/services/AppointmentService.ts
   ↓
7. src/config/database.ts (Prisma)
   ↓
8. PostgreSQL (сохранение)
   ↓
9. src/config/email.ts (отправка письма)
   ↓
10. Yandex SMTP (email)
```

---

## 🚀 Скрипты npm

Находятся в `package.json`:

```bash
npm run dev              # Запуск в режиме разработки (hot-reload)
npm run build            # Сборка TypeScript → JavaScript
npm start                # Запуск скомпилированного кода
npm run prisma:migrate   # Создать и применить миграцию БД
npm run prisma:studio    # Открыть веб-интерфейс Prisma
npm run prisma:reset     # Сброс БД (ОСТОРОЖНО!)
```

---

## 📊 Размер и сложность

| Файл | Строк | Сложность |
|------|-------|-----------|
| src/index.ts | ~100 | ⭐ Средняя |
| AppointmentController.ts | ~150 | ⭐⭐ Выше средней |
| AppointmentService.ts | ~200 | ⭐⭐ Выше средней |
| ContactController.ts | ~100 | ⭐ Средняя |
| ContactService.ts | ~80 | ⭐ Средняя |
| config/email.ts | ~150 | ⭐ Средняя |
| public/js/forms.js | ~400 | ⭐⭐ Выше средней |
| prisma/schema.prisma | ~80 | ⭐ Средняя |

---

## 🔒 Файлы в .gitignore (не коммитятся)

```
node_modules/           # Зависимости npm
dist/                   # Скомпилированный код
.env                    # Переменные окружения
postgres_data/          # Данные БД Docker
nginx/                  # Конфигурация Nginx
```

---

## 🎯 Основной workflow

1. **Разработка**
   - Редактируем файлы в `src/`
   - Запускаем `npm run dev`
   - Сервер автоматически перезагружается

2. **Тестирование**
   - Используем cURL, Postman или DevTools браузера
   - Смотрим логи в консоли

3. **Продакшен**
   - Запускаем `npm run build`
   - Запускаем `npm start`
   - Или используем Docker: `docker-compose up`

---

## 📝 Примечания

- **Все документация в корне проекта** (`*.md` файлы)
- **Первый запуск**: читайте `QUICKSTART.md`
- **Проблемы с установкой**: смотрите `DEPLOYMENT.md`
- **Примеры API**: `API_EXAMPLES.md`
- **Что было сделано**: `COMPLETION_SUMMARY.md`

---

## ✅ Контрольный список

- [ ] Прочитал `QUICKSTART.md`
- [ ] Заполнил `.env` файл
- [ ] Запустил `npm install`
- [ ] Запустил `npm run prisma:migrate`
- [ ] Запустил `npm run dev`
- [ ] Тестировал API через cURL
- [ ] Проверил, что письма отправляются

---

## 🚀 Готово!

Все файлы созданы и готовы к использованию!

Начните с `QUICKSTART.md` для быстрого старта.
