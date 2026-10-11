import React from 'react';
import { Opcode } from '../alu/types';
import { OPERATION_LIST } from '../alu/aluCore';
import { Table, CheckCircle2 } from 'lucide-react';

interface TruthTableProps {
  currentOpcode: Opcode;
  onSelectOpcode: (opcode: Opcode) => void;
}

export const TruthTable: React.FC<TruthTableProps> = ({
  currentOpcode,
  onSelectOpcode,
}) => {
  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            ALU FUNCTION TRUTH TABLE & MICRO-OPS
          </h2>
          <span className="text-[11px] font-mono text-slate-400">[CLICK ANY ROW TO SELECT]</span>
        </div>

        <div className="text-[11px] font-mono text-cyan-400/80 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>8 DEFINED MICRO-INSTRUCTIONS</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
              <th className="py-2.5 px-3 font-semibold">S2 S1 S0</th>
              <th className="py-2.5 px-3 font-semibold">DEC</th>
              <th className="py-2.5 px-3 font-semibold">OP</th>
              <th className="py-2.5 px-3 font-semibold">FUNCTION</th>
              <th className="py-2.5 px-3 font-semibold">DATAPATH UNIT</th>
              <th className="py-2.5 px-3 font-semibold">FORMULA</th>
              <th className="py-2.5 px-3 font-semibold">CARRY (C) RULE</th>
              <th className="py-2.5 px-3 font-semibold">OVERFLOW (V) RULE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {OPERATION_LIST.map((op) => {
              const isActive = op.opcode === currentOpcode;

              return (
                <tr
                  key={op.opcode}
                  onClick={() => onSelectOpcode(op.opcode)}
                  className={`transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-200 border-l-4 border-l-cyan-400 font-semibold'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  {/* Binary Opcode */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isActive
                          ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-400/50'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {op.code3Bit}
                    </span>
                  </td>

                  {/* Decimal Code */}
                  <td className="py-2.5 px-3 text-slate-400">
                    {op.opcode}
                  </td>

                  {/* Mnemonic */}
                  <td className="py-2.5 px-3 font-bold text-amber-300">
                    {op.mnemonic}
                  </td>

                  {/* Function Name */}
                  <td className="py-2.5 px-3 text-slate-200">
                    {op.name}
                  </td>

                  {/* Unit */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                        op.unit === 'arithmetic'
                          ? 'text-amber-400 bg-amber-950/40 border border-amber-900/40'
                          : op.unit === 'logic'
                          ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/40'
                          : 'text-purple-400 bg-purple-950/40 border border-purple-900/40'
                      }`}
                    >
                      {op.unit}
                    </span>
                  </td>

                  {/* Formula */}
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {op.expression}
                  </td>

                  {/* Carry Rule */}
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {op.flagBehavior.carry}
                  </td>

                  {/* Overflow Rule */}
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {op.flagBehavior.overflow}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
