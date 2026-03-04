'use client';
import React, { useState } from 'react';

export function DiskSchedulingSim() {
    const [algo, setAlgo] = useState('FCFS');
    const [requests, setReqs] = useState('98, 183, 37, 122, 14, 124, 65, 67');
    const [head, setHead] = useState(53);
    const [path, setPath] = useState<number[]>([]);
    const [totalSeek, setTotalSeek] = useState(0);
    const [running, setRunning] = useState(false);

    const reqArr = requests.split(',').map(s => +s.trim()).filter(n => !isNaN(n) && n >= 0 && n <= 199);

    const run = async () => {
        setRunning(true);
        let p = [head]; let seek = 0;

        if (algo === 'FCFS') {
            for (const r of reqArr) {
                seek += Math.abs(p[p.length - 1] - r);
                p.push(r);
                setPath([...p]); setTotalSeek(seek);
                await new Promise(res => setTimeout(res, 500));
            }
        } else if (algo === 'SSTF') {
            let pending = [...reqArr];
            while (pending.length > 0) {
                let curr = p[p.length - 1];
                let closestIdx = 0; let minD = Math.abs(curr - pending[0]);
                for (let i = 1; i < pending.length; i++) {
                    let d = Math.abs(curr - pending[i]);
                    if (d < minD) { minD = d; closestIdx = i; }
                }
                let next = pending.splice(closestIdx, 1)[0];
                seek += minD; p.push(next);
                setPath([...p]); setTotalSeek(seek);
                await new Promise(res => setTimeout(res, 500));
            }
        }
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <select value={algo} onChange={e => setAlgo(e.target.value)} style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} disabled={running}>
                    <option value="FCFS">FCFS</option><option value="SSTF">SSTF</option>
                </select>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>Head: <input type="number" min="0" max="199" value={head} onChange={e => setHead(+e.target.value)} style={{ width: 40, padding: '4px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} disabled={running} /></label>
                <input value={requests} onChange={e => setReqs(e.target.value)} style={{ flex: 1, padding: '6px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} placeholder="Comma separated requests (0-199)" disabled={running} />
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Run</button>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800 }}>Total Seek: <span style={{ color: '#fff' }}>{totalSeek}</span></div>
            </div>
            <div style={{ flex: 1, position: 'relative', background: '#0a0a0f', overflowY: 'auto', padding: '20px 40px' }}>
                <svg width="100%" height={Math.max(400, path.length * 40 + 40)} style={{ overflow: 'visible' }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <line key={i} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#1e1e2e" />
                    ))}
                    {path.length > 0 && <polyline points={path.map((p, i) => `${(p / 199) * 100}%,${i * 40 + 20}`).join(' ')} fill="none" stroke="#f97316" strokeWidth={2} />}
                    {path.map((p, i) => (
                        <g key={i}>
                            <circle cx={`${(p / 199) * 100}%`} cy={i * 40 + 20} r={4} fill={i === 0 ? '#3b82f6' : '#ef4444'} />
                            <text x={`${(p / 199) * 100}%`} y={i * 40 + 10} fill="#94a3b8" fontSize={10} textAnchor="middle">{p}</text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
