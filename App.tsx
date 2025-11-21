import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { PayrollList } from './pages/PayrollList';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Attendance } from './pages/Attendance';
import { UserManagement } from './pages/UserManagement';
import { User, Payroll, Employee, AttendanceRecord } from './types';
import { PAYROLLS, EMPLOYEES, USERS, ATTENDANCE_RECORDS } from './services/mockData';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Lifted State for Payrolls (Single Source of Truth)
  const [globalPayrolls, setGlobalPayrolls] = useState<Payroll[]>(PAYROLLS);
  
  // Lifted State for Employees (Single Source of Truth for CRUD)
  const [globalEmployees, setGlobalEmployees] = useState<Employee[]>(EMPLOYEES);

  // Lifted State for Users (Single Source of Truth for User Management)
  const [globalUsers, setGlobalUsers] = useState<User[]>(USERS);

  // Lifted State for Attendance (Single Source of Truth for Real-time Updates)
  const [globalAttendance, setGlobalAttendance] = useState<AttendanceRecord[]>(ATTENDANCE_RECORDS);

  // State to trigger "Add Employee" modal from Dashboard
  const [triggerAddEmployee, setTriggerAddEmployee] = useState(false);

  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize Theme from Local Storage
  useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
      }
  }, []);

  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      if (!darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
      }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setNotification({ message, type });
  };

  const closeNotification = () => {
      setNotification(null);
  };

  // Simulate session check
  useEffect(() => {
    const savedUser = localStorage.getItem('payroll_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('payroll_user', JSON.stringify(loggedInUser));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('payroll_user');
  };

  // --- Global CRUD Handlers for Payroll ---
  const handleAddPayroll = (newPayroll: Payroll) => {
      setGlobalPayrolls(prev => [newPayroll, ...prev]);
      showNotification('Data penggajian baru berhasil ditambahkan.', 'success');
  };

  const handleUpdatePayroll = (updatedPayroll: Payroll) => {
      setGlobalPayrolls(prev => prev.map(p => p.id === updatedPayroll.id ? updatedPayroll : p));
      showNotification('Data penggajian berhasil diperbarui.', 'success');
  };

  const handleDeletePayroll = (id: string) => {
      setGlobalPayrolls(prev => prev.filter(p => p.id !== id));
      showNotification('Data penggajian telah dihapus.', 'info');
  };

  // --- Global CRUD Handlers for Employees ---
  const handleAddEmployee = (newEmployee: Employee) => {
      setGlobalEmployees(prev => [newEmployee, ...prev]);
      // Also add to globalUsers if not exists, though usually handled via registration or separately.
      // For this mock, EmployeeForm creates a nested User object. We should ensure that User object is in globalUsers too.
      if (!globalUsers.find(u => u.id === newEmployee.user.id)) {
          setGlobalUsers(prev => [...prev, newEmployee.user]);
      }
      showNotification('Karyawan baru berhasil ditambahkan.', 'success');
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
      setGlobalEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
      // Update the corresponding user in globalUsers as well to keep sync
      setGlobalUsers(prev => prev.map(u => u.id === updatedEmployee.userId ? updatedEmployee.user : u));
      showNotification('Data karyawan berhasil diperbarui.', 'success');
  };

  const handleDeleteEmployee = (id: string) => {
      // Find employee to get userID
      const emp = globalEmployees.find(e => e.id === id);
      setGlobalEmployees(prev => prev.filter(e => e.id !== id));
      if (emp) {
          // Optional: Delete user account when employee is deleted? 
          // Usually we keep the user account but maybe archive it. 
          // For now, let's just keep the user account to allow re-hiring or history.
      }
      showNotification('Data karyawan telah dihapus.', 'info');
  };

  // --- Global CRUD Handlers for Users (User Management) ---
  const handleAddUser = (newUser: User) => {
      setGlobalUsers(prev => [...prev, newUser]);
      showNotification('Akun pengguna baru berhasil dibuat.', 'success');
  };

  const handleUpdateUser = (updatedUser: User) => {
      setGlobalUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Sync with Employee list if this user is attached to an employee
      setGlobalEmployees(prev => prev.map(emp => {
          if (emp.userId === updatedUser.id) {
              return { ...emp, user: updatedUser };
          }
          return emp;
      }));

      showNotification('Data akun pengguna berhasil diperbarui.', 'success');
  };

  const handleDeleteUser = (id: string) => {
      setGlobalUsers(prev => prev.filter(u => u.id !== id));
      // Warning: This might leave an Employee record with a dangling userId reference.
      // In a real app, backend handles cascading deletes or soft deletes.
      showNotification('Akun pengguna telah dihapus.', 'info');
  };

  // --- Global Handler for Attendance (Real-time) ---
  const handleAttendanceSubmit = (record: AttendanceRecord) => {
      setGlobalAttendance(prev => {
          // Check if record exists (update scenario like Check-Out)
          const existingIndex = prev.findIndex(r => r.id === record.id);
          
          if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = record;
              return updated;
          }
          
          // Create new scenario (Check-In)
          return [record, ...prev];
      });
      showNotification('Data absensi berhasil diperbarui secara real-time.', 'success');
  };

  // --- Quick Action Handlers ---
  const handleQuickAddEmployee = () => {
      setActiveTab('employees');
      setTriggerAddEmployee(true);
  };

  if (!user) {
    return <Login onLogin={handleLogin} users={globalUsers} />;
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return (
                <Dashboard 
                    user={user} 
                    payrolls={globalPayrolls} // Pass global payrolls here
                    onAddPayroll={handleAddPayroll}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onQuickAddEmployee={handleQuickAddEmployee}
                />
            );
        case 'employees':
            return (
                <EmployeeList 
                    user={user} 
                    employees={globalEmployees}
                    onAddEmployee={handleAddEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                    showNotification={showNotification}
                    shouldOpenModal={triggerAddEmployee}
                    onModalOpened={() => setTriggerAddEmployee(false)}
                />
            );
        case 'payroll':
            return (
                <PayrollList 
                    user={user} 
                    payrolls={globalPayrolls}
                    onAddPayroll={handleAddPayroll}
                    onUpdatePayroll={handleUpdatePayroll}
                    onDeletePayroll={handleDeletePayroll}
                />
            );
        case 'my-payslips':
            // Reusing PayrollList for employee view
            return (
                <PayrollList 
                    user={user} 
                    payrolls={globalPayrolls}
                    onAddPayroll={handleAddPayroll}
                    onUpdatePayroll={handleUpdatePayroll}
                    onDeletePayroll={handleDeletePayroll}
                />
            );
        case 'attendance': 
            return (
                <Attendance 
                    user={user} 
                    employees={globalEmployees}
                    attendanceRecords={globalAttendance}
                    onAttendanceSubmit={handleAttendanceSubmit}
                />
            );
        case 'user-management':
            return (
                <UserManagement 
                    users={globalUsers}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            );
        case 'settings':
            return <Settings />;
        case 'about':
            return <About />;
        default:
            return (
                <Dashboard 
                    user={user} 
                    payrolls={globalPayrolls} // Pass global payrolls here
                    onAddPayroll={handleAddPayroll}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onQuickAddEmployee={handleQuickAddEmployee}
                />
            );
    }
  };

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        notification={notification}
        closeNotification={closeNotification}
    >
      {renderContent()}
    </Layout>
  );
}