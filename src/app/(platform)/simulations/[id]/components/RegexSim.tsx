'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RegexSim() {
    const [regex, setRegex] = useState('a*b+c');
    const [text, setText] = useState('aaabbbc');
    const [index, setIndex] = useState(-1);
    const [matching, setMatching] = useState(false);
    const [result, setResult] = useState<boolean | null>(null);

    // Simple simulation of step-by-step matching logic
    // In a real engine this would be an NFA/DFA traversal
    const run = async () => {
        setMatching(true);
        setResult(null);
        let currentIdx = 0;

        // Very simplified literal + basic quantifier matching for visualization
        // Not a real engine, but a mockup of how one steps through
        for (let i = 0; i <= text.length; i++) {
            setIndex(i);
            await new Promise(r => setTimeout(r, 400));
        }

        try {
            const re = new RegExp(`^${regex}$`);
            setResult(re.test(text));
        } catch (e) {
            setResult(false);
        }
        setMatching(false);
    };

    const tokens = regex.split('').map((char, i) => ({
        char,
        type: ['*', '+', '?'].includes(char) ? 'quantifier' : char === '|' ? 'operator' : 'literal'
    }));

    return (
        <div style={{ padding: 20, background: '#0a0a0f', color: '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 30, background: '#0d0d14', padding: 20, borderRadius: 12, border: '1px solid #1e1e2e' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Regular Expression</label>
                    <input
                        value={regex}
                        onChange={e => setRegex(e.target.value)}
                        placeholder="e.g. a*b+c"
                        style={{ width: '100%', padding: '12px', background: '#0a0a0f', border: '1px solid #334155', borderRadius: 8, color: '#f59e0b', fontFamily: 'monospace', fontSize: 16, fontWeight: 700, outline: 'none' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Test String</label>
                    <input
                        value={text}
                        onChange={e => { setText(e.target.value); setIndex(-1); setResult(null); }}
                        style={{ width: '100%', padding: '12px', background: '#0a0a0f', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontFamily: 'monospace', fontSize: 16, outline: 'none' }}
                    />
                </div>
                <button
                    onClick={run}
                    disabled={matching}
                    style={{ alignSelf: 'flex-end', padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', opacity: matching ? 0.5 : 1 }}
                >
                    {matching ? 'Matching...' : 'Match'}
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
                {/* Regex Token View */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {tokens.map((t, i) => (
                        <div key={i} style={{
                            padding: '10px 15px',
                            background: t.type === 'literal' ? '#1e1e2e' : '#312e81',
                            border: '1px solid #3730a3',
                            borderRadius: 6,
                            color: t.type === 'literal' ? '#e2e8f0' : '#fbbf24',
                            fontFamily: 'monospace',
                            fontSize: 20,
                            fontWeight: 800
                        }}>
                            {t.char}
                        </div>
                    ))}
                </div>

                {/* String Pointer View */}
                <div style={{ position: 'relative', display: 'flex', gap: 2, background: '#111118', padding: '10px', borderRadius: 12, border: '1px solid #1e1e2e' }}>
                    {text.split('').map((char, i) => (
                        <div key={i} style={{
                            width: 50, height: 60,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: i === index ? '#f59e0b22' : 'transparent',
                            border: `2px solid ${i === index ? '#f59e0b' : '#1e1e2e'}`,
                            borderRadius: 8,
                            color: i === index ? '#f59e0b' : '#94a3b8',
                            fontSize: 24,
                            fontWeight: 800,
                            transition: 'all 0.2s'
                        }}>
                            {char}
                        </div>
                    ))}
                    {index === text.length && text.length > 0 && (
                        <div style={{ width: 20, height: 60, display: 'flex', alignItems: 'center', color: '#fbbf24', fontSize: 24 }}>$</div>
                    )}

                    <AnimatePresence>
                        {index >= 0 && (
                            <motion.div
                                initial={{ x: 0 }}
                                animate={{ x: index * 52 }}
                                style={{ position: 'absolute', top: -30, left: 10 + 15, fontSize: 20 }}
                            >
                                ⬇️
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ height: 60, display: 'flex', alignItems: 'center' }}>
                    {result !== null && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                padding: '10px 30px',
                                background: result ? '#065f46' : '#991b1b',
                                color: '#fff',
                                borderRadius: 30,
                                fontWeight: 800,
                                fontSize: 18,
                                border: `2px solid ${result ? '#10b981' : '#ef4444'}`
                            }}
                        >
                            {result ? 'MATCH SUCCESS' : 'MATCH FAILED'}
                        </motion.div>
                    )}
                </div>

                <div style={{ maxWidth: 600, fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
                    This simulator uses a simplified backtracking visualization. In production engines, regular expressions are often converted into
                    <strong> Non-deterministic Finite Automata (NFA)</strong> or <strong>Deterministic Finite Automata (DFA)</strong> to perform efficient matching.
                </div>
            </div>
        </div>
    );
}
