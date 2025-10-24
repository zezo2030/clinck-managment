import { api } from './api';
import { Consultation, PaginatedResponse, QueryParams } from '@/types';

export const consultationsService = {
  // Get all consultations with pagination and filtering
  async getConsultations(params?: QueryParams): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get('/consultations', { params });
    return response.data;
  },

  // Get a specific consultation by ID
  async getConsultationById(id: number): Promise<Consultation> {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  // Create a new consultation
  async createConsultation(consultationData: Partial<Consultation>): Promise<Consultation> {
    const response = await api.post('/consultations', consultationData);
    return response.data;
  },

  // Update an existing consultation
  async updateConsultation(id: number, consultationData: Partial<Consultation>): Promise<Consultation> {
    const response = await api.put(`/consultations/${id}`, consultationData);
    return response.data;
  },

  // Delete a consultation
  async deleteConsultation(id: number): Promise<void> {
    await api.delete(`/consultations/${id}`);
  },

  // Get consultations by doctor
  async getConsultationsByDoctor(doctorId: number, params?: QueryParams): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get(`/consultations/doctor/${doctorId}`, { params });
    return response.data;
  },

  // Get consultations by patient
  async getConsultationsByPatient(patientId: number, params?: QueryParams): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get(`/consultations/patient/${patientId}`, { params });
    return response.data;
  },

  // Search consultations
  async searchConsultations(query: string, params?: QueryParams): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get('/consultations/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get consultation statistics
  async getConsultationStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    byDoctor: Record<string, number>;
    byMonth: Array<{ month: string; count: number }>;
  }> {
    const response = await api.get('/consultations/stats');
    return response.data;
  }
};