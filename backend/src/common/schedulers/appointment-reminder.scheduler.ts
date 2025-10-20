import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { NotificationUtil } from '../utils/notification.util';

@Injectable()
export class AppointmentReminderScheduler {
  constructor(private prisma: PrismaService) {}

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
    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
      },
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

    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: twoHoursFromNow,
          lt: new Date(twoHoursFromNow.getTime() + 30 * 60 * 1000), // خلال 30 دقيقة
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED'],
        },
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
      },
    });

    for (const appointment of appointments) {
      await NotificationUtil.sendAppointmentReminder(appointment);
    }

    console.log(`Sent ${appointments.length} two-hour reminders`);
  }
}
