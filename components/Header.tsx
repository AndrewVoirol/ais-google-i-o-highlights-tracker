
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(10, 17, 24, 0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="h-8 w-8"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="20" fill="none" stroke="url(#headerGrad)" strokeWidth="3" />
                <path d="M24 12L30 20H18L24 12Z" fill="#4285F4" />
                <path d="M18 22L24 30L30 22H18Z" fill="#00BCD4" />
                <path d="M16 32L24 32L20 36L16 32Z" fill="#34A853" />
                <path d="M32 32L24 32L28 36L32 32Z" fill="#FFB300" />
                <defs>
                  <linearGradient id="headerGrad" x1="4" y1="4" x2="44" y2="44">
                    <stop stopColor="#00BCD4" />
                    <stop offset="1" stopColor="#4285F4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute -inset-1 rounded-full bg-accent-teal/20 blur-md -z-10" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tracking-tight">Google I/O</span>
              <span className="text-xs font-medium text-accent-teal/70 tracking-widest uppercase">2025</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs text-white/30 font-medium tracking-wide">Highlights Tracker</span>
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" title="Live" />
          </div>
        </div>
      </div>
    </header>
  );
};
