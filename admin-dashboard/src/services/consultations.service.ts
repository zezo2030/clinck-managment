import { api } from './api';
import { Consultation } from '@/types';

export const consultationsService = {
  async getConsultations(params?: { patientId?: number; doctorId?: number }) {
    const response = await api.get('/consultations', { params });
    return response.data as any;
  },

  async getConsultationById(id: number) {
    const response = await api.get(`/consultations/${id}`);
    return response.data as Consultation;
  },

  async createConsultation(consultationData: Partial<Consultation>) {
    const response = await api.post('/consultations', consultationData);
    return response.data as Consultation;
  },

  async start(id: number, dto: any) {
    const response = await api.patch(`/consultations/${id}/start`, dto);
    return response.data as Consultation;
  },

  async end(id: number, dto: any) {
    const response = await api.patch(`/consultations/${id}/end`, dto);
    return response.data as Consultation;
  },

  async cancel(id: number) {
    const response = await api.patch(`/consultations/${id}/cancel`);
    return response.data as Consultation;
  },

  async getMessages(id: number) {
    const response = await api.get(`/consultations/${id}/messages`);
    return response.data as any;
  },

  async sendMessage(id: number, body: { message: string; messageType?: string; fileUrl?: string }) {
    const response = await api.post(`/consultations/${id}/messages`, body);
    return response.data as any;
  },
};