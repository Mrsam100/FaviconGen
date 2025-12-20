import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '../../types';
import { renderIconToCanvas } from '../../utils/canvasUtils';

interface EditorCanvasProps {
  editorState: EditorState;
  onRender: (dataUrl: string) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ editorState, onRender }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isRendering, setIsRendering] = useState(false);

  // Re-render canvas whenever editor state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    // Set actual canvas size (for export)
    canvas.width = editorState.iconSize;
    canvas.height = editorState.iconSize;

    // Render icon with current settings
    renderIconToCanvas(canvas, ctx, editorState)
      .then(() => {
        // Export data URL for download
        onRender(canvas.toDataURL('image/png'));
        setIsRendering(false);
      })
      .catch((error) => {
        console.error('Canvas rendering error:', error);
        setIsRendering(false);
      });
  }, [editorState, onRender]);

  const displaySize = Math.min(editorState.iconSize * zoom, 600); // Max display size
  const maxZoom = editorState.iconSize > 256 ? 2 : 3; // Limit zoom for large icons

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Canvas Container with Checkerboard Background */}
      <div
        className="relative shadow-2xl rounded-2xl overflow-hidden ring-2 ring-slate-200"
        style={{
          width: displaySize,
          height: displaySize,
          backgroundImage: `
            repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            imageRendering: editorState.iconSize < 64 ? 'pixelated' : 'auto'
          }}
        />

        {/* Rendering Overlay */}
        {isRendering && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg border border-slate-200">
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          disabled={zoom <= 0.5}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          aria-label="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="text-sm font-bold text-slate-700 w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom(Math.min(maxZoom, zoom + 0.25))}
          disabled={zoom >= maxZoom}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          aria-label="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Size Info */}
      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono bg-slate-100 px-4 py-2 rounded-lg">
        <span>Export: {editorState.iconSize} × {editorState.iconSize}px</span>
        <span className="text-slate-300">|</span>
        <span>Type: {editorState.iconType.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default EditorCanvas;
