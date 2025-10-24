import { Doctor, Specialty, Schedule } from './user';

export interface CreateDoctorDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specialties: number[];
  clinics: number[];
  experience?: number;
  education?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateDoctorDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  licenseNumber?: string;
  specialties?: number[];
  clinics?: number[];
  experience?: number;
  education?: string;
  bio?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface DoctorWithStats extends Doctor {
  totalAppointments: number;
  totalPatients: number;
  averageRating: number;
  upcomingAppointments: number;
}

export interface CreateScheduleDto {
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleDto {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

