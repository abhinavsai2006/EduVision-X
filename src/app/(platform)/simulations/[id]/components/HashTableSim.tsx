'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function HashTableSim() {
    const [size, setSize] = useState(7);
    const [table, setTable] = useState<{ key: string, probed?: boolean }[][]>(Array(7).fill([]));
    const [inputVal, setInputVal] = useState('apple');
    const [hashType, setHashType] = useState<'modulo' | 'multi'>('modulo');
    const [collisionType, setCollisionType] = useState<'chaining' | 'probing'>('chaining');
    const [msg, setMsg] = useState('Select logic and insert keys.');
    const [activeBucket, setActiveBucket] = useState(-1);

    const getHash = (str: string, sz: number) => {
        let h = 0;
        if (hashType === 'modulo') {
            for (let i = 0; i < str.length; i++) h = (h + str.charCodeAt(i)) % sz;
        } else {
            const A = 0.6180339887;
            let k = 0;
            for (let i = 0; i < str.length; i++) k += str.charCodeAt(i);
            h = Math.floor(sz * (k * A % 1));
        }
        return h;
    };

    const handleInsert = () => {
        if (!inputVal) return;
        const h = getHash(inputVal, size);
        setActiveBucket(h);
        setTimeout(() => setActiveBucket(-1), 1000);

        let newTable = [...table.map(b => [...b])];

        if (collisionType === 'chaining') {
            if (newTable[h].some(item => item.key === inputVal)) {
                setMsg(`✗ "${inputVal}" already exists in bucket ${h}.`);
            } else {
                newTable[h].push({ key: inputVal });
                setMsg(`✓ Inserted "${inputVal}" into bucket ${h} (Chaining).`);
            }
        } else {
            let i = h;
            let found = false;
            let attempts = 0;
            while (attempts < size) {
                if (newTable[i].length === 0) {
                    newTable[i] = [{ key: inputVal }];
                    setMsg(`✓ Inserted "${inputVal}" at index ${i} after ${attempts} probes.`);
                    found = true;
                    break;
                } else if (newTable[i][0].key === inputVal) {
                    setMsg(`✗ "${inputVal}" already exists at index ${i}.`);
                    found = true;
                    break;
                }
                i = (i + 1) % size;
                attempts++;
            }
            if (!found) setMsg('✗ Table Full! Cannot insert.');
        }
        setTable(newTable);
        setInputVal('');
    };

    const reset = () => {
        setTable(Array(size).fill([]));
        setMsg('Table Reset.');
    };

    return (
        <div style={{ display: 'flex', height: '100%', background: '#0a0a0f' }}>
            <div style={{ width: 280, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Input Key</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} style={{ flex: 1, padding: '10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} placeholder="e.g. data" />
                        <button onClick={handleInsert} style={{ padding: '0 16px', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>ADD</button>
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Hash Function</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setHashType('modulo')} style={{ flex: 1, padding: '8px', background: hashType === 'modulo' ? '#164e63' : '#111118', color: hashType === 'modulo' ? '#22d3ee' : '#64748b', border: `1px solid ${hashType === 'modulo' ? '#22d3ee' : '#1e1e2e'}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Modulo</button>
                        <button onClick={() => setHashType('multi')} style={{ flex: 1, padding: '8px', background: hashType === 'multi' ? '#164e63' : '#111118', color: hashType === 'multi' ? '#22d3ee' : '#64748b', border: `1px solid ${hashType === 'multi' ? '#22d3ee' : '#1e1e2e'}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Multiplication</button>
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Collision Logic</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setCollisionType('chaining')} style={{ flex: 1, padding: '8px', background: collisionType === 'chaining' ? '#3730a3' : '#111118', color: collisionType === 'chaining' ? '#a5b4fc' : '#64748b', border: `1px solid ${collisionType === 'chaining' ? '#a5b4fc' : '#1e1e2e'}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Chaining</button>
                        <button onClick={() => setCollisionType('probing')} style={{ flex: 1, padding: '8px', background: collisionType === 'probing' ? '#3730a3' : '#111118', color: collisionType === 'probing' ? '#a5b4fc' : '#64748b', border: `1px solid ${collisionType === 'probing' ? '#a5b4fc' : '#1e1e2e'}`, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Linear Probe</button>
                    </div>
                </div>

                <button onClick={reset} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Clear Table</button>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 16 }}>
                    <div style={{ fontSize: 10, color: '#64748b' }}>TABLE SIZE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input type="range" min="3" max="13" value={size} onChange={e => { setSize(+e.target.value); setTable(Array(+e.target.value).fill([])); }} style={{ flex: 1, accentColor: '#06b6d4' }} />
                        <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{size}</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', background: '#0d0d14' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#22d3ee' }}>{msg}</div>
                </div>

                <div style={{ flex: 1, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, alignContent: 'start', overflowY: 'auto' }}>
                    {table.map((bucket, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                borderColor: i === activeBucket ? '#22d3ee' : '#1e1e2e',
                                scale: i === activeBucket ? 1.02 : 1
                            }}
                            style={{
                                background: '#111118', border: '2px solid #1e1e2e', borderRadius: 12, overflow: 'hidden',
                                boxShadow: i === activeBucket ? '0 0 20px rgba(34,211,238,0.2)' : 'none'
                            }}
                        >
                            <div style={{ background: '#1e1e2e', padding: '6px 12px', fontSize: 10, fontWeight: 900, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                <span>BUCKET</span>
                                <span style={{ color: '#fff' }}>{i}</span>
                            </div>
                            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 60 }}>
                                {bucket.map((item, j) => (
                                    <motion.div
                                        layout
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        key={`${i}-${j}-${item.key}`}
                                        style={{
                                            padding: '6px 10px', background: '#0a0a0f', border: '1px solid #1e1e2e',
                                            borderRadius: 6, fontSize: 12, color: '#e2e8f0', fontWeight: 600,
                                            display: 'flex', alignItems: 'center', gap: 8
                                        }}
                                    >
                                        <span style={{ color: '#06b6d4' }}>●</span>
                                        {item.key}
                                    </motion.div>
                                ))}
                                {bucket.length === 0 && <div style={{ color: '#334155', fontSize: 11, fontStyle: 'italic', textAlign: 'center', marginTop: 12 }}>empty</div>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
