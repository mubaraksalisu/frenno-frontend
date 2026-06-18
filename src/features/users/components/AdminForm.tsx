import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '../../../components/FormField';

const adminSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

export type AdminFormValues = z.infer<typeof adminSchema>;

const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none';

interface AdminFormProps {
  onSubmit: (values: AdminFormValues) => Promise<void>;
  onCancel: () => void;
}

export function AdminForm({ onSubmit, onCancel }: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({ resolver: zodResolver(adminSchema) });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Name" error={errors.name?.message}>
        <input className={inputClass} {...register('name')} />
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" className={inputClass} {...register('email')} />
      </FormField>
      <FormField label="Password" error={errors.password?.message}>
        <input type="password" className={inputClass} {...register('password')} />
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
          {isSubmitting ? 'Creating…' : 'Create Admin'}
        </button>
      </div>
    </form>
  );
}
