import React, { useState, useEffect } from 'react';
import { USERS } from '../services/mockData';
import { User, Role } from '../types';

// --- Typewriter Component (No Blinking Cursor) ---
interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 0, speed = 30, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
        setStarted(true);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            setDisplayedText(text.slice(0, i + 1));
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);

    return () => clearInterval(timer);
  }, [started, text, speed]);
  
  useEffect(() => {
      setDisplayedText('');
      setStarted(false);
      const startTimer = setTimeout(() => {
          setStarted(true);
      }, delay);
      return () => clearTimeout(startTimer);
  }, [text, delay]);

  return (
    <span className={`${className} font-light tracking-wide`}>
        {displayedText}
    </span>
  );
};

interface LoginProps {
  onLogin: (user: User) => void;
  users?: User[]; 
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  
  const userList = users || USERS;

  const toggleMode = (mode: boolean) => {
      setIsRegister(mode);
      setAnimKey(prev => prev + 1);
  };

  const handleDemoLogin = (role: Role) => {
    const user = userList.find(u => u.role === role);
    if (user) {
        onLogin(user);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isRegister) {
          if (!formData.fullName || !formData.email || !formData.password) {
              alert("Mohon lengkapi data pendaftaran.");
              return;
          }
          
          if (formData.password !== formData.confirmPassword) {
              alert("Konfirmasi kata sandi tidak cocok.");
              return;
          }

          const newUser: User = {
              id: `u_${Date.now()}`,
              fullName: formData.fullName,
              email: formData.email,
              role: Role.EMPLOYEE,
              avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
          };
          
          alert("Registrasi Berhasil! Anda masuk sebagai Karyawan (Simulasi).");
          onLogin(newUser);
      } else {
          const foundUser = userList.find(u => u.email === formData.email);
          if (foundUser) {
              onLogin(foundUser);
          } else {
              if (formData.email) {
                   const demoUser: User = {
                        id: 'demo_user',
                        fullName: formData.email.split('@')[0],
                        email: formData.email,
                        role: Role.EMPLOYEE,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email)}&background=random`
                   };
                   onLogin(demoUser);
              } else {
                   alert("Masukkan email.");
              }
          }
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden transition-all duration-1000 ease-smooth">
       {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] animate-pulse transition-all duration-1000 ease-smooth ${isRegister ? 'translate-x-20' : 'translate-x-0'}`}></div>
          <div className={`absolute top-40 -left-20 w-72 h-72 bg-brand-orange/20 rounded-full blur-[100px] transition-all duration-1000 ease-smooth ${isRegister ? 'translate-y-20' : 'translate-y-0'}`}></div>
      </div>

      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden border border-white/10 relative z-10 min-h-[650px] transition-all duration-500">
        
        {/* Left Side: Brand & Info */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-brand-blue/90 to-indigo-950/90 p-12 flex-col justify-center relative transition-all duration-1000 ease-smooth">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg backdrop-blur-sm">
                        P
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">PayrollPro</span>
                </div>
                
                <div className="space-y-6 min-h-[200px]">
                    <h1 className="text-4xl font-bold text-white leading-tight h-32">
                        <Typewriter 
                            key={`head-${animKey}`} 
                            text={isRegister ? 'Bergabunglah dengan Revolusi Payroll.' : 'Selamat Datang Kembali.'} 
                            speed={40}
                        />
                    </h1>
                    
                    <div className="text-indigo-100 text-lg leading-relaxed font-light h-24">
                        <Typewriter 
                            key={`desc-${animKey}`} 
                            text={isRegister 
                                ? 'Buat akun untuk mulai mengelola data karyawan, slip gaji, dan absensi dengan sistem termodern.'
                                : 'Kelola gaji, absensi, dan data karyawan dalam satu platform terintegrasi. Efisien, Akurat, dan Aman.'
                            }
                            delay={isRegister ? 1500 : 1000} 
                            speed={25}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-gray-900 overflow-y-auto transition-colors duration-500">
            <div className="text-center mb-8 md:hidden">
                 <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Payroll<span className="text-brand-orange">Pro</span></h1>
            </div>

            <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700 relative">
                <button 
                    onClick={() => toggleMode(false)}
                    className={`pb-3 px-6 text-sm font-bold transition-all duration-300 relative z-10 ${!isRegister ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Masuk
                </button>
                <button 
                    onClick={() => toggleMode(true)}
                    className={`pb-3 px-6 text-sm font-bold transition-all duration-300 relative z-10 ${isRegister ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Daftar
                </button>
                
                <div 
                    className={`absolute bottom-0 h-0.5 bg-brand-blue rounded-t-full transition-all duration-500 ease-smooth`}
                    style={{
                        width: '50px',
                        left: isRegister ? 'calc(50% + 18px)' : 'calc(50% - 68px)'
                    }}
                ></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div key={isRegister ? 'reg' : 'login'} className="animate-fade-in space-y-5">
                    
                    {isRegister && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all dark:text-white text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Alamat Email</label>
                        <div className="relative group">
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all dark:text-white text-sm"
                                placeholder="nama@perusahaan.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Kata Sandi</label>
                        <div className="relative group">
                            <input 
                                type="password" 
                                required
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all dark:text-white text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isRegister && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Konfirmasi Kata Sandi</label>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    required
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all dark:text-white text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-brand-blue text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200"
                    >
                        {isRegister ? 'Buat Akun Baru' : 'Masuk ke Akun'}
                    </button>
                </div>
            </form>

            <div className={`mt-8 transition-opacity duration-500 ${isRegister ? 'opacity-0 pointer-events-none h-0' : 'opacity-100 h-auto'}`}>
                {!isRegister && (
                    <div className="animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 font-medium text-xs">Akses Demo Cepat</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button onClick={() => handleDemoLogin(Role.ADMIN)} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 group">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">A</div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">Admin</span>
                            </button>
                            <button onClick={() => handleDemoLogin(Role.MANAGER)} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 group">
                                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">M</div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">Manajer</span>
                            </button>
                            <button onClick={() => handleDemoLogin(Role.EMPLOYEE)} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 group">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">S</div>
                                <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300">Staf</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-center w-full text-xs text-white/30 z-10">
          &copy; 2023 PayrollPro Systems Inc. | Secure Login
      </div>
    </div>
  );
};