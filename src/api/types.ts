export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type DriverStatus = 'active' | 'inactive';
export type VehicleStatus = 'active' | 'inactive' | 'completed';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  licenseNumber: string;
  identificationNumber: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorAddress: string | null;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  plateNumber: string;
  vehicleType: string;
  model: string;
  year: number;
  driverId: string | null;
  driver?: Driver | null;
  contractStartDate: string | null;
  contractDurationWeeks: number;
  weeklyExpectedPayment: number;
  totalExpectedReturn: number;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleWithProgress extends Vehicle {
  totalPaid: number;
  remainingBalance: number;
  completionPercentage: number;
  isBehindSchedule: boolean;
  deficit: number;
}

export interface Payment {
  id: string;
  vehicleId: string;
  weekNumber: number;
  amountPaid: number;
  paymentDate: string;
  notes: string | null;
  createdAt: string;
}

export interface RecentPayment {
  id: string;
  weekNumber: number;
  amountPaid: number;
  paymentDate: string;
  notes: string | null;
  plateNumber: string;
  driverName: string;
}

export interface DashboardSummary {
  totalDrivers: number;
  totalVehicles: number;
  totalExpectedReturns: number;
  totalPaymentsReceived: number;
  totalOutstandingBalance: number;
}
