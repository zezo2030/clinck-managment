import { Doctor, Patient } from './user';

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
  patient: Patient;
  doctor: Doctor;
  clinic: {
    id: number;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  clinicId: number;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  date?: string;
  time?: string;
  status?: AppointmentStatus;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
}

export interface AppointmentQuery {
  patientId?: number;
  doctorId?: number;
  clinicId?: number;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  search?: string;
}

