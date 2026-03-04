'use client';
import React, { useState } from 'react';

export function BSTSim() {
    type BSTNode = { val: number; left: BSTNode | null; right: BSTNode | null };
    const [root, setRoot] = useState<BSTNode | null>(null);
    const [insertVal, setInsertVal] = useState('');
    const [highlight, setHighlight] = useState<number[]>([]);
    const [msg, setMsg] = useState('Insert values to build the BST');
    const [traversal, setTraversal] = useState<number[]>([]);

    const insert = (node: BSTNode | null, val: number): BSTNode => {
        if (!node) return { val, left: null, right: null };
        if (val < node.val) return { ...node, left: insert(node.left, val) };
        if (val > node.val) return { ...node, right: insert(node.right, val) };
        return node;
    };

    const handleInsert = () => {
        const v = parseInt(insertVal); if (isNaN(v)) return;
        setRoot(prev => insert(prev, v));
        setInsertVal(''); setMsg(`Inserted ${v}`);
        setHighlight([v]); setTimeout(() => setHighlight([]), 800);
    };

    const inorder = (node: BSTNode | null, acc: number[]): number[] => {
        if (!node) return acc;
        inorder(node.left, acc); acc.push(node.val); inorder(node.right, acc);
        return acc;
    };
    const preorder = (node: BSTNode | null, acc: number[]): number[] => {
        if (!node) return acc;
        acc.push(node.val); preorder(node.left, acc); preorder(node.right, acc);
        return acc;
    };

    const doTraversal = (type: string) => {
        if (!root) return;
        const result = type === 'inorder' ? inorder(root, []) : preorder(root, []);
        setTraversal(result);
        setMsg(`${type}: ${result.join(' → ')}`);
    };

    // Flatten tree for SVG rendering
    type FlatNode = { val: number; x: number; y: number; px?: number; py?: number };
    const flatten = (node: BSTNode | null, x: number, y: number, dx: number, parent?: { x: number; y: number }): FlatNode[] => {
        if (!node) return [];
        const self: FlatNode = { val: node.val, x, y, px: parent?.x, py: parent?.y };
        return [self, ...flatten(node.left, x - dx, y + 50, dx * 0.55, { x, y }), ...flatten(node.right, x + dx, y + 50, dx * 0.55, { x, y })];
    };
    const flatNodes = flatten(root, 300, 40, 120);

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 200, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Insert Value</div>
                <input value={insertVal} onChange={e => setInsertVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} placeholder="e.g. 42" style={{ padding: '8px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
                <button onClick={handleInsert} style={{ padding: '8px', borderRadius: 8, border: 'none', background: '#10b981', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Insert</button>
                <button onClick={() => { setRoot(null); setTraversal([]); setMsg('Tree cleared'); }} style={{ padding: '6px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>Clear Tree</button>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 8 }}>Traversal</div>
                {['inorder', 'preorder'].map(t => (
                    <button key={t} onClick={() => doTraversal(t)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
                ))}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #1e1e2e', paddingTop: 10 }}>
                    <div style={{ fontSize: 10, color: '#475569' }}>Nodes</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0' }}>{flatNodes.length}</div>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                    <svg width={600} height={350} style={{ background: '#111118', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                        {flatNodes.filter(n => n.px !== undefined).map((n, i) => (
                            <line key={i} x1={n.px!} y1={n.py!} x2={n.x} y2={n.y} stroke="#1e1e2e" strokeWidth={2} />
                        ))}
                        {flatNodes.map((n, i) => {
                            const isHl = highlight.includes(n.val);
                            const tIdx = traversal.indexOf(n.val);
                            return (<g key={i}>
                                <circle cx={n.x} cy={n.y} r={18} fill={isHl ? '#10b981' : tIdx >= 0 ? '#6366f1' : '#111118'} stroke={isHl ? '#34d399' : tIdx >= 0 ? '#818cf8' : '#1e1e2e'} strokeWidth={2} />
                                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>{n.val}</text>
                                {tIdx >= 0 && <text x={n.x} y={n.y - 24} textAnchor="middle" fill="#818cf8" fontSize={9} fontWeight={700}>#{tIdx + 1}</text>}
                            </g>);
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
