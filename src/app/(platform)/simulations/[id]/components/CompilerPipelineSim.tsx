'use client';
import React, { useState } from 'react';

export function CompilerPipelineSim() {
    const [source, setSource] = useState('let x = 5 + 3;');
    const [stage, setStage] = useState(-1);
    const [tokens, setTokens] = useState<string[]>([]);
    const [ast, setAst] = useState('');
    const [codeOut, setCodeOut] = useState('');
    const [msg, setMsg] = useState('Enter source and press Compile');
    const [running, setRunning] = useState(false);
    const compile = async () => {
        setRunning(true); setStage(0); setMsg('Lexing…');
        const toks = source.match(/[a-zA-Z_]\w*|[0-9]+|[+\-*/=;(){}]/g) || [];
        await new Promise(r => setTimeout(r, 800));
        setTokens(toks); setStage(1); setMsg('Parsing…');
        await new Promise(r => setTimeout(r, 800));
        setAst(`Program\n └ VarDecl\n   ├ Id:"${toks[1] || 'x'}"\n   └ BinExpr(+)\n     ├ ${toks[3] || '?'}\n     └ ${toks[5] || '?'}`);
        setStage(2); setMsg('Code Gen…');
        await new Promise(r => setTimeout(r, 800));
        setCodeOut(`LOAD ${toks[3] || '?'}\nADD ${toks[5] || '?'}\nSTORE ${toks[1] || 'x'}\nHALT`);
        setStage(3); setMsg('✓ Done'); setRunning(false);
    };
    const labels = ['Lexer', 'Parser', 'Code Gen'];
    const colors = ['#3b82f6', '#f59e0b', '#22c55e'];
    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 210, background: '#0d0d14', borderRight: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Source</div>
                <textarea value={source} onChange={e => setSource(e.target.value)} rows={3} style={{ padding: '8px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 12, fontFamily: 'monospace', outline: 'none', resize: 'none' }} />
                <button onClick={compile} disabled={running} style={{ padding: '10px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>▶ Compile</button>
                {labels.map((s, i) => (
                    <div key={i} style={{ padding: '5px 10px', borderRadius: 6, background: stage >= i ? `${colors[i]}18` : '#111118', border: `1px solid ${stage >= i ? colors[i] + '44' : '#1e1e2e'}`, fontSize: 11, fontWeight: 700, color: stage >= i ? colors[i] : '#475569' }}>
                        {stage > i ? '✓' : stage === i ? '⟩' : '○'} {s}
                    </div>
                ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', fontSize: 12, color: '#94a3b8' }}>{msg}</div>
                <div style={{ flex: 1, padding: 20, display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, background: '#0d0d14', borderRadius: 10, border: '1px solid #1e1e2e', padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 6 }}>Tokens</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{tokens.map((t, i) => <span key={i} style={{ padding: '2px 6px', borderRadius: 4, background: '#111118', border: '1px solid #1e1e2e', color: '#e2e8f0', fontSize: 11, fontFamily: 'monospace' }}>{t}</span>)}</div>
                    </div>
                    <div style={{ flex: 1, background: '#0d0d14', borderRadius: 10, border: '1px solid #1e1e2e', padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 6 }}>AST</div>
                        <pre style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{ast || '—'}</pre>
                    </div>
                    <div style={{ flex: 1, background: '#0d0d14', borderRadius: 10, border: '1px solid #1e1e2e', padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', marginBottom: 6 }}>Output</div>
                        <pre style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{codeOut || '—'}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
