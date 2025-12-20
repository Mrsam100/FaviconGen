import React, { useState } from 'react';

interface ColorControlProps {
  label: string;
  icon?: string;
  value: string;
  onChange: (value: string) => void;
}

const PRESET_COLORS = [
  'transparent',
  '#FFFFFF',
  '#000000',
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
];

const ColorControl: React.FC<ColorControlProps> = ({ label, icon, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {label}
      </label>

      {/* Color Presets */}
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`
              w-full aspect-square rounded-lg border-2 transition-all
              ${value === color ? 'border-violet-600 scale-110 shadow-lg' : 'border-slate-200 hover:border-slate-400'}
            `}
            style={{
              backgroundColor: color === 'transparent' ? '#fff' : color,
              backgroundImage: color === 'transparent'
                ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%)'
                : 'none',
              backgroundSize: '8px 8px',
            }}
            aria-label={color === 'transparent' ? 'Transparent' : color}
            title={color === 'transparent' ? 'Transparent' : color}
          />
        ))}
      </div>

      {/* Custom Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
        >
          {value === 'transparent' ? 'Transparent' : value}
        </button>

        {showPicker && value !== 'transparent' && (
          <div className="absolute top-full mt-2 left-0 right-0 p-4 bg-white rounded-lg shadow-2xl border border-slate-200 z-10">
            <input
              type="color"
              value={value === 'transparent' ? '#FFFFFF' : value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-32 cursor-pointer rounded-lg"
            />
            <button
              onClick={() => setShowPicker(false)}
              className="w-full mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorControl;
