import { api } from './api';
import { OverviewStats, AppointmentsStats, DoctorsStats, UsersGrowthStats, WaitingListStats, ConsultationsStats } from '@/types';

export const adminService = {
  async getOverviewStats(): Promise<OverviewStats> {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  async getAppointmentsStats(period: 'day' | 'week' | 'month' = 'day'): Promise<AppointmentsStats> {
    const response = await api.get('/admin/stats/appointments', { params: { period } });
    return response.data;
  },

  async getDoctorsStats(): Promise<DoctorsStats> {
    const response = await api.get('/admin/stats/doctors');
    return response.data;
  },

  async getUsersGrowthStats(period: 'week' | 'month' | 'year' = 'month'): Promise<UsersGrowthStats> {
    const response = await api.get('/admin/stats/users-growth', { params: { period } });
    return response.data;
  },

  async getWaitingListStats(): Promise<WaitingListStats> {
    const response = await api.get('/admin/stats/waiting-list');
    return response.data;
  },

  async getConsultationsStats(): Promise<ConsultationsStats> {
    const response = await api.get('/admin/stats/consultations');
    return response.data;
  },
};