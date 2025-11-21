import React, { useState, useEffect } from 'react';
import { POSITIONS, DEPARTMENTS } from '../services/mockData';
import { Role, User, Employee } from '../types';
import { PayrollForm } from '../components/PayrollForm';
import { EmployeeForm } from '../components/EmployeeForm';

interface Props {
    user: User;
    employees: Employee[];
    onAddEmployee: (emp: Employee) => void;
    onUpdateEmployee: (emp: Employee) => void;
    onDeleteEmployee: (id: string) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    shouldOpenModal?: boolean;
    onModalOpened?: () => void;
}

export const EmployeeList: React.FC<Props> = ({ 
    user, 
    employees, 
    onAddEmployee, 
    onUpdateEmployee, 
    onDeleteEmployee,
    showNotification,
    shouldOpenModal,
    onModalOpened
}) => {
  // State for Payroll Processing
  const [selectedEmployeeForPayroll, setSelectedEmployeeForPayroll] = useState<string | null>(null);
  const [showPayrollForm, setShowPayrollForm] = useState(false);

  // State for Employee CRUD
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Handle auto-open modal from parent prop (e.g., triggered by Dashboard)
  useEffect(() => {
      if (shouldOpenModal) {
          setEditingEmployee(null);
          setShowEmployeeForm(true);
          if (onModalOpened) {
              onModalOpened();
          }
      }
  }, [shouldOpenModal, onModalOpened]);

  const filteredEmployees = employees.filter(e => 
    e.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeIdNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionName = (posId: string) => {
    return POSITIONS.find(p => p.id === posId)?.title || 'Unknown';
  };

  const getDepartmentName = (deptId: string) => {
      return DEPARTMENTS.find(d => d.id === deptId)?.name || 'Unknown';
  };

  // --- Payroll Logic ---
  const handleProcessPayroll = (empId: string) => {
      setSelectedEmployeeForPayroll(empId);
      setShowPayrollForm(true);
  };

  const handleSavePayroll = (data: any) => {
      const emp = employees.find(e => e.id === data.employeeId);
      showNotification(`Sukses! Penggajian diproses untuk ${emp?.user.fullName}. Notifikasi email terkirim.`, 'success');
      setShowPayrollForm(false);
      setSelectedEmployeeForPayroll(null);
  };

  // --- Employee CRUD Logic ---
  const handleAddNewClick = () => {
      setEditingEmployee(null);
      setShowEmployeeForm(true);
  };

  const handleEditClick = (emp: Employee) => {
      setEditingEmployee(emp);
      setShowEmployeeForm(true);
  };

  const handleDeleteClick = (id: string) => {
      if(window.confirm("Apakah Anda yakin ingin menghapus data karyawan ini? Data yang dihapus tidak dapat dikembalikan.")) {
          onDeleteEmployee(id);
      }
  };

  const handleSaveEmployee = (data: Employee) => {
      if (editingEmployee) {
          onUpdateEmployee(data);
      } else {
          onAddEmployee(data);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  // Render Payroll Form Modal
  if (showPayrollForm && selectedEmployeeForPayroll) {
      const emp = employees.find(e => e.id === selectedEmployeeForPayroll);
      if (emp) return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-5xl animate-fade-in-up my-8">
                <PayrollForm 
                    employee={emp} 
                    onSave={handleSavePayroll} 
                    onCancel={() => setShowPayrollForm(false)} 
                />
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      
      {/* Employee Form Modal */}
      {showEmployeeForm && (
          <EmployeeForm 
              existingEmployee={editingEmployee || undefined}
              onSave={handleSaveEmployee}
              onCancel={() => {
                  setShowEmployeeForm(false);
                  setEditingEmployee(null);
              }}
          />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Direktori Karyawan</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola data karyawan, lihat detail, dan proses gaji.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="Cari nama atau NIK..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {user.role === Role.ADMIN && (
                <button 
                    onClick={handleAddNewClick}
                    className="bg-brand-blue text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-800 text-sm font-bold whitespace-nowrap transition-colors flex items-center justify-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Tambah Karyawan
                </button>
            )}
        </div>
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan & Dept</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal Masuk</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gaji Pokok</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm" src={emp.user.avatarUrl} alt="" />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{emp.user.fullName}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{emp.user.email}</div>
                                <div className="text-xs text-gray-400 font-mono mt-0.5">{emp.employeeIdNumber}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200 font-medium">{getPositionName(emp.positionId)}</div>
                        <div className="text-xs text-brand-blue bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 inline-block px-2 py-0.5 rounded mt-1">{getDepartmentName(emp.departmentId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(emp.startDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{formatIDR(emp.baseSalary)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${
                            emp.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 
                            emp.status === 'On Leave' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        }`}>
                            {emp.status === 'Active' ? 'Aktif' : emp.status === 'On Leave' ? 'Cuti' : 'Nonaktif'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-3">
                             {(user.role === Role.MANAGER || user.role === Role.ADMIN) && (
                                <button 
                                    onClick={() => handleProcessPayroll(emp.id)}
                                    title="Proses Gaji"
                                    className="text-brand-orange hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold flex items-center bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                             )}
                             {user.role === Role.ADMIN && (
                                <>
                                    <button 
                                        onClick={() => handleEditClick(emp)}
                                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                                        title="Edit Data"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(emp.id)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
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

      {/* Mobile Card View (Visible on Small Screens) */}
      <div className="md:hidden space-y-4">
        {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white dark:bg-brand-dark p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-4 relative">
                {/* Mobile Actions */}
                {user.role === Role.ADMIN && (
                    <div className="absolute top-4 right-4 flex space-x-1">
                        <button onClick={() => handleEditClick(emp)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-blue-500 rounded-md"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => handleDeleteClick(emp.id)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-red-500 rounded-md"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                )}

                <div className="flex items-start justify-between pr-16">
                     <div className="flex items-center space-x-3">
                        <img className="h-12 w-12 rounded-full object-cover border border-gray-100 dark:border-gray-600 shadow-sm" src={emp.user.avatarUrl} alt="" />
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{emp.user.fullName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{emp.user.email}</p>
                            <p className="text-xs font-mono text-gray-400 mt-0.5">{emp.employeeIdNumber}</p>
                        </div>
                     </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                            emp.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 
                            emp.status === 'On Leave' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        }`}>
                            {emp.status === 'Active' ? 'Aktif' : emp.status}
                    </span>
                     <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gaji</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatIDR(emp.baseSalary)}</p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    {(user.role === Role.MANAGER || user.role === Role.ADMIN) && (
                        <button 
                            onClick={() => handleProcessPayroll(emp.id)}
                            className="w-full py-2 bg-brand-orange text-white rounded-lg text-sm font-bold shadow-sm hover:bg-orange-600 transition-colors flex justify-center items-center"
                        >
                            Proses Gaji
                        </button>
                     )}
                </div>
            </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
            <div className="bg-white dark:bg-brand-dark p-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada karyawan ditemukan</p>
                    <p className="text-sm">Coba sesuaikan pencarian Anda atau tambah karyawan baru.</p>
                </div>
            </div>
        )}
    </div>
  );
};