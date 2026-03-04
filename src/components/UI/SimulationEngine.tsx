'use client';
/* ═══════════════════════════════════════════════════════
   SimulationEngine — Interactive data & algorithm 
   visualization builder
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SimType = 'sorting' | 'pathfinding' | 'physics' | 'graph' | 'tree' | 'wave';

const SIM_OPTIONS: { id: SimType; icon: string; name: string; desc: string }[] = [
  { id: 'sorting', icon: '📊', name: 'Sorting Visualizer', desc: 'Watch sorting algorithms in real time' },
  { id: 'pathfinding', icon: '🗺️', name: 'Pathfinding', desc: 'A*, Dijkstra on a grid' },
  { id: 'physics', icon: '⚛️', name: 'Physics Sandbox', desc: 'Gravity, collisions, pendulums' },
  { id: 'graph', icon: '🕸️', name: 'Graph Explorer', desc: 'BFS, DFS, shortest paths' },
  { id: 'tree', icon: '🌳', name: 'Tree Visualizer', desc: 'BST, AVL, Red-Black operations' },
  { id: 'wave', icon: '🌊', name: 'Wave Simulator', desc: 'Sine waves, interference, standing waves' },
];

interface Props { open: boolean; onClose: () => void; }

export default function SimulationEngine({ open, onClose }: Props) {
  const [simType, setSimType] = useState<SimType>('sorting');
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  // Sorting visualizer state
  const [sortArray, setSortArray] = useState<number[]>([]);
  const [sortAlgo, setSortAlgo] = useState<'bubble' | 'quick' | 'merge' | 'insertion'>('bubble');
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const sortStep = useRef(0);

  // Wave state
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(50);
  const wavePhase = useRef(0);

  const resetSort = useCallback(() => {
    const arr = Array.from({ length: 40 }, () => Math.floor(Math.random() * 180) + 20);
    setSortArray(arr);
    setComparing([]);
    setSorted([]);
    sortStep.current = 0;
    setRunning(false);
  }, []);

  useEffect(() => { resetSort(); }, [resetSort, simType]);

  // Draw sorting visualization
  useEffect(() => {
    if (simType !== 'sorting' || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    ctx.clearRect(0, 0, w, h);

    const barW = Math.floor(w / sortArray.length) - 1;
    sortArray.forEach((val, i) => {
      let color = '#6366f1';
      if (comparing.includes(i)) color = '#f59e0b';
      if (sorted.includes(i)) color = '#10b981';
      ctx.fillStyle = color;
      ctx.fillRect(i * (barW + 1), h - val, barW, val);
    });
  }, [sortArray, comparing, sorted, simType]);

  // Bubble sort step by step
  useEffect(() => {
    if (!running || simType !== 'sorting') return;
    const delay = Math.max(5, 200 - speed * 2);

    let i = 0, j = 0;
    const arr = [...sortArray];
    const n = arr.length;

    const step = () => {
      if (i >= n) {
        setRunning(false);
        setSorted(arr.map((_, idx) => idx));
        return;
      }
      if (j >= n - i - 1) {
        setSorted(prev => [...prev, n - i - 1]);
        i++;
        j = 0;
        animRef.current = window.setTimeout(step, delay);
        return;
      }
      setComparing([j, j + 1]);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setSortArray([...arr]);
      }
      j++;
      animRef.current = window.setTimeout(step, delay);
    };

    animRef.current = window.setTimeout(step, delay);
    return () => clearTimeout(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, simType]);

  // Wave animation
  useEffect(() => {
    if (simType !== 'wave' || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const w = canvasRef.current!.width;
      const h = canvasRef.current!.height;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(99,102,241,0.1)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

      // Center axis
      ctx.strokeStyle = 'rgba(99,102,241,0.3)';
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

      // Wave 1
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + amplitude * Math.sin((x / w) * Math.PI * 2 * frequency + wavePhase.current);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 (interference)
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + amplitude * 0.6 * Math.sin((x / w) * Math.PI * 2 * (frequency * 1.5) + wavePhase.current * 0.7);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Combined wave
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y1 = amplitude * Math.sin((x / w) * Math.PI * 2 * frequency + wavePhase.current);
        const y2 = amplitude * 0.6 * Math.sin((x / w) * Math.PI * 2 * (frequency * 1.5) + wavePhase.current * 0.7);
        const y = h / 2 + y1 + y2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (running) {
        wavePhase.current += 0.03 * (speed / 50);
        animRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [simType, running, frequency, amplitude, speed]);

  // Pathfinding grid
  const [grid, setGrid] = useState<number[][]>([]);
  useEffect(() => {
    if (simType === 'pathfinding') {
      const g: number[][] = Array.from({ length: 15 }, () =>
        Array.from({ length: 25 }, () => Math.random() < 0.25 ? 1 : 0)
      );
      g[0][0] = 2; // start
      g[14][24] = 3; // end
      setGrid(g);
    }
  }, [simType]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9988] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', height: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🔬 Simulation Engine</h2>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sim type sidebar */}
            <div className="w-[180px] shrink-0 overflow-y-auto p-2 space-y-1" style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
              {SIM_OPTIONS.map(s => (
                <button key={s.id}
                  className="w-full text-left p-2 rounded-lg transition-colors"
                  style={{
                    background: simType === s.id ? 'var(--accent-dim)' : 'transparent',
                    border: simType === s.id ? '1px solid var(--accent)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => { setSimType(s.id); setRunning(false); }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-xs font-medium" style={{ color: simType === s.id ? 'var(--accent)' : 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <p className="text-[9px] mt-0.5 ml-5" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Canvas + controls */}
            <div className="flex-1 flex flex-col">
              {/* Controls bar */}
              <div className="flex items-center gap-3 px-4 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                <button className="btn-primary flex items-center gap-1" style={{ fontSize: 11, padding: '3px 12px' }}
                  onClick={() => setRunning(!running)}>
                  {running ? '⏸ Pause' : '▶ Run'}
                </button>
                <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }}
                  onClick={resetSort}>↺ Reset</button>

                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Speed</span>
                  <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(+e.target.value)}
                    style={{ width: 80 }} />
                </div>

                {simType === 'sorting' && (
                  <select className="input-field" value={sortAlgo} onChange={e => setSortAlgo(e.target.value as typeof sortAlgo)}
                    style={{ fontSize: 10, padding: '3px 6px' }}>
                    <option value="bubble">Bubble Sort</option>
                    <option value="quick">Quick Sort</option>
                    <option value="merge">Merge Sort</option>
                    <option value="insertion">Insertion Sort</option>
                  </select>
                )}

                {simType === 'wave' && (
                  <>
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Freq</span>
                      <input type="range" min="1" max="10" value={frequency} onChange={e => setFrequency(+e.target.value)}
                        style={{ width: 60 }} />
                      <span className="text-[10px]" style={{ color: 'var(--text-primary)' }}>{frequency}Hz</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Amp</span>
                      <input type="range" min="10" max="100" value={amplitude} onChange={e => setAmplitude(+e.target.value)}
                        style={{ width: 60 }} />
                    </div>
                  </>
                )}
              </div>

              {/* Canvas */}
              <div className="flex-1 p-4 flex items-center justify-center overflow-hidden" style={{ background: '#0d1117' }}>
                {(simType === 'sorting' || simType === 'wave') && (
                  <canvas ref={canvasRef} width={700} height={350}
                    style={{ borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)' }} />
                )}

                {simType === 'pathfinding' && (
                  <div className="flex flex-col gap-0" style={{ background: '#111' }}>
                    {grid.map((row, ri) => (
                      <div key={ri} className="flex gap-0">
                        {row.map((cell, ci) => (
                          <div key={ci}
                            className="transition-colors"
                            style={{
                              width: 24, height: 24,
                              background: cell === 1 ? '#374151' : cell === 2 ? '#10b981' : cell === 3 ? '#ef4444' : cell === 4 ? '#6366f1' : cell === 5 ? '#fbbf24' : '#1a1a2e',
                              border: '1px solid #1f2937',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const g = grid.map(r => [...r]);
                              g[ri][ci] = g[ri][ci] === 0 ? 1 : g[ri][ci] === 1 ? 0 : g[ri][ci];
                              setGrid(g);
                            }}
                          />
                        ))}
                      </div>
                    ))}
                    <div className="flex gap-3 mt-3 px-1">
                      {[
                        { color: '#10b981', label: 'Start' },
                        { color: '#ef4444', label: 'End' },
                        { color: '#374151', label: 'Wall' },
                        { color: '#6366f1', label: 'Visited' },
                        { color: '#fbbf24', label: 'Path' },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                          <span className="text-[9px]" style={{ color: '#9ca3af' }}>{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {simType === 'graph' && (
                  <div className="text-center">
                    <svg width="500" height="300" viewBox="0 0 500 300">
                      {/* Edges */}
                      {[[100,80,200,150],[200,150,350,100],[350,100,400,220],[200,150,250,250],[100,80,150,230],[150,230,250,250],[250,250,400,220]].map(([x1,y1,x2,y2], i) => (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth="2" opacity="0.5" />
                      ))}
                      {/* Nodes */}
                      {[[100,80,'A'],[200,150,'B'],[350,100,'C'],[400,220,'D'],[250,250,'E'],[150,230,'F']].map(([x,y,l]) => (
                        <g key={String(l)} style={{ cursor: 'pointer' }}>
                          <circle cx={Number(x)} cy={Number(y)} r="18" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
                          <text x={Number(x)} y={Number(y)} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="bold">{String(l)}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                )}

                {simType === 'tree' && (
                  <div className="text-center">
                    <svg width="500" height="300" viewBox="0 0 500 300">
                      {/* Edges */}
                      {[[250,30,150,90],[250,30,350,90],[150,90,100,160],[150,90,200,160],[350,90,300,160],[350,90,400,160],[100,160,75,230],[100,160,125,230],[200,160,175,230],[200,160,225,230]].map(([x1,y1,x2,y2], i) => (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth="2" opacity="0.5" />
                      ))}
                      {/* Nodes */}
                      {[[250,30,50],[150,90,25],[350,90,75],[100,160,12],[200,160,37],[300,160,62],[400,160,87],[75,230,6],[125,230,18],[175,230,31],[225,230,43]].map(([x,y,v]) => (
                        <g key={`${x}-${y}`}>
                          <circle cx={Number(x)} cy={Number(y)} r="16" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
                          <text x={Number(x)} y={Number(y)} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10" fontWeight="bold">{Number(v)}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                )}

                {simType === 'physics' && (
                  <div className="text-center" style={{ color: '#6366f1' }}>
                    <svg width="500" height="300" viewBox="0 0 500 300">
                      {/* Ground */}
                      <line x1="0" y1="280" x2="500" y2="280" stroke="#374151" strokeWidth="2" />
                      {/* Pendulum */}
                      <line x1="250" y1="20" x2="200" y2="200" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="200" cy="200" r="15" fill="#6366f1" />
                      {/* Bouncing ball */}
                      <circle cx="400" cy="230" r="20" fill="#ec4899" />
                      {/* Projectile path */}
                      <path d="M 50 270 Q 150 100 300 270" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
                      <circle cx="150" cy="150" r="6" fill="#10b981" />
                      {/* Labels */}
                      <text x="200" y="240" textAnchor="middle" fill="#818cf8" fontSize="10">Pendulum</text>
                      <text x="400" y="270" textAnchor="middle" fill="#f472b6" fontSize="10">Bounce</text>
                      <text x="175" y="130" textAnchor="middle" fill="#34d399" fontSize="10">Projectile</text>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info bar */}
              <div className="px-4 py-1.5 shrink-0 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {SIM_OPTIONS.find(s => s.id === simType)?.name} · 
                  {simType === 'sorting' && ` ${sortArray.length} items · ${sortAlgo}`}
                  {simType === 'wave' && ` ${frequency}Hz · Amplitude: ${amplitude}`}
                  {simType === 'pathfinding' && ` ${grid.length}×${grid[0]?.length || 0} grid`}
                </span>
                <span className="text-[10px]" style={{ color: running ? '#10b981' : 'var(--text-muted)' }}>
                  {running ? '● Running' : '○ Paused'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
