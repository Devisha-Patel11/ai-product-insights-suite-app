import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { FeedbackAnalysisItem, Sentiment } from '../types';

interface SentimentReportsPageProps {
  results: FeedbackAnalysisItem[];
}

export const SentimentReportsPage: React.FC<SentimentReportsPageProps> = ({ results }) => {
  
  // Prepare Chart Data
  const chartData = useMemo(() => {
    const sorted = [...results].sort((a, b) => a.timestamp - b.timestamp);
    
    const labels = sorted.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const sentimentScores = sorted.map(item => {
      if (item.sentiment === Sentiment.POSITIVE) return 1;
      if (item.sentiment === Sentiment.NEGATIVE) return -1;
      return 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Sentiment Trend',
          data: sentimentScores,
          borderColor: '#818cf8', // Indigo 400
          backgroundColor: 'rgba(129, 140, 248, 0.1)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [results]);

  const recentResults = [...results].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  
  // Calculate trend direction
  const trend = useMemo(() => {
    if (results.length < 2) return 'neutral';
    const last = results[results.length - 1];
    const prev = results[results.length - 2];
    
    const score = (s: Sentiment) => s === Sentiment.POSITIVE ? 1 : s === Sentiment.NEGATIVE ? -1 : 0;
    const diff = score(last.sentiment) - score(prev.sentiment);
    
    return diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
  }, [results]);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 animate-fadeIn bg-slate-800/30 rounded-3xl border border-dashed border-slate-700 m-4">
        <div className="p-4 bg-slate-800 rounded-full mb-4 shadow-lg">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-300">No Data Available</h3>
        <p className="max-w-xs text-center mt-2 text-sm">Analyze some customer feedback in the Dashboard to see real-time trends here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">Sentiment Reports</h2>
          <p className="text-sm md:text-base text-slate-400">Live feed of customer sentiment analysis.</p>
        </div>
        <div className={`px-3 py-1 rounded-lg border text-sm flex items-center gap-2 self-start sm:self-auto ${
           trend === 'up' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
           trend === 'down' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
           'bg-slate-700 border-slate-600 text-slate-400'
        }`}>
           {trend === 'up' && <span className="text-lg">↗</span>}
           {trend === 'down' && <span className="text-lg">↘</span>}
           {trend === 'neutral' && <span className="text-lg">→</span>}
           <span>Recent Trend</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-4 md:p-6 shadow-lg backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
           Sentiment Trend
        </h3>
        <div className="h-48 md:h-64 w-full">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 800 },
              scales: {
                y: {
                  ticks: { 
                    callback: (value) => {
                      if (value === 1) return 'Pos';
                      if (value === 0) return 'Neu';
                      if (value === -1) return 'Neg';
                      return '';
                    },
                    stepSize: 1,
                    color: '#94a3b8',
                    font: { size: 10 }
                  },
                  grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                  ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, maxTicksLimit: 6 },
                  grid: { display: false }
                }
              },
              plugins: { 
                legend: { display: false },
                tooltip: { 
                   backgroundColor: '#1e293b', 
                   titleColor: '#fff', 
                   bodyColor: '#cbd5e1',
                   borderColor: 'rgba(255,255,255,0.1)',
                   borderWidth: 1,
                   padding: 8
                } 
              }
            }}
          />
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-base md:text-lg text-slate-100">Recent Activity</h3>
          <span className="text-xs text-slate-500">Last 10 entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Snippet</th>
                <th className="px-6 py-4">Sentiment</th>
                <th className="px-6 py-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentResults.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate group-hover:text-white transition-colors">
                    "{item.sourceSnippet}"
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      item.sentiment === Sentiment.POSITIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.sentiment === Sentiment.NEGATIVE ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.sentiment === Sentiment.POSITIVE ? 'bg-emerald-400' :
                        item.sentiment === Sentiment.NEGATIVE ? 'bg-rose-400' :
                        'bg-amber-400'
                      }`}></span>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {item.priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};