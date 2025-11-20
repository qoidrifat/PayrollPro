import { Role, User, Department, Position, Employee, Payroll, PayrollStatus, EmploymentStatus, AuditLog, SystemInfo, AttendanceRecord, AttendanceStatus } from '../types';

// --- Users ---
export const USERS: User[] = [
  { id: 'u1', fullName: 'Alice Admin', email: 'alice@payrollpro.com', role: Role.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'u2', fullName: 'Budi Manajer', email: 'budi@payrollpro.com', role: Role.MANAGER, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'u3', fullName: 'Charlie Karyawan', email: 'charlie@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
  { id: 'u4', fullName: 'Diana Developer', email: 'diana@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026708c' },
  { id: 'u5', fullName: 'Eko Eksekutif', email: 'eko@payrollpro.com', role: Role.MANAGER, avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
];

// --- Departments ---
export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Teknologi Informasi', managerId: 'u2' },
  { id: 'd2', name: 'Sumber Daya Manusia (HR)', managerId: 'u5' },
  { id: 'd3', name: 'Penjualan & Pemasaran', managerId: 'u5' },
];

// --- Positions ---
export const POSITIONS: Position[] = [
  { id: 'p1', title: 'Senior Developer', departmentId: 'd1' },
  { id: 'p2', title: 'Spesialis HR', departmentId: 'd2' },
  { id: 'p3', title: 'Sales Associate', departmentId: 'd3' },
  { id: 'p4', title: 'Manajer Engineering', departmentId: 'd1' },
];

// --- Employees ---
export const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    userId: 'u2',
    employeeIdNumber: 'EMP-2020-001',
    startDate: '2020-01-15',
    departmentId: 'd1',
    positionId: 'p4',
    baseSalary: 25000000,
    status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u2')!,
    fixedAllowances: [
        { id: 'fa1', name: 'Tunjangan Jabatan', amount: 5000000, isFixed: true },
        { id: 'fa2', name: 'Transportasi', amount: 1000000, isFixed: true }
    ]
  },
  {
    id: 'e2',
    userId: 'u3',
    employeeIdNumber: 'EMP-2021-042',
    startDate: '2021-03-10',
    departmentId: 'd1',
    positionId: 'p1',
    baseSalary: 12000000,
    status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u3')!,
    fixedAllowances: [
        { id: 'fa3', name: 'Transportasi', amount: 500000, isFixed: true }
    ]
  },
  {
    id: 'e3',
    userId: 'u4',
    employeeIdNumber: 'EMP-2021-088',
    startDate: '2021-06-01',
    departmentId: 'd1',
    positionId: 'p1',
    baseSalary: 13500000,
    status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u4')!,
    fixedAllowances: [
        { id: 'fa3', name: 'Transportasi', amount: 500000, isFixed: true },
        { id: 'fa4', name: 'Tunjangan Keahlian', amount: 1500000, isFixed: true }
    ]
  },
];

// --- Payrolls ---
export const PAYROLLS: Payroll[] = [
  {
    id: 'pr-2310-001',
    employeeId: 'e2',
    month: '2023-10',
    baseSalary: 12000000,
    allowances: [{ id: 'a1', name: 'Transportasi', amount: 500000 }, { id: 'a2', name: 'Uang Makan', amount: 1000000 }],
    deductions: [{ id: 'de1', name: 'PPh 21', amount: 500000 }, { id: 'de2', name: 'BPJS Kesehatan', amount: 150000 }],
    totalAllowance: 1500000,
    totalDeduction: 650000,
    netSalary: 12850000,
    status: PayrollStatus.PAID,
    issueDate: '2023-10-25',
    employee: EMPLOYEES.find(e => e.id === 'e2'),
  },
  {
    id: 'pr-2310-002',
    employeeId: 'e3',
    month: '2023-10',
    baseSalary: 13500000,
    allowances: [{ id: 'a2', name: 'Tunjangan Makan', amount: 1200000 }],
    deductions: [{ id: 'de2', name: 'PPh 21', amount: 600000 }],
    totalAllowance: 1200000,
    totalDeduction: 600000,
    netSalary: 14100000,
    status: PayrollStatus.PAID,
    issueDate: '2023-10-25',
    employee: EMPLOYEES.find(e => e.id === 'e3'),
  },
];

// --- Attendance ---
export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
    // E2 Attendance
    { id: 'att1', employeeId: 'e2', date: '2023-10-23', status: AttendanceStatus.PRESENT, checkIn: '08:55', checkOut: '17:00' },
    { id: 'att2', employeeId: 'e2', date: '2023-10-24', status: AttendanceStatus.PRESENT, checkIn: '09:00', checkOut: '17:10' },
    { id: 'att3', employeeId: 'e2', date: '2023-10-25', status: AttendanceStatus.LATE, checkIn: '09:30', checkOut: '17:00' },
    { id: 'att4', employeeId: 'e2', date: '2023-10-26', status: AttendanceStatus.PRESENT, checkIn: '08:50', checkOut: '19:00', overtimeHours: 2 },
    // E3 Attendance
    { id: 'att5', employeeId: 'e3', date: '2023-10-26', status: AttendanceStatus.PRESENT, checkIn: '08:50', checkOut: '17:00' },
];

// --- Audit Logs ---
export const AUDIT_LOGS: AuditLog[] = [
    { id: 'log1', action: 'Koneksi Database', user: 'Sistem', role: Role.ADMIN, timestamp: '1 mnt lalu', details: 'Terhubung ke MySQL 8.0 via PDO', status: 'Success' },
    { id: 'log2', action: 'Job Penggajian', user: 'Queue Worker', role: Role.ADMIN, timestamp: '10 mnt lalu', details: 'Memproses batch payroll_2023_10', status: 'Success' },
    { id: 'log3', action: 'Login Pengguna', user: 'Budi Manajer', role: Role.MANAGER, timestamp: '1 jam lalu', details: 'Sesi dimulai (Laravel Sanctum)', status: 'Success' },
    { id: 'log4', action: 'Migrasi', user: 'Deploy Script', role: Role.ADMIN, timestamp: '2 hari lalu', details: 'Migrasi tabel: create_payrolls_table', status: 'Success' },
    { id: 'log5', action: 'Error SMTP', user: 'Sistem', role: Role.ADMIN, timestamp: 'Kemarin', details: 'Gagal terhubung ke Mailtrap', status: 'Error' },
];

// --- System Info ---
export const SYSTEM_INFO: SystemInfo = {
    version: 'v4.1.0 (Laravel Edition)',
    lastUpdated: '27 Oktober 2023',
    serverStatus: 'Operational',
    uptime: '100%'
};

// Helpers
export const getEmployeesByDepartment = (deptId: string) => EMPLOYEES.filter(e => e.departmentId === deptId);
export const getMyPayrolls = (empId: string) => PAYROLLS.filter(p => p.employeeId === empId);
export const getAllPayrolls = () => PAYROLLS;