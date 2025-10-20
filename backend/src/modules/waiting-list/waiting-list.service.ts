import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddToWaitingListDto } from './dto/add-to-waiting-list.dto';

@Injectable()
export class WaitingListService {
  constructor(private prisma: PrismaService) {}

  async addToWaitingList(patientId: number, doctorId: number, departmentId: number, priority: number = 1) {
    // التحقق من وجود المريض في قائمة الانتظار
    const existingEntry = await this.prisma.waitingList.findFirst({
      where: {
        patientId,
        doctorId,
      },
    });

    if (existingEntry) {
      throw new Error('المريض موجود بالفعل في قائمة الانتظار');
    }

    return this.prisma.waitingList.create({
      data: {
        patientId,
        doctorId,
        departmentId,
        priority,
      },
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        department: true,
      },
    });
  }

  async getWaitingList(doctorId?: number) {
    return this.prisma.waitingList.findMany({
      where: doctorId ? { doctorId } : {},
      include: {
        patient: {
          include: { profile: true },
        },
        doctor: {
          include: { profile: true },
        },
        department: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async notifyNextInLine(doctorId: number, availableDate: Date, availableTime: Date) {
    const nextInLine = await this.prisma.waitingList.findFirst({
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
    });

    if (nextInLine) {
      // إرسال إشعار للمريض
      await this.sendNotification(nextInLine.patientId, {
        title: 'موعد متاح',
        message: `موعد متاح مع الطبيب في ${availableDate.toLocaleDateString()} الساعة ${availableTime.toLocaleTimeString()}`,
        type: 'APPOINTMENT',
      });

      // تحديث حالة الإشعار
      await this.prisma.waitingList.update({
        where: { id: nextInLine.id },
        data: { notified: true },
      });
    }

    return nextInLine;
  }

  async removeFromWaitingList(id: number) {
    return this.prisma.waitingList.delete({
      where: { id },
    });
  }

  async updatePriority(id: number, priority: number) {
    return this.prisma.waitingList.update({
      where: { id },
      data: { priority },
    });
  }

  private async sendNotification(userId: number, notification: any) {
    // منطق إرسال الإشعارات
    // سيتم تطويره في المرحلة الرابعة
    console.log(`Notification sent to user ${userId}:`, notification);
  }
}
