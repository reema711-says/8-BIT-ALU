import { computeALU } from './aluCore';
import { Opcode, type ALUFlags } from './types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`FAIL: ${msg}`);
  }
}

// Simulates the flag items mapping logic from FlagsPanel.tsx
function getFlagPanelStates(flags: ALUFlags) {
  return [
    { id: 'carry', name: 'Carry / Borrow', active: flags.carry, expectedStateText: flags.carry ? '1 (SET)' : '0 (CLR)' },
    { id: 'zero', name: 'Zero Flag', active: flags.zero, expectedStateText: flags.zero ? '1 (SET)' : '0 (CLR)' },
    { id: 'overflow', name: 'Signed Overflow', active: flags.overflow, expectedStateText: flags.overflow ? '1 (SET)' : '0 (CLR)' },
    { id: 'negative', name: 'Negative / Sign', active: flags.negative, expectedStateText: flags.negative ? '1 (SET)' : '0 (CLR)' },
    { id: 'parity', name: 'Even Parity', active: flags.parity, expectedStateText: flags.parity ? '1 (SET)' : '0 (CLR)' },
  ];
}

console.log('--- Testing Status Flags State & Indicator Synchronization ---');

// Test Case 1: Carry & Zero active, Overflow inactive, Negative inactive
{
  const res = computeALU(255, 1, Opcode.ADD);
  const items = getFlagPanelStates(res.flags);
  
  const carry = items.find(i => i.id === 'carry')!;
  assert(carry.active === true && carry.expectedStateText === '1 (SET)', 'Carry must be 1 (SET) for 255 + 1');
  
  const zero = items.find(i => i.id === 'zero')!;
  assert(zero.active === true && zero.expectedStateText === '1 (SET)', 'Zero must be 1 (SET) for 255 + 1 = 0');
  
  const overflow = items.find(i => i.id === 'overflow')!;
  assert(overflow.active === false && overflow.expectedStateText === '0 (CLR)', 'Overflow must be 0 (CLR) for unsigned wrap');
  
  console.log('✓ Test Case 1: Carry & Zero active (255 + 1) passed');
}

// Test Case 2: Signed Overflow and Negative active
{
  const res = computeALU(127, 1, Opcode.ADD); // +127 + +1 = 128 (-128)
  const items = getFlagPanelStates(res.flags);

  const overflow = items.find(i => i.id === 'overflow')!;
  assert(overflow.active === true && overflow.expectedStateText === '1 (SET)', 'Overflow must be 1 (SET) for 127 + 1');

  const negative = items.find(i => i.id === 'negative')!;
  assert(negative.active === true && negative.expectedStateText === '1 (SET)', 'Negative must be 1 (SET) for 128 (0x80)');

  const carry = items.find(i => i.id === 'carry')!;
  assert(carry.active === false && carry.expectedStateText === '0 (CLR)', 'Carry must be 0 (CLR) for 127 + 1');

  console.log('✓ Test Case 2: Signed Overflow & Negative active (127 + 1) passed');
}

// Test Case 3: Subtraction with Borrow & Negative
{
  const res = computeALU(10, 25, Opcode.SUB); // 10 - 25 = -15 (241)
  const items = getFlagPanelStates(res.flags);

  const carry = items.find(i => i.id === 'carry')!;
  assert(carry.active === true && carry.expectedStateText === '1 (SET)', 'Carry/Borrow must be 1 (SET) for 10 - 25');

  const negative = items.find(i => i.id === 'negative')!;
  assert(negative.active === true && negative.expectedStateText === '1 (SET)', 'Negative must be 1 (SET) for 241 (MSB=1)');

  const zero = items.find(i => i.id === 'zero')!;
  assert(zero.active === false && zero.expectedStateText === '0 (CLR)', 'Zero must be 0 (CLR) for 10 - 25');

  console.log('✓ Test Case 3: Subtraction Borrow & Negative (10 - 25) passed');
}

// Test Case 4: Subtraction Exact Zero
{
  const res = computeALU(88, 88, Opcode.SUB);
  const items = getFlagPanelStates(res.flags);

  const zero = items.find(i => i.id === 'zero')!;
  assert(zero.active === true && zero.expectedStateText === '1 (SET)', 'Zero must be 1 (SET) for 88 - 88');

  const carry = items.find(i => i.id === 'carry')!;
  assert(carry.active === false && carry.expectedStateText === '0 (CLR)', 'Carry must be 0 (CLR) for 88 - 88');

  console.log('✓ Test Case 4: Subtraction Exact Zero (88 - 88) passed');
}

// Test Case 5: Parity flag even vs odd
{
  // 0x03 has 2 ones -> even parity (1)
  const resEven = computeALU(0x01, 0x02, Opcode.OR);
  const itemsEven = getFlagPanelStates(resEven.flags);
  const parityEven = itemsEven.find(i => i.id === 'parity')!;
  assert(parityEven.active === true && parityEven.expectedStateText === '1 (SET)', 'Parity must be 1 (SET) for 2 set bits');

  // 0x01 has 1 one -> odd parity (0)
  const resOdd = computeALU(0x01, 0x00, Opcode.OR);
  const itemsOdd = getFlagPanelStates(resOdd.flags);
  const parityOdd = itemsOdd.find(i => i.id === 'parity')!;
  assert(parityOdd.active === false && parityOdd.expectedStateText === '0 (CLR)', 'Parity must be 0 (CLR) for 1 set bit');

  console.log('✓ Test Case 5: Even vs Odd Parity passed');
}

// Test Case 6: Shift operations with Carry
{
  const resShl = computeALU(0x80, 0, Opcode.SHL);
  const itemsShl = getFlagPanelStates(resShl.flags);
  const carryShl = itemsShl.find(i => i.id === 'carry')!;
  assert(carryShl.active === true && carryShl.expectedStateText === '1 (SET)', 'SHL: Carry must be 1 when bit 7 is shifted out');

  const resShr = computeALU(0x01, 0, Opcode.SHR);
  const itemsShr = getFlagPanelStates(resShr.flags);
  const carryShr = itemsShr.find(i => i.id === 'carry')!;
  assert(carryShr.active === true && carryShr.expectedStateText === '1 (SET)', 'SHR: Carry must be 1 when bit 0 is shifted out');

  console.log('✓ Test Case 6: Shift Left and Shift Right Carry detection passed');
}

console.log('ALL FLAG INDICATOR & BADGE STATE TESTS PASSED!');
