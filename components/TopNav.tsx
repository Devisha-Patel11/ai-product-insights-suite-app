import React from 'react';

interface TopNavProps {
  onMenuClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  return (
    <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full shrink-0 sticky top-0 z-30">
      {/* Mobile Menu Button Trigger */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-md"
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer for alignment on large screens if needed */}
      <div className="hidden lg:block"></div> 

      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.1)]">
          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <span className="text-xs font-semibold text-indigo-300">Powered by Gemini 3.0</span>
        </div>

        <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300 hidden sm:block">Jane Doe</span>
          <div className="h-9 w-9 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
            <span className="text-xs font-bold text-slate-400">JD</span>
          </div>
        </div>
      </div>
    </div>
  );
};