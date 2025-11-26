/**
 * Скрипт для создания первого администратора
 * Используется при первой инициализации базы данных
 * 
 * Запуск: npm run seed
 */

import prisma from '../src/config/database';
import bcryptjs from 'bcryptjs';

async function seed() {
    try {
        console.log('🌱 Начало инициализации базы данных...');

        // Проверяем, существует ли уже администратор
        const existingAdmin = await prisma.admin.findUnique({
            where: { username: 'admin' },
        });

        if (existingAdmin) {
            console.log('✅ Администратор "admin" уже существует.');
            return;
        }

        // Создаем первого администратора
        const hashedPassword = await bcryptjs.hash('admin123', 10);

        const admin = await prisma.admin.create({
            data: {
                username: 'admin',
                email: 'admin@avtokond-ugra.ru',
                passwordHash: hashedPassword,
                role: 'admin',
                isActive: true,
            },
        });

        console.log('✅ Администратор создан успешно:');
        console.log(`   Имя пользователя: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log('   Пароль: admin123');
        console.log('\n⚠️  ИЗМЕНИТЕ ПАРОЛЬ ПОСЛЕ ПЕРВОГО ВХОДА!');
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
