import { QueryCache, QueryClient, MutationCache } from '@tanstack/react-query';
import { getErrorMessage } from './errors';
import { toast } from './toast';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      suppressErrorToast?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressErrorToast) {
        return;
      }
      toast.error(getErrorMessage(error));
    },
  }),
});
