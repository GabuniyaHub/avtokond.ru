# Avtokond UGra - Backend API
## Полнофункциональный бекенд для управления записями на техосмотр

### 📋 Функциональность

✅ **Система записей на техосмотр**
- Запрос кода подтверждения
- Двухэтапная верификация (SMS/Email)
- Повторная отправка кода
- Управление статусами записей
- Поддержка различных типов ТС (легковые, грузовые, автобусы)

✅ **Контактная форма**
- Отправка сообщений
- Email уведомления администратору
- Управление статусами сообщений

✅ **Админ-панель**
- Веб-интерфейс для управления записями
- JWT аутентификация
- Просмотр и редактирование записей
- Просмотр и удаление контактных сообщений
- Статистика по записям

✅ **Безопасность**
- JWT токены с 24-часовым сроком действия
- Bcrypt хеширование паролей
- CORS защита
- Валидация входных данных

### 🚀 Быстрый старт (локально)

```bash
# Установка зависимостей
npm install

# Конфигурация переменных окружения
cp .env.example .env
# Отредактируйте .env файл с вашими параметрами

# Миграция БД
npm run prisma:migrate

# Создание первого администратора
npm run seed

# Запуск в режиме разработки
npm run dev
```

### 🐳 Docker развертывание (Production)

```bash
# Сборка и запуск контейнеров
docker-compose up -d

# Проверка логов
docker-compose logs -f backend

# Остановка контейнеров
docker-compose down
```

### 📁 Структура проекта

```
src/
├── controllers/        # HTTP обработчики
│   ├── AppointmentController.ts
│   ├── ContactController.ts
│   ├── AuthController.ts
│   └── AdminController.ts
├── services/          # Бизнес-логика
│   ├── AppointmentService.ts
│   ├── ContactService.ts
│   └── AuthService.ts
├── routes/           # API маршруты
│   ├── appointmentRoutes.ts
│   ├── contactRoutes.ts
│   └── authRoutes.ts
├── middleware/       # Express middleware
│   └── authMiddleware.ts
├── config/          # Конфигурация
│   ├── database.ts   # Prisma клиент
│   └── email.ts      # Nodemailer конфигурация
├── utils/           # Утилиты
│   └── helpers.ts    # Функции валидации и форматирования
└── index.ts        # Точка входа приложения

prisma/
└── schema.prisma    # Схема БД (Appointment, ContactMessage, Admin)

public/
├── admin/          # Админ-панель
│   ├── index.html
│   └── dashboard.js
├── index.html      # Главная страница
├── css/           # Стили
└── js/            # JavaScript
    └── forms.js   # Обработка форм

scripts/
└── seed.ts        # Скрипт инициализации БД
```

### 🔐 API Endpoints

#### Публичные маршруты

```
POST /api/appointment/request-code
- Запросить код подтверждения
- Body: { fullName, email, phone, vehicleType, vehicleModel, appointmentDate, appointmentTime, ... }

POST /api/appointment/verify
- Подтвердить запись
- Body: { email, code }

POST /api/appointment/resend-code
- Повторно отправить код
- Body: { email }

POST /api/contact
- Отправить контактное сообщение
- Body: { fullName, email, phone, subject, message }
```

#### Защищенные маршруты (требуется JWT токен)

```
GET /api/admin/appointments
- Получить все записи

GET /api/admin/appointments/:id
- Получить запись по ID

PUT /api/admin/appointments/:id/cancel
- Обновить статус записи

GET /api/admin/messages
- Получить все контактные сообщения

GET /api/admin/messages/:id
- Получить сообщение по ID

PUT /api/admin/messages/:id
- Обновить статус сообщения

DELETE /api/admin/messages/:id
- Удалить сообщение
```

#### Аутентификация

```
POST /api/auth/login
- Вход администратора
- Body: { username, password }
- Returns: { token, admin: { id, username, email, role } }

GET /api/auth/verify
- Проверить токен (требуется Authorization header)

POST /api/auth/create-admin
- Создать нового администратора (требуется JWT)
- Body: { username, email, password, role }
```

### ⚙️ Переменные окружения (.env)

```
# Сервер
PORT=3000
NODE_ENV=production

# База данных PostgreSQL
DATABASE_URL=postgresql://user:password@avtokond_db:5432/avtokond_prod

# JWT
JWT_SECRET=your-secret-key-here

# Email (Yandex)
SMTP_HOST=smtp.yandex.com
SMTP_PORT=587
SMTP_USER=your-email@yandex.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@avtokond-ugra.ru
```

### 🔧 Управление БД

```bash
# Создать миграцию
npm run prisma:migrate -- --name migration-name

# Применить миграции
npm run prisma:deploy

# Открыть Prisma Studio (веб-интерфейс БД)
npm run prisma:studio

# Сбросить БД (ВНИМАНИЕ: удаляет все данные)
npm run prisma:reset
```

### 👨‍💼 Первый вход в админ-панель

После запуска сервера:

1. Откройте http://localhost:4080/admin/index.html (или https://avtokond-ugra.ru/admin/index.html)
2. Введите учетные данные:
   - Username: `admin`
   - Password: `admin123`
3. **ОБЯЗАТЕЛЬНО измените пароль после первого входа!**

### 📞 Контактная информация администратора

Email администратора указывается в переменной окружения `ADMIN_EMAIL`.
На этот email будут приходить:
- Уведомления о новых контактных сообщениях
- Уведомления о новых записях на техосмотр

### 🛠️ Разработка

```bash
# Запуск с автоматической перезагрузкой
npm run dev

# Сборка TypeScript
npm run build

# Запуск скомпилированного кода
npm start
```

### 📊 Мониторинг

Docker контейнеры можно мониторить:

```bash
# Просмотр логов бекенда
docker logs -f avtokond_backend

# Просмотр статуса контейнеров
docker ps

# Проверка здоровья контейнеров
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### 🐛 Решение проблем

**Ошибка подключения к БД**
- Убедитесь, что PostgreSQL контейнер запущен: `docker-compose ps`
- Проверьте DATABASE_URL в .env файле
- Проверьте сетевое подключение между контейнерами: `docker network ls`

**Ошибки при отправке Email**
- Проверьте SMTP параметры в .env
- Убедитесь, что пароль приложения для Yandex правильный
- Проверьте, разрешены ли небезопасные приложения

**Админ-панель не загружается**
- Проверьте, что бекенд запущен на порту 4080 (для продакшена)
- Проверьте браузерную консоль на ошибки (F12 > Console)
- Очистите кэш браузера (Ctrl+Shift+Delete)

### 📝 Логирование

Логи приложения выводятся в консоль и содержат:
- Информацию о запросах (метод, путь, время)
- Ошибки и исключения
- Информацию о базе данных

### 🔄 Автоматизация

Docker Compose автоматически:
1. Запускает PostgreSQL контейнер
2. Применяет Prisma миграции
3. Выполняет seed скрипт для создания первого администратора
4. Запускает бекенд сервер на порту 3000 (проксируется через Nginx на 4080)

### 💡 Best Practices

- **Пароли**: Используйте надежные пароли для admin аккаунта
- **HTTPS**: В продакшене всегда используйте HTTPS
- **EMAIL**: Регулярно проверяйте логи email доставки
- **BACKUP**: Регулярно делайте резервные копии БД
- **MONITORING**: Мониторьте логи и здоровье контейнеров

### 📄 Лицензия

ISC

### 👥 Поддержка

Для вопросов и проблем:
1. Проверьте документацию в папке `docx/`
2. Посмотрите логи контейнеров
3. Убедитесь, что все .env переменные установлены правильно
