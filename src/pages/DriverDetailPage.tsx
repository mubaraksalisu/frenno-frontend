import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import type { DriverFormValues } from '../features/drivers/components/DriverForm';
import { DriverForm } from '../features/drivers/components/DriverForm';
import { useDeleteDriver, useDriver, useUpdateDriver } from '../hooks/useDrivers';
import { formatCurrency } from '../lib/format';
import { getErrorMessage } from '../lib/errors';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const driver = useDriver(id);
  const updateDriver = useUpdateDriver(id ?? '');
  const deleteDriver = useDeleteDriver();

  async function handleUpdate(values: DriverFormValues) {
    setFormError(null);
    try {
      await updateDriver.mutateAsync(values);
      setIsEditOpen(false);
    } catch {
      setFormError('Could not save changes. Check for duplicate phone/license/ID values.');
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteDriver.mutateAsync(id);
      setIsDeleteOpen(false);
      navigate('/drivers');
    } catch {
      // Global mutation error toast already shown; keep the confirm dialog open so the admin can retry.
    }
  }

  if (driver.isError) {
    return (
      <ErrorState
        message={getErrorMessage(driver.error)}
        actionLabel="Back to Drivers"
        onAction={() => navigate('/drivers')}
      />
    );
  }

  if (driver.isLoading || !driver.data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-5 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
        <DataTable
          isLoading
          data={[]}
          rowKey={() => ''}
          columns={[
            { key: 'plate', header: 'Plate Number', render: () => null },
            { key: 'model', header: 'Model', render: () => null },
            { key: 'weekly', header: 'Weekly Payment', render: () => null },
            { key: 'status', header: 'Status', render: () => null },
          ]}
        />
      </div>
    );
  }

  const data = driver.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{data.fullName}</h1>
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
            disabled={deleteDriver.isPending}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Delete Driver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <Info label="Phone Number" value={data.phoneNumber} />
        <Info label="Address" value={data.address} />
        <Info label="Date of Birth" value={data.dateOfBirth} />
        <Info label="License Number" value={data.licenseNumber} />
        <Info label="Identification Number" value={data.identificationNumber} />
        <Info label="Guarantor" value={`${data.guarantorName} (${data.guarantorPhone})`} />
        <Info label="Guarantor Address" value={data.guarantorAddress ?? '—'} />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Vehicles</h2>
        <DataTable
          data={data.vehicles ?? []}
          rowKey={(vehicle) => vehicle.id}
          emptyMessage="No vehicles assigned to this driver."
          onRowClick={(vehicle) => navigate(`/vehicles/${vehicle.id}`)}
          columns={[
            { key: 'plate', header: 'Plate Number', render: (v) => v.plateNumber },
            { key: 'model', header: 'Model', render: (v) => v.model },
            { key: 'weekly', header: 'Weekly Payment', render: (v) => formatCurrency(v.weeklyExpectedPayment) },
            { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
          ]}
        />
      </section>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Driver">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <DriverForm
          defaultValues={{ ...data, guarantorAddress: data.guarantorAddress ?? '' }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditOpen(false)}
          submitLabel="Save"
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete driver?"
        message={`This will archive ${data.fullName}. They will no longer appear in the active drivers list.`}
        confirmLabel="Delete"
        isLoading={deleteDriver.isPending}
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
