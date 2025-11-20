import React, { useState, useEffect } from 'react';
import { Employee, PayrollItem, PayrollStatus } from '../types';

interface PayrollFormProps {
  employee: Employee;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const PayrollForm: React.FC<PayrollFormProps> = ({ employee, onSave, onCancel }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [allowances, setAllowances] = useState<PayrollItem[]>([]);
  const [deductions, setDeductions] = useState<PayrollItem[]>([]);
  
  // Overtime State
  const [overtimeHours, setOvertimeHours] = useState(0);
  // Standard formula in Indonesia often uses 1/173
  const [overtimeRate, setOvertimeRate] = useState(Math.round(employee.baseSalary / 173)); 
  
  // New item inputs
  const [newAllowName, setNewAllowName] = useState('');
  const [newAllowAmount, setNewAllowAmount] = useState('');
  const [newDedName, setNewDedName] = useState('');
  const [newDedAmount, setNewDedAmount] = useState('');

  const baseSalary = employee.baseSalary;
  const overtimePay = overtimeHours * overtimeRate;

  const totalAllowance = allowances.reduce((sum, item) => sum + item.amount, 0);
  const totalDeduction = deductions.reduce((sum, item) => sum + item.amount, 0);
  
  // Net Salary Calculation including Overtime
  const netSalary = baseSalary + totalAllowance + overtimePay - totalDeduction;

  // Helper for IDR formatting
  const formatIDR = (num: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  // Auto-load fixed allowances on mount
  useEffect(() => {
      if (employee.fixedAllowances && employee.fixedAllowances.length > 0) {
          const fixedItems = employee.fixedAllowances.map(fa => ({
              id: `fixed_${fa.id}`,
              name: fa.name,
              amount: fa.amount
          }));
          setAllowances(prev => {
              // Prevent duplicates if already loaded (simple check)
              if(prev.length === 0) return fixedItems;
              return prev;
          });
      }
  }, [employee]);

  const addAllowance = () => {
    if (newAllowName && newAllowAmount) {
      setAllowances([...allowances, { id: Date.now().toString(), name: newAllowName, amount: parseFloat(newAllowAmount) }]);
      setNewAllowName('');
      setNewAllowAmount('');
    }
  };

  const addDeduction = () => {
    if (newDedName && newDedAmount) {
      setDeductions([...deductions, { id: Date.now().toString(), name: newDedName, amount: parseFloat(newDedAmount) }]);
      setNewDedName('');
      setNewDedAmount('');
    }
  };

  const autoCalculateDeductions = () => {
      // Simulation of BPJS and Tax logic
      const bpjsKesehatan = Math.round(baseSalary * 0.01); // Example: 1%
      const bpjsKetenagakerjaan = Math.round(baseSalary * 0.02); // Example: 2%
      const pph21 = Math.round(baseSalary * 0.05); // Example: 5%

      const newItems = [
          { id: 'bpjs_kes', name: 'BPJS Kesehatan (1%)', amount: bpjsKesehatan },
          { id: 'bpjs_ket', name: 'BPJS Ketenagakerjaan (2%)', amount: bpjsKetenagakerjaan },
          { id: 'pph21', name: 'Pajak PPh 21 (5%)', amount: pph21 },
      ];

      // Filter out if already exists to avoid duplicates
      const filteredNewItems = newItems.filter(newItem => !deductions.some(d => d.name === newItem.name));
      
      setDeductions([...deductions, ...filteredNewItems]);
  };

  const removeAllowance = (id: string) => setAllowances(allowances.filter(a => a.id !== id));
  const removeDeduction = (id: string) => setDeductions(deductions.filter(d => d.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      employeeId: employee.id,
      month,
      baseSalary,
      allowances,
      deductions,
      totalAllowance,
      totalDeduction,
      overtimePay,
      netSalary,
      status: PayrollStatus.SUBMITTED,
      issueDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-white dark:bg-brand-dark p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto transition-colors">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Proses Penggajian</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hitung gaji, tunjangan, dan lembur karyawan.</p>
          </div>
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
              <img src={employee.user.avatarUrl} className="w-8 h-8 rounded-full mr-3 border border-white dark:border-gray-600 shadow-sm" alt="" />
              <div>
                  <span className="block font-bold text-brand-blue dark:text-blue-300 text-sm leading-none">{employee.user.fullName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{employee.employeeIdNumber}</span>
              </div>
          </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info & Overtime */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Periode</label>
                <input 
                    type="month" 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)} 
                    className="block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 dark:text-white text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Gaji Pokok (Basic)</label>
                <div className="block w-full py-2 px-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-mono font-bold text-sm">
                    {formatIDR(baseSalary)}
                </div>
            </div>
             <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Lembur (Jam)</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min="0"
                        value={overtimeHours} 
                        onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)} 
                        className="block w-20 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 dark:text-white text-sm"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">x Tarif: {formatIDR(overtimeRate)}/jam</span>
                </div>
                {overtimeHours > 0 && <p className="text-xs font-bold text-green-600 mt-1">+{formatIDR(overtimePay)}</p>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Allowances Section */}
            <div className="bg-white dark:bg-brand-dark p-0">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-wide flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Tunjangan (Allowances)
                    </h3>
                </div>
                
                <div className="space-y-2 mb-4 min-h-[100px] border border-dashed border-green-200 dark:border-green-800 rounded-xl p-3">
                    {allowances.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-green-50 dark:bg-green-900/10 p-2 rounded-lg text-sm border border-green-100 dark:border-green-900/20">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                            <div className="flex items-center">
                                <span className="font-bold text-green-600 dark:text-green-400 mr-3">+{formatIDR(item.amount)}</span>
                                <button type="button" onClick={() => removeAllowance(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                            </div>
                        </div>
                    ))}
                    {allowances.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">Belum ada tunjangan</p>}
                </div>
                
                <div className="flex flex-col space-y-2">
                     <div className="flex space-x-2">
                        <input placeholder="Nama Tunjangan" value={newAllowName} onChange={e => setNewAllowName(e.target.value)} className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 dark:text-white" />
                        <input type="number" placeholder="0" value={newAllowAmount} onChange={e => setNewAllowAmount(e.target.value)} className="w-28 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 dark:text-white" />
                        <button type="button" onClick={addAllowance} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm transition-colors">Tambah</button>
                    </div>
                </div>
            </div>

            {/* Deductions Section */}
            <div className="bg-white dark:bg-brand-dark p-0">
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-wide flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Potongan (Deductions)
                    </h3>
                     <button type="button" onClick={autoCalculateDeductions} className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">Hitung PPh/BPJS Otomatis</button>
                </div>
                
                <div className="space-y-2 mb-4 min-h-[100px] border border-dashed border-red-200 dark:border-red-800 rounded-xl p-3">
                    {deductions.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-sm border border-red-100 dark:border-red-900/20">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                            <div className="flex items-center">
                                <span className="font-bold text-red-600 dark:text-red-400 mr-3">-{formatIDR(item.amount)}</span>
                                <button type="button" onClick={() => removeDeduction(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                            </div>
                        </div>
                    ))}
                     {deductions.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">Belum ada potongan</p>}
                </div>
                
                 <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                        <input placeholder="Nama Potongan" value={newDedName} onChange={e => setNewDedName(e.target.value)} className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 dark:text-white" />
                        <input type="number" placeholder="0" value={newDedAmount} onChange={e => setNewDedAmount(e.target.value)} className="w-28 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900 dark:text-white" />
                        <button type="button" onClick={addDeduction} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm transition-colors">Tambah</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 dark:bg-black text-white p-6 rounded-xl shadow-2xl mt-8 border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-700 pb-2">Ringkasan Perhitungan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <p className="text-gray-400 mb-1">Gaji Pokok</p>
                    <p className="text-lg font-mono font-medium">{formatIDR(baseSalary)}</p>
                </div>
                <div>
                    <p className="text-green-400 mb-1">Total Pendapatan</p>
                    <p className="text-lg font-mono font-medium text-green-400">+{formatIDR(totalAllowance + overtimePay)}</p>
                    <p className="text-[10px] text-gray-500">Termasuk Lembur</p>
                </div>
                <div>
                    <p className="text-red-400 mb-1">Total Potongan</p>
                    <p className="text-lg font-mono font-medium text-red-400">-{formatIDR(totalDeduction)}</p>
                </div>
                <div>
                    <p className="text-brand-blue mb-1 font-bold">GAJI BERSIH</p>
                    <p className="text-xl md:text-2xl font-mono font-bold text-white bg-white/10 inline-block px-2 rounded border border-white/10">{formatIDR(netSalary)}</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Batal</button>
            <button type="submit" className="px-6 py-2.5 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-brand-blue hover:bg-blue-800 transition-colors transform hover:-translate-y-0.5">Simpan & Setujui</button>
        </div>
      </form>
    </div>
  );
};