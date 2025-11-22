import React, { useState, useEffect, useMemo } from 'react';
import { Role, User } from '../types';
import { DashboardIcon, UsersIcon, CashIcon, LogoutIcon, DocumentIcon, SettingsIcon, InfoIcon, ClockIcon, LockClosedIcon } from './Icons';
import { Toast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void; // This now receives handleNavigation from App.tsx
  setIsLoading: (loading: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  closeNotification: () => void;
}

type MenuItem = 
  | { type: 'header', label: string }
  | { type: 'item', id: string, icon: any, label: string, allowedRoles: Role[] };

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab,
  setIsLoading,
  darkMode, 
  toggleDarkMode,
  notification,
  closeNotification
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Visual Active Tab State (Separated from actual activeTab to allow animation delay)
  const [visualActiveTab, setVisualActiveTab] = useState(activeTab);

  // Sync visual tab if activeTab changes externally (e.g. from Dashboard cards)
  useEffect(() => {
    setVisualActiveTab(activeTab);
  }, [activeTab]);

  // Define Menu Structure
  const MENU_ITEMS: MenuItem[] = [
    { type: 'header', label: 'Menu Utama' },
    { type: 'item', id: 'dashboard', icon: DashboardIcon, label: 'Dasbor', allowedRoles: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { type: 'item', id: 'attendance', icon: ClockIcon, label: 'Absensi', allowedRoles: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { type: 'item', id: 'employees', icon: UsersIcon, label: 'Karyawan', allowedRoles: [Role.ADMIN, Role.MANAGER] },
    { type: 'item', id: 'payroll', icon: CashIcon, label: 'Penggajian', allowedRoles: [Role.ADMIN, Role.MANAGER] },
    { type: 'item', id: 'my-payslips', icon: DocumentIcon, label: 'Slip Gaji Saya', allowedRoles: [Role.EMPLOYEE] },
    
    { type: 'header', label: 'Sistem' },
    { type: 'item', id: 'user-management', icon: LockClosedIcon, label: 'Manajemen Akun', allowedRoles: [Role.ADMIN] },
    { type: 'item', id: 'settings', icon: SettingsIcon, label: 'Pengaturan', allowedRoles: [Role.ADMIN] },
    { type: 'item', id: 'about', icon: InfoIcon, label: 'Tentang Perusahaan', allowedRoles: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  ];

  // Filter Visible Items based on Role to calculate index correctly
  const visibleItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
        if (item.type === 'header') return true;
        return item.allowedRoles.includes(user.role);
    });
  }, [user.role]);

  // Calculate position of the "Moving Box"
  const calculateTopPosition = () => {
      let cumulativeTop = 0;
      for (const item of visibleItems) {
          if (item.type === 'item' && item.id === visualActiveTab) {
              return cumulativeTop;
          }
          
          if (item.type === 'header') {
              cumulativeTop += 44; 
          } else {
              cumulativeTop += 56;
          }
      }
      return -100; // Hidden offscreen if not found
  };

  const topPosition = calculateTopPosition();

  const handleNavClick = (id: string) => {
      if (id === activeTab) return;

      // 1. Immediate Visual Feedback (Sidebar Box Moves)
      setVisualActiveTab(id);
      
      // 2. Close mobile menu
      setIsMobileMenuOpen(false);

      // 3. Trigger Parent Navigation Handler
      // This handler in App.tsx manages setIsLoading(true), waits, then switches actual tab
      setActiveTab(id);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${darkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`}>
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
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar with Very Smooth Entry */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] shadow-2xl transform transition-transform duration-1000 ease-smooth lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-80 pointer-events-none"></div>
        
        <div className="relative h-full flex flex-col">
            {/* Logo Section */}
            <div className="h-24 flex items-center px-8 bg-white/0 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 transform group-hover:rotate-6">
                        P
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-white tracking-tight leading-none">Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Pro</span></span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Enterprise</span>
                    </div>
                </div>
            </div>
            
            {/* Scrollable Menu Area */}
            <div className="flex flex-col flex-1 justify-between overflow-hidden z-10">
                <div className="px-4 py-2 overflow-y-auto custom-scrollbar relative">
                    
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

                    {/* --- NAVIGATION MENU --- */}
                    <div className="relative">
                        
                        {/* THE MOVING ACTIVE BOX (Background) */}
                        <div 
                            className="absolute left-0 w-full h-[46px] rounded-2xl bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 border border-brand-blue/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] z-0 pointer-events-none"
                            style={{ 
                                top: `${topPosition}px`,
                                transition: 'top 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                opacity: topPosition < 0 ? 0 : 1
                            }}
                        >
                            {/* Decorative Left Bar inside the Moving Box */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-brand-purple rounded-l-2xl"></div>
                            {/* Decorative Right Dot inside the Moving Box */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_10px_#ec4899]"></div>
                        </div>

                        {/* Render Items */}
                        <div className="relative z-10">
                            {visibleItems.map((item, index) => {
                                if (item.type === 'header') {
                                    return (
                                        <div key={`header-${index}`} className="px-4 h-[44px] flex items-end pb-3">
                                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                                        </div>
                                    );
                                }

                                const isActive = visualActiveTab === item.id;
                                
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item.id)}
                                        className={`w-full h-[46px] mb-[10px] flex items-center px-4 text-sm font-bold rounded-2xl transition-colors duration-500 group ${
                                            isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={`p-1 rounded-lg transition-transform duration-500 ${isActive ? 'text-brand-blue scale-110' : 'group-hover:text-brand-blue/80'}`}>
                                            {item.icon({ className: "w-5 h-5" })}
                                        </span>
                                        <span className="ml-3 tracking-wide">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                {/* Footer Controls */}
                <div className="p-4 border-t border-white/5 bg-[#020617]/50 space-y-3 backdrop-blur-md">
                    <button 
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-300"
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
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-500 ${darkMode ? 'left-5' : 'left-1'}`}></div>
                        </div>
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange hover:text-white rounded-xl transition-all duration-300 group"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                        Keluar
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-500 min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white/80 dark:bg-brand-darker/80 backdrop-blur-md shadow-sm flex items-center justify-between lg:hidden px-4 sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
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
            {/* Content Animation Container */}
            <div key={activeTab} className="max-w-7xl mx-auto w-full animate-fade-in">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};