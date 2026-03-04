'use client';
import React, { useState, useRef } from 'react';

export function NQueensSim() {
    const [n, setN] = useState(4);
    const [board, setBoard] = useState<number[]>([]);
    const [solCount, setSol] = useState(0);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Press Solve to start backtracking');
    let stopObj = useRef({ stop: false });

    const isValid = (bd: number[], row: number, col: number) => {
        for (let r = 0; r < row; r++) {
            let c = bd[r];
            if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
        }
        return true;
    };

    const solve = async () => {
        stopObj.current.stop = false; setRunning(true); setSol(0);
        let bd: number[] = []; let sols = 0;

        const stack = [{ row: 0, col: 0, b: [] as number[] }];

        while (stack.length > 0 && !stopObj.current.stop) {
            const state = stack.pop()!;
            let { row, col, b } = state;

            if (row === n) {
                sols++; setSol(sols); setMsg(`Found solution ${sols}!`);
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            if (col >= n) continue;

            stack.push({ row, col: col + 1, b: [...b] });

            setBoard([...b, col]);
            if (isValid(b, row, col)) {
                setMsg(`Placing Queen at (${row}, ${col})`);
                await new Promise(r => setTimeout(r, 200));
                stack.push({ row: row + 1, col: 0, b: [...b, col] });
            } else {
                setMsg(`Conflict at (${row}, ${col}) - backtracking`);
                await new Promise(r => setTimeout(r, 100));
            }
        }
        if (!stopObj.current.stop) setMsg(`Finished. Total solutions: ${sols}`);
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>N: <input type="number" min="4" max="8" value={n} onChange={e => { setN(+e.target.value); setBoard([]); setSol(0); }} style={{ width: 50, padding: '4px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} disabled={running} /></label>
                <button onClick={solve} disabled={running} style={{ padding: '6px 14px', background: '#ec4899', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Solve</button>
                <button onClick={() => { stopObj.current.stop = true; setRunning(false); setBoard([]); setMsg('Stopped & Cleared'); }} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Stop / Clear</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 40px)`, border: '2px solid #1e1e2e' }}>
                    {Array.from({ length: n * n }).map((_, i) => {
                        let r = Math.floor(i / n); let c = i % n;
                        let isBlack = (r + c) % 2 === 1;
                        let hasQ = board[r] === c;
                        let isConflict = false;
                        if (hasQ && r === board.length - 1 && !isValid(board.slice(0, r), r, c)) isConflict = true;

                        return (
                            <div key={i} style={{ width: 40, height: 40, background: isConflict ? '#ef4444' : isBlack ? '#334155' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, transition: 'background 0.2s' }}>
                                {hasQ ? (isConflict ? '❌' : '♛') : ''}
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: 20, fontSize: 14, fontWeight: 800, color: '#ec4899' }}>Solutions Found: {solCount}</div>
            </div>
        </div>
    );
}
