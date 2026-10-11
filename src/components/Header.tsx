import { Cpu, RotateCcw, Activity } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  activeOpName: string;
}

export const Header: React.FC<HeaderProps> = ({ onReset, activeOpName }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 sm:px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-slate-100 font-mono">
                8-BIT ALU SIMULATOR
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                v2.0 • 74LS-SERIES
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Digital Electronics Datapath & Micro-Architecture Simulator
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">ACTIVE OP:</span>
            <span className="text-cyan-300 font-bold">{activeOpName}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
            <span>REAL-TIME BUS</span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 hover:text-rose-100 text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)] active:scale-95 cursor-pointer"
            title="Reset Inputs A & B to 0, Opcode to ADD (000)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>MASTER RESET</span>
          </button>
        </div>
      </div>
    </header>
  );
};
