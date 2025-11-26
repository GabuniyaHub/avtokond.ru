# QUICK REFERENCE - Быстрый справочник

## 🔑 Первый вход
```
URL:      https://avtokond-ugra.ru/admin/index.html
Username: admin
Password: admin123
```

## 🌐 Основные URL
```
Главная:       https://avtokond-ugra.ru
Админ-панель:  https://avtokond-ugra.ru/admin/index.html
API:           https://avtokond-ugra.ru/api
```

## 📊 Важные статусы

### Записи на техосмотр
- `pending` - Ожидает подтверждения
- `confirmed` - Подтверждена
- `completed` - Выполнена
- `cancelled` - Отменена

### Контактные сообщения
- `new` - Новое
- `read` - Прочитано
- `answered` - Ответил

## 🚀 Docker команды
```bash
# Статус
docker-compose ps

# Логи
docker-compose logs -f backend

# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Пересборка
docker-compose build backend
```

## 📋 Основные API endpoints
```
POST   /api/appointment/request-code    # запросить код
POST   /api/appointment/verify          # подтвердить запись
POST   /api/auth/login                  # вход администратора
GET    /api/admin/appointments          # получить записи (JWT)
GET    /api/admin/messages              # получить сообщения (JWT)
```

## 🔐 JWT в запросах
```
Headers:
  Authorization: Bearer <token>
```

## 📧 .env ключевые переменные
```
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@host:5432/dbname
SMTP_USER=email@yandex.com
SMTP_PASS=app-password
ADMIN_EMAIL=admin@example.com
```

## 📖 Документация
- **ADMIN_GUIDE.md** - как использовать админ-панель
- **DEPLOYMENT.md** - полное руководство
- **PROJECT_COMPLETION_SUMMARY.txt** - что было сделано

## ⚡ Быстрая помощь

**Админ-панель не загружается?**
```
1. Обновите страницу (F5)
2. Очистите кэш (Ctrl+Shift+Delete)
3. Проверьте консоль браузера (F12)
4. docker-compose ps (контейнеры запущены?)
```

**Не удается залогиниться?**
```
1. Проверьте пароль (admin123)
2. docker-compose logs backend (ошибки?)
3. Убедитесь что JWT_SECRET в .env
```

**Email не приходит?**
```
1. Проверьте папку спам
2. SMTP параметры в .env правильные?
3. docker-compose logs backend
```

## 🎯 Чек-лист при развертывании
- ✅ .env файл имеет все переменные
- ✅ docker-compose up -d работает
- ✅ docker ps показывает контейнеры
- ✅ Админ-панель загружается
- ✅ Логин работает (admin/admin123)
- ✅ Тестовая форма отправляется
- ✅ Email приходит

## 📞 Файлы конфигурации
```
.env                  - переменные окружения
docker-compose.yml    - Docker конфигурация
Dockerfile           - сборка образа
prisma/schema.prisma - схема БД
```

## 🔧 Файлы для разработки
```
src/                 - TypeScript исходный код
public/              - HTML/CSS/JS фронтенд
scripts/             - скрипты инициализации
```

---

**Начните с:** `README_FINAL.txt` или `ADMIN_GUIDE.md`
