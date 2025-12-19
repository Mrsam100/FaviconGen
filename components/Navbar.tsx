import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  onNavClick: (targetId: string) => void;
  activeView: AppView;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-3 sm:px-10 py-4 sm:py-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-10 py-3 sm:py-5 bg-white/70 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
        <div 
          className="flex items-center gap-2 sm:gap-4 cursor-pointer group" 
          onClick={() => onNavClick('landing')}
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-xl text-sm sm:text-base">F</div>
          <span className="text-lg sm:text-2xl font-black tracking-tighter text-slate-900 whitespace-nowrap">FaviconGen</span>
        </div>

        <div className="flex items-center gap-5 sm:gap-12">
          <button 
            onClick={() => onNavClick('generator')} 
            className={`text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all hover:text-violet-600 ${activeView === 'generator' ? 'text-violet-600' : 'text-slate-400'}`}
          >
            Studio
          </button>
          <button 
            onClick={() => onNavClick('archives')} 
            className={`text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all hover:text-violet-600 ${activeView === 'archives' ? 'text-violet-600' : 'text-slate-400'}`}
          >
            Vault
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;