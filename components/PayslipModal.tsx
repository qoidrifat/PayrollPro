import React from 'react';
import { Payroll, PayrollStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  payroll: Payroll;
  onClose: () => void;
}

export const PayslipModal: React.FC<Props> = ({ payroll, onClose }) => {
  if (!payroll.employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-3xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header / Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 print:hidden sticky top-0 z-10">
            <h3 className="text-lg font-bold text-gray-800">Pratinjau Slip Gaji</h3>
            <div className="flex space-x-3">
                <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Cetak
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* Payslip Content */}
        <div className="p-6 sm:p-10 bg-white overflow-y-auto print:p-0" id="printable-payslip">
            
            {/* Company Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 border-b-2 border-brand-blue pb-6">
                <div className="mb-6 sm:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold">P</div>
                         <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payroll<span className="text-brand-orange">Pro</span></h1>
                    </div>
                    <p className="text-sm text-gray-500">Jl. Jendral Sudirman No. 123, Jakarta</p>
                    <p className="text-sm text-gray-500">keuangan@payrollpro.id</p>
                </div>
                <div className="text-left sm:text-right">
                    <h2 className="text-3xl font-black text-gray-200 uppercase tracking-tighter leading-none">SLIP GAJI</h2>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600"><span className="text-gray-400 uppercase text-xs font-semibold mr-2">Periode:</span><span className="font-mono font-bold">{payroll.month}</span></p>
                        <p className="text-sm text-gray-600"><span className="text-gray-400 uppercase text-xs font-semibold mr-2">Ref #:</span><span className="font-mono font-bold">{payroll.id.toUpperCase()}</span></p>
                    </div>
                    <div className="mt-3">
                        <StatusBadge status={payroll.status} />
                    </div>
                </div>
            </div>

            {/* Employee Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Karyawan</p>
                        <p className="font-bold text-gray-900">{payroll.employee.user.fullName}</p>
                        <p className="text-xs text-gray-500">{payroll.employee.user.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Nomor Induk</p>
                        <p className="font-bold text-gray-900 font-mono">{payroll.employee.employeeIdNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Departemen</p>
                        <p className="font-bold text-gray-900">Teknologi Informasi</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Tanggal Bayar</p>
                        <p className="font-bold text-gray-900">{payroll.issueDate || 'Pending'}</p>
                    </div>
                </div>
            </div>

            {/* Financials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Earnings */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-green-50/50 px-4 py-3 border-b border-green-100">
                        <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider">Pendapatan</h4>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm border-b border-dashed border-gray-200 pb-2">
                            <span className="text-gray-600 font-medium">Gaji Pokok</span>
                            <span className="font-mono font-bold text-gray-900">{formatIDR(payroll.baseSalary)}</span>
                        </div>
                        {payroll.allowances.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name}</span>
                                <span className="font-mono text-gray-900">{formatIDR(item.amount)}</span>
                            </div>
                        ))}
                        <div className="pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold text-gray-700 text-sm">Total Pendapatan</span>
                            <span className="font-bold text-green-600 font-mono">{formatIDR(payroll.baseSalary + payroll.totalAllowance)}</span>
                        </div>
                    </div>
                </div>

                {/* Deductions */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-red-50/50 px-4 py-3 border-b border-red-100">
                         <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider">Potongan</h4>
                    </div>
                    <div className="p-4 space-y-3">
                        {payroll.deductions.map(item => (
                            <div key={item.id} className="flex justify-between text-sm border-b border-dashed border-gray-200 pb-2">
                                <span className="text-gray-600">{item.name}</span>
                                <span className="font-mono text-gray-900">-{formatIDR(item.amount)}</span>
                            </div>
                        ))}
                        {payroll.deductions.length === 0 && <p className="text-sm text-gray-400 italic py-2">Tidak ada potongan.</p>}
                        <div className="pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold text-gray-700 text-sm">Total Potongan</span>
                            <span className="font-bold text-red-600 font-mono">-{formatIDR(payroll.totalDeduction)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Pay */}
            <div className="bg-gray-900 rounded-xl p-6 text-white flex flex-col sm:flex-row justify-between items-center shadow-lg print:bg-white print:border print:border-gray-900 print:text-black">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider print:text-gray-600">Jumlah Bersih Diterima</p>
                    <p className="text-xs text-gray-500 mt-1 print:hidden">Transfer diproses ke rekening terdaftar</p>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight">
                    {formatIDR(payroll.netSalary)}
                </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-1">PayrollPro Inc. • Dibuat pada {new Date().toLocaleDateString('id-ID')}</p>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Dokumen Dibuat Sistem • Tidak Perlu Tanda Tangan Basah</p>
            </div>
        </div>
      </div>
    </div>
  );
};