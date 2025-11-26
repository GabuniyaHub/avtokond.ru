import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем тип Request для добавления информации об администраторе
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: string;
                username: string;
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
                error: 'Authentication required. Please provide JWT token in Authorization header',
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
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired. Please login again',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
            });
        }

        res.status(500).json({
            error: 'Authentication error',
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
            error: 'Access denied. Admin rights required',
        });
    }

    next();
}

/**
 * Middleware для логирования
 */
export function loggingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const adminId = req.admin?.id || 'anonymous';

    console.log(`[${timestamp}] ${method} ${path} (admin: ${adminId})`);

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
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path,
    });
}