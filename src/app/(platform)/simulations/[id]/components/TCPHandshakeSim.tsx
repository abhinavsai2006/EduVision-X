'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';


export function TCPHandshakeSim() {
    const [step, setStep] = useState(0);
    const [msg, setMsg] = useState('Press Step to start TCP 3-Way Handshake');
    const [packets, setPackets] = useState<{ id: number; type: string; from: 'C' | 'S'; to: 'C' | 'S'; seq: number; ack?: number; flags: string }[]>([]);

    const nextStep = () => {
        if (step >= 3) return;
        const s = step + 1;
        setStep(s);
        if (s === 1) {
            setPackets([...packets, { id: 1, type: 'SYN', from: 'C', to: 'S', seq: 100, flags: 'SYN' }]);
            setMsg('Client sends SYN (Seq=100) to Server.');
        } else if (s === 2) {
            setPackets([...packets, { id: 2, type: 'SYN-ACK', from: 'S', to: 'C', seq: 500, ack: 101, flags: 'SYN, ACK' }]);
            setMsg('Server receives SYN, sends SYN-ACK (Seq=500, Ack=101).');
        } else if (s === 3) {
            setPackets([...packets, { id: 3, type: 'ACK', from: 'C', to: 'S', seq: 101, ack: 501, flags: 'ACK' }]);
            setMsg('Client receives SYN-ACK, sends ACK (Seq=101, Ack=501). Connection ESTABLISHED.');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={nextStep} disabled={step >= 3} style={{ padding: '6px 14px', background: step >= 3 ? '#1e1e2e' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Next Step</button>
                <button onClick={() => { setStep(0); setPackets([]); setMsg('Ready'); }} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Reset</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>3-Way Handshake</div>
            </div>
            <div style={{ flex: 1, background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40, gap: 30 }}>
                <div style={{ width: '100%', maxWidth: 500, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 14, color: '#93c5fd', fontWeight: 700 }}>{msg}</div>
                <div style={{ display: 'flex', width: '100%', maxWidth: 600, justifyContent: 'space-between', position: 'relative' }}>
                    {/* Lifelines */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 80, height: 40, background: '#1e1e2e', border: '2px solid #3b82f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>CLIENT</div>
                        <div style={{ width: 2, flex: 1, background: 'linear-gradient(to bottom, #3b82f6, transparent)', height: 300 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 80, height: 40, background: '#1e1e2e', border: '2px solid #ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>SERVER</div>
                        <div style={{ width: 2, flex: 1, background: 'linear-gradient(to bottom, #ef4444, transparent)', height: 300 }} />
                    </div>
                    {/* Packet Arrows */}
                    <div style={{ position: 'absolute', top: 60, left: 40, right: 40, bottom: 0 }}>
                        {packets.map((p, i) => (
                            <motion.div key={p.id} initial={{ x: p.from === 'C' ? 0 : 400, opacity: 0 }} animate={{ x: p.from === 'C' ? 400 : 0, opacity: 1, y: i * 80 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', width: 120, height: 50, background: '#111118', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 9 }}>
                                <div style={{ fontWeight: 800, color: '#3b82f6', marginBottom: 2 }}>{p.type}</div>
                                <div style={{ color: '#94a3b8' }}>Seq={p.seq}{p.ack ? `, Ack=${p.ack}` : ''}</div>
                                <div style={{ color: '#6366f1', fontWeight: 700 }}>[{p.flags}]</div>
                                <div style={{ position: 'absolute', top: '50%', [p.from === 'C' ? 'left' : 'right']: -30, width: 30, height: 1, background: '#334155' }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
