export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
}

export enum EmploymentStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated',
}

export enum PayrollStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  PAID = 'Paid',
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  ON_LEAVE = 'On Leave',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
}

export interface AllowanceConfig {
  id: string;
  name: string; // e.g., "Transport Allowance", "Meal Allowance"
  amount: number;
  isFixed: boolean; // If true, auto-added every month
}

export interface Employee {
  id: string;
  userId: string;
  employeeIdNumber: string;
  startDate: string;
  departmentId: string;
  positionId: string;
  baseSalary: number;
  status: EmploymentStatus;
  user: User; // Hydrated user data
  fixedAllowances?: AllowanceConfig[]; // New: Recurring allowances
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
}

export interface PayrollItem {
  id: string;
  name: string;
  amount: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  baseSalary: number;
  allowances: PayrollItem[];
  deductions: PayrollItem[];
  totalAllowance: number;
  totalDeduction: number;
  overtimePay?: number; // New: Overtime calculation
  netSalary: number;
  status: PayrollStatus;
  issueDate?: string;
  employee?: Employee; // Hydrated for UI
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: Role;
  timestamp: string;
  details: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface SystemInfo {
    version: string;
    lastUpdated: string;
    serverStatus: 'Operational' | 'Maintenance' | 'Degraded';
    uptime: string;
}