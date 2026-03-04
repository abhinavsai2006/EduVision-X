'use client';
import React, { useState } from 'react';

export function DecisionTreeSim() {
    const initialCode = `from sklearn.tree import DecisionTreeClassifier
import pandas as pd

# 1. Load dataset
data = {
    'Weather_Sunny': [1, 0, 1, 0, 1],
    'Wind_Strong':   [0, 1, 1, 0, 0],
    'Play':          [1, 0, 0, 1, 1]
}
df = pd.DataFrame(data)
X = df[['Weather_Sunny', 'Wind_Strong']]
y = df['Play']

# 2. Initialize and train model
clf = DecisionTreeClassifier(max_depth=3)
clf.fit(X, y)
`;

    const [codeStr, setCodeStr] = useState(initialCode);
    const [tree, setTree] = useState<any>({
        feature: 'Weather_Sunny <= 0.5',
        left: {
            feature: 'Wind_Strong <= 0.5',
            left: { class: 'Play', color: '#22c55e' },
            right: { class: 'No Play', color: '#ef4444' }
        },
        right: {
            feature: 'Wind_Strong <= 0.5',
            left: { class: 'Play', color: '#22c55e' },
            right: { class: 'No Play', color: '#ef4444' }
        }
    });
    const [msg, setMsg] = useState('Edit Python code to generate the Decision Tree');

    const handleUpdate = () => {
        try {
            if (!codeStr.includes('DecisionTreeClassifier')) throw Error('Missing DecisionTreeClassifier import or instantiation.');
            if (!codeStr.includes('.fit(')) throw Error('Model must be trained using .fit(X, y).');

            // Default tree (max_depth=3 or unspecified)
            let parsedTree = {
                feature: 'Weather_Sunny <= 0.5',
                left: {
                    feature: 'Wind_Strong <= 0.5',
                    left: { class: 'Play', color: '#22c55e' },
                    right: { class: 'No Play', color: '#ef4444' }
                },
                right: {
                    feature: 'Wind_Strong <= 0.5',
                    left: { class: 'Play', color: '#22c55e' },
                    right: { class: 'No Play', color: '#ef4444' }
                }
            };

            // Tweak tree based on code modifications to simulate dynamic parsing
            if (codeStr.includes('max_depth=1')) {
                parsedTree = {
                    feature: 'Weather_Sunny <= 0.5',
                    left: { class: 'Play', color: '#22c55e' },
                    right: { class: 'No Play', color: '#ef4444' }
                } as any;
            } else if (codeStr.includes('max_depth=2')) {
                parsedTree = {
                    feature: 'Wind_Strong <= 0.5',
                    left: { feature: 'Weather_Sunny <= 0.5', left: { class: 'Play', color: '#22c55e' }, right: { class: 'No Play', color: '#ef4444' } },
                    right: { class: 'No Play', color: '#ef4444' }
                } as any;
            }

            setTree(parsedTree);
            setMsg('Model trained successfully! Tree generated.');
        } catch (e: any) {
            setMsg(`SyntaxError: ${e.message}`);
            setTree(null);
        }
    };

    const drawTree = (node: any, x: number, y: number, levelX: number): React.ReactNode => {
        if (!node) return null;
        return (
            <g>
                {node.left && <line x1={x} y1={y + 15} x2={x - levelX} y2={y + 60} stroke="#2a2a3a" strokeWidth={2} />}
                {node.right && <line x1={x} y1={y + 15} x2={x + levelX} y2={y + 60} stroke="#2a2a3a" strokeWidth={2} />}

                {node.class ? (
                    <rect x={x - 40} y={y - 15} width="80" height="30" rx="6" fill={node.color || '#3b82f6'} style={{ transition: 'all 0.5s' }} />
                ) : (
                    <rect x={x - 75} y={y - 15} width="150" height="30" rx="6" fill="#f59e0b" style={{ transition: 'all 0.5s' }} />
                )}
                <text x={x} y={y + 4} textAnchor="middle" fill="#0f0f17" fontSize="11" fontWeight="800">{node.class || node.feature || '?'}</text>

                {node.left && <text x={x - levelX / 2 - 15} y={y + 35} fontSize={10} fill="#64748b" fontWeight="600">True</text>}
                {node.right && <text x={x + levelX / 2 + 15} y={y + 35} fontSize={10} fill="#64748b" fontWeight="600">False</text>}

                {node.left && drawTree(node.left, x - levelX, y + 60, levelX / 2)}
                {node.right && drawTree(node.right, x + levelX, y + 60, levelX / 2)}
            </g>
        );
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center', background: '#0d0d14' }}>
                <div style={{ flex: 1, color: msg.includes('Error') ? '#ef4444' : '#22c55e', fontSize: 12, fontWeight: 700 }}>{msg}</div>
                <button onClick={handleUpdate} style={{ padding: '6px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>▶ Run Code</button>
            </div>
            <div style={{ flex: 1, display: 'flex', background: '#0a0a0f', overflow: 'hidden' }}>
                <div style={{ width: 450, borderRight: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ background: '#111118', padding: '8px 12px', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #1e1e2e' }}>main.py</div>
                    <textarea
                        value={codeStr}
                        onChange={e => setCodeStr(e.target.value)}
                        style={{
                            flex: 1,
                            background: '#0a0a0f',
                            color: '#94a3b8',
                            padding: 16,
                            border: 'none',
                            outline: 'none',
                            fontSize: 13,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            resize: 'none',
                            lineHeight: 1.6
                        }}
                        spellCheck={false}
                    />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', background: '#0a0a0f' }}>
                    <svg width="800" height="500" style={{ minWidth: 800, minHeight: 500 }}>
                        {tree && drawTree(tree, 400, 60, 180)}
                    </svg>
                </div>
            </div>
        </div>
    );
}
