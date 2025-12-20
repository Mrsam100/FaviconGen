import React from 'react';

interface SliderControlProps {
  label: string;
  icon?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}) => {
  return (
    <div className="space-y-3">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {label}
        </label>
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {formatValue(value)}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 transition-all hover:bg-slate-300"
        aria-label={`${label} slider`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
      />
    </div>
  );
};

export default SliderControl;
