import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { NotificationUtil } from '../utils/notification.util';

@Injectable()
export class WaitingListScheduler {
  constructor(private prisma: PrismaService) {}

  /**
   * فحص قائمة الانتظار كل 30 دقيقة
   */
  @Cron('0 */30 * * * *') // كل 30 دقيقة
  async processWaitingList() {
    // البحث عن المواعيد الملغية أو المتاحة
    const cancelledAppointments = await this.prisma.appointment.findMany({
      where: {
        status: 'CANCELLED',
        appointmentDate: {
          gte: new Date(),
        },
      },
      include: {
        doctor: true,
      },
    });

    // إشعار المرضى في قائمة الانتظار
    for (const appointment of cancelledAppointments) {
      await this.notifyWaitingListPatients(appointment.doctorId, appointment.appointmentDate, appointment.appointmentTime);
    }

    console.log(`Processed ${cancelledAppointments.length} cancelled appointments for waiting list`);
  }

  /**
   * إشعار المرضى في قائمة الانتظار عند توفر موعد
   */
  private async notifyWaitingListPatients(doctorId: number, availableDate: Date, availableTime: Date) {
    const waitingList = await this.prisma.waitingList.findMany({
      where: {
        doctorId,
        notified: false,
      },
      include: {
        patient: {
          include: { profile: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: 5, // إشعار أول 5 مرضى
    });

    for (const entry of waitingList) {
      await NotificationUtil.sendWaitingListNotification(
        entry.patient,
        {
          date: availableDate,
          time: availableTime,
        }
      );

      // تحديث حالة الإشعار
      await this.prisma.waitingList.update({
        where: { id: entry.id },
        data: { notified: true },
      });
    }

    console.log(`Notified ${waitingList.length} patients in waiting list`);
  }

  /**
   * تنظيف قائمة الانتظار القديمة (أكثر من 30 يوم)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldWaitingList() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await this.prisma.waitingList.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Cleaned up ${deleted.count} old waiting list entries`);
  }
}
