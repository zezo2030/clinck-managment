import { apiClient } from './client';

export interface Doctor {
  id: number;
  userId: number;
  clinicId: number;
  specialtyId: number;
  departmentId: number;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
    };
  };
  clinic?: {
    id: number;
    name: string;
  };
  specialty?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  schedules?: Array<{
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  ratings?: Array<{
    id: number;
    rating: number;
    comment: string;
    patient: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

export interface CreateDoctorDto {
  userId: number;
  clinicId: number;
  specialtyId: number;
  departmentId: number;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
}

export interface UpdateDoctorDto {
  clinicId?: number;
  specialtyId?: number;
  departmentId?: number;
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable?: boolean;
}

export interface DoctorsQuery {
  page?: number;
  limit?: number;
  clinicId?: number;
  departmentId?: number;
  specialtyId?: number;
  specialization?: string;
  isAvailable?: boolean;
  search?: string;
}

export const doctorsService = {
  // جلب جميع الأطباء
  getDoctors: (query: DoctorsQuery = {}): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.clinicId) params.append('clinicId', query.clinicId.toString());
    if (query.departmentId) params.append('departmentId', query.departmentId.toString());
    if (query.specialtyId) params.append('specialtyId', query.specialtyId.toString());
    if (query.specialization) params.append('specialization', query.specialization);
    if (query.isAvailable !== undefined) params.append('isAvailable', query.isAvailable.toString());
    if (query.search) params.append('search', query.search);

    return apiClient.get(`/doctors?${params.toString()}`);
  },

  // جلب طبيب واحد
  getDoctor: (id: number): Promise<Doctor> => {
    return apiClient.get(`/doctors/${id}`);
  },

  // جلب طبيب واحد (alias)
  getDoctorById: (id: number): Promise<Doctor> => {
    return apiClient.get(`/doctors/${id}`);
  },

  // إنشاء طبيب جديد
  createDoctor: (doctorData: CreateDoctorDto): Promise<Doctor> => {
    return apiClient.post('/doctors', doctorData);
  },

  // تحديث طبيب
  updateDoctor: (id: number, doctorData: UpdateDoctorDto): Promise<Doctor> => {
    return apiClient.patch(`/doctors/${id}`, doctorData);
  },

  // حذف طبيب
  deleteDoctor: (id: number): Promise<{ success: boolean }> => {
    return apiClient.delete(`/doctors/${id}`);
  },

  // تغيير حالة التوفر
  setAvailability: (id: number, isAvailable: boolean): Promise<Doctor> => {
    return apiClient.patch(`/doctors/${id}/availability`, { isAvailable });
  },

  // إحصائيات الأطباء
  getDoctorsStats: (): Promise<{
    totalDoctors: number;
    availableDoctors: number;
    unavailableDoctors: number;
    doctorsBySpecialty: Record<string, number>;
    doctorsByClinic: Record<string, number>;
  }> => {
    return apiClient.get('/doctors/stats');
  },

  // توزيع التقييمات
  getRatingDistribution: (ratings: any[]): Record<number, number> => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating]++;
      }
    });
    return distribution;
  },
};