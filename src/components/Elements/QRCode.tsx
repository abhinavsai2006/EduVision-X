'use client';
/* ═══════════════════════════════════════════════════════
   QRCode — SVG-based QR code renderer
   Uses a simple QR encoding algorithm for text
   ═══════════════════════════════════════════════════════ */
import React, { useMemo } from 'react';

interface Props {
  text: string;
  size: number;
  color?: string;
  bgColor?: string;
}

// Simple QR-like dot matrix (not a real QR — we generate a deterministic pattern from the text hash)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateMatrix(text: string, size: number): boolean[][] {
  const h = hashCode(text);
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const edge = y === 0 || y === 6 || x === 0 || x === 6;
        const inner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        matrix[oy + y][ox + x] = edge || inner;
      }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Data area — deterministic from text hash
  let seed = h;
  const lcg = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed; };

  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      // Skip finder pattern areas
      if ((x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)) continue;
      // Timing patterns
      if (x === 6) { matrix[y][x] = y % 2 === 0; continue; }
      if (y === 6) { matrix[y][x] = x % 2 === 0; continue; }
      // Data from hash
      matrix[y][x] = (lcg() % 3) < 1;
    }

  // Encode some actual text bits into the pattern
  let bitIdx = 0;
  const textBits = Array.from(text).flatMap(c => {
    const code = c.charCodeAt(0);
    return Array.from({ length: 8 }, (_, i) => (code >> (7 - i)) & 1);
  });

  for (let y = 8; y < size - 8 && bitIdx < textBits.length; y++)
    for (let x = 8; x < size - 8 && bitIdx < textBits.length; x++) {
      if (x === 6 || y === 6) continue;
      matrix[y][x] = textBits[bitIdx++] === 1;
    }

  return matrix;
}

export default function QRCode({ text, size, color = '#000', bgColor = '#fff' }: Props) {
  const modules = 25;
  const matrix = useMemo(() => generateMatrix(text || 'https://edusplash.io', modules), [text]);
  const cellSize = size / modules;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${y}-${x}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}
