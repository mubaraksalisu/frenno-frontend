import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../components/FormField';
import type { Vehicle } from '../../../api/types';

const paymentSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  weekNumber: z.number().int().min(1, 'Must be at least 1'),
  amountPaid: z.number().positive('Must be a positive number'),
  paymentDate: z.string().min(1, 'Required'),
  notes: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none';

interface PaymentFormProps {
  vehicles?: Vehicle[];
  lockedVehicleId?: string;
  defaultValues?: Partial<PaymentFormValues>;
  onSubmit: (values: PaymentFormValues) => Promise<void>;
  onCancel: () => void;
}

export function PaymentForm({ vehicles, lockedVehicleId, defaultValues, onSubmit, onCancel }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { vehicleId: lockedVehicleId, paymentDate: new Date().toISOString().slice(0, 10), ...defaultValues },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {!lockedVehicleId && (
        <FormField label="Vehicle" error={errors.vehicleId?.message}>
          <select className={inputClass} {...register('vehicleId')}>
            <option value="">Select a vehicle…</option>
            {vehicles?.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plateNumber} — {vehicle.vehicleNumber}
              </option>
            ))}
          </select>
        </FormField>
      )}
      <FormField label="Week Number" error={errors.weekNumber?.message}>
        <input type="number" className={inputClass} {...register('weekNumber', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Amount Paid" error={errors.amountPaid?.message}>
        <input type="number" step="0.01" className={inputClass} {...register('amountPaid', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Payment Date" error={errors.paymentDate?.message}>
        <input type="date" className={inputClass} {...register('paymentDate')} />
      </FormField>
      <FormField label="Notes (optional)" error={errors.notes?.message}>
        <input className={inputClass} {...register('notes')} />
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
          {isSubmitting ? 'Saving…' : 'Add Payment'}
        </button>
      </div>
    </form>
  );
}
