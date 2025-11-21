import { Role, User, Department, Position, Employee, Payroll, PayrollStatus, EmploymentStatus, AuditLog, SystemInfo, AttendanceRecord, AttendanceStatus } from '../types';

// --- Users ---
export const USERS: User[] = [
  // Management
  { id: 'u1', fullName: 'Alice Admin', email: 'admin@payrollpro.com', role: Role.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?img=44' }, // Professional Woman
  { id: 'u2', fullName: 'Budi Manajer', email: 'manager@payrollpro.com', role: Role.MANAGER, avatarUrl: 'https://i.pravatar.cc/150?img=11' }, // Professional Man
  
  // Backend Developers (3)
  { id: 'u_be1', fullName: 'Ahmad Backend', email: 'ahmad@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=68' }, // Man
  { id: 'u_be2', fullName: 'Bagus Logic', email: 'bagus@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=12' }, // Man
  { id: 'u_be3', fullName: 'Cahyo Server', email: 'cahyo@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=8' }, // Man

  // Frontend Developers (3)
  { id: 'u_fe1', fullName: 'Dinda UI', email: 'dinda@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=5' }, // Woman
  { id: 'u_fe2', fullName: 'Eka React', email: 'eka@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=9' }, // Woman
  { id: 'u_fe3', fullName: 'Fajar CSS', email: 'fajar@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=59' }, // Man

  // Mobile Developers (2)
  { id: 'u_mo1', fullName: 'Gilang Android', email: 'gilang@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=53' }, // Man
  { id: 'u_mo2', fullName: 'Hana iOS', email: 'hana@payrollpro.com', role: Role.EMPLOYEE, avatarUrl: 'https://i.pravatar.cc/150?img=32' }, // Woman
];

// --- Departments ---
export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Engineering (IT)', managerId: 'u2' },
  { id: 'd2', name: 'Human Resources', managerId: 'u1' },
];

// --- Positions ---
export const POSITIONS: Position[] = [
  { id: 'p_be', title: 'Backend Developer', departmentId: 'd1' },
  { id: 'p_fe', title: 'Frontend Developer', departmentId: 'd1' },
  { id: 'p_mo', title: 'Mobile Developer', departmentId: 'd1' },
  { id: 'p_mgr', title: 'Engineering Manager', departmentId: 'd1' },
];

// --- Employees ---
export const EMPLOYEES: Employee[] = [
  // --- Backend Developers ---
  {
    id: 'e_be1', userId: 'u_be1', employeeIdNumber: 'DEV-BE-001', startDate: '2022-01-10',
    departmentId: 'd1', positionId: 'p_be', baseSalary: 4500000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_be1')!, fixedAllowances: [{ id: 'fa1', name: 'Tunjangan Internet', amount: 300000, isFixed: true }]
  },
  {
    id: 'e_be2', userId: 'u_be2', employeeIdNumber: 'DEV-BE-002', startDate: '2023-03-15',
    departmentId: 'd1', positionId: 'p_be', baseSalary: 3200000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_be2')!, fixedAllowances: []
  },
  {
    id: 'e_be3', userId: 'u_be3', employeeIdNumber: 'DEV-BE-003', startDate: '2023-08-01',
    departmentId: 'd1', positionId: 'p_be', baseSalary: 2400000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_be3')!, fixedAllowances: []
  },

  // --- Frontend Developers ---
  {
    id: 'e_fe1', userId: 'u_fe1', employeeIdNumber: 'DEV-FE-001', startDate: '2022-02-20',
    departmentId: 'd1', positionId: 'p_fe', baseSalary: 4300000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_fe1')!, fixedAllowances: [{ id: 'fa2', name: 'Tunjangan Device', amount: 200000, isFixed: true }]
  },
  {
    id: 'e_fe2', userId: 'u_fe2', employeeIdNumber: 'DEV-FE-002', startDate: '2023-05-10',
    departmentId: 'd1', positionId: 'p_fe', baseSalary: 3100000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_fe2')!, fixedAllowances: []
  },
  {
    id: 'e_fe3', userId: 'u_fe3', employeeIdNumber: 'DEV-FE-003', startDate: '2023-11-01',
    departmentId: 'd1', positionId: 'p_fe', baseSalary: 2400000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_fe3')!, fixedAllowances: []
  },

  // --- Mobile Developers ---
  {
    id: 'e_mo1', userId: 'u_mo1', employeeIdNumber: 'DEV-MO-001', startDate: '2022-06-15',
    departmentId: 'd1', positionId: 'p_mo', baseSalary: 5000000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_mo1')!, fixedAllowances: []
  },
  {
    id: 'e_mo2', userId: 'u_mo2', employeeIdNumber: 'DEV-MO-002', startDate: '2023-09-01',
    departmentId: 'd1', positionId: 'p_mo', baseSalary: 3500000, status: EmploymentStatus.ACTIVE,
    user: USERS.find(u => u.id === 'u_mo2')!, fixedAllowances: []
  },
];

