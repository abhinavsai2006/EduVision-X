'use client';
import React, { useState, useRef } from 'react';

export function LinearRegressionSim() {
    const [points, setPoints] = useState<{ x: number, y: number }[]>([{ x: 50, y: 350 }, { x: 150, y: 250 }, { x: 250, y: 200 }, { x: 350, y: 100 }, { x: 450, y: 50 }]);
    const [m, setM] = useState(0);
    const [b, setB] = useState(200);
    const [lr, setLr] = useState(0.00001);
    const [running, setRunning] = useState(false);
    const [epoch, setEpoch] = useState(0);
    let stopRef = useRef(false);

    const addPoint = (e: React.MouseEvent<SVGSVGElement>) => {
        if (running) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPoints([...points, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    };

    const train = async () => {
        stopRef.current = false; setRunning(true);
        let currM = m; let currB = b; let ep = epoch;

        while (!stopRef.current) {
            let gradM = 0; let gradB = 0; let n = points.length;
            if (n === 0) break;

            for (const p of points) {
                let yPred = currM * p.x + currB;
                let err = yPred - p.y;
                gradM += (2 / n) * err * p.x;
                gradB += (2 / n) * err;
            }
            currM -= lr * gradM;
            currB -= lr * gradB;

            ep++;
            setM(currM); setB(currB); setEpoch(ep);
            await new Promise(r => setTimeout(r, 16)); // ~60fps
        }
        setRunning(false);
    };

    let loss = points.length > 0 ? points.reduce((sum, p) => sum + Math.pow(p.y - (m * p.x + b), 2), 0) / points.length : 0;

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={() => { if (running) { stopRef.current = true; } else { train() } }} style={{ padding: '6px 14px', background: running ? '#ef4444' : '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{running ? '⏸ Stop' : '▶ Train (Gradient Descent)'}</button>
                <button onClick={() => { stopRef.current = true; setRunning(false); setPoints([]); setM(0); setB(200); setEpoch(0); }} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Reset</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#e2e8f0', display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                    <span>Epoch: <strong style={{ color: '#fff' }}>{epoch}</strong></span>
                    <span>Loss (MSE): <strong style={{ color: '#ef4444' }}>{loss.toFixed(0)}</strong></span>
                    <span>Equation: <strong style={{ color: '#3b82f6' }}>y = {m.toFixed(2)}x + {b.toFixed(2)}</strong></span>
                </div>
            </div>
            <div style={{ flex: 1, background: '#0a0a0f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="600" height="400" onClick={addPoint} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, cursor: 'crosshair' }}>
                    {/* Best fit line */}
                    <line x1="0" y1={b} x2="600" y2={m * 600 + b} stroke="#3b82f6" strokeWidth={3} />
                    {/* Error lines */}
                    {points.map((p, i) => (
                        <line key={`e${i}`} x1={p.x} y1={p.y} x2={p.x} y2={m * p.x + b} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                    ))}
                    {/* Points */}
                    {points.map((p, i) => <circle key={`p${i}`} cx={p.x} cy={p.y} r={5} fill="#e2e8f0" stroke="#0d0d14" strokeWidth={1} />)}
                </svg>
            </div>
        </div>
    );
}
