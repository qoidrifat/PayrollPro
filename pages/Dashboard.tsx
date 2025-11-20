import React, { useMemo } from 'react';
import { Role, User, PayrollStatus } from '../types';
import { PAYROLLS, EMPLOYEES } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  
  const stats = useMemo(() => {
    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
        const totalEmployees = EMPLOYEES.length;
        const totalPayroll = PAYROLLS.reduce((acc, p) => acc + p.netSalary, 0);
        const pendingApprovals = PAYROLLS.filter(p => p.status === PayrollStatus.SUBMITTED).length;
        return { totalEmployees, totalPayroll, pendingApprovals };
    }
    return null;
  }, [user.role]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const data = [
        { name: 'Agu', amount: 45000000 },
        { name: 'Sep', amount: 48000000 },
        { name: 'Okt', amount: 47500000 },
        { name: 'Nov', amount: 52000000 },
    ];
    return data;
  }, []);

  // Employee specific stats
  const employeeStats = useMemo(() => {
     if (user.role !== Role.EMPLOYEE) return null;
     const myPayrolls = PAYROLLS.filter(p => p.employee?.userId === user.id);
     const latest = myPayrolls[myPayrolls.length - 1];
     return {
         latestSalary: latest?.netSalary || 0,
         lastMonth: latest?.month || 'N/A',
         totalReceived: myPayrolls.reduce((acc, p) => acc + p.netSalary, 0)
     }
  }, [user]);

  const formatIDR = (num: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  // Simple short formatter for charts (e.g. 1jt)
  const formatShortIDR = (num: number) => {
      return (num / 1000000).toFixed(0) + 'jt';
  }


  return (
    <div className="space-y-8 animate-fade-in">
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
      {(user.role === Role.ADMIN || user.role === Role.MANAGER) && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">+5%</span>
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Karyawan</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.totalEmployees}</p>
            </div>

            <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform duration-300 group">
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-2xl text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {stats.pendingApprovals > 0 && <span className="text-xs font-bold text-brand-orange bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-lg">Perlu Tindakan</span>}
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menunggu Review</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stats.pendingApprovals}</p>
            </div>

            <div className="bg-gradient-to-br from-brand-blue to-brand-purple p-6 rounded-3xl shadow-xl flex flex-col justify-between text-white sm:col-span-2 lg:col-span-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-indigo-100 uppercase tracking-wider">Total Dibayarkan</p>
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black mt-4 tracking-tight">{formatIDR(stats.totalPayroll)}</p>
                    <p className="text-xs text-indigo-200 mt-2 font-medium bg-white/10 inline-block px-2 py-1 rounded-lg">+12% vs bulan lalu</p>
                </div>
            </div>
        </div>
      )}

      {/* Employee Stats */}
      {user.role === Role.EMPLOYEE && employeeStats && (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl group-hover:bg-brand-blue/20 transition-colors"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider relative z-10">Gaji Terakhir ({employeeStats.lastMonth})</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mt-3 relative z-10 tracking-tighter">{formatIDR(employeeStats.latestSalary)}</p>
                    <div className="mt-4 inline-flex items-center text-sm font-bold text-brand-blue">
                        Lihat Detail <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
               </div>
               <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider relative z-10">Total Pendapatan (YTD)</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mt-3 relative z-10 tracking-tighter">{formatIDR(employeeStats.totalReceived)}</p>
                     <div className="mt-4 inline-flex items-center text-sm font-bold text-green-600">
                        +100% Pertumbuhan <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
               </div>
           </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white dark:bg-brand-dark p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ringkasan Keuangan</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Distribusi gaji bersih per bulan.</p>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                        <XAxis 
                            dataKey="name" 
                            stroke="#9CA3AF" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                            fontWeight={600}
                        />
                        <YAxis 
                            stroke="#9CA3AF" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={formatShortIDR}
                            fontWeight={600}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', padding: '12px 16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}
                            formatter={(value: number) => [formatIDR(value), 'Gaji Bersih']}
                        />
                        <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 8, 8]} barSize={32} />
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Activity / Quick Links */}
        <div className="space-y-6">
             {/* Announcements Widget */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Baru</span>
                        <h3 className="text-lg font-bold">Pembaruan Sistem 4.0</h3>
                    </div>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                        Kami telah meningkatkan backend ke Laravel 11! Rasakan proses penggajian yang lebih cepat dan log keamanan yang ditingkatkan.
                    </p>
                    <button className="text-xs font-bold bg-white text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Baca Catatan Rilis</button>
                </div>
            </div>

            <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Aksi Cepat</h3>
                <div className="space-y-4">
                    {user.role === Role.MANAGER && (
                        <button className="w-full group text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:scale-[1.02] rounded-2xl flex items-center transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                            <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange mr-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Buat Penggajian Baru</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Mulai proses gaji</p>
                            </div>
                        </button>
                    )}
                    {user.role === Role.ADMIN && (
                        <button className="w-full group text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:scale-[1.02] rounded-2xl flex items-center transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                            <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue mr-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Tambah Karyawan</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Daftarkan staf baru</p>
                            </div>
                        </button>
                    )}
                    <button className="w-full group text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:scale-[1.02] rounded-2xl flex items-center transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-xl text-gray-600 dark:text-gray-300 mr-4 group-hover:bg-gray-700 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Unduh Laporan</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">Ekspor PDF/Excel</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};