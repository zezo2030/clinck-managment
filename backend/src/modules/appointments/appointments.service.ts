import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual, LessThan } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';
import { User } from '../../database/entities/user.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Department } from '../../database/entities/department.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Clinic) private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
  ) {}

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

    const entity = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      appointmentTime: new Date(createAppointmentDto.appointmentTime),
    } as any);
    const savedOne = await this.appointmentRepository.save(entity);
    return this.findOne((savedOne as any).id);
  }

  async findAll(query: AppointmentQueryDto) {
    const { page = 1, limit = 10, status, doctorId, patientId, clinicId, date } = query;
    
    const where: any = {
      ...(status && { status }),
      ...(doctorId && { doctorId }),
      ...(patientId && { patientId }),
      ...(clinicId && { clinicId }),
    };
    if (date) {
      const day = new Date(date);
      const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
      where.appointmentDate = MoreThanOrEqual(day);
      where.appointmentTime = LessThan(nextDay);
    }
    return this.appointmentRepository.find({
      where,
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'clinic', 'department'],
      skip: (page - 1) * limit,
      take: limit,
      order: { appointmentDate: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'clinic', 'department'],
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const update: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.appointmentDate) update.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    if (updateAppointmentDto.appointmentTime) update.appointmentTime = new Date(updateAppointmentDto.appointmentTime);
    await this.appointmentRepository.update({ id }, update);
    return this.findOne(id);
  }

  async cancel(id: number, reason?: string) {
    await this.appointmentRepository.update({ id }, { status: 'CANCELLED' as any, notes: reason });
    return this.findOne(id);
  }

  async confirm(id: number) {
    await this.appointmentRepository.update({ id }, { status: 'CONFIRMED' as any });
    return this.findOne(id);
  }

  async complete(id: number) {
    await this.appointmentRepository.update({ id }, { status: 'COMPLETED' as any });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.appointmentRepository.delete({ id });
    return { id } as any;
  }

  async checkAvailability(doctorId: number, date: Date, time: Date) {
    const existing = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        appointmentDate: date as any,
        appointmentTime: time as any,
        status: In(['SCHEDULED', 'CONFIRMED']) as any,
      } as any,
    });
    return !existing;
  }

  async getAvailableSlots(doctorId: number, date: Date) {
    // الحصول على جدول الطبيب
    const doctor = await this.userRepository.findOne({ where: { id: doctorId } as any, relations: ['doctor', 'doctor.schedules'] });

    if (!doctor) {
      throw new Error('الطبيب غير موجود');
    }

    const dayOfWeek = date.getDay();
    const schedule = (doctor as any)?.doctor?.schedules?.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule) {
      return [];
    }

    // الحصول على المواعيد المحجوزة
    const bookedAppointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        appointmentDate: date as any,
        status: In(['SCHEDULED', 'CONFIRMED']) as any,
      } as any,
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
