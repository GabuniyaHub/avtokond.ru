import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import appointmentRoutes from './routes/appointmentRoutes';
import contactRoutes from './routes/contactRoutes';

// Загруженисловия переменных окружения
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - разрешить запросы с фронтенда
app.use(
    cors({
        origin: '*', // В продакшене нужно указать конкретный домен
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Логирование запросов (для развития)
app.use((req: Request, res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Главный маршрут
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Avtokond Backend API',
        version: '1.0.0',
        endpoints: {
            appointments: {
                'POST /api/appointment/request-code':
                    'Запросить код подтверждения для записи',
                'POST /api/appointment/verify': 'Подтвердить запись по коду',
                'POST /api/appointment/resend-code': 'Повторно отправить код',
                'GET /api/admin/appointments': 'Получить все записи (admin)',
                'GET /api/admin/appointments/:id': 'Получить запись по ID (admin)',
                'PUT /api/admin/appointments/:id/cancel': 'Отменить запись (admin)',
            },
            contact: {
                'POST /api/contact': 'Отправить контактное сообщение',
                'GET /api/admin/messages': 'Получить все сообщения (admin)',
                'GET /api/admin/messages/:id': 'Получить сообщение по ID (admin)',
                'DELETE /api/admin/messages/:id': 'Удалить сообщение (admin)',
            },
        },
    });
});

// Маршруты
app.use('/api/appointment', appointmentRoutes);
app.use('/api/contact', contactRoutes);

// Обработка 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        path: req.path,
        method: req.method,
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});
