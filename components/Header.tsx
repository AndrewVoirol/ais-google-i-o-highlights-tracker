
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg 
              className="h-8 w-auto text-blue-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.56 12.25C22.56 11.44 22.49 10.65 22.35 9.88H11.5V14.2H17.88C17.64 15.75 16.81 17.06 15.52 17.91V20.48H19.09C21.27 18.59 22.56 15.69 22.56 12.25Z" fill="#4285F4"/>
              <path d="M11.5 22.5C14.73 22.5 17.46 21.45 19.09 19.48L15.52 16.91C14.52 17.58 13.14 18 11.5 18C8.79 18 6.46 16.22 5.55 13.78H1.85V16.35C3.48 19.98 7.19 22.5 11.5 22.5Z" fill="#34A853"/>
              <path d="M5.55 14.78C5.33 14.11 5.2 13.38 5.2 12.6C5.2 11.82 5.33 11.09 5.55 10.42V7.85H1.85C0.68 10.02 0 12.6 0 15.3C0 18 0.68 20.58 1.85 22.75L5.55 20.22C5.33 19.55 5.2 18.82 5.2 18.1C5.2 17.38 5.33 16.65 5.55 15.98L5.55 14.78Z" fill="#FBBC05"/>
              <path d="M11.5 5C13.26 5 14.85 5.59 16.03 6.72L19.16 3.59C17.45 2.03 14.73 1 11.5 1C7.19 1 3.48 3.52 1.85 7.15L5.55 9.72C6.46 7.28 8.79 5.5 11.5 5.5V5Z" fill="#EA4335"/>
            </svg>
            <span className="ml-3 text-2xl font-semibold text-slate-700">Google I/O Updates</span>
          </div>
          {/* Future navigation items can go here */}
        </div>
      </div>
    </header>
  );
};
