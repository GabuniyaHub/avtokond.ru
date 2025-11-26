import { Router } from 'express';
import contactController from '../controllers/ContactController';

const router = Router();

/**
 * Публичные маршруты
 */

// Создать контактное сообщение
router.post('/', (req, res) => contactController.createMessage(req, res));

/**
 * Административные маршруты (требуют авторизации)
 * TODO: Добавить middleware для проверки JWT токена
 */

// Получить все сообщения
router.get('/admin/messages', (req, res) =>
    contactController.getAllMessages(req, res)
);

// Получить сообщение по ID
router.get('/admin/messages/:id', (req, res) =>
    contactController.getMessageById(req, res)
);

// Удалить сообщение
router.delete('/admin/messages/:id', (req, res) =>
    contactController.deleteMessage(req, res)
);

export default router;
