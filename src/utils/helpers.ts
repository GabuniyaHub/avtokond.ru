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
