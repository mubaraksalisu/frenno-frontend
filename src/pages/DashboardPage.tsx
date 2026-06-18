import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { SummaryCard } from '../components/SummaryCard';
import { useBehindScheduleVehicles, useCompletedVehicles, useDashboardSummary, useRecentPayments } from '../hooks/useDashboard';
import { formatCurrency, formatDate } from '../lib/format';

export function DashboardPage() {
  const summary = useDashboardSummary();
  const recentPayments = useRecentPayments();
  const behindSchedule = useBehindScheduleVehicles();
  const completed = useCompletedVehicles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Fleet repayment overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Total Drivers" value={String(summary.data?.totalDrivers ?? '—')} />
        <SummaryCard label="Total Vehicles" value={String(summary.data?.totalVehicles ?? '—')} />
        <SummaryCard
          label="Total Expected Returns"
          value={summary.data ? formatCurrency(summary.data.totalExpectedReturns) : '—'}
        />
        <SummaryCard
          label="Total Payments Received"
          value={summary.data ? formatCurrency(summary.data.totalPaymentsReceived) : '—'}
        />
        <SummaryCard
          label="Total Outstanding Balance"
          value={summary.data ? formatCurrency(summary.data.totalOutstandingBalance) : '—'}
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Recent Payments</h2>
        <DataTable
          isLoading={recentPayments.isLoading}
          data={recentPayments.data ?? []}
          rowKey={(payment) => payment.id}
          emptyMessage="No payments recorded yet."
          columns={[
            { key: 'plate', header: 'Vehicle', render: (p) => p.plateNumber },
            { key: 'driver', header: 'Driver', render: (p) => p.driverName },
            { key: 'week', header: 'Week', render: (p) => p.weekNumber },
            { key: 'amount', header: 'Amount', render: (p) => formatCurrency(p.amountPaid) },
            { key: 'date', header: 'Date', render: (p) => formatDate(p.paymentDate) },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Vehicles Behind Schedule</h2>
        <DataTable
          isLoading={behindSchedule.isLoading}
          data={behindSchedule.data ?? []}
          rowKey={(vehicle) => vehicle.id}
          emptyMessage="No vehicles are behind schedule."
          columns={[
            { key: 'plate', header: 'Plate Number', render: (v) => v.plateNumber },
            { key: 'driver', header: 'Driver', render: (v) => v.driver?.fullName ?? '—' },
            { key: 'deficit', header: 'Deficit', render: (v) => formatCurrency(v.deficit) },
            { key: 'completion', header: 'Completion', render: (v) => `${v.completionPercentage.toFixed(1)}%` },
            { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Completed Vehicles</h2>
        <DataTable
          isLoading={completed.isLoading}
          data={completed.data ?? []}
          rowKey={(vehicle) => vehicle.id}
          emptyMessage="No vehicles have completed repayment yet."
          columns={[
            { key: 'plate', header: 'Plate Number', render: (v) => v.plateNumber },
            { key: 'driver', header: 'Driver', render: (v) => v.driver?.fullName ?? '—' },
            { key: 'total', header: 'Total Paid', render: (v) => formatCurrency(v.totalPaid) },
            { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
          ]}
        />
      </section>
    </div>
  );
}
