import { isAxiosError } from 'axios';

interface NestErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<NestErrorBody>(error)) {
    if (!error.response) {
      return 'Network error. Check your connection and try again.';
    }
    const message = error.response.data?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message.join(' ');
    }
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
    return FALLBACK_MESSAGE;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return FALLBACK_MESSAGE;
}
