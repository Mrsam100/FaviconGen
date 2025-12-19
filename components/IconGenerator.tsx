import React, { useState, useRef } from 'react';
import { analyzeLogoForIcons } from '../services/geminiService';
import { FaviconSet, IconResult } from '../types';
import { FAVICON_SIZES, APPLE_SIZES, ANDROID_SIZES, MS_SIZES } from '../constants';
import { useToast } from './Toast';
import { sanitizeFileName, isValidImageFile, isValidImageDimensions } from '../utils/sanitization';
import { generateSecureId } from '../utils/idGenerator';
import { handleFileReaderError, handleImageLoadError, getUserFriendlyMessage, AppError } from '../utils/errorHandling';

interface IconGeneratorProps {
  onComplete: (faviconSet: FaviconSet) => void;
}

const IconGenerator: React.FC<IconGeneratorProps> = ({ onComplete }) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);

  const [useOutline, setUseOutline] = useState(false);
  const [outlineThickness, setOutlineThickness] = useState(4);
  const [outlineColor, setOutlineColor] = useState('#8b5cf6');
  const [borderType, setBorderType] = useState<'none' | 'rounded' | 'square'>('rounded');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cancelUpload = () => {
    if (uploadController) {
      uploadController.abort();
      setUploadController(null);
    }
    setIsProcessing(false);
    setProgress(0);
    setErrorMessage(null);
    showToast('Upload cancelled', 'info');
  };

  const generateIcons = async (file: File): Promise<void> => {
    // Cancel any existing upload
    if (uploadController) {
      uploadController.abort();
    }

    // Validate file
    if (!isValidImageFile(file)) {
      const errorMsg = "Invalid file type. Please upload a valid image file (PNG, JPG, or SVG) under 10MB.";
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    const controller = new AbortController();
    setUploadController(controller);
    setIsProcessing(true);
    setProgress(5);
    setErrorMessage(null);

    const reader = new FileReader();

    // Critical: Add error handler for FileReader
    reader.onerror = () => {
      const error = handleFileReaderError(reader.error);
      setErrorMessage(error.message);
      showToast(error.message, 'error');
      setIsProcessing(false);
      setProgress(0);
      setUploadController(null);
    };

    reader.onload = async (e) => {
      if (controller.signal.aborted) return;

      const result = e.target?.result as string;
      if (!result) {
        setErrorMessage("Failed to read file data.");
        showToast("Failed to read file data.", 'error');
        setIsProcessing(false);
        setUploadController(null);
        return;
      }

      const img = new Image();

      // Critical: Add error handler for Image
      img.onerror = () => {
        const error = handleImageLoadError();
        setErrorMessage(error.message);
        showToast(error.message, 'error');
        setIsProcessing(false);
        setProgress(0);
        setUploadController(null);
      };

      // Add timeout for image loading
      const loadTimeout = setTimeout(() => {
        setErrorMessage("Image loading timeout. Please try a smaller file.");
        showToast("Image loading timeout. Please try a smaller file.", 'error');
        setIsProcessing(false);
        setProgress(0);
        setUploadController(null);
      }, 30000); // 30 second timeout

      img.onload = async () => {
        clearTimeout(loadTimeout);

        if (controller.signal.aborted) return;

        try {
          setProgress(15);

          // Validate image dimensions
          if (!isValidImageDimensions(img.width, img.height)) {
            throw new AppError(
              "Image dimensions invalid. Please use an image between 32x32 and 8192x8192 pixels.",
              "IMAGE_DIMENSIONS_INVALID",
              "high"
            );
          }

          setProgress(20);

          const sanitizedFileName = sanitizeFileName(file.name);
          const base64Data = result.split(',')[1];

          // AI analysis with error handling
          const analysis = await analyzeLogoForIcons(sanitizedFileName, base64Data);
          setAiFeedback(analysis);
          setProgress(40);

          const generatedIcons: IconResult[] = [];
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new AppError(
              "Canvas not supported in your browser.",
              "CANVAS_NOT_SUPPORTED",
              "critical"
            );
          }

          const groups: { sizes: number[], type: IconResult['type'] }[] = [
            { sizes: FAVICON_SIZES, type: 'favicon' },
            { sizes: APPLE_SIZES, type: 'apple' },
            { sizes: ANDROID_SIZES, type: 'android' },
            { sizes: MS_SIZES, type: 'ms' }
          ];

          for (let i = 0; i < groups.length; i++) {
            if (controller.signal.aborted) return;

            const group = groups[i];
            for (const size of group.sizes) {
              canvas.width = size;
              canvas.height = size;
              ctx.clearRect(0, 0, size, size);

              if (analysis.backgroundColor && group.type !== 'favicon') {
                ctx.fillStyle = analysis.backgroundColor;
                if (borderType === 'rounded') {
                  ctx.beginPath();
                  ctx.roundRect(0, 0, size, size, size * 0.22);
                  ctx.fill();
                } else {
                  ctx.fillRect(0, 0, size, size);
                }
              }

              const pad = (size * (analysis.paddingPercentage || 12)) / 100;
              const drawSize = size - (pad * 2);

              if (useOutline) {
                ctx.save();
                ctx.shadowColor = outlineColor;
                ctx.shadowBlur = outlineThickness * (size / 100);
                ctx.drawImage(img, pad, pad, drawSize, drawSize);
                ctx.restore();
              }

              ctx.drawImage(img, pad, pad, drawSize, drawSize);

              generatedIcons.push({
                size,
                label: `${group.type}-${size}x${size}.png`,
                dataUrl: canvas.toDataURL('image/png'),
                type: group.type
              });
            }
            setProgress(40 + ((i + 1) * 15));
            await new Promise(r => setTimeout(r, 150));
          }

          setProgress(100);
          onComplete({
            id: generateSecureId(),
            originalFileName: sanitizedFileName,
            icons: generatedIcons,
            htmlSnippet: `<!-- FaviconGen Generated Assets -->\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`,
            manifestJson: JSON.stringify({ name: sanitizedFileName.split('.')[0], theme_color: analysis.themeColor }, null, 2),
            timestamp: Date.now()
          });

          setIsProcessing(false);
          setUploadController(null);
          showToast('Icons generated successfully!', 'success');

        } catch (error) {
          const friendlyMessage = getUserFriendlyMessage(error);
          setErrorMessage(friendlyMessage);
          showToast(friendlyMessage, 'error');
          setIsProcessing(false);
          setProgress(0);
          setUploadController(null);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-32 sm:pt-48 pb-20 sm:pb-40 px-4 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-12 sm:mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-10">
          <div className="space-y-3 sm:space-y-6">
            <span className="inline-block px-4 sm:px-6 py-1 sm:py-2 bg-violet-100 text-violet-600 rounded-full text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em]">Asset Protocol</span>
            <h2 className="text-5xl sm:text-9xl font-black tracking-tighter text-slate-900 leading-none">Create.</h2>
          </div>
          <div className="flex bg-white/60 backdrop-blur-2xl p-1.5 sm:p-2 rounded-2xl shadow-2xl border border-white/80 w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['none', 'rounded', 'square'].map((t) => (
              <button 
                key={t}
                onClick={() => setBorderType(t as any)}
                className={`flex-1 lg:flex-none px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-all ${borderType === t ? 'bg-violet-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 whitespace-nowrap'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <aside className="lg:col-span-4 space-y-6 sm:space-y-10">
            <div className="p-6 sm:p-10 glass-card rounded-[30px] sm:rounded-[50px] space-y-6 sm:space-y-10">
                <h3 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] text-slate-800">Refinement</h3>
                
                <div className="space-y-6 sm:space-y-8">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] sm:text-sm font-bold text-slate-600 uppercase tracking-widest">Glow Outline</label>
                        <button 
                          onClick={() => setUseOutline(!useOutline)} 
                          className={`w-12 h-6 sm:w-16 sm:h-8 rounded-full transition-all relative ${useOutline ? 'bg-violet-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-0.5 sm:top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white transition-all shadow-md ${useOutline ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}`}></div>
                        </button>
                    </div>
                    {useOutline && (
                        <div className="animate-slide-up space-y-6 sm:space-y-8">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Intensity</span>
                                  <span>{outlineThickness}PX</span>
                                </div>
                                <input 
                                    type="range" min="1" max="25" value={outlineThickness} 
                                    onChange={(e) => setOutlineThickness(parseInt(e.target.value))} 
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600" 
                                />
                            </div>
                            <div className="flex justify-between items-center bg-white/60 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/80">
                                <span className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Color</span>
                                <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white cursor-pointer shadow-xl transition-transform hover:scale-110" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label={isProcessing ? 'Processing logo' : 'Upload logo file'}
              aria-busy={isProcessing}
              className="group relative w-full py-8 sm:py-12 rounded-[30px] sm:rounded-[50px] text-[12px] sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] bg-slate-900 text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-95 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] disabled:opacity-50"
            >
              <span className="relative z-10">{isProcessing ? 'Distilling Brand...' : 'Load Brand Assets'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            {isProcessing && (
              <button
                onClick={cancelUpload}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest bg-white/60 text-slate-600 hover:bg-white transition-all border border-white/80"
                aria-label="Cancel upload"
              >
                Cancel Upload
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && generateIcons(e.target.files[0])} accept="image/*" aria-label="Logo file input" />
            
            {aiFeedback && (
              <div className="p-8 sm:p-10 bg-gradient-to-br from-violet-600/10 via-pink-600/10 to-indigo-600/10 border border-white rounded-[30px] sm:rounded-[50px] animate-fade-in space-y-6 sm:space-y-8 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-violet-600 animate-pulse"></div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-violet-700">AI Brand Report</span>
                </div>
                <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed italic">"{aiFeedback.shortDescription}"</p>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-white/60 rounded-2xl sm:rounded-3xl border border-white shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 block mb-2 sm:mb-3 uppercase tracking-widest">Hex Key</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-lg" style={{backgroundColor: aiFeedback.themeColor}}></div>
                            <span className="text-[12px] sm:text-[14px] font-bold font-mono">{aiFeedback.themeColor}</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-white/60 rounded-2xl sm:rounded-3xl border border-white shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 block mb-2 sm:mb-3 uppercase tracking-widest">Padding</span>
                        <span className="text-[16px] sm:text-[20px] font-black text-slate-800">{aiFeedback.paddingPercentage}%</span>
                    </div>
                </div>
              </div>
            )}
          </aside>

          <main className="lg:col-span-8">
            <div 
              className={`group min-h-[300px] sm:aspect-video w-full rounded-[40px] sm:rounded-[60px] border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-8 sm:p-24 relative overflow-hidden ${
                isProcessing ? 'border-violet-400 bg-violet-50' : dragActive ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white/40 backdrop-blur-xl'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) generateIcons(e.dataTransfer.files[0]); }}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
            >
              {isProcessing ? (
                <div className="w-full max-w-lg space-y-8 sm:space-y-12 relative z-10 text-center">
                  <div className="h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-violet-600 via-pink-600 to-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-violet-700 px-2">
                    <span className="animate-pulse">Synthesizing</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 sm:space-y-12 cursor-pointer relative z-10">
                  <div className="w-24 h-24 sm:w-48 sm:h-48 rounded-[30px] sm:rounded-[50px] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto text-white group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700 shadow-[0_20px_50px_rgba(139,92,246,0.3)] sm:shadow-[0_30px_70px_rgba(139,92,246,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 sm:w-20 sm:h-20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-base sm:text-[18px] font-black uppercase tracking-[0.5em] sm:tracking-[0.8em] text-slate-800">Ingest Logo</p>
                    <p className="text-sm font-medium text-slate-400">SVG, PNG, JPG supported</p>
                  </div>
                </div>
              )}
              
              {/* Dynamic Accent Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 via-transparent to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            {errorMessage && (
              <div className="mt-8 p-6 sm:p-10 bg-rose-50 text-rose-600 rounded-[30px] sm:rounded-[40px] text-center font-bold text-[12px] sm:text-[14px] uppercase tracking-widest border border-rose-100 animate-slide-up shadow-2xl">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                   </svg>
                   {errorMessage}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default IconGenerator;