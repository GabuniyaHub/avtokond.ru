/**
 * Генерировать случайный код верификации (6 цифр)
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Генерировать срок действия кода (15 минут от текущего времени)
 */
export function getVerificationCodeExpiry(): Date {
    const now = new Date();
    return new Date(now.getTime() + 15 * 60 * 1000); // 15 минут
}

/**
 * Проверить, истек ли срок действия кода
 */
export function isCodeExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
}

/**
 * Форматировать дату в понятный вид
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    };
    return d.toLocaleDateString('ru-RU', options);
}

/**
 * Валидировать Email
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Валидировать номер телефона (простая проверка)
 */
export function validatePhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Валидировать VIN (простая проверка длины)
 */
export function validateVIN(vin: string): boolean {
    return vin.length >= 17;
}

/**
 * Валидировать гос. номер
 */
export function validateLicensePlate(plate: string): boolean {
    return plate.length >= 8;
}

/**
 * Валидировать дату (не в прошлом)
 */
export function validateAppointmentDate(dateStr: string): boolean {
    const appointmentDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
}

/**
 * Валидировать время (формат HH:MM)
 */
export function validateAppointmentTime(timeStr: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
}

/**
 * Валидировать имя (минимум 3 символа, без спецсимволов)
 */
export function validateFullName(name: string): boolean {
    return name.trim().length >= 3 && /^[a-яA-Яа-яёЁ\s\-']+$/i.test(name);
}

/**
 * Валидировать сообщение (минимум 10 символов)
 */
export function validateMessage(message: string): boolean {
    return message.trim().length >= 10;
}

/**
 * Форматировать телефон для отправки (оставляем только цифры)
 */
export function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
}

/**
 * Форматировать VIN в верхний регистр
 */
export function normalizeVIN(vin: string): string {
    return vin.toUpperCase().trim();
}

/**
 * Форматировать гос. номер в верхний регистр
 */
export function normalizeLicensePlate(plate: string): string {
    return plate.toUpperCase().trim();
}