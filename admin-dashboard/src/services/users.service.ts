import { api } from './api';
import { User, Patient, Doctor, Admin, PaginatedResponse, QueryParams } from '@/types';

export const usersService = {
  // Get all users with pagination and filtering
  async getUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get a specific user by ID
  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update an existing user
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete a user
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Update user status (active/inactive)
  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },

  // Get all patients
  async getPatients(params?: QueryParams): Promise<PaginatedResponse<Patient>> {
    const response = await api.get('/users/patients', { params });
    return response.data;
  },

  // Get all doctors
  async getDoctors(params?: QueryParams): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get('/users/doctors', { params });
    return response.data;
  },

  // Get all admins
  async getAdmins(params?: QueryParams): Promise<PaginatedResponse<Admin>> {
    const response = await api.get('/users/admins', { params });
    return response.data;
  },

  // Search users
  async searchUsers(query: string, params?: QueryParams): Promise<PaginatedResponse<User>> {
    const response = await api.get('/users/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  },

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    patients: number;
    doctors: number;
    admins: number;
  }> {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Bulk operations
  async bulkUpdateUsers(updates: Array<{ id: number; data: Partial<User> }>): Promise<User[]> {
    const response = await api.patch('/users/bulk', { updates });
    return response.data;
  },

  async bulkDeleteUsers(ids: number[]): Promise<void> {
    await api.delete('/users/bulk', { data: { ids } });
  },

  // Export users
  async exportUsers(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await api.get('/users/export', { 
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};