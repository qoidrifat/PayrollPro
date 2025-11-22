import React, { useMemo, useState } from 'react';
import { Role, User, PayrollStatus, Employee, Payroll } from '../types';
import { EMPLOYEES } from '../services/mockData'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PayrollForm } from '../components/PayrollForm';
import { UsersIcon, CashIcon, DocumentIcon } from '../components/Icons';

interface DashboardProps {
  user: User;
  payrolls: Payroll[]; // Receive dynamic payrolls
  onAddPayroll: (payroll: Payroll) => void;
  onNavigate: (tab: string) => void;
  onQuickAddEmployee?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, payrolls, onAddPayroll, onNavigate, onQuickAddEmployee }) => {
  // State for Payroll Creation Workflow
  const [showEmployeeSelectModal, setShowEmployeeSelectModal] = useState(false);
  const [selectedEmployeeForPayroll, setSelectedEmployeeForPayroll] = useState<Employee | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const isAdminOrManager = user.role === Role.ADMIN || user.role === Role.MANAGER;

  // Dynamic Stats Calculation
  const stats = useMemo(() => {
    if (isAdminOrManager) {
        const totalEmployees = EMPLOYEES.length;
        // Calculate real total payroll from passed props
        const totalPayroll = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);
        const pendingApprovals = payrolls.filter(p => p.status === PayrollStatus.SUBMITTED).length;
        return { totalEmployees, totalPayroll, pendingApprovals };
    } else {
        // Employee Specific Stats
        const myPayrolls = payrolls.filter(p => p.employee?.userId === user.id);
        const totalReceived = myPayrolls
            .filter(p => p.status === PayrollStatus.PAID)
            .reduce((acc, curr) => acc + curr.netSalary, 0);
        return { totalReceived };
    }
  }, [user.role, user.id, payrolls, isAdminOrManager]);

  // --- Dynamic Chart Data Preparation ---
  const chartData = useMemo(() => {
    // 1. Filter Payrolls based on Role
    let relevantPayrolls = payrolls;
    if (!isAdminOrManager) {
        // For Employees: Only show their own payrolls
        relevantPayrolls = payrolls.filter(p => p.employee?.userId === user.id);
    }

    // 2. Group by Month (YYYY-MM) and Sum Amounts
    // Use a Map to aggregate data
    const groupedData: { [key: string]: number } = {};

    relevantPayrolls.forEach(p => {
        const monthKey = p.month; // e.g. "2023-10"
        if (!groupedData[monthKey]) {
            groupedData[monthKey] = 0;
        }
        groupedData[monthKey] += p.netSalary;
    });

    // 3. Transform to Array and Sort by Date
    const sortedKeys = Object.keys(groupedData).sort(); // Sorts strings "2023-01", "2023-02" correctly
    
    // Take only the last 6 months for cleaner chart if data is huge
    const recentKeys = sortedKeys.slice(-6); 

    return recentKeys.map(key => {
        // Parse YYYY-MM to get readable month name
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });
        
        return {
            name: `${monthName} ${year.slice(2)}`, // e.g. "Okt 23"
            amount: groupedData[key],
            fullDate: key
        };
    });
  }, [payrolls, user.id, isAdminOrManager]);

  const formatShortIDR = (num: number) => {
      return (num / 1000000).toFixed(1) + 'jt';
  };

  // --- CRUD Handlers for Quick Action ---

  const handleCreatePayrollClick = () => {
    setShowEmployeeSelectModal(true);
  };

  const handleSelectEmployee = (employee: Employee) => {
      setShowEmployeeSelectModal(false);
      setSelectedEmployeeForPayroll(employee);
  };

  const handleSavePayroll = (data: any) => {
      // Construct the full Payroll object
      if (!selectedEmployeeForPayroll) return;

      const newPayroll: Payroll = {
        ...data, // Spread data first so undefined id from form doesn't overwrite generated id
        id: `pr-${Date.now()}`,
        employee: selectedEmployeeForPayroll
      };

      // Call parent handler to update global state
      onAddPayroll(newPayroll);

      setSelectedEmployeeForPayroll(null);
      setShowSuccessToast(true);
      
      // Hide toast after 5 seconds if not clicked
      setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleCheckPayroll = () => {
      onNavigate('payroll');
  };

  const handleQuickAddEmployeeClick = () => {
      if (onQuickAddEmployee) {
          onQuickAddEmployee();
      } else {
          onNavigate('employees');
      }
  };

  const handleExportReport = (type: 'pdf' | 'excel') => {
      const title = type === 'pdf' ? 'Laporan PDF' : 'Laporan Excel';
      alert(`Sedang memproses ${title}...\n\nSistem sedang mengompilasi data penggajian bulan ini. File akan diunduh otomatis dalam beberapa detik.`);
  };

  // --------------------------------------

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* --- Success Toast for Quick Action --- */}
      {showSuccessToast && (
           <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up cursor-pointer" onClick={handleCheckPayroll}>
            <div className={`bg-green-500 rounded-lg shadow-lg p-4 flex items-center justify-between space-x-3 max-w-md border border-white/10 hover:bg-green-600 transition-colors`}>
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex-1 text-white text-sm font-medium">
                        Penggajian berhasil dibuat!
                        <span className="block text-xs opacity-80 underline mt-1">Klik untuk cek detail di List.</span>
                    </div>
                </div>
                <button className="text-white hover:text-gray-200" onClick={(e) => { e.stopPropagation(); setShowSuccessToast(false); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            </div>
      )}

      {/* --- Step 1: Select Employee Modal --- */}
      {showEmployeeSelectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pilih Karyawan</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pilih karyawan untuk membuat penggajian baru.</p>
                      </div>
                      <button onClick={() => setShowEmployeeSelectModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <div className="overflow-y-auto p-6 space-y-3">
                      {EMPLOYEES.map(emp => (
                          <button 
                            key={emp.id} 
                            onClick={() => handleSelectEmployee(emp)}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-brand-blue/5 hover:border-brand-blue dark:hover:bg-brand-blue/20 transition-all group"
                          >
                              <div className="flex items-center space-x-4">
                                  <img src={emp.user.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600" />
                                  <div className="text-left">
                                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue">{emp.user.fullName}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{emp.employeeIdNumber}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                   <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:bg-white group-hover:shadow-sm">Pilih</span>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- Step 2: Payroll Form Overlay --- */}
      {selectedEmployeeForPayroll && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-5xl animate-fade-in-up my-8">
                  <PayrollForm 
                    employee={selectedEmployeeForPayroll} 
                    onSave={handleSavePayroll} 
                    onCancel={() => setSelectedEmployeeForPayroll(null)} 
                   />
              </div>
          </div>
      )}


      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">{user.fullName.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Mari buat hari ini produktif.</p>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-brand-dark px-5 py-3 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex items-center self-start sm:self-auto">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
      </div>

      {/* Admin / Manager Stats Cards */}
      {isAdminOrManager && stats && (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    onClick={() => onNavigate('employees')}
                    className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                            <UsersIcon className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">+5%</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Karyawan</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalEmployees}</p>
                </div>

                <div 
                    onClick={() => onNavigate('payroll')}
                    className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <CashIcon className="w-8 h-8" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Penggajian</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{formatShortIDR(stats.totalPayroll)}</p>
                </div>

                <div 
                    onClick={() => onNavigate('payroll')}
                    className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                            <DocumentIcon className="w-8 h-8" />
                        </div>
                        {stats.pendingApprovals > 0 && <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">Butuh Aksi</span>}
                    </div>
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menunggu Approval</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.pendingApprovals}</p>
                </div>
            </div>

            {/* QUICK ACTION SECTION */}
            <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aksi Cepat</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pintasan untuk tugas administrasi & pelaporan.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                        {/* Create Payroll */}
                        <button 
                            onClick={handleCreatePayrollClick}
                            className="flex items-center px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Buat Penggajian
                        </button>

                        {/* Add Employee */}
                        <button 
                            onClick={handleQuickAddEmployeeClick}
                            className="flex items-center px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            Tambah Karyawan
                        </button>

                        {/* Export Group */}
                        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                            <button 
                                onClick={() => handleExportReport('pdf')}
                                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center"
                                title="Unduh PDF"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                PDF
                            </button>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            <button 
                                onClick={() => handleExportReport('excel')}
                                className="px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center"
                                title="Unduh Excel"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                XLS
                            </button>
                        </div>
                </div>
            </div>
        </>
      )}
      
      {/* Employee Personal Stats */}
      {!isAdminOrManager && stats && (
           <div className="bg-gradient-to-br from-brand-blue to-indigo-800 rounded-3xl p-8 text-white shadow-xl">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div>
                       <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Status</p>
                       <p className="text-4xl font-black mt-2">Aktif</p>
                   </div>
                   <div>
                       <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Total Diterima</p>
                       <p className="text-2xl font-bold mt-2 opacity-90">
                           {/* Use dynamic IDR formatter logic inline or reuse a helper if available */}
                           {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.totalReceived || 0)}
                       </p>
                   </div>
                   <div className="flex items-center">
                       <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 w-full">
                           <p className="text-sm font-medium">Cek slip gaji anda di menu Penggajian.</p>
                       </div>
                   </div>
               </div>
           </div>
      )}

      {/* Shared Chart Section for All Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    {isAdminOrManager ? 'Tren Total Penggajian (Bulanan)' : 'Riwayat Pendapatan Gaji Anda'}
                </h3>
                
                {chartData.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={formatShortIDR} />
                                <Tooltip 
                                    cursor={{fill: '#F3F4F6'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                    formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                                />
                                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 w-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <p>Belum ada data penggajian</p>
                    </div>
                )}
            </div>
            
            {/* Side Activity or Info Panel */}
            {isAdminOrManager ? (
                <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aktivitas Terkini</h3>
                    <div className="space-y-4">
                        {payrolls.slice(0, 3).map(p => (
                             <div 
                                key={p.id} 
                                onClick={() => onNavigate('payroll')}
                                className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3 text-green-600">
                                    <CashIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-blue">Gaji {p.employee?.user.fullName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.month}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                 <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informasi Penting</h3>
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
                         <p className="text-sm text-blue-800 dark:text-blue-200">Gaji bulan ini diproses pada tanggal 25. Pastikan data absensi Anda sudah benar.</p>
                     </div>
                     <button onClick={() => onNavigate('my-payslips')} className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                         Lihat Semua Slip Gaji
                     </button>
                 </div>
            )}
      </div>

    </div>
  );
};