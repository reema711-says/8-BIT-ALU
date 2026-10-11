# 8-Bit ALU Simulator

An interactive, visual **8-Bit Arithmetic Logic Unit (ALU)** simulator built with React, TypeScript, and Tailwind CSS. Explore how hardware ALUs perform arithmetic and logical operations, manipulate bits, and evaluate processor status flags in real-time.

---

## ⚡ Features

- **Interactive Bit-Level Controls**: Toggle 8-bit inputs ($A$ and $B$) using DIP switches or enter decimal values directly.
- **8 Supported ALU Operations**:
  - `ADD` (000) — 8-bit Addition with carry-out
  - `SUB` (001) — 8-bit Subtraction with borrow detection
  - `AND` (010) — Bitwise AND
  - `OR` (011) — Bitwise OR
  - `XOR` (100) — Bitwise XOR
  - `NOT` (101) — Bitwise NOT (Invert A)
  - `SHL` (110) — Logical Shift Left
  - `SHR` (111) — Logical Shift Right
- **Status Flags (Condition Codes)**:
  - **Carry (C)**: Detected when addition overflows 8 bits, borrow occurs, or bits are shifted out.
  - **Zero (Z)**: Set when output is `00000000`.
  - **Overflow (V)**: Two's complement signed arithmetic overflow.
  - **Negative (N)**: Set when Most Significant Bit (Bit 7) is 1.
  - **Parity (P)**: Even parity check over output bits.
- **Hardware Visualizations**:
  - Live LED bit displays for inputs, outputs, and flag registers.
  - Dynamic ALU architecture block diagram highlighting active signal paths.
  - Truth table view and step-by-step math breakdowns.
  - Pre-configured educational presets (e.g., Overflow demo, Zero flag, Underflow).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm`

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/reema711-says/8-BIT-ALU.git
   cd 8-BIT-ALU
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173/
   ```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
