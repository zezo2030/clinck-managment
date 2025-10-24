import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/types';

export const useApi = <TData = unknown, TError = ApiError>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useApiMutation = <TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useOptimisticUpdate = <TData = unknown, TVariables = unknown>(
  queryKey: string[],
  mutationFn: (variables: TVariables) => Promise<TData>,
  optimisticUpdate: (oldData: TData | undefined, variables: TVariables) => TData
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: TData | undefined) =>
        optimisticUpdate(old, variables)
      );

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

