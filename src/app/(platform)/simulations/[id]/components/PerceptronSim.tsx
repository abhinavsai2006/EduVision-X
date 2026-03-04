'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function PerceptronSim() {
    const [w1, setW1] = useState(0.5);
    const [w2, setW2] = useState(-0.5);
    const [bias, setBias] = useState(0);
    const [x1, setX1] = useState(1);
    const [x2, setX2] = useState(0);

    const sum = x1 * w1 + x2 * w2 + bias;
    const output = sum > 0 ? 1 : 0;

    return (
        <div style={{ padding: 20, background: '#0a0a0f', color: '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 20, flex: 1 }}>
                {/* Controls */}
                <div style={{ width: 280, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Parameters</div>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Weight 1 (w₁): {w1.toFixed(2)}
                        <input type="range" min={-1} max={1} step={0.1} value={w1} onChange={e => setW1(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} />
                    </label>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Weight 2 (w₂): {w2.toFixed(2)}
                        <input type="range" min={-1} max={1} step={0.1} value={w2} onChange={e => setW2(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} />
                    </label>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Bias (b): {bias.toFixed(2)}
                        <input type="range" min={-1} max={1} step={0.1} value={bias} onChange={e => setBias(+e.target.value)} style={{ width: '100%', accentColor: '#f59e0b' }} />
                    </label>

                    <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 12 }}>Inputs</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setX1(x1 === 1 ? 0 : 1)} style={{ flex: 1, padding: 10, background: x1 ? '#6366f1' : '#111118', color: '#fff', border: '1px solid #1e1e2e', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>X₁: {x1}</button>
                            <button onClick={() => setX2(x2 === 1 ? 0 : 1)} style={{ flex: 1, padding: 10, background: x2 ? '#6366f1' : '#111118', color: '#fff', border: '1px solid #1e1e2e', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>X₂: {x2}</button>
                        </div>
                    </div>
                </div>

                {/* Visualization */}
                <div style={{ flex: 1, background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 12, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                        {/* Lines */}
                        <line x1="100" y1="150" x2="300" y2="250" stroke={x1 ? '#6366f1' : '#1e1e2e'} strokeWidth={Math.abs(w1) * 10 + 1} opacity={0.6} />
                        <line x1="100" y1="350" x2="300" y2="250" stroke={x2 ? '#6366f1' : '#1e1e2e'} strokeWidth={Math.abs(w2) * 10 + 1} opacity={0.6} />
                        <line x1="400" y1="250" x2="600" y2="250" stroke={output ? '#22c55e' : '#ef4444'} strokeWidth={5} />

                        {/* Labels */}
                        <text x="180" y="180" fill="#94a3b8" fontSize="12" fontWeight="700">w₁ = {w1.toFixed(2)}</text>
                        <text x="180" y="320" fill="#94a3b8" fontSize="12" fontWeight="700">w₂ = {w2.toFixed(2)}</text>
                    </svg>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 150, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 150 }}>
                            <div style={{ width: 60, height: 60, borderRadius: 30, background: x1 ? '#6366f1' : '#111118', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>X₁</div>
                            <div style={{ width: 60, height: 60, borderRadius: 30, background: x2 ? '#6366f1' : '#111118', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>X₂</div>
                        </div>

                        <div style={{ width: 120, height: 120, borderRadius: 60, background: '#0d0d14', border: '4px solid #6366f1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>SUM</div>
                            <div style={{ fontSize: 18, color: '#fff', fontWeight: 800 }}>{sum.toFixed(2)}</div>
                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800, borderTop: '1px solid #1e1e2e', marginTop: 4, paddingTop: 4 }}>Bias: {bias}</div>
                        </div>

                        <div style={{ width: 80, height: 80, borderRadius: 10, background: output ? '#22c55e' : '#ef4444', border: '2px solid #fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <div style={{ fontSize: 10, fontWeight: 800 }}>OUTPUT (Y)</div>
                            <div style={{ fontSize: 32, fontWeight: 900 }}>{output}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 20, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 8, padding: 15, fontSize: 12, color: '#94a3b8' }}>
                <strong style={{ color: '#6366f1' }}>Logic Equation:</strong> Y = Step(X₁ · w₁ + X₂ · w₂ + b)
                <p style={{ margin: '8px 0 0 0' }}>The Step function (Heaviside) returns 1 if the weighted sum is greater than zero, otherwise 0. You can simulate an <strong>AND gate</strong> by setting w₁=0.5, w₂=0.5, bias=-0.7, or an <strong>OR gate</strong> by setting w₁=0.5, w₂=0.5, bias=-0.2.</p>
            </div>
        </div>
    );
}
