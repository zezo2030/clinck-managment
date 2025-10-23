import { apiClient } from './client';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  specialtyId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
  doctor: {
    id: number;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
  clinic: {
    id: number;
    name: string;
    address: string;
    phone?: string;
  };
  specialty: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface CreateAppointmentDto {
  doctorId: number;
  clinicId: number;
  specialtyId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  notes?: string;
  isEmergency?: boolean;
}

export const appointmentService = {
  // الحصول على جميع المواعيد
  async getAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get('/appointments');
    return (response as any).data;
  },

  // الحصول على مواعيد المريض
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/patient/${patientId}`);
    return (response as any).data;
  },

  // الحصول على مواعيد الطبيب
  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}`);
    return (response as any).data;
  },

  // الحصول على موعد محدد
  async getAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${id}`);
    return (response as any).data;
  },

  // إنشاء موعد جديد
  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await apiClient.post('/appointments', data);
    return (response as any).data;
  },

  // تحديث موعد
  async updateAppointment(id: number, data: Partial<CreateAppointmentDto>): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return (response as any).data;
  },

  // تأكيد موعد
  async confirmAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}/confirm`, {});
    return (response as any).data;
  },

  // إلغاء موعد
  async cancelAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}/cancel`, {});
    return (response as any).data;
  },

  // حذف موعد
  async deleteAppointment(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  },
};
