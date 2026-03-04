'use client';
/* ═══════════════════════════════════════════════════════
   FunctionPlot — Mathematical function plotter using SVG
   ═══════════════════════════════════════════════════════ */
import React, { useMemo } from 'react';

interface Props {
  fn: string;
  xMin: number;
  xMax: number;
  width: number;
  height: number;
  strokeColor?: string;
}

export default function FunctionPlot({ fn, xMin, xMax, width, height, strokeColor }: Props) {
  const { path, yMin, yMax, gridLines } = useMemo(() => {
    const steps = 200;
    const dx = (xMax - xMin) / steps;
    const points: [number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      try {
        // Safely evaluate the function
        const evalFn = new Function('x', 'Math', `return ${fn}`);
        const y = evalFn(x, Math);
        if (typeof y === 'number' && isFinite(y)) {
          points.push([x, y]);
        }
      } catch {
        // skip invalid points
      }
    }

    if (points.length === 0) return { path: '', yMin: -1, yMax: 1, gridLines: [] };

    const ys = points.map(p => p[1]);
    let yMinV = Math.min(...ys);
    let yMaxV = Math.max(...ys);
    // Add padding
    const yRange = yMaxV - yMinV || 2;
    yMinV -= yRange * 0.1;
    yMaxV += yRange * 0.1;

    const pad = 40;
    const pw = width - pad * 2;
    const ph = height - pad * 2;

    const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * pw;
    const toSvgY = (y: number) => pad + ((yMaxV - y) / (yMaxV - yMinV)) * ph;

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p[0]).toFixed(2)},${toSvgY(p[1]).toFixed(2)}`).join(' ');

    // Grid lines
    const grids: { x1: number; y1: number; x2: number; y2: number; label?: string; axis?: boolean }[] = [];
    // X axis (y=0)
    if (yMinV <= 0 && yMaxV >= 0) {
      grids.push({ x1: pad, y1: toSvgY(0), x2: width - pad, y2: toSvgY(0), axis: true });
    }
    // Y axis (x=0)
    if (xMin <= 0 && xMax >= 0) {
      grids.push({ x1: toSvgX(0), y1: pad, x2: toSvgX(0), y2: height - pad, axis: true });
    }
    // X labels
    const xStep = Math.ceil((xMax - xMin) / 8);
    for (let x = Math.ceil(xMin); x <= xMax; x += xStep) {
      grids.push({ x1: toSvgX(x), y1: pad, x2: toSvgX(x), y2: height - pad, label: String(x) });
    }

    return { path: d, yMin: yMinV, yMax: yMaxV, gridLines: grids };
  }, [fn, xMin, xMax, width, height]);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ background: '#fafafe' }}>
      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
            stroke={g.axis ? '#333' : '#e0e0e0'}
            strokeWidth={g.axis ? 1.5 : 0.5}
          />
          {g.label && (
            <text x={g.x1} y={height - 5} fontSize="9" fill="#999" textAnchor="middle">{g.label}</text>
          )}
        </g>
      ))}
      {/* Function curve */}
      {path && (
        <path d={path} fill="none" stroke={strokeColor || '#6366f1'} strokeWidth={2.5} strokeLinecap="round" />
      )}
      {/* Label */}
      <text x={width - 10} y={20} fontSize="11" fill="#999" textAnchor="end" fontFamily="Fira Code, monospace">
        f(x) = {fn}
      </text>
    </svg>
  );
}
