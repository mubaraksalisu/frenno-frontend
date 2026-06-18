import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateAdminInput } from '../api/users.api';
import { createUser, getUsers } from '../api/users.api';
import { invalidateUsersList } from '../lib/queryInvalidation';

export function useUsers() {
  return useQuery({ queryKey: ['users', 'list'], queryFn: getUsers });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminInput) => createUser(input),
    meta: { suppressErrorToast: true },
    onSuccess: () => {
      invalidateUsersList(queryClient);
    },
  });
}
