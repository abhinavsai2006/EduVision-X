'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function StackQueueSim() {
    const [stack, setStack] = useState<string[]>(['10', '20', '30']);
    const [queue, setQueue] = useState<string[]>(['10', '20', '30']);
    const [val, setVal] = useState('40');
    const [msg, setMsg] = useState('LIFO Stack vs FIFO Queue Visualization');

    const push = () => { if (!val) return; setStack([...stack, val]); setVal(''); setMsg(`✓ Stack: Pushed "${val}"`); };
    const pop = () => { if (stack.length === 0) return; const p = stack[stack.length - 1]; setStack(stack.slice(0, -1)); setMsg(`- Stack: Popped "${p}"`); };
    const enqueue = () => { if (!val) return; setQueue([...queue, val]); setVal(''); setMsg(`✓ Queue: Enqueued "${val}"`); };
    const dequeue = () => { if (queue.length === 0) return; const d = queue[0]; setQueue(queue.slice(1)); setMsg(`- Queue: Dequeued "${d}"`); };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#0a0a0f' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 16, alignItems: 'center', background: '#0d0d14' }}>
                <input value={val} onChange={e => setVal(e.target.value)} placeholder="Node value..." style={{ padding: '10px 14px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', width: 140 }} />
                <button onClick={() => { push(); enqueue(); }} style={{ padding: '10px 18px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Add to Both</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#f97316' }}>{msg}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 2 }}>
                <div style={{ flex: 1, borderRight: '1px solid #1e1e2e', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 24, textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 16, color: '#f59e0b', fontWeight: 900, letterSpacing: 1 }}>STACK (LIFO)</h3>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Last-In First-Out</div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                        <button onClick={push} style={{ padding: '8px 20px', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 6, color: '#a5b4fc', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Push</button>
                        <button onClick={pop} style={{ padding: '8px 20px', background: '#451a1a', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Pop</button>
                    </div>

                    <div style={{
                        width: 160, borderLeft: '4px solid #334155', borderRight: '4px solid #334155', borderBottom: '4px solid #334155',
                        borderRadius: '0 0 16px 16px', padding: 8, display: 'flex', flexDirection: 'column-reverse', gap: 8, minHeight: 280, justifyContent: 'flex-start'
                    }}>
                        {stack.map((item, i) => (
                            <motion.div
                                key={`${i}-${item}`}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                style={{
                                    padding: '12px', background: i === stack.length - 1 ? '#f59e0b' : '#111118',
                                    color: i === stack.length - 1 ? '#000' : '#fff', borderRadius: 8, textAlign: 'center',
                                    fontSize: 14, fontWeight: 800, border: '1px solid #1e1e2e', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)'
                                }}
                            >
                                {item}
                            </motion.div>
                        ))}
                        {stack.length === 0 && <div style={{ color: '#475569', fontSize: 12, textAlign: 'center', fontStyle: 'italic', marginTop: 'auto' }}>Stack Underflow</div>}
                    </div>
                </div>

                <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 24, textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 16, color: '#3b82f6', fontWeight: 900, letterSpacing: 1 }}>QUEUE (FIFO)</h3>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>First-In First-Out</div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                        <button onClick={enqueue} style={{ padding: '8px 20px', background: '#1e1b4b', border: '1px solid #312e81', borderRadius: 6, color: '#a5b4fc', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Enqueue</button>
                        <button onClick={dequeue} style={{ padding: '8px 20px', background: '#451a1a', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Dequeue</button>
                    </div>

                    <div style={{
                        width: '90%', height: 70, borderTop: '4px solid #334155', borderBottom: '4px solid #334155',
                        borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8, overflowX: 'auto', position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', left: -50, top: 40, fontSize: 10, color: '#64748b' }}>FRONT</div>
                        <div style={{ position: 'absolute', right: -40, top: 40, fontSize: 10, color: '#64748b' }}>REAR</div>

                        {queue.map((item, i) => (
                            <motion.div
                                key={`${i}-${item}`}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                style={{
                                    height: 44, minWidth: 64, background: i === 0 ? '#3b82f6' : '#111118',
                                    color: i === 0 ? '#fff' : '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 800, border: '1px solid #1e1e2e', flexShrink: 0
                                }}
                            >
                                {item}
                            </motion.div>
                        ))}
                        {queue.length === 0 && <div style={{ color: '#475569', fontSize: 12, width: '100%', textAlign: 'center', fontStyle: 'italic' }}>Queue Empty</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
