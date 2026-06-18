import { apiClient } from './client';
import type { AdminUser } from './types';

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
}

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<AdminUser[]>('/users');
  return data;
}

export async function createUser(input: CreateAdminInput): Promise<AdminUser> {
  const { data } = await apiClient.post<AdminUser>('/users', input);
  return data;
}
