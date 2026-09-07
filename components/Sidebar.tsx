import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  workspaceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, workspaceName, isOpen, onClose }) => {
  const links = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'reports', name: 'Sentiment Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'roadmap', name: 'Feature Roadmap', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-md border-r border-slate-700 
          transform transition-transform duration-300 ease-in-out flex flex-col justify-between
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 flex items-center px-6 border-b border-slate-700 shrink-0 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                AI
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-tight">Insights</span>
            </div>
            {/* Close Button Mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onTabChange(link.id);
                    onClose(); // Close sidebar on selection on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border text-left outline-none ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 border-l-4 border-l-indigo-500 border-t-transparent border-r-transparent border-b-transparent shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <svg 
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]' : 'text-slate-500 group-hover:text-slate-300'}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  {link.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workspace Footer */}
        <div className="p-4 mt-6 border-t border-slate-700 shrink-0">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Workspace</h4>
            <p className="text-xs text-slate-300 mb-3 font-semibold truncate">{workspaceName}</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full w-3/4 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right">75% Usage</p>
          </div>
        </div>
      </aside>
    </>
  );
};