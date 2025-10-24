import { api } from './api';
import { Department } from '@/types';

export const departmentsService = {
  async getDepartments(clinicId?: number) {
    const response = await api.get('/departments', { 
      params: clinicId ? { clinicId } : {} 
    });
    return response.data as any;
  },

  async getDepartmentById(id: number) {
    const response = await api.get(`/departments/${id}`);
    return response.data as Department;
  },

  async createDepartment(departmentData: Partial<Department>) {
    const response = await api.post('/departments', departmentData);
    return response.data as Department;
  },

  async updateDepartment(id: number, departmentData: Partial<Department>) {
    const response = await api.patch(`/departments/${id}`, departmentData);
    return response.data as Department;
  },

  async deleteDepartment(id: number) {
    const response = await api.delete(`/departments/${id}`);
    return response.data as { message: string };
  },

  async setActive(id: number, isActive: boolean) {
    const response = await api.patch(`/departments/${id}/activate`, { isActive });
    return response.data as Department;
  },
};
