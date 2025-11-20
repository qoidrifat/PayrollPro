import React from 'react';
import { USERS } from '../services/mockData';
import { User, Role } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  
  const handleLogin = (role: Role) => {
    const user = USERS.find(u => u.role === role);
    if (user) {
        onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-brand-orange p-4">
      <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-8 transform transition-all hover:scale-105 duration-500 border border-white/50 relative z-10">
        <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-brand-blue to-brand-orange rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-6 transform rotate-3 hover:rotate-12 transition-transform duration-300">
                P
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Pro</span></h1>
            <p className="text-gray-500 font-medium">Manajemen Karyawan Generasi Baru</p>
        </div>

        <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm text-indigo-800 text-center">
                <p><strong>Akses Demo</strong><br/>Pilih peran untuk masuk ke simulasi.</p>
            </div>

            <button
                onClick={() => handleLogin(Role.ADMIN)}
                className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-indigo-600 hover:to-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
            >
                Masuk sebagai Admin
            </button>

            <button
                onClick={() => handleLogin(Role.MANAGER)}
                className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-brand-orange to-pink-600 hover:from-pink-600 hover:to-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-all shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1"
            >
                Masuk sebagai Manajer
            </button>

            <button
                onClick={() => handleLogin(Role.EMPLOYEE)}
                className="w-full flex items-center justify-center px-4 py-4 border-2 border-gray-100 text-sm font-bold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1"
            >
                Masuk sebagai Karyawan
            </button>
        </div>
        
        <div className="text-center text-xs text-gray-400 mt-8 font-medium">
            &copy; 2023 PayrollPro Systems Inc. <br/> Powered by Laravel 11 & React
        </div>
      </div>
    </div>
  );
};