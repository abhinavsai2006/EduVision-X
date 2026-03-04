'use client';
import React, { useState, useRef } from 'react';

export function ProjectileMotionSim() {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(40);
    const [gravity, setGravity] = useState(9.8);
    const [path, setPath] = useState<{ x: number; y: number }[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Adjust parameters and press Launch');
    const stopRef = useRef(false);
    const svgW = 700, svgH = 350;

    const launch = async () => {
        stopRef.current = false; setRunning(true); setPath([]);
        const rad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(rad), vy = velocity * Math.sin(rad);
        const totalTime = (2 * vy) / gravity;
        const maxRange = vx * totalTime;
        const maxHeight = (vy * vy) / (2 * gravity);
        const pts: { x: number; y: number }[] = [];
        const steps = 100;
        for (let i = 0; i <= steps && !stopRef.current; i++) {
            const t = (i / steps) * totalTime;
            const x = vx * t, y = vy * t - 0.5 * gravity * t * t;
            pts.push({ x: (x / maxRange) * (svgW - 40) + 20, y: svgH - 20 - (y / Math.max(maxHeight, 1)) * (svgH - 60) });
            setPath([...pts]);
            setMsg(`t=${t.toFixed(2)}s  x=${x.toFixed(1)}m  y=${Math.max(0, y).toFixed(1)}m`);
            await new Promise(r => setTimeout(r, 30));
        }
        setMsg(`✓ Range: ${maxRange.toFixed(1)}m | Max Height: ${maxHeight.toFixed(1)}m | Time: ${totalTime.toFixed(2)}s`);
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 220, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Parameters</div>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Angle: {angle}°<input type="range" min={5} max={85} value={angle} onChange={e => setAngle(+e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Velocity: {velocity} m/s<input type="range" min={5} max={100} value={velocity} onChange={e => setVelocity(+e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Gravity: {gravity} m/s²<input type="range" min={1} max={25} step={0.1} value={gravity} onChange={e => setGravity(+e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} /></label>
                <button onClick={launch} disabled={running} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🚀 Launch</button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <svg width={svgW} height={svgH} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        <line x1={20} y1={svgH - 20} x2={svgW - 20} y2={svgH - 20} stroke="#1e1e2e" strokeWidth={1} />
                        <line x1={20} y1={20} x2={20} y2={svgH - 20} stroke="#1e1e2e" strokeWidth={1} />
                        {path.length > 1 && <polyline points={path.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth={2} />}
                        {path.length > 0 && <circle cx={path[path.length - 1].x} cy={path[path.length - 1].y} r={5} fill="#ef4444" />}
                    </svg>
                </div>
            </div>
        </div>
    );
}
