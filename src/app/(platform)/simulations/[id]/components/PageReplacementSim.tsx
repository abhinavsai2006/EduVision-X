'use client';
import React, { useState } from 'react';

export function PageReplacementSim() {
    const [refString, setRefString] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2');
    const [frames, setFrames] = useState(3);
    const [algo, setAlgo] = useState('fifo');
    const [result, setResult] = useState<{ step: number; page: number; frameState: number[]; fault: boolean }[]>([]);
    const [faults, setFaults] = useState(0);
    const [msg, setMsg] = useState('Enter reference string and press Simulate');

    const simulate = () => {
        const refs = refString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (refs.length === 0) return;
        const res: typeof result = [];
        let f: number[] = []; let faultCount = 0;

        if (algo === 'fifo') {
            let ptr = 0;
            for (let i = 0; i < refs.length; i++) {
                const page = refs[i];
                if (f.includes(page)) { res.push({ step: i, page, frameState: [...f], fault: false }); continue; }
                faultCount++;
                if (f.length < frames) f.push(page);
                else { f[ptr % frames] = page; ptr++; }
                res.push({ step: i, page, frameState: [...f], fault: true });
            }
        } else if (algo === 'lru') {
            const recent: number[] = [];
            for (let i = 0; i < refs.length; i++) {
                const page = refs[i];
                if (f.includes(page)) {
                    recent.splice(recent.indexOf(page), 1); recent.push(page);
                    res.push({ step: i, page, frameState: [...f], fault: false }); continue;
                }
                faultCount++;
                if (f.length < frames) { f.push(page); }
                else { const lru = recent.shift()!; f[f.indexOf(lru)] = page; }
                recent.push(page);
                res.push({ step: i, page, frameState: [...f], fault: true });
            }
        } else if (algo === 'optimal') {
            for (let i = 0; i < refs.length; i++) {
                const page = refs[i];
                if (f.includes(page)) { res.push({ step: i, page, frameState: [...f], fault: false }); continue; }
                faultCount++;
                if (f.length < frames) { f.push(page); }
                else {
                    let farthest = -1, victimIdx = 0;
                    for (let fi = 0; fi < f.length; fi++) {
                        const next = refs.slice(i + 1).indexOf(f[fi]);
                        if (next === -1) { victimIdx = fi; break; }
                        if (next > farthest) { farthest = next; victimIdx = fi; }
                    }
                    f[victimIdx] = page;
                }
                res.push({ step: i, page, frameState: [...f], fault: true });
            }
        }
        setResult(res); setFaults(faultCount);
        setMsg(`✓ ${algo.toUpperCase()}: ${faultCount} page faults out of ${refs.length} references`);
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 240, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Algorithm</div>
                {[['fifo', 'FIFO'], ['lru', 'LRU'], ['optimal', 'Optimal']].map(([id, label]) => (
                    <button key={id} onClick={() => setAlgo(id)} style={{ padding: '7px 10px', borderRadius: 8, border: algo === id ? '1px solid rgba(236,72,153,0.4)' : '1px solid #1e1e2e', background: algo === id ? 'rgba(236,72,153,0.12)' : '#111118', color: algo === id ? '#f472b6' : '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>{label}</button>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 6 }}>Reference String</div>
                <textarea value={refString} onChange={e => setRefString(e.target.value)} rows={2} style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 11, fontFamily: 'monospace', outline: 'none', resize: 'none' }} />
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Frames: {frames}<input type="range" min={2} max={6} value={frames} onChange={e => setFrames(+e.target.value)} style={{ width: '100%', accentColor: '#ec4899' }} /></label>
                <button onClick={simulate} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#ec4899', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Simulate</button>
                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 10 }}>
                    <div style={{ fontSize: 10, color: '#475569' }}>Page Faults</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: faults > 0 ? '#f472b6' : '#e2e8f0' }}>{faults}</div>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, padding: 20, overflowX: 'auto' }}>
                    {result.length > 0 && (
                        <div style={{ display: 'flex', gap: 2 }}>
                            {result.map((r, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 36 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: r.fault ? '#f472b6' : '#22c55e', padding: '2px 6px', borderRadius: 4, background: r.fault ? 'rgba(236,72,153,0.12)' : 'rgba(34,197,94,0.12)' }}>{r.page}</div>
                                    {r.frameState.map((f, fi) => (
                                        <div key={fi} style={{ width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{f}</div>
                                    ))}
                                    <div style={{ fontSize: 8, color: r.fault ? '#f472b6' : '#22c55e' }}>{r.fault ? 'F' : 'H'}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
