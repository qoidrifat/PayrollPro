import React, { useState } from 'react';
import { Employee, EmploymentStatus, Role, User } from '../types';
import { DEPARTMENTS, POSITIONS } from '../services/mockData';

interface Props {
  existingEmployee?: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const EmployeeForm: React.FC<Props> = ({ existingEmployee, onSave, onCancel }) => {
  // Form State
  const [fullName, setFullName] = useState(existingEmployee?.user.fullName || '');
  const [email, setEmail] = useState(existingEmployee?.user.email || '');
  const [employeeIdNumber, setEmployeeIdNumber] = useState(existingEmployee?.employeeIdNumber || '');
  const [startDate, setStartDate] = useState(existingEmployee?.startDate || new Date().toISOString().slice(0, 10));
  const [departmentId, setDepartmentId] = useState(existingEmployee?.departmentId || DEPARTMENTS[0].id);
  const [positionId, setPositionId] = useState(existingEmployee?.positionId || POSITIONS[0].id);
  const [baseSalary, setBaseSalary] = useState(existingEmployee?.baseSalary?.toString() || '2400000');
  const [status, setStatus] = useState<EmploymentStatus>(existingEmployee?.status || EmploymentStatus.ACTIVE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct User Object
    const userObj: User = existingEmployee?.user || {
        id: `u_${Date.now()}`,
        fullName,
        email,
        role: Role.EMPLOYEE,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
    };
    
    // Construct Employee Object
    const employeeObj: Employee = {
        id: existingEmployee?.id || `e_${Date.now()}`,
        userId: userObj.id,
        employeeIdNumber,
        startDate,
        departmentId,
        positionId,
        baseSalary: parseFloat(baseSalary),
        status,
        user: {
            ...userObj,
            fullName, // Update in case changed
            email     // Update in case changed
        },
        fixedAllowances: existingEmployee?.fixedAllowances || [] // Preserve existing allowances or init empty
    };

    onSave(employeeObj);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-brand-dark w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {existingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">Informasi Pribadi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                        <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" placeholder="Contoh: Budi Santoso" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" placeholder="budi@perusahaan.com" />
                    </div>
                </div>
            </div>

            {/* Section 2: Employment Details */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">Detail Pekerjaan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Induk (NIK)</label>
                        <input required type="text" value={employeeIdNumber} onChange={e => setEmployeeIdNumber(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" placeholder="EMP-2023-001" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Masuk</label>
                        <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departemen</label>
                        <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm">
                            {DEPARTMENTS.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jabatan</label>
                        <select value={positionId} onChange={e => setPositionId(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm">
                            {POSITIONS.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

             {/* Section 3: Salary & Status */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">Gaji & Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gaji Pokok (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                            <input required type="number" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Karyawan</label>
                        <select value={status} onChange={e => setStatus(e.target.value as EmploymentStatus)} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm">
                            {Object.values(EmploymentStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
            <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Batal
            </button>
            <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-brand-blue rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                {existingEmployee ? 'Simpan Perubahan' : 'Tambah Karyawan'}
            </button>
        </div>
      </div>
    </div>
  );
};