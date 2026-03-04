'use client';
import React, { useState } from 'react';

export function HTTPLifecycleSim() {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('https://api.example.com/v1/users');
    const [step, setStep] = useState(0);

    const steps = [
        { title: 'DNS Resolution', desc: `Resolving hostname "api.example.com" to IP address 93.184.216.34`, color: '#3b82f6' },
        { title: 'TCP Handshake', desc: 'Establishing 3-way SYN, SYN-ACK, ACK connection', color: '#f59e0b' },
        { title: 'TLS Negotiation', desc: 'Secure handshake, certificate verification and key exchange', color: '#a855f7' },
        { title: 'Request Sent', desc: `${method} ${url} with headers`, color: '#22c55e' },
        { title: 'Server Processing', desc: 'Server parsing headers, running business logic, and querying DB', color: '#6366f1' },
        { title: 'Response Received', desc: '200 OK - Content-Type: application/json', color: '#14b8a6' },
        { title: 'Parsing & Rendering', desc: 'Browser parsing JSON data and updating the DOM', color: '#ec4899' },
    ];

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <select value={method} onChange={e => { setMethod(e.target.value); setStep(0) }} style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', color: '#f59e0b', borderRadius: 4, fontWeight: 700, outline: 'none' }}>
                    <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                </select>
                <input value={url} onChange={e => { setUrl(e.target.value); setStep(0); }} style={{ width: 250, padding: '6px 10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 4, color: '#e2e8f0', fontSize: 13, outline: 'none' }} placeholder="Enter full URL..." spellCheck={false} />

                <div style={{ width: 1, height: 16, background: '#1e1e2e', margin: '0 8px' }} />

                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '6px 14px', background: '#111118', color: '#e2e8f0', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Previous</button>
                <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Next Step</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>Step {step + 1} of {steps.length}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 40, background: '#0a0a0f', overflowY: 'auto' }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 20, opacity: i <= step ? 1 : 0.2, transition: 'opacity 0.3s', marginBottom: i === steps.length - 1 ? 0 : 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: i === step ? s.color : '#1e1e2e', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                            {i + 1}
                        </div>
                        <div style={{ flex: 1, background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, padding: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
