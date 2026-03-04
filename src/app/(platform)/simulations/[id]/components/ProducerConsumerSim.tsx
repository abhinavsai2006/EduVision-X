'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProducerConsumerSim() {
    const [buffer, setBuffer] = useState<number[]>([]);
    const capacity = 8;
    const [msg, setMsg] = useState('Interactive Semaphores & Mutex Demo');
    const [running, setRunning] = useState(false);
    const stopRef = useRef(false);

    const produce = () => {
        if (buffer.length >= capacity) { setMsg('Buffer Full! Producer must wait.'); return; }
        const id = Math.floor(Math.random() * 90) + 10;
        setBuffer(prev => [...prev, id]);
        setMsg(`Producer added ${id} to buffer.`);
    };

    const consume = () => {
        if (buffer.length === 0) { setMsg('Buffer Empty! Consumer must wait.'); return; }
        const id = buffer[0];
        setBuffer(prev => prev.slice(1));
        setMsg(`Consumer removed ${id} from buffer.`);
    };

    const autoRun = async () => {
        setRunning(true); stopRef.current = false;
        while (!stopRef.current) {
            const wait = Math.random() * 1500 + 500;
            await new Promise(r => setTimeout(r, wait));
            if (Math.random() > 0.5) produce(); else consume();
        }
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#0a0a0f' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 16, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={produce} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Produce Item (+)</button>
                <button onClick={consume} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Consume Item (-)</button>
                <div style={{ width: 1, height: 20, background: '#1e1e2e' }} />
                {!running ? (
                    <button onClick={autoRun} style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Start Auto-Sim</button>
                ) : (
                    <button onClick={() => { stopRef.current = true; setRunning(false); }} style={{ padding: '8px 16px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Stop Auto-Sim</button>
                )}
                <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{msg}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <div style={{ display: 'flex', gap: 40, alignItems: 'center', marginBottom: 60 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 40, background: '#3b82f622', border: '2px dashed #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏭</div>
                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 900, color: '#3b82f6' }}>PRODUCER</div>
                    </div>
                    <div style={{ fontSize: 24, color: '#1e1e2e' }}>→</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>BUFFER ({buffer.length}/{capacity})</div>
                        <div style={{ display: 'flex', gap: 8, background: '#111118', padding: 12, borderRadius: 12, border: '1px solid #1e1e2e', minWidth: 400, minHeight: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatePresence>
                                {buffer.map((item, i) => (
                                    <motion.div
                                        key={`${i}-${item}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                        style={{ width: 44, height: 44, background: '#3b82f6', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, border: '2px solid #60a5fa' }}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {buffer.length === 0 && <div style={{ color: '#334155', fontSize: 12, fontStyle: 'italic' }}>Buffer Empty... Waiting for items</div>}
                        </div>
                    </div>
                    <div style={{ fontSize: 24, color: '#1e1e2e' }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 40, background: '#ef444422', border: '2px dashed #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🛒</div>
                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 900, color: '#ef4444' }}>CONSUMER</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ padding: '16px 24px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>SEMAPHORE: FULL</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{buffer.length}</div>
                    </div>
                    <div style={{ padding: '16px 24px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>SEMAPHORE: EMPTY</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{capacity - buffer.length}</div>
                    </div>
                    <div style={{ padding: '16px 24px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>MUTEX LOCK</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: running ? '#22c55e' : '#f59e0b' }}>{running ? 'ENGAGED' : 'READY'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
