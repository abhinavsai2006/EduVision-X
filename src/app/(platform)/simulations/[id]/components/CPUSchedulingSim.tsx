'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Proc = { id: string; arrival: number; burst: number; priority: number; color: string };

export function CPUSchedulingSim() {
    const [procs, setProcs] = useState<Proc[]>([
        { id: 'P1', arrival: 0, burst: 5, priority: 2, color: '#6366f1' },
        { id: 'P2', arrival: 1, burst: 3, priority: 1, color: '#22c55e' },
        { id: 'P3', arrival: 2, burst: 8, priority: 3, color: '#f59e0b' },
        { id: 'P4', arrival: 3, burst: 2, priority: 4, color: '#ef4444' },
        { id: 'P5', arrival: 4, burst: 4, priority: 2, color: '#a855f7' },
    ]);
    const [algo, setAlgo] = useState('fcfs');
    const [quantum, setQuantum] = useState(2);
    const [gantt, setGantt] = useState<{ pid: string; start: number; end: number; color: string }[]>([]);
    const [metrics, setMetrics] = useState({ avgWait: 0, avgTurnaround: 0 });

    const compute = () => {
        const ps = procs.map(p => ({ ...p })).sort((a, b) => a.arrival - b.arrival);
        const chart: typeof gantt = [];
        let time = 0;
        const waits: number[] = [];

        if (algo === 'fcfs') {
            ps.forEach(p => {
                if (time < p.arrival) time = p.arrival;
                chart.push({ pid: p.id, start: time, end: time + p.burst, color: p.color });
                waits.push(time - p.arrival);
                time += p.burst;
            });
        } else if (algo === 'sjf') {
            const rem = ps.map(p => ({ ...p, remaining: p.burst }));
            const done = new Set<string>();
            while (done.size < rem.length) {
                const avail = rem.filter(p => p.arrival <= time && !done.has(p.id)).sort((a, b) => a.remaining - b.remaining);
                if (avail.length === 0) { time++; continue; }
                const p = avail[0];
                chart.push({ pid: p.id, start: time, end: time + p.remaining, color: p.color });
                waits.push(time - p.arrival);
                time += p.remaining;
                done.add(p.id);
            }
        } else if (algo === 'rr') {
            const q: { id: string; remaining: number; arrival: number; color: string; firstRun: number }[] = [];
            const rem = ps.map(p => ({ ...p, remaining: p.burst, firstRun: -1 }));
            let added = new Set<number>();
            rem.forEach((p, i) => { if (p.arrival <= time && !added.has(i)) { q.push(p); added.add(i); } });
            while (q.length > 0) {
                const p = q.shift()!;
                if (p.firstRun < 0) p.firstRun = time;
                const run = Math.min(quantum, p.remaining);
                chart.push({ pid: p.id, start: time, end: time + run, color: p.color });
                time += run;
                p.remaining -= run;
                rem.forEach((r, i) => { if (r.arrival <= time && !added.has(i)) { q.push(r); added.add(i); } });
                if (p.remaining > 0) q.push(p);
                else waits.push(time - (rem.find(r => r.id === p.id)?.arrival ?? 0) - (rem.find(r => r.id === p.id)?.burst ?? 0));
            }
        } else if (algo === 'priority') {
            const rem = ps.map(p => ({ ...p }));
            const done = new Set<string>();
            while (done.size < rem.length) {
                const avail = rem.filter(p => p.arrival <= time && !done.has(p.id)).sort((a, b) => a.priority - b.priority);
                if (avail.length === 0) { time++; continue; }
                const p = avail[0];
                chart.push({ pid: p.id, start: time, end: time + p.burst, color: p.color });
                waits.push(time - p.arrival);
                time += p.burst;
                done.add(p.id);
            }
        }
        setGantt(chart);
        const avgW = waits.length ? waits.reduce((a, b) => a + b, 0) / waits.length : 0;
        setMetrics({
            avgWait: Math.round(avgW * 10) / 10,
            avgTurnaround: Math.round((avgW + procs.reduce((a, p) => a + p.burst, 0) / (procs.length || 1)) * 10) / 10
        });
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 320, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, overflowY: 'auto' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Algorithm</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                        ['fcfs', 'FCFS'],
                        ['sjf', 'SJF'],
                        ['rr', 'Round Robin'],
                        ['priority', 'Priority']
                    ].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setAlgo(id)}
                            style={{
                                flex: '1 1 45%',
                                padding: '7px 10px',
                                borderRadius: 8,
                                border: algo === id ? '1px solid rgba(249,115,22,0.4)' : '1px solid #1e1e2e',
                                background: algo === id ? 'rgba(249,115,22,0.12)' : '#111118',
                                color: algo === id ? '#fb923c' : '#94a3b8',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {algo === 'rr' && (
                    <label style={{ fontSize: 11, color: '#94a3b8' }}>
                        Quantum: {quantum}
                        <input
                            type="range"
                            min={1}
                            max={6}
                            value={quantum}
                            onChange={e => setQuantum(+e.target.value)}
                            style={{ width: '100%', accentColor: '#f97316' }}
                        />
                    </label>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Processes</div>
                    <button
                        onClick={() => {
                            const newIdCounter = procs.length > 0 ? Math.max(...procs.map(p => parseInt(p.id.substring(1)) || 0)) + 1 : 1;
                            const color = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#06b6d4', '#14b8a6'][newIdCounter % 8];
                            setProcs([...procs, { id: `P${newIdCounter}`, arrival: procs.length ? Math.max(...procs.map(p => p.arrival)) + 1 : 0, burst: 4, priority: 2, color }]);
                        }}
                        style={{ padding: '4px 8px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                    >
                        + Add
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, color: '#e2e8f0' }}>
                        <thead>
                            <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e1e2e' }}>
                                <th style={{ padding: '6px 4px' }}>ID</th>
                                <th style={{ padding: '6px 4px' }}>Arr</th>
                                <th style={{ padding: '6px 4px' }}>Burst</th>
                                {algo === 'priority' && <th style={{ padding: '6px 4px' }}>Prio</th>}
                                <th style={{ padding: '6px 4px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {procs.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #111118' }}>
                                    <td style={{ padding: '6px 4px', color: p.color, fontWeight: 800 }}>{p.id}</td>
                                    <td style={{ padding: '6px 4px' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            value={p.arrival}
                                            onChange={e => setProcs(procs.map(x => x.id === p.id ? { ...x, arrival: Math.max(0, +e.target.value) } : x))}
                                            style={{ width: 34, padding: 2, background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 11, outline: 'none' }}
                                        />
                                    </td>
                                    <td style={{ padding: '6px 4px' }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={p.burst}
                                            onChange={e => setProcs(procs.map(x => x.id === p.id ? { ...x, burst: Math.max(1, +e.target.value) } : x))}
                                            style={{ width: 34, padding: 2, background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 11, outline: 'none' }}
                                        />
                                    </td>
                                    {algo === 'priority' && (
                                        <td style={{ padding: '6px 4px' }}>
                                            <input
                                                type="number"
                                                min="1"
                                                value={p.priority}
                                                onChange={e => setProcs(procs.map(x => x.id === p.id ? { ...x, priority: Math.max(1, +e.target.value) } : x))}
                                                style={{ width: 34, padding: 2, background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#fff', borderRadius: 4, fontSize: 11, outline: 'none' }}
                                            />
                                        </td>
                                    )}
                                    <td style={{ padding: '6px 4px' }}>
                                        <button
                                            onClick={() => setProcs(procs.filter(x => x.id !== p.id))}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 14, cursor: 'pointer', padding: 0 }}
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {procs.length === 0 && <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', padding: 8, textAlign: 'center' }}>No processes added.</div>}
                </div>

                <button
                    onClick={compute}
                    style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
                >
                    ⚙ Compute Schedule
                </button>

                <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: 10, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontSize: 10, color: '#475569' }}>Avg Wait</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#fb923c' }}>{metrics.avgWait}ms</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 10, color: '#475569' }}>Avg Turnaround</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#fb923c' }}>{metrics.avgTurnaround}ms</div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>Gantt Chart</div>
                <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {gantt.length === 0 ? (
                        <div style={{ color: '#475569', textAlign: 'center', marginTop: 60 }}>
                            Select an algorithm and press Compute
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 60 }}>
                                {gantt.map((g, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        style={{
                                            flex: g.end - g.start,
                                            background: g.color,
                                            borderRadius: 4,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            transformOrigin: 'left'
                                        }}
                                    >
                                        {g.pid}
                                    </motion.div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 2 }}>
                                {gantt.map((g, i) => (
                                    <div key={i} style={{ flex: g.end - g.start, fontSize: 9, color: '#475569', textAlign: 'center' }}>
                                        {g.start}–{g.end}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                                {procs.map(p => (
                                    <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                                        {p.id}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
