import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaymentInput, PaymentQueryParams } from '../api/payments.api';
import { createPayment, deletePayment, getPayments } from '../api/payments.api';
import {
  invalidateDashboard,
  invalidateNextWeekNumber,
  invalidatePaymentsList,
  invalidateVehicleDetail,
} from '../lib/queryInvalidation';

export function usePayments(params: PaymentQueryParams) {
  return useQuery({ queryKey: ['payments', 'list', params], queryFn: () => getPayments(params) });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentInput) => createPayment(input),
    onSuccess: (payment) => {
      invalidatePaymentsList(queryClient);
      invalidateVehicleDetail(queryClient, payment.vehicleId);
      invalidateNextWeekNumber(queryClient, payment.vehicleId);
      invalidateDashboard(queryClient);
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; vehicleId: string }) => deletePayment(id),
    onSuccess: (_data, variables) => {
      invalidatePaymentsList(queryClient);
      invalidateVehicleDetail(queryClient, variables.vehicleId);
      invalidateNextWeekNumber(queryClient, variables.vehicleId);
      invalidateDashboard(queryClient);
    },
  });
}
