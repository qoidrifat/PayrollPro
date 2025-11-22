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
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Loading State - Start as true for splash screen
  const [isLoading, setIsLoading] = useState(true);

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

  // Simulate session check and splash screen
  useEffect(() => {
    const initApp = async () => {
        // Wait a bit for the splash screen effect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const savedUser = localStorage.getItem('payroll_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    };
    
    initApp();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    // Simulate loading for login too
    setIsLoading(true);
    setTimeout(() => {
        setUser(loggedInUser);
        localStorage.setItem('payroll_user', JSON.stringify(loggedInUser));
        setActiveTab('dashboard');
        setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
        setUser(null);
        localStorage.removeItem('payroll_user');
        setIsLoading(false);
    }, 1000);
  };

  // Centralized Navigation Handler to ensure Loading Screen on ALL transitions
  const handleNavigation = (tab: string) => {
      if (tab === activeTab) return;
      
      setIsLoading(true);
      
      // Delay tab switch to allow loading animation to appear
      setTimeout(() => {
          setActiveTab(tab);
          
          // Short delay after content switch before revealing to ensure smooth rendering
          setTimeout(() => {
              setIsLoading(false);
          }, 500);
      }, 800); // 800ms loading duration
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
      if (!globalUsers.find(u => u.id === newEmployee.user.id)) {
          setGlobalUsers(prev => [...prev, newEmployee.user]);
      }
      showNotification('Karyawan baru berhasil ditambahkan.', 'success');
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
      setGlobalEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
      setGlobalUsers(prev => prev.map(u => u.id === updatedEmployee.userId ? updatedEmployee.user : u));
      showNotification('Data karyawan berhasil diperbarui.', 'success');
  };

  const handleDeleteEmployee = (id: string) => {
      setGlobalEmployees(prev => prev.filter(e => e.id !== id));
      showNotification('Data karyawan telah dihapus.', 'info');
  };

  // --- Global CRUD Handlers for Users ---
  const handleAddUser = (newUser: User) => {
      setGlobalUsers(prev => [...prev, newUser]);
      showNotification('Akun pengguna baru berhasil dibuat.', 'success');
  };

  const handleUpdateUser = (updatedUser: User) => {
      setGlobalUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
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
      showNotification('Akun pengguna telah dihapus.', 'info');
  };

  // --- Global Handler for Attendance ---
  const handleAttendanceSubmit = (record: AttendanceRecord) => {
      setGlobalAttendance(prev => {
          const existingIndex = prev.findIndex(r => r.id === record.id);
          if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = record;
              return updated;
          }
          return [record, ...prev];
      });
      showNotification('Data absensi berhasil diperbarui secara real-time.', 'success');
  };

  // --- Quick Action Handlers ---
  const handleQuickAddEmployee = () => {
      // Trigger loading transition for quick action jump
      setIsLoading(true);
      setTimeout(() => {
        setActiveTab('employees');
        setTriggerAddEmployee(true);
        setTimeout(() => setIsLoading(false), 500);
      }, 800);
  };

  // Login Screen Wrap
  if (!user) {
    return (
        <>
            <LoadingScreen isLoading={isLoading} />
            <Login onLogin={handleLogin} users={globalUsers} />
        </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return (
                <Dashboard 
                    user={user} 
                    payrolls={globalPayrolls} 
                    onAddPayroll={handleAddPayroll}
                    onNavigate={handleNavigation} // Use centralized handler
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
                    payrolls={globalPayrolls} 
                    onAddPayroll={handleAddPayroll}
                    onNavigate={handleNavigation}
                    onQuickAddEmployee={handleQuickAddEmployee}
                />
            );
    }
  };

  return (
    <>
        <LoadingScreen isLoading={isLoading} />
        <Layout 
            user={user} 
            onLogout={handleLogout} 
            activeTab={activeTab} 
            setActiveTab={handleNavigation} // Use centralized handler for Sidebar links too
            setIsLoading={setIsLoading}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            notification={notification}
            closeNotification={closeNotification}
        >
        {renderContent()}
        </Layout>
    </>
  );
}