import prisma from '../config/database';
import { sendContactNotification } from '../config/email';

interface CreateContactMessageInput {
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export class ContactService {
    /**
     * Создать новое контактное сообщение
     */
    async createMessage(data: CreateContactMessageInput) {
        const contactMessage = await prisma.contactMessage.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                status: 'unread',
            },
        });

        // Отправляем уведомление администратору
        try {
            await sendContactNotification(
                data.fullName,
                data.email,
                data.phone,
                data.subject,
                data.message
            );
        } catch (error) {
            console.error('Failed to send contact notification:', error);
        }

        return {
            message: 'Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время',
            messageId: contactMessage.id,
        };
    }

    /**
     * Получить все сообщения (для админ-панели)
     */
    async getAllMessages(filters?: { status?: string }) {
        const where: any = {};

        if (filters?.status) where.status = filters.status;

        return prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Получить сообщение по ID
     */
    async getMessageById(id: string) {
        const message = await prisma.contactMessage.findUnique({
            where: { id },
        });

        if (!message) {
            throw new Error('Сообщение не найдено');
        }

        // Отмечаем сообщение как прочитанное
        return prisma.contactMessage.update({
            where: { id },
            data: { status: 'read' },
        });
    }

    /**
     * Обновить статус сообщения
     */
    async updateMessageStatus(id: string, status: string) {
        return prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
    }

    /**
     * Удалить сообщение
     */
    async deleteMessage(id: string) {
        return prisma.contactMessage.delete({
            where: { id },
        });
    }
}

export default new ContactService();
