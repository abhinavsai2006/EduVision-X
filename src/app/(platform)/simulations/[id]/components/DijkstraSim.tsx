'use client';
import React, { useState, useRef } from 'react';

type Node = { id: number; label: string; x: number; y: number };
type Edge = [number, number, number];

export function DijkstraSim() {
    const [nodes, setNodes] = useState<Node[]>([
        { id: 0, label: 'S', x: 100, y: 200 }, { id: 1, label: 'A', x: 250, y: 100 },
        { id: 2, label: 'B', x: 250, y: 300 }, { id: 3, label: 'C', x: 450, y: 100 },
        { id: 4, label: 'D', x: 450, y: 300 }, { id: 5, label: 'T', x: 600, y: 200 },
    ]);
    const [edges, setEdges] = useState<Edge[]>([
        [0, 1, 4], [0, 2, 2], [1, 2, 1], [1, 3, 5], [2, 4, 3], [3, 5, 1], [4, 5, 6], [3, 4, 2],
    ]);
    const [dist, setDist] = useState<number[]>([]);
    const [prev, setPrev] = useState<number[]>([]);
    const [visited, setVisited] = useState<number[]>([]);
    const [pathEdges, setPathEdges] = useState<number[][]>([]);
    const [source, setSource] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [msg, setMsg] = useState('Select start source and press Run');

    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    const stopRef = useRef(false);
    const pausedRef = useRef(false);
    pausedRef.current = paused;

    const run = async () => {
        stopRef.current = false; setRunning(true); setPaused(false); pausedRef.current = false;
        const n = nodes.length > 0 ? Math.max(...nodes.map(node => node.id)) + 1 : 0;
        const d = Array(n).fill(Infinity); d[source] = 0;
        const p = Array(n).fill(-1);
        const vis: number[] = [];
        setDist([...d]); setPrev([...p]); setVisited([]); setPathEdges([]);

        const baseDelay = 700 / speed;

        for (let i = 0; i < nodes.length && !stopRef.current; i++) {
            while (pausedRef.current && !stopRef.current) await new Promise(r => setTimeout(r, 200));
            if (stopRef.current) break;

            let u = -1;
            for (let v of nodes) {
                if (!vis.includes(v.id) && (u === -1 || d[v.id] < d[u])) u = v.id;
            }
            if (u === -1 || d[u] === Infinity) break;

            vis.push(u); setVisited([...vis]);
            const uNode = nodes.find(nd => nd.id === u);
            setMsg(`Visiting ${uNode?.label || u} (dist=${d[u]})`);
            await new Promise(r => setTimeout(r, baseDelay));

            while (pausedRef.current && !stopRef.current) await new Promise(r => setTimeout(r, 200));
            if (stopRef.current) break;

            for (const [a, b, w] of edges) {
                const nb = a === u ? b : b === u ? a : -1;
                if (nb >= 0 && !vis.includes(nb) && d[u] + w < d[nb]) {
                    d[nb] = d[u] + w; p[nb] = u;
                    setDist([...d]); setPrev([...p]);
                }
            }
        }
        setMsg(`✓ Shortest paths calculated from ${nodes.find(nd => nd.id === source)?.label}. (Click nodes to trace)`);
        setRunning(false); setPaused(false);
    };

    const handleSvgClick = (e: React.MouseEvent) => {
        if (running || (e.target as HTMLElement).tagName === 'circle' || (e.target as HTMLElement).tagName === 'text') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
        const newLabel = String.fromCharCode(65 + (newId % 26)) + (newId >= 26 ? Math.floor(newId / 26) : '');
        setNodes([...nodes, { id: newId, label: newLabel, x, y }]);
        setMsg(`Added Node ${newLabel}. Click two nodes to add an edge.`);
    };

    const handleNodeClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (running) return;

        if (dist.length > 0 && dist[source] === 0) {
            const p = prev;
            if (dist[id] === Infinity) {
                setMsg(`No path to ${nodes.find(n => n.id === id)?.label}`);
                return;
            }
            const pe: number[][] = [];
            let cur = id;
            while (p[cur] >= 0) { pe.push([p[cur], cur]); cur = p[cur]; }
            setPathEdges(pe);
            setMsg(`Path to ${nodes.find(n => n.id === id)?.label}: cost ${dist[id]}`);
            return;
        }

        if (selectedNode === null) {
            setSelectedNode(id);
            setMsg(`Selected ${nodes.find(n => n.id === id)?.label}. Click another node to link.`);
        } else {
            if (selectedNode !== id) {
                const existing = edges.findIndex(edge => (edge[0] === selectedNode && edge[1] === id) || (edge[0] === id && edge[1] === selectedNode));
                if (existing >= 0) {
                    setEdges(edges.filter((_, idx) => idx !== existing));
                    setMsg('Edge removed.');
                } else {
                    setEdges([...edges, [selectedNode, id, Math.floor(Math.random() * 9) + 1]]);
                    setMsg('Edge added. (Right-click node to delete node)');
                }
            } else {
                setMsg('Selection cleared.');
            }
            setSelectedNode(null);
        }
    };

    const handleNodeContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (running) return;
        setNodes(nodes.filter(n => n.id !== id));
        setEdges(edges.filter(edge => edge[0] !== id && edge[1] !== id));
        if (selectedNode === id) setSelectedNode(null);
        if (source === id) setSource(nodes.length > 1 && nodes[0].id !== id ? nodes[0].id : nodes.length > 1 ? nodes[1].id : 0);
        setMsg('Node deleted.');
    };

    const isPathEdge = (a: number, b: number) => pathEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 220, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Config & Tools</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                    • <b>Click background</b> to Add Node<br />
                    • <b>Click 2 nodes</b> to Add/Remove Edge<br />
                    • <b>Right-click node</b> to Delete Node<br />
                    • After run, click a node to trace path.
                </div>
                <select
                    value={source}
                    onChange={e => { setSource(+e.target.value); setDist([]); setPathEdges([]); setVisited([]); }}
                    style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 12, outline: 'none' }}
                >
                    {nodes.map(n => <option key={n.id} value={n.id}>Start Node: {n.label}</option>)}
                </select>

                <label style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    Animation Speed: {speed}x
                    <input
                        type="range"
                        min={0.5}
                        max={4}
                        step={0.5}
                        value={speed}
                        onChange={e => setSpeed(+e.target.value)}
                        style={{ width: '100%', accentColor: '#8b5cf6' }}
                    />
                </label>

                <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                    <button
                        onClick={run}
                        disabled={running}
                        style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#8b5cf6', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                        ▶ Run
                    </button>
                    {running && (
                        <button
                            onClick={() => setPaused(!paused)}
                            style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                            {paused ? 'Resume' : 'Pause'}
                        </button>
                    )}
                    {running && (
                        <button
                            onClick={() => { stopRef.current = true; setRunning(false); }}
                            style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                            Stop
                        </button>
                    )}
                </div>

                <button
                    onClick={() => { setDist([]); setPathEdges([]); setVisited([]); setMsg('Simulation cleared. Graph is ready to edit.'); }}
                    disabled={running || dist.length === 0}
                    style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: 'transparent', color: '#94a3b8', fontSize: 10, cursor: 'pointer' }}
                >
                    Clear Run Data
                </button>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 10 }}>Distances</div>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dist.length > 0 && nodes.map((n) => (
                        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingBottom: 4, borderBottom: '1px solid #1e1e2e', color: visited.includes(n.id) ? '#c084fc' : '#64748b' }}>
                            <span>{n.label}</span><span>{dist[n.id] === Infinity || dist[n.id] === undefined ? '∞' : dist[n.id]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 13, color: msg.includes('deleted') || msg.includes('removed') ? '#ef4444' : '#60a5fa', fontWeight: 700, background: '#0d0d14' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
                    <svg onClick={handleSvgClick} width={700} height={400} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e', cursor: running ? 'default' : 'crosshair' }}>
                        {edges.map(([a, b, w], i) => {
                            const na = nodes.find(n => n.id === a);
                            const nb = nodes.find(n => n.id === b);
                            if (!na || !nb) return null;
                            const ip = isPathEdge(a, b);
                            return (<g key={i}>
                                <line
                                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                                    stroke={ip ? '#f59e0b' : '#334155'}
                                    strokeWidth={ip ? 5 : 2}
                                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                                />
                                <rect x={(na.x + nb.x) / 2 - 10} y={(na.y + nb.y) / 2 - 10} width={20} height={20} fill="#111118" rx={10} />
                                <text x={(na.x + nb.x) / 2} y={(na.y + nb.y) / 2} fill={ip ? '#f59e0b' : "#94a3b8"} fontSize={11} fontWeight={800} textAnchor="middle" dominantBaseline="middle">{w}</text>
                            </g>);
                        })}
                        {nodes.map(n => {
                            const isVis = visited.includes(n.id);
                            const isSel = selectedNode === n.id;
                            return (<g key={n.id} onClick={(e) => handleNodeClick(e, n.id)} onContextMenu={(e) => handleNodeContextMenu(e, n.id)} style={{ cursor: 'pointer' }}>
                                <circle
                                    cx={n.x} cy={n.y} r={20}
                                    fill={isVis ? '#8b5cf6' : isSel ? '#3b82f6' : '#1e1e2e'}
                                    stroke={isVis ? '#c084fc' : isSel ? '#60a5fa' : '#334155'}
                                    strokeWidth={isSel ? 3 : 2}
                                    style={{ transition: 'all 0.3s' }}
                                />
                                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill={isVis || isSel ? '#fff' : '#e2e8f0'} fontSize={13} fontWeight={800}>{n.label}</text>
                            </g>);
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
