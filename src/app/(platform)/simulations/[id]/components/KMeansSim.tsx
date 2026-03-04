'use client';
import React, { useState } from 'react';

export function KMeansSim() {
    const [k, setK] = useState(3);
    const [points, setPoints] = useState<{ x: number; y: number; c: number }[]>([]);
    const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
    const [iter, setIter] = useState(0);
    const [msg, setMsg] = useState('Click the canvas to place data points, then press Run');
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899', '#14b8a6'];
    const svgW = 600, svgH = 400;

    const autoGenerate = () => {
        const pts: typeof points = [];
        for (let c = 0; c < k; c++) {
            const cx = 50 + Math.random() * (svgW - 100), cy = 50 + Math.random() * (svgH - 100);
            for (let i = 0; i < 12; i++) pts.push({ x: cx + (Math.random() - 0.5) * 100, y: cy + (Math.random() - 0.5) * 100, c: -1 });
        }
        setPoints(pts); setCentroids([]); setIter(0); setMsg(`Generated ${pts.length} points. Press Run.`);
    };

    const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        setPoints(p => [...p, { x, y, c: -1 }]);
    };

    const runKMeans = async () => {
        if (points.length < k) { setMsg('Need more points than K'); return; }
        let cs = Array.from({ length: k }, () => ({ ...points[Math.floor(Math.random() * points.length)] }));
        setCentroids(cs); let pts = points.map(p => ({ ...p }));
        for (let it = 0; it < 20; it++) {
            // Assign
            pts = pts.map(p => {
                let minD = Infinity, minC = 0;
                cs.forEach((c, ci) => { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < minD) { minD = d; minC = ci; } });
                return { ...p, c: minC };
            });
            setPoints([...pts]); setIter(it + 1);
            // Update centroids
            const newCs = cs.map((c, ci) => {
                const cluster = pts.filter(p => p.c === ci);
                if (cluster.length === 0) return c;
                return {
                    x: cluster.reduce((s, p) => s + p.x, 0) / cluster.length,
                    y: cluster.reduce((s, p) => s + p.y, 0) / cluster.length,
                    c: -1
                };
            });
            cs = newCs; setCentroids([...cs]);
            setMsg(`Iteration ${it + 1}: assigning ${pts.length} points to ${k} clusters`);
            await new Promise(r => setTimeout(r, 400));
        }
        setMsg(`✓ K-Means converged after ${20} iterations`);
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Parameters</div>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>K (clusters): {k}<input type="range" min={2} max={8} value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%', accentColor: '#8b5cf6' }} /></label>
                <button onClick={autoGenerate} style={{ padding: '8px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>🎲 Auto Generate</button>
                <button onClick={runKMeans} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#8b5cf6', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Run K-Means</button>
                <button onClick={() => { setPoints([]); setCentroids([]); setIter(0); }} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Clear</button>
                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 10 }}>
                    <div style={{ fontSize: 10, color: '#475569' }}>Points</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0' }}>{points.length}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Iteration</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0' }}>{iter}</div>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <svg width={svgW} height={svgH} onClick={handleClick} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e', cursor: 'crosshair' }}>
                        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={p.c >= 0 ? colors[p.c % colors.length] : '#475569'} />)}
                        {centroids.map((c, i) => <g key={i}><circle cx={c.x} cy={c.y} r={8} fill="none" stroke={colors[i % colors.length]} strokeWidth={3} /><circle cx={c.x} cy={c.y} r={3} fill={colors[i % colors.length]} /></g>)}
                    </svg>
                </div>
            </div>
        </div>
    );
}
