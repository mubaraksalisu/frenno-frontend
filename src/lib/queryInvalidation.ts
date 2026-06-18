import type { QueryClient } from '@tanstack/react-query';

export function invalidateDashboard(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}

export function invalidateDriversList(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['drivers', 'list'] });
}

export function invalidateDriverDetail(queryClient: QueryClient, driverId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['drivers', 'detail', driverId] });
}

export function invalidateVehiclesList(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['vehicles', 'list'] });
}

export function invalidateVehicleDetail(queryClient: QueryClient, vehicleId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['vehicles', 'detail', vehicleId] });
}

export function invalidateNextWeekNumber(queryClient: QueryClient, vehicleId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['vehicles', 'next-week-number', vehicleId] });
}

export function invalidatePaymentsList(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });
}

export function invalidateUsersList(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
}
