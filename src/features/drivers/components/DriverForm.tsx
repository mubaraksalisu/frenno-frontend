import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../components/FormField';

const driverSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  phoneNumber: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  dateOfBirth: z.string().min(1, 'Required'),
  licenseNumber: z.string().min(1, 'Required'),
  identificationNumber: z.string().min(1, 'Required'),
  guarantorName: z.string().min(1, 'Required'),
  guarantorPhone: z.string().min(1, 'Required'),
});

export type DriverFormValues = z.infer<typeof driverSchema>;

const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none';

interface DriverFormProps {
  defaultValues?: Partial<DriverFormValues>;
  onSubmit: (values: DriverFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function DriverForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save' }: DriverFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormValues>({ resolver: zodResolver(driverSchema), defaultValues });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Full Name" error={errors.fullName?.message}>
        <input className={inputClass} {...register('fullName')} />
      </FormField>
      <FormField label="Phone Number" error={errors.phoneNumber?.message}>
        <input className={inputClass} {...register('phoneNumber')} />
      </FormField>
      <FormField label="Address" error={errors.address?.message}>
        <input className={inputClass} {...register('address')} />
      </FormField>
      <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
        <input type="date" className={inputClass} {...register('dateOfBirth')} />
      </FormField>
      <FormField label="License Number" error={errors.licenseNumber?.message}>
        <input className={inputClass} {...register('licenseNumber')} />
      </FormField>
      <FormField label="Identification Number" error={errors.identificationNumber?.message}>
        <input className={inputClass} {...register('identificationNumber')} />
      </FormField>
      <FormField label="Guarantor Name" error={errors.guarantorName?.message}>
        <input className={inputClass} {...register('guarantorName')} />
      </FormField>
      <FormField label="Guarantor Phone" error={errors.guarantorPhone?.message}>
        <input className={inputClass} {...register('guarantorPhone')} />
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
