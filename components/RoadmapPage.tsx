import React from 'react';
import { FeatureRequestItem, FeatureStatus } from '../types';

interface RoadmapPageProps {
  features: FeatureRequestItem[];
  onStatusChange: (id: string, newStatus: FeatureStatus) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ features, onStatusChange }) => {
  const todoItems = features.filter(f => f.status === FeatureStatus.TODO || !f.status);
  const inProgressItems = features.filter(f => f.status === FeatureStatus.IN_PROGRESS);
  const completedItems = features.filter(f => f.status === FeatureStatus.COMPLETED);

  const renderCard = (item: FeatureRequestItem) => (
    <div key={item.id} className="bg-slate-700/50 border border-white/10 p-4 rounded-xl mb-3 shadow-sm hover:border-indigo-500/50 transition-all duration-300 group animate-fadeIn hover:shadow-md hover:bg-slate-700/70">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-slate-200 leading-tight">{item.featureName}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
          item.priorityScore >= 8 ? 'text-teal-400 border-teal-500/30 bg-teal-500/10' :
          item.priorityScore >= 5 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
          'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
        }`}>
          Score: {item.priorityScore}
        </span>
      </div>
      <p className="text-xs text-slate-400 line-clamp-3 mb-3">{item.impactDescription}</p>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate max-w-[80px]">{item.urgencyDescription.split(' ')[0]}...</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {item.status !== FeatureStatus.TODO && (
            <button 
              onClick={() => onStatusChange(item.id, item.status === FeatureStatus.COMPLETED ? FeatureStatus.IN_PROGRESS : FeatureStatus.TODO)}
              className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-slate-200 transition-colors"
              title="Move Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {item.status !== FeatureStatus.COMPLETED && (
            <button 
              onClick={() => onStatusChange(item.id, item.status === FeatureStatus.TODO ? FeatureStatus.IN_PROGRESS : FeatureStatus.COMPLETED)}
              className="p-1 hover:bg-indigo-500/20 rounded text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Move Forward"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn font-['Inter']">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Feature Roadmap</h2>
          <p className="text-slate-400 text-sm md:text-base">Drag items or use arrow keys to update status.</p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg border border-white/5 w-fit">
          Total Features: <span className="text-slate-300 font-bold">{features.length}</span>
        </div>
      </div>

      <div className="flex-1">
        {/* Mobile: Vertical Stack (flex-col), Desktop: Horizontal Grid (lg:flex-row) */}
        <div className="flex flex-col lg:flex-row gap-6 h-full pb-4">
          
          {/* TO DO Column */}
          <div className="flex-1 bg-slate-800/40 rounded-2xl border border-white/5 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-800 to-transparent rounded-t-2xl">
              <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                To Do
              </h3>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">{todoItems.length}</span>
            </div>
            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar lg:max-h-[calc(100vh-250px)]">
              {todoItems.length > 0 ? todoItems.map(renderCard) : (
                <div className="text-center py-12 text-slate-500 text-sm italic border-2 border-dashed border-slate-700/50 rounded-xl m-2">
                  No pending features
                </div>
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="flex-1 bg-slate-800/40 rounded-2xl border border-white/5 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-900/20 to-transparent rounded-t-2xl">
              <h3 className="font-bold text-indigo-300 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                In Progress
              </h3>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">{inProgressItems.length}</span>
            </div>
            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar lg:max-h-[calc(100vh-250px)]">
               {inProgressItems.length === 0 && (
                 <div className="text-center py-12 text-slate-600 text-sm m-2">
                   Move items here to start.
                 </div>
               )}
               {inProgressItems.map(renderCard)}
            </div>
          </div>

          {/* COMPLETED Column */}
          <div className="flex-1 bg-slate-800/40 rounded-2xl border border-white/5 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-900/20 to-transparent rounded-t-2xl">
              <h3 className="font-bold text-emerald-300 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Completed
              </h3>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">{completedItems.length}</span>
            </div>
            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar lg:max-h-[calc(100vh-250px)]">
               {completedItems.map(renderCard)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};