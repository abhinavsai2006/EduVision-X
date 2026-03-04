'use client';
import React, { useState, useEffect, useRef } from 'react';

export function WaveInterferenceSim() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [freq, setFreq] = useState(0.05);
    const [dist, setDist] = useState(100);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !running) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        let animationId: number;

        const render = () => {
            frame++;
            const w = canvas.width;
            const h = canvas.height;
            const imgData = ctx.createImageData(w, h);
            const data = imgData.data;

            const s1x = w / 2 - dist / 2;
            const s1y = h / 2;
            const s2x = w / 2 + dist / 2;
            const s2y = h / 2;

            for (let y = 0; y < h; y += 2) {
                for (let x = 0; x < w; x += 2) {
                    const d1 = Math.sqrt((x - s1x) ** 2 + (y - s1y) ** 2);
                    const d2 = Math.sqrt((x - s2x) ** 2 + (y - s2y) ** 2);

                    const v1 = Math.sin(d1 * freq - frame * 0.1);
                    const v2 = Math.sin(d2 * freq - frame * 0.1);
                    const v = (v1 + v2) / 2;

                    const color = Math.floor((v + 1) * 127);

                    // Fill 2x2 area for performance
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            const idx = ((y + dy) * w + (x + dx)) * 4;
                            if (idx < data.length) {
                                data[idx] = color;
                                data[idx + 1] = color;
                                data[idx + 2] = 255; // Blue tint
                                data[idx + 3] = 255;
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, [freq, dist, running]);

    return (
        <div style={{ padding: 20, background: '#0a0a0f', color: '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 20, flex: 1 }}>
                <div style={{ width: 250, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Source Configuration</div>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Frequency: {freq.toFixed(2)}
                        <input type="range" min={0.01} max={0.2} step={0.01} value={freq} onChange={e => setFreq(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
                    </label>

                    <label style={{ fontSize: 12, color: '#94a3b8' }}>
                        Source Separation: {dist}px
                        <input type="range" min={10} max={300} step={10} value={dist} onChange={e => setDist(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
                    </label>

                    <button onClick={() => setRunning(!running)} style={{ padding: 12, background: running ? '#ef4444' : '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
                        {running ? 'Stop Simulation' : 'Start Simulation'}
                    </button>

                    <div style={{ marginTop: 'auto', padding: 12, background: '#111118', borderRadius: 8, fontSize: 11, color: '#64748b' }}>
                        Waves from two coherent sources interfere. Darker regions (nodes) occur where waves cancel out, and brighter regions (antinodes) occur where they reinforce.
                    </div>
                </div>

                <div style={{ flex: 1, background: '#000', border: '1px solid #1e1e2e', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>
        </div>
    );
}
