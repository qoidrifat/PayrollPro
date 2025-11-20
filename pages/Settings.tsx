import React, { useState } from 'react';
import { AUDIT_LOGS } from '../services/mockData';
import { Role } from '../types';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'audit' | 'integrations'>('general');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Konfigurasi Sistem</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola pengaturan global, log keamanan, dan integrasi.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('general')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'general'
                    ? 'border-brand-blue text-brand-blue dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
            >
                Preferensi Umum
            </button>
            <button
                onClick={() => setActiveTab('database')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'database'
                    ? 'border-brand-blue text-brand-blue dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
            >
                Database (MySQL)
            </button>
            <button
                onClick={() => setActiveTab('audit')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'audit'
                    ? 'border-brand-blue text-brand-blue dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
            >
                Log Keamanan
            </button>
            <button
                onClick={() => setActiveTab('integrations')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'integrations'
                    ? 'border-brand-blue text-brand-blue dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
            >
                Integrasi
            </button>
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-brand-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detail Perusahaan</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Legal Perusahaan</label>
                        <input type="text" disabled value="PT. PayrollPro Indonesia Tbk." className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NPWP / Tax ID</label>
                        <input type="text" disabled value="01.234.567.8-901.000" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm" />
                    </div>
                    <div className="flex gap-4">
                         <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mata Uang</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
                                <option>IDR (Rp)</option>
                                <option>USD ($)</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zona Waktu</label>
                             <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
                                <option>WIB (GMT+7)</option>
                                <option>WITA (GMT+8)</option>
                                <option>WIT (GMT+9)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Simpan Perubahan</button>
                </div>
            </div>

            <div className="bg-white dark:bg-brand-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Konfigurasi Laravel</h3>
                <div className="space-y-4">
                     <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">APP_DEBUG</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Aktifkan mode debug untuk pengembangan</p>
                        </div>
                        <button className="bg-gray-200 dark:bg-gray-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                            <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                         <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Queue Worker (Redis)</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Proses job di latar belakang</p>
                        </div>
                        <button className="bg-green-500 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                            <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Database Tab */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-brand-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Status Koneksi MySQL</h3>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Terhubung
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">DB_HOST</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">127.0.0.1</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">DB_PORT</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">3306</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">DB_DATABASE</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">payroll_pro_db</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">DB_USERNAME</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">admin_user</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Koneksi Aktif</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">5 / 100</p>
                     </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uptime</p>
                         <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-1">14h 2j 15m</p>
                     </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Status Migrasi:</strong> Semua tabel (users, employees, payrolls, migrations) sudah diperbarui.
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Log Laravel Terkini</h3>
                <button className="text-brand-blue dark:text-blue-400 text-sm font-medium hover:underline">Ekspor Log (CSV)</button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {AUDIT_LOGS.map((log) => (
                    <li key={log.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${
                                    log.status === 'Success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                                    log.status === 'Warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {log.status === 'Success' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                                        {log.status === 'Warning' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
                                        {log.status === 'Error' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{log.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.details}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-900 dark:text-white">{log.user}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{log.timestamp}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
             <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
                 <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Muat aktivitas lainnya...</button>
             </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
          <div className="space-y-6 animate-fade-in">
              {/* Banking */}
              <div className="bg-white dark:bg-brand-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Layanan Perbankan</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola penyedia Transfer Gaji (Payroll).</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-bold rounded uppercase">Aktif</span>
                  </div>
                  <div className="border dark:border-gray-600 rounded-lg p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                       <div className="flex items-center">
                           <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold mr-4">B</div>
                           <div>
                               <p className="font-bold text-gray-900 dark:text-white">BCA KlikBisnis</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">Corporate ID: •••• 4432</p>
                           </div>
                       </div>
                       <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Konfigurasi</button>
                  </div>
              </div>

              {/* Accounting */}
              <div className="bg-white dark:bg-brand-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Software Akuntansi</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Sinkronisasi data gaji ke buku besar.</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="border dark:border-gray-600 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer opacity-60 hover:opacity-100 dark:bg-gray-800/50">
                           <div className="flex items-center">
                               <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold mr-4">J</div>
                               <div>
                                   <p className="font-bold text-gray-900 dark:text-white">Jurnal.id</p>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">Hubungkan</p>
                               </div>
                           </div>
                       </div>
                        <div className="border dark:border-gray-600 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer opacity-60 hover:opacity-100 dark:bg-gray-800/50">
                           <div className="flex items-center">
                               <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">A</div>
                               <div>
                                   <p className="font-bold text-gray-900 dark:text-white">Accurate Online</p>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">Hubungkan</p>
                               </div>
                           </div>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};