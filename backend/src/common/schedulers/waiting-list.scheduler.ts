import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { NotificationUtil } from '../utils/notification.util';

@Injectable()
export class WaitingListScheduler {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(WaitingList) private readonly waitingRepository: Repository<WaitingList>,
  ) {}

  /**
   * فحص قائمة الانتظار كل 30 دقيقة
   */
  @Cron('0 */30 * * * *') // كل 30 دقيقة
  async processWaitingList() {
    // البحث عن المواعيد الملغية أو المتاحة
    const cancelledAppointments = await this.appointmentRepository.find({
      where: { status: 'CANCELLED' as any } as any,
      relations: ['doctor'],
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
    const waitingList = await this.waitingRepository.find({
      where: { doctorId, notified: false } as any,
      relations: ['patient', 'patient.profile'],
      order: { priority: 'DESC', createdAt: 'ASC' },
      take: 5,
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
      await this.waitingRepository.update({ id: entry.id } as any, { notified: true });
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

    const { affected } = await this.waitingRepository.createQueryBuilder()
      .delete()
      .from(WaitingList)
      .where('createdAt < :date', { date: thirtyDaysAgo })
      .execute();

    console.log(`Cleaned up ${affected || 0} old waiting list entries`);
  }
}
