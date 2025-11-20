import React from 'react';
import { SYSTEM_INFO } from '../services/mockData';
import { GlobeIcon, ShieldIcon, ActivityIcon, CheckCircleIcon } from '../components/Icons';

export const About = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl">
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/20 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Sistem Berjalan Normal
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                    Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">Pro</span>
                </h1>
                <p className="text-indigo-100 text-xl leading-relaxed font-medium opacity-90">
                    Rasakan manajemen penggajian generasi berikutnya. Dibangun dengan <span className="text-white font-bold">Laravel 11</span> dan <span className="text-white font-bold">React</span> untuk kecepatan, keamanan, dan gaya.
                </p>
            </div>
            <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="text-center">
                        <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-2">Teknologi Inti</p>
                        <p className="text-5xl font-mono font-bold mb-2 tracking-tighter">PHP 8.2</p>
                        <div className="h-1 w-16 bg-pink-500 mx-auto rounded-full mb-3"></div>
                        <p className="text-sm text-indigo-100 font-medium">Laravel 11.x Framework</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Card 1 */}
          <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-brand-blue dark:text-indigo-400 mb-6">
                  <GlobeIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Database MySQL</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  Klaster MySQL 8.0 berperforma tinggi dengan mesin InnoDB memastikan kepatuhan ACID dan integritas data.
              </p>
          </div>

           {/* Stats Card 2 */}
           <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                  <ShieldIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Keamanan Sanctum</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  Dilindungi oleh Laravel Sanctum untuk otentikasi berbasis token dan perlindungan CSRF untuk permintaan API yang aman.
              </p>
          </div>

           {/* Stats Card 3 */}
           <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center text-brand-orange dark:text-pink-400 mb-6">
                  <ActivityIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Queue Workers</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  Pemrosesan asinkron untuk pembuatan PDF dan notifikasi email menggunakan Laravel Queues (Redis driver).
              </p>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* System Health */}
        <div className="flex-1 bg-white dark:bg-brand-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Status Kesehatan Server</h3>
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>
            <div className="p-8 space-y-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Layanan PHP FPM</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">Berjalan</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Koneksi MySQL</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">Terhubung</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Redis Cache</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">Aktif</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ruang Disk</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">Sehat</span>
                </div>
            </div>
        </div>

        {/* About Company */}
        <div className="flex-1 bg-white dark:bg-brand-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Detail Arsitektur</h3>
            </div>
            <div className="p-8">
                <div className="mb-8">
                    <h4 className="text-xs font-extrabold text-brand-blue dark:text-indigo-400 uppercase tracking-widest mb-3">Framework</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                        Dibangun di atas <strong className="text-gray-900 dark:text-white">Laravel 11</strong>, menggunakan arsitektur MVC. Template Blade disimulasikan melalui komponen React untuk interaksi frontend yang dinamis.
                    </p>
                </div>

                <div className="mb-8">
                     <h4 className="text-xs font-extrabold text-brand-blue dark:text-indigo-400 uppercase tracking-widest mb-3">Konfigurasi Database</h4>
                     <div className="bg-gray-50 dark:bg-[#0f172a] rounded-xl p-4 border border-gray-100 dark:border-gray-700 font-mono text-xs text-gray-600 dark:text-gray-400 space-y-2">
                        <div className="flex justify-between"><span>Host:</span> <span className="text-gray-900 dark:text-white font-bold">127.0.0.1</span></div>
                        <div className="flex justify-between"><span>Driver:</span> <span className="text-gray-900 dark:text-white font-bold">mysql</span></div>
                        <div className="flex justify-between"><span>Encoding:</span> <span className="text-gray-900 dark:text-white font-bold">utf8mb4</span></div>
                     </div>
                </div>
                
                <div className="flex items-center gap-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                        <p className="text-3xl font-black text-brand-blue dark:text-indigo-400 tracking-tighter">v11.0</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">Laravel</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-brand-blue dark:text-indigo-400 tracking-tighter">8.0</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">MySQL</p>
                    </div>
                     <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-brand-blue dark:text-indigo-400 tracking-tighter">3.2</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">Filament</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="text-center pt-8 pb-4 text-gray-400 dark:text-gray-500 text-xs font-medium">
        &copy; 2023 PayrollPro Systems | Powered by Laravel & MySQL
      </div>
    </div>
  );
};