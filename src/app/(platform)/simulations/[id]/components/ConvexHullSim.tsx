'use client';
import React, { useState } from 'react';

export function ConvexHullSim() {
    const [points, setPoints] = useState<{ x: number, y: number }[]>([{ x: 200, y: 200 }, { x: 250, y: 100 }, { x: 150, y: 150 }, { x: 300, y: 250 }, { x: 350, y: 180 }]);
    const [hull, setHull] = useState<{ x: number, y: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Click canvas to add points, then run Jarvis March');

    const cross = (o: any, a: any, b: any) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const run = async () => {
        if (points.length < 3) { setMsg('Need at least 3 points'); return; }
        setRunning(true); setHull([]);

        let p0 = points.reduce((min, p) => p.x < min.x ? p : min, points[0]);
        let h = [p0];

        while (true) {
            setHull([...h]); setMsg(`Hull sizing: ${h.length}`);
            await new Promise(r => setTimeout(r, 400));
            const curr = h[h.length - 1];
            let next = points[0];
            for (let i = 1; i < points.length; i++) {
                if (next === curr || cross(curr, next, points[i]) < 0) next = points[i];
            }
            if (next === h[0]) break;
            h.push(next);
        }
        h.push(h[0]);
        setHull(h); setMsg(`Hull complete! Contains ${h.length - 1} vertices`); setRunning(false);
    };

    const addPoint = (e: React.MouseEvent<SVGSVGElement>) => {
        if (running) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPoints([...points, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setHull([]);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Jarvis March</button>
                <button onClick={() => { setPoints([]); setHull([]); setMsg('Cleared'); }} disabled={running} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Clear</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, background: '#0a0a0f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="600" height="400" onClick={addPoint} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, cursor: 'crosshair' }}>
                    {hull.length > 1 && <polyline points={hull.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth={2} />}
                    {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill="#e2e8f0" />)}
                </svg>
            </div>
        </div>
    );
}
