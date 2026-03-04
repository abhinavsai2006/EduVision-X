'use client';
import React, { useState } from 'react';

export function OSISim() {
    const [data, setData] = useState('GET /index.html');
    const [direction, setDir] = useState<'down' | 'up'>('down');
    const [step, setStep] = useState(0); // 0-7
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Enter data and run Encapsulation');

    const layers = [
        { name: 'Application', pdu: 'Data', header: 'HTTP', color: '#3b82f6' },
        { name: 'Presentation', pdu: 'Data', header: 'SSL/TLS', color: '#8b5cf6' },
        { name: 'Session', pdu: 'Data', header: 'NetBIOS', color: '#ec4899' },
        { name: 'Transport', pdu: 'Segment', header: 'TCP Head', color: '#ef4444' },
        { name: 'Network', pdu: 'Packet', header: 'IP Head', color: '#f59e0b' },
        { name: 'Data Link', pdu: 'Frame', header: 'MAC Head', color: '#22c55e' },
        { name: 'Physical', pdu: 'Bits', header: '010101', color: '#64748b' },
    ];

    const run = async (dir: 'down' | 'up') => {
        setRunning(true); setDir(dir);
        if (dir === 'down') {
            for (let i = 0; i <= 7; i++) { setStep(i); setMsg(`Encapsulating at Layer ${7 - i}...`); await new Promise(r => setTimeout(r, 600)); }
            setMsg('Data sent over physical medium!');
        } else {
            for (let i = 7; i >= 0; i--) { setStep(i); setMsg(`De-encapsulating at Layer ${7 - i}...`); await new Promise(r => setTimeout(r, 600)); }
            setMsg('Data received by Application!');
        }
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <input value={data} onChange={e => setData(e.target.value)} style={{ padding: '6px 10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 4, color: '#e2e8f0', fontSize: 12, outline: 'none' }} disabled={running} />
                <button onClick={() => run('down')} disabled={running} style={{ padding: '6px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Encapsulate ↓</button>
                <button onClick={() => run('up')} disabled={running} style={{ padding: '6px 14px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>De-encapsulate ↑</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', padding: 20, background: '#0a0a0f', gap: 40, overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 250 }}>
                    {layers.map((l, i) => (
                        <div key={i} style={{ padding: 16, background: '#111118', border: `2px solid ${(direction === 'down' && step > i) || (direction === 'up' && step <= i) ? l.color : '#1e1e2e'}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 10, color: '#64748b' }}>Layer {7 - i}</span>
                                <span style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>{l.name}</span>
                            </div>
                            <div style={{ fontSize: 11, color: l.color, fontWeight: 700, background: `${l.color}22`, padding: '4px 8px', borderRadius: 4 }}>{l.pdu}</div>
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 16 }}>Payload Builder</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ padding: '20px', background: '#1e1e2e', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontWeight: 800 }}>"{data}"</div>
                        {layers.slice(0, step).map((l, i) => (
                            <div key={i} style={{ padding: '16px 10px', background: '#111118', border: `2px solid ${l.color}`, color: l.color, borderRadius: 8, fontWeight: 800, fontSize: 12 }}>
                                [{l.header}]
                            </div>
                        )).reverse()}
                    </div>
                    {step === 7 && (
                        <div style={{ marginTop: 20, padding: 20, width: '100%', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, color: '#22c55e', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            010101101010010100010101010101100101010001000101010110101...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
