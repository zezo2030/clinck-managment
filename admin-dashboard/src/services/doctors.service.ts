import { api } from './api';
import { Doctor, PaginatedResponse, QueryParams, CreateDoctorDto, UpdateDoctorDto, DoctorWithStats, Schedule, CreateScheduleDto, UpdateScheduleDto } from '@/types';

export const doctorsService = {
  // Get all doctors with pagination and filtering
  async getDoctors(params?: QueryParams): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  // Get a specific doctor by ID
  async getDoctorById(id: number): Promise<Doctor> {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Create a new doctor
  async createDoctor(doctorData: CreateDoctorDto): Promise<Doctor> {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },

  // Update an existing doctor
  async updateDoctor(id: number, doctorData: UpdateDoctorDto): Promise<Doctor> {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  // Delete a doctor
  async deleteDoctor(id: number): Promise<void> {
    await api.delete(`/doctors/${id}`);
  },

  // Update doctor status
  async updateDoctorStatus(id: number, isActive: boolean): Promise<Doctor> {
    const response = await api.patch(`/doctors/${id}/status`, { isActive });
    return response.data;
  },

  // Get doctors by specialty
  async getDoctorsBySpecialty(specialtyId: number, params?: QueryParams): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get(`/doctors/specialty/${specialtyId}`, { params });
    return response.data;
  },

  // Search doctors
  async searchDoctors(query: string, params?: QueryParams): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get('/doctors/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get doctor statistics
  async getDoctorStats(id?: number): Promise<DoctorWithStats | {
    total: number;
    active: number;
    inactive: number;
    bySpecialty: Record<string, number>;
  }> {
    const url = id ? `/doctors/${id}/stats` : '/doctors/stats';
    const response = await api.get(url);
    return response.data;
  },

  // Schedule management
  async getDoctorSchedules(doctorId: number): Promise<Schedule[]> {
    const response = await api.get(`/doctors/${doctorId}/schedules`);
    return response.data;
  },

  async createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule> {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  async updateSchedule(scheduleId: number, scheduleData: UpdateScheduleDto): Promise<Schedule> {
    const response = await api.put(`/schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  async deleteSchedule(scheduleId: number): Promise<void> {
    await api.delete(`/schedules/${scheduleId}`);
  }
};