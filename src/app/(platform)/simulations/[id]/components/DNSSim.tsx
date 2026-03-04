'use client';
import React, { useState } from 'react';

export function DNSSim() {
    const [domain, setDomain] = useState('www.google.com');
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [lines, setLines] = useState<{ from: string, to: string, msg: string, color: string }[]>([]);
    const [running, setRunning] = useState(false);

    const run = async () => {
        if (!domain.includes('.')) {
            setLines([{ from: 'browser', to: 'browser', msg: 'Invalid domain. Needs a dot (e.g. .com).', color: '#ef4444' }]);
            return;
        }
        setRunning(true); setLines([]);

        let tld = '.' + domain.split('.').pop();
        const hash = [...domain].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const ip = `${(hash * 13) % 254 + 1}.${(hash * 37) % 254 + 1}.${(hash * 7) % 254 + 1}.${hash % 254 + 1}`;

        const steps = [
            { from: 'browser', to: 'resolver', msg: `1. Query: ${domain}`, node: 'resolver' },
            { from: 'resolver', to: 'root', msg: `2. Query: ${tld} TLD to Root Server`, node: 'root' },
            { from: 'root', to: 'resolver', msg: `3. Root says: Ask ${tld} TLD server`, node: 'resolver' },
            { from: 'resolver', to: 'tld', msg: `4. Query: ${domain} to ${tld} TLD`, node: 'tld' },
            { from: 'tld', to: 'resolver', msg: '5. TLD says: Ask Name Servers (NS)', node: 'resolver' },
            { from: 'resolver', to: 'auth', msg: '6. Query: IP to Auth NS', node: 'auth' },
            { from: 'auth', to: 'resolver', msg: `7. Auth says: IP is ${ip}`, node: 'resolver' },
            { from: 'resolver', to: 'browser', msg: `8. Answer: ${ip} (Cached)`, node: 'browser' },
        ];

        let currentLines = [];
        for (const step of steps) {
            setActiveNode(step.node);
            currentLines.push({ from: step.from, to: step.to, msg: step.msg, color: '#3b82f6' });
            setLines([...currentLines]);
            await new Promise(r => setTimeout(r, 1000));
        }
        setActiveNode(null); setRunning(false);
    };

    const pos = {
        browser: { x: 100, y: 150 },
        resolver: { x: 300, y: 150 },
        root: { x: 500, y: 50 },
        tld: { x: 500, y: 150 },
        auth: { x: 500, y: 250 },
    };

    const drawNode = (id: string, label: string, color: string) => (
        <g transform={`translate(${pos[id as keyof typeof pos].x}, ${pos[id as keyof typeof pos].y})`}>
            <rect x="-40" y="-30" width="80" height="60" rx="8" fill={activeNode === id ? `${color}22` : '#1e1e2e'} stroke={activeNode === id ? color : '#334155'} strokeWidth="2" style={{ transition: 'all 0.3s' }} />
            <text y="5" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">{label}</text>
        </g>
    );

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <input
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="e.g. google.com"
                    style={{ padding: '6px 12px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', width: 200 }}
                    disabled={running}
                />
                <button
                    onClick={run}
                    disabled={running}
                    style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                    ▶ Trace DNS
                </button>
            </div>
            <div style={{ flex: 1, display: 'flex', background: '#0a0a0f' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <svg width="100%" height="100%">
                        <line x1={pos.browser.x} y1={pos.browser.y} x2={pos.resolver.x} y2={pos.resolver.y} stroke="#1e1e2e" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={pos.resolver.x} y1={pos.resolver.y} x2={pos.root.x} y2={pos.root.y} stroke="#1e1e2e" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={pos.resolver.x} y1={pos.resolver.y} x2={pos.tld.x} y2={pos.tld.y} stroke="#1e1e2e" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={pos.resolver.x} y1={pos.resolver.y} x2={pos.auth.x} y2={pos.auth.y} stroke="#1e1e2e" strokeWidth="2" strokeDasharray="4 4" />

                        {drawNode('browser', 'Browser', '#f59e0b')}
                        {drawNode('resolver', 'ISP Resolver', '#22c55e')}
                        {drawNode('root', 'Root (.)', '#ef4444')}
                        {drawNode('tld', `TLD (.${domain.split('.').pop()})`, '#8b5cf6')}
                        {drawNode('auth', 'Auth NS', '#ec4899')}
                    </svg>
                </div>
                <div style={{ width: 320, borderLeft: '1px solid #1e1e2e', background: '#0d0d14', padding: 16, overflowY: 'auto' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5 }}>DNS Packet Log</div>
                    {lines.map((l, i) => (
                        <div key={i} style={{ padding: '10px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ color: l.color, fontSize: 10, fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>{l.from} → {l.to}</div>
                            <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>{l.msg}</div>
                        </div>
                    ))}
                    {lines.length === 0 && <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>Waiting for trace...</div>}
                </div>
            </div>
        </div>
    );
}
