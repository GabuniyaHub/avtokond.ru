import { Request, Response } from 'express';
import appointmentService from '../services/AppointmentService';
import { validateEmail, validatePhone } from '../utils/helpers';

export class AppointmentController {
    /**
     * POST /api/appointment/request-code
     * Запросить код подтверждения (первый шаг)
     */
    async requestAppointment(req: Request, res: Response) {
        try {
            const {
                fullName,
                phone,
                email,
                vehicleType,
                vehicleModel,
                appointmentDate,
                appointmentTime,
                vin,
                licensePlate,
                busCategory,
                additionalInfo,
            } = req.body;

            // Валидация обязательных полей
            if (!fullName || !phone || !email || !vehicleType || !vehicleModel) {
                return res.status(400).json({
                    error: 'Заполните все обязательные поля',
                });
            }

            // Валидация Email
            if (!validateEmail(email)) {
                return res.status(400).json({
                    error: 'Некорректный адрес Email',
                });
            }

            // Валидация телефона
            if (!validatePhone(phone)) {
                return res.status(400).json({
                    error: 'Некорректный номер телефона',
                });
            }

            // Валидация даты
            const selectedDate = new Date(appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                return res.status(400).json({
                    error: 'Невозможно выбрать дату в прошлом',
                });
            }

            // Создаем запись и отправляем код
            const result = await appointmentService.requestAppointment({
                fullName,
                phone,
                email,
                vehicleType,
                vehicleModel,
                appointmentDate,
                appointmentTime,
                vin,
                licensePlate,
                busCategory,
                additionalInfo,
            });

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error in requestAppointment:', error);
            res.status(500).json({
                error: error.message || 'Ошибка при обработке запроса',
            });
        }
    }

    /**
     * POST /api/appointment/verify
     * Подтвердить запись по коду (второй шаг)
     */
    async verifyAppointment(req: Request, res: Response) {
        try {
            const { email, code } = req.body;

            if (!email || !code) {
                return res.status(400).json({
                    error: 'Email и код обязательны',
                });
            }

            if (!validateEmail(email)) {
                return res.status(400).json({
                    error: 'Некорректный адрес Email',
                });
            }

            const result = await appointmentService.verifyAppointment({
                email,
                code,
            });

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error in verifyAppointment:', error);
            res.status(400).json({
                error: error.message || 'Ошибка при верификации',
            });
        }
    }

    /**
     * POST /api/appointment/resend-code
     * Повторно отправить код верификации
     */
    async resendVerificationCode(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email || !validateEmail(email)) {
                return res.status(400).json({
                    error: 'Некорректный адрес Email',
                });
            }

            const result = await appointmentService.resendVerificationCode(email);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error in resendVerificationCode:', error);
            res.status(400).json({
                error: error.message || 'Ошибка при отправке кода',
            });
        }
    }

    /**
     * GET /api/admin/appointments
     * Получить все записи (требует авторизации)
     */
    async getAllAppointments(req: Request, res: Response) {
        try {
            const { status, vehicleType, startDate, endDate } = req.query;

            const appointments = await appointmentService.getAllAppointments({
                status: status as string,
                vehicleType: vehicleType as string,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
            });

            res.status(200).json(appointments);
        } catch (error: any) {
            console.error('Error in getAllAppointments:', error);
            res.status(500).json({
                error: 'Ошибка при получении записей',
            });
        }
    }

    /**
     * GET /api/admin/appointments/:id
     * Получить запись по ID
     */
    async getAppointmentById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const appointment = await appointmentService.getAppointmentById(id);
            res.status(200).json(appointment);
        } catch (error: any) {
            console.error('Error in getAppointmentById:', error);
            res.status(404).json({
                error: error.message || 'Запись не найдена',
            });
        }
    }

    /**
     * PUT /api/admin/appointments/:id/cancel
     * Отменить запись
     */
    async cancelAppointment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const appointment = await appointmentService.cancelAppointment(id, reason);
            res.status(200).json({
                message: 'Запись отменена',
                appointment,
            });
        } catch (error: any) {
            console.error('Error in cancelAppointment:', error);
            res.status(500).json({
                error: 'Ошибка при отмене записи',
            });
        }
    }
}

export default new AppointmentController();
