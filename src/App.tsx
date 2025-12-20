import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/core/Navbar';
import Hero from './components/core/Hero';
import IconGenerator from './components/generator/IconGenerator';
import ResultView from './components/generator/ResultView';
import Footer from './components/core/Footer';
import Features from './components/core/Features';
import InteractiveBackground from './components/core/InteractiveBackground';
import { ToastProvider } from './components/shared/Toast';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AppView, FaviconSet } from './types';
import { SecureStorage } from './utils/storage';

const AppContent: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [activeSet, setActiveSet] = useState<FaviconSet | null>(null);
  const [archives, setArchives] = useState<FaviconSet[]>([]);
  const [scrollPhase, setScrollPhase] = useState('bg-phase-1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / height;

      if (progress < 0.25) setScrollPhase('bg-phase-1');
      else if (progress < 0.5) setScrollPhase('bg-phase-2');
      else if (progress < 0.75) setScrollPhase('bg-phase-3');
      else setScrollPhase('bg-phase-4');
    };

    window.addEventListener('scroll', handleScroll);

    // Load archives safely
    const saved = SecureStorage.get<FaviconSet[]>('archives', []);
    setArchives(saved);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerationComplete = (faviconSet: FaviconSet) => {
    setActiveSet(faviconSet);
    const newArchives = [faviconSet, ...archives].slice(0, 15);
    setArchives(newArchives);
    SecureStorage.set('archives', newArchives);
    setView('generator');
  };

  const handleNav = (target: string) => {
    if (target === 'landing') setActiveSet(null);
    setView(target as AppView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${scrollPhase}`} style={{ backgroundColor: 'var(--bg-color)' }}>
      <InteractiveBackground />
      <Navbar onNavClick={handleNav} activeView={view} />
      
      <main className="relative z-10">
        {view === 'landing' && !activeSet && (
          <>
            <Hero onStart={() => setView('generator')} />
            <Features />
          </>
        )}

        {(view === 'generator' || (view === 'landing' && activeSet)) && (
          <div className="animate-fade-in">
            {activeSet ? (
              <ResultView faviconSet={activeSet} onBack={() => setActiveSet(null)} />
            ) : (
              <IconGenerator onComplete={handleGenerationComplete} />
            )}
          </div>
        )}

        {view === 'archives' && (
          <div className="pt-48 pb-32 px-6 max-w-[1200px] mx-auto animate-slide-up-fade">
            <header className="mb-20 text-center">
                <span className="text-[12px] font-black uppercase tracking-[0.5em] text-violet-500 block mb-4">Historical Data</span>
                <h1 className="text-7xl md:text-9xl font-extrabold text-slate-900 tracking-tighter uppercase mb-4">Vault.</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">A historical compilation of generated assets</p>
                {archives.length > 0 && (
                  <p className="mt-6 text-sm text-slate-500 font-medium">
                    Showing {archives.length} of last 15 generations • Older items are automatically archived
                  </p>
                )}
            </header>

            {archives.length === 0 ? (
              <div className="py-40 glass-card flex flex-col items-center justify-center rounded-[40px] border-dashed border-4">
                 <p className="opacity-20 font-black uppercase tracking-[0.5em] text-sm">No Assets Saved</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {archives.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setActiveSet(s); setView('generator'); }}
                    className="glass-card hover-lift p-10 cursor-pointer group flex flex-col justify-between h-[340px] rounded-[40px]"
                  >
                    <div>
                        <div className="flex justify-between items-start mb-10">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-violet-600 text-white px-3 py-1 rounded-full shadow-lg">v{s.id.substring(0,3)}</span>
                            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <img src={s.icons[0]?.dataUrl} className="w-10 h-10 object-contain group-hover:invert" alt="" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold uppercase tracking-tighter mb-2 leading-none text-slate-800">{s.originalFileName}</h3>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{new Date(s.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">{s.icons.length} Assets</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;