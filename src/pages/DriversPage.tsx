import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { SearchInput } from '../components/SearchInput';
import { StatusBadge } from '../components/StatusBadge';
import type { DriverFormValues } from '../features/drivers/components/DriverForm';
import { DriverForm } from '../features/drivers/components/DriverForm';
import { useCreateDriver, useDrivers } from '../hooks/useDrivers';
import { formatDate } from '../lib/format';

export function DriversPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'all'>('active');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const drivers = useDrivers({ search: search || undefined, phone: phone || undefined, status });
  const createDriver = useCreateDriver();

  async function handleCreate(values: DriverFormValues) {
    setFormError(null);
    try {
      await createDriver.mutateAsync(values);
      setIsAddOpen(false);
    } catch {
      setFormError('Could not save driver. Check for duplicate phone/license/ID values.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500">Manage driver records</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          type="button"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Driver
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search by name…" value={search} onChange={setSearch} />
        <SearchInput placeholder="Search by phone…" value={phone} onChange={setPhone} />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as 'active' | 'all')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
        >
          <option value="active">Active only</option>
          <option value="all">All (incl. archived)</option>
        </select>
      </div>

      <DataTable
        isLoading={drivers.isLoading}
        data={drivers.data?.data ?? []}
        rowKey={(driver) => driver.id}
        emptyMessage="No drivers found."
        onRowClick={(driver) => navigate(`/drivers/${driver.id}`)}
        columns={[
          { key: 'name', header: 'Full Name', render: (d) => d.fullName },
          { key: 'phone', header: 'Phone', render: (d) => d.phoneNumber },
          { key: 'license', header: 'License No.', render: (d) => d.licenseNumber },
          { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
          { key: 'created', header: 'Created', render: (d) => formatDate(d.createdAt) },
        ]}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Driver">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <DriverForm onSubmit={handleCreate} onCancel={() => setIsAddOpen(false)} submitLabel="Create" />
      </Modal>
    </div>
  );
}
