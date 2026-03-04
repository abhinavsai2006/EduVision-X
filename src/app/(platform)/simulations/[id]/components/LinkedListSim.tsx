'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function LinkedListSim() {
    const [nodes, setNodes] = useState([10, 20, 30, 40]);
    const [valInput, setValInput] = useState('50');
    const [idxInput, setIdxInput] = useState('0');
    const [activeIdx, setActiveIdx] = useState(-1);
    const [msg, setMsg] = useState('Ready for operations.');

    const highlight = (idx: number) => {
        setActiveIdx(idx);
        setTimeout(() => setActiveIdx(-1), 1000);
    };

    const insertAt = (pos: 'head' | 'tail' | 'index') => {
        const val = parseInt(valInput);
        if (isNaN(val)) return;

        let newNodes = [...nodes];
        let targetIdx = 0;

        if (pos === 'head') {
            newNodes.unshift(val);
            targetIdx = 0;
        } else if (pos === 'tail') {
            newNodes.push(val);
            targetIdx = nodes.length;
        } else {
            const idx = parseInt(idxInput);
            if (isNaN(idx) || idx < 0) return;
            targetIdx = Math.min(idx, nodes.length);
            newNodes.splice(targetIdx, 0, val);
        }

        setNodes(newNodes);
        setMsg(`✓ Inserted ${val} at ${pos === 'index' ? 'index ' + targetIdx : pos}.`);
        highlight(targetIdx);
    };

    const deleteBy = (mode: 'index' | 'value') => {
        if (nodes.length === 0) return;

        let newNodes = [...nodes];
        if (mode === 'index') {
            const idx = parseInt(idxInput);
            if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
                setMsg('✗ Invalid index for deletion.');
                return;
            }
            const removed = newNodes.splice(idx, 1);
            setNodes(newNodes);
            setMsg(`✓ Deleted ${removed[0]} at index ${idx}.`);
        } else {
            const val = parseInt(valInput);
            const idx = newNodes.indexOf(val);
            if (idx === -1) {
                setMsg(`✗ Value ${val} not found in list.`);
                return;
            }
            newNodes.splice(idx, 1);
            setNodes(newNodes);
            setMsg(`✓ Deleted first occurrence of ${val}.`);
        }
    };

    const reverse = () => {
        setNodes([...nodes].reverse());
        setMsg('✓ Linked List reversed.');
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            {/* Control Sidebar */}
            <div style={{ width: 280, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Node Data</div>
                    <input value={valInput} onChange={e => setValInput(e.target.value)} type="number" style={{ padding: '10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} placeholder="Value" />
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => insertAt('head')} style={{ flex: 1, padding: '8px', background: '#312e81', color: '#a5b4fc', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Head</button>
                        <button onClick={() => insertAt('tail')} style={{ flex: 1, padding: '8px', background: '#312e81', color: '#a5b4fc', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Tail</button>
                        <button onClick={() => deleteBy('value')} style={{ flex: 1, padding: '8px', background: '#451a1a', color: '#fca5a5', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>- Value</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Index Operations</div>
                    <input value={idxInput} onChange={e => setIdxInput(e.target.value)} type="number" style={{ padding: '10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} placeholder="Index" />
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => insertAt('index')} style={{ flex: 1, padding: '8px', background: '#064e3b', color: '#6ee7b7', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Insert at Idx</button>
                        <button onClick={() => deleteBy('index')} style={{ flex: 1, padding: '8px', background: '#451a1a', color: '#fca5a5', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Del at Idx</button>
                    </div>
                </div>

                <button onClick={reverse} style={{ width: '100%', padding: '10px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>⇄ Reverse List</button>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 16 }}>
                    <div style={{ fontSize: 10, color: '#64748b' }}>LIST STATUS</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0' }}>Length: {nodes.length}</div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
                <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', background: '#0d0d14' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{msg}</div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: 40, flexWrap: 'wrap', overflowY: 'auto' }}>
                    {nodes.length === 0 && <div style={{ color: '#475569', fontStyle: 'italic' }}>List is empty. Use the sidebar to add nodes.</div>}

                    {nodes.map((v, i) => (
                        <div key={`${i}-${v}`} style={{ display: 'flex', alignItems: 'center' }}>
                            <motion.div
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    width: 64, height: 64, border: `2px solid ${i === activeIdx ? '#6366f1' : '#1e1e2e'}`,
                                    background: i === activeIdx ? 'rgba(99,102,241,0.2)' : '#111118',
                                    borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: i === activeIdx ? '0 0 15px rgba(99,102,241,0.3)' : 'none',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>{v}</div>
                                <div style={{ fontSize: 9, color: '#64748b' }}>IDX: {i}</div>
                                {i === 0 && <div style={{ position: 'absolute', top: -20, fontSize: 10, fontWeight: 800, color: '#f97316' }}>HEAD</div>}
                                {i === nodes.length - 1 && <div style={{ position: 'absolute', bottom: -20, fontSize: 10, fontWeight: 800, color: '#06b6d4' }}>TAIL</div>}
                            </motion.div>

                            {i < nodes.length - 1 && (
                                <div style={{ width: 40, height: 2, background: '#1e1e2e', position: 'relative' }}>
                                    <div style={{ position: 'absolute', right: -6, top: -4, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #334155' }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
