import React from 'react';
import { numberToBitArray, toSigned8 } from '../alu/aluCore';
import { Shuffle, RotateCw } from 'lucide-react';

interface DipSwitchGroupProps {
  label: string;
  name: 'A' | 'B';
  value: number;
  onChange: (newValue: number) => void;
  accentColor: 'cyan' | 'emerald';
  disabled?: boolean;
}

export const DipSwitchGroup: React.FC<DipSwitchGroupProps> = ({
  label,
  name,
  value,
  onChange,
  accentColor,
  disabled = false,
}) => {
  const bits = numberToBitArray(value); // bits[0] is bit0, bits[7] is bit7

  const toggleBit = (bitIndex: number) => {
    if (disabled) return;
    const newBits = [...bits];
    newBits[bitIndex] = !newBits[bitIndex];
    let newVal = 0;
    for (let i = 0; i < 8; i++) {
      if (newBits[i]) newVal |= (1 << i);
    }
    onChange(newVal & 0xFF);
  };

  const handleDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onChange(0);
    } else {
      onChange(Math.max(0, Math.min(255, parsed)));
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^0x/i, '');
    const parsed = parseInt(raw, 16);
    if (!isNaN(parsed)) {
      onChange(Math.max(0, Math.min(255, parsed)));
    }
  };

  const setAll = (val: number) => {
    onChange(val & 0xFF);
  };

  const invert = () => {
    onChange((~value) & 0xFF);
  };

  const randomize = () => {
    onChange(Math.floor(Math.random() * 256));
  };

  const isCyan = accentColor === 'cyan';
  const borderAccent = isCyan ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const textAccent = isCyan ? 'text-cyan-400' : 'text-emerald-400';
  const switchActiveBg = isCyan ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]';

  return (
    <div className={`digital-panel rounded-xl p-4 sm:p-5 flex flex-col gap-4 border ${borderAccent} relative overflow-hidden`}>
      {/* Background Circuit Decal */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none font-mono text-[70px] font-black select-none text-slate-100 flex items-center justify-center">
        {name}
      </div>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isCyan ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            INPUT {name}
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">[{label}]</span>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAll(0)}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Set all bits to 0"
          >
            CLR (0)
          </button>
          <button
            type="button"
            onClick={() => setAll(255)}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Set all bits to 1 (255)"
          >
            ALL 1s
          </button>
          <button
            type="button"
            onClick={invert}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-0.5"
            title="Invert all bits"
          >
            <RotateCw className="w-2.5 h-2.5" />
            <span>NOT</span>
          </button>
          <button
            type="button"
            onClick={randomize}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-0.5"
            title="Generate random 8-bit value"
          >
            <Shuffle className="w-2.5 h-2.5" />
            <span>RND</span>
          </button>
        </div>
      </div>

      {/* 8-bit DIP Rocker Switches (D7 down to D0) */}
      <div className="bg-slate-950/80 p-3 sm:p-4 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 px-1">
          <span>MSB (Bit 7)</span>
          <span className="text-slate-600">8-BIT DIP SWITCH BANK</span>
          <span>LSB (Bit 0)</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 sm:gap-2.5 text-center">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
            const isSet = bits[bitIdx];
            const weight = Math.pow(2, bitIdx);

            return (
              <div key={bitIdx} className="flex flex-col items-center">
                {/* Bit Name & Weight */}
                <div className="text-[10px] font-mono font-bold text-slate-300 mb-0.5">
                  D{bitIdx}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mb-2">
                  {weight}
                </div>

                {/* Tactile Switch Mechanism */}
                <button
                  type="button"
                  onClick={() => toggleBit(bitIdx)}
                  disabled={disabled}
                  className={`group w-9 sm:w-11 h-18 sm:h-20 rounded-md p-1 flex flex-col justify-between items-center transition-all cursor-pointer select-none switch-slot ${
                    disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-600'
                  }`}
                  title={`Toggle Bit ${bitIdx} (Weight ${weight}): Currently ${isSet ? '1 (ON)' : '0 (OFF)'}`}
                >
                  {/* Status Indicator LED on switch */}
                  <div
                    className={`w-2.5 h-1.5 rounded-sm transition-all duration-200 ${
                      isSet
                        ? switchActiveBg
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />

                  {/* Rocker Switch Toggle Actuator */}
                  <div
                    className={`w-full py-2 sm:py-2.5 rounded text-[11px] font-bold font-mono transition-all duration-150 border flex flex-col items-center justify-center ${
                      isSet
                        ? `${isCyan ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.4)] -translate-y-1' : 'bg-emerald-900/60 border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.4)] -translate-y-1'}`
                        : 'bg-slate-800/90 border-slate-700 text-slate-400 translate-y-1'
                    }`}
                  >
                    <span>{isSet ? '1' : '0'}</span>
                    <span className="text-[8px] opacity-60">
                      {isSet ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="text-[7px] text-slate-600 font-mono">
                    {isSet ? 'UP' : 'DN'}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Numeric Radix Inputs & Readouts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs font-mono">
        {/* Hex Input */}
        <div className="lcd-readout p-2 rounded-lg flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">HEX (0x)</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-slate-500 font-bold">0x</span>
            <input
              type="text"
              maxLength={2}
              value={(value & 0xFF).toString(16).toUpperCase().padStart(2, '0')}
              onChange={handleHexChange}
              disabled={disabled}
              className={`w-full bg-transparent font-mono font-bold text-sm ${textAccent} focus:outline-none focus:underline`}
            />
          </div>
        </div>

        {/* Decimal Unsigned Input */}
        <div className="lcd-readout p-2 rounded-lg flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">DEC (UNSIGNED)</span>
          <div className="flex items-center gap-1 mt-1">
            <input
              type="number"
              min={0}
              max={255}
              value={value}
              onChange={handleDecChange}
              disabled={disabled}
              className={`w-full bg-transparent font-mono font-bold text-sm ${textAccent} focus:outline-none focus:underline`}
            />
          </div>
        </div>

        {/* Signed 2's Complement Readout */}
        <div className="lcd-readout p-2 rounded-lg flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase">SIGNED (2'S COMP)</span>
          <div className="mt-1 font-mono font-bold text-sm text-slate-200">
            {toSigned8(value) > 0 ? `+${toSigned8(value)}` : toSigned8(value)}
          </div>
        </div>
      </div>
    </div>
  );
};
