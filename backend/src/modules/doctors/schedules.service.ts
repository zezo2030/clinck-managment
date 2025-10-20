import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(doctorId: number, scheduleData: CreateScheduleDto) {
    return this.prisma.schedule.create({
      data: {
        doctorId,
        ...scheduleData,
      },
    });
  }

  async getDoctorSchedule(doctorId: number) {
    return this.prisma.schedule.findMany({
      where: {
        doctorId,
        isActive: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async updateSchedule(scheduleId: number, updateData: any) {
    return this.prisma.schedule.update({
      where: { id: scheduleId },
      data: updateData,
    });
  }

  async deleteSchedule(scheduleId: number) {
    return this.prisma.schedule.delete({
      where: { id: scheduleId },
    });
  }

  async getAvailableDoctors(date: Date, departmentId?: number) {
    const dayOfWeek = date.getDay();
    
    return this.prisma.doctor.findMany({
      where: {
        isAvailable: true,
        ...(departmentId && { departmentId }),
        schedules: {
          some: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
      include: {
        user: {
          include: { profile: true },
        },
        department: true,
        schedules: {
          where: {
            dayOfWeek,
            isActive: true,
          },
        },
      },
    });
  }
}
