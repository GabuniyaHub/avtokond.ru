// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_must_be_changed';

// Определяем, что у запроса может быть поле user после проверки
interface AuthRequest extends Request {
    user?: { id: number; login: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Доступ запрещен. Требуется токен.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Верифицируем токен
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; login: string };
        
        // 3. Сохраняем данные пользователя в запросе
        req.user = decoded;
        
        next(); // Продолжаем выполнение маршрута
    } catch (err) {
        // Ошибка: токен невалиден или истек
        return res.status(401).json({ error: 'Токен недействителен или истек.' });
    }
};