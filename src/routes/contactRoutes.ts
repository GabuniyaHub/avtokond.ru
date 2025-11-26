import { Router } from 'express';
import contactController from '../controllers/ContactController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Публичные маршруты
 */

// Создать контактное сообщение
router.post('/', (req, res) => contactController.createMessage(req, res));

/**
 * Административные маршруты (требуют авторизации)
 */

// Получить все сообщения
router.get('/admin/messages', authMiddleware, (req, res) =>
    contactController.getAllMessages(req, res)
);

// Получить сообщение по ID
router.get('/admin/messages/:id', authMiddleware, (req, res) =>
    contactController.getMessageById(req, res)
);

// Обновить статус сообщения
router.put('/admin/messages/:id', authMiddleware, (req, res) =>
    contactController.updateMessage(req, res)
);

// Удалить сообщение
router.delete('/admin/messages/:id', authMiddleware, (req, res) =>
    contactController.deleteMessage(req, res)
);

export default router;
