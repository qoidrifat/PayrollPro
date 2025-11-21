import React, { useState } from 'react';
import { EMPLOYEES } from '../services/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { User, Role, Payroll, Employee } from '../types';
import { PayslipModal } from '../components/PayslipModal';
import { PayrollForm } from '../components/PayrollForm';

interface Props {
    user: User;
    payrolls: Payroll[];
    onAddPayroll: (payroll: Payroll) => void;
    onUpdatePayroll: (payroll: Payroll) => void;
    onDeletePayroll: (id: string) => void;
}

export const PayrollList: React.FC<Props> = ({ user, payrolls, onAddPayroll, onUpdatePayroll, onDeletePayroll }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [viewingPayroll, setViewingPayroll] = useState<Payroll | null>(null);
  
  // Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEmployeeForCreate, setSelectedEmployeeForCreate] = useState<Employee | null>(null);

  // Edit State
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);

  const handleExport = (type: 'pdf' | 'excel') => {
      alert(`Memproses ekspor ${type.toUpperCase()}...\nFile akan diunduh otomatis.`);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  // --- CRUD Operations via Props ---

  // 1. CREATE Logic
  const handleStartCreate = () => {
      setIsCreateModalOpen(true);
  };

  const handleSelectEmployee = (emp: Employee) => {
      setIsCreateModalOpen(false);
      setSelectedEmployeeForCreate(emp);
  };

  const handleSaveNewPayroll = (data: any) => {
      const newPayroll: Payroll = {
          ...data, // Spread data first to avoid overwriting ID with undefined
          id: `pr-${Date.now()}`,
          employee: selectedEmployeeForCreate // Ensure employee object is attached
      };
      
      onAddPayroll(newPayroll);
      setSelectedEmployeeForCreate(null);
  };

  // 2. UPDATE Logic
  const handleStartEdit = (payroll: Payroll) => {
      setEditingPayroll(payroll);
  };

  const handleSaveEditPayroll = (data: any) => {
      // Merge updated data into existing object logic handles in App.tsx based on ID
      const updatedData = { ...editingPayroll, ...data }; 
      onUpdatePayroll(updatedData);
      setEditingPayroll(null);
  };

  // 3. DELETE Logic
  const handleDelete = (id: string) => {
      if (window.confirm('Apakah Anda yakin ingin menghapus data penggajian ini? Tindakan ini tidak dapat dibatalkan.')) {
          onDeletePayroll(id);
      }
  };

  // --- Filtering ---
  const allPayrolls = user.role === Role.EMPLOYEE 
    ? payrolls.filter(p => p.employee?.userId === user.id)
    : payrolls;

  // Sort by ID descending (newest first)
  const sortedPayrolls = [...allPayrolls].sort((a, b) => {
      // Guard against potential undefined IDs to prevent crashes
      const idA = a.id || '';
      const idB = b.id || '';
      return idB.localeCompare(idA);
  });

  const filteredPayrolls = sortedPayrolls.filter(p => {
      const matchesStatus = filter === 'All' || p.status === filter;
      const matchesSearch = p.employee?.user.fullName.toLowerCase().includes(search.toLowerCase()) || 
                            p.month.includes(search);
      return matchesStatus && matchesSearch;
  });

  const canManage = user.role === Role.ADMIN || user.role === Role.MANAGER;

  return (
    <div className="space-y-6 relative">
      
      {/* Modal View Payslip */}
      {viewingPayroll && (
          <PayslipModal payroll={viewingPayroll} onClose={() => setViewingPayroll(null)} />
      )}

      {/* Modal Create: Step 1 (Select Employee) */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-fade-in-up border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pilih Karyawan</h3>
                      <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <div className="overflow-y-auto p-4 space-y-2">
                      {EMPLOYEES.map(emp => (
                          <button 
                            key={emp.id} 
                            onClick={() => handleSelectEmployee(emp)}
                            className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-brand-blue transition-all text-left"
                          >
                               <img src={emp.user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                               <div>
                                   <p className="font-bold text-gray-900 dark:text-white text-sm">{emp.user.fullName}</p>
                                   <p className="text-xs text-gray-500">{emp.employeeIdNumber}</p>
                               </div>
                          </button>
                      ))}
                  </div>
             </div>
          </div>
      )}

      {/* Form Overlay (Create) */}
      {selectedEmployeeForCreate && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-5xl animate-fade-in-up my-8">
                  <PayrollForm 
                    employee={selectedEmployeeForCreate} 
                    onSave={handleSaveNewPayroll} 
                    onCancel={() => setSelectedEmployeeForCreate(null)} 
                   />
              </div>
          </div>
      )}

      {/* Form Overlay (Edit) */}
      {editingPayroll && editingPayroll.employee && (
           <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-5xl animate-fade-in-up my-8">
                  <PayrollForm 
                    employee={editingPayroll.employee} 
                    existingPayroll={editingPayroll}
                    onSave={handleSaveEditPayroll} 
                    onCancel={() => setEditingPayroll(null)} 
                   />
              </div>
          </div>
      )}


      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manajemen Penggajian</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lihat, proses, dan kelola data gaji karyawan.</p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
            {canManage && (
                <button 
                    onClick={handleStartCreate}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Buat Penggajian
                </button>
            )}
            {user.role !== Role.EMPLOYEE && (
                <>
                    <button onClick={() => handleExport('excel')} className="flex-none flex items-center justify-center px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                </>
            )}
        </div>
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
      <div className="hidden md:block bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ref & Periode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keuangan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                             <span className="font-mono text-xs font-bold text-gray-500 uppercase mb-1">{payroll.id}</span>
                             <span className="text-sm font-bold text-gray-900 dark:text-white">{payroll.month}</span>
                             {/* New badge for newly added items could go here */}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                                <img className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-600" src={payroll.employee?.user.avatarUrl} alt="" />
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{payroll.employee?.user.fullName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{payroll.employee?.positionId ? 'Karyawan Tetap' : 'Kontrak'}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{formatIDR(payroll.netSalary)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex gap-2">
                             <span className="text-green-600">+{formatIDR(payroll.totalAllowance)}</span>
                             <span className="text-red-500">-{formatIDR(payroll.totalDeduction)}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payroll.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                             {/* View Slip */}
                             <button 
                                onClick={() => setViewingPayroll(payroll)}
                                className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Lihat Slip"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>

                            {/* Edit & Delete (Only for Admins/Managers) */}
                            {canManage && (
                                <>
                                    <button 
                                        onClick={() => handleStartEdit(payroll)}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        title="Edit Data"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(payroll.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Hapus Data"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
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
            <div key={payroll.id} className="bg-white dark:bg-brand-dark p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-4 relative">
                 {/* Action Menu Absolute Top Right */}
                 {canManage && (
                    <div className="absolute top-4 right-4 flex space-x-1">
                        <button onClick={() => handleStartEdit(payroll)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md hover:text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={() => handleDelete(payroll.id)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                 )}

                <div className="flex justify-between items-start pr-16">
                    <div className="flex items-center space-x-3">
                         <img className="h-10 w-10 rounded-full object-cover" src={payroll.employee?.user.avatarUrl} alt="" />
                         <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white">{payroll.employee?.user.fullName}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{payroll.month}</p>
                         </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <StatusBadge status={payroll.status} />
                     </div>
                     <div className="text-right">
                         <p className="text-xs text-gray-500">Gaji Bersih</p>
                         <p className="text-lg font-bold text-brand-blue dark:text-blue-400">{formatIDR(payroll.netSalary)}</p>
                     </div>
                </div>

                <button 
                    onClick={() => setViewingPayroll(payroll)}
                    className="w-full py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                    Lihat Slip Gaji
                </button>
            </div>
         ))}
      </div>

      {filteredPayrolls.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-brand-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada data penggajian</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Data kosong atau tidak cocok dengan pencarian.</p>
            {canManage && (
                 <button onClick={handleStartCreate} className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                     Buat Penggajian Baru
                 </button>
            )}
        </div>
      )}
    </div>
  );
};