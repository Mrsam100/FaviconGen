import React, { useState } from 'react';
import { FaviconSet } from '../types';
import { useToast } from './Toast';

interface ResultViewProps {
  faviconSet: FaviconSet;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ faviconSet, onBack }) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'favicon' | 'apple' | 'android'>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredIcons = faviconSet.icons.filter(icon => filter === 'all' || icon.type === filter);

  const downloadSingleIcon = (icon: any) => {
    try {
      const a = document.createElement('a');
      a.href = icon.dataUrl;
      a.download = icon.label;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloaded ${icon.label}`, 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Download failed. Please try again.', 'error');
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      // Dynamically import JSZip from CDN
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
      const zip = new JSZip();

      // Add all icons to zip
      faviconSet.icons.forEach(icon => {
        const base64Data = icon.dataUrl.split(',')[1];
        zip.file(icon.label, base64Data, { base64: true });
      });

      // Add HTML snippet
      zip.file('integration.html', faviconSet.htmlSnippet);

      // Add manifest JSON
      zip.file('manifest.json', faviconSet.manifestJson);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${faviconSet.originalFileName.split('.')[0]}-icons.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('All icons downloaded as ZIP!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast(`Download failed: ${error instanceof Error ? error.message : 'Please try again'}`, 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'favicon': return 'from-blue-500/20 to-cyan-500/20';
      case 'apple': return 'from-slate-800/10 to-slate-900/10';
      case 'android': return 'from-emerald-500/20 to-teal-500/20';
      default: return 'from-violet-500/20 to-indigo-500/20';
    }
  }

  const getAccentColor = (type: string) => {
    switch(type) {
      case 'favicon': return 'text-blue-600';
      case 'apple': return 'text-slate-800';
      case 'android': return 'text-emerald-600';
      default: return 'text-violet-600';
    }
  }

  return (
    <div className="min-h-screen pt-48 pb-40 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-24 flex flex-col xl:flex-row justify-between items-end gap-12">
          <div className="space-y-8">
            <button
              onClick={onBack}
              className="group flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-violet-600 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-2 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Project Hub
            </button>
            <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-none">Your Logo.</h2>
            <p className="text-2xl text-slate-600 font-medium max-w-2xl">
              Your logo has been generated in <span className="font-bold text-violet-600">{faviconSet.icons.length} different sizes</span> for iOS, Android, web browsers, and more. Each size is optimized for specific devices and platforms.
            </p>
            <div className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.4em] text-violet-600">
                <span className="px-6 py-2 bg-violet-100 rounded-full shadow-sm">BATCH: {faviconSet.id}</span>
                <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                <span className="text-slate-400">{faviconSet.icons.length} Sizes Generated</span>
            </div>
          </div>
          
          <div className="flex bg-white/60 backdrop-blur-2xl p-3 rounded-[32px] shadow-2xl border border-white/80">
            {['all', 'favicon', 'apple', 'android'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-32">
          {filteredIcons.map((icon, idx) => (
            <div key={idx} className="group glass-card p-10 rounded-[50px] flex flex-col items-center justify-center text-center hover:scale-105 transition-all duration-700 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${getIconBg(icon.type)}`}></div>

              {/* Download button for individual icon */}
              <button
                onClick={() => downloadSingleIcon(icon)}
                className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white hover:bg-violet-600 text-slate-900 hover:text-white p-2 rounded-full shadow-lg"
                aria-label={`Download ${icon.label}`}
                title={`Download ${icon.label}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>

              <div className="relative mb-10 z-10">
                <img src={icon.dataUrl} className="w-24 h-24 object-contain group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]" alt={`${icon.type} icon ${icon.size}x${icon.size}px`} />
                <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white text-slate-900 text-[10px] flex items-center justify-center font-black shadow-2xl border border-slate-50 leading-tight">
                  {icon.size}<br/>
                  <span className="text-[8px] text-slate-500">px</span>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors z-10 ${getAccentColor(icon.type)} leading-relaxed`}>
                {icon.type === 'apple' ? 'iOS' : icon.type === 'android' ? 'Android' : icon.type === 'favicon' ? 'Web' : 'MS'}<br/>
                <span className="text-[8px] text-slate-400">{icon.size}×{icon.size}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Environment Sim</h3>
            <div className="glass-card p-12 rounded-[60px] shadow-2xl relative overflow-hidden group border-white/80">
               <div className="absolute top-0 left-0 w-full h-14 bg-white/60 border-b border-white flex items-center px-10 gap-4">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
                  <div className="ml-8 h-10 w-56 bg-white/90 rounded-t-2xl flex items-center px-5 gap-4 border-x border-t border-slate-100 shadow-sm">
                     <img src={faviconSet.icons[0]?.dataUrl} className="w-5 h-5" alt="" />
                     <span className="text-[11px] font-bold text-slate-500 uppercase truncate tracking-widest">{faviconSet.originalFileName}</span>
                  </div>
               </div>
               <div className="pt-24 flex items-center justify-center min-h-[350px]">
                  <div className="text-center space-y-10">
                    <div className="relative inline-block">
                        <img src={faviconSet.icons.find(i => i.size === 128)?.dataUrl || faviconSet.icons[0].dataUrl} className="w-40 h-40 mx-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-1000" alt="" />
                        <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-150 -z-10 group-hover:opacity-100 transition-opacity opacity-0 duration-1000"></div>
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.8em] text-violet-600/50">UI Contextualization Active</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Integration</h3>
            <div className="bg-slate-900 text-violet-100 p-12 rounded-[50px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                <div className="absolute top-8 right-10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(faviconSet.htmlSnippet);
                        showToast('Code snippet copied to clipboard!', 'success');
                      }}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[11px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                      Copy Snippet
                    </button>
                </div>
                <pre className="text-[14px] font-mono leading-loose opacity-90 overflow-x-auto no-scrollbar scroll-smooth pt-12">
                    {faviconSet.htmlSnippet}
                </pre>
                <div className="absolute bottom-6 right-10 text-white/5 text-6xl font-black select-none pointer-events-none">CODE</div>
            </div>
            <button
              onClick={downloadAll}
              disabled={isDownloading}
              className="group relative w-full py-12 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white rounded-[50px] text-sm font-black uppercase tracking-[0.5em] hover:scale-[1.02] shadow-[0_30px_70px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isDownloading ? 'Downloading icons' : 'Download all icons as ZIP file'}
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {isDownloading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-bounce">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Production Bundle
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;