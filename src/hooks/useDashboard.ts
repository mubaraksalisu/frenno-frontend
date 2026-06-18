import { useQuery } from '@tanstack/react-query';
import {
  getBehindScheduleVehicles,
  getCompletedVehicles,
  getDashboardSummary,
  getRecentPayments,
} from '../api/dashboard.api';

export function useDashboardSummary() {
  return useQuery({ queryKey: ['dashboard', 'summary'], queryFn: getDashboardSummary });
}

export function useRecentPayments(limit = 10) {
  return useQuery({ queryKey: ['dashboard', 'recent-payments', limit], queryFn: () => getRecentPayments(limit) });
}

export function useBehindScheduleVehicles() {
  return useQuery({ queryKey: ['dashboard', 'behind-schedule'], queryFn: getBehindScheduleVehicles });
}

export function useCompletedVehicles() {
  return useQuery({ queryKey: ['dashboard', 'completed'], queryFn: getCompletedVehicles });
}
