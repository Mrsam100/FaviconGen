import React, { useState, useEffect } from 'react';
import { IconResult, EditorState, DEFAULT_EDITOR_STATE } from '../../types';
import { useToast } from '../shared/Toast';
import EditorCanvas from './EditorCanvas';
import EditorControls from './EditorControls';
import EditorActions from './EditorActions';

interface IconEditorModalProps {
  icon: IconResult;
  onClose: () => void;
  onSave: (editedDataUrl: string, editorState: EditorState) => void;
}

const IconEditorModal: React.FC<IconEditorModalProps> = ({ icon, onClose, onSave }) => {
  const { showToast } = useToast();

  const [editorState, setEditorState] = useState<EditorState>({
    ...DEFAULT_EDITOR_STATE,
    originalDataUrl: icon.dataUrl,
    iconSize: icon.size,
    iconType: icon.type,
    ...(icon.editorState || {}), // Restore previous edits if any
  } as EditorState);

  const [canvasDataUrl, setCanvasDataUrl] = useState<string>('');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleReset = () => {
    setEditorState({
      ...DEFAULT_EDITOR_STATE,
      originalDataUrl: icon.dataUrl,
      iconSize: icon.size,
      iconType: icon.type,
    } as EditorState);

    showToast('Reset to default settings', 'info');
  };

  const handleExport = () => {
    if (canvasDataUrl) {
      // Download to user's device
      const a = document.createElement('a');
      a.href = canvasDataUrl;
      a.download = `${icon.label.replace('.png', '')}-edited.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Save to parent state
      onSave(canvasDataUrl, editorState);

      showToast(`Downloaded ${icon.label} (edited)`, 'success');
    } else {
      showToast('Please wait for rendering to complete', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl flex flex-col overflow-hidden animate-slide-up"
        role="dialog"
        aria-labelledby="editor-title"
        aria-modal="true"
      >

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-violet-50 to-pink-50">
          <div>
            <h2 id="editor-title" className="text-3xl font-black text-slate-900 tracking-tight">
              Edit Icon
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {icon.size}×{icon.size}px • {icon.type.toUpperCase()} • {icon.label}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-white/50"
            aria-label="Close editor"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left: Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <EditorCanvas
              editorState={editorState}
              onRender={setCanvasDataUrl}
            />
          </div>

          {/* Right: Controls */}
          <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto p-8 custom-scrollbar">
            <EditorControls
              editorState={editorState}
              onChange={setEditorState}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-200 bg-slate-50">
          <EditorActions
            onReset={handleReset}
            onCancel={onClose}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IconEditorModal;
