import React from 'react';

const StethoscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121.707 15l-6.95 6.95a1 1 0 01-1.414 0l-2.828-2.828a1 1 0 010-1.414l4.95-4.95a1 1 0 000-1.414l-1.414-1.414a1 1 0 00-1.414 0L9.05 14.536a1 1 0 01-.707.293H7a2 2 0 00-2 2v2.945" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-sky-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
        <StethoscopeIcon />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Clinical Note Summarizer
        </h1>
      </div>
    </header>
  );
};

export default Header;
