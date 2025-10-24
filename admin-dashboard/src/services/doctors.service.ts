import { api } from './api';
import { Doctor, CreateDoctorDto, UpdateDoctorDto, Schedule, CreateScheduleDto } from '@/types';

export const doctorsService = {
  async getDoctors(params?: Record<string, any>) {
    const response = await api.get('/doctors', { params });
    return response.data as any;
  },

  async getDoctorById(id: number) {
    const response = await api.get(`/doctors/${id}`);
    return response.data as any;
  },

  async createDoctor(doctorData: CreateDoctorDto) {
    const response = await api.post('/doctors', doctorData);
    return response.data as Doctor;
  },

  async updateDoctor(id: number, doctorData: UpdateDoctorDto) {
    const response = await api.patch(`/doctors/${id}`, doctorData);
    return response.data as Doctor;
  },

  async deleteDoctor(id: number) {
    await api.delete(`/doctors/${id}`);
  },

  // Availability
  async setAvailability(id: number, isAvailable: boolean) {
    const response = await api.patch(`/doctors/${id}/availability`, { isAvailable });
    return response.data as Doctor;
  },

  // Schedules under doctor
  async getDoctorSchedules(doctorId: number) {
    const response = await api.get(`/doctors/${doctorId}/schedules`);
    return response.data as Schedule[];
  },

  async createSchedule(doctorId: number, scheduleData: CreateScheduleDto) {
    const response = await api.post(`/doctors/${doctorId}/schedules`, scheduleData);
    return response.data as Schedule;
  },

  async getAvailableDoctors(params: { date: string; departmentId?: number }) {
    const response = await api.get('/doctors/available', { params });
    return response.data as any;
  },
};