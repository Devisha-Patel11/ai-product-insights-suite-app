import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { FeedbackAnalyzer } from './components/FeedbackAnalyzer';
import { FeaturePrioritizer } from './components/FeaturePrioritizer';
import { FeedbackResultsPage } from './components/FeedbackResultsPage';
import { FeatureResultsPage } from './components/FeatureResultsPage';
import { SentimentReportsPage } from './components/SentimentReportsPage';
import { RoadmapPage } from './components/RoadmapPage';
import { SettingsPage } from './components/SettingsPage';
import { FeedbackAnalysisItem, FeatureRequestItem, FeatureStatus } from './types';

type Tab = 'dashboard' | 'reports' | 'roadmap' | 'settings';
type SubView = 'main' | 'feedback-results' | 'feature-results';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [dashboardSubView, setDashboardSubView] = useState<SubView>('main');
  
  const [feedbackResults, setFeedbackResults] = useState<FeedbackAnalysisItem[]>([]);
  const [featureResults, setFeatureResults] = useState<FeatureRequestItem[]>([]);
  
  const [workspaceName, setWorkspaceName] = useState("Product Team A");
  const [theme, setTheme] = useState<'muted' | 'dark' | 'light'>('muted');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme Class Calculation
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark': return 'bg-gray-950 text-gray-100 selection:bg-indigo-500/30';
      case 'light': return 'bg-gray-50 text-gray-900 selection:bg-indigo-500/30';
      case 'muted':
      default: return 'bg-[#1e293b] text-slate-100 selection:bg-indigo-500/30';
    }
  };

  // Handlers
  const handleFeedbackComplete = (results: Omit<FeedbackAnalysisItem, 'id' | 'timestamp'>[]) => {
    const stampedResults: FeedbackAnalysisItem[] = results.map(r => ({ 
      ...r, 
      id: crypto.randomUUID(),
      timestamp: Date.now() 
    }));
    setFeedbackResults(prev => [...prev, ...stampedResults]);
    setDashboardSubView('feedback-results');
  };

  const handleFeatureComplete = (results: Omit<FeatureRequestItem, 'id' | 'status'>[]) => {
    const stampedResults: FeatureRequestItem[] = results.map(r => ({ 
      ...r, 
      id: crypto.randomUUID(),
      status: FeatureStatus.TODO 
    }));
    setFeatureResults(prev => [...prev, ...stampedResults]);
    setDashboardSubView('feature-results');
  };

  const handleFeatureStatusUpdate = (id: string, newStatus: FeatureStatus) => {
    setFeatureResults(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleBackToDashboard = () => {
    setDashboardSubView('main');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    if (tab === 'dashboard') {
      setDashboardSubView('main');
    }
    // Close mobile menu on tab switch via sidebar is handled in Sidebar component, 
    // but we can ensure state consistency here if needed.
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Sidebar (Responsive) */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        workspaceName={workspaceName}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-transparent">
        
        {/* Top Navigation - Fixed */}
        <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-10 min-h-full flex flex-col">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && dashboardSubView === 'main' && (
              <div className="animate-fadeIn">
                {/* Dashboard Intro */}
                <div className="pt-2 md:pt-4 mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                    Product Insights Dashboard
                  </h2>
                  <p className={`mt-2 text-base md:text-lg max-w-2xl ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
                    Real-time sentiment analysis and feature prioritization powered by Gemini.
                  </p>
                </div>

                {/* Section 1: Feedback Analyzer Input */}
                <section id="feedback-analyzer" className="scroll-mt-6">
                  <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-lg shrink-0 backdrop-blur-sm">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">Feedback Analyzer</h3>
                        <p className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Paste feedback to extract insights</p>
                      </div>
                    </div>
                  </div>
                  {/* Cast to any if needed due to slight type mismatch in prop definition vs usage during rapid dev */}
                  <FeedbackAnalyzer onAnalyzeComplete={handleFeedbackComplete as any} />
                </section>

                {/* Visual Divider */}
                <div className="relative py-6 md:py-8">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`w-full border-t ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'}`}></div>
                  </div>
                </div>

                {/* Section 2: Feature Prioritizer Input */}
                <section id="feature-prioritizer" className="scroll-mt-6">
                  <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                     <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 shadow-lg shrink-0 backdrop-blur-sm">
                        <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">Feature Prioritizer</h3>
                        <p className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}>Score impact & urgency</p>
                      </div>
                    </div>
                  </div>
                  <FeaturePrioritizer onPrioritizeComplete={handleFeatureComplete as any} />
                </section>
              </div>
            )}

            {/* Dashboard Sub-views for Immediate Results */}
            {activeTab === 'dashboard' && dashboardSubView === 'feedback-results' && (
              <FeedbackResultsPage results={feedbackResults} onBack={handleBackToDashboard} />
            )}
            {activeTab === 'dashboard' && dashboardSubView === 'feature-results' && (
              <FeatureResultsPage results={featureResults} onBack={handleBackToDashboard} />
            )}

            {/* --- SENTIMENT REPORTS TAB --- */}
            {activeTab === 'reports' && (
              <SentimentReportsPage results={feedbackResults} />
            )}

            {/* --- FEATURE ROADMAP TAB --- */}
            {activeTab === 'roadmap' && (
              <RoadmapPage features={featureResults} onStatusChange={handleFeatureStatusUpdate} />
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
              <SettingsPage 
                currentTheme={theme} 
                onThemeChange={setTheme}
                workspaceName={workspaceName}
                onWorkspaceNameChange={setWorkspaceName}
              />
            )}
            
            <div className="mt-auto pt-6 md:pt-8">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;