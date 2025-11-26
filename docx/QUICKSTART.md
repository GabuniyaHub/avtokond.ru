# ⚡ Быстрый старт за 5 минут

## Шаг 1: Подготовка (1 мин)

```bash
# Перейти в папку проекта
cd "c:/Users/Гурам/Desktop/Money/проекты/avtokond-ugra.ru"

# Установить зависимости
npm install
```

## Шаг 2: База данных (2 мин)

**Если у вас есть Docker:**
```bash
# Запустить PostgreSQL
docker-compose up db -d

# Инициализировать БД
npm run prisma:migrate
```

**Если PostgreSQL установлен локально:**
```bash
# Убедиться что PostgreSQL запущен, затем
npm run prisma:migrate
```

## Шаг 3: Email (1 мин)

Отредактировать файл `.env`:

```env
# Для Яндекс почты:
EMAIL_USER=avtokond2000@yandex.ru
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD  # ← Пароль приложения, не основной пароль!
```

Как получить пароль приложения Яндекс:
1. https://passport.yandex.ru/
2. "Безопасность" → "Приложения и устройства"
3. Создать новый пароль для "Почта"

## Шаг 4: Запуск (1 мин)

```bash
npm run dev
```

✅ Сервер запустился на **http://localhost:3000**

## Шаг 5: Тестирование (1 мин)

### Откройте браузер:
```
http://localhost:3000/public/index.html
```

1. Заполните форму "Запись на техосмотр"
2. Нажмите "Отправить"
3. Получите письмо с кодом
4. Введите код на сайте

### Или тестируйте API:

```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Тест",
    "phone": "89991234567",
    "email": "ваш@email.com",
    "vehicleType": "car",
    "vehicleModel": "BMW",
    "appointmentDate": "2025-12-25",
    "appointmentTime": "10:00"
  }'
```

---

## 🎯 Если что-то не работает

### ❌ "Cannot find module"
```bash
npm install
npm run build
```

### ❌ Ошибка подключения к БД
```bash
# Проверить PostgreSQL
docker-compose up db -d
# или запустить локально
```

### ❌ Email не отправляется
- Проверить `.env` файл
- Убедиться что это пароль **приложения**, не основной пароль
- Попробовать другой email для теста

### ❌ Порт 3000 занят
```bash
# Изменить PORT в .env
PORT=3001
```

---

## 📚 Где найти информацию

| Нужна информация | Посмотрите |
|------------------|-----------|
| Как установить | `DEPLOYMENT.md` |
| Документация API | `API_EXAMPLES.md` |
| Полное описание | `BACKEND_README.md` |
| Что сделано | `COMPLETION_SUMMARY.md` |

---

## ✅ Готово!

Ваш бекенд работает! 🚀

Дальше можно:
1. Создать админ-панель
2. Добавить JWT аутентификацию
3. Создать фронтенд для просмотра записей

Вопросы? Смотрите документацию в папке проекта.
