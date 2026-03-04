'use client';
import React, { useState } from 'react';

export function KMPSim() {
    const [text, setText] = useState('ababcabcabababd');
    const [pattern, setPattern] = useState('ababd');
    const [lps, setLps] = useState<number[]>([]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(0);
    const [matches, setMatches] = useState<number[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Enter text and pattern, then Run KMP');

    const computeLPS = (pat: string) => {
        let m = pat.length;
        let lpsArr = Array(m).fill(0);
        let len = 0;
        let i = 1;
        while (i < m) {
            if (pat[i] === pat[len]) {
                len++;
                lpsArr[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lpsArr[len - 1];
                } else {
                    lpsArr[i] = 0;
                    i++;
                }
            }
        }
        return lpsArr;
    };

    const run = async () => {
        setRunning(true);
        setMatches([]);
        setI(0); setJ(0);
        const lpsArr = computeLPS(pattern);
        setLps(lpsArr);
        setMsg('LPS Table computed. Starting search...');
        await new Promise(r => setTimeout(r, 1000));

        let txtIdx = 0;
        let patIdx = 0;
        while (txtIdx < text.length) {
            setI(txtIdx); setJ(patIdx);
            if (text[txtIdx] === pattern[patIdx]) {
                txtIdx++;
                patIdx++;
                setMsg(`Match at text[${txtIdx - 1}] and pattern[${patIdx - 1}]`);
            }
            if (patIdx === pattern.length) {
                setMatches(prev => [...prev, txtIdx - patIdx]);
                setMsg(`✓ Pattern found at index ${txtIdx - patIdx}`);
                patIdx = lpsArr[patIdx - 1];
                await new Promise(r => setTimeout(r, 1000));
            } else if (txtIdx < text.length && text[txtIdx] !== pattern[patIdx]) {
                if (patIdx !== 0) {
                    patIdx = lpsArr[patIdx - 1];
                } else {
                    txtIdx++;
                }
                setMsg(`Mismatch! Using LPS to skip shifts.`);
            }
            await new Promise(r => setTimeout(r, 300));
        }
        setMsg('Search complete.');
        setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#0a0a0f' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 16, alignItems: 'center', background: '#0d0d14' }}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Text" style={{ padding: '8px 12px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 13, flex: 2 }} />
                <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Pattern" style={{ padding: '8px 12px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#fff', fontSize: 13, flex: 1 }} />
                <button onClick={run} disabled={running} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Run KMP</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', gap: 30 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {text.split('').map((char, idx) => (
                        <div key={idx} style={{ width: 32, height: 40, background: i === idx ? '#6366f1' : matches.some(m => idx >= m && idx < m + pattern.length) ? '#22c55e' : '#111118', border: '1px solid #1e1e2e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>{char}</div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                    {pattern.split('').map((char, idx) => (
                        <div key={idx} style={{ width: 32, height: 40, background: j === idx ? '#f59e0b' : '#111118', border: '1px solid #1e1e2e', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                            <div>{char}</div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>{lps[idx]}</div>
                        </div>
                    ))}
                    <div style={{ marginLeft: 10, alignSelf: 'center', fontSize: 11, color: '#64748b' }}>LPS Table (Prefix Function)</div>
                </div>
            </div>
        </div>
    );
}
