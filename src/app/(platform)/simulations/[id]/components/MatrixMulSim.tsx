'use client';
import React, { useState } from 'react';

export function MatrixMulSim() {
    const [strA, setStrA] = useState('1, 2, 3\n4, 5, 6');
    const [strB, setStrB] = useState('7, 8\n9, 10\n11, 12');

    const [A, setA] = useState([[1, 2, 3], [4, 5, 6]]);
    const [B, setB] = useState([[7, 8], [9, 10], [11, 12]]);
    const [C, setC] = useState<number[][]>([[0, 0], [0, 0]]);

    const [hlA, setHlA] = useState(-1);
    const [hlB, setHlB] = useState(-1);
    const [hlC, setHlC] = useState<{ r: number, c: number } | null>(null);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Edit matrices and press Run to multiply');

    const parseMatrix = (str: string) => {
        try {
            return str.trim().split('\n').filter(l => l.trim() !== '').map(row =>
                row.split(/[,]+/).map(val => {
                    let n = parseFloat(val.trim());
                    return isNaN(n) ? 0 : n;
                })
            );
        } catch {
            return [];
        }
    };

    const handleUpdate = () => {
        let pA = parseMatrix(strA);
        let pB = parseMatrix(strB);

        if (pA.length === 0 || pB.length === 0 || pA[0].length === 0 || pB[0].length === 0) {
            setMsg('Invalid matrix format. Use commas to separate columns and newlines for rows.');
            return false;
        }

        let aCols = pA[0].length;
        let bCols = pB[0].length;
        if (!pA.every(r => r.length === aCols) || !pB.every(r => r.length === bCols)) {
            setMsg('Matrices must be rectangular (all rows have equal columns).');
            return false;
        }

        if (pA[0].length !== pB.length) {
            setMsg(`Dimensions mismatch! A cols (${pA[0].length}) must equal B rows (${pB.length}).`);
            return false;
        }

        setA(pA);
        setB(pB);
        setC(Array.from({ length: pA.length }, () => Array(pB[0].length).fill(0)));
        setMsg('Matrices updated! Press Run.');
        return true;
    };

    const run = async () => {
        if (!handleUpdate()) return;

        let pA = parseMatrix(strA);
        let pB = parseMatrix(strB);

        setRunning(true);
        let nC = Array.from({ length: pA.length }, () => Array(pB[0].length).fill(0));
        setC(nC);

        for (let i = 0; i < pA.length; i++) {
            for (let j = 0; j < pB[0].length; j++) {
                setHlA(i); setHlB(j); setHlC({ r: i, c: j });
                let sum = 0;
                let calcStr = '';
                for (let k = 0; k < pA[0].length; k++) {
                    sum += pA[i][k] * pB[k][j];
                    calcStr += `${pA[i][k]}×${pB[k][j]}${k < pA[0].length - 1 ? ' + ' : ''}`;
                }
                setMsg(`C[${i}][${j}] = ${calcStr} = ${sum}`);
                await new Promise(r => setTimeout(r, 1500));
                nC[i][j] = sum; setC([...nC]);
            }
        }
        setHlA(-1); setHlB(-1); setHlC(null); setMsg('Matrix multiplication complete'); setRunning(false);
    };

    const renderMatrix = (m: number[][], title: string, hlRow: number, hlCol: number, isRes = false) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{title}</div>
            <div style={{ background: '#0d0d14', padding: 8, borderRadius: 8, border: '1px solid #1e1e2e', display: 'grid', gridTemplateRows: `repeat(${m.length}, 1fr)`, gap: 4 }}>
                {m.map((row, r) => (
                    <div key={r} style={{ display: 'flex', gap: 4 }}>
                        {row.map((val, c) => {
                            let hl = false;
                            if (hlRow === r && hlCol === -1) hl = true;
                            if (hlRow === -1 && hlCol === c) hl = true;
                            if (hlRow === r && hlCol === c) hl = true;
                            return (
                                <div key={c} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hl ? '#14b8a6' : '#111118', color: hl ? '#fff' : (isRes && val === 0 && running ? '#475569' : '#e2e8f0'), border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 13, fontWeight: 800, transition: 'all 0.3s', overflow: 'hidden' }}>
                                    {val}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Multiply</button>
                <button onClick={() => { setC(Array.from({ length: A.length }, () => Array(B[0].length).fill(0))); setMsg('Result Cleared'); }} disabled={running} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Reset Run</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#fff', fontFamily: 'monospace' }}>{msg}</div>
            </div>

            <div style={{ padding: '16px 24px', background: '#111118', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 20 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Edit Matrix A (CSV)</div>
                    <textarea value={strA} onChange={e => setStrA(e.target.value)} onBlur={handleUpdate} disabled={running} style={{ width: '100%', height: 80, background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e2e8f0', padding: 8, borderRadius: 6, fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Edit Matrix B (CSV)</div>
                    <textarea value={strB} onChange={e => setStrB(e.target.value)} onBlur={handleUpdate} disabled={running} style={{ width: '100%', height: 80, background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e2e8f0', padding: 8, borderRadius: 6, fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 30, background: '#0a0a0f', padding: 40, overflowY: 'auto' }}>
                {renderMatrix(A, `Matrix A (${A.length}×${A[0]?.length || 0})`, hlA, -1)}
                <div style={{ fontSize: 24, color: '#64748b', marginTop: 40 }}>×</div>
                {renderMatrix(B, `Matrix B (${B.length}×${B[0]?.length || 0})`, -1, hlB)}
                <div style={{ fontSize: 24, color: '#64748b', marginTop: 40 }}>=</div>
                {renderMatrix(C, `Result C (${C.length}×${C[0]?.length || 0})`, hlC?.r ?? -1, hlC?.c ?? -1, true)}
            </div>
        </div>
    );
}
