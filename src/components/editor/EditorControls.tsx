import React from 'react';
import { EditorState } from '../../types';
import SliderControl from './controls/SliderControl';
import ColorControl from './controls/ColorControl';

interface EditorControlsProps {
  editorState: EditorState;
  onChange: (state: EditorState) => void;
}

const EditorControls: React.FC<EditorControlsProps> = ({ editorState, onChange }) => {
  const updateState = (updates: Partial<EditorState>) => {
    onChange({ ...editorState, ...updates });
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Customize</h3>
        <p className="text-xs text-slate-500 mt-1">Adjust your icon to perfection</p>
      </div>

      {/* Scale */}
      <SliderControl
        label="Scale"
        icon="🎨"
        value={editorState.scale}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(scale) => updateState({ scale })}
        formatValue={(v) => `${Math.round(v * 100)}%`}
      />

      {/* Padding */}
      <SliderControl
        label="Padding"
        icon="📐"
        value={editorState.padding}
        min={0}
        max={50}
        step={1}
        onChange={(padding) => updateState({ padding })}
        formatValue={(v) => `${v}px`}
      />

      {/* Rotation */}
      <SliderControl
        label="Rotation"
        icon="🔄"
        value={editorState.rotation}
        min={0}
        max={360}
        step={1}
        onChange={(rotation) => updateState({ rotation })}
        formatValue={(v) => `${v}°`}
      />

      {/* Position Section */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Position</h4>

        {/* Position X */}
        <div className="mb-6">
          <SliderControl
            label="Horizontal"
            icon="↔️"
            value={editorState.positionX}
            min={-100}
            max={100}
            step={1}
            onChange={(positionX) => updateState({ positionX })}
            formatValue={(v) => `${v > 0 ? '+' : ''}${v}px`}
          />
        </div>

        {/* Position Y */}
        <SliderControl
          label="Vertical"
          icon="↕️"
          value={editorState.positionY}
          min={-100}
          max={100}
          step={1}
          onChange={(positionY) => updateState({ positionY })}
          formatValue={(v) => `${v > 0 ? '+' : ''}${v}px`}
        />
      </div>

      {/* Visual Section */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Visual</h4>

        {/* Background Color */}
        <div className="mb-6">
          <ColorControl
            label="Background"
            icon="🌈"
            value={editorState.backgroundColor}
            onChange={(backgroundColor) => updateState({ backgroundColor })}
          />
        </div>

        {/* Border Radius */}
        <SliderControl
          label="Border Radius"
          icon="🔲"
          value={editorState.borderRadius}
          min={0}
          max={50}
          step={1}
          onChange={(borderRadius) => updateState({ borderRadius })}
          formatValue={(v) => `${v}%`}
        />
      </div>

      {/* Quick Reset */}
      <div className="pt-4">
        <button
          onClick={() => updateState({
            scale: 1.0,
            padding: 0,
            rotation: 0,
            positionX: 0,
            positionY: 0,
          })}
          className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
        >
          Reset Transforms
        </button>
      </div>
    </div>
  );
};

export default EditorControls;
