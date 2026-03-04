'use client';
import React, { useState } from 'react';

export function BankersSim() {
    const [max, setMax] = useState([[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]);
    const [alloc, setAlloc] = useState([[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]]);
    const [avail, setAvail] = useState([3, 3, 2]);
    const [msg, setMsg] = useState('Check if system is in a Safe State');
    const [safeSeq, setSafeSeq] = useState<number[]>([]);
    const [running, setRunning] = useState(false);

    const calculateNeed = () => max.map((row, i) => row.map((val, j) => val - alloc[i][j]));

    const run = async () => {
        setRunning(true);
        let n = max.length; let m = avail.length;
        let need = calculateNeed();
        let work = [...avail];
        let finish = Array(n).fill(false);
        let seq: number[] = [];

        setMsg('Checking for a safe sequence...');
        await new Promise(r => setTimeout(r, 800));

        for (let count = 0; count < n; count++) {
            let found = false;
            for (let p = 0; p < n; p++) {
                if (!finish[p]) {
                    let canAlloc = true;
                    for (let j = 0; j < m; j++) { if (need[p][j] > work[j]) { canAlloc = false; break; } }
                    if (canAlloc) {
                        setMsg(`Process P${p} can be allocated resources.`);
                        await new Promise(r => setTimeout(r, 600));
                        for (let j = 0; j < m; j++) work[j] += alloc[p][j];
                        finish[p] = true;
                        seq.push(p);
                        setSafeSeq([...seq]);
                        found = true;
                        await new Promise(r => setTimeout(r, 400));
                        break;
                    }
                }
            }
            if (!found) { setMsg('System is in UNSTABLE state! No safe sequence.'); setSafeSeq([]); setRunning(false); return; }
        }
        setMsg(`System is SAFE! Sequence: ${seq.map(i => 'P' + i).join(' → ')}`);
        setRunning(false);
    };

    const updateVal = (matrix: 'max' | 'alloc', r: number, c: number, val: string) => {
        let v = parseInt(val) || 0;
        if (matrix === 'max') { let nm = [...max]; nm[r][c] = v; setMax(nm); }
        else { let na = [...alloc]; na[r][c] = v; setAlloc(na); }
        setSafeSeq([]);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Run Safety Algorithm</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 800, color: '#22c55e' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, padding: 20, display: 'flex', gap: 20, background: '#0a0a0f', overflowY: 'auto' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 16, background: '#111118', borderRadius: 12, border: '1px solid #1e1e2e' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>RESOURCES (A, B, C)</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {avail.map((v, i) => (
                                <div key={i} style={{ flex: 1, padding: 12, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 8, textAlign: 'center' }}>
                                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{v}</div>
                                    <div style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>Available</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: 16, background: '#111118', borderRadius: 12, border: '1px solid #1e1e2e' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>PROCESSES MATRIX (MAX | ALLOCATION | NEED)</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead><tr style={{ color: '#475569' }}><th style={{ textAlign: 'left' }}>PID</th><th>Max</th><th>Alloc</th><th>Need</th></tr></thead>
                            <tbody>
                                {max.map((row, i) => (
                                    <tr key={i} style={{ background: safeSeq.includes(i) ? '#22c55e11' : 'transparent', borderBottom: '1px solid #1e1e2e' }}>
                                        <td style={{ padding: '8px 0', color: '#64748b', fontWeight: 800 }}>P{i}</td>
                                        <td style={{ textAlign: 'center' }}>{row.map((v, j) => <input key={j} value={v} onChange={e => updateVal('max', i, j, e.target.value)} style={{ width: 24, textAlign: 'center', background: 'transparent', border: '1px solid #1e1e2e', margin: 1, color: '#e2e8f0', cursor: running ? 'not-allowed' : 'text' }} disabled={running} />)}</td>
                                        <td style={{ textAlign: 'center' }}>{alloc[i].map((v, j) => <input key={j} value={v} onChange={e => updateVal('alloc', i, j, e.target.value)} style={{ width: 24, textAlign: 'center', background: 'transparent', border: '1px solid #1e1e2e', margin: 1, color: '#e2e8f0', cursor: running ? 'not-allowed' : 'text' }} disabled={running} />)}</td>
                                        <td style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 800 }}>{calculateNeed()[i].join(' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ width: 150, padding: 16, background: '#111118', borderRadius: 12, border: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>SAFE SEQUENCE</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {safeSeq.map((p, i) => (
                            <div key={i} style={{ padding: 10, background: '#22c55e', color: '#fff', borderRadius: 8, textAlign: 'center', fontWeight: 800, fontSize: 14 }}>P{p}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
