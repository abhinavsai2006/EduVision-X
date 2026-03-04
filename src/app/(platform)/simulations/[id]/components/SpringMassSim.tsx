'use client';
import React, { useState, useEffect, useRef } from 'react';

export function SpringMassSim() {
    const [mass, setMass] = useState(1);
    const [k, setK] = useState(10);
    const [damping, setDamping] = useState(0.5);
    const [running, setRunning] = useState(false);

    // Physical state
    const [pos, setPos] = useState(100); // displacement from equilibrium
    const [vel, setVel] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    const lastTime = useRef<number>(Date.now());

    useEffect(() => {
        if (!running) {
            lastTime.current = Date.now();
            return;
        }

        const step = () => {
            const now = Date.now();
            const dt = (now - lastTime.current) / 1000;
            lastTime.current = now;

            if (dt > 0.1) return requestAnimationFrame(step); // cap dt

            setPos(prevPos => {
                setVel(prevVel => {
                    const forceSpring = -k * prevPos;
                    const forceDamping = -damping * prevVel;
                    const accel = (forceSpring + forceDamping) / mass;
                    const nextVel = prevVel + accel * dt;
                    const nextPos = prevPos + nextVel * dt;

                    setHistory(h => [nextPos, ...h.slice(0, 200)]);
                    return nextVel;
                });
                return prevPos + vel * dt; // This is a bit recursive in React state, but let's try a simpler integration inside one setter
            });

            requestAnimationFrame(step);
        };

        // Simpler integration to avoid state sync issues in high freq
        const interval = setInterval(() => {
            const dt = 0.016; // fixed dt for stability
            setPos(p => {
                let v = 0;
                setVel(oldV => { v = oldV; return oldV; }); // hack to get current vel
                const f = -k * p - damping * v;
                const a = f / mass;
                const newV = v + a * dt;
                const newP = p + newV * dt;
                setVel(newV);
                setHistory(h => [newP, ...h.slice(0, 300)]);
                return newP;
            });
        }, 16);

        return () => clearInterval(interval);
    }, [running, k, mass, damping]);

    return (
        <div style={{ padding: 20, background: '#0a0a0f', color: '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 20, flex: 1 }}>
                <div style={{ width: 250, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Physical Properties</div>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Mass (m): {mass}kg
                        <input type="range" min={0.5} max={5} step={0.1} value={mass} onChange={e => setMass(+e.target.value)} style={{ width: '100%', accentColor: '#34d399' }} />
                    </label>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Spring Constant (k): {k}
                        <input type="range" min={1} max={50} step={1} value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%', accentColor: '#34d399' }} />
                    </label>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Damping (c): {damping}
                        <input type="range" min={0} max={5} step={0.1} value={damping} onChange={e => setDamping(+e.target.value)} style={{ width: '100%', accentColor: '#34d399' }} />
                    </label>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setRunning(!running)} style={{ flex: 1, padding: 12, background: running ? '#ef4444' : '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
                            {running ? 'Stop' : 'Start'}
                        </button>
                        <button onClick={() => { setPos(100); setVel(0); setHistory([]); }} style={{ padding: '0 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, cursor: 'pointer' }}>Reset</button>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Animation Box */}
                    <div style={{ flex: 1, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: 0, width: '100%', height: 10, background: '#1e1e2e' }} />
                        {/* Spring */}
                        <svg width="40" height={150 + pos} style={{ position: 'absolute', top: 10 }}>
                            <path d={`M 20 0 ${Array.from({ length: 10 }).map((_, i) => `L ${i % 2 === 0 ? 10 : 30} ${(i + 1) * (140 + pos) / 10}`).join(' ')}`} stroke="#64748b" strokeWidth="2" fill="none" />
                        </svg>
                        {/* Mass */}
                        <div style={{
                            position: 'absolute',
                            top: 150 + pos,
                            width: 60, height: 60,
                            background: '#34d399',
                            borderRadius: 8,
                            border: '2px solid #059669',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: 14,
                            boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                        }}>
                            {mass}kg
                        </div>
                    </div>

                    {/* Graph Box */}
                    <div style={{ height: 150, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 10, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800, position: 'absolute', top: 10, left: 10 }}>Displacement vs Time</div>
                        <svg width="100%" height="100%" viewBox="0 -120 400 240" preserveAspectRatio="none">
                            <line x1="0" y1="0" x2="400" y2="0" stroke="#1e1e2e" strokeWidth="1" />
                            <polyline
                                points={history.map((p, i) => `${i},${p}`).join(' ')}
                                fill="none"
                                stroke="#34d399"
                                strokeWidth="2"
                                transform="translate(400, 0) scale(-1, 1)"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
