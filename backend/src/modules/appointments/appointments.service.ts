import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // التحقق من توفر الموعد
    const isAvailable = await this.checkAvailability(
      createAppointmentDto.doctorId,
      new Date(createAppointmentDto.appointmentDate),
      new Date(createAppointmentDto.appointmentTime),
    );

    if (!isAvailable) {
      throw new Error('الموعد غير متاح');
    }

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        appointmentTime: new Date(createAppointmentDto.appointmentTime),
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });
  }

  async findAll(query: AppointmentQueryDto) {
    const { page = 1, limit = 10, status, doctorId, patientId, clinicId, date } = query;
    
    return this.prisma.appointment.findMany({
      where: {
        ...(status && { status }),
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
        ...(clinicId && { clinicId }),
        ...(date && { 
          appointmentDate: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }),
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
        ...(updateAppointmentDto.appointmentDate && {
          appointmentDate: new Date(updateAppointmentDto.appointmentDate),
        }),
        ...(updateAppointmentDto.appointmentTime && {
          appointmentTime: new Date(updateAppointmentDto.appointmentTime),
        }),
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        clinic: true,
        department: true,
      },
    });
  }

  async cancel(id: number, reason?: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason,
      },
    });
  }

  async confirm(id: number) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
    });
  }

  async complete(id: number) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  async checkAvailability(doctorId: number, date: Date, time: Date) {
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: date,
        appointmentTime: time,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    return !existingAppointment;
  }

  async getAvailableSlots(doctorId: number, date: Date) {
    // الحصول على جدول الطبيب
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { schedules: true },
    });

    if (!doctor) {
      throw new Error('الطبيب غير موجود');
    }

    const dayOfWeek = date.getDay();
    const schedule = doctor.schedules.find(s => s.dayOfWeek === dayOfWeek);

    if (!schedule) {
      return [];
    }

    // الحصول على المواعيد المحجوزة
    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
    });

    // إنشاء قائمة الأوقات المتاحة
    const availableSlots = [];
    const startTime = new Date(date);
    startTime.setHours(schedule.startTime.getHours(), schedule.startTime.getMinutes());
    
    const endTime = new Date(date);
    endTime.setHours(schedule.endTime.getHours(), schedule.endTime.getMinutes());

    const slotDuration = 30; // 30 دقيقة لكل موعد

    while (startTime < endTime) {
      const slotTime = new Date(startTime);
      const isBooked = bookedAppointments.some(appointment => 
        appointment.appointmentTime.getTime() === slotTime.getTime()
      );

      if (!isBooked) {
        availableSlots.push(new Date(slotTime));
      }

      startTime.setMinutes(startTime.getMinutes() + slotDuration);
    }

    return availableSlots;
  }
}
