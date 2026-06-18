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
    await deleteDriver.mutateAsync(id);
    setIsDeleteOpen(false);
    navigate('/drivers');
  }

  if (driver.isLoading || !driver.data) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  const data = driver.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
        <DriverForm defaultValues={data} onSubmit={handleUpdate} onCancel={() => setIsEditOpen(false)} submitLabel="Save" />
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
