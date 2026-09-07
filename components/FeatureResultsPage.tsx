import React, { useMemo, useState } from 'react';
import { FeatureRequestItem } from '../types';
import { Button } from './ui/Button';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface FeatureResultsPageProps {
  results: FeatureRequestItem[];
  onBack: () => void;
}

export const FeatureResultsPage: React.FC<FeatureResultsPageProps> = ({ results, onBack }) => {
  const [sortField, setSortField] = useState<keyof FeatureRequestItem>('priorityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Case insensitive string sort
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortField, sortDirection]);

  const handleSort = (field: keyof FeatureRequestItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const chartData = useMemo(() => {
    // Sort for chart display (always high to low)
    const chartSorted = [...results].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 10);
    return {
      labels: chartSorted.map(r => r.featureName.length > 15 ? r.featureName.substring(0, 15) + '...' : r.featureName),
      datasets: [
        {
          label: 'Priority Score',
          data: chartSorted.map(r => r.priorityScore),
          backgroundColor: chartSorted.map(r => 
            r.priorityScore >= 8 ? '#14b8a6' : // Teal-500
            r.priorityScore >= 5 ? '#f59e0b' : // Amber-500
            '#6366f1' // Indigo-500
          ),
          borderRadius: 4,
        }
      ]
    };
  }, [results]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (score >= 5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  return (
    <div className="animate-slideUp space-y-8 font-['Inter']">
       {/* Header */}
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
             <span className="p-2 bg-slate-700/50 rounded-lg border border-white/10 text-2xl shadow-[0_0_15px_rgba(45,212,191,0.2)]">⚡</span>
             Feature Prioritization Report
          </h2>
          <p className="text-slate-400 mt-1">Impact and urgency scoring for roadmap planning.</p>
        </div>
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Input
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2 bg-[#334155] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-white/10 bg-slate-800/30">
             <h3 className="font-bold text-lg text-slate-100">Ranked Features</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                   <th className="px-6 py-4 cursor-pointer hover:text-teal-400" onClick={() => handleSort('featureName')}>Feature</th>
                   <th className="px-6 py-4 cursor-pointer hover:text-teal-400" onClick={() => handleSort('priorityScore')}>Score</th>
                   <th className="px-6 py-4 hidden sm:table-cell">Impact</th>
                   <th className="px-6 py-4 hidden sm:table-cell">Urgency</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {sortedResults.map((item, idx) => (
                   <tr key={idx} className="hover:bg-white/5 transition-colors">
                     <td className="px-6 py-4">
                       <div className="font-medium text-slate-200">{item.featureName}</div>
                       <div className="text-xs text-slate-400 mt-1 sm:hidden">Impact: {item.impactDescription}</div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border font-bold ${getScoreColor(item.priorityScore)}`}>
                          {item.priorityScore}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell max-w-xs truncate" title={item.impactDescription}>
                       {item.impactDescription}
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell max-w-xs truncate" title={item.urgencyDescription}>
                       {item.urgencyDescription}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-1 bg-[#334155] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Top Priorities</h4>
          <div className="flex-1 min-h-[300px]">
            <Bar 
              data={chartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { size: 10 } } }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};