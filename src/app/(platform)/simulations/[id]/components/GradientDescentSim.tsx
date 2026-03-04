'use client';
import React, { useState, useRef } from 'react';

export function GradientDescentSim() {
    const [lr, setLr] = useState(0.1);
    const [momentum, setMomentum] = useState(0);
    const [pos, setPos] = useState(4);
    const [path, setPath] = useState<{ x: number; y: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Set learning rate and press Run');
    const stopRef = useRef(false);
    const svgW = 550, svgH = 300;
    const loss = (x: number) => 0.1 * x * x + 2 * Math.sin(x) * Math.sin(x);
    const grad = (x: number) => 0.2 * x + 4 * Math.sin(x) * Math.cos(x);
    const xToSvg = (x: number) => ((x + 6) / 12) * (svgW - 40) + 20;
    const yToSvg = (y: number) => svgH - 20 - (y / 6) * (svgH - 40);
    const run = async () => {
        stopRef.current = false; setRunning(true);
        let x = pos, v = 0; const pts: typeof path = [];
        for (let i = 0; i < 60 && !stopRef.current; i++) {
            v = momentum * v - lr * grad(x); x += v;
            pts.push({ x: xToSvg(x), y: yToSvg(loss(x)) });
            setPath([...pts]); setPos(x);
            setMsg(`Step ${i + 1}: x=${x.toFixed(3)}, loss=${loss(x).toFixed(4)}`);
            await new Promise(r => setTimeout(r, 80));
        }
        if (!stopRef.current) setMsg(`✓ x=${x.toFixed(3)}, loss=${loss(x).toFixed(4)}`);
        setRunning(false);
    };
    const curvePts = Array.from({ length: 100 }, (_, i) => { const x = -6 + (i / 99) * 12; return `${xToSvg(x)},${yToSvg(loss(x))}`; }).join(' ');
    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>LR: {lr}<input type="range" min={0.01} max={1} step={0.01} value={lr} onChange={e => setLr(+e.target.value)} style={{ width: '100%', accentColor: '#14b8a6' }} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Momentum: {momentum}<input type="range" min={0} max={0.99} step={0.01} value={momentum} onChange={e => setMomentum(+e.target.value)} style={{ width: '100%', accentColor: '#14b8a6' }} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Start X: {pos.toFixed(1)}<input type="range" min={-5} max={5} step={0.1} value={pos} onChange={e => setPos(+e.target.value)} style={{ width: '100%', accentColor: '#14b8a6' }} disabled={running} /></label>
                <button onClick={run} disabled={running} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Run</button>
                <button onClick={() => { stopRef.current = true; setRunning(false); setPath([]); }} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Reset</button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <svg width={svgW} height={svgH} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        <polyline points={curvePts} fill="none" stroke="#1e1e2e" strokeWidth={2} />
                        {path.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#14b8a6" opacity={0.5 + (i / path.length) * 0.5} />)}
                        {path.length > 0 && <circle cx={path[path.length - 1].x} cy={path[path.length - 1].y} r={6} fill="#14b8a6" stroke="#fff" strokeWidth={2} />}
                    </svg>
                </div>
            </div>
        </div>
    );
}
