import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../database/entities/schedule.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async createSchedule(doctorId: number, scheduleData: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create({ doctorId, ...scheduleData } as any);
    return this.scheduleRepository.save(schedule);
  }

  async getDoctorSchedule(doctorId: number) {
    return this.scheduleRepository.find({ where: { doctorId, isActive: true } as any, order: { dayOfWeek: 'ASC' } });
  }

  async updateSchedule(scheduleId: number, updateData: any) {
    await this.scheduleRepository.update({ id: scheduleId } as any, updateData);
    return this.scheduleRepository.findOne({ where: { id: scheduleId } as any });
  }

  async deleteSchedule(scheduleId: number) {
    await this.scheduleRepository.delete({ id: scheduleId } as any);
    return { id: scheduleId } as any;
  }

  async getAvailableDoctors(date: Date, departmentId?: number) {
    const dayOfWeek = date.getDay();
    return this.doctorRepository.find({
      where: {
        isAvailable: true,
        ...(departmentId && { departmentId } as any),
      } as any,
      relations: ['user', 'user.profile', 'department', 'schedules'],
    }).then((doctors) => doctors.filter((d) => d.schedules?.some((s) => s.dayOfWeek === dayOfWeek && s.isActive)));
  }
}
