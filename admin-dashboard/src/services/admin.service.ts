import { api } from './api';
import { Admin, PaginatedResponse, QueryParams, OverviewStats, AppointmentsStats, DoctorsStats, UsersGrowthStats, WaitingListStats, ConsultationsStats } from '@/types';

export const adminService = {
  // Get all admins with pagination and filtering
  async getAdmins(params?: QueryParams): Promise<PaginatedResponse<Admin>> {
    const response = await api.get('/admins', { params });
    return response.data;
  },

  // Get a specific admin by ID
  async getAdminById(id: number): Promise<Admin> {
    const response = await api.get(`/admins/${id}`);
    return response.data;
  },

  // Create a new admin
  async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
    const response = await api.post('/admins', adminData);
    return response.data;
  },

  // Update an existing admin
  async updateAdmin(id: number, adminData: Partial<Admin>): Promise<Admin> {
    const response = await api.put(`/admins/${id}`, adminData);
    return response.data;
  },

  // Delete an admin
  async deleteAdmin(id: number): Promise<void> {
    await api.delete(`/admins/${id}`);
  },

  // Update admin status
  async updateAdminStatus(id: number, isActive: boolean): Promise<Admin> {
    const response = await api.patch(`/admins/${id}/status`, { isActive });
    return response.data;
  },

  // Search admins
  async searchAdmins(query: string, params?: QueryParams): Promise<PaginatedResponse<Admin>> {
    const response = await api.get('/admins/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get admin statistics
  async getAdminStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const response = await api.get('/admins/stats');
    return response.data;
  },

  // Statistics methods for dashboard
  async getOverviewStats(): Promise<OverviewStats> {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  async getAppointmentsStats(period: 'day' | 'week' | 'month' = 'day'): Promise<AppointmentsStats> {
    const response = await api.get('/admin/stats/appointments', { 
      params: { period } 
    });
    return response.data;
  },

  async getDoctorsStats(): Promise<DoctorsStats> {
    const response = await api.get('/admin/stats/doctors');
    return response.data;
  },

  async getUsersGrowthStats(period: 'week' | 'month' | 'year' = 'month'): Promise<UsersGrowthStats> {
    const response = await api.get('/admin/stats/users-growth', { 
      params: { period } 
    });
    return response.data;
  },

  async getWaitingListStats(): Promise<WaitingListStats> {
    const response = await api.get('/admin/stats/waiting-list');
    return response.data;
  },

  async getConsultationsStats(): Promise<ConsultationsStats> {
    const response = await api.get('/admin/stats/consultations');
    return response.data;
  }
};