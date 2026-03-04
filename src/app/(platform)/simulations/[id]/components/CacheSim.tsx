'use client';
import React, { useState, useEffect } from 'react';

export function CacheSim() {
    const [accessStr, setAccessStr] = useState("0, 4, 8, 12, 16, 0, 4, 8");
    const accesses = accessStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

    const [cacheSize, setCacheSize] = useState(4);
    const [blockSize, setBlockSize] = useState(4);

    const initCache = (size: number) => Array(size).fill(0).map(() => ({ valid: false, tag: null as number | null }));
    const [cache, setCache] = useState<{ valid: boolean, tag: number | null }[]>(initCache(4));

    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [idx, setIdx] = useState(0);
    const [msg, setMsg] = useState('Direct Mapped Cache ready.');

    const next = () => {
        if (idx >= accesses.length) return;
        const addr = accesses[idx];
        const blockAddr = Math.floor(addr / blockSize);
        const index = blockAddr % cacheSize;
        const tag = Math.floor(blockAddr / cacheSize);

        let newCache = [...cache];
        if (newCache.length !== cacheSize) {
            reset();
            return;
        }
        let isHit = false;

        if (newCache[index].valid && newCache[index].tag === tag) {
            isHit = true;
            setHits(hits + 1);
            setMsg(`Addr ${addr}: HIT in block ${index}`);
        } else {
            newCache[index] = { valid: true, tag };
            setCache(newCache);
            setMisses(misses + 1);
            setMsg(`Addr ${addr}: MISS. Loaded into block ${index} (Tag: ${tag})`);
        }
        setIdx(idx + 1);
    };

    const reset = () => {
        setCache(initCache(cacheSize));
        setHits(0); setMisses(0); setIdx(0); setMsg('Reset');
    };

    useEffect(() => {
        setCache(initCache(cacheSize));
        setHits(0); setMisses(0); setIdx(0); setMsg('Cache Resized');
    }, [cacheSize, blockSize]);

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={next} disabled={idx >= accesses.length} style={{ padding: '7px 16px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Next Access</button>
                <button onClick={reset} style={{ padding: '7px 16px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>Reset</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#e2e8f0' }}>Hits: <span style={{ color: '#22c55e', fontWeight: 800 }}>{hits}</span> | Misses: <span style={{ color: '#ef4444', fontWeight: 800 }}>{misses}</span></div>
            </div>
            <div style={{ flex: 1, display: 'flex', background: '#0a0a0f' }}>
                <div style={{ width: 280, borderRight: '1px solid #1e1e2e', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>Hardware Configuration</div>
                        <label style={{ fontSize: 12, color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            Number of Blocks: <input type="number" min="1" max="16" value={cacheSize} onChange={e => setCacheSize(Math.max(1, +e.target.value))} style={{ width: 60, padding: 4, background: '#111118', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 12 }} />
                        </label>
                        <label style={{ fontSize: 12, color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            Block Size (B): <input type="number" min="1" max="64" value={blockSize} onChange={e => setBlockSize(Math.max(1, +e.target.value))} style={{ width: 60, padding: 4, background: '#111118', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 12 }} />
                        </label>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>Memory Accesses</div>
                        <textarea
                            value={accessStr}
                            onChange={e => { setAccessStr(e.target.value); reset(); }}
                            style={{ flex: 1, background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 8, padding: 12, color: '#94a3b8', fontSize: 13, fontFamily: 'monospace', resize: 'none', outline: 'none', lineHeight: 1.5 }}
                            spellCheck={false}
                            placeholder="e.g. 0, 4, 8, 12, 16"
                        />
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 8 }}>Comma separated memory addresses.</div>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', padding: 24, gap: 40, overflowY: 'auto' }}>
                    <div style={{ width: 140 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5 }}>Access Queue</div>
                        {accesses.map((a, i) => (
                            <div key={i} style={{ padding: '8px 12px', background: i === idx ? '#3b82f622' : (i < idx ? '#111118' : '#1e1e2e'), color: i === idx ? '#3b82f6' : (i < idx ? '#475569' : '#e2e8f0'), border: i === idx ? '1px solid #3b82f6' : '1px solid transparent', borderRadius: 6, marginBottom: 6, fontSize: 12, fontWeight: 800, transition: 'all 0.3s' }}>
                                Addr {a}
                            </div>
                        ))}
                        {accesses.length === 0 && <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>No addresses</div>}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: 24, fontSize: 15, color: msg.includes('HIT') ? '#22c55e' : '#f97316', fontWeight: 800 }}>{msg}</div>

                        <table style={{ width: '100%', maxWidth: 500, borderCollapse: 'collapse', textAlign: 'center', color: '#e2e8f0', background: '#0d0d14', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e1e2e' }}>
                            <thead>
                                <tr style={{ background: '#111118', fontSize: 11, textTransform: 'uppercase', color: '#64748b', letterSpacing: 1 }}>
                                    <th style={{ padding: 14 }}>Index</th>
                                    <th style={{ padding: 14 }}>Valid</th>
                                    <th style={{ padding: 14 }}>Tag</th>
                                    <th style={{ padding: 14 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cache.map((blk, i) => {
                                    const isActive = idx > 0 && (Math.floor(accesses[idx - 1] / blockSize) % cacheSize) === i;
                                    return (
                                        <tr key={i} style={{ borderTop: '1px solid #1e1e2e', background: isActive ? 'rgba(249,115,22,0.05)' : 'transparent', transition: 'background 0.3s' }}>
                                            <td style={{ padding: 14, fontWeight: 800, color: '#475569' }}>{i}</td>
                                            <td style={{ padding: 14 }}>
                                                <span style={{ padding: '2px 8px', borderRadius: 4, background: blk.valid ? '#22c55e22' : '#ef444422', color: blk.valid ? '#22c55e' : '#ef4444', fontSize: 10, fontWeight: 800 }}>
                                                    {blk.valid ? 'VALID' : 'INVALID'}
                                                </span>
                                            </td>
                                            <td style={{ padding: 14, fontWeight: 800, color: blk.valid ? '#e2e8f0' : '#334155' }}>
                                                {blk.tag !== null ? blk.tag : '—'}
                                            </td>
                                            <td style={{ padding: 14 }}>
                                                {isActive && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#f97316', margin: '0 auto', boxShadow: '0 0 10px #f97316' }} />}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Bit visualization would go here for further enhancement */}
                        <div style={{ marginTop: 40, width: '100%', maxWidth: 500, padding: 20, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 12 }}>Mapping Logic (Direct Mapped)</div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div>Block Address = Addr / BlockSize</div>
                                <div>Index = Block Address % CacheSize</div>
                                <div>Tag = Block Address / CacheSize</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
