import React from 'react';

interface EditorActionsProps {
  onReset: () => void;
  onCancel: () => void;
  onExport: () => void;
}

const EditorActions: React.FC<EditorActionsProps> = ({ onReset, onCancel, onExport }) => {
  return (
    <div className="flex items-center justify-between w-full">

      {/* Left: Reset Button */}
      <button
        onClick={onReset}
        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
        aria-label="Reset to default settings"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset All</span>
        </div>
      </button>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors border border-slate-200 text-sm"
          aria-label="Cancel and close editor"
        >
          Cancel
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="group relative px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-sm overflow-hidden"
          aria-label="Download edited icon"
        >
          <div className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default EditorActions;
