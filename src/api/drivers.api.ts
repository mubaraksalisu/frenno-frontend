import { apiClient } from './client';
import type { Driver, PaginatedResponse } from './types';

export interface DriverQueryParams {
  search?: string;
  phone?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface DriverInput {
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  licenseNumber: string;
  identificationNumber: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorAddress: string;
}

export async function getDrivers(params: DriverQueryParams): Promise<PaginatedResponse<Driver>> {
  const { data } = await apiClient.get<PaginatedResponse<Driver>>('/drivers', { params });
  return data;
}

export async function getDriver(id: string): Promise<Driver> {
  const { data } = await apiClient.get<Driver>(`/drivers/${id}`);
  return data;
}

export async function createDriver(input: DriverInput): Promise<Driver> {
  const { data } = await apiClient.post<Driver>('/drivers', input);
  return data;
}

export async function updateDriver(id: string, input: Partial<DriverInput>): Promise<Driver> {
  const { data } = await apiClient.patch<Driver>(`/drivers/${id}`, input);
  return data;
}

export async function deleteDriver(id: string): Promise<Driver> {
  const { data } = await apiClient.delete<Driver>(`/drivers/${id}`);
  return data;
}
