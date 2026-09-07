import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AI
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Product Insights Suite
          </h1>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
          Powered by Gemini 3.0
        </div>
      </div>
    </header>
  );
};