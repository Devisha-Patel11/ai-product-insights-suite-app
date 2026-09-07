import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  onClear?: () => void;
  icon?: React.ReactNode;
  accentColor?: 'indigo' | 'teal';
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  value, 
  onClear, 
  icon, 
  accentColor = 'indigo', 
  className = '', 
  ...props 
}) => {
  const length = (value as string)?.length || 0;
  
  const focusStyle = "focus:border-[1px] focus:border-indigo-500 focus:ring-indigo-500/20";

  return (
    <div className="w-full space-y-3 font-sans">
      <div className="flex justify-between items-center px-1">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-wide font-['Inter']">
          {icon && <span className={accentColor === 'indigo' ? 'text-indigo-400' : 'text-teal-400'}>{icon}</span>}
          {label}
        </label>
        {onClear && length > 0 && (
          <button 
            onClick={onClear}
            type="button"
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 font-semibold px-2 py-1 rounded-md transition-all duration-200 flex items-center gap-1 font-['Inter']"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
      <div className="relative group">
        <textarea
          className={`w-full p-6 pb-10 rounded-xl border border-slate-600 bg-slate-800 
            text-slate-100 placeholder:text-slate-500 text-base leading-relaxed
            ${focusStyle} focus:ring-4 focus:bg-slate-800
            transition-all duration-300 resize-y outline-none shadow-inner
            font-['Inter']
            ${className}`}
          value={value}
          {...props}
        />
        <div className="absolute bottom-3 right-3 pointer-events-none transition-opacity duration-300 z-10">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-700/90 backdrop-blur px-2 py-1 rounded-full border border-slate-600 shadow-sm font-['Inter']">
            {length} chars
          </span>
        </div>
      </div>
    </div>
  );
};