import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { User } from '../../database/entities/user.entity';
import { Department } from '../../database/entities/department.entity';
import { AddToWaitingListDto } from './dto/add-to-waiting-list.dto';

@Injectable()
export class WaitingListService {
  constructor(
    @InjectRepository(WaitingList) private readonly waitingRepository: Repository<WaitingList>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
  ) {}

  async addToWaitingList(patientId: number, doctorId: number, departmentId: number, priority: number = 1) {
    // التحقق من وجود المريض في قائمة الانتظار
    const existingEntry = await this.waitingRepository.findOne({ where: { patientId, doctorId } as any });

    if (existingEntry) {
      throw new Error('المريض موجود بالفعل في قائمة الانتظار');
    }

    const wl = this.waitingRepository.create({ patientId, doctorId, departmentId, priority } as any);
    const savedWl = await this.waitingRepository.save(wl);
    return this.waitingRepository.findOne({ where: { id: (savedWl as any).id } as any, relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'department'] });
  }

  async getWaitingList(doctorId?: number) {
    return this.waitingRepository.find({
      where: doctorId ? { doctorId } as any : {},
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'department'],
      order: { priority: 'DESC', createdAt: 'ASC' },
    });
  }

  async notifyNextInLine(doctorId: number, availableDate: Date, availableTime: Date) {
    const nextInLine = await this.waitingRepository.findOne({
      where: { doctorId, notified: false } as any,
      relations: ['patient', 'patient.profile'],
      order: { priority: 'DESC', createdAt: 'ASC' },
    });

    if (nextInLine) {
      // إرسال إشعار للمريض
      await this.sendNotification(nextInLine.patientId, {
        title: 'موعد متاح',
        message: `موعد متاح مع الطبيب في ${availableDate.toLocaleDateString()} الساعة ${availableTime.toLocaleTimeString()}`,
        type: 'APPOINTMENT',
      });

      // تحديث حالة الإشعار
      await this.waitingRepository.update({ id: nextInLine.id } as any, { notified: true });
    }

    return nextInLine;
  }

  async removeFromWaitingList(id: number) {
    await this.waitingRepository.delete({ id } as any);
    return { id } as any;
  }

  async updatePriority(id: number, priority: number) {
    await this.waitingRepository.update({ id } as any, { priority });
    return this.waitingRepository.findOne({ where: { id } as any });
  }

  private async sendNotification(userId: number, notification: any) {
    // منطق إرسال الإشعارات
    // سيتم تطويره في المرحلة الرابعة
    console.log(`Notification sent to user ${userId}:`, notification);
  }
}
