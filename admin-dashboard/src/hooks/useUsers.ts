import { useApi, useApiMutation } from './useApi';
import { usersService } from '@/services';
import { User, Patient, Doctor, Admin, PaginatedResponse, QueryParams } from '@/types';

export const useUsers = (params?: QueryParams) => {
  return useApi(
    ['users', params],
    () => usersService.getUsers(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useUser = (id: number) => {
  return useApi(
    ['users', id],
    () => usersService.getUserById(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateUser = () => {
  return useApiMutation(
    (userData: Partial<User>) => usersService.createUser(userData),
    {
      onSuccess: () => {
        // Invalidate users list
      },
    }
  );
};

export const useUpdateUser = () => {
  return useApiMutation(
    ({ id, userData }: { id: number; userData: Partial<User> }) =>
      usersService.updateUser(id, userData),
    {
      onSuccess: (data, { id }) => {
        // Update the specific user in cache
      },
    }
  );
};

export const useDeleteUser = () => {
  return useApiMutation(
    (id: number) => usersService.deleteUser(id),
    {
      onSuccess: () => {
        // Invalidate users list
      },
    }
  );
};

export const useUpdateUserStatus = () => {
  return useApiMutation(
    ({ id, isActive }: { id: number; isActive: boolean }) =>
      usersService.updateUserStatus(id, isActive),
    {
      onSuccess: (data, { id }) => {
        // Update the specific user in cache
      },
    }
  );
};

export const usePatients = (params?: QueryParams) => {
  return useApi(
    ['users', 'patients', params],
    () => usersService.getPatients(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useDoctors = (params?: QueryParams) => {
  return useApi(
    ['users', 'doctors', params],
    () => usersService.getDoctors(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useAdmins = (params?: QueryParams) => {
  return useApi(
    ['users', 'admins', params],
    () => usersService.getAdmins(params),
    {
      keepPreviousData: true,
    }
  );
};

