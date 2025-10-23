import { apiClient } from './client';

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalClinics: number;
    totalAppointments: number;
    totalConsultations: number;
    activeDoctors: number;
    pendingAppointments: number;
    completedAppointments: number;
    totalSpecialties: number;
    waitingListCount: number;
  };
  usersByRole: Array<{ role: string; count: string }>;
  appointmentsByStatus: Array<{ status: string; count: string }>;
}

export interface AppointmentsStats {
  period: string;
  total: number;
  appointmentsByClinic: Record<string, number>;
  appointmentsBySpecialty: Record<string, number>;
  upcomingAppointments: Array<{
    id: number;
    appointmentDate: string;
    appointmentTime: string;
    patient: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
    doctor: {
      user: {
        profile: {
          firstName: string;
          lastName: string;
        };
      };
    };
    clinic: {
      name: string;
    };
  }>;
}

export interface DoctorsStats {
  totalDoctors: number;
  availableDoctors: number;
  topDoctors: Array<{
    id: number;
    name: string;
    specialization: string;
    clinic: string;
    specialty: string;
    appointmentCount: number;
    averageRating: number;
    isAvailable: boolean;
  }>;
  doctorsBySpecialty: Record<string, number>;
}

export interface UsersGrowthStats {
  period: string;
  growth: Array<{
    date: string;
    count: number;
  }>;
}

export interface WaitingListStats {
  totalWaiting: number;
  waitingByDepartment: Record<string, number>;
  longestWaitingLists: Array<{
    department: string;
    count: number;
  }>;
}

export interface ConsultationsStats {
  totalConsultations: number;
  consultationsByStatus: Record<string, number>;
  averageDurationMinutes: number;
}

export const adminService = {
  // إحصائيات عامة
  getOverviewStats: (): Promise<AdminStats> => {
    return apiClient.get('/admin/stats/overview');
  },

  // إحصائيات المواعيد
  getAppointmentsStats: (period: 'day' | 'week' | 'month' = 'day'): Promise<AppointmentsStats> => {
    return apiClient.get(`/admin/stats/appointments?period=${period}`);
  },

  // إحصائيات الأطباء
  getDoctorsStats: (): Promise<DoctorsStats> => {
    return apiClient.get('/admin/stats/doctors');
  },

  // نمو المستخدمين
  getUsersGrowthStats: (period: 'week' | 'month' | 'year' = 'month'): Promise<UsersGrowthStats> => {
    return apiClient.get(`/admin/stats/users-growth?period=${period}`);
  },

  // إحصائيات قوائم الانتظار
  getWaitingListStats: (): Promise<WaitingListStats> => {
    return apiClient.get('/admin/stats/waiting-list');
  },

  // إحصائيات الاستشارات
  getConsultationsStats: (): Promise<ConsultationsStats> => {
    return apiClient.get('/admin/stats/consultations');
  },
};
