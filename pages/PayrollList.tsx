import React, { useState } from 'react';
import { PAYROLLS } from '../services/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { User, Role, Payroll } from '../types';
import { PayslipModal } from '../components/PayslipModal';

interface Props {
    user: User;
}

export const PayrollList: React.FC<Props> = ({ user }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewingPayroll, setViewingPayroll] = useState<Payroll | null>(null);

  const allPayrolls = user.role === Role.EMPLOYEE 
    ? PAYROLLS.filter(p => p.employee?.userId === user.id)
    : PAYROLLS;

  const filteredPayrolls = allPayrolls.filter(p => {
      const matchesStatus = filter === 'All' || p.status === filter;
      const matchesSearch = p.employee?.user.fullName.toLowerCase().includes(search.toLowerCase()) || 
                            p.month.includes(search);
      return matchesStatus && matchesSearch;
  });

  const handleExport = (type: 'pdf' | 'excel') => {
      alert(`Memproses ekspor ${type.toUpperCase()} untuk ${filteredPayrolls.length} data...\nFile akan diunduh otomatis.`);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  return (
    <div className="space-y-6">
      {viewingPayroll && (
          <PayslipModal payroll={viewingPayroll} onClose={() => setViewingPayroll(null)} />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Riwayat Penggajian</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lihat, cetak, dan kelola data gaji serta slip gaji.</p>
        </div>
        
        {user.role !== Role.EMPLOYEE && (
            <div className="flex space-x-3 w-full md:w-auto">
                <button onClick={() => handleExport('excel')} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-sm font-bold hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Excel
                </button>
                <button onClick={() => handleExport('pdf')} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    PDF
                </button>
            </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-brand-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row justify-between items-center gap-4">
         <div className="w-full lg:w-auto flex overflow-x-auto pb-2 lg:pb-0 no-scrollbar space-x-1">
            {['All', 'Paid', 'Submitted', 'Approved'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        filter === status 
                        ? 'bg-brand-blue text-white shadow-md' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    {status === 'All' ? 'Semua' : status}
                </button>
            ))}
        </div>
        
        <div className="relative w-full lg:w-80">
             <input 
                type="text" 
                placeholder="Cari bulan (2023-10) atau nama..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-gray-900 dark:text-white"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referensi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detail Karyawan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Periode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keuangan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">{payroll.id.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                                <img className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-600" src={payroll.employee?.user.avatarUrl} alt="" />
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{payroll.employee?.user.fullName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{payroll.employee?.user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900 dark:text-white font-medium">{payroll.month}</div>
                         <div className="text-xs text-gray-400 mt-0.5">Tgl Terbit: {payroll.issueDate || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{formatIDR(payroll.netSalary)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Basic: {formatIDR(payroll.baseSalary)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payroll.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => setViewingPayroll(payroll)}
                            className="text-brand-blue dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-1.5 rounded-lg font-semibold transition-colors border border-blue-100 dark:border-blue-800"
                        >
                            Lihat Slip
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
         {filteredPayrolls.map((payroll) => (
            <div key={payroll.id} className="bg-white dark:bg-brand-dark p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                         <img className="h-10 w-10 rounded-full object-cover" src={payroll.employee?.user.avatarUrl} alt="" />
                         <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white">{payroll.employee?.user.fullName}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{payroll.id.toUpperCase()} • {payroll.month}</p>
                         </div>
                    </div>
                    <StatusBadge status={payroll.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gaji Bersih</p>
                        <p className="text-lg font-bold text-brand-blue dark:text-blue-400">{formatIDR(payroll.netSalary)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tgl Terbit</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{payroll.issueDate || 'Pending'}</p>
                    </div>
                </div>

                <button 
                    onClick={() => setViewingPayroll(payroll)}
                    className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                    Lihat Slip Gaji
                </button>
            </div>
         ))}
      </div>

      {filteredPayrolls.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-brand-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <p className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada data penggajian</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      )}
    </div>
  );
};