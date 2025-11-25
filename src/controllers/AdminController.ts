// src/controllers/AdminController.ts
import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { comparePassword, generateAuthToken } from '../services/AuthService';
import { authMiddleware } from '../middleware/authMiddleware';

// Интерфейс запроса с добавленным полем user
interface AuthRequest extends Request {
    user?: { id: number; login: string };
}


/**
 * POST /api/admin/login
 * Аутентификация администратора
 */
export const login = async (req: Request, res: Response) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Требуются логин и пароль.' });
    }

    try {
        // 1. Находим админа
        const admin = await prisma.admin.findUnique({ where: { login } });
        if (!admin) {
            return res.status(401).json({ error: 'Неверный логин или пароль.' });
        }

        // 2. Сравниваем пароли
        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный логин или пароль.' });
        }

        // 3. Генерируем токен
        const token = generateAuthToken(admin.id, admin.login);
        
        // 4. Отправляем токен клиенту
        return res.json({ token });

    } catch (error) {
        console.error('Ошибка входа:', error);
        return res.status(500).json({ error: 'Ошибка сервера при авторизации.' });
    }
};


/**
 * GET /api/admin/appointments
 * Получение всех записей (требует JWT)
 */
export const getAppointments = async (req: AuthRequest, res: Response) => {
    // req.user уже проверен благодаря authMiddleware
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: {
                date: 'asc', // Сортировка по дате
            }
        });
        
        // Возвращаем данные для отображения в таблице
        return res.json(appointments);

    } catch (error) {
        console.error('Ошибка получения записей:', error);
        return res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
    }
};