import React from 'react';
import { Opcode, type UnitCategory } from '../alu/types';
import { toBinary8, toHex8 } from '../alu/aluCore';
import { Network, Zap } from 'lucide-react';

interface BlockDiagramProps {
  a: number;
  b: number;
  opcode: Opcode;
  result: number;
  flags: {
    carry: boolean;
    zero: boolean;
    overflow: boolean;
    negative: boolean;
  };
}

export const BlockDiagram: React.FC<BlockDiagramProps> = ({
  a,
  b,
  opcode,
  result,
  flags,
}) => {
  // Determine which unit is active based on opcode
  let activeUnit: UnitCategory = 'arithmetic';
  if (opcode === Opcode.ADD || opcode === Opcode.SUB) {
    activeUnit = 'arithmetic';
  } else if (
    opcode === Opcode.AND ||
    opcode === Opcode.OR ||
    opcode === Opcode.XOR ||
    opcode === Opcode.NOT
  ) {
    activeUnit = 'logic';
  } else {
    activeUnit = 'shifter';
  }

  const isArith = activeUnit === 'arithmetic';
  const isLogic = activeUnit === 'logic';
  const isShift = activeUnit === 'shifter';

  const opBinary = opcode.toString(2).padStart(3, '0');

  return (
    <div className="digital-panel rounded-xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold font-mono tracking-wide text-slate-100">
            INTERNAL ALU DATAPATH ARCHITECTURE
          </h2>
          <span className="text-[11px] font-mono text-slate-400">[HARDWARE BLOCK DIAGRAM]</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">ACTIVE PATH:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            {activeUnit.toUpperCase()} UNIT → MUX [{opBinary}]
          </span>
        </div>
      </div>

      {/* SVG Circuit Schematic */}
      <div className="w-full overflow-x-auto bg-slate-950/90 rounded-lg p-2 sm:p-4 border border-slate-900 shadow-inner">
        <svg
          viewBox="0 0 920 460"
          className="w-full min-w-[700px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bus Arrows */}
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-flow"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-flow"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-flow"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-dim"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-flow"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155" />
            </marker>

            {/* Glowing filter effects */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* GRID BACKGROUND PATTERN */}
          <g opacity="0.15">
            <line x1="0" y1="80" x2="920" y2="80" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="180" x2="920" y2="180" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="280" x2="920" y2="280" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="380" x2="920" y2="380" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="160" y1="0" x2="160" y2="460" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="450" y1="0" x2="450" y2="460" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="680" y1="0" x2="680" y2="460" stroke="#475569" strokeWidth="0.5" strokeDasharray="4 4" />
          </g>

          {/* ======================================================== */}
          {/* 1. INPUT BUS TERMINALS (LEFT) */}
          {/* ======================================================== */}

          {/* Input Bus A */}
          <g id="input-bus-a">
            <rect x="20" y="70" width="110" height="54" rx="6" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
            <text x="75" y="93" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              INPUT BUS A
            </text>
            <text x="75" y="112" fill="#bae6fd" fontSize="11" fontFamily="monospace" textAnchor="middle">
              {toHex8(a)} [{a}]
            </text>
            <text x="135" y="85" fill="#38bdf8" fontSize="9" fontFamily="monospace">/8</text>
          </g>

          {/* Input Bus B */}
          <g id="input-bus-b">
            <rect x="20" y="170" width="110" height="54" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
            <text x="75" y="193" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              INPUT BUS B
            </text>
            <text x="75" y="212" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="middle">
              {toHex8(b)} [{b}]
            </text>
            <text x="135" y="185" fill="#34d399" fontSize="9" fontFamily="monospace">/8</text>
          </g>

          {/* 3-Bit Control Opcode Input */}
          <g id="opcode-bus-top">
            <rect x="20" y="270" width="110" height="54" rx="6" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
            <text x="75" y="293" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              OPCODE [S2:0]
            </text>
            <text x="75" y="312" fill="#fef3c7" fontSize="11" fontFamily="monospace" textAnchor="middle">
              '{opBinary}' ({opcode})
            </text>
            <text x="135" y="285" fill="#fbbf24" fontSize="9" fontFamily="monospace">/3</text>
          </g>

          {/* ======================================================== */}
          {/* BUS ROUTING WIRES FROM INPUTS TO FUNCTIONAL UNITS */}
          {/* ======================================================== */}

          {/* Bus A main trunk line */}
          <path
            d="M 130 97 L 220 97 L 220 310"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
          />

          {/* Bus B main trunk line */}
          <path
            d="M 130 197 L 200 197 L 200 230"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
          />

          {/* Bus A taps into:
              1. Arithmetic Unit (Y=70)
              2. Logic Unit (Y=180)
              3. Shifter Unit (Y=290)
          */}
          <path
            d="M 220 70 L 290 70"
            fill="none"
            stroke={isArith ? "#38bdf8" : "#1e293b"}
            strokeWidth={isArith ? "3" : "1.5"}
            markerEnd={isArith ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isArith ? "active-signal-line" : ""}
          />
          <path
            d="M 220 180 L 290 180"
            fill="none"
            stroke={isLogic ? "#38bdf8" : "#1e293b"}
            strokeWidth={isLogic ? "3" : "1.5"}
            markerEnd={isLogic ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isLogic ? "active-signal-line" : ""}
          />
          <path
            d="M 220 290 L 290 290"
            fill="none"
            stroke={isShift ? "#38bdf8" : "#1e293b"}
            strokeWidth={isShift ? "3" : "1.5"}
            markerEnd={isShift ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isShift ? "active-signal-line" : ""}
          />

          {/* Bus B taps into:
              1. Arithmetic Unit (Y=90)
              2. Logic Unit (Y=200)
              (Shifter ignores B in standard 1-bit shifts)
          */}
          <path
            d="M 200 90 L 290 90"
            fill="none"
            stroke={isArith ? "#34d399" : "#1e293b"}
            strokeWidth={isArith ? "3" : "1.5"}
            markerEnd={isArith ? "url(#arrow-emerald)" : "url(#arrow-dim)"}
            className={isArith ? "active-signal-line" : ""}
          />
          <path
            d="M 200 200 L 290 200"
            fill="none"
            stroke={isLogic && opcode !== Opcode.NOT ? "#34d399" : "#1e293b"}
            strokeWidth={isLogic && opcode !== Opcode.NOT ? "3" : "1.5"}
            markerEnd={isLogic && opcode !== Opcode.NOT ? "url(#arrow-emerald)" : "url(#arrow-dim)"}
            className={isLogic && opcode !== Opcode.NOT ? "active-signal-line" : ""}
          />

          {/* Opcode distribution line to MUX selector */}
          <path
            d="M 130 297 L 170 297 L 170 415 L 610 415 L 610 335"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            markerEnd="url(#arrow-amber)"
            strokeDasharray="4 2"
          />
          <text x="360" y="430" fill="#fbbf24" fontSize="10" fontFamily="monospace" textAnchor="middle">
            SELECT BUS [S2:S0] → MUX CHANNEL {opcode}
          </text>

          {/* ======================================================== */}
          {/* 2. THREE INTERNAL ALU FUNCTIONAL UNITS (CENTER) */}
          {/* ======================================================== */}

          {/* UNIT 1: ARITHMETIC UNIT */}
          <g id="arithmetic-unit" opacity={isArith ? 1 : 0.45}>
            <rect
              x="290"
              y="40"
              width="200"
              height="80"
              rx="8"
              fill={isArith ? "#111827" : "#0b0f19"}
              stroke={isArith ? "#06b6d4" : "#334155"}
              strokeWidth={isArith ? 2.5 : 1}
              filter={isArith ? "url(#glow-cyan)" : undefined}
            />
            <text x="390" y="65" fill={isArith ? "#22d3ee" : "#64748b"} fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              ARITHMETIC UNIT
            </text>
            <text x="390" y="82" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              8-Bit Parallel Adder / Subtractor
            </text>
            <text x="390" y="100" fill={isArith ? "#67e8f9" : "#475569"} fontSize="9.5" fontFamily="monospace" textAnchor="middle">
              Ops: ADD (000) • SUB (001)
            </text>
          </g>

          {/* UNIT 2: LOGIC UNIT */}
          <g id="logic-unit" opacity={isLogic ? 1 : 0.45}>
            <rect
              x="290"
              y="150"
              width="200"
              height="80"
              rx="8"
              fill={isLogic ? "#111827" : "#0b0f19"}
              stroke={isLogic ? "#06b6d4" : "#334155"}
              strokeWidth={isLogic ? 2.5 : 1}
              filter={isLogic ? "url(#glow-cyan)" : undefined}
            />
            <text x="390" y="175" fill={isLogic ? "#22d3ee" : "#64748b"} fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              LOGIC UNIT (ALU CORE)
            </text>
            <text x="390" y="192" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Bitwise Gate Array (AND/OR/XOR/NOT)
            </text>
            <text x="390" y="210" fill={isLogic ? "#67e8f9" : "#475569"} fontSize="9.5" fontFamily="monospace" textAnchor="middle">
              Ops: AND (010) • OR (011) • XOR (100) • NOT (101)
            </text>
          </g>

          {/* UNIT 3: SHIFTER UNIT */}
          <g id="shifter-unit" opacity={isShift ? 1 : 0.45}>
            <rect
              x="290"
              y="260"
              width="200"
              height="80"
              rx="8"
              fill={isShift ? "#111827" : "#0b0f19"}
              stroke={isShift ? "#06b6d4" : "#334155"}
              strokeWidth={isShift ? 2.5 : 1}
              filter={isShift ? "url(#glow-cyan)" : undefined}
            />
            <text x="390" y="285" fill={isShift ? "#22d3ee" : "#64748b"} fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              SHIFTER UNIT
            </text>
            <text x="390" y="302" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Logical Barrel Shifter
            </text>
            <text x="390" y="320" fill={isShift ? "#67e8f9" : "#475569"} fontSize="9.5" fontFamily="monospace" textAnchor="middle">
              Ops: SHL &lt;&lt; 1 (110) • SHR &gt;&gt; 1 (111)
            </text>
          </g>

          {/* ======================================================== */}
          {/* 3. MULTIPLEXER (MUX 8:1) */}
          {/* ======================================================== */}

          {/* Output lines from units to MUX input ports */}
          {/* Arithmetic to MUX ports 0 and 1 */}
          <path
            d="M 490 80 L 570 80 L 570 120 L 585 120"
            fill="none"
            stroke={isArith ? "#06b6d4" : "#334155"}
            strokeWidth={isArith ? "2.5" : "1.5"}
            markerEnd={isArith ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isArith ? "active-signal-line" : ""}
          />

          {/* Logic to MUX ports 2, 3, 4, 5 */}
          <path
            d="M 490 190 L 585 190"
            fill="none"
            stroke={isLogic ? "#06b6d4" : "#334155"}
            strokeWidth={isLogic ? "2.5" : "1.5"}
            markerEnd={isLogic ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isLogic ? "active-signal-line" : ""}
          />

          {/* Shifter to MUX ports 6, 7 */}
          <path
            d="M 490 300 L 570 300 L 570 260 L 585 260"
            fill="none"
            stroke={isShift ? "#06b6d4" : "#334155"}
            strokeWidth={isShift ? "2.5" : "1.5"}
            markerEnd={isShift ? "url(#arrow-cyan)" : "url(#arrow-dim)"}
            className={isShift ? "active-signal-line" : ""}
          />

          {/* MUX 8:1 Trapezoid shape */}
          <g id="multiplexer">
            <polygon
              points="585,60 645,100 645,280 585,320"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text x="615" y="165" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              MUX
            </text>
            <text x="615" y="185" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              8 : 1
            </text>
            <text x="615" y="205" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
              SEL [S2:0]
            </text>

            {/* MUX Input ports labels */}
            {[
              { y: 85, label: '0: ADD', active: opcode === Opcode.ADD },
              { y: 115, label: '1: SUB', active: opcode === Opcode.SUB },
              { y: 150, label: '2: AND', active: opcode === Opcode.AND },
              { y: 175, label: '3: OR', active: opcode === Opcode.OR },
              { y: 200, label: '4: XOR', active: opcode === Opcode.XOR },
              { y: 225, label: '5: NOT', active: opcode === Opcode.NOT },
              { y: 260, label: '6: SHL', active: opcode === Opcode.SHL },
              { y: 290, label: '7: SHR', active: opcode === Opcode.SHR },
            ].map((p, idx) => (
              <circle
                key={idx}
                cx="585"
                cy={p.y}
                r={p.active ? 4.5 : 2.5}
                fill={p.active ? "#f59e0b" : "#475569"}
                stroke={p.active ? "#fff" : "none"}
                strokeWidth="1"
              />
            ))}
          </g>

          {/* ======================================================== */}
          {/* 4. MUX OUTPUT BUS TO OUTPUT REGISTER & BUS Y */}
          {/* ======================================================== */}
          <path
            d="M 645 190 L 730 190"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            markerEnd="url(#arrow-emerald)"
            className="active-signal-line"
          />
          <text x="685" y="180" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">
            /8 [DATA]
          </text>

          {/* Output Register Box */}
          <g id="output-register">
            <rect
              x="730"
              y="155"
              width="160"
              height="70"
              rx="8"
              fill="#064e3b"
              stroke="#10b981"
              strokeWidth="2"
              filter="url(#glow-cyan)"
            />
            <text x="810" y="180" fill="#a7f3d0" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              OUTPUT BUS (Y)
            </text>
            <text x="810" y="200" fill="#6ee7b7" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {toBinary8(result)}
            </text>
            <text x="810" y="215" fill="#d1fae5" fontSize="10" fontFamily="monospace" textAnchor="middle">
              HEX: {toHex8(result)} • DEC: {result}
            </text>
          </g>

          {/* ======================================================== */}
          {/* 5. STATUS FLAGS GENERATOR LOGIC */}
          {/* ======================================================== */}
          {/* Flag tap line from ALU path */}
          <path
            d="M 685 190 L 685 360 L 730 360"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            markerEnd="url(#arrow-dim)"
            strokeDasharray="4 2"
          />

          <g id="flag-generator">
            <rect
              x="730"
              y="325"
              width="160"
              height="70"
              rx="8"
              fill="#4c0519"
              stroke="#f43f5e"
              strokeWidth="1.5"
            />
            <text x="810" y="348" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              FLAG LOGIC & REGISTER
            </text>
            <g transform="translate(745, 360)">
              {/* Carry LED */}
              <circle cx="15" cy="15" r="5" fill={flags.carry ? "#f59e0b" : "#334155"} />
              <text x="15" y="30" fill="#fef3c7" fontSize="8" fontFamily="monospace" textAnchor="middle">C</text>

              {/* Zero LED */}
              <circle cx="45" cy="15" r="5" fill={flags.zero ? "#06b6d4" : "#334155"} />
              <text x="45" y="30" fill="#cffafe" fontSize="8" fontFamily="monospace" textAnchor="middle">Z</text>

              {/* Overflow LED */}
              <circle cx="75" cy="15" r="5" fill={flags.overflow ? "#ef4444" : "#334155"} />
              <text x="75" y="30" fill="#fee2e2" fontSize="8" fontFamily="monospace" textAnchor="middle">V</text>

              {/* Negative LED */}
              <circle cx="105" cy="15" r="5" fill={flags.negative ? "#a855f7" : "#334155"} />
              <text x="105" y="30" fill="#f3e8ff" fontSize="8" fontFamily="monospace" textAnchor="middle">N</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Schematic Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-sky-400" />
            <span>Bus A (8-bit)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400" />
            <span>Bus B (8-bit)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400" />
            <span>Opcode Control (3-bit)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-400" />
            <span>Flag Sensing Tap</span>
          </span>
        </div>
        <div className="text-slate-500 italic">
          Dynamic datapath updates in real-time as switches toggle
        </div>
      </div>
    </div>
  );
};
