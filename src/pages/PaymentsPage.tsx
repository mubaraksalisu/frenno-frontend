import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import type { PaymentFormValues } from '../features/payments/components/PaymentForm';
import { PaymentForm } from '../features/payments/components/PaymentForm';
import { useCreatePayment, useDeletePayment, usePayments } from '../hooks/usePayments';
import { useVehicles } from '../hooks/useVehicles';
import { formatCurrency, formatDate } from '../lib/format';
import type { Payment } from '../api/types';

export function PaymentsPage() {
  const [vehicleId, setVehicleId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const vehicles = useVehicles({ status: 'all', limit: 200 });
  const payments = usePayments({
    vehicleId: vehicleId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });
  const createPayment = useCreatePayment();
  const deletePayment = useDeletePayment();

  const payableVehicles = (vehicles.data?.data ?? []).filter((vehicle) => vehicle.status !== 'inactive');

  async function handleCreate(values: PaymentFormValues) {
    setFormError(null);
    try {
      await createPayment.mutateAsync(values);
      setIsAddOpen(false);
    } catch {
      setFormError('Could not save payment.');
    }
  }

  async function handleDelete() {
    if (!paymentToDelete) return;
    try {
      await deletePayment.mutateAsync({ id: paymentToDelete.id, vehicleId: paymentToDelete.vehicleId });
      setPaymentToDelete(null);
    } catch {
      // Global mutation error toast already shown; keep the confirm dialog open so the admin can retry.
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">All weekly repayments across the fleet</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          type="button"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Payment
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={vehicleId}
          onChange={(event) => setVehicleId(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        >
          <option value="">All vehicles</option>
          {(vehicles.data?.data ?? []).map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plateNumber}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        />
        <span className="text-sm text-gray-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        />
      </div>

      <DataTable
        isLoading={payments.isLoading}
        data={payments.data?.data ?? []}
        rowKey={(payment) => payment.id}
        emptyMessage="No payments found."
        columns={[
          { key: 'week', header: 'Week', render: (p) => p.weekNumber },
          { key: 'amount', header: 'Amount', render: (p) => formatCurrency(p.amountPaid) },
          { key: 'date', header: 'Date', render: (p) => formatDate(p.paymentDate) },
          { key: 'notes', header: 'Notes', render: (p) => p.notes ?? '—' },
          {
            key: 'actions',
            header: '',
            render: (p) => (
              <button
                onClick={() => setPaymentToDelete(p)}
                type="button"
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            ),
          },
        ]}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Payment">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <PaymentForm vehicles={payableVehicles} onSubmit={handleCreate} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(paymentToDelete)}
        title="Delete payment?"
        message="This permanently removes the payment record. This cannot be undone."
        confirmLabel="Delete"
        isLoading={deletePayment.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPaymentToDelete(null)}
      />
    </div>
  );
}
