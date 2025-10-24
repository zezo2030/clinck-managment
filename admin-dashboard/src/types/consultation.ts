import { Doctor, Patient } from './user';

export type ConsultationStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Consultation {
  id: number;
  patientId: number;
  doctorId: number;
  status: ConsultationStatus;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startTime?: string;
  endTime?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  patient: Patient;
  doctor: Doctor;
  messages: Message[];
  files: ConsultationFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  consultationId: number;
  senderId: number;
  senderType: 'PATIENT' | 'DOCTOR';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConsultationFile {
  id: number;
  consultationId: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  createdAt: string;
}

export interface CreateConsultationDto {
  patientId: number;
  doctorId: number;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface UpdateConsultationDto {
  status?: ConsultationStatus;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
}

export interface ConsultationQuery {
  patientId?: number;
  doctorId?: number;
  status?: ConsultationStatus;
  priority?: string;
  page?: number;
  limit?: number;
  search?: string;
}

