import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import type { AdminFormValues } from '../features/users/components/AdminForm';
import { AdminForm } from '../features/users/components/AdminForm';
import { useCreateUser, useUsers } from '../hooks/useUsers';
import { formatDate } from '../lib/format';

export function AdminsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const users = useUsers();
  const createUser = useCreateUser();

  async function handleCreate(values: AdminFormValues) {
    setFormError(null);
    try {
      await createUser.mutateAsync(values);
      setIsAddOpen(false);
    } catch {
      setFormError('Could not create admin. Check for a duplicate email.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admins</h1>
          <p className="text-sm text-gray-500">Everyone here receives the weekly fleet report</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          type="button"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Admin
        </button>
      </div>

      <DataTable
        isLoading={users.isLoading}
        data={users.data ?? []}
        rowKey={(user) => user.id}
        emptyMessage="No admins found."
        columns={[
          { key: 'name', header: 'Name', render: (u) => u.name },
          { key: 'email', header: 'Email', render: (u) => u.email },
          { key: 'created', header: 'Created', render: (u) => formatDate(u.createdAt) },
        ]}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Admin">
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <AdminForm onSubmit={handleCreate} onCancel={() => setIsAddOpen(false)} />
      </Modal>
    </div>
  );
}
