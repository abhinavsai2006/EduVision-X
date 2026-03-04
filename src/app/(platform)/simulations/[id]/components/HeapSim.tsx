'use client';
import React, { useState } from 'react';

export function HeapSim() {
    const [heap, setHeap] = useState<number[]>([10, 20, 15, 40, 50, 100, 25]);
    const [isMinConfig, setIsMin] = useState(true);
    const [inputVal, setInputVal] = useState('30');
    const [msg, setMsg] = useState('Heap initialized');

    const getParent = (i: number) => Math.floor((i - 1) / 2);
    const getLeft = (i: number) => 2 * i + 1;
    const getRight = (i: number) => 2 * i + 2;
    const compare = (a: number, b: number) => isMinConfig ? a < b : a > b;

    const insert = async () => {
        if (!inputVal) return;
        const val = +inputVal;
        let newHeap = [...heap, val];
        let i = newHeap.length - 1;
        setHeap([...newHeap]); setMsg(`Inserted ${val} at index ${i}`);
        await new Promise(r => setTimeout(r, 600));

        while (i > 0 && compare(newHeap[i], newHeap[getParent(i)])) {
            setMsg(`Swapping ${newHeap[i]} with parent ${newHeap[getParent(i)]}`);
            const temp = newHeap[getParent(i)];
            newHeap[getParent(i)] = newHeap[i];
            newHeap[i] = temp;
            i = getParent(i);
            setHeap([...newHeap]);
            await new Promise(r => setTimeout(r, 600));
        }
        setMsg('Heap property restored');
    };

    const extract = async () => {
        if (heap.length === 0) return;
        if (heap.length === 1) { setHeap([]); setMsg(`Extracted ${heap[0]}`); return; }

        const root = heap[0];
        let newHeap = [...heap];
        newHeap[0] = newHeap.pop()!;
        setHeap([...newHeap]);
        setMsg(`Extracted root ${root}, moved last element ${newHeap[0]} to root`);
        await new Promise(r => setTimeout(r, 800));

        let i = 0;
        while (true) {
            let l = getLeft(i);
            let r = getRight(i);
            let target = i;
            if (l < newHeap.length && compare(newHeap[l], newHeap[target])) target = l;
            if (r < newHeap.length && compare(newHeap[r], newHeap[target])) target = r;
            if (target !== i) {
                setMsg(`Swapping ${newHeap[i]} with child ${newHeap[target]}`);
                const temp = newHeap[i]; newHeap[i] = newHeap[target]; newHeap[target] = temp;
                i = target;
                setHeap([...newHeap]);
                await new Promise(resolve => setTimeout(resolve, 600));
            } else {
                break;
            }
        }
        setMsg('Heap property restored');
    };

    const drawNode = (i: number, x: number, y: number, levelX: number) => {
        if (i >= heap.length) return null;
        const l = getLeft(i); const r = getRight(i);
        return (
            <g key={i}>
                {l < heap.length && <line x1={x} y1={y} x2={x - levelX} y2={y + 50} stroke="#1e1e2e" strokeWidth={2} />}
                {r < heap.length && <line x1={x} y1={y} x2={x + levelX} y2={y + 50} stroke="#1e1e2e" strokeWidth={2} />}
                <circle cx={x} cy={y} r={16} fill="#22c55e" />
                <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>{heap[i]}</text>
                {drawNode(l, x - levelX, y + 50, levelX / 2)}
                {drawNode(r, x + levelX, y + 50, levelX / 2)}
            </g>
        );
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <select value={isMinConfig ? 'min' : 'max'} onChange={e => { setIsMin(e.target.value === 'min'); setHeap([]); setMsg('Heap cleared to switch type'); }} style={{ padding: '6px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }}>
                    <option value="min">Min-Heap</option><option value="max">Max-Heap</option>
                </select>
                <div style={{ width: 1, height: 16, background: '#1e1e2e' }} />
                <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ padding: '6px', width: 60, background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} />
                <button onClick={insert} style={{ padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Insert</button>
                <button onClick={extract} disabled={heap.length === 0} style={{ padding: '6px 12px', background: '#111118', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Extract Root</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="600" height="300" style={{ marginTop: 20 }}>
                    {heap.length > 0 && drawNode(0, 300, 30, 120)}
                </svg>
                <div style={{ display: 'flex', gap: 4, marginTop: 20, padding: 10, background: '#0d0d14', borderRadius: 8, border: '1px solid #1e1e2e' }}>
                    {heap.map((v, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
                            <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>{i}</div>
                            <div style={{ padding: '6px 8px', background: '#fff', color: '#0f0f17', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>{v}</div>
                        </div>
                    ))}
                    {heap.length === 0 && <div style={{ color: '#475569', fontSize: 11 }}>Heap empty</div>}
                </div>
            </div>
        </div>
    );
}
