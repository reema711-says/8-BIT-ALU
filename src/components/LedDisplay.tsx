import React from 'react';
import { numberToBitArray, toBinary8, toHex8 } from '../alu/aluCore';
import type { ALUCalculationResult } from '../alu/types';
import { Lightbulb, Check, Copy } from 'lucide-react';

interface LedDisplayProps {
  calculation: ALUCalculationResult;
}

export const LedDisplay: React.FC<LedDisplayProps> = ({ calculation }) => {
  const [copied, setCopied] = React.useState(false);
  const { result, signedResult, explanation } = calculation;
  const bits = numberToBitArray(result); // bits[0] is bit0, bits[7] is bit7

  const copyToClipboard = () => {
    const text = `ALU Output: ${toBinary8(result)} (${toHex8(result)}, Dec: ${result}, Signed: ${signedResult})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col gap-4 relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            ALU OUTPUT BUS (Y)
          </h2>
          <span className="text-[11px] font-mono text-emerald-400/80">[8-BIT DATA BUS]</span>
        </div>

        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
          title="Copy output data values"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      {/* 8-Bit Output LED Bank (Y7 down to Y0) */}
      <div className="bg-slate-950/90 p-4 sm:p-5 rounded-lg border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3 px-1">
          <span>MSB (Y7)</span>
          <span className="text-emerald-400/70 font-semibold">OUTPUT LED INDICATORS</span>
          <span>LSB (Y0)</span>
        </div>

        <div className="grid grid-cols-8 gap-2 sm:gap-4 text-center">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIdx) => {
            const isSet = bits[bitIdx];
            const weight = Math.pow(2, bitIdx);

            return (
              <div key={bitIdx} className="flex flex-col items-center">
                {/* Bit Name & Weight */}
                <div className="text-[11px] font-mono font-bold text-slate-200 mb-0.5">
                  Y{bitIdx}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mb-2">
                  {weight}
                </div>

                {/* Glowing LED Fixture */}
                <div className="relative flex flex-col items-center">
                  {/* Metal Bezel */}
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full p-1 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border border-slate-600/80 flex items-center justify-center shadow-md">
                    {/* Inner Diode Lens */}
                    <div
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full transition-all duration-150 flex items-center justify-center ${
                        isSet
                          ? 'bg-emerald-400 led-glow-green border border-emerald-200'
                          : 'bg-emerald-950/40 border border-emerald-900/40 shadow-inner'
                      }`}
                    >
                      {/* Internal Cathode filament reflection */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSet
                            ? 'bg-white opacity-80 blur-[1px]'
                            : 'bg-emerald-900/20'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Logical State Readout */}
                  <div
                    className={`mt-2 font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      isSet
                        ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
                        : 'text-slate-600 bg-slate-900/60 border border-slate-800'
                    }`}
                  >
                    {isSet ? '1' : '0'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Radix Digital Meters (Binary, Hex, Dec, Signed Dec) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 font-mono">
        {/* Binary */}
        <div className="lcd-readout p-3 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>BINARY</span>
            <span className="text-slate-500 text-[9px]">(BASE-2)</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-emerald-400 tracking-wider">
            {toBinary8(result)}
          </div>
        </div>

        {/* Hexadecimal */}
        <div className="lcd-readout p-3 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>HEX</span>
            <span className="text-slate-500 text-[9px]">(BASE-16)</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-cyan-400">
            {toHex8(result)}
          </div>
        </div>

        {/* Unsigned Decimal */}
        <div className="lcd-readout p-3 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>UNSIGNED DEC</span>
            <span className="text-slate-500 text-[9px]">(0..255)</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-amber-300">
            {result}
          </div>
        </div>

        {/* Signed Decimal */}
        <div className="lcd-readout p-3 rounded-lg flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-between">
            <span>SIGNED (2'S COMP)</span>
            <span className="text-slate-500 text-[9px]">(-128..+127)</span>
          </div>
          <div className="mt-1 text-sm sm:text-base font-bold text-purple-300">
            {signedResult > 0 ? `+${signedResult}` : signedResult}
          </div>
        </div>
      </div>

      {/* Live Math Expression Explanation */}
      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
        <span className="text-emerald-400 font-bold shrink-0">EVALUATION:</span>
        <span className="text-slate-200">{explanation}</span>
      </div>
    </div>
  );
};
