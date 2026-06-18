import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../components/FormField';
import type { Driver } from '../../../api/types';

const assignDriverSchema = z.object({
  driverId: z.string().min(1, 'Select a driver'),
  contractStartDate: z.string().optional().or(z.literal('')),
});

export type AssignDriverFormValues = z.infer<typeof assignDriverSchema>;

const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none';

interface AssignDriverFormProps {
  drivers: Driver[];
  onSubmit: (values: AssignDriverFormValues) => Promise<void>;
  onCancel: () => void;
}

export function AssignDriverForm({ drivers, onSubmit, onCancel }: AssignDriverFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignDriverFormValues>({ resolver: zodResolver(assignDriverSchema) });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Driver" error={errors.driverId?.message}>
        <select className={inputClass} {...register('driverId')}>
          <option value="">Select a driver…</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.fullName} ({driver.phoneNumber})
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Contract Start Date (optional, defaults to today)" error={errors.contractStartDate?.message}>
        <input type="date" className={inputClass} {...register('contractStartDate')} />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Assigning…' : 'Assign'}
        </button>
      </div>
    </form>
  );
}
