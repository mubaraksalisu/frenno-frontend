import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../components/FormField';

const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, 'Required'),
  plateNumber: z.string().min(1, 'Required'),
  vehicleType: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  year: z.number().int().min(1980, 'Invalid year'),
  weeklyExpectedPayment: z.number().positive('Must be a positive number'),
  contractDurationWeeks: z.number().int().min(1, 'Must be at least 1 week'),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none';

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function VehicleForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save' }: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { contractDurationWeeks: 96, ...defaultValues },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Vehicle Number" error={errors.vehicleNumber?.message}>
        <input className={inputClass} {...register('vehicleNumber')} />
      </FormField>
      <FormField label="Plate Number" error={errors.plateNumber?.message}>
        <input className={inputClass} {...register('plateNumber')} />
      </FormField>
      <FormField label="Vehicle Type" error={errors.vehicleType?.message}>
        <input className={inputClass} {...register('vehicleType')} />
      </FormField>
      <FormField label="Model" error={errors.model?.message}>
        <input className={inputClass} {...register('model')} />
      </FormField>
      <FormField label="Year" error={errors.year?.message}>
        <input type="number" className={inputClass} {...register('year', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Weekly Expected Payment" error={errors.weeklyExpectedPayment?.message}>
        <input type="number" step="0.01" className={inputClass} {...register('weeklyExpectedPayment', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Contract Duration (weeks)" error={errors.contractDurationWeeks?.message}>
        <input type="number" className={inputClass} {...register('contractDurationWeeks', { valueAsNumber: true })} />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