// --- GENERATORS FOR ATTENDANCE & PAYROLL ---
// Target Months: August, September, October 2025
const TARGET_MONTHS = [
    { year: 2025, month: 7, label: '2025-08' }, // Month is 0-indexed in JS Date (7 = Aug)
    { year: 2025, month: 8, label: '2025-09' },
    { year: 2025, month: 9, label: '2025-10' }
];

const GENERATED_DATA = (() => {
    const attendance: AttendanceRecord[] = [];
    const payrolls: Payroll[] = [];

    // Constants for Rules
    const TRANSPORT_ALLOWANCE = 150000;
    const DEDUCTION_ABSENT = 50000;
    const DEDUCTION_LEAVE = 25000;
    const MAX_LEAVE_DAYS = 3;
    
    // Random images for proof
    const OFFICE_IMAGES = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=300&q=80'
    ];

    EMPLOYEES.forEach(emp => {
        TARGET_MONTHS.forEach(tm => {
            const daysInMonth = new Date(tm.year, tm.month + 1, 0).getDate();
            let absentCount = 0;
            let leaveCount = 0;

            // 1. Generate Attendance for the Month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(tm.year, tm.month, day);
                const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

                // Skip Weekends
                if (dayOfWeek === 0 || dayOfWeek === 6) continue;

                // Random Status Generation
                // Probabilities: 90% Present, 5% Leave (capped at 3), 5% Absent
                const rand = Math.random();
                let status = AttendanceStatus.PRESENT;
                let checkIn = '08:55';
                let checkOut = '17:05';
                let overtime = 0;
                let proofImage: string | undefined = undefined;

                if (rand > 0.95) {
                    status = AttendanceStatus.ABSENT;
                    checkIn = '-';
                    checkOut = '-';
                    absentCount++;
                } else if (rand > 0.90) {
                    if (leaveCount < MAX_LEAVE_DAYS) {
                        status = AttendanceStatus.ON_LEAVE;
                        checkIn = '-';
                        checkOut = '-';
                        leaveCount++;
                    } else {
                        // Forced to come in if leave quota exceeded (or count as absent if they didn't show, but let's say they came)
                        status = AttendanceStatus.PRESENT; 
                    }
                } else {
                    // Random Overtime for Present employees (20% chance)
                    if (Math.random() > 0.8) {
                        overtime = Math.floor(Math.random() * 3) + 1; // 1-3 hours
                        checkOut = `${17 + overtime}:05`;
                    }
                    // Add random proof image for present
                    if (Math.random() > 0.5) {
                        proofImage = OFFICE_IMAGES[Math.floor(Math.random() * OFFICE_IMAGES.length)];
                    }
                }

                attendance.push({
                    id: `att-${emp.id}-${tm.label}-${day}`,
                    employeeId: emp.id,
                    date: date.toISOString().slice(0, 10),
                    status: status,
                    checkIn: status === AttendanceStatus.PRESENT ? checkIn : undefined,
                    checkOut: status === AttendanceStatus.PRESENT ? checkOut : undefined,
                    overtimeHours: overtime > 0 ? overtime : undefined,
                    proofImageUrl: proofImage
                });
            }

            // 2. Generate Payroll for the Month
            const allowances = [
                { id: `all-tr-${tm.label}`, name: 'Tunjangan Transportasi', amount: TRANSPORT_ALLOWANCE }
            ];
            
            // Add fixed allowances from employee contract
            if (emp.fixedAllowances) {
                emp.fixedAllowances.forEach(fa => {
                    allowances.push({ id: `fa-${fa.id}-${tm.label}`, name: fa.name, amount: fa.amount });
                });
            }

            // Deductions Calculation
            const deductions = [];
            
            // BPJS (Standard simulation)
            deductions.push({ id: `d-bpjs-${tm.label}`, name: 'BPJS Kesehatan & TK', amount: Math.round(emp.baseSalary * 0.03) });
            
            // Rule: Alpha Deduction
            if (absentCount > 0) {
                deductions.push({ 
                    id: `d-abs-${tm.label}`, 
                    name: `Potongan Absen (${absentCount} hari)`, 
                    amount: absentCount * DEDUCTION_ABSENT 
                });
            }

            // Rule: Leave Deduction
            if (leaveCount > 0) {
                deductions.push({ 
                    id: `d-leave-${tm.label}`, 
                    name: `Potongan Cuti (${leaveCount} hari)`, 
                    amount: leaveCount * DEDUCTION_LEAVE 
                });
            }

            const totalAllowance = allowances.reduce((sum, i) => sum + i.amount, 0);
            const totalDeduction = deductions.reduce((sum, i) => sum + i.amount, 0);
            
            // Simple Overtime calc for payroll (Mock: 20k per hour)
            const monthlyOvertimeHours = attendance
                .filter(a => a.employeeId === emp.id && a.date.startsWith(tm.label))
                .reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
            
            const overtimePay = monthlyOvertimeHours * 20000;

            const netSalary = emp.baseSalary + totalAllowance + overtimePay - totalDeduction;

            payrolls.push({
                id: `pr-${emp.id}-${tm.label}`,
                employeeId: emp.id,
                month: tm.label,
                baseSalary: emp.baseSalary,
                allowances,
                deductions,
                totalAllowance,
                totalDeduction,
                overtimePay,
                netSalary,
                status: PayrollStatus.PAID, // Historical data is paid
                issueDate: `${tm.label}-25`,
                employee: emp
            });
        });
    });

    // Add today's attendance separately if not generated
    const today = new Date().toISOString().slice(0, 10);
    if (!attendance.find(a => a.date === today)) {
         EMPLOYEES.forEach(emp => {
             attendance.push({
                 id: `att-today-${emp.id}`,
                 employeeId: emp.id,
                 date: today,
                 status: AttendanceStatus.PRESENT, // Default everyone present today for demo
                 checkIn: '08:50',
                 checkOut: undefined
             });
         });
    }

    return { attendance, payrolls };
})();


