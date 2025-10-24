import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { Consultation } from '../../database/entities/consultation.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { Specialty } from '../../database/entities/specialty.entity';
import { WaitingList } from '../../database/entities/waiting-list.entity';
import { RoleEnum } from '../../database/enums/role.enum';
import { AppointmentStatusEnum } from '../../database/enums/appointment-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(WaitingList)
    private readonly waitingListRepository: Repository<WaitingList>,
  ) {}

  // إحصائيات عامة
  async getOverviewStats() {
    const [
      totalUsers,
      totalClinics,
      totalAppointments,
      totalConsultations,
      activeDoctors,
      pendingAppointments,
      completedAppointments,
      totalSpecialties,
      waitingListCount,
    ] = await Promise.all([
      this.userRepository.count(),
      this.clinicRepository.count({ where: { isActive: true } }),
      this.appointmentRepository.count(),
      this.consultationRepository.count(),
      this.doctorRepository.count({ where: { isAvailable: true } }),
      this.appointmentRepository.count({ where: { status: AppointmentStatusEnum.SCHEDULED } }),
      this.appointmentRepository.count({ where: { status: AppointmentStatusEnum.COMPLETED } }),
      this.specialtyRepository.count({ where: { isActive: true } }),
      this.waitingListRepository.count(),
    ]);

    // إحصائيات المستخدمين حسب النوع
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    // إحصائيات المواعيد حسب الحالة
    const appointmentsByStatus = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('appointment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('appointment.status')
      .getRawMany();

    return {
      overview: {
        totalUsers,
        totalClinics,
        totalAppointments,
        totalConsultations,
        activeDoctors,
        pendingAppointments,
        completedAppointments,
        totalSpecialties,
        waitingListCount,
      },
      usersByRole,
      appointmentsByStatus,
    };
  }

  // إحصائيات المواعيد
  async getAppointmentsStats(period: 'day' | 'week' | 'month' = 'day') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startDate, now),
      },
      relations: ['patient', 'doctor', 'clinic', 'specialty'],
    });

    // إحصائيات حسب العيادة
    const appointmentsByClinic = appointments.reduce((acc, appointment) => {
      const clinicName = appointment.clinic?.name || 'غير محدد';
      acc[clinicName] = (acc[clinicName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // إحصائيات حسب التخصص
    const appointmentsBySpecialty = appointments.reduce((acc, appointment) => {
      const specialtyName = appointment.specialty?.name || 'غير محدد';
      acc[specialtyName] = (acc[specialtyName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // المواعيد القادمة
    const upcomingAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: MoreThanOrEqual(now),
        status: AppointmentStatusEnum.SCHEDULED,
      },
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'doctor.doctor', 'clinic'],
      order: { appointmentDate: 'ASC' },
      take: 10,
    });

    return {
      period,
      total: appointments.length,
      appointmentsByClinic,
      appointmentsBySpecialty,
      upcomingAppointments,
    };
  }

  // إحصائيات الأطباء
  async getDoctorsStats() {
    const doctors = await this.doctorRepository.find({
      relations: ['user', 'user.profile', 'clinic', 'specialty', 'ratings'],
    });

    // الأطباء الأكثر حجزاً
    const doctorsWithAppointmentCount = await Promise.all(
      doctors.map(async (doctor) => {
        const appointmentCount = await this.appointmentRepository.count({
          where: { doctorId: doctor.id },
        });

        const averageRating = doctor.ratings?.length
          ? doctor.ratings.reduce((sum, rating) => sum + rating.rating, 0) / doctor.ratings.length
          : 0;

        return {
          id: doctor.id,
          name: `${doctor.user?.profile?.firstName || ''} ${doctor.user?.profile?.lastName || ''}`.trim(),
          specialization: doctor.specialization,
          clinic: doctor.clinic?.name,
          specialty: doctor.specialty?.name,
          appointmentCount,
          averageRating,
          isAvailable: doctor.isAvailable,
        };
      })
    );

    // ترتيب الأطباء حسب عدد المواعيد
    const topDoctors = doctorsWithAppointmentCount
      .sort((a, b) => b.appointmentCount - a.appointmentCount)
      .slice(0, 10);

    // إحصائيات حسب التخصص
    const doctorsBySpecialty = doctorsWithAppointmentCount.reduce((acc, doctor) => {
      const specialty = doctor.specialty || 'غير محدد';
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDoctors: doctors.length,
      availableDoctors: doctors.filter(d => d.isAvailable).length,
      topDoctors,
      doctorsBySpecialty,
    };
  }

  // نمو المستخدمين
  async getUsersGrowthStats(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;
    let interval: string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        interval = 'day';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        interval = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        interval = 'month';
        break;
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(`DATE_TRUNC('${interval}', user.createdAt)`, 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt >= :startDate', { startDate })
      .groupBy(`DATE_TRUNC('${interval}', user.createdAt)`)
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      period,
      growth: users.map(user => ({
        date: user.date,
        count: parseInt(user.count),
      })),
    };
  }

  // إحصائيات قوائم الانتظار
  async getWaitingListStats() {
    const waitingLists = await this.waitingListRepository.find({
      relations: ['patient', 'patient.profile', 'doctor', 'doctor.profile', 'doctor.doctor', 'department'],
    });

    // إحصائيات حسب القسم
    const waitingByDepartment = waitingLists.reduce((acc, waiting) => {
      const departmentName = waiting.department?.name || 'غير محدد';
      acc[departmentName] = (acc[departmentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // أطول قوائم انتظار
    const longestWaitingLists = Object.entries(waitingByDepartment)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalWaiting: waitingLists.length,
      waitingByDepartment,
      longestWaitingLists,
    };
  }

  // إحصائيات الاستشارات
  async getConsultationsStats() {
    const consultations = await this.consultationRepository.find({
      relations: ['appointment', 'appointment.patient', 'appointment.doctor'],
    });

    const consultationsByStatus = consultations.reduce((acc, consultation) => {
      acc[consultation.status] = (acc[consultation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // متوسط مدة الاستشارة
    const completedConsultations = consultations.filter(c => c.status === 'COMPLETED' && c.endedAt);
    const averageDuration = completedConsultations.length > 0
      ? completedConsultations.reduce((sum, consultation) => {
          const duration = consultation.endedAt.getTime() - consultation.startedAt.getTime();
          return sum + duration;
        }, 0) / completedConsultations.length
      : 0;

    return {
      totalConsultations: consultations.length,
      consultationsByStatus,
      averageDurationMinutes: Math.round(averageDuration / (1000 * 60)),
    };
  }
}
