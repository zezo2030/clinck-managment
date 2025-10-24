import { apiService } from './api';
import { Specialty, PaginatedResponse, QueryParams } from '@/types';

export const specialtiesService = {
  async getSpecialties(params?: QueryParams): Promise<PaginatedResponse<Specialty>> {
    const response = await apiService.get<PaginatedResponse<Specialty>>('/api/v1/specialties', { params });
    return response.data;
  },

  async getSpecialtyById(id: number): Promise<Specialty> {
    const response = await apiService.get<Specialty>(`/api/v1/specialties/${id}`);
    return response.data;
  },

  async createSpecialty(specialtyData: Partial<Specialty>): Promise<Specialty> {
    const response = await apiService.post<Specialty>('/api/v1/specialties', specialtyData);
    return response.data;
  },

  async updateSpecialty(id: number, specialtyData: Partial<Specialty>): Promise<Specialty> {
    const response = await apiService.put<Specialty>(`/api/v1/specialties/${id}`, specialtyData);
    return response.data;
  },

  async deleteSpecialty(id: number): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/api/v1/specialties/${id}`);
    return response.data;
  },
};
