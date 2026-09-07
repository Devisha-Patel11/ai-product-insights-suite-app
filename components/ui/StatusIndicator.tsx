import React from 'react';

type StatusState = 'idle' | 'loading' | 'success' | 'error';

interface StatusIndicatorProps {
  status: StatusState;
  text?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, text }) => {
  if (status === 'idle') return null;

  return (
    <div className="mt-4 flex items-center gap-3 animate-fadeIn">
      {/* Visual Indicator */}
      <div className="relative flex h-3 w-3">
        {status === 'loading' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ${
          status === 'loading' ? 'bg-indigo-500' :
          status === 'success' ? 'bg-emerald-500' :
          'bg-rose-500'
        }`}></span>
      </div>

      {/* Text Label */}
      <div className="flex-1">
        <p className={`text-xs font-semibold uppercase tracking-wider ${
          status === 'loading' ? 'text-indigo-400' :
          status === 'success' ? 'text-emerald-400' :
          'text-rose-400'
        }`}>
          {text || (status === 'loading' ? 'Analyzing with Gemini...' : status === 'success' ? 'Analysis Complete' : 'Error')}
        </p>
        
        {/* Progress Bar (Only visible during loading) */}
        {status === 'loading' && (
          <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full animate-progress w-full origin-left"></div>
          </div>
        )}
      </div>
    </div>
  );
};