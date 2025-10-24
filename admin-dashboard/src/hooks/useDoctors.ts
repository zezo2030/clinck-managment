import { useApi, useApiMutation } from './useApi';
import { doctorsService } from '@/services';
import { 
  Doctor, 
  CreateDoctorDto, 
  UpdateDoctorDto, 
  DoctorWithStats,
  Schedule,
  CreateScheduleDto,
  UpdateScheduleDto,
  PaginatedResponse,
  QueryParams 
} from '@/types';

export const useDoctors = (params?: QueryParams) => {
  return useApi(
    ['doctors', params],
    () => doctorsService.getDoctors(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useDoctor = (id: number) => {
  return useApi(
    ['doctors', id],
    () => doctorsService.getDoctorById(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateDoctor = () => {
  return useApiMutation(
    (doctorData: CreateDoctorDto) => doctorsService.createDoctor(doctorData),
    {
      onSuccess: () => {
        // Invalidate doctors list
      },
    }
  );
};

export const useUpdateDoctor = () => {
  return useApiMutation(
    ({ id, doctorData }: { id: number; doctorData: UpdateDoctorDto }) =>
      doctorsService.updateDoctor(id, doctorData),
    {
      onSuccess: (data, { id }) => {
        // Update the specific doctor in cache
      },
    }
  );
};

export const useDeleteDoctor = () => {
  return useApiMutation(
    (id: number) => doctorsService.deleteDoctor(id),
    {
      onSuccess: () => {
        // Invalidate doctors list
      },
    }
  );
};

export const useDoctorStats = (id: number) => {
  return useApi(
    ['doctors', id, 'stats'],
    () => doctorsService.getDoctorStats(id),
    {
      enabled: !!id,
    }
  );
};

// Schedule hooks
export const useDoctorSchedules = (doctorId: number) => {
  return useApi(
    ['doctors', doctorId, 'schedules'],
    () => doctorsService.getDoctorSchedules(doctorId),
    {
      enabled: !!doctorId,
    }
  );
};

export const useCreateSchedule = () => {
  return useApiMutation(
    (scheduleData: CreateScheduleDto) => doctorsService.createSchedule(scheduleData),
    {
      onSuccess: (data, variables) => {
        // Invalidate doctor schedules
      },
    }
  );
};

export const useUpdateSchedule = () => {
  return useApiMutation(
    ({ scheduleId, scheduleData }: { scheduleId: number; scheduleData: UpdateScheduleDto }) =>
      doctorsService.updateSchedule(scheduleId, scheduleData),
    {
      onSuccess: (data, { scheduleId }) => {
        // Update the specific schedule in cache
      },
    }
  );
};

export const useDeleteSchedule = () => {
  return useApiMutation(
    (scheduleId: number) => doctorsService.deleteSchedule(scheduleId),
    {
      onSuccess: () => {
        // Invalidate doctor schedules
      },
    }
  );
};

