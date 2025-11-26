import { Request, Response } from 'express';
import authService from '../services/AuthService';

export class AuthController {
    /**
     * POST /api/auth/login
     * Логин администратора
     */
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    error: 'Username and password are required',
                });
            }

            const result = await authService.login(username, password);

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error in login:', error);
            res.status(401).json({
                error: error.message || 'Invalid credentials',
            });
        }
    }

    /**
     * POST /api/auth/create-admin
     * Создать нового администратора (только для superadmin)
     */
    async createAdmin(req: Request, res: Response) {
        try {
            const { username, email, password, role } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    error: 'Username, email, and password are required',
                });
            }

            const admin = await authService.createAdmin(username, email, password, role);

            res.status(201).json({
                message: 'Admin created successfully',
                admin,
            });
        } catch (error: any) {
            console.error('Error in createAdmin:', error);
            res.status(400).json({
                error: error.message || 'Error creating admin',
            });
        }
    }

    /**
     * GET /api/auth/verify
     * Проверить токен
     */
    async verify(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    error: 'No token provided',
                });
            }

            const decoded = authService.verifyToken(token);

            res.status(200).json({
                valid: true,
                admin: decoded,
            });
        } catch (error: any) {
            res.status(401).json({
                error: 'Invalid token',
            });
        }
    }
}

export default new AuthController();
