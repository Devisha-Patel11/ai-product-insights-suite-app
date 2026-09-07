import React, { useMemo, useState } from 'react';
import { FeedbackAnalysisItem, Sentiment, PriorityLevel } from '../types';
import { Button } from './ui/Button';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

interface FeedbackResultsPageProps {
  results: FeedbackAnalysisItem[];
  onBack: () => void;
}

export const FeedbackResultsPage: React.FC<FeedbackResultsPageProps> = ({ results, onBack }) => {
  const [sortField, setSortField] = useState<keyof FeedbackAnalysisItem | 'painPointsLength'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // --- Helpers ---
  const getPainPointEmoji = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('bug') || t.includes('crash') || t.includes('error')) return '🐞';
    if (t.includes('slow') || t.includes('lag') || t.includes('performance')) return '🚀';
    if (t.includes('price') || t.includes('cost') || t.includes('billing')) return '💰';
    if (t.includes('ux') || t.includes('ui') || t.includes('design')) return '🎨';
    if (t.includes('login') || t.includes('auth') || t.includes('security')) return '🔐';
    return '🔸';
  };

  const priorityValue = (p: PriorityLevel) => {
    switch (p) {
      case PriorityLevel.HIGH: return 3;
      case PriorityLevel.MEDIUM: return 2;
      case PriorityLevel.LOW: return 1;
      default: return 0;
    }
  };

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      let valA: any = a[sortField as keyof FeedbackAnalysisItem];
      let valB: any = b[sortField as keyof FeedbackAnalysisItem];

      if (sortField === 'priority') {
        valA = priorityValue(a.priority);
        valB = priorityValue(b.priority);
      }
      if (sortField === 'painPointsLength') {
        valA = a.painPoints.length;
        valB = b.painPoints.length;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortField, sortDirection]);

  const handleSort = (field: keyof FeedbackAnalysisItem | 'painPointsLength') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // --- Statistics & Chart Data ---
  const stats = useMemo(() => {
    const total = results.length;
    const pos = results.filter(r => r.sentiment === Sentiment.POSITIVE).length;
    const neu = results.filter(r => r.sentiment === Sentiment.NEUTRAL).length;
    const neg = results.filter(r => r.sentiment === Sentiment.NEGATIVE).length;

    const allPainPoints = results.flatMap(r => r.painPoints);
    const painPointCounts: Record<string, number> = {};
    allPainPoints.forEach(p => {
      let key = 'Other';
      const text = p.toLowerCase();
      if (text.includes('bug') || text.includes('crash')) key = 'Bugs';
      else if (text.includes('slow') || text.includes('lag') || text.includes('load')) key = 'Performance';
      else if (text.includes('ui') || text.includes('design') || text.includes('ux')) key = 'UX/UI';
      else if (text.includes('price') || text.includes('cost')) key = 'Pricing';
      else if (text.includes('feature') || text.includes('missing')) key = 'Features';
      
      painPointCounts[key] = (painPointCounts[key] || 0) + 1;
    });

    return {
      total,
      pos, neu, neg,
      posPct: total ? Math.round((pos / total) * 100) : 0,
      neuPct: total ? Math.round((neu / total) * 100) : 0,
      negPct: total ? Math.round((neg / total) * 100) : 0,
      painPointCounts
    };
  }, [results]);

  const doughnutData = useMemo(() => {
    return {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [stats.pos, stats.neu, stats.neg],
          backgroundColor: [
            '#10b981', // Emerald 500
            '#f59e0b', // Amber 500
            '#f43f5e'  // Rose 500
          ],
          borderColor: '#334155', // Match Card BG
          borderWidth: 2,
          hoverOffset: 4
        }
      ]
    };
  }, [stats]);

  const barData = useMemo(() => {
    const labels = Object.keys(stats.painPointCounts);
    const data = Object.values(stats.painPointCounts);
    return {
      labels,
      datasets: [{
        label: 'Pain Points',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo
        borderRadius: 4,
        barThickness: 20
      }]
    };
  }, [stats]);

  return (
    <div className="animate-slideUp space-y-6 md:space-y-8 font-['Inter']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-3">
             <span className="p-2 bg-slate-700/50 rounded-lg border border-white/10 text-xl md:text-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">📊</span>
             Feedback Analysis
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-1">Detailed breakdown of customer sentiment.</p>
        </div>
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Input
        </Button>
      </div>

      {/* Graphical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Sentiment Overview - Doughnut */}
        <div className="lg:col-span-1 bg-[#334155] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 w-full text-center border-b border-white/5 pb-2">Sentiment Overview</h4>
          
          <div className="h-48 w-48 relative">
             <Doughnut 
               data={doughnutData} 
               options={{ 
                 responsive: true, 
                 maintainAspectRatio: true,
                 plugins: { legend: { display: false } },
                 cutout: '70%'
               }} 
             />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-slate-200">{stats.total}</span>
             </div>
          </div>
          <div className="mt-6 w-full flex justify-around text-xs text-slate-400">
             <div className="flex flex-col items-center">
               <span className="w-3 h-3 rounded-full bg-emerald-500 mb-1"></span>
               <span>{stats.posPct}% Pos</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="w-3 h-3 rounded-full bg-amber-500 mb-1"></span>
               <span>{stats.neuPct}% Neu</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="w-3 h-3 rounded-full bg-rose-500 mb-1"></span>
               <span>{stats.negPct}% Neg</span>
             </div>
          </div>
        </div>

        {/* 2. Pain Point Categories - Bar Chart */}
        <div className="lg:col-span-2 bg-[#334155] rounded-2xl border border-white/10 p-6 shadow-xl">
           <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Pain Point Categories</h4>
           <div className="h-56 w-full">
             <Bar 
               data={barData} 
               options={{ 
                 indexAxis: 'y',
                 responsive: true, 
                 maintainAspectRatio: false,
                 scales: {
                   x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                   y: { grid: { display: false }, ticks: { color: '#cbd5e1' } }
                 },
                 plugins: { legend: { display: false } }
               }} 
             />
           </div>
        </div>

      </div>

      {/* Main Table Section (Detailed Breakdown) */}
      <div className="bg-[#334155] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/30">
          <h3 className="font-bold text-base md:text-lg text-slate-100">Detailed Analysis</h3>
          <div className="text-xs text-slate-400 italic hidden sm:block">Click headers to sort</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                <th 
                  className="px-6 py-4 font-bold cursor-pointer hover:text-indigo-400 transition-colors group select-none"
                  onClick={() => handleSort('sourceSnippet')}
                >
                  Feedback Snippet {sortField === 'sourceSnippet' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 font-bold cursor-pointer hover:text-indigo-400 transition-colors select-none w-32 text-center"
                  onClick={() => handleSort('sentiment')}
                >
                  Sentiment {sortField === 'sentiment' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 font-bold cursor-pointer hover:text-indigo-400 transition-colors select-none"
                  onClick={() => handleSort('painPointsLength')}
                >
                  Pain Points {sortField === 'painPointsLength' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 font-bold cursor-pointer hover:text-indigo-400 transition-colors select-none w-32 text-center"
                  onClick={() => handleSort('priority')}
                >
                  Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedResults.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-300 max-w-md">
                    <div className="line-clamp-2 italic group-hover:text-slate-100 transition-colors">"{item.sourceSnippet}"</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{item.sentiment === Sentiment.POSITIVE ? '😊' : item.sentiment === Sentiment.NEGATIVE ? '☹️' : '😐'}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        item.sentiment === Sentiment.POSITIVE ? 'text-emerald-400' : 
                        item.sentiment === Sentiment.NEGATIVE ? 'text-rose-400' : 'text-amber-400'
                      }`}>{item.sentiment}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.painPoints.map((p, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-white/10 text-slate-200 shadow-sm">
                          <span className="mr-1.5">{getPainPointEmoji(p)}</span>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {item.priority === PriorityLevel.HIGH && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xl" title="High Priority">🔥</span>
                      )}
                      {item.priority === PriorityLevel.MEDIUM && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xl" title="Medium Priority">🟡</span>
                      )}
                      {item.priority === PriorityLevel.LOW && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xl" title="Low Priority">🟢</span>
                      )}
                    </div>
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