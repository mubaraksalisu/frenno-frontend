import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DriverInput, DriverQueryParams } from '../api/drivers.api';
import { createDriver, deleteDriver, getDriver, getDrivers, updateDriver } from '../api/drivers.api';
import { invalidateDashboard, invalidateDriverDetail, invalidateDriversList } from '../lib/queryInvalidation';

export function useDrivers(params: DriverQueryParams) {
  return useQuery({ queryKey: ['drivers', 'list', params], queryFn: () => getDrivers(params) });
}

export function useDriver(id: string | undefined) {
  return useQuery({
    queryKey: ['drivers', 'detail', id],
    queryFn: () => getDriver(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DriverInput) => createDriver(input),
    meta: { suppressErrorToast: true },
    onSuccess: () => {
      invalidateDriversList(queryClient);
      invalidateDashboard(queryClient);
    },
  });
}

export function useUpdateDriver(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<DriverInput>) => updateDriver(id, input),
    meta: { suppressErrorToast: true },
    onSuccess: () => {
      invalidateDriversList(queryClient);
      invalidateDriverDetail(queryClient, id);
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: (_data, id) => {
      invalidateDriversList(queryClient);
      invalidateDriverDetail(queryClient, id);
    },
  });
}
