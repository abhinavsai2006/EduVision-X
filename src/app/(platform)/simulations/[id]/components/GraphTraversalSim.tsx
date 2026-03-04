'use client';
import React, { useState, useRef } from 'react';

export function GraphTraversalSim() {
    const [nodes] = useState([
        { id: 0, label: 'A', x: 80, y: 60 }, { id: 1, label: 'B', x: 220, y: 40 },
        { id: 2, label: 'C', x: 360, y: 60 }, { id: 3, label: 'D', x: 120, y: 180 },
        { id: 4, label: 'E', x: 280, y: 200 }, { id: 5, label: 'F', x: 420, y: 180 },
    ]);
    const [edges] = useState([[0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [4, 5]]);
    const [visited, setVisited] = useState<number[]>([]);
    const [algo, setAlgo] = useState<'bfs' | 'dfs'>('bfs');
    const [startNode, setStartNode] = useState(0);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Pick a start node and algorithm, then press Run');
    const stopRef = useRef(false);

    const adj = (n: number) => edges.filter(e => e[0] === n || e[1] === n).map(e => e[0] === n ? e[1] : e[0]);

    const run = async () => {
        stopRef.current = false; setRunning(true); setVisited([]);
        const vis: number[] = [];
        if (algo === 'bfs') {
            const q = [startNode]; const seen = new Set([startNode]);
            while (q.length && !stopRef.current) {
                const n = q.shift()!; vis.push(n); setVisited([...vis]);
                setMsg(`BFS visiting: ${nodes[n].label}`);
                await new Promise(r => setTimeout(r, 600));
                for (const nb of adj(n)) { if (!seen.has(nb)) { seen.add(nb); q.push(nb); } }
            }
        } else {
            const seen = new Set<number>();
            const dfs = async (n: number) => {
                if (seen.has(n) || stopRef.current) return;
                seen.add(n); vis.push(n); setVisited([...vis]);
                setMsg(`DFS visiting: ${nodes[n].label}`);
                await new Promise(r => setTimeout(r, 600));
                for (const nb of adj(n)) await dfs(nb);
            };
            await dfs(startNode);
        }
        if (!stopRef.current) setMsg(`✓ ${algo.toUpperCase()} complete: ${vis.map(v => nodes[v].label).join(' → ')}`);
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Algorithm</div>
                {(['bfs', 'dfs'] as const).map(a => (
                    <button key={a} onClick={() => !running && setAlgo(a)} style={{ padding: '7px 10px', borderRadius: 8, border: algo === a ? '1px solid rgba(245,158,11,0.4)' : '1px solid #1e1e2e', background: algo === a ? 'rgba(245,158,11,0.12)' : '#111118', color: algo === a ? '#fbbf24' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{a.toUpperCase()}</button>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 8 }}>Start Node</div>
                <select value={startNode} onChange={e => setStartNode(+e.target.value)} style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
                <button onClick={run} disabled={running} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Run</button>
                <button onClick={() => { stopRef.current = true; setVisited([]); setRunning(false); setMsg('Reset'); }} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Reset</button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={520} height={280} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        {edges.map(([a, b], i) => <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#1e1e2e" strokeWidth={2} />)}
                        {nodes.map(n => {
                            const isVis = visited.includes(n.id);
                            const idx = visited.indexOf(n.id);
                            return (
                                <g key={n.id}>
                                    <circle cx={n.x} cy={n.y} r={22} fill={isVis ? '#f59e0b' : '#111118'} stroke={isVis ? '#fbbf24' : '#1e1e2e'} strokeWidth={2} />
                                    <text x={n.x} y={n.y + 5} textAnchor="middle" fill={isVis ? '#000' : '#e2e8f0'} fontSize={14} fontWeight={800}>{n.label}</text>
                                    {isVis && <text x={n.x} y={n.y - 28} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={700}>#{idx + 1}</text>}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
