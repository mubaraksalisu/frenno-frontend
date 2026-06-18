import { apiClient } from './client';
import type { PaginatedResponse, Vehicle, VehicleWithProgress } from './types';

export interface VehicleQueryParams {
  plateNumber?: string;
  status?: string;
  driverId?: string;
  page?: number;
  limit?: number;
}

export interface VehicleInput {
  vehicleNumber: string;
  plateNumber: string;
  vehicleType: string;
  model: string;
  year: number;
  contractDurationWeeks?: number;
  weeklyExpectedPayment: number;
}

export interface AssignDriverInput {
  driverId: string;
  contractStartDate?: string;
}

export async function getVehicles(params: VehicleQueryParams): Promise<PaginatedResponse<Vehicle>> {
  const { data } = await apiClient.get<PaginatedResponse<Vehicle>>('/vehicles', { params });
  return data;
}

export async function getVehicle(id: string): Promise<VehicleWithProgress> {
  const { data } = await apiClient.get<VehicleWithProgress>(`/vehicles/${id}`);
  return data;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.post<Vehicle>('/vehicles', input);
  return data;
}

export async function updateVehicle(id: string, input: Partial<VehicleInput>): Promise<Vehicle> {
  const { data } = await apiClient.patch<Vehicle>(`/vehicles/${id}`, input);
  return data;
}

export async function assignDriver(id: string, input: AssignDriverInput): Promise<Vehicle> {
  const { data } = await apiClient.patch<Vehicle>(`/vehicles/${id}/assign-driver`, input);
  return data;
}

export async function deleteVehicle(id: string): Promise<Vehicle> {
  const { data } = await apiClient.delete<Vehicle>(`/vehicles/${id}`);
  return data;
}

export async function getNextWeekNumber(id: string): Promise<{ suggestedWeekNumber: number }> {
  const { data } = await apiClient.get<{ suggestedWeekNumber: number }>(`/vehicles/${id}/next-week-number`);
  return data;
}
