import { api } from './api';
import { Clinic } from '@/types';

export const clinicsService = {
  async getClinics(params?: Record<string, any>) {
    const response = await api.get('/clinics', { params });
    return response.data as any;
  },

  async getClinicById(id: number) {
    const response = await api.get(`/clinics/${id}`);
    return response.data as Clinic;
  },

  async createClinic(clinicData: Partial<Clinic>) {
    const response = await api.post('/clinics', clinicData);
    return response.data as Clinic;
  },

  async updateClinic(id: number, clinicData: Partial<Clinic>) {
    const response = await api.patch(`/clinics/${id}`, clinicData);
    return response.data as Clinic;
  },

  async deleteClinic(id: number) {
    await api.delete(`/clinics/${id}`);
  },

  async setActive(id: number, isActive: boolean) {
    const response = await api.patch(`/clinics/${id}/activate`, { isActive });
    return response.data as Clinic;
  },
};