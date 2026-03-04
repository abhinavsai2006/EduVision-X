'use client';
import React, { useState } from 'react';

type Table = {
    name: string;
    columns: string[];
    rows: any[][];
    keys: string[];
};

export function NormalizationSim() {
    const [step, setStep] = useState(0); // 0: 0NF, 1: 1NF, 2: 2NF, 3: 3NF

    const tables0NF: Table[] = [{
        name: 'Orders_Unnormalized',
        columns: ['OrderID', 'Customer', 'Items (ID, Name, Style, Price)', 'OrderDate'],
        rows: [
            ['101', 'Alice', '1: Shirty, Blue, $20; 2: Pants, Red, $40', '2023-10-01'],
            ['102', 'Bob', '3: Hat, Black, $15', '2023-10-02'],
        ],
        keys: ['OrderID']
    }];

    const tables1NF: Table[] = [{
        name: 'Orders_1NF',
        columns: ['OrderID', 'Customer', 'ItemID', 'ItemName', 'ItemStyle', 'ItemPrice', 'OrderDate'],
        rows: [
            ['101', 'Alice', '1', 'Shirty', 'Blue', '20', '2023-10-01'],
            ['101', 'Alice', '2', 'Pants', 'Red', '40', '2023-10-01'],
            ['102', 'Bob', '3', 'Hat', 'Black', '15', '2023-10-02'],
        ],
        keys: ['OrderID', 'ItemID']
    }];

    const tables2NF: Table[] = [
        {
            name: 'Orders_Base',
            columns: ['OrderID', 'Customer', 'OrderDate'],
            rows: [
                ['101', 'Alice', '2023-10-01'],
                ['102', 'Bob', '2023-10-02'],
            ],
            keys: ['OrderID']
        },
        {
            name: 'Order_Items',
            columns: ['OrderID', 'ItemID', 'ItemName', 'ItemStyle', 'ItemPrice'],
            rows: [
                ['101', '1', 'Shirty', 'Blue', '20'],
                ['101', '2', 'Pants', 'Red', '40'],
                ['102', '3', 'Hat', 'Black', '15'],
            ],
            keys: ['OrderID', 'ItemID']
        }
    ];

    const tables3NF: Table[] = [
        {
            name: 'Orders_3NF',
            columns: ['OrderID', 'CustomerID', 'OrderDate'],
            rows: [
                ['101', 'C1', '2023-10-01'],
                ['102', 'C2', '2023-10-02'],
            ],
            keys: ['OrderID']
        },
        {
            name: 'Customers',
            columns: ['CustomerID', 'CustomerName'],
            rows: [
                ['C1', 'Alice'],
                ['C2', 'Bob'],
            ],
            keys: ['CustomerID']
        },
        {
            name: 'Order_Items',
            columns: ['OrderID', 'ItemID', 'ItemName', 'ItemStyle', 'ItemPrice'],
            rows: [
                ['101', '1', 'Shirty', 'Blue', '20'],
                ['101', '2', 'Pants', 'Red', '40'],
                ['102', '3', 'Hat', 'Black', '15'],
            ],
            keys: ['OrderID', 'ItemID']
        }
    ];

    const currentTables = step === 0 ? tables0NF : step === 1 ? tables1NF : step === 2 ? tables2NF : tables3NF;

    const descriptions = [
        "Unnormalized Form (0NF): Contains multi-valued attributes and repeating groups. 'Items' contains multiple pieces of data in one cell.",
        "First Normal Form (1NF): Eliminate repeating groups and ensure atomicity. Each cell contains a single value. Defined Primary Key.",
        "Second Normal Form (2NF): Must be in 1NF. Eliminate partial dependencies. All non-key attributes must depend on the whole primary key.",
        "Third Normal Form (3NF): Must be in 2NF. Eliminate transitive dependencies. Non-key attributes shouldn't depend on other non-key attributes."
    ];

    return (
        <div style={{ padding: 20, background: '#0a0a0f', color: '#e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[0, 1, 2, 3].map(s => (
                    <button
                        key={s}
                        onClick={() => setStep(s)}
                        style={{
                            padding: '10px 20px',
                            background: step === s ? '#6366f1' : '#111118',
                            border: `1px solid ${step === s ? '#818cf8' : '#1e1e2e'}`,
                            color: step === s ? '#fff' : '#94a3b8',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 12,
                            transition: 'all 0.2s'
                        }}
                    >
                        {s === 0 ? '0NF' : `${s}NF`}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid #6366f1', borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#818cf8', marginBottom: 4 }}>Current Stage: {step === 0 ? 'Unnormalized' : `${step}NF`}</div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{descriptions[step]}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 20, overflowY: 'auto' }}>
                {currentTables.map((t, idx) => (
                    <div key={idx} style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16, minWidth: 300, flex: '1 1 auto' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                            {t.name}
                            <span style={{ fontSize: 10, color: '#64748b' }}>PK: {t.keys.join(', ')}</span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                <thead>
                                    <tr style={{ background: '#111118', color: '#64748b', textAlign: 'left' }}>
                                        {t.columns.map(col => (
                                            <th key={col} style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e2e', whiteSpace: 'nowrap' }}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {t.rows.map((row, rIdx) => (
                                        <tr key={rIdx} style={{ borderBottom: '1px solid #111118' }}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} style={{ padding: '10px 12px', color: '#cbd5e1' }}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
