'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export function BinarySearchSim() {
    const [inputStr, setInputStr] = useState('3, 7, 11, 15, 19, 24, 29, 33, 38, 42, 47, 52, 58, 63, 69, 74, 80, 85, 91, 97');
    const [arr, setArr] = useState<number[]>([]);
    const [target, setTarget] = useState(42);
    const [state, setState] = useState({ left: -1, right: -1, mid: -1, found: -1, step: 0, done: false });
    const [msg, setMsg] = useState('Enter a sorted array and target.');

    const parseArray = useCallback(() => {
        const parsed = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b);
        setArr(parsed);
        setState({ left: 0, right: parsed.length - 1, mid: -1, found: -1, step: 0, done: false });
        setMsg(`Array initialized with ${parsed.length} elements. Press Step to begin search.`);
    }, [inputStr]);

    useEffect(() => { parseArray(); }, [parseArray]);

    const stepSearch = () => {
        if (state.done) return;

        let { left, right, mid, found, step } = state;
        step++;

        // First step or narrow down
        mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            found = mid;
            setState({ ...state, mid, found, step, done: true });
            setMsg(`✓ Value ${target} found at index ${mid}!`);
        } else if (left >= right) {
            setState({ ...state, mid, step, done: true });
            setMsg(`✗ Value ${target} not found in the array.`);
        } else {
            if (arr[mid] < target) {
                left = mid + 1;
                setMsg(`Step ${step}: ${arr[mid]} < ${target}. Search right half [${left}, ${right}].`);
            } else {
                right = mid - 1;
                setMsg(`Step ${step}: ${arr[mid]} > ${target}. Search left half [${left}, ${right}].`);
            }
            setState({ ...state, left, right, mid, step });
        }
    };

    const reset = () => parseArray();

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 260, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Target Search</div>
                    <input type="number" value={target} onChange={e => { setTarget(+e.target.value); reset(); }} style={{ width: '100%', padding: '10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, outline: 'none' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Dataset</div>
                    <textarea value={inputStr} onChange={e => setInputStr(e.target.value)} style={{ flex: 1, padding: '12px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 10, color: '#cbd5e1', fontSize: 12, fontFamily: 'monospace', outline: 'none', resize: 'none' }} />
                    <div style={{ fontSize: 10, color: '#475569' }}>Array will be auto-sorted upon entry.</div>
                </div>

                <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: 16 }}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Current Range</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>[{state.left}, {state.right}]</div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 12, background: '#0d0d14' }}>
                    <button onClick={stepSearch} disabled={state.done} style={{ padding: '6px 16px', background: state.done ? '#1e1e2e' : '#f97316', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Next Step</button>
                    <button onClick={reset} style={{ padding: '6px 12px', background: '#111118', color: '#94a3b8', border: '1px solid #1e1e2e', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Reset</button>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#64748b' }}>Steps Exhausted: <span style={{ color: '#f97316', fontWeight: 800 }}>{state.step}</span></div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 40 }}>
                    <div style={{ marginBottom: 40, alignSelf: 'center', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', padding: '10px 20px', borderRadius: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fdba74' }}>{msg}</div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                        {arr.map((v, i) => {
                            const isActive = i >= state.left && i <= state.right;
                            const isMid = i === state.mid;
                            const isFound = i === state.found;

                            return (
                                <motion.div
                                    key={i}
                                    animate={{ scale: isMid ? 1.1 : 1, opacity: isActive ? 1 : 0.2 }}
                                    style={{
                                        width: 44, height: 44,
                                        background: isFound ? '#22c55e' : (isMid ? '#f97316' : '#111118'),
                                        border: `2px solid ${isMid ? '#fb923c' : (isActive ? '#334155' : '#1e1e2e')}`,
                                        borderRadius: 8,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                        boxShadow: isMid ? '0 0 15px rgba(249,115,22,0.3)' : 'none'
                                    }}
                                >
                                    <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? '#f8fafc' : '#475569' }}>{v}</div>
                                    <div style={{ fontSize: 9, color: '#64748b', position: 'absolute', bottom: -18 }}>{i}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
