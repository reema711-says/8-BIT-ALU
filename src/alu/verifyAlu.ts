import { computeALU } from './aluCore';
import { Opcode } from './types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Testing 8-bit ALU Core Operations ---');

// 1. ADD
{
  // 127 + 1 = 128 (Signed overflow)
  const res = computeALU(127, 1, Opcode.ADD);
  assert(res.result === 128, 'ADD: 127+1 should equal 128');
  assert(res.flags.overflow === true, 'ADD: 127+1 should set overflow flag');
  assert(res.flags.carry === false, 'ADD: 127+1 should not set carry flag');
  assert(res.flags.negative === true, 'ADD: 127+1 (128) has MSB=1 (negative)');
  assert(res.signedResult === -128, 'ADD: 128 is -128 in signed 2s complement');

  // 255 + 1 = 0 with carry
  const resCarry = computeALU(255, 1, Opcode.ADD);
  assert(resCarry.result === 0, 'ADD: 255+1 should wrap to 0');
  assert(resCarry.flags.carry === true, 'ADD: 255+1 should set carry');
  assert(resCarry.flags.zero === true, 'ADD: 255+1 should set zero');
  assert(resCarry.flags.overflow === false, 'ADD: 255+1 should not set signed overflow');
  console.log('✓ ADD operation & flags passed');
}

// 2. SUB
{
  // 10 - 25 = -15 (241 in 8-bit)
  const res = computeALU(10, 25, Opcode.SUB);
  assert(res.result === 241, 'SUB: 10 - 25 should equal 241 (0xF1)');
  assert(res.flags.carry === true, 'SUB: 10 - 25 should set carry (borrow)');
  assert(res.flags.negative === true, 'SUB: 10 - 25 should set negative');
  assert(res.signedResult === -15, 'SUB: 241 should be -15 signed');

  // 128 - 1 (-128 - 1 = +127, signed overflow)
  const resUnderflow = computeALU(128, 1, Opcode.SUB);
  assert(resUnderflow.result === 127, 'SUB: 128 - 1 = 127');
  assert(resUnderflow.flags.overflow === true, 'SUB: -128 - 1 should set overflow');

  // 42 - 42 = 0
  const resZero = computeALU(42, 42, Opcode.SUB);
  assert(resZero.result === 0, 'SUB: 42 - 42 = 0');
  assert(resZero.flags.zero === true, 'SUB: 42 - 42 should set zero');
  assert(resZero.flags.carry === false, 'SUB: 42 - 42 should not borrow');
  console.log('✓ SUB operation & flags passed');
}

// 3. AND
{
  const res = computeALU(0xAA, 0x0F, Opcode.AND);
  assert(res.result === 0x0A, 'AND: 0xAA & 0x0F = 0x0A');
  assert(res.flags.carry === false, 'AND carry should be 0');
  assert(res.flags.overflow === false, 'AND overflow should be 0');
  console.log('✓ AND operation passed');
}

// 4. OR
{
  const res = computeALU(0xF0, 0x0F, Opcode.OR);
  assert(res.result === 0xFF, 'OR: 0xF0 | 0x0F = 0xFF');
  assert(res.flags.negative === true, '0xFF has bit 7 set');
  console.log('✓ OR operation passed');
}

// 5. XOR
{
  const res = computeALU(0xFF, 0xAA, Opcode.XOR);
  assert(res.result === 0x55, 'XOR: 0xFF ^ 0xAA = 0x55');
  console.log('✓ XOR operation passed');
}

// 6. NOT A
{
  const res = computeALU(0x00, 0x99, Opcode.NOT);
  assert(res.result === 0xFF, 'NOT: ~0x00 = 0xFF');

  const resAllOnes = computeALU(0xFF, 0x00, Opcode.NOT);
  assert(resAllOnes.result === 0x00, 'NOT: ~0xFF = 0x00');
  assert(resAllOnes.flags.zero === true, 'NOT: ~0xFF is zero');
  console.log('✓ NOT operation passed');
}

// 7. SHL (Logical shift left)
{
  // 0b10000001 (129) << 1 = 0b00000010 (2) with Carry = 1
  const res = computeALU(0x81, 0, Opcode.SHL);
  assert(res.result === 0x02, 'SHL: 0x81 << 1 = 0x02');
  assert(res.flags.carry === true, 'SHL: MSB was 1, so carry must be true');

  // 0b01000000 (64) << 1 = 0b10000000 (128) with Carry = 0
  const resNoCarry = computeALU(64, 0, Opcode.SHL);
  assert(resNoCarry.result === 128, 'SHL: 64 << 1 = 128');
  assert(resNoCarry.flags.carry === false, 'SHL: carry should be false');
  assert(resNoCarry.flags.negative === true, 'SHL: MSB is 1');
  console.log('✓ SHL operation passed');
}

// 8. SHR (Logical shift right)
{
  // 0b00000011 (3) >> 1 = 0b00000001 (1) with Carry = 1
  const res = computeALU(3, 0, Opcode.SHR);
  assert(res.result === 1, 'SHR: 3 >> 1 = 1');
  assert(res.flags.carry === true, 'SHR: LSB was 1, so carry must be true');

  // 0b00000010 (2) >> 1 = 0b00000001 (1) with Carry = 0
  const resNoCarry = computeALU(2, 0, Opcode.SHR);
  assert(resNoCarry.result === 1, 'SHR: 2 >> 1 = 1');
  assert(resNoCarry.flags.carry === false, 'SHR: carry should be false');
  console.log('✓ SHR operation passed');
}

console.log('All 8 ALU operations verified successfully!');
