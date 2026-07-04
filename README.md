# 🚗 Avtokond-Ugra: Система управления записями и техосмотром

## 📋 Описание проекта

**Avtokond-Ugra** - это модернизированная веб-платформа для компании ООО "Автоконд", которая предоставляет:

✅ **Онлайн запись** на техосмотр с двухфакторной верификацией  
✅ **Контактные формы** для обратной связи  
✅ **Административная панель** для управления записями (планируется)  
✅ **Email уведомления** для клиентов и администраторов  
✅ **Защищенное хранилище** данных в PostgreSQL  

---

## 🚀 Быстрый старт

### За 5 минут до первого запуска:

```bash
# 1. Установить зависимости
npm install

# 2. Настроить .env файл (заполнить переменные окружения)
# Просто отредактируйте файл .env

# 3. Инициализировать БД
npm run prisma:migrate

# 4. Запустить сервер
npm run dev
```

✅ Сервер запустится на **http://localhost:3000**

---

## 📚 Документация

| Документ | Описание |
|----------|---------|
| **QUICKSTART.md** | ⭐ Начните отсюда! Быстрый старт за 5 минут |
| **BACKEND_README.md** | Полная документация API и архитектура |
| **BACKEND_SETUP.md** | Подробная инструкция по настройке |
| **API_EXAMPLES.md** | Примеры использования API (cURL, JavaScript) |
| **DEPLOYMENT.md** | Развертывание приложения (локально и в Docker) |
| **FILE_STRUCTURE.md** | Описание структуры файлов проекта |
| **COMPLETION_SUMMARY.md** | Что было создано и реализовано |

---

## 🛠 Стек технологий

| Слой | Технология | Описание |
|------|-----------|---------|
| **Фронтенд** | HTML, CSS, JavaScript | Основной сайт и формы |
| **Бэкенд** | Node.js, Express, TypeScript | REST API для обработки запросов |
| **База данных** | PostgreSQL, Prisma | Хранение записей и сообщений |
| **Email** | Nodemailer, Yandex SMTP | Отправка уведомлений |
| **Инфраструктура** | Docker, Docker Compose | Контейнеризация сервисов |
| **ORM** | Prisma | Управление базой данных |

---

## 📊 Структура проекта

```
avtokond-ugra.ru/
├── src/                          # Исходный код TypeScript
│   ├── index.ts                  # Точка входа приложения
│   ├── config/                   # Конфигурации (БД, Email)
│   ├── controllers/              # Обработчики HTTP запросов
│   ├── services/                 # Бизнес-логика
│   ├── routes/                   # Определение маршрутов API
│   ├── middleware/               # Промежуточное ПО (auth, etc)
│   └── utils/                    # Вспомогательные функции
│
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Описание структуры БД
│
├── public/                       # Статические файлы
│   ├── index.html                # Главная страница
│   ├── js/forms.js              # Обработка форм
│   └── pages/                    # Другие страницы
│
├── 📚 ДОКУМЕНТАЦИЯ
│   ├── QUICKSTART.md
│   ├── BACKEND_README.md
│   ├── API_EXAMPLES.md
│   ├── DEPLOYMENT.md
│   └── ...
│
├── package.json                  # Зависимости npm
├── tsconfig.json                 # Конфигурация TypeScript
├── docker-compose.yml            # Docker конфигурация
├── .env                          # Переменные окружения
└── Dockerfile                    # Образ для контейнера
```

---

## 🎯 Основные функции

### 1. Запись на техосмотр

```
Клиент → Заполняет форму → API получает запрос
         ↓
Система → Генерирует код → Отправляет на email
         ↓
Клиент → Получает письмо → Вводит код на сайте
         ↓
Система → Подтверждает → Отправляет уведомления
```

### 2. Контактные сообщения

```
Клиент → Заполняет форму "Связаться"
         ↓
Система → Сохраняет в БД → Отправляет администратору
         ↓
Администратор → Видит в админ-панели → Может ответить
```

### 3. API для администраторов

