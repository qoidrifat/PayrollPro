import React, { useState } from 'react';
import { Role, User } from '../types';
import { DashboardIcon, UsersIcon, CashIcon, LogoutIcon, DocumentIcon, SettingsIcon, InfoIcon, ClockIcon } from './Icons';
import { Toast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  closeNotification: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  darkMode, 
  toggleDarkMode,
  notification,
  closeNotification
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ id, icon, label, allowedRoles }: { id: string, icon: any, label: string, allowedRoles: Role[] }) => {
    if (!allowedRoles.includes(user.role)) return null;
    
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
            setActiveTab(id);
            setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 mb-2 group relative overflow-hidden ${
          isActive
            ? 'bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-white shadow-lg border border-brand-blue/30'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-blue to-brand-purple rounded-r"></div>}
        <span className={`p-1 rounded-lg transition-transform duration-300 ${isActive ? 'text-brand-blue scale-110' : 'group-hover:text-brand-blue/80'}`}>
             {icon({ className: "w-5 h-5" })}
        </span>
        <span className="ml-3 tracking-wide">{label}</span>
        {isActive && (
            <div className="absolute right-3 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_10px_#ec4899]"></div>
        )}
      </button>
    );
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${darkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`}>
      {/* Notification Toast */}
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification} 
        />
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-80 pointer-events-none"></div>
        
        <div className="relative h-full flex flex-col">
            <div className="h-24 flex items-center px-8 bg-white/0 backdrop-blur-sm">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500">
                    P
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-white tracking-tight leading-none">Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Pro</span></span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Enterprise</span>
                </div>
            </div>
            </div>
            
            <div className="flex flex-col flex-1 justify-between overflow-hidden">
                <div className="px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                    {/* User Profile Mini-Card */}
                    <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity text-brand-blue">
                            <svg className="w-20 h-20 -mt-4 -mr-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                        </div>
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="relative">
                                <img src={user.avatarUrl} alt="User" className="w-12 h-12 rounded-full border-2 border-brand-blue shadow-lg object-cover group-hover:border-brand-orange transition-colors duration-300" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate group-hover:text-brand-blue transition-colors">{user.fullName}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded-md border border-white/5">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-2">Menu Utama</p>
                        <NavItem 
                            id="dashboard" 
                            icon={DashboardIcon} 
                            label="Dasbor" 
                            allowedRoles={[Role.ADMIN, Role.MANAGER, Role.EMPLOYEE]} 
                        />
                        
                        <NavItem 
                            id="attendance" 
                            icon={ClockIcon} 
                            label="Absensi" 
                            allowedRoles={[Role.ADMIN, Role.MANAGER, Role.EMPLOYEE]} 
                        />

                        <NavItem 
                            id="employees" 
                            icon={UsersIcon} 
                            label="Karyawan" 
                            allowedRoles={[Role.ADMIN, Role.MANAGER]} 
                        />
                        
                        <NavItem 
                            id="payroll" 
                            icon={CashIcon} 
                            label="Penggajian" 
                            allowedRoles={[Role.ADMIN, Role.MANAGER]} 
                        />

                        <NavItem 
                            id="my-payslips" 
                            icon={DocumentIcon} 
                            label="Slip Gaji Saya" 
                            allowedRoles={[Role.EMPLOYEE]} 
                        />
                    </div>

                    <div className="space-y-1 mt-8">
                        <p className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Sistem</p>
                        
                        <NavItem 
                            id="settings" 
                            icon={SettingsIcon} 
                            label="Pengaturan" 
                            allowedRoles={[Role.ADMIN]} 
                        />

                        <NavItem 
                            id="about" 
                            icon={InfoIcon} 
                            label="Tentang Perusahaan" 
                            allowedRoles={[Role.ADMIN, Role.MANAGER, Role.EMPLOYEE]} 
                        />
                    </div>
                </div>
                
                <div className="p-4 border-t border-white/5 bg-[#020617]/50 space-y-3 backdrop-blur-md">
                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200"
                    >
                        <div className="flex items-center">
                            {darkMode ? (
                                <svg className="w-5 h-5 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 mr-3 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                            <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                        </div>
                        <div className={`w-9 h-5 bg-gray-700 rounded-full relative transition-colors ${darkMode ? 'bg-brand-blue' : 'bg-gray-600'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${darkMode ? 'left-5' : 'left-1'}`}></div>
                        </div>
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange hover:text-white rounded-xl transition-all duration-200 group"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                        Keluar
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300 min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white/80 dark:bg-brand-darker/80 backdrop-blur-md shadow-sm flex items-center justify-between lg:hidden px-4 sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 transition-colors">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-orange rounded-lg flex items-center justify-center text-white font-bold shadow-lg">P</div>
                <span className="text-lg font-extrabold text-gray-900 dark:text-white">Payroll<span className="text-brand-orange">Pro</span></span>
             </div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 dark:text-gray-400 hover:text-brand-blue focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
             </button>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full animate-fade-in">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};