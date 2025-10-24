import { useApi, useApiMutation } from './useApi';
import { doctorsService } from '@/services';
import { 
  Doctor, 
  CreateDoctorDto, 
  UpdateDoctorDto, 
  Schedule,
  CreateScheduleDto,
  UpdateScheduleDto,
} from '@/types';

export const useDoctors = (params?: Record<string, any>) => {
  return useApi(
    ['doctors', params as any],
    () => doctorsService.getDoctors(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useDoctor = (id: number) => {
  return useApi(
    ['doctors', id as any],
    () => doctorsService.getDoctorById(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateDoctor = () => {
  return useApiMutation(
    (doctorData: CreateDoctorDto) => doctorsService.createDoctor(doctorData),
    {}
  );
};

export const useUpdateDoctor = () => {
  return useApiMutation(
    ({ id, doctorData }: { id: number; doctorData: UpdateDoctorDto }) =>
      doctorsService.updateDoctor(id, doctorData),
    {}
  );
};

export const useDeleteDoctor = () => {
  return useApiMutation(
    (id: number) => doctorsService.deleteDoctor(id),
    {}
  );
};

export const useDoctorSchedules = (doctorId: number) => {
  return useApi(
    ['doctors', doctorId as any, 'schedules'],
    () => doctorsService.getDoctorSchedules(doctorId),
    {
      enabled: !!doctorId,
    }
  );
};

export const useCreateSchedule = (doctorId: number) => {
  return useApiMutation(
    (scheduleData: CreateScheduleDto) => doctorsService.createSchedule(doctorId, scheduleData),
    {}
  );
};

export const useGetAvailableDoctors = (params: { date: string; departmentId?: number }) => {
  return useApi(
    ['doctors', 'available', params.date, String(params.departmentId || '')],
    () => doctorsService.getAvailableDoctors(params),
    {}
  );
};

