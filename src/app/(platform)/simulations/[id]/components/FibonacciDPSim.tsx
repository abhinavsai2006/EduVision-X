'use client';
import React, { useState } from 'react';

export function FibonacciDPSim() {
    const [n, setN] = useState(6);
    const [dp, setDp] = useState<number[]>([]);
    const [running, setRunning] = useState(false);
    const [msg, setMsg] = useState('Run Tabulation (Bottom-Up) DP');

    const run = async () => {
        setRunning(true);
        let arr = Array(n + 1).fill(-1);
        setDp(arr); setMsg('Initialize DP table'); await new Promise(r => setTimeout(r, 600));

        arr[0] = 0; setDp([...arr]); setMsg('Base case: dp[0] = 0'); await new Promise(r => setTimeout(r, 800));
        if (n > 0) { arr[1] = 1; setDp([...arr]); setMsg('Base case: dp[1] = 1'); await new Promise(r => setTimeout(r, 800)); }

        for (let i = 2; i <= n; i++) {
            setMsg(`Calculating dp[${i}] = dp[${i - 1}] + dp[${i - 2}] (${arr[i - 1]} + ${arr[i - 2]})`);
            await new Promise(r => setTimeout(r, 1000));
            arr[i] = arr[i - 1] + arr[i - 2];
            setDp([...arr]);
        }
        setMsg(`Done! Fib(${n}) = ${arr[n]}`); setRunning(false);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <label style={{ fontSize: 11, color: '#94a3b8' }}>N: <input type="number" min="1" max="15" value={n} onChange={e => { setN(+e.target.value); setDp([]); }} style={{ width: 50, padding: '4px', background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', borderRadius: 4 }} disabled={running} /></label>
                <button onClick={run} disabled={running} style={{ padding: '6px 14px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Run Tabulation</button>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {Array.from({ length: n + 1 }).map((_, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
                            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>dp[{i}]</div>
                            <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: dp[i] !== undefined && dp[i] !== -1 ? '#f97316' : '#111118', color: dp[i] !== undefined && dp[i] !== -1 ? '#fff' : '#475569', border: '1px solid #1e1e2e', borderRadius: 8, fontSize: 16, fontWeight: 800, transition: 'all 0.3s' }}>
                                {dp[i] !== undefined && dp[i] !== -1 ? dp[i] : '?'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
