import { api } from './api';
import { Specialty } from '@/types';

export const specialtiesService = {
  async getSpecialties(params?: Record<string, any>) {
    const response = await api.get('/specialties', { params });
    return response.data as any;
  },

  async getSpecialtyById(id: number) {
    const response = await api.get(`/specialties/${id}`);
    return response.data as Specialty;
  },

  async createSpecialty(specialtyData: Partial<Specialty>) {
    const response = await api.post('/specialties', specialtyData);
    return response.data as Specialty;
  },

  async updateSpecialty(id: number, specialtyData: Partial<Specialty>) {
    const response = await api.patch(`/specialties/${id}`, specialtyData);
    return response.data as Specialty;
  },

  async deleteSpecialty(id: number) {
    const response = await api.delete(`/specialties/${id}`);
    return response.data as { message: string };
  },
};
