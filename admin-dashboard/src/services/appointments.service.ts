import { api } from './api';
import { Appointment } from '@/types';

export const appointmentsService = {
  async getAppointments(params?: Record<string, any>) {
    const response = await api.get('/appointments', { params });
    return response.data as any;
  },

  async getAppointmentById(id: number) {
    const response = await api.get(`/appointments/${id}`);
    return response.data as Appointment;
  },

  async createAppointment(appointmentData: Partial<Appointment>) {
    const response = await api.post('/appointments', appointmentData);
    return response.data as Appointment;
  },

  async updateAppointment(id: number, appointmentData: Partial<Appointment>) {
    const response = await api.patch(`/appointments/${id}`, appointmentData);
    return response.data as Appointment;
  },

  async deleteAppointment(id: number) {
    await api.delete(`/appointments/${id}`);
  },

  // Actions
  async cancel(id: number, reason?: string) {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data as Appointment;
  },

  async confirm(id: number) {
    const response = await api.patch(`/appointments/${id}/confirm`);
    return response.data as Appointment;
  },

  async complete(id: number) {
    const response = await api.patch(`/appointments/${id}/complete`);
    return response.data as Appointment;
  },

  async getAvailableSlots(doctorId: number, date: string) {
    const response = await api.get(`/appointments/available-slots/${doctorId}`, { params: { date } });
    return response.data as any;
  },
};