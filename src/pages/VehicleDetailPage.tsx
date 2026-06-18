import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import { useDrivers } from '../hooks/useDrivers';
import type { AssignDriverFormValues } from '../features/vehicles/components/AssignDriverForm';
import { AssignDriverForm } from '../features/vehicles/components/AssignDriverForm';
import type { VehicleFormValues } from '../features/vehicles/components/VehicleForm';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import type { PaymentFormValues } from '../features/payments/components/PaymentForm';
import { PaymentForm } from '../features/payments/components/PaymentForm';
import { useAssignDriver, useDeleteVehicle, useNextWeekNumber, useUpdateVehicle, useVehicle } from '../hooks/useVehicles';
import { useCreatePayment, usePayments } from '../hooks/usePayments';
import { formatCurrency, formatDate } from '../lib/format';
import { Skeleton } from '../components/Skeleton';

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const vehicle = useVehicle(id);
  const updateVehicle = useUpdateVehicle(id ?? '');
  const assignDriver = useAssignDriver(id ?? '');
  const deleteVehicle = useDeleteVehicle();
  const createPayment = useCreatePayment();
  const nextWeekNumber = useNextWeekNumber(id);
  const activeDrivers = useDrivers({ status: 'active', limit: 200 });
  const payments = usePayments({ vehicleId: id });

  async function handleUpdate(values: VehicleFormValues) {
    setFormError(null);
    try {
      await updateVehicle.mutateAsync(values);
      setIsEditOpen(false);
    } catch {
      setFormError('Could not save changes. Check for duplicate vehicle/plate number.');
    }
  }

  async function handleAssign(values: AssignDriverFormValues) {
    setFormError(null);
    try {
      await assignDriver.mutateAsync({ driverId: values.driverId, contractStartDate: values.contractStartDate || undefined });
      setIsAssignOpen(false);
    } catch {
      setFormError('Could not assign driver.');
    }
  }

  async function handleAddPayment(values: PaymentFormValues) {
    setFormError(null);
    try {
      await createPayment.mutateAsync(values);
      setIsAddPaymentOpen(false);
    } catch {
      setFormError('Could not save payment.');
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteVehicle.mutateAsync(id);
      setIsDeleteOpen(false);
      navigate('/vehicles');
    } catch {
      // Global mutation error toast already shown; keep the confirm dialog open so the admin can retry.
    }
  }

  if (vehicle.isLoading || !vehicle.data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-5 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-5 w-48" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-3 w-full" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <DataTable
          isLoading
          data={[]}
          rowKey={() => ''}
          columns={[
            { key: 'week', header: 'Week', render: () => null },
            { key: 'amount', header: 'Amount', render: () => null },
            { key: 'date', header: 'Date', render: () => null },
            { key: 'notes', header: 'Notes', render: () => null },
          ]}
        />
      </div>
    );
  }

  const data = vehicle.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{data.plateNumber}</h1>
          <StatusBadge status={data.status} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            type="button"
            disabled={deleteVehicle.isPending}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Delete Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <Info label="Vehicle Number" value={data.vehicleNumber} />
        <Info label="Vehicle Type" value={data.vehicleType} />
        <Info label="Model" value={data.model} />
        <Info label="Year" value={String(data.year)} />
        <Info label="Contract Duration" value={`${data.contractDurationWeeks} weeks`} />
        <Info label="Contract Start" value={data.contractStartDate ? formatDate(data.contractStartDate) : 'Not started'} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Driver</h2>
        {data.driver ? (
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/drivers/${data.driver.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                {data.driver.fullName}
              </Link>
              <p className="text-xs text-gray-400">{data.driver.phoneNumber}</p>
            </div>
            <button
              onClick={() => setIsAssignOpen(true)}
              type="button"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reassign
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">No driver assigned.</p>
            <button
              onClick={() => setIsAssignOpen(true)}
              type="button"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Assign Driver
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Repayment Progress</h2>
          {data.isBehindSchedule && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              Behind schedule — deficit {formatCurrency(data.deficit)}
            </span>
          )}
        </div>
        <ProgressBar percentage={data.completionPercentage} />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Total Paid" value={formatCurrency(data.totalPaid)} />
          <Stat label="Total Expected" value={formatCurrency(data.totalExpectedReturn)} />
          <Stat label="Remaining Balance" value={formatCurrency(data.remainingBalance)} />
          <Stat label="Completion" value={`${data.completionPercentage.toFixed(1)}%`} />
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Payments</h2>
          <button
            onClick={() => setIsAddPaymentOpen(true)}
            type="button"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Add Payment
          </button>
        </div>
        <DataTable
          isLoading={payments.isLoading}
          data={payments.data?.data ?? []}
          rowKey={(payment) => payment.id}
          emptyMessage="No payments recorded for this vehicle yet."
          columns={[
            { key: 'week', header: 'Week', render: (p) => p.weekNumber },
            { key: 'amount', header: 'Amount', render: (p) => formatCurrency(p.amountPaid) },
            { key: 'date', header: 'Date', render: (p) => formatDate(p.paymentDate) },
            { key: 'notes', header: 'Notes', render: (p) => p.notes ?? '—' },
          ]}
        />
      </section>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Vehicle">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <VehicleForm defaultValues={data} onSubmit={handleUpdate} onCancel={() => setIsEditOpen(false)} submitLabel="Save" />
      </Modal>

      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Driver">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <AssignDriverForm
          drivers={activeDrivers.data?.data ?? []}
          onSubmit={handleAssign}
          onCancel={() => setIsAssignOpen(false)}
        />
      </Modal>

      <Modal isOpen={isAddPaymentOpen} onClose={() => setIsAddPaymentOpen(false)} title="Add Payment">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <PaymentForm
          lockedVehicleId={id}
          defaultValues={{ weekNumber: nextWeekNumber.data?.suggestedWeekNumber ?? 1 }}
          onSubmit={handleAddPayment}
          onCancel={() => setIsAddPaymentOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete vehicle?"
        message={`This will archive ${data.plateNumber}. It will no longer appear in the active vehicles list.`}
        confirmLabel="Delete"
        isLoading={deleteVehicle.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}
