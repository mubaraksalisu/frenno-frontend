interface ErrorStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="mt-3 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
