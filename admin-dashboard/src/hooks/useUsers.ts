import { useApi, useApiMutation } from './useApi';
import { usersService } from '@/services';
import { User } from '@/types';

export const useUsers = (params?: Record<string, any>) => {
  return useApi(
    ['users', params as any],
    () => usersService.getUsers(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useUser = (id: number) => {
  return useApi(
    ['users', id as any],
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

