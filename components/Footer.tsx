
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm text-slate-500">
          &copy; {currentYear} Google I/O Highlights. All information is for demonstrative purposes.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Not an official Google product.
        </p>
      </div>
    </footer>
  );
};
