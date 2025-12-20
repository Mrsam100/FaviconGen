import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 px-4 sm:px-12 overflow-hidden text-center">
      {/* Cinematic Visual Centerpiece - Responsive sizing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] sm:w-[100vw] sm:h-[100vw] max-w-[900px] max-h-[900px] pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-pink-500/30 to-blue-500/30 rounded-full blur-[80px] sm:blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 border-[0.5px] border-violet-400/20 rounded-full animate-spin" style={{ animationDuration: '60s' }}></div>
        <div className="absolute inset-[10%] border-[0.5px] border-pink-400/20 rounded-full animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }}></div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto relative z-10 space-y-8 sm:space-y-14">
        <h1 className="galaxy-mask text-5xl sm:text-9xl lg:text-[220px] leading-[1.1] sm:leading-[0.8] tracking-tighter mb-2 sm:mb-4 py-4 sm:py-8 drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]">
          FaviconGen
        </h1>

        <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-6xl font-light tracking-tight text-slate-800 leading-tight">
            Turn Your Logo Into <br className="hidden sm:block" />
            <span className="font-extrabold text-gradient">15+ App Icon Sizes</span>
          </h2>

          <p className="text-base sm:text-2xl font-medium text-slate-600 leading-relaxed px-4">
            Upload one logo image and instantly get every icon size you need—from 16×16 favicons to 512×512 Android icons. AI automatically optimizes colors and padding for each platform: iPhone, Android, websites, and more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8 px-6 sm:px-0">
          <button
            onClick={onStart}
            className="group relative px-10 sm:px-16 py-6 sm:py-8 rounded-2xl sm:rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] sm:text-[13px] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_20px_60px_rgba(139,92,246,0.4)] overflow-hidden"
            aria-label="Start creating your favicon and app icons"
          >
            <span className="relative z-10">Start Creation</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={() => {
              const featuresSection = document.getElementById('features');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 sm:px-14 py-6 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 text-slate-900 font-black uppercase tracking-[0.4em] text-[11px] sm:text-[13px] hover:bg-white transition-all shadow-xl"
            aria-label="View feature showcase and examples"
          >
            View Showcase
          </button>
        </div>
      </div>
      
      {/* Visual Anchor Bottom */}
      <div className="absolute bottom-6 sm:bottom-10 animate-bounce text-slate-400 opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
      </div>
    </section>
  );
};

export default Hero;