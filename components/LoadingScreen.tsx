
import React, { useEffect, useState } from 'react';

interface Props {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<Props> = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    } else {
      // Delay removing from DOM to allow fade-out animation to finish
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-500 ease-in-out backdrop-blur-xl ${
            isLoading ? 'bg-[#020617]/90 opacity-100' : 'bg-[#020617]/0 opacity-0 pointer-events-none'
        }`}
    >
      {/* Container for perfect centering */}
      <div className="flex flex-col items-center justify-center transform -translate-y-6"> 
        
        {/* Wrapper for Logo and Rings - Fixed Size for Perfect Symmetry */}
        <div className="relative w-32 h-32 flex items-center justify-center">
            
            {/* Outer Rotating Ring */}
            <div 
                className={`absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand-blue border-r-brand-orange animate-spin ${isLoading ? 'opacity-100' : 'opacity-0'}`} 
                style={{ animationDuration: '1.5s' }}
            ></div>
            
            {/* Inner Reverse Rotating Ring */}
            <div 
                className={`absolute inset-3 rounded-full border border-transparent border-b-indigo-500/50 border-l-pink-500/50 animate-spin ${isLoading ? 'opacity-100' : 'opacity-0'}`} 
                style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            ></div>

            {/* Central Logo */}
            <div className={`relative z-10 w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-700 transform ${isLoading ? 'scale-100' : 'scale-50'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-orange opacity-20 rounded-2xl animate-pulse"></div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 pb-1">
                    P
                </div>
            </div>
        </div>

        {/* Text Section */}
        <div className="mt-8 space-y-3 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
                Payroll<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Pro</span>
            </h2>
            <div className="flex items-center justify-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
        </div>
      </div>
    </div>
  );
};
