import { useApi } from './useApi';
import { adminService } from '@/services';
import { 
  OverviewStats, 
  AppointmentsStats, 
  DoctorsStats, 
  UsersGrowthStats, 
  WaitingListStats, 
  ConsultationsStats 
} from '@/types';

export const useOverviewStats = () => {
  return useApi(
    ['stats', 'overview'],
    () => adminService.getOverviewStats(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useAppointmentsStats = (period: 'day' | 'week' | 'month' = 'day') => {
  return useApi(
    ['stats', 'appointments', period],
    () => adminService.getAppointmentsStats(period),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useDoctorsStats = () => {
  return useApi(
    ['stats', 'doctors'],
    () => adminService.getDoctorsStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useUsersGrowthStats = (period: 'week' | 'month' | 'year' = 'month') => {
  return useApi(
    ['stats', 'users-growth', period],
    () => adminService.getUsersGrowthStats(period),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useWaitingListStats = () => {
  return useApi(
    ['stats', 'waiting-list'],
    () => adminService.getWaitingListStats(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const useConsultationsStats = () => {
  return useApi(
    ['stats', 'consultations'],
    () => adminService.getConsultationsStats(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

