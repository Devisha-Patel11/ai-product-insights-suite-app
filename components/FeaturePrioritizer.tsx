import React, { useState } from 'react';
import { prioritizeFeatures } from '../services/geminiService';
import { FeatureRequestItem } from '../types';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { StatusIndicator } from './ui/StatusIndicator';

interface FeaturePrioritizerProps {
  onPrioritizeComplete: (results: FeatureRequestItem[]) => void;
}

export const FeaturePrioritizer: React.FC<FeaturePrioritizerProps> = ({ onPrioritizeComplete }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrioritize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await prioritizeFeatures(input);
      if (data.length > 0) {
        onPrioritizeComplete(data);
      } else {
        setError("Could not extract feature requests. Please try a different format.");
      }
    } catch (err) {
      setError("Failed to prioritize features. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusState = loading ? 'loading' : error ? 'error' : 'idle';

  return (
    <div className="w-full font-['Inter'] animate-fadeIn">
      {/* Input Card - Slate 700 (#334155) */}
      <div className="bg-[#334155] rounded-2xl shadow-xl shadow-slate-900/20 border border-white/10 p-6 sm:p-8 transition-all w-full group hover:border-teal-500/30">
        <TextArea
          label="Input Feature Requests"
          placeholder="e.g., 'Users want Dark Mode', 'Add SSO login support', 'Mobile app crashes on startup'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClear={() => setInput('')}
          accentColor="teal"
          rows={5}
          disabled={loading}
          icon={
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
          }
        />
        
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
             <StatusIndicator status={statusState} text={loading ? 'Prioritizing with Gemini...' : error || ''} />
          </div>
          <div className="flex shrink-0 items-center justify-end">
             <Button onClick={handlePrioritize} variant="secondary" isLoading={loading} disabled={!input.trim()} className="w-full md:w-auto">
              Prioritize Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};