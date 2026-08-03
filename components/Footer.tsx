
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xs text-white/25">
          &copy; {currentYear} Google I/O Highlights Tracker &middot; Not an official Google product
        </p>
        <p className="text-[0.65rem] text-white/15 mt-1">
          Announcements are AI-generated for demonstration purposes
        </p>
      </div>
    </footer>
  );
};
