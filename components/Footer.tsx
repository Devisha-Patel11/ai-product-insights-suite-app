import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e293b] py-8 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:order-2 space-x-8">
            <span className="text-slate-400 hover:text-indigo-400 cursor-pointer text-sm transition-colors">Privacy Policy</span>
            <span className="text-slate-400 hover:text-indigo-400 cursor-pointer text-sm transition-colors">Terms of Service</span>
            <span className="text-slate-400 hover:text-indigo-400 cursor-pointer text-sm transition-colors">Help Center</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-slate-500">
              &copy; {new Date().getFullYear()} AI Product Insights Suite.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};