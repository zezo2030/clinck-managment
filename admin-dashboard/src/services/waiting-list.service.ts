import { api } from './api';

export const waitingListService = {
  get: (doctorId?: number) =>
    api.get('/waiting-list', { params: { doctorId } }).then((r: any) => r.data),
  add: (dto: { patientId: number; doctorId: number; departmentId?: number; priority?: number }) =>
    api.post('/waiting-list', dto).then((r: any) => r.data),
  notifyNext: (doctorId: number, date: string, time: string) =>
    api
      .get('/waiting-list/notify-next', { params: { doctorId, date, time } })
      .then((r: any) => r.data),
  remove: (id: number) => api.delete(`/waiting-list/${id}`),
  updatePriority: (id: number, priority: number) =>
    api.patch(`/waiting-list/${id}/priority`, { priority }).then((r: any) => r.data),
};


