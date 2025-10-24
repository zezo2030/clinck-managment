import { User } from './auth';

export interface Patient extends User {
  role: 'PATIENT';
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
}

export interface Doctor extends User {
  role: 'DOCTOR';
  licenseNumber: string;
  specialties: Specialty[];
  clinics: Clinic[];
  schedules: Schedule[];
  rating?: number;
  experience?: number;
  education?: string;
  bio?: string;
}

export interface Admin extends User {
  role: 'ADMIN';
  permissions: string[];
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  isActive: boolean;
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  clinicId: number;
  clinic?: Clinic;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: number;
  doctorId: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

