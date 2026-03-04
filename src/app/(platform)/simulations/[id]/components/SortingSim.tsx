'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

export function SortingSim() {
    const [inputStr, setInputStr] = useState("50, 20, 70, 40, 90, 10, 60, 30");
    const [arr, setArr] = useState<number[]>([]);
    const [highlight, setHighlight] = useState<number[]>([]);
    const [sorted, setSorted] = useState<number[]>([]);
    const [algo, setAlgo] = useState('bubble');
    const [speed, setSpeed] = useState(70);
    const [running, setRunning] = useState(false);
    const [step, setStep] = useState(0);
    const [msg, setMsg] = useState('Ready to sort.');
    const stopRef = useRef(false);

    const parseInput = useCallback(() => {
        const a = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        setArr(a); setHighlight([]); setSorted([]); setStep(0); setRunning(false);
        return a;
    }, [inputStr]);

    useEffect(() => { parseInput(); }, [parseInput]);

    const generateRandom = () => {
        const size = Math.floor(Math.random() * 10) + 10;
        const a = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
        setInputStr(a.join(', '));
    };

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    const run = async () => {
        stopRef.current = false; setRunning(true); setSorted([]); setHighlight([]);
        const a = [...arr];
        const sp = Math.max(2, 500 - speed * 5);
        let s = 0;

        const update = (highlightIndices: number[], currentStep: number) => {
            setArr([...a]);
            setHighlight(highlightIndices);
            setStep(currentStep);
        };

        if (algo === 'bubble') {
            setMsg('Bubble Sort: Swapping adjacent elements...');
            for (let i = 0; i < a.length && !stopRef.current; i++) {
                for (let j = 0; j < a.length - i - 1 && !stopRef.current; j++) {
                    s++; update([j, j + 1], s);
                    if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; setArr([...a]); }
                    await delay(sp);
                }
                setSorted(prev => [...prev, a.length - 1 - i]);
            }
        } else if (algo === 'selection') {
            setMsg('Selection Sort: Finding the minimum element...');
            for (let i = 0; i < a.length && !stopRef.current; i++) {
                let minIdx = i;
                for (let j = i + 1; j < a.length && !stopRef.current; j++) {
                    s++; update([minIdx, j], s);
                    if (a[j] < a[minIdx]) minIdx = j;
                    await delay(sp);
                }
                [a[i], a[minIdx]] = [a[minIdx], a[i]];
                setSorted(prev => [...prev, i]);
                update([], s);
            }
        } else if (algo === 'insertion') {
            setMsg('Insertion Sort: Building sorted portion...');
            for (let i = 1; i < a.length && !stopRef.current; i++) {
                const key = a[i]; let j = i - 1;
                while (j >= 0 && a[j] > key && !stopRef.current) {
                    s++; update([j, j + 1], s);
                    a[j + 1] = a[j]; j--;
                    await delay(sp);
                }
                a[j + 1] = key; update([], s);
                const done = []; for (let k = 0; k <= i; k++) done.push(k); setSorted(done);
            }
        } else if (algo === 'quick') {
            setMsg('Quick Sort: Partitioning around pivot...');
            const qs = async (lo: number, hi: number) => {
                if (lo >= hi || stopRef.current) {
                    if (lo === hi) setSorted(p => [...p, lo]);
                    return;
                }
                const pivot = a[hi]; let i = lo - 1;
                for (let j = lo; j < hi && !stopRef.current; j++) {
                    s++; update([j, hi], s);
                    if (a[j] < pivot) { i++;[a[i], a[j]] = [a[j], a[i]]; }
                    await delay(sp);
                }
                [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
                setSorted(prev => [...prev, i + 1]);
                await qs(lo, i); await qs(i + 2, hi);
            };
            await qs(0, a.length - 1);
        } else if (algo === 'merge') {
            setMsg('Merge Sort: Dividing and merging portions...');
            const ms = async (lo: number, hi: number) => {
                if (lo >= hi || stopRef.current) return;
                const mid = Math.floor((lo + hi) / 2);
                await ms(lo, mid); await ms(mid + 1, hi);
                const l = a.slice(lo, mid + 1), r = a.slice(mid + 1, hi + 1);
                let i_l = 0, j_r = 0, k = lo;
                while (i_l < l.length && j_r < r.length && !stopRef.current) {
                    s++; update([k], s);
                    a[k++] = l[i_l] <= r[j_r] ? l[i_l++] : r[j_r++];
                    await delay(sp);
                }
                while (i_l < l.length && !stopRef.current) { a[k++] = l[i_l++]; update([k - 1], s); await delay(sp / 2); }
                while (j_r < r.length && !stopRef.current) { a[k++] = r[j_r++]; update([k - 1], s); await delay(sp / 2); }
            };
            await ms(0, a.length - 1);
            const all = a.map((_, idx) => idx); setSorted(all);
        } else if (algo === 'heap') {
            setMsg('Heap Sort: Building max heap...');
            const heapify = async (n: number, i: number) => {
                let largest = i, left = 2 * i + 1, right = 2 * i + 2;
                if (left < n && a[left] > a[largest]) largest = left;
                if (right < n && a[right] > a[largest]) largest = right;
                if (largest !== i && !stopRef.current) {
                    s++; update([i, largest], s);
                    [a[i], a[largest]] = [a[largest], a[i]];
                    await delay(sp);
                    await heapify(n, largest);
                }
            };
            for (let i = Math.floor(a.length / 2) - 1; i >= 0 && !stopRef.current; i--) await heapify(a.length, i);
            for (let i = a.length - 1; i > 0 && !stopRef.current; i--) {
                [a[0], a[i]] = [a[i], a[0]]; setSorted(p => [...p, i]);
                await heapify(i, 0);
            }
            setSorted(a.map((_, idx) => idx));
        }

        setHighlight([]);
        setRunning(false);
        if (!stopRef.current) { setMsg('Sorting complete.'); }
    };

    const stop = () => { stopRef.current = true; setRunning(false); setMsg('Simulation stopped.'); };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 12, alignItems: 'center', background: '#0d0d14' }}>
                <button onClick={running ? stop : run} style={{ padding: '7px 18px', background: running ? '#ef4444' : '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {running ? 'Stop' : 'Run Visualizer'}
                </button>
                <button onClick={generateRandom} disabled={running} style={{ padding: '7px 14px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Generate Random</button>
                <div style={{ width: 1, height: 20, background: '#1e1e2e' }} />
                <div style={{ display: 'flex', gap: 6, background: '#111118', padding: 4, borderRadius: 10, border: '1px solid #1e1e2e' }}>
                    {['bubble', 'selection', 'insertion', 'quick', 'merge', 'heap'].map(id => (
                        <button key={id} onClick={() => setAlgo(id)} disabled={running} style={{ padding: '5px 12px', background: algo === id ? '#312e81' : 'transparent', color: algo === id ? '#a5b4fc' : '#475569', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>{id}</button>
                    ))}
                </div>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 13, color: '#64748b' }}>Comparisons: <span style={{ color: '#6366f1', fontWeight: 800 }}>{step}</span></div>
            </div>
            <div style={{ flex: 1, display: 'flex', background: '#0a0a0f' }}>
                <div style={{ width: 280, borderRight: '1px solid #1e1e2e', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Simulation Speed</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 10, color: '#64748b' }}>Slow</span>
                            <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ flex: 1, accentColor: '#6366f1' }} />
                            <span style={{ fontSize: 10, color: '#64748b' }}>Fast</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Input Dataset</div>
                        <textarea value={inputStr} disabled={running} onChange={e => setInputStr(e.target.value)} style={{ flex: 1, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16, color: '#e2e8f0', fontSize: 13, fontFamily: 'monospace', resize: 'none', outline: 'none' }} placeholder="e.g. 10, 50, 30..." />
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 40 }}>
                    <div style={{ marginBottom: 40, background: 'rgba(99,102,241,0.05)', padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.1)', alignSelf: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#a5b4fc', textAlign: 'center' }}>{msg}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, paddingBottom: 60 }}>
                        {arr.map((val, i) => {
                            const maxVal = Math.max(...arr, 1);
                            const height = (val / maxVal) * 100;
                            const isHighlight = highlight.includes(i);
                            const isSorted = sorted.includes(i);
                            return (
                                <div key={i} style={{ flex: 1, maxWidth: 45, height: `${height}%`, background: isHighlight ? '#f43f5e' : (isSorted ? '#10b981' : 'linear-gradient(to top, #312e81, #6366f1)'), borderRadius: '6px 6px 2px 2px', transition: 'height 0.3s, background 0.15s', position: 'relative' }}>
                                    <div style={{ position: 'absolute', bottom: -30, width: '100%', textAlign: 'center', fontSize: 11, color: isHighlight ? '#f43f5e' : (isSorted ? '#10b981' : '#64748b'), fontWeight: 800 }}>{val}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
