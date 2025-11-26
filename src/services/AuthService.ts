import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import prisma from '../config/database';

export class AuthService {
    /**
     * Хешировать пароль
     */
    async hashPassword(password: string): Promise<string> {
        return bcryptjs.hash(password, 10);
    }

    /**
     * Проверить пароль
     */
    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcryptjs.compare(password, hash);
    }

    /**
     * Создать JWT токен
     */
    generateToken(adminId: string, username: string, role: string): string {
        return jwt.sign(
            { id: adminId, username, role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '24h' }
        );
    }

    /**
     * Проверить JWT токен
     */
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Логин администратора
     */
    async login(username: string, password: string) {
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            throw new Error('Admin not found');
        }

        const isPasswordValid = await this.verifyPassword(password, admin.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        if (!admin.isActive) {
            throw new Error('Admin account is inactive');
        }

        const token = this.generateToken(admin.id, admin.username, admin.role);

        return {
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        };
    }

    /**
     * Создать нового администратора (только для superadmin)
     */
    async createAdmin(username: string, email: string, password: string, role: string = 'admin') {
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingAdmin) {
            throw new Error('Admin with this username or email already exists');
        }

        const passwordHash = await this.hashPassword(password);

        const admin = await prisma.admin.create({
            data: {
                username,
                email,
                passwordHash,
                role,
                isActive: true,
            },
        });

        return {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
        };
    }
}

export default new AuthService();
