import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { SearchInput } from '../components/SearchInput';
import { StatusBadge } from '../components/StatusBadge';
import type { VehicleFormValues } from '../features/vehicles/components/VehicleForm';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useCreateVehicle, useVehicles } from '../hooks/useVehicles';
import { formatCurrency } from '../lib/format';

const STATUS_OPTIONS = ['active', 'inactive', 'completed', 'all'] as const;

export function VehiclesPage() {
  const navigate = useNavigate();
  const [plateNumber, setPlateNumber] = useState('');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('active');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const vehicles = useVehicles({ plateNumber: plateNumber || undefined, status });
  const createVehicle = useCreateVehicle();

  async function handleCreate(values: VehicleFormValues) {
    setFormError(null);
    try {
      await createVehicle.mutateAsync(values);
      setIsAddOpen(false);
    } catch {
      setFormError('Could not save vehicle. Check for duplicate vehicle/plate number.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500">Manage fleet vehicles and repayment contracts</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          type="button"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Vehicle
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search by plate number…" value={plateNumber} onChange={setPlateNumber} />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as (typeof STATUS_OPTIONS)[number])}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        isLoading={vehicles.isLoading}
        data={vehicles.data?.data ?? []}
        rowKey={(vehicle) => vehicle.id}
        emptyMessage="No vehicles found."
        onRowClick={(vehicle) => navigate(`/vehicles/${vehicle.id}`)}
        columns={[
          { key: 'plate', header: 'Plate Number', render: (v) => v.plateNumber },
          { key: 'driver', header: 'Driver', render: (v) => v.driver?.fullName ?? 'Unassigned' },
          { key: 'weekly', header: 'Weekly Payment', render: (v) => formatCurrency(v.weeklyExpectedPayment) },
          { key: 'total', header: 'Total Expected', render: (v) => formatCurrency(v.totalExpectedReturn) },
          { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
        ]}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Vehicle">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <VehicleForm onSubmit={handleCreate} onCancel={() => setIsAddOpen(false)} submitLabel="Create" />
      </Modal>
    </div>
  );
}
