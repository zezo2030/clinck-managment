import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ActivityLog, ActivityType, ActivitySeverity } from '../../database/entities/activity-log.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // تسجيل نشاط جديد
  async logActivity(
    type: ActivityType,
    description: string,
    userId?: number,
    severity: ActivitySeverity = ActivitySeverity.LOW,
    metadata?: Record<string, any>,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    const activityLog = this.activityLogRepository.create({
      type,
      description,
      userId,
      severity,
      metadata,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });

    return this.activityLogRepository.save(activityLog);
  }

  // جلب سجل الأنشطة
  async getActivityLogs(
    page: number = 1,
    limit: number = 50,
    userId?: number,
    type?: ActivityType,
    severity?: ActivitySeverity,
    startDate?: Date,
    endDate?: Date
  ) {
    const where: any = {};

    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (severity) where.severity = severity;

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    const [activityLogs, total] = await this.activityLogRepository.findAndCount({
      where,
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      activityLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // إحصائيات الأنشطة
  async getActivityStats(
    startDate?: Date,
    endDate?: Date,
    userId?: number
  ) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const [totalActivities, byType, bySeverity, byUser] = await Promise.all([
      this.activityLogRepository.count({ where }),
      this.activityLogRepository
        .createQueryBuilder('activityLog')
        .select('activityLog.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where(where)
        .groupBy('activityLog.type')
        .getRawMany(),
      this.activityLogRepository
        .createQueryBuilder('activityLog')
        .select('activityLog.severity', 'severity')
        .addSelect('COUNT(*)', 'count')
        .where(where)
        .groupBy('activityLog.severity')
        .getRawMany(),
      this.activityLogRepository
        .createQueryBuilder('activityLog')
        .leftJoin('activityLog.user', 'user')
        .leftJoin('user.profile', 'profile')
        .select('user.id', 'userId')
        .addSelect('CONCAT(profile.firstName, \' \', profile.lastName)', 'userName')
        .addSelect('COUNT(*)', 'count')
        .where(where)
        .groupBy('user.id, profile.firstName, profile.lastName')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
    ]);

    return {
      totalActivities,
      byType,
      bySeverity,
      byUser,
    };
  }

  // جلب الأنشطة الأخيرة للمستخدم
  async getUserRecentActivities(userId: number, limit: number = 10) {
    return this.activityLogRepository.find({
      where: { userId },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // جلب الأنشطة الحرجة
  async getCriticalActivities(limit: number = 20) {
    return this.activityLogRepository.find({
      where: { severity: ActivitySeverity.CRITICAL },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // حذف الأنشطة القديمة
  async deleteOldActivities(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.activityLogRepository.delete({
      createdAt: LessThanOrEqual(cutoffDate),
    });

    return { deletedCount: result.affected };
  }

  // تسجيل تسجيل الدخول
  async logUserLogin(userId: number, ipAddress?: string, userAgent?: string) {
    return this.logActivity(
      ActivityType.USER_LOGIN,
      'تسجيل دخول المستخدم',
      userId,
      ActivitySeverity.LOW,
      { ipAddress, userAgent },
      undefined,
      undefined,
      ipAddress,
      userAgent
    );
  }

  // تسجيل تسجيل الخروج
  async logUserLogout(userId: number, ipAddress?: string, userAgent?: string) {
    return this.logActivity(
      ActivityType.USER_LOGOUT,
      'تسجيل خروج المستخدم',
      userId,
      ActivitySeverity.LOW,
      { ipAddress, userAgent },
      undefined,
      undefined,
      ipAddress,
      userAgent
    );
  }

  // تسجيل إنشاء مستخدم
  async logUserCreation(userId: number, newUserData: any, createdBy?: number) {
    return this.logActivity(
      ActivityType.USER_CREATED,
      'إنشاء مستخدم جديد',
      createdBy,
      ActivitySeverity.MEDIUM,
      { newUserId: userId },
      undefined,
      newUserData
    );
  }

  // تسجيل تحديث مستخدم
  async logUserUpdate(userId: number, oldData: any, newData: any, updatedBy?: number) {
    return this.logActivity(
      ActivityType.USER_UPDATED,
      'تحديث بيانات المستخدم',
      updatedBy,
      ActivitySeverity.MEDIUM,
      { updatedUserId: userId },
      oldData,
      newData
    );
  }

  // تسجيل حذف مستخدم
  async logUserDeletion(userId: number, deletedUserData: any, deletedBy?: number) {
    return this.logActivity(
      ActivityType.USER_DELETED,
      'حذف المستخدم',
      deletedBy,
      ActivitySeverity.HIGH,
      { deletedUserId: userId },
      deletedUserData,
      undefined
    );
  }

  // تسجيل خطأ في النظام
  async logSystemError(error: Error, context?: string, userId?: number) {
    return this.logActivity(
      ActivityType.SYSTEM_ERROR,
      `خطأ في النظام: ${error.message}`,
      userId,
      ActivitySeverity.CRITICAL,
      { 
        errorName: error.name,
        errorStack: error.stack,
        context 
      }
    );
  }

  // تسجيل انتهاك أمني
  async logSecurityViolation(
    violationType: string,
    description: string,
    ipAddress?: string,
    userAgent?: string,
    userId?: number
  ) {
    return this.logActivity(
      ActivityType.SECURITY_VIOLATION,
      `انتهاك أمني: ${description}`,
      userId,
      ActivitySeverity.CRITICAL,
      { violationType },
      undefined,
      undefined,
      ipAddress,
      userAgent
    );
  }
}
