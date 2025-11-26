import prisma from '../config/database';
import {
    sendVerificationEmail,
    sendConfirmationEmail,
    sendAdminNotification,
} from '../config/email';
import {
    generateVerificationCode,
    getVerificationCodeExpiry,
    isCodeExpired,
} from '../utils/helpers';

interface CreateAppointmentInput {
    fullName: string;
    phone: string;
    email: string;
    vehicleType: string;
    vehicleModel: string;
    appointmentDate: string;
    appointmentTime: string;
    vin?: string;
    licensePlate?: string;
    busCategory?: string;
    additionalInfo?: string;
}

interface VerifyAppointmentInput {
    email: string;
    code: string;
}

export class AppointmentService {
    /**
     * Создать новую запись (первый шаг - с кодом подтверждения)
     */
    async requestAppointment(data: CreateAppointmentInput) {
        // Генерируем код верификации
        const verificationCode = generateVerificationCode();
        const codeExpiry = getVerificationCodeExpiry();

        // Создаем запись в БД с кодом
        const appointment = await prisma.appointment.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                vehicleType: data.vehicleType,
                vehicleModel: data.vehicleModel,
                appointmentDate: new Date(data.appointmentDate),
                appointmentTime: data.appointmentTime,
                vin: data.vin,
                licensePlate: data.licensePlate,
                busCategory: data.busCategory,
                additionalInfo: data.additionalInfo,
                verificationCode,
                verificationCodeExpiresAt: codeExpiry,
                status: 'pending',
            },
        });

        // Отправляем код на Email
        try {
            await sendVerificationEmail(data.email, verificationCode, data.fullName);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Удаляем созданную запись, если не удалось отправить письмо
            await prisma.appointment.delete({ where: { id: appointment.id } });
            throw new Error('Не удалось отправить код подтверждения на email');
        }

        return {
            message: 'Код подтверждения отправлен на ваш email',
            email: data.email,
        };
    }

    /**
     * Подтвердить запись по коду (второй шаг)
     */
    async verifyAppointment(data: VerifyAppointmentInput) {
        // Ищем запись по email и коду
        const appointment = await prisma.appointment.findFirst({
            where: {
                email: data.email,
                verificationCode: data.code,
            },
        });

        if (!appointment) {
            throw new Error('Неверный код подтверждения или email');
        }

        // Проверяем, не истек ли код
        if (
            appointment.verificationCodeExpiresAt &&
            isCodeExpired(appointment.verificationCodeExpiresAt)
        ) {
            throw new Error('Код подтверждения истек. Попробуйте снова');
        }

        // Обновляем статус записи на подтвержденную
        const verifiedAppointment = await prisma.appointment.update({
            where: { id: appointment.id },
            data: {
                status: 'confirmed',
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null,
            },
        });

        // Отправляем письмо клиенту с подтверждением
        await sendConfirmationEmail(
            verifiedAppointment.email,
            verifiedAppointment.fullName,
            verifiedAppointment.appointmentDate.toISOString().split('T')[0],
            verifiedAppointment.appointmentTime,
            verifiedAppointment.vehicleModel
        );

        // Отправляем уведомление администратору
        await sendAdminNotification(
            verifiedAppointment.fullName,
            verifiedAppointment.phone,
            verifiedAppointment.email,
            verifiedAppointment.appointmentDate.toISOString().split('T')[0],
            verifiedAppointment.appointmentTime,
            verifiedAppointment.vehicleModel,
            verifiedAppointment.vehicleType
        );

        return {
            message: 'Запись успешно подтверждена!',
            appointmentId: verifiedAppointment.id,
        };
    }

    /**
     * Получить все записи (для админ-панели)
     */
    async getAllAppointments(filters?: {
        status?: string;
        vehicleType?: string;
        startDate?: Date;
        endDate?: Date;
    }) {
        const where: any = {};

        if (filters?.status) where.status = filters.status;
        if (filters?.vehicleType) where.vehicleType = filters.vehicleType;

        if (filters?.startDate || filters?.endDate) {
            where.appointmentDate = {};
            if (filters.startDate) {
                where.appointmentDate.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.appointmentDate.lte = filters.endDate;
            }
        }

        return prisma.appointment.findMany({
            where,
            orderBy: { appointmentDate: 'asc' },
        });
    }

    /**
     * Получить запись по ID
     */
    async getAppointmentById(id: string) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            throw new Error('Запись не найдена');
        }

        return appointment;
    }

    /**
     * Отменить запись
     */
    async cancelAppointment(id: string, reason?: string) {
        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                status: 'cancelled',
            },
        });

        return appointment;
    }

    /**
     * Отправить новый код верификации
     */
    async resendVerificationCode(email: string) {
        const appointment = await prisma.appointment.findFirst({
            where: { email, status: 'pending', isVerified: false },
        });

        if (!appointment) {
            throw new Error('Запись не найдена или уже подтверждена');
        }

        const verificationCode = generateVerificationCode();
        const codeExpiry = getVerificationCodeExpiry();

        await prisma.appointment.update({
            where: { id: appointment.id },
            data: {
                verificationCode,
                verificationCodeExpiresAt: codeExpiry,
            },
        });

        try {
            await sendVerificationEmail(email, verificationCode, appointment.fullName);
        } catch (error) {
            throw new Error('Не удалось отправить код подтверждения');
        }

        return {
            message: 'Новый код отправлен на ваш email',
            email,
        };
    }
}

export default new AppointmentService();
