import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем тип Request для добавления информации об администраторе
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: string;
                username: string;
                email: string;
                role: string;
            };
        }
    }
}

/**
 * Middleware для проверки JWT токена администратора
 */
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Требуется аутентификация. Пожалуйста, передайте JWT токен в заголовке Authorization',
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as any;

        // Сохраняем информацию об администраторе в request
        req.admin = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Токен истек. Пожалуйста, войдите снова',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Некорректный токен',
            });
        }

        res.status(500).json({
            error: 'Ошибка при проверке аутентификации',
        });
    }
}

/**
 * Middleware для проверки роли администратора
 */
export function adminRoleMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.admin || req.admin.role !== 'admin') {
        return res.status(403).json({
            error: 'Доступ запрещен. Требуются права администратора',
        });
    }

    next();
}

/**
 * Middleware для обработки ошибок
 */
export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Внутренняя ошибка сервера';

    res.status(statusCode).json({
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path,
    });
}
