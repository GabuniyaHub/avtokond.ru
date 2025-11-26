import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/login
 * Вход администратора с username и password
 * Возвращает JWT токен
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * POST /api/auth/create-admin
 * Создание нового администратора (требуется существующий администратор)
 */
router.post('/create-admin', authMiddleware, (req, res) =>
    authController.createAdmin(req, res)
);

/**
 * GET /api/auth/verify
 * Проверка валидности JWT токена
 */
router.get('/verify', authMiddleware, (req, res) =>
    authController.verify(req, res)
);

export default router;
