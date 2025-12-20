
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { whisperFileSummary } from '../services/geminiService';
import { SummaryRecord } from '../types';
import { useToast } from './Toast';
import { generateSecureId } from '../utils/idGenerator';
import { sanitizeFileName } from '../utils/sanitization';
import { handleFileReaderError, getUserFriendlyMessage } from '../utils/errorHandling';

interface FileWhispererProps {
  onComplete: (summary: SummaryRecord) => void;
}

const FileWhisperer: React.FC<FileWhispererProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];

    // Reset error state
    setErrorMessage(null);

    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = 'File is too large. Maximum size is 10MB.';
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/', 'text/', 'application/pdf', 'application/json', 'application/vnd.'];
    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType && !file.name.match(/\.(txt|md|csv|json|xml|html|css|js|ts|py|java|cpp|c|h)$/i)) {
      const errorMsg = 'Unsupported file type. Please upload images, documents, or text files.';
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const isImage = file.type.startsWith('image/');
          const dataForAI = isImage ? result.split(',')[1] : result;

          const summaryData = await whisperFileSummary(file.name, dataForAI, isImage);

          if (summaryData) {
            const sanitizedFileName = sanitizeFileName(file.name);
            const newRecord: SummaryRecord = {
              id: generateSecureId(),
              fileName: sanitizedFileName,
              fileType: file.type || 'Unknown',
              originalSize: (file.size / 1024).toFixed(1) + ' KB',
              title: summaryData.title,
              distillation: summaryData.distillation,
              keyPoints: summaryData.keyPoints,
              context: summaryData.context,
              timestamp: Date.now(),
              shareUrl: `whisper.tech/s/${generateSecureId().substring(0, 6)}`
            };
            onComplete(newRecord);
            showToast('File analysis complete!', 'success');
          } else {
            const errorMsg = 'Failed to analyze file. AI service may be unavailable.';
            setErrorMessage(errorMsg);
            showToast(errorMsg, 'error');
          }
        } catch (error) {
          const errorMsg = getUserFriendlyMessage(error);
          setErrorMessage(errorMsg);
          showToast(errorMsg, 'error');
          console.error('File processing error:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        const error = handleFileReaderError(reader.error);
        setErrorMessage(error.message);
        showToast(error.message, 'error');
        setIsProcessing(false);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      const errorMsg = getUserFriendlyMessage(error);
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      setIsProcessing(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="pt-40 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto animate-fade-in">
      <div
        className={`relative p-20 border-8 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center min-h-[500px] ${
          dragActive ? 'border-black bg-black/5' : 'border-black/5 bg-white'
        } ${isProcessing ? 'pointer-events-none opacity-50' : 'hover:border-black'}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload file for analysis"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept="image/*,.txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.py,.java,.cpp,.c,.h,.pdf"
          aria-label="File input"
        />
        
        {isProcessing ? (
          <div className="space-y-8 animate-pulse" role="status" aria-live="polite">
            <div className="w-24 h-24 bg-black mx-auto"></div>
            <h3 className="text-4xl font-black uppercase tracking-tighter">Distilling Essence...</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Gemini AI is processing your file</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-8xl mb-4">🌑</div>
            <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">Drop to <br/> Whisper</h3>
            <p className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">DOCS, PDFS, IMAGES, SHEETS</p>
            {errorMessage && (
              <div className="bg-rose-100 border-2 border-rose-400 text-rose-800 px-6 py-4 rounded-lg text-sm font-bold max-w-md mx-auto" role="alert">
                {errorMessage}
              </div>
            )}
            <button
              className="clay-button-primary px-12 py-5 text-sm"
              aria-label="Select file to analyze"
              type="button"
            >
              Select File
            </button>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">FAVICONGEN</div>
        <div className="absolute bottom-8 right-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">AI POWERED</div>
      </div>
    </div>
  );
};

export default FileWhisperer;
