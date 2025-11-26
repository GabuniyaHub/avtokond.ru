import { Request, Response } from 'express';
import contactService from '../services/ContactService';
import { validateEmail, validatePhone } from '../utils/helpers';

export class ContactController {
    /**
     * POST /api/contact
     * Создать новое контактное сообщение
     */
    async createMessage(req: Request, res: Response) {
        try {
            const { fullName, email, phone, subject, message } = req.body;

            // Валидация обязательных полей
            if (!fullName || !email || !subject || !message) {
                return res.status(400).json({
                    error: 'Заполните все обязательные поля: имя, email, тема, сообщение',
                });
            }

            // Валидация Email
            if (!validateEmail(email)) {
                return res.status(400).json({
                    error: 'Некорректный адрес Email',
                });
            }

            // Валидация телефона, если указан
            if (phone && !validatePhone(phone)) {
                return res.status(400).json({
                    error: 'Некорректный номер телефона',
                });
            }

            // Проверка длины сообщения
            if (message.length < 10) {
                return res.status(400).json({
                    error: 'Сообщение должно быть не менее 10 символов',
                });
            }

            const result = await contactService.createMessage({
                fullName,
                email,
                phone,
                subject,
                message,
            });

            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error in createMessage:', error);
            res.status(500).json({
                error: error.message || 'Ошибка при отправке сообщения',
            });
        }
    }

    /**
     * GET /api/admin/messages
     * Получить все контактные сообщения (требует авторизации)
     */
    async getAllMessages(req: Request, res: Response) {
        try {
            const { status } = req.query;

            const messages = await contactService.getAllMessages({
                status: status as string,
            });

            res.status(200).json(messages);
        } catch (error: any) {
            console.error('Error in getAllMessages:', error);
            res.status(500).json({
                error: 'Ошибка при получении сообщений',
            });
        }
    }

    /**
     * GET /api/admin/messages/:id
     * Получить сообщение по ID
     */
    async getMessageById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const message = await contactService.getMessageById(id);
            res.status(200).json(message);
        } catch (error: any) {
            console.error('Error in getMessageById:', error);
            res.status(404).json({
                error: error.message || 'Сообщение не найдено',
            });
        }
    }

    /**
     * DELETE /api/admin/messages/:id
     * Удалить сообщение
     */
    async deleteMessage(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await contactService.deleteMessage(id);
            res.status(200).json({
                message: 'Сообщение удалено',
            });
        } catch (error: any) {
            console.error('Error in deleteMessage:', error);
            res.status(500).json({
                error: 'Ошибка при удалении сообщения',
            });
        }
    }
}

export default new ContactController();
