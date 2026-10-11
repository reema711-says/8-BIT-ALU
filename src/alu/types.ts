export const Opcode = {
  ADD: 0,   // 000
  SUB: 1,   // 001
  AND: 2,   // 010
  OR:  3,   // 011
  XOR: 4,   // 100
  NOT: 5,   // 101 (NOT A)
  SHL: 6,   // 110 (Logical Shift Left)
  SHR: 7,   // 111 (Logical Shift Right)
} as const;

export type Opcode = (typeof Opcode)[keyof typeof Opcode];

export type UnitCategory = 'arithmetic' | 'logic' | 'shifter';

export interface ALUFlags {
  carry: boolean;       // Carry out or borrow or shifted-out bit
  zero: boolean;        // Result == 0
  overflow: boolean;    // Two's complement signed overflow
  negative: boolean;    // MSB (Bit 7) is 1
  parity: boolean;      // True if number of set bits in result is even
}

export interface ALUOperationInfo {
  opcode: Opcode;
  code3Bit: string;     // '000', '001', etc.
  name: string;
  mnemonic: string;
  symbol: string;
  unit: UnitCategory;
  description: string;
  expression: string;
  flagBehavior: {
    carry: string;
    zero: string;
    overflow: string;
    negative: string;
  };
}

export interface ALUCalculationResult {
  a: number;
  b: number;
  opcode: Opcode;
  result: number;         // 0 - 255
  signedResult: number;   // -128 to +127
  flags: ALUFlags;
  operation: ALUOperationInfo;
  rawMath: number;
  explanation: string;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  a: number;
  b: number;
  opcode: Opcode;
  highlightFlag?: keyof ALUFlags;
}
