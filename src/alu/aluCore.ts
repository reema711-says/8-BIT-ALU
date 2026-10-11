import {
  Opcode,
  type ALUCalculationResult,
  type ALUFlags,
  type ALUOperationInfo,
} from './types';

export const OPERATIONS: Record<Opcode, ALUOperationInfo> = {
  [Opcode.ADD]: {
    opcode: Opcode.ADD,
    code3Bit: '000',
    name: 'Addition',
    mnemonic: 'ADD',
    symbol: '+',
    unit: 'arithmetic',
    description: 'Calculates the 8-bit sum of A and B (A + B).',
    expression: 'Y = (A + B) & 0xFF',
    flagBehavior: {
      carry: 'Set if sum > 255 (Carry out of Bit 7)',
      zero: 'Set if Result == 0x00',
      overflow: 'Set if signed 2’s complement overflow occurs',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.SUB]: {
    opcode: Opcode.SUB,
    code3Bit: '001',
    name: 'Subtraction',
    mnemonic: 'SUB',
    symbol: '-',
    unit: 'arithmetic',
    description: 'Calculates the 8-bit difference of A and B (A - B).',
    expression: 'Y = (A - B) & 0xFF',
    flagBehavior: {
      carry: 'Set if A < B (Borrow occurred)',
      zero: 'Set if Result == 0x00 (A == B)',
      overflow: 'Set if signed 2’s complement overflow occurs',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.AND]: {
    opcode: Opcode.AND,
    code3Bit: '010',
    name: 'Bitwise AND',
    mnemonic: 'AND',
    symbol: '&',
    unit: 'logic',
    description: 'Performs bitwise AND between each bit of A and B.',
    expression: 'Y = A & B',
    flagBehavior: {
      carry: 'Cleared to 0',
      zero: 'Set if Result == 0x00',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.OR]: {
    opcode: Opcode.OR,
    code3Bit: '011',
    name: 'Bitwise OR',
    mnemonic: 'OR',
    symbol: '|',
    unit: 'logic',
    description: 'Performs bitwise OR between each bit of A and B.',
    expression: 'Y = A | B',
    flagBehavior: {
      carry: 'Cleared to 0',
      zero: 'Set if Result == 0x00',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.XOR]: {
    opcode: Opcode.XOR,
    code3Bit: '100',
    name: 'Bitwise XOR',
    mnemonic: 'XOR',
    symbol: '^',
    unit: 'logic',
    description: 'Performs bitwise Exclusive-OR between each bit of A and B.',
    expression: 'Y = A ^ B',
    flagBehavior: {
      carry: 'Cleared to 0',
      zero: 'Set if Result == 0x00',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.NOT]: {
    opcode: Opcode.NOT,
    code3Bit: '101',
    name: 'Bitwise NOT A',
    mnemonic: 'NOT',
    symbol: '~A',
    unit: 'logic',
    description: 'Inverts every bit of input A (one’s complement of A). Input B is ignored.',
    expression: 'Y = (~A) & 0xFF',
    flagBehavior: {
      carry: 'Cleared to 0',
      zero: 'Set if Result == 0x00 (when A == 0xFF)',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.SHL]: {
    opcode: Opcode.SHL,
    code3Bit: '110',
    name: 'Logical Shift Left',
    mnemonic: 'SHL',
    symbol: '<< 1',
    unit: 'shifter',
    description: 'Shifts input A left by 1 position. Bit 7 moves into Carry, bit 0 fills with 0.',
    expression: 'Y = (A << 1) & 0xFF',
    flagBehavior: {
      carry: 'Set if Bit 7 was 1 prior to shift',
      zero: 'Set if Result == 0x00',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
  [Opcode.SHR]: {
    opcode: Opcode.SHR,
    code3Bit: '111',
    name: 'Logical Shift Right',
    mnemonic: 'SHR',
    symbol: '>> 1',
    unit: 'shifter',
    description: 'Shifts input A right by 1 position. Bit 0 moves into Carry, bit 7 fills with 0.',
    expression: 'Y = (A >>> 1) & 0xFF',
    flagBehavior: {
      carry: 'Set if Bit 0 was 1 prior to shift',
      zero: 'Set if Result == 0x00',
      overflow: 'Cleared to 0',
      negative: 'Set if MSB (Bit 7) is 1',
    },
  },
};

export const OPERATION_LIST = [
  OPERATIONS[Opcode.ADD],
  OPERATIONS[Opcode.SUB],
  OPERATIONS[Opcode.AND],
  OPERATIONS[Opcode.OR],
  OPERATIONS[Opcode.XOR],
  OPERATIONS[Opcode.NOT],
  OPERATIONS[Opcode.SHL],
  OPERATIONS[Opcode.SHR],
];

/**
 * Executes the ALU simulation for given 8-bit inputs and opcode.
 */
export function computeALU(a: number, b: number, opcode: Opcode): ALUCalculationResult {
  // Enforce 8-bit inputs
  const cleanA = (a & 0xFF) >>> 0;
  const cleanB = (b & 0xFF) >>> 0;
  const opInfo = OPERATIONS[opcode];

  let rawMath = 0;
  let result = 0;
  let carry = false;
  let overflow = false;
  let explanation = '';

  switch (opcode) {
    case Opcode.ADD: {
      rawMath = cleanA + cleanB;
      result = rawMath & 0xFF;
      carry = rawMath > 0xFF;

      // Signed 2's complement overflow:
      // Overflow occurs when adding two positive numbers yields a negative result,
      // or adding two negative numbers yields a positive result.
      const aSign = (cleanA & 0x80) !== 0;
      const bSign = (cleanB & 0x80) !== 0;
      const resSign = (result & 0x80) !== 0;
      overflow = (aSign === bSign) && (resSign !== aSign);

      explanation = `${cleanA} + ${cleanB} = ${rawMath}${carry ? ' (Carry bit generated)' : ''}${overflow ? ' [Signed Overflow!]' : ''}`;
      break;
    }

    case Opcode.SUB: {
      rawMath = cleanA - cleanB;
      result = (rawMath & 0xFF) >>> 0;
      // Borrow indicator: Carry flag is set when A < B (unsigned borrow)
      carry = cleanA < cleanB;

      // Signed 2's complement overflow:
      // Overflow occurs when subtracting a negative from a positive gives negative,
      // or subtracting a positive from a negative gives positive.
      const aSign = (cleanA & 0x80) !== 0;
      const bSign = (cleanB & 0x80) !== 0;
      const resSign = (result & 0x80) !== 0;
      overflow = (aSign !== bSign) && (resSign !== aSign);

      explanation = `${cleanA} - ${cleanB} = ${rawMath}${carry ? ' (Borrow generated / Carry=1)' : ''}${overflow ? ' [Signed Overflow!]' : ''}`;
      break;
    }

    case Opcode.AND: {
      rawMath = cleanA & cleanB;
      result = rawMath & 0xFF;
      carry = false;
      overflow = false;
      explanation = `Bitwise AND of ${toHex8(cleanA)} and ${toHex8(cleanB)} = ${toHex8(result)}`;
      break;
    }

    case Opcode.OR: {
      rawMath = cleanA | cleanB;
      result = rawMath & 0xFF;
      carry = false;
      overflow = false;
      explanation = `Bitwise OR of ${toHex8(cleanA)} and ${toHex8(cleanB)} = ${toHex8(result)}`;
      break;
    }

    case Opcode.XOR: {
      rawMath = cleanA ^ cleanB;
      result = rawMath & 0xFF;
      carry = false;
      overflow = false;
      explanation = `Bitwise XOR of ${toHex8(cleanA)} and ${toHex8(cleanB)} = ${toHex8(result)}`;
      break;
    }

    case Opcode.NOT: {
      rawMath = (~cleanA) & 0xFF;
      result = rawMath;
      carry = false;
      overflow = false;
      explanation = `One's complement NOT of ${toHex8(cleanA)} = ${toHex8(result)} (Input B is ignored)`;
      break;
    }

    case Opcode.SHL: {
      carry = (cleanA & 0x80) !== 0; // Bit 7 pushed out into Carry
      rawMath = (cleanA << 1);
      result = rawMath & 0xFF;
      overflow = false;
      explanation = `Shifted ${toBinary8(cleanA)} left by 1 = ${toBinary8(result)}${carry ? ' (Bit 7 shifted into Carry)' : ''}`;
      break;
    }

    case Opcode.SHR: {
      carry = (cleanA & 0x01) !== 0; // Bit 0 pushed out into Carry
      rawMath = (cleanA >>> 1);
      result = rawMath & 0xFF;
      overflow = false;
      explanation = `Shifted ${toBinary8(cleanA)} right by 1 = ${toBinary8(result)}${carry ? ' (Bit 0 shifted into Carry)' : ''}`;
      break;
    }
  }

  const zero = result === 0;
  const negative = (result & 0x80) !== 0;

  // Even parity calculation (parity bit set if number of set bits is even)
  let setBits = 0;
  for (let i = 0; i < 8; i++) {
    if ((result & (1 << i)) !== 0) setBits++;
  }
  const parity = setBits % 2 === 0;

  const flags: ALUFlags = {
    carry,
    zero,
    overflow,
    negative,
    parity,
  };

  const signedResult = toSigned8(result);

  return {
    a: cleanA,
    b: cleanB,
    opcode,
    result,
    signedResult,
    flags,
    operation: opInfo,
    rawMath,
    explanation,
  };
}

/**
 * Converts unsigned 8-bit integer (0..255) to 2's complement signed (-128..+127)
 */
export function toSigned8(val: number): number {
  const clean = val & 0xFF;
  return clean >= 128 ? clean - 256 : clean;
}

/**
 * Returns formatted 8-bit binary string (e.g. '1010 0101' or '10100101')
 */
export function toBinary8(val: number, spaceNibbles = true): string {
  const clean = (val & 0xFF).toString(2).padStart(8, '0');
  if (spaceNibbles) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  }
  return clean;
}

/**
 * Returns 2-character hex format e.g. '0x2F'
 */
export function toHex8(val: number): string {
  const clean = (val & 0xFF).toString(16).toUpperCase().padStart(2, '0');
  return `0x${clean}`;
}

/**
 * Returns array of 8 booleans where index 7 is MSB (bit 7) and index 0 is LSB (bit 0)
 */
export function numberToBitArray(val: number): boolean[] {
  const bits: boolean[] = [];
  for (let i = 0; i < 8; i++) {
    bits.push(((val >> i) & 1) === 1);
  }
  return bits; // bits[0] is bit0, bits[7] is bit7
}

/**
 * Converts array of 8 booleans (index 0 is bit0, index 7 is bit7) to number
 */
export function bitArrayToNumber(bits: boolean[]): number {
  let val = 0;
  for (let i = 0; i < 8; i++) {
    if (bits[i]) {
      val |= (1 << i);
    }
  }
  return (val & 0xFF) >>> 0;
}
