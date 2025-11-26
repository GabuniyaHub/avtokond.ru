import { Router } from 'express';
import appointmentController from '../controllers/AppointmentController';

const router = Router();

/**
 * Публичные маршруты
 */

// Запросить код подтверждения
router.post('/request-code', (req, res) =>
    appointmentController.requestAppointment(req, res)
);

// Подтвердить запись по коду
router.post('/verify', (req, res) =>
    appointmentController.verifyAppointment(req, res)
);

// Повторно отправить код
router.post('/resend-code', (req, res) =>
    appointmentController.resendVerificationCode(req, res)
);

/**
 * Административные маршруты (требуют авторизации)
 * TODO: Добавить middleware для проверки JWT токена
 */

// Получить все записи
router.get('/admin/appointments', (req, res) =>
    appointmentController.getAllAppointments(req, res)
);

// Получить запись по ID
router.get('/admin/appointments/:id', (req, res) =>
    appointmentController.getAppointmentById(req, res)
);

// Отменить запись
router.put('/admin/appointments/:id/cancel', (req, res) =>
    appointmentController.cancelAppointment(req, res)
);

export default router;