export const ATTENDANCE_RECORDS: AttendanceRecord[] = GENERATED_DATA.attendance;
export const PAYROLLS: Payroll[] = GENERATED_DATA.payrolls;

// --- Audit Logs ---
export const AUDIT_LOGS: AuditLog[] = [
    { id: 'log1', action: 'Generate Payroll Bulk', user: 'System Scheduler', role: Role.ADMIN, timestamp: '2025-10-25 09:00', details: 'Otomatisasi penggajian periode Oktober 2025', status: 'Success' },
    { id: 'log2', action: 'Update Kebijakan Cuti', user: 'Alice Admin', role: Role.ADMIN, timestamp: '2025-10-01 10:15', details: 'Set limit cuti maks 3 hari/bulan', status: 'Warning' },
    { id: 'log3', action: 'Input Karyawan Baru', user: 'Alice Admin', role: Role.ADMIN, timestamp: '2025-09-15 14:30', details: 'Menambahkan dev-mo-002', status: 'Success' },
];

// --- System Info ---
export const SYSTEM_INFO: SystemInfo = {
    version: 'v4.3.1 (Auto-Calc Logic)',
    lastUpdated: '2025-11-01',
    serverStatus: 'Operational',
    uptime: '99.9%'
};

// Helpers
export const getEmployeesByDepartment = (deptId: string) => EMPLOYEES.filter(e => e.departmentId === deptId);
export const getMyPayrolls = (empId: string) => PAYROLLS.filter(p => p.employeeId === empId);
export const getAllPayrolls = () => PAYROLLS;