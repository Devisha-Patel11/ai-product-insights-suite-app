import React, { useState } from 'react';
import { analyzeFeedback } from '../services/geminiService';
import { FeedbackAnalysisItem } from '../types';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { StatusIndicator } from './ui/StatusIndicator';

interface FeedbackAnalyzerProps {
  onAnalyzeComplete: (results: FeedbackAnalysisItem[]) => void;
}

export const FeedbackAnalyzer: React.FC<FeedbackAnalyzerProps> = ({ onAnalyzeComplete }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFeedback(input);
      if (data.length > 0) {
        onAnalyzeComplete(data);
      } else {
        setError("No actionable insights found. Please try more detailed feedback.");
      }
    } catch (err) {
      setError("Failed to analyze feedback. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusState = loading ? 'loading' : error ? 'error' : 'idle';

  return (
    <div className="w-full font-['Inter'] animate-fadeIn">
      {/* Input Card - Slate 700 (#334155) */}
      <div className="bg-[#334155] rounded-2xl shadow-xl shadow-slate-900/20 border border-white/10 p-6 sm:p-8 transition-all w-full group hover:border-indigo-500/30">
        <TextArea
          label="Paste Customer Feedback"
          placeholder="e.g., 'The new export feature is great, but the loading times are frustratingly slow on mobile. Also, the dashboard UI feels a bit cluttered...'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClear={() => setInput('')}
          accentColor="indigo"
          rows={5}
          disabled={loading}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
        
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
             <StatusIndicator status={statusState} text={loading ? 'Analyzing with Gemini...' : error || ''} />
          </div>
          <div className="flex shrink-0 items-center justify-end">
            <Button onClick={handleAnalyze} isLoading={loading} disabled={!input.trim()} className="w-full md:w-auto">
              Analyze Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};