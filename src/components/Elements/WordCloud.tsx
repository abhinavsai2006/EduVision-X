'use client';
/* ═══════════════════════════════════════════════════════
   WordCloud — Renders a tag/word cloud using SVG
   ═══════════════════════════════════════════════════════ */
import React, { useMemo } from 'react';
import { WordCloudItem } from '@/types/slide';

interface Props {
  words: WordCloudItem[];
  width: number;
  height: number;
  colors?: string[];
}

export default function WordCloud({ words, width, height, colors }: Props) {
  const palette = colors || ['#6366f1', '#00cec9', '#fdcb6e', '#e17055', '#00b894', '#0984e3'];

  const positioned = useMemo(() => {
    if (!words || words.length === 0) return [];
    const sorted = [...words].sort((a, b) => b.weight - a.weight);
    const maxW = Math.max(...sorted.map(w => w.weight), 1);
    const minFont = 12;
    const maxFont = Math.min(48, height / 3);

    // Simple spiral placement
    const placed: { text: string; x: number; y: number; fontSize: number; color: string; rotate: number }[] = [];
    const cx = width / 2;
    const cy = height / 2;

    sorted.forEach((word, i) => {
      const fontSize = minFont + ((word.weight / maxW) * (maxFont - minFont));
      const color = palette[i % palette.length];
      const rotate = i % 3 === 0 ? 0 : (i % 3 === 1 ? -30 : 30);

      // Spiral out from center
      const angle = i * 0.7;
      const radius = 8 + i * (Math.min(width, height) / (sorted.length * 1.8));
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      placed.push({
        text: word.text,
        x: Math.max(10, Math.min(x, width - 10)),
        y: Math.max(fontSize, Math.min(y, height - 10)),
        fontSize,
        color,
        rotate,
      });
    });
    return placed;
  }, [words, width, height, palette]);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {positioned.map((w, i) => (
        <text
          key={i}
          x={w.x}
          y={w.y}
          fontSize={w.fontSize}
          fill={w.color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight={w.fontSize > 28 ? 'bold' : 'normal'}
          fontFamily="Inter, system-ui, sans-serif"
          transform={`rotate(${w.rotate}, ${w.x}, ${w.y})`}
          style={{ transition: 'all 0.3s' }}
        >
          {w.text}
        </text>
      ))}
    </svg>
  );
}
