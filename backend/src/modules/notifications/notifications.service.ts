import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { Consultation } from '../../database/entities/consultation.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { RoleEnum } from '../../database/enums/role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(WaitingList)
    private readonly waitingListRepository: Repository<WaitingList>,
  ) {}

  // إنشاء تنبيه جديد
  async createNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    actionUrl?: string,
    metadata?: Record<string, any>
  ) {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      priority,
      actionUrl,
      metadata,
    });

    return this.notificationRepository.save(notification);
  }

  // جلب التنبيهات للمستخدم
  async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // تعليم التنبيه كمقروء
  async markAsRead(notificationId: number, userId: number) {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true }
    );
    return { success: true };
  }

  // تعليم جميع التنبيهات كمقروءة
  async markAllAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  }

  // عدد التنبيهات غير المقروءة
  async getUnreadCount(userId: number) {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  // حذف التنبيه
  async deleteNotification(notificationId: number, userId: number) {
    await this.notificationRepository.delete({ id: notificationId, userId });
    return { success: true };
  }

  // حذف التنبيهات القديمة (أكثر من 30 يوم)
  async deleteOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.notificationRepository.delete({
      createdAt: MoreThanOrEqual(thirtyDaysAgo),
    });

    return { success: true };
  }

  // إنشاء تنبيهات تلقائية للمواعيد
  async createAppointmentNotifications(appointmentId: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'doctor', 'doctor.profile'],
    });

    if (!appointment) return;

    // تنبيه للمريض
    await this.createNotification(
      appointment.patientId,
      NotificationType.APPOINTMENT_PENDING,
      'موعد جديد',
      `تم جدولة موعد جديد مع د. ${appointment.doctor?.profile?.firstName || ''} ${appointment.doctor?.profile?.lastName || ''}`,
      NotificationPriority.MEDIUM,
      `/appointments/${appointmentId}`,
      { appointmentId }
    );

    // تنبيه للطبيب
    if (appointment.doctor?.id) {
      await this.createNotification(
        appointment.doctor.id,
        NotificationType.APPOINTMENT_PENDING,
        'موعد جديد',
        `موعد جديد مع ${appointment.patient?.profile?.firstName || ''} ${appointment.patient?.profile?.lastName || ''}`,
        NotificationPriority.MEDIUM,
        `/appointments/${appointmentId}`,
        { appointmentId }
      );
    }
  }

  // إنشاء تنبيهات للاستشارات
  async createConsultationNotifications(consultationId: number) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['appointment', 'appointment.patient', 'appointment.doctor', 'appointment.doctor.profile'],
    });

    if (!consultation) return;

    const patientId = consultation.appointment?.patientId;
    const doctorId = consultation.appointment?.doctor?.id;

    if (consultation.status === 'IN_PROGRESS') {
      // تنبيه بدء الاستشارة
      if (patientId) {
        await this.createNotification(
          patientId,
          NotificationType.CONSULTATION_STARTED,
          'استشارة جديدة',
          'تم بدء الاستشارة مع طبيبك',
          NotificationPriority.HIGH,
          `/consultations/${consultationId}`
        );
      }

      if (doctorId) {
        await this.createNotification(
          doctorId,
          NotificationType.CONSULTATION_STARTED,
          'استشارة جديدة',
          'تم بدء الاستشارة مع المريض',
          NotificationPriority.HIGH,
          `/consultations/${consultationId}`
        );
      }
    }
  }

  // إنشاء تنبيهات لقوائم الانتظار
  async createWaitingListNotifications(waitingListId: number) {
    const waitingList = await this.waitingListRepository.findOne({
      where: { id: waitingListId },
      relations: ['patient', 'department'],
    });

    if (!waitingList) return;

    await this.createNotification(
      waitingList.patientId,
      NotificationType.WAITING_LIST_UPDATE,
      'تحديث قائمة الانتظار',
      `تم تحديث وضعك في قائمة انتظار ${waitingList.department?.name || 'القسم'}`,
      NotificationPriority.MEDIUM,
      `/waiting-list/${waitingListId}`
    );
  }

  // إنشاء تنبيهات للمدير
  async createAdminNotifications(type: NotificationType, title: string, message: string, metadata?: Record<string, any>) {
    // جلب جميع المديرين
    const admins = await this.userRepository.find({
      where: { role: RoleEnum.ADMIN },
    });

    // إرسال التنبيه لجميع المديرين
    const notifications = admins.map(admin =>
      this.createNotification(
        admin.id,
        type,
        title,
        message,
        NotificationPriority.HIGH,
        undefined,
        metadata
      )
    );

    await Promise.all(notifications);
  }

  // إحصائيات التنبيهات
  async getNotificationStats(userId?: number) {
    const where = userId ? { userId } : {};

    const [total, unread, byType, byPriority] = await Promise.all([
      this.notificationRepository.count({ where }),
      this.notificationRepository.count({ where: { ...where, isRead: false } }),
      this.notificationRepository
        .createQueryBuilder('notification')
        .select('notification.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where(where)
        .groupBy('notification.type')
        .getRawMany(),
      this.notificationRepository
        .createQueryBuilder('notification')
        .select('notification.priority', 'priority')
        .addSelect('COUNT(*)', 'count')
        .where(where)
        .groupBy('notification.priority')
        .getRawMany(),
    ]);

    return {
      total,
      unread,
      byType,
      byPriority,
    };
  }
}
