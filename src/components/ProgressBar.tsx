interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${clamped >= 100 ? 'bg-blue-600' : 'bg-green-600'}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
