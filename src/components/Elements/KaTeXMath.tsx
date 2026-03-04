'use client';
import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Props {
  latex: string;
  fontSize?: string;
  color?: string;
}

export default function KaTeXMath({ latex, fontSize = '28px', color = '#333' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(latex || 'E = mc^2', ref.current, {
        displayMode: true,
        throwOnError: false,
        trust: true,
      });
    } catch {
      if (ref.current) ref.current.textContent = latex || 'E = mc²';
    }
  }, [latex]);

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center overflow-auto"
      style={{ fontSize, color }}
    />
  );
}
