import { apiClient } from './client';
import type { PaginatedResponse, Payment } from './types';

export interface PaymentQueryParams {
  vehicleId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaymentInput {
  vehicleId: string;
  weekNumber: number;
  amountPaid: number;
  paymentDate: string;
  notes?: string;
}

export async function getPayments(params: PaymentQueryParams): Promise<PaginatedResponse<Payment>> {
  const { data } = await apiClient.get<PaginatedResponse<Payment>>('/payments', { params });
  return data;
}

export async function createPayment(input: PaymentInput): Promise<Payment> {
  const { data } = await apiClient.post<Payment>('/payments', input);
  return data;
}

export async function deletePayment(id: string): Promise<void> {
  await apiClient.delete(`/payments/${id}`);
}
