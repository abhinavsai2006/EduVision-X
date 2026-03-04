'use client';
import React, { useState, useRef, useEffect } from 'react';

export function PendulumSim() {
    const [length, setLength] = useState(150);
    const [damping, setDamping] = useState(0.005);
    const [theta, setTheta] = useState(Math.PI / 4);
    const [omega, setOmega] = useState(0);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Set initial angle and press Start');
    const thetaRef = useRef(theta);
    const omegaRef = useRef(omega);
    const rafRef = useRef<number>(0);
    const stopRef = useRef(false);
    const svgW = 500, svgH = 400;
    const pivotX = svgW / 2, pivotY = 60;

    const start = () => {
        stopRef.current = false; setRunning(true);
        thetaRef.current = theta; omegaRef.current = 0;
        const g = 9.8; const dt = 0.03;
        const step = () => {
            if (stopRef.current) return;
            const alpha = (-g / (length / 50)) * Math.sin(thetaRef.current) - damping * omegaRef.current;
            omegaRef.current += alpha * dt;
            thetaRef.current += omegaRef.current * dt;
            setTheta(thetaRef.current);
            setOmega(omegaRef.current);
            setMsg(`θ = ${(thetaRef.current * 180 / Math.PI).toFixed(1)}°  ω = ${omegaRef.current.toFixed(3)} rad/s`);
            rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
    };

    const stop = () => { stopRef.current = true; cancelAnimationFrame(rafRef.current); setRunning(false); };

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const bobX = pivotX + length * Math.sin(theta);
    const bobY = pivotY + length * Math.cos(theta);

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Parameters</div>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Length: {length}px<input type="range" min={60} max={250} value={length} onChange={e => { setLength(+e.target.value); if (!running) setTheta(theta); }} style={{ width: '100%', accentColor: '#f59e0b' }} disabled={running} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Initial Angle: {(theta * 180 / Math.PI).toFixed(0)}°<input type="range" min={5} max={170} value={Math.round(theta * 180 / Math.PI)} onChange={e => setTheta((+e.target.value * Math.PI) / 180)} style={{ width: '100%', accentColor: '#f59e0b' }} disabled={running} /></label>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>Damping: {damping}<input type="range" min={0} max={0.1} step={0.001} value={damping} onChange={e => setDamping(+e.target.value)} style={{ width: '100%', accentColor: '#f59e0b' }} /></label>
                {!running ? <button onClick={start} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Start</button>
                    : <button onClick={stop} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⏹ Stop</button>}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={svgW} height={svgH} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#64748b" strokeWidth={2} />
                        <circle cx={pivotX} cy={pivotY} r={4} fill="#475569" />
                        <circle cx={bobX} cy={bobY} r={16} fill="#f59e0b" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
