import React from 'react';
import { Opcode, type UnitCategory } from '../alu/types';
import { OPERATION_LIST } from '../alu/aluCore';
import { Binary, Layers, Terminal } from 'lucide-react';

interface OpcodeSelectorProps {
  currentOpcode: Opcode;
  onChange: (newOpcode: Opcode) => void;
}

export const OpcodeSelector: React.FC<OpcodeSelectorProps> = ({
  currentOpcode,
  onChange,
}) => {
  // Extract bits S2, S1, S0
  const s2 = ((currentOpcode >> 2) & 1) === 1;
  const s1 = ((currentOpcode >> 1) & 1) === 1;
  const s0 = (currentOpcode & 1) === 1;

  const toggleBit = (bitIndex: number) => {
    const newOp = currentOpcode ^ (1 << bitIndex);
    onChange(newOp as Opcode);
  };

  const getUnitBadgeColor = (unit: UnitCategory) => {
    switch (unit) {
      case 'arithmetic':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'logic':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'shifter':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    }
  };

  const activeOp = OPERATION_LIST[currentOpcode];

  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-4">
      {/* Title & 3-Bit DIP Switches */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            FUNCTION & OPCODE SELECTOR
          </h2>
          <span className="text-[11px] font-mono text-slate-400">[3-BIT CONTROL BUS]</span>
        </div>

        {/* 3-Bit DIP Switch Controls (S2, S1, S0) */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 mr-1">CONTROL LINES:</span>

          {[
            { bit: 2, label: 'S2', isSet: s2 },
            { bit: 1, label: 'S1', isSet: s1 },
            { bit: 0, label: 'S0', isSet: s0 },
          ].map(({ bit, label, isSet }) => (
            <button
              key={bit}
              type="button"
              onClick={() => toggleBit(bit)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 transition cursor-pointer select-none"
              title={`Toggle Control Line ${label}: currently ${isSet ? '1' : '0'}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  isSet
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-slate-700'
                }`}
              />
              <span className="text-xs font-mono font-bold text-slate-200">
                {label}={isSet ? '1' : '0'}
              </span>
            </button>
          ))}

          <div className="ml-2 pl-2 border-l border-slate-800 text-xs font-mono font-bold text-amber-300">
            = {activeOp.code3Bit}₂
          </div>
        </div>
      </div>

      {/* 8 Operation Push Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {OPERATION_LIST.map((op) => {
          const isActive = op.opcode === currentOpcode;
          return (
            <button
              key={op.opcode}
              type="button"
              onClick={() => onChange(op.opcode)}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer select-none ${
                isActive
                  ? 'bg-slate-900 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  {op.code3Bit}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getUnitBadgeColor(
                    op.unit
                  )}`}
                >
                  {op.unit.slice(0, 4)}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`font-mono font-bold text-sm ${
                      isActive ? 'text-amber-300' : 'text-slate-200'
                    }`}
                  >
                    {op.mnemonic}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({op.symbol})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {op.name}
                </div>
              </div>

              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Operation Details Banner */}
      <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-400">EXPRESSION:</span>
          <span className="text-cyan-300 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
            {activeOp.expression}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-slate-400">UNIT:</span>
          <span className="text-slate-200 uppercase font-semibold">
            {activeOp.unit} unit
          </span>
        </div>

        <div className="text-slate-400 text-xs italic">
          {activeOp.description}
        </div>
      </div>
    </div>
  );
};
