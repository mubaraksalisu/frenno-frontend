import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AssignDriverInput, VehicleInput, VehicleQueryParams } from '../api/vehicles.api';
import {
  assignDriver,
  createVehicle,
  deleteVehicle,
  getNextWeekNumber,
  getVehicle,
  getVehicles,
  updateVehicle,
} from '../api/vehicles.api';
import {
  invalidateDashboard,
  invalidateDriverDetail,
  invalidateVehicleDetail,
  invalidateVehiclesList,
} from '../lib/queryInvalidation';

export function useVehicles(params: VehicleQueryParams) {
  return useQuery({ queryKey: ['vehicles', 'list', params], queryFn: () => getVehicles(params) });
}

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: ['vehicles', 'detail', id],
    queryFn: () => getVehicle(id as string),
    enabled: Boolean(id),
  });
}

export function useNextWeekNumber(id: string | undefined) {
  return useQuery({
    queryKey: ['vehicles', 'next-week-number', id],
    queryFn: () => getNextWeekNumber(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VehicleInput) => createVehicle(input),
    onSuccess: () => {
      invalidateVehiclesList(queryClient);
      invalidateDashboard(queryClient);
    },
  });
}

export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<VehicleInput>) => updateVehicle(id, input),
    onSuccess: () => {
      invalidateVehiclesList(queryClient);
      invalidateVehicleDetail(queryClient, id);
      invalidateDashboard(queryClient);
    },
  });
}

export function useAssignDriver(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignDriverInput) => assignDriver(id, input),
    onSuccess: (vehicle) => {
      invalidateVehiclesList(queryClient);
      invalidateVehicleDetail(queryClient, id);
      invalidateDashboard(queryClient);
      if (vehicle.driverId) {
        invalidateDriverDetail(queryClient, vehicle.driverId);
      }
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: (vehicle, id) => {
      invalidateVehiclesList(queryClient);
      invalidateVehicleDetail(queryClient, id);
      invalidateDashboard(queryClient);
      if (vehicle.driverId) {
        invalidateDriverDetail(queryClient, vehicle.driverId);
      }
    },
  });
}
