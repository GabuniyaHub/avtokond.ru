# Примеры использования API Avtokond Backend

## Тестирование с помощью cURL

### 1. Запрос кода подтверждения

```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Петров",
    "phone": "8-999-123-45-67",
    "email": "ivan@example.com",
    "vehicleType": "car",
    "vehicleModel": "BMW 320i",
    "appointmentDate": "2025-12-20",
    "appointmentTime": "10:00",
    "vin": "WBADT43452G915863",
    "licensePlate": "А123БВ86"
  }'
```

**Ожидаемый ответ:**
```json
{
  "message": "Код подтверждения отправлен на ваш email",
  "email": "ivan@example.com"
}
```

---

### 2. Подтверждение записи по коду

```bash
curl -X POST http://localhost:3000/api/appointment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "code": "123456"
  }'
```

**Ожидаемый ответ:**
```json
{
  "message": "Запись успешно подтверждена!",
  "appointmentId": "cly1234567890abcdef"
}
```

---

### 3. Повторная отправка кода

```bash
curl -X POST http://localhost:3000/api/appointment/resend-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com"
  }'
```

**Ожидаемый ответ:**
```json
{
  "message": "Новый код отправлен на ваш email",
  "email": "ivan@example.com"
}
```

---

### 4. Отправка контактного сообщения

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Александр Смирнов",
    "email": "alex@example.com",
    "phone": "8-999-234-56-78",
    "subject": "Вопрос о скидках для корпоративных клиентов",
    "message": "Здравствуйте! Интересует информация о скидках при оптовых заказах техосмотра."
  }'
```

**Ожидаемый ответ:**
```json
{
  "message": "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время",
  "messageId": "cly1234567890abcdef"
}
```

---

### 5. Получение всех записей (админ)

```bash
curl -X GET "http://localhost:3000/api/admin/appointments?status=confirmed&vehicleType=car" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Ожидаемый ответ:**
```json
[
  {
    "id": "cly1234567890abcdef",
    "fullName": "Иван Петров",
    "phone": "8-999-123-45-67",
    "email": "ivan@example.com",
    "vehicleType": "car",
    "vehicleModel": "BMW 320i",
    "appointmentDate": "2025-12-20T00:00:00.000Z",
    "appointmentTime": "10:00",
    "status": "confirmed",
    "isVerified": true,
    "createdAt": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:35:00.000Z"
  }
]
```

---

### 6. Получение записи по ID (админ)

```bash
curl -X GET http://localhost:3000/api/admin/appointments/cly1234567890abcdef \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 7. Отмена записи (админ)

```bash
curl -X PUT http://localhost:3000/api/admin/appointments/cly1234567890abcdef/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "Клиент запросил отмену"
  }'
```

---

### 8. Получение всех контактных сообщений (админ)

```bash
curl -X GET "http://localhost:3000/api/admin/messages?status=unread" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 9. Получение контактного сообщения по ID (админ)

```bash
curl -X GET http://localhost:3000/api/admin/messages/cly1234567890abcdef \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 10. Удаление контактного сообщения (админ)

```bash
curl -X DELETE http://localhost:3000/api/admin/messages/cly1234567890abcdef \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Тестирование с помощью Postman

### Импорт коллекции

Можно создать коллекцию Postman с переменной:

```json
{
  "baseUrl": "http://localhost:3000/api",
  "token": "YOUR_JWT_TOKEN"
}
```

### Примеры запросов

#### Запрос 1: Новая запись на техосмотр
- **Метод**: POST
- **URL**: `{{baseUrl}}/appointment/request-code`
- **Body (JSON)**:
```json
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

---

## Тестирование с помощью JavaScript

### Пример 1: Полный цикл записи

```javascript
// 1. Запрашиваем код подтверждения
const requestResponse = await fetch('http://localhost:3000/api/appointment/request-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
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

const requestData = await requestResponse.json();
console.log('Код отправлен:', requestData.message);

// 2. Пользователь получает код из email и отправляем верификацию
// (в реальной жизни пользователь вводит это вручную)
const verifyResponse = await fetch('http://localhost:3000/api/appointment/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'petr@example.com',
    code: '123456' // Код из email
  })
});

const verifyData = await verifyResponse.json();
console.log('Результат:', verifyData.message);
```

### Пример 2: Отправка контактного сообщения

```javascript
const contactResponse = await fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'Александр Смирнов',
    email: 'alex@example.com',
    phone: '89991234567',
    subject: 'Вопрос о скидках',
    message: 'Есть ли скидки для корпоративных клиентов?'
  })
});

const contactData = await contactResponse.json();
console.log('Результат:', contactData.message);
```

### Пример 3: Получение всех записей (админ)

```javascript
const appointmentsResponse = await fetch(
  'http://localhost:3000/api/admin/appointments?status=confirmed',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
  }
);

const appointments = await appointmentsResponse.json();
console.log('Записи:', appointments);
```

---

## Тестирование email

### Проверка отправки email

При запросе кода подтверждения система отправляет письмо на указанный email. 

**Важно**: Убедитесь, что в `.env` файле указаны корректные реквизиты Яндекс почты:

```env
EMAIL_USER=avtokond2000@yandex.ru
EMAIL_PASS=YOUR_YANDEX_APP_PASSWORD
EMAIL_TO=avtokond2000@yandex.ru
```

Для получения пароля приложения Яндекс:
1. Перейдите в https://passport.yandex.ru/
2. Перейдите в "Приложения и устройства"
3. Создайте новый пароль приложения для Почты

---

## Проверка ошибок

### Неверный email

```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Петров",
    "phone": "8-999-123-45-67",
    "email": "invalid-email",
    "vehicleType": "car",
    "vehicleModel": "BMW",
    "appointmentDate": "2025-12-25",
    "appointmentTime": "10:00"
  }'
```

**Ожидаемый ответ:**
```json
{
  "error": "Некорректный адрес Email"
}
```

---

### Дата в прошлом

```bash
curl -X POST http://localhost:3000/api/appointment/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Петров",
    "phone": "8-999-123-45-67",
    "email": "ivan@example.com",
    "vehicleType": "car",
    "vehicleModel": "BMW",
    "appointmentDate": "2020-01-01",
    "appointmentTime": "10:00"
  }'
```

**Ожидаемый ответ:**
```json
{
  "error": "Невозможно выбрать дату в прошлом"
}
```

---

### Неверный код подтверждения

```bash
curl -X POST http://localhost:3000/api/appointment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "code": "wrong_code"
  }'
```

**Ожидаемый ответ:**
```json
{
  "error": "Неверный код подтверждения или email"
}
```

---

## Полезные команды

### Запуск сервера в режиме разработки
```bash
npm run dev
```

### Просмотр БД в веб-интерфейсе
```bash
npm run prisma:studio
```

### Сброс базы данных (осторожно!)
```bash
npm run prisma:reset
```

---

## Дополнительная информация

- Код подтверждения действует 15 минут
- Система автоматически отправляет письма администратору при новых записях
- Все сообщения и записи хранятся в PostgreSQL
- API поддерживает фильтрацию и сортировку записей
