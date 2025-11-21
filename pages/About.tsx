import React from 'react';
import { SYSTEM_INFO } from '../services/mockData';
import { GlobeIcon, ShieldIcon, ActivityIcon, CheckCircleIcon } from '../components/Icons';

export const About = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      
      {/* Modern Minimalist Header */}
      <div className="text-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-blue/20 rounded-full blur-[100px] -z-10"></div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Pro</span>
            <span className="text-lg align-top opacity-50 font-mono ml-2">v4.1</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Sistem manajemen penggajian modern yang dibangun untuk kecepatan, keamanan, dan skala perusahaan.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Main Architecture Info (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
            {/* Hero Card */}
            <div className="bg-white dark:bg-brand-dark rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Arsitektur Sistem
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Dibangun di atas fondasi <strong className="text-gray-900 dark:text-white">Laravel 11</strong> yang kokoh dengan implementasi React pada antarmuka pengguna. Menggunakan pola desain MVC (Model-View-Controller) yang disempurnakan untuk kinerja asinkronus.
                </p>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Backend</p>
                        <p className="text-lg font-black text-gray-800 dark:text-white font-mono">Laravel 11.x</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Database</p>
                        <p className="text-lg font-black text-gray-800 dark:text-white font-mono">MySQL 8.0</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Runtime</p>
                        <p className="text-lg font-black text-gray-800 dark:text-white font-mono">PHP 8.2</p>
                    </div>
                </div>
            </div>

            {/* Tech Features Grid (Inside Col 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-blue/50 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-brand-blue mb-4">
                        <ShieldIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Keamanan Sanctum</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Otentikasi berbasis token yang aman untuk setiap request API, melindungi data sensitif karyawan.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-brand-dark p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-brand-orange/50 transition-colors">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-brand-orange mb-4">
                        <ActivityIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Queue Workers</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pemrosesan latar belakang (Redis) untuk kalkulasi gaji masal dan pengiriman email slip gaji.
                    </p>
                </div>
            </div>
        </div>

        {/* Column 2: System Status & Database (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Server Health Widget */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-gray-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Server Status</p>
                        <p className="text-2xl font-bold mt-1 text-green-400">Operational</p>
                    </div>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </div>

                <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-200">PHP FPM</span>
                        </div>
                        <span className="text-xs font-mono text-green-400">OK</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-200">MySQL 8.0</span>
                        </div>
                        <span className="text-xs font-mono text-green-400">OK</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-200">Redis Cache</span>
                        </div>
                        <span className="text-xs font-mono text-green-400">OK</span>
                    </div>
                </div>
            </div>

            {/* Database Config Card */}
            <div className="bg-white dark:bg-brand-dark rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <GlobeIcon className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Koneksi Database</h4>
                </div>
                
                <div className="font-mono text-xs space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">DB_HOST</span>
                        <span className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">127.0.0.1</span>
                    </div>
                     <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">DB_PORT</span>
                        <span className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">3306</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500">Latency</span>
                        <span className="text-green-600 dark:text-green-400 font-bold">~24ms</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            &copy; 2023 PayrollPro Systems Inc.
        </p>
      </div>

    </div>
  );
};