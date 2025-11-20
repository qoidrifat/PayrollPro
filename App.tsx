import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { PayrollList } from './pages/PayrollList';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Attendance } from './pages/Attendance'; // New
import { User, Role } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard user={user} />;
        case 'employees':
            return <EmployeeList user={user} showNotification={showNotification} />;
        case 'payroll':
            return <PayrollList user={user} />;
        case 'my-payslips':
            return <PayrollList user={user} />;
        case 'attendance': // New Route
            return <Attendance user={user} />;
        case 'settings':
            return <Settings />;
        case 'about':
            return <About />;
        default:
            return <Dashboard user={user} />;
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