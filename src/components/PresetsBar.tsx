import React from 'react';
import { PRESET_SCENARIOS } from '../alu/presets';
import type { PresetScenario } from '../alu/types';
import { Beaker, Play } from 'lucide-react';

interface PresetsBarProps {
  onLoadPreset: (preset: PresetScenario) => void;
  activePresetId?: string;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({
  onLoadPreset,
  activePresetId,
}) => {
  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-purple-400" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            TEST SCENARIOS & PRESETS
          </h2>
          <span className="text-[11px] font-mono text-slate-400">[EDUCATIONAL EDGE CASES]</span>
        </div>

        <div className="text-[11px] font-mono text-purple-400/80">
          CLICK TO LOAD PRESET INPUTS & OPCODE
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PRESET_SCENARIOS.map((preset) => {
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onLoadPreset(preset)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-purple-950/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300'
              }`}
              title={preset.description}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-amber-400 font-bold">
                  {preset.opcode === 0
                    ? 'ADD'
                    : preset.opcode === 1
                    ? 'SUB'
                    : preset.opcode === 2
                    ? 'AND'
                    : preset.opcode === 3
                    ? 'OR'
                    : preset.opcode === 4
                    ? 'XOR'
                    : preset.opcode === 5
                    ? 'NOT'
                    : preset.opcode === 6
                    ? 'SHL'
                    : 'SHR'}
                </span>
                <Play className="w-2.5 h-2.5 text-slate-400" />
              </div>

              <div className="text-xs font-mono font-bold text-slate-100 leading-tight">
                {preset.title}
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
