'use client';
import React from 'react';

export function ComingSoon({ name }: { name: string }) {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#e2e8f0' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{name} Simulation</h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, textAlign: 'center' }}>
                We are currently architecting this module to provide a high-fidelity, interactive experience. Check back soon for the full visualization.
            </p>
        </div>
    );
}
