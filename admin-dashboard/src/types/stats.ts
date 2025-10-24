export interface OverviewStats {
  totalUsers: number;
  totalDoctors: number;
  totalClinics: number;
  totalAppointments: number;
  totalConsultations: number;
  activeAppointments: number;
  pendingConsultations: number;
  newUsersThisMonth: number;
  newAppointmentsThisMonth: number;
}

export interface AppointmentsStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  byStatus: {
    status: string;
    count: number;
  }[];
  byDay: {
    date: string;
    count: number;
  }[];
  byDoctor: {
    doctorId: number;
    doctorName: string;
    count: number;
  }[];
}

export interface DoctorsStats {
  total: number;
  active: number;
  inactive: number;
  averageRating: number;
  topRated: {
    doctorId: number;
    doctorName: string;
    rating: number;
    totalAppointments: number;
  }[];
  bySpecialty: {
    specialtyId: number;
    specialtyName: string;
    count: number;
  }[];
}

export interface UsersGrowthStats {
  period: string;
  total: number;
  growth: number;
  byMonth: {
    month: string;
    count: number;
  }[];
  byRole: {
    role: string;
    count: number;
  }[];
}

export interface WaitingListStats {
  total: number;
  bySpecialty: {
    specialtyId: number;
    specialtyName: string;
    count: number;
    averageWaitTime: number;
  }[];
  byClinic: {
    clinicId: number;
    clinicName: string;
    count: number;
    averageWaitTime: number;
  }[];
}

export interface ConsultationsStats {
  total: number;
  pending: number;
  active: number;
  completed: number;
  cancelled: number;
  byStatus: {
    status: string;
    count: number;
  }[];
  byPriority: {
    priority: string;
    count: number;
  }[];
  averageResponseTime: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

