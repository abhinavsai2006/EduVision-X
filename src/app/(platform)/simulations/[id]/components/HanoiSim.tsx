'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function HanoiSim() {
    const [n, setN] = useState(3);
    const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []]);
    const [running, setRunning] = useState(false);
    const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
    const [msg, setMsg] = useState('Solve or move disks manually!');
    const [movesCount, setMovesCount] = useState(0);

    const reset = (count: number) => {
        setN(count);
        setPegs([[...Array.from({ length: count }).map((_, i) => count - i)], [], []]);
        setMovesCount(0);
        setSelectedPeg(null);
        setMsg(`Reset with ${count} disks`);
    };

    const solve = async () => {
        setRunning(true);
        let p = [[...Array.from({ length: n }).map((_, i) => n - i)], [], []];
        setPegs(p); setMovesCount(0);
        setMsg('Calculating moves...');

        const moves: [number, number][] = [];
        const hanoi = (disks: number, src: number, aux: number, dest: number) => {
            if (disks === 0) return;
            hanoi(disks - 1, src, dest, aux);
            moves.push([src, dest]);
            hanoi(disks - 1, aux, src, dest);
        };
        hanoi(n, 0, 1, 2);

        for (let m = 0; m < moves.length; m++) {
            let [from, to] = moves[m];
            setMsg(`Move ${m + 1}/${moves.length}: Peg ${from + 1} → ${to + 1}`);
            let disk = p[from].pop()!;
            p[to].push(disk);
            setPegs([...p.map(x => [...x])]);
            setMovesCount(m + 1);
            await new Promise(r => setTimeout(r, 600));
        }
        setMsg(`✓ Solved in ${moves.length} moves!`);
        setRunning(false);
    };

    const handlePegClick = (idx: number) => {
        if (running) return;
        if (selectedPeg === null) {
            if (pegs[idx].length === 0) return;
            setSelectedPeg(idx);
            setMsg(`Selected disk from Peg ${idx + 1}`);
        } else {
            if (selectedPeg === idx) {
                setSelectedPeg(null);
                setMsg('Deselected');
                return;
            }
            const diskToMove = pegs[selectedPeg][pegs[selectedPeg].length - 1];
            const targetTopDisk = pegs[idx][pegs[idx].length - 1];

            if (targetTopDisk !== undefined && diskToMove > targetTopDisk) {
                setMsg('Invalid Move: Cannot place larger disk on smaller one!');
                setSelectedPeg(null);
                return;
            }

            let newPegs = [...pegs.map(p => [...p])];
            newPegs[idx].push(newPegs[selectedPeg].pop()!);
            setPegs(newPegs);
            setMovesCount(prev => prev + 1);
            setSelectedPeg(null);
            setMsg(`Moved to Peg ${idx + 1}`);

            if (newPegs[2].length === n) {
                setMsg(`★ Victory! Completed in ${movesCount + 1} moves!`);
            }
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#0a0a0f' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 20, alignItems: 'center', background: '#0d0d14' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>DISKS: {n}</span>
                    <input type="range" min="3" max="8" value={n} onChange={e => reset(+e.target.value)} disabled={running} style={{ accentColor: '#6366f1', width: 100 }} />
                </div>
                <div style={{ width: 1, height: 20, background: '#1e1e2e' }} />
                <button onClick={solve} disabled={running} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Auto Solve</button>
                <button onClick={() => reset(n)} disabled={running} style={{ padding: '8px 16px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Reset</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{msg}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 60px 80px 60px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: 24, padding: '8px 16px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12 }}>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>TOTAL MOVES</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{movesCount}</div>
                </div>

                {pegs.map((peg, pIdx) => {
                    const isSelected = selectedPeg === pIdx;
                    return (
                        <div
                            key={pIdx}
                            onClick={() => handlePegClick(pIdx)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
                                width: 180, height: 240, justifyContent: 'flex-end', cursor: running ? 'default' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <motion.div
                                animate={{ background: isSelected ? '#6366f1' : '#1e1e2e' }}
                                style={{ position: 'absolute', width: 12, height: '100%', borderRadius: 6, zIndex: 0, border: '1px solid #334155' }}
                            />
                            <div style={{ position: 'absolute', bottom: -30, fontSize: 11, fontWeight: 900, color: isSelected ? '#818cf8' : '#475569' }}>PEG {pIdx + 1}</div>
                            <div style={{ position: 'absolute', bottom: -12, width: '100%', height: 12, background: '#1e1e2e', borderRadius: 6, border: '1px solid #334155' }} />
                            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2, zIndex: 1, width: '100%', alignItems: 'center' }}>
                                {peg.map((disk, i) => {
                                    const isTop = i === peg.length - 1;
                                    return (
                                        <motion.div
                                            layoutId={`disk-${disk}`}
                                            key={`disk-${disk}`}
                                            animate={{
                                                y: (isSelected && isTop) ? -40 : 0,
                                                boxShadow: (isSelected && isTop) ? '0 0 20px rgba(99,102,241,0.5)' : 'none',
                                                border: (isSelected && isTop) ? '2px solid #fff' : '1px solid rgba(0,0,0,0.3)'
                                            }}
                                            style={{
                                                width: 40 + disk * 18, height: 24,
                                                background: `linear-gradient(to bottom, hsl(${disk * 45}, 70%, 60%), hsl(${disk * 45}, 70%, 40%))`,
                                                borderRadius: 8, zIndex: 5
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: 20, background: '#0d0d14', borderTop: '1px solid #1e1e2e', fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                Tip: Click a peg to pick up its top disk, then click a target peg to move it.
            </div>
        </div>
    );
}
