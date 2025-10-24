import { Clinic, Department } from './user';

export interface CreateClinicDto {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
}

export interface UpdateClinicDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  clinicId: number;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export interface ClinicWithStats extends Clinic {
  totalDoctors: number;
  totalAppointments: number;
  totalPatients: number;
  averageRating: number;
}

