import React, { useState, useMemo } from 'react';
import { Opcode, type PresetScenario } from './alu/types';
import { computeALU } from './alu/aluCore';
import { Header } from './components/Header';
import { DipSwitchGroup } from './components/DipSwitchGroup';
import { OpcodeSelector } from './components/OpcodeSelector';
import { LedDisplay } from './components/LedDisplay';
import { FlagsPanel } from './components/FlagsPanel';
import { BlockDiagram } from './components/BlockDiagram';
import { TruthTable } from './components/TruthTable';
import { PresetsBar } from './components/PresetsBar';

export const App: React.FC = () => {
  // ALU State
  const [inputA, setInputA] = useState<number>(15); // Default 0x0F
  const [inputB, setInputB] = useState<number>(27); // Default 0x1B
  const [opcode, setOpcode] = useState<Opcode>(Opcode.ADD);
  const [activePreset, setActivePreset] = useState<PresetScenario | undefined>(undefined);

  // Real-time ALU Computation
  const calculation = useMemo(() => {
    return computeALU(inputA, inputB, opcode);
  }, [inputA, inputB, opcode]);

  // Master Reset
  const handleReset = () => {
    setInputA(0);
    setInputB(0);
    setOpcode(Opcode.ADD);
    setActivePreset(undefined);
  };

  // Preset Selection
  const handleLoadPreset = (preset: PresetScenario) => {
    setInputA(preset.a);
    setInputB(preset.b);
    setOpcode(preset.opcode);
    setActivePreset(preset);
  };

  const handleInputAChange = (val: number) => {
    setInputA(val);
    setActivePreset(undefined);
  };

  const handleInputBChange = (val: number) => {
    setInputB(val);
    setActivePreset(undefined);
  };

  const handleOpcodeChange = (op: Opcode) => {
    setOpcode(op);
    setActivePreset(undefined);
  };

  const isInputBDisabled = opcode === Opcode.NOT || opcode === Opcode.SHL || opcode === Opcode.SHR;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation & Status Bar */}
      <Header
        onReset={handleReset}
        activeOpName={`${calculation.operation.mnemonic} (${calculation.operation.code3Bit})`}
      />

      {/* Main Digital Engineering Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* PRESET QUICK-SCENARIOS TOOLBAR */}
        <PresetsBar
          onLoadPreset={handleLoadPreset}
          activePresetId={activePreset?.id}
        />

        {/* SECTION 1: DUAL 8-BIT INPUT SWITCH BANKS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DipSwitchGroup
            label="Operand A [8-Bit Primary]"
            name="A"
            value={inputA}
            onChange={handleInputAChange}
            accentColor="cyan"
          />

          <DipSwitchGroup
            label={
              isInputBDisabled
                ? "Operand B [Bypassed for Unary Op]"
                : "Operand B [8-Bit Secondary]"
            }
            name="B"
            value={inputB}
            onChange={handleInputBChange}
            accentColor="emerald"
            disabled={isInputBDisabled}
          />
        </section>

        {/* SECTION 2: 3-BIT OPCODE CONTROLLER & FUNCTION SELECTOR */}
        <section>
          <OpcodeSelector
            currentOpcode={opcode}
            onChange={handleOpcodeChange}
          />
        </section>

        {/* SECTION 3: 8-BIT OUTPUT LED INDICATORS */}
        <section>
          <LedDisplay calculation={calculation} />
        </section>

        {/* SECTION 4: STATUS FLAGS REGISTER */}
        <section>
          <FlagsPanel
            calculation={calculation}
            highlightFlag={activePreset?.highlightFlag}
          />
        </section>

        {/* SECTION 4: HARDWARE BLOCK DIAGRAM SCHEMATIC */}
        <section>
          <BlockDiagram
            a={inputA}
            b={inputB}
            opcode={opcode}
            result={calculation.result}
            flags={calculation.flags}
          />
        </section>

        {/* SECTION 5: INTERACTIVE TRUTH TABLE */}
        <section>
          <TruthTable
            currentOpcode={opcode}
            onSelectOpcode={handleOpcodeChange}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>8-Bit ALU Digital Simulator • React + TypeScript + Vite + Tailwind CSS</span>
          <span>Operations: ADD, SUB, AND, OR, XOR, NOT, SHL, SHR</span>
          <span className="text-slate-400">Two’s Complement Signed & Unsigned Modes</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
