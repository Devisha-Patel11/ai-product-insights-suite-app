import React, { useState } from 'react';
import { Button } from './ui/Button';

interface SettingsPageProps {
  currentTheme: 'muted' | 'dark' | 'light';
  onThemeChange: (theme: 'muted' | 'dark' | 'light') => void;
  workspaceName: string;
  onWorkspaceNameChange: (name: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentTheme, 
  onThemeChange, 
  workspaceName, 
  onWorkspaceNameChange 
}) => {
  const [localName, setLocalName] = useState(workspaceName);

  const handleSaveName = () => {
    onWorkspaceNameChange(localName);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn font-['Inter'] space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
        <p className="text-slate-400">Manage workspace preferences and appearance.</p>
      </div>

      {/* Theme Section */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 shadow-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => onThemeChange('muted')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              currentTheme === 'muted' 
                ? 'border-indigo-500 bg-slate-800 ring-2 ring-indigo-500/20' 
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <div className="w-full h-20 bg-slate-800 rounded-lg mb-3 border border-slate-700"></div>
            <div className="font-semibold text-slate-200">Muted Blue</div>
            <div className="text-xs text-slate-500">Default professional dark mode</div>
          </button>

          <button 
            onClick={() => onThemeChange('dark')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              currentTheme === 'dark' 
                ? 'border-indigo-500 bg-gray-900 ring-2 ring-indigo-500/20' 
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <div className="w-full h-20 bg-gray-950 rounded-lg mb-3 border border-gray-800"></div>
            <div className="font-semibold text-slate-200">Deep Dark</div>
            <div className="text-xs text-slate-500">High contrast for late nights</div>
          </button>

          <button 
            onClick={() => onThemeChange('light')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              currentTheme === 'light' 
                ? 'border-indigo-500 bg-white ring-2 ring-indigo-500/20' 
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <div className="w-full h-20 bg-white rounded-lg mb-3 border border-gray-200"></div>
            <div className="font-semibold text-slate-200">Clean Light</div>
            <div className="text-xs text-slate-500">Bright and airy interface</div>
          </button>
        </div>
      </div>

      {/* Workspace Section */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 shadow-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Workspace Settings</h3>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Workspace Name</label>
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button onClick={handleSaveName} disabled={localName === workspaceName}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};