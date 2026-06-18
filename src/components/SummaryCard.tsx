import { Skeleton } from './Skeleton';

interface SummaryCardProps {
  label: string;
  value: string;
  isLoading?: boolean;
}

export function SummaryCard({ label, value, isLoading }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  );
}