- Просмотр всех записей на техосмотр
- Фильтрация по статусу, типу ТС, датам
- Отмена записей
- Просмотр контактных сообщений
- Управление сообщениями

---

## 🔗 API Endpoints

### Публичные маршруты

```
POST   /api/appointment/request-code      Запрос кода подтверждения
POST   /api/appointment/verify             Подтверждение записи
POST   /api/appointment/resend-code        Повторная отправка кода
POST   /api/contact                        Отправка контактного сообщения
```

### Административные маршруты (требуют авторизации)

```
GET    /api/admin/appointments             Получить все записи
GET    /api/admin/appointments/:id         Получить запись по ID
PUT    /api/admin/appointments/:id/cancel  Отменить запись
GET    /api/admin/messages                 Получить все сообщения
DELETE /api/admin/messages/:id             Удалить сообщение
```

---

## 💾 База данных

### Модель Appointment (Запись на техосмотр)
- ID, ФИО, телефон, email
- Тип и модель ТС
- Дата и время записи
- Статус и код верификации
- История создания/обновления

### Модель ContactMessage (Контактное сообщение)
- ID, ФИО, email, телефон
- Тема и текст сообщения
- Статус (непрочитано, прочитано, отвечено)
- Дата создания

---

## 🔒 Безопасность

✅ Валидация всех входных данных  
✅ Отправка кода по email (защита от ботов)  
✅ Код действует только 15 минут  
✅ Проверка формата email и телефона  
✅ Хранение в защищенной БД  

🔄 В планах: JWT аутентификация, Rate limiting, HTTPS

---

## 🚀 Развертывание

### Локально
```bash
npm install
npm run prisma:migrate
npm run dev
```

### С Docker
```bash
docker-compose up --build
```

### В продакшене
```bash
npm run build
npm start
```

Подробнее в `DEPLOYMENT.md`

---

## 🧪 Примеры использования

### JavaScript (в браузере)
```javascript
const response = await fetch('http://localhost:3000/api/appointment/request-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
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
```

### cURL
```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Иван","phone":"89991234567",...}'
```

Больше примеров в `API_EXAMPLES.md`

---

## 📝 Конфигурация

Все настройки находятся в файле `.env`:

```env
# База данных
DB_USER=avtokond_admin
DB_PASSWORD=YOUR_PASSWORD
DATABASE_URL=postgres://...

# Email (Yandex SMTP)
EMAIL_USER=avtokond2000@yandex.ru
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD

# Сервер
PORT=3000
JWT_SECRET=YOUR_SECRET
```

---

## 🛠️ Полезные команды

```bash
npm run dev                # Запуск в режиме разработки
npm run build              # Сборка TypeScript
npm start                  # Запуск в продакшене
npm run prisma:migrate     # Миграция БД
npm run prisma:studio      # Веб-интерфейс БД
npm run prisma:reset       # Сброс БД (⚠️ опасно!)
```

---

## 🤔 Часто задаваемые вопросы

**Где начать?**  
Прочитайте `QUICKSTART.md`

**Как развернуть на сервере?**  
Смотрите `DEPLOYMENT.md`

**Какие API доступны?**  
Смотрите `API_EXAMPLES.md`

**Как устроен проект?**  
Смотрите `FILE_STRUCTURE.md`

**Что было создано?**  
Смотрите `COMPLETION_SUMMARY.md`

---

## 🐛 Решение проблем

### Ошибка подключения к БД
```bash
# Убедитесь что PostgreSQL запущена
docker-compose up db -d
npm run prisma:migrate
```

### Email не отправляется
- Проверьте `.env` файл
- Используйте пароль **приложения**, не основной пароль Яндекс

### TypeScript ошибки
```bash
npm install
npm run build
```

Полный список решений в `DEPLOYMENT.md`

---

## 📞 Информация о компании

**ООО "Автоконд"**
- Адрес: ул. Сибирская, 121, пгт. Междуреченский
- Телефон: 8 (34677) 33463
- Email: avtokond2000@yandex.ru
- Сайт: https://avtokond-ugra.ru

---

## 📄 Лицензия

© 2025 ООО "Автоконд" - Все права защищены

---
