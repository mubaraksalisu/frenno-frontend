import { apiClient } from './client';
import type { DashboardSummary, RecentPayment, VehicleWithProgress } from './types';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getRecentPayments(limit = 10): Promise<RecentPayment[]> {
  const { data } = await apiClient.get<RecentPayment[]>('/dashboard/recent-payments', { params: { limit } });
  return data;
}

export async function getBehindScheduleVehicles(): Promise<VehicleWithProgress[]> {
  const { data } = await apiClient.get<VehicleWithProgress[]>('/dashboard/behind-schedule');
  return data;
}

export async function getCompletedVehicles(): Promise<VehicleWithProgress[]> {
  const { data } = await apiClient.get<VehicleWithProgress[]>('/dashboard/completed');
  return data;
}
