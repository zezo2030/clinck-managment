import { api } from './api';
import { User } from '@/types';

export const usersService = {
  async getUsers(params?: Record<string, any>) {
    const response = await api.get('/users', { params });
    return response.data as any;
  },

  async getUserById(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data as any;
  },

  async createUser(userData: Partial<User>) {
    const response = await api.post('/users', userData);
    return response.data as any;
  },

  async updateUser(id: number, userData: Partial<User>) {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data as any;
  },

  async deleteUser(id: number) {
    await api.delete(`/users/${id}`);
  },
};