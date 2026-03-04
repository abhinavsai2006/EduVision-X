'use client';
import React, { useState, useRef } from 'react';

export function NeuralNetworkSim() {
    const [layers, setLayers] = useState([3, 5, 4, 2]);
    const [activeNeuron, setActiveNeuron] = useState<{ l: number; n: number } | null>(null);
    const [epoch, setEpoch] = useState(0);
    const [loss, setLoss] = useState(1.0);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Configure layers and press Train');
    const [layerInput, setLayerInput] = useState('3,5,4,2');
    const stopRef = useRef(false);
    const svgW = 600, svgH = 380;

    const applyLayers = () => {
        const parsed = layerInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 10);
        if (parsed.length >= 2) { setLayers(parsed); setEpoch(0); setLoss(1); setMsg('Layers updated.'); }
    };

    const train = async () => {
        stopRef.current = false; setRunning(true); let l = 1.0;
        for (let e = 1; e <= 50 && !stopRef.current; e++) {
            l = l * (0.9 + Math.random() * 0.08);
            setEpoch(e); setLoss(Math.round(l * 1000) / 1000);
            // Animate forward prop
            for (let li = 0; li < layers.length && !stopRef.current; li++) {
                for (let ni = 0; ni < layers[li]; ni++) { setActiveNeuron({ l: li, n: ni }); await new Promise(r => setTimeout(r, 15)); }
            }
            setMsg(`Epoch ${e}: loss = ${l.toFixed(4)}`);
        }
        setActiveNeuron(null);
        if (!stopRef.current) setMsg(`✓ Training complete — final loss: ${l.toFixed(4)}`);
        setRunning(false);
    };

    const getNeuronPos = (li: number, ni: number) => {
        const lx = 60 + (li / (layers.length - 1)) * (svgW - 120);
        const ly = (svgH / 2) - ((layers[li] - 1) / 2) * 36 + ni * 36;
        return { x: lx, y: ly };
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Layers (comma-separated)</div>
                <input value={layerInput} onChange={e => setLayerInput(e.target.value)} style={{ padding: '6px 8px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 12, outline: 'none' }} />
                <button onClick={applyLayers} disabled={running} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Apply</button>
                <button onClick={train} disabled={running} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#a855f7', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Train</button>
                <button onClick={() => { stopRef.current = true; setRunning(false); }} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>⏹ Stop</button>
                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 10 }}>
                    <div style={{ fontSize: 10, color: '#475569' }}>Epoch</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0' }}>{epoch}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Loss</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: loss < 0.1 ? '#22c55e' : '#e2e8f0' }}>{loss}</div>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <svg width={svgW} height={svgH} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        {/* Connections */}
                        {layers.map((count, li) => li < layers.length - 1 ? Array.from({ length: count }).map((_, ni) =>
                            Array.from({ length: layers[li + 1] }).map((_, nj) => {
                                const from = getNeuronPos(li, ni), to = getNeuronPos(li + 1, nj);
                                return <line key={`${li}-${ni}-${nj}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(99,102,241,0.15)" strokeWidth={1} />;
                            })
                        ) : null)}
                        {/* Neurons */}
                        {layers.map((count, li) => Array.from({ length: count }).map((_, ni) => {
                            const pos = getNeuronPos(li, ni);
                            const isActive = activeNeuron && activeNeuron.l === li && activeNeuron.n === ni;
                            return <circle key={`n-${li}-${ni}`} cx={pos.x} cy={pos.y} r={12} fill={isActive ? '#a855f7' : '#1e1e2e'} stroke={isActive ? '#c084fc' : '#333'} strokeWidth={2} />;
                        }))}
                        {/* Layer labels */}
                        {layers.map((_, li) => {
                            const x = 60 + (li / (layers.length - 1)) * (svgW - 120);
                            const label = li === 0 ? 'Input' : li === layers.length - 1 ? 'Output' : `Hidden ${li}`;
                            return <text key={li} x={x} y={svgH - 10} textAnchor="middle" fill="#475569" fontSize={10}>{label}</text>;
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
