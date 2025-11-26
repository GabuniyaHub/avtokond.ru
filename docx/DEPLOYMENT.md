# 🚀 Развертывание Avtokond Backend

## Краткая инструкция

### Вариант 1: Локальная разработка (Рекомендуется)

#### Шаг 1: Подготовка
```bash
# Перейти в папку проекта
cd c:/Users/Гурам/Desktop/Money/проекты/avtokond-ugra.ru

# Установить зависимости
npm install
```

#### Шаг 2: Настройка БД

**Вариант A: С Docker (проще)**
```bash
# Запустить PostgreSQL в Docker
docker-compose up db -d

# Инициализировать БД
npm run prisma:migrate
```

**Вариант B: Локально установленный PostgreSQL**
```bash
# Создать БД
createdb -U avtokond_admin avtokond_prod

# Применить миграции
npm run prisma:migrate
```

#### Шаг 3: Запуск сервера
```bash
npm run dev
```

✅ Сервер запустится на `http://localhost:3000`

---

### Вариант 2: Docker Compose (Полный стек)

```bash
# Запустить всё (DB + Backend + Nginx будет позже)
docker-compose up --build

# Лог
docker-compose logs -f backend

# Остановка
docker-compose down
```

---

## 📋 Чек-лист перед первым запуском

- [ ] Node.js 18+ установлен (`node --version`)
- [ ] npm установлен (`npm --version`)
- [ ] PostgreSQL или Docker установлены
- [ ] Файл `.env` заполнен корректно
- [ ] Зависимости установлены (`npm install`)
- [ ] БД инициализирована (`npm run prisma:migrate`)

---

## 🔧 Первые тесты

### Тест 1: Сервер запустился?

```bash
curl http://localhost:3000
```

Должен вернуть JSON с информацией об API.

### Тест 2: Запрос кода подтверждения

```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Тестовый пользователь",
    "phone": "89991234567",
    "email": "test@example.com",
    "vehicleType": "car",
    "vehicleModel": "Test Car",
    "appointmentDate": "2025-12-25",
    "appointmentTime": "10:00"
  }'
```

Если вернул успех - отлично!

---

## 📁 Важные файлы

| Файл | Назначение |
|------|-----------|
| `.env` | Переменные окружения |
| `src/index.ts` | Точка входа приложения |
| `prisma/schema.prisma` | Описание БД |
| `package.json` | Зависимости и скрипты |
| `docker-compose.yml` | Конфигурация контейнеров |

---

## 🆘 Частые проблемы

### ❌ "Cannot find module 'prisma'"
```bash
# Решение
npm install
npx prisma generate
```

### ❌ "Connection refused" (БД)
```bash
# Проверить, запущена ли PostgreSQL
# Если Docker:
docker-compose up db -d

# Если локально:
# Windows: Services > PostgreSQL -> Start
# Linux/Mac: sudo systemctl start postgresql
```

### ❌ "ENOENT: no such file or directory '.env'"
```bash
# Решение: создать .env файл
# Скопировать содержимое из .env.example и заполнить
```

### ❌ TypeScript ошибки
```bash
# Решение
npm run build
# или
npm run dev  # автоматически пересоберется
```

---

## 📊 Проверка работы

### Через browser DevTools (F12)

1. Откройте сайт `http://localhost:8080` (если есть Nginx)
2. Откройте консоль (F12)
3. Попробуйте записаться на техосмотр
4. В консоли должны быть успешные fetch запросы

### Через Prisma Studio

```bash
npm run prisma:studio
```

Откроет веб-интерфейс на `http://localhost:5555` для просмотра БД.

---

## 🎯 Следующие шаги после запуска

1. **Настроить Nginx** - для раздачи статики
2. **Реализовать JWT аутентификацию** - для админ-панели
3. **Создать фронтенд админ-панели** - для управления записями
4. **Добавить логирование** - для отладки

---

## 📚 Полезные ссылки

- [Express.js документация](https://expressjs.com/)
- [Prisma документация](https://www.prisma.io/docs/)
- [Nodemailer документация](https://nodemailer.com/)
- [Docker документация](https://docs.docker.com/)

---

## ✅ Готово!

Ваш бекенд готов к работе! 🎉

Начните с:
1. Заполнения `.env` файла
2. Запуска `npm run dev`
3. Тестирования API через cURL или Postman

Вопросы? Смотрите `BACKEND_SETUP.md` и `API_EXAMPLES.md`
