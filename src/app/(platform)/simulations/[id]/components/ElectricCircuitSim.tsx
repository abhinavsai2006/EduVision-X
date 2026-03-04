'use client';
import React, { useState } from 'react';

export function ElectricCircuitSim() {
    const [V, setV] = useState(12);
    const [resistors, setResistors] = useState([{ id: 1, val: 10 }, { id: 2, val: 20 }]);
    const [isSeries, setIsSeries] = useState(true);

    let R_tot = 0;
    if (resistors.length > 0) {
        if (isSeries) {
            R_tot = resistors.reduce((sum, r) => sum + r.val, 0);
        } else {
            R_tot = 1 / resistors.reduce((sum, r) => sum + (1 / r.val), 0);
        }
    }
    let I = R_tot > 0 ? V / R_tot : 0;

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button
                    onClick={() => setIsSeries(!isSeries)}
                    style={{ padding: '7px 14px', background: isSeries ? '#ec489922' : '#22c55e22', color: isSeries ? '#ec4899' : '#22c55e', border: `1px solid ${isSeries ? '#ec4899' : '#22c55e'}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                    {isSeries ? 'Mode: Series' : 'Mode: Parallel'}
                </button>
                <div style={{ flex: 1 }} />
                <div style={{ textAlign: 'right', fontSize: 14, color: '#f59e0b', fontWeight: 800 }}>I_total = {I.toFixed(2)} A</div>
            </div>
            <div style={{ flex: 1, display: 'flex', background: '#0a0a0f', padding: 20, gap: 20 }}>
                <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 12, borderRight: '1px solid #1e1e2e', paddingRight: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Configuration</div>
                    <label style={{ fontSize: 12, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        Voltage (V)
                        <input type="range" min="1" max="100" value={V} onChange={e => setV(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} />
                        <div style={{ textAlign: 'right', color: '#3b82f6', fontWeight: 700 }}>{V} Volts</div>
                    </label>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Resistors</div>
                        <button
                            onClick={() => setResistors([...resistors, { id: Date.now(), val: 10 }])}
                            style={{ padding: '2px 8px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                        >
                            + Add
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
                        {resistors.map((r, i) => (
                            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ color: isSeries ? '#ec4899' : '#22c55e', fontSize: 11, fontWeight: 800, width: 22 }}>R{i + 1}</div>
                                <input
                                    type="number"
                                    min="1"
                                    value={r.val}
                                    onChange={e => setResistors(resistors.map(res => res.id === r.id ? { ...res, val: Math.max(1, +e.target.value) } : res))}
                                    style={{ flex: 1, padding: '4px 6px', background: '#111118', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 12, outline: 'none' }}
                                />
                                <div style={{ color: '#64748b', fontSize: 10 }}>Ω</div>
                                <button
                                    onClick={() => setResistors(resistors.filter(res => res.id !== r.id))}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {resistors.length === 0 && <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>No resistors added.</div>}
                    </div>

                    <div style={{ background: '#111118', padding: 12, borderRadius: 8, border: '1px solid #1e1e2e', marginTop: 'auto' }}>
                        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Total Resistance</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{R_tot.toFixed(2)} Ω</div>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="500" height="250" style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12 }}>
                        <path d="M 70 125 L 70 60 L 430 60 L 430 190 L 70 190 Z" fill="none" stroke="#334155" strokeWidth={2} />

                        {/* Battery Symbol */}
                        <g transform="translate(70, 125)">
                            <rect x="-10" y="-15" width="20" height="30" fill="#0d0d14" />
                            <line x1="-12" y1="-8" x2="12" y2="-8" stroke="#3b82f6" strokeWidth="3" />
                            <line x1="-6" y1="0" x2="6" y2="0" stroke="#3b82f6" strokeWidth="2" />
                            <line x1="-12" y1="8" x2="12" y2="8" stroke="#3b82f6" strokeWidth="3" />
                            <text x="-25" y="0" fill="#3b82f6" fontSize="12" fontWeight="800" textAnchor="end" dominantBaseline="middle">{V}V</text>
                        </g>

                        {isSeries ? resistors.map((r, i) => {
                            let spacing = 360 / (resistors.length + 1);
                            let x = 70 + spacing * (i + 1);
                            let v_r = I * r.val;
                            return (
                                <g key={r.id}>
                                    <rect x={x - 18} y={60 - 10} width="36" height="20" fill="#111118" stroke="#ec4899" strokeWidth="2" rx="2" />
                                    <path d={`M ${x - 18} 60 L ${x - 24} 50 L ${x - 12} 70 L x-6 50 L x+6 70 L x+12 50 L x+18 60`} fill="none" stroke="#ec4899" strokeWidth="1" />
                                    <text x={x} y={60 - 16} fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">R{i + 1}</text>
                                    <text x={x} y={60 + 26} fill="#ec4899" fontSize="10" fontWeight="800" textAnchor="middle">{r.val}Ω ({v_r.toFixed(1)}V)</text>
                                </g>
                            );
                        }) : resistors.map((r, i) => {
                            let spacing = 360 / (resistors.length + 1);
                            let x = 70 + spacing * (i + 1);
                            let i_r = V / r.val;
                            return (
                                <g key={r.id}>
                                    <line x1={x} y1="60" x2={x} y2="190" stroke="#334155" strokeWidth="1" />
                                    <rect x={x - 10} y={125 - 18} width="20" height="36" fill="#111118" stroke="#22c55e" strokeWidth="2" rx="2" />
                                    <text x={x} y={125 - 24} fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">R{i + 1}</text>
                                    <text x={x + 15} y={125} fill="#22c55e" fontSize="10" fontWeight="800" textAnchor="start" dominantBaseline="middle">{r.val}Ω ({i_r.toFixed(2)}A)</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
