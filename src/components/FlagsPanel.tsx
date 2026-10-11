import React from 'react';
import type { ALUCalculationResult } from '../alu/types';
import { Flag } from 'lucide-react';

interface FlagsPanelProps {
  calculation: ALUCalculationResult;
  highlightFlag?: string;
}

export const FlagsPanel: React.FC<FlagsPanelProps> = ({ calculation, highlightFlag }) => {
  const { flags, operation, result } = calculation;

  const flagItems = [
    {
      id: 'carry',
      symbol: 'C',
      name: 'Carry / Borrow',
      active: flags.carry,
      color: 'amber',
      glowClass: 'led-glow-amber',
      activeColor: 'bg-amber-400 text-amber-950',
      activeBorder: 'border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
      activeDotClass: 'bg-amber-400 border-amber-200',
      dimDotClass: 'bg-amber-950/40 border-amber-900/50',
      tooltip: 'Set if addition exceeds 8 bits (sum > 255), subtraction requires borrow (A < B), or bit shifted out in SHL/SHR.',
      reason: flags.carry
        ? operation.opcode === 0
          ? 'Carry-out: sum exceeded 8-bit capacity (> 255)'
          : operation.opcode === 1
          ? 'Borrow: unsigned A is less than B'
          : 'Bit was pushed out into carry during shift'
        : 'No carry-out or borrow occurred',
    },
    {
      id: 'zero',
      symbol: 'Z',
      name: 'Zero Flag',
      active: flags.zero,
      color: 'cyan',
      glowClass: 'led-glow-cyan',
      activeColor: 'bg-cyan-400 text-cyan-950',
      activeBorder: 'border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
      activeDotClass: 'bg-cyan-400 border-cyan-200',
      dimDotClass: 'bg-cyan-950/40 border-cyan-900/50',
      tooltip: 'Set if the 8-bit result is exactly zero (0x00).',
      reason: flags.zero
        ? 'Result is exactly 0x00 (all bits are 0)'
        : `Result is non-zero (${result} / 0x${result.toString(16).toUpperCase()})`,
    },
    {
      id: 'overflow',
      symbol: 'V',
      name: 'Signed Overflow',
      active: flags.overflow,
      color: 'red',
      glowClass: 'led-glow-red',
      activeColor: 'bg-rose-500 text-rose-950',
      activeBorder: 'border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
      activeDotClass: 'bg-rose-500 border-rose-200',
      dimDotClass: 'bg-rose-950/40 border-rose-900/50',
      tooltip: 'Set when signed 2’s complement arithmetic wraps outside the valid range [-128, +127].',
      reason: flags.overflow
        ? 'Signed overflow: 2’s complement sign inverted unexpectedly'
        : 'No signed overflow in 2’s complement range [-128..+127]',
    },
    {
      id: 'negative',
      symbol: 'N',
      name: 'Negative / Sign',
      active: flags.negative,
      color: 'purple',
      glowClass: 'led-glow-purple',
      activeColor: 'bg-purple-400 text-purple-950',
      activeBorder: 'border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
      activeDotClass: 'bg-purple-400 border-purple-200',
      dimDotClass: 'bg-purple-950/40 border-purple-900/50',
      tooltip: 'Set if the MSB (Bit 7) is 1, indicating a negative number in 2’s complement.',
      reason: flags.negative
        ? 'MSB (Bit 7) is 1 (negative in 2’s complement)'
        : 'MSB (Bit 7) is 0 (positive or zero)',
    },
    {
      id: 'parity',
      symbol: 'P',
      name: 'Even Parity',
      active: flags.parity,
      color: 'emerald',
      glowClass: 'led-glow-green',
      activeColor: 'bg-emerald-400 text-emerald-950',
      activeBorder: 'border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
      activeDotClass: 'bg-emerald-400 border-emerald-200',
      dimDotClass: 'bg-emerald-950/40 border-emerald-900/50',
      tooltip: 'Set if the total number of set bits (1s) in the result is even.',
      reason: flags.parity
        ? 'Even number of 1s in result bits'
        : 'Odd number of 1s in result bits',
    },
  ];

  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-3.5 w-full max-w-full overflow-hidden box-border">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Flag className="w-4 h-4 text-rose-400 shrink-0" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100 truncate">
            STATUS FLAGS REGISTER
          </h2>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">[CCR / PSW]</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 shrink-0">
          UPDATED CONTINUOUSLY
        </div>
      </div>

      {/* Responsive Flag Cards Grid */}
      {/* 5 columns on wide screens, 3 columns on medium screens, 1-2 columns on small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full min-w-0">
        {flagItems.map((flag) => {
          const isPresetHighlighted = highlightFlag === flag.id;

          return (
            <div
              key={flag.id}
              data-testid={`flag-card-${flag.id}`}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between gap-2.5 min-w-0 w-full box-border h-full relative ${
                flag.active
                  ? `bg-slate-900 ${flag.activeBorder}`
                  : 'bg-slate-950/70 border-slate-800/80 opacity-80'
              } ${isPresetHighlighted ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
            >
              {/* Card Header: Icon badge, Flag Name, and Illuminated/Dim Indicator Lamp */}
              <div className="flex items-start justify-between gap-2 min-w-0 w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-black text-xs shrink-0 select-none transition-colors ${
                      flag.active
                        ? flag.activeColor
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {flag.symbol}
                  </span>
                  <h3 className="text-xs font-mono font-bold text-slate-100 min-w-0 leading-snug break-words [overflow-wrap:anywhere]">
                    {flag.name}
                  </h3>
                </div>

                {/* Hardware LED Indicator Circle: Illuminated when 1, Dim when 0 */}
                <div
                  className="w-5 h-5 rounded-full p-0.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border border-slate-600/70 flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                  title={`${flag.name}: ${flag.active ? '1 (ILLUMINATED / SET)' : '0 (DIM / CLR)'}`}
                  data-testid={`flag-indicator-${flag.id}`}
                  data-flag-active={flag.active ? 'true' : 'false'}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 flex items-center justify-center ${
                      flag.active
                        ? `${flag.activeDotClass} ${flag.glowClass} border`
                        : `${flag.dimDotClass} border shadow-inner`
                    }`}
                  >
                    {/* Inner core specular highlight when lit */}
                    <div
                      className={`w-1 h-1 rounded-full transition-opacity duration-150 ${
                        flag.active ? 'bg-white/90 blur-[0.5px]' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* State Row: Label + Value Badge (1 (SET) vs 0 (CLR)) */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono py-1 border-t border-slate-800/60 my-0.5 min-w-0 w-full">
                <span className="text-[11px] text-slate-400 font-semibold tracking-wider shrink-0">
                  STATE:
                </span>
                <span
                  data-testid={`flag-badge-${flag.id}`}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold inline-flex items-center gap-1 shrink-0 transition-colors ${
                    flag.active
                      ? `${flag.activeColor} shadow-[0_0_10px_rgba(255,255,255,0.15)]`
                      : 'bg-slate-800/90 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <span>{flag.active ? '1' : '0'}</span>
                  <span className="text-[10px] opacity-80">
                    ({flag.active ? 'SET' : 'CLR'})
                  </span>
                </span>
              </div>

              {/* Contextual Reason / Description */}
              <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 leading-relaxed min-w-0 break-words [overflow-wrap:anywhere]">
                {flag.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
