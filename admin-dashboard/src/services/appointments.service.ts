import { api } from './api';
import { Appointment, PaginatedResponse, QueryParams } from '@/types';

export const appointmentsService = {
  // Get all appointments with pagination and filtering
  async getAppointments(params?: QueryParams): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get a specific appointment by ID
  async getAppointmentById(id: number): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create a new appointment
  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update an existing appointment
  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete an appointment
  async deleteAppointment(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  // Update appointment status
  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Get appointments by doctor
  async getAppointmentsByDoctor(doctorId: number, params?: QueryParams): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get(`/appointments/doctor/${doctorId}`, { params });
    return response.data;
  },

  // Get appointments by patient
  async getAppointmentsByPatient(patientId: number, params?: QueryParams): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get(`/appointments/patient/${patientId}`, { params });
    return response.data;
  },

  // Get appointments by clinic
  async getAppointmentsByClinic(clinicId: number, params?: QueryParams): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get(`/appointments/clinic/${clinicId}`, { params });
    return response.data;
  },

  // Search appointments
  async searchAppointments(query: string, params?: QueryParams): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get('/appointments/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get appointment statistics
  async getAppointmentStats(): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    byStatus: Record<string, number>;
    byMonth: Array<{ month: string; count: number }>;
  }> {
    const response = await api.get('/appointments/stats');
    return response.data;
  }
};