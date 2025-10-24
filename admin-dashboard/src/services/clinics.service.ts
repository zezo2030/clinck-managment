import { api } from './api';
import { Clinic, PaginatedResponse, QueryParams } from '@/types';

export const clinicsService = {
  // Get all clinics with pagination and filtering
  async getClinics(params?: QueryParams): Promise<PaginatedResponse<Clinic>> {
    const response = await api.get('/clinics', { params });
    return response.data;
  },

  // Get a specific clinic by ID
  async getClinicById(id: number): Promise<Clinic> {
    const response = await api.get(`/clinics/${id}`);
    return response.data;
  },

  // Create a new clinic
  async createClinic(clinicData: Partial<Clinic>): Promise<Clinic> {
    const response = await api.post('/clinics', clinicData);
    return response.data;
  },

  // Update an existing clinic
  async updateClinic(id: number, clinicData: Partial<Clinic>): Promise<Clinic> {
    const response = await api.put(`/clinics/${id}`, clinicData);
    return response.data;
  },

  // Delete a clinic
  async deleteClinic(id: number): Promise<void> {
    await api.delete(`/clinics/${id}`);
  },

  // Update clinic status
  async updateClinicStatus(id: number, isActive: boolean): Promise<Clinic> {
    const response = await api.patch(`/clinics/${id}/status`, { isActive });
    return response.data;
  },

  // Search clinics
  async searchClinics(query: string, params?: QueryParams): Promise<PaginatedResponse<Clinic>> {
    const response = await api.get('/clinics/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get clinic statistics
  async getClinicStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byLocation: Record<string, number>;
  }> {
    const response = await api.get('/clinics/stats');
    return response.data;
  }
};