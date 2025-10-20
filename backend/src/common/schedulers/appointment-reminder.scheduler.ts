import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';
import { NotificationUtil } from '../utils/notification.util';

@Injectable()
export class AppointmentReminderScheduler {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * إرسال تذكيرات المواعيد كل ساعة
   */
  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // البحث عن المواعيد غداً
    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(tomorrow, dayAfterTomorrow) as any,
        status: In(['SCHEDULED', 'CONFIRMED']) as any,
      } as any,
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile'],
    });

    // إرسال التذكيرات
    for (const appointment of appointments) {
      await NotificationUtil.sendAppointmentReminder(appointment);
    }

    console.log(`Sent ${appointments.length} appointment reminders`);
  }

  /**
   * إرسال تذكيرات المواعيد قبل ساعتين
   */
  @Cron('0 */2 * * *') // كل ساعتين
  async sendTwoHourReminders() {
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(twoHoursFromNow, new Date(twoHoursFromNow.getTime() + 30 * 60 * 1000)) as any,
        status: In(['SCHEDULED', 'CONFIRMED']) as any,
      } as any,
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile'],
    });

    for (const appointment of appointments) {
      await NotificationUtil.sendAppointmentReminder(appointment);
    }

    console.log(`Sent ${appointments.length} two-hour reminders`);
  }
}
