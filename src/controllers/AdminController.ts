import { Request, Response } from 'express';
import prisma from '../config/database';
import appointmentService from '../services/AppointmentService';

/**
 * GET /api/admin/appointments
 * Получение всех записей (требует JWT)
 */
export async function getAdminAppointments(req: Request, res: Response) {
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
    console.error('Error in getAdminAppointments:', error);
    res.status(500).json({
      error: 'Ошибка при получении записей',
    });
  }
}

/**
 * GET /api/admin/appointments/:id
 * Получить запись по ID
 */
export async function getAdminAppointmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const appointment = await appointmentService.getAppointmentById(id);
    res.status(200).json(appointment);
  } catch (error: any) {
    console.error('Error in getAdminAppointmentById:', error);
    res.status(404).json({
      error: error.message || 'Запись не найдена',
    });
  }
}

export default {
  getAdminAppointments,
  getAdminAppointmentById,
};