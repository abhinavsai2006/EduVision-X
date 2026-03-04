'use client';
/* ═══════════════════════════════════════════════════════
   StatusBar v5.0 — Clean minimal bottom bar
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

export default function StatusBar() {
  const slides = useSlideStore(s => s.presentation.slides);
  const idx = useSlideStore(s => s.currentSlideIndex);
  const zoom = useSlideStore(s => s.zoom);
  const setZoom = useSlideStore(s => s.setZoom);
  const selectedIds = useSlideStore(s => s.selectedElementIds);
  const toolMode = useSlideStore(s => s.toolMode);
  const [aiStatus, setAiStatus] = useState<'online' | 'offline'>('offline');
  const [saved, setSaved] = useState(false);

  const slide = slides[idx];
  const elCount = slide?.elements.length ?? 0;
  const selEl = selectedIds.length === 1
    ? slide?.elements.find(e => e.id === selectedIds[0])
    : null;

  useEffect(() => {
    fetch('/api/ai/status').then(r => r.json()).then(d => setAiStatus(d.available ? 'online' : 'offline')).catch(() => setAiStatus('offline'));
  }, []);

  useEffect(() => {
    const handler = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
    window.addEventListener('eduslideSaved', handler);
    return () => window.removeEventListener('eduslideSaved', handler);
  }, []);

  const zoomPresets = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="status-bar shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2">
        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
          Slide {idx + 1}<span style={{ color: 'var(--text-muted)' }}>/{slides.length}</span>
        </span>
        <span style={{ color: 'var(--border-bold)' }}>·</span>
        <span>{elCount} element{elCount !== 1 ? 's' : ''}</span>
        {selEl && (
          <>
            <span style={{ color: 'var(--border-bold)' }}>·</span>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
              {selEl.type.charAt(0).toUpperCase() + selEl.type.slice(1)}
            </span>
          </>
        )}
        {selectedIds.length > 1 && (
          <>
            <span style={{ color: 'var(--border-bold)' }}>·</span>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{selectedIds.length} selected</span>
          </>
        )}
      </div>

      {/* Save indicator */}
      <AnimatePresence>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="flex items-center gap-1"
            style={{ color: 'var(--success)', fontWeight: 500, fontSize: 'var(--size-xs)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            Saved
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* Tool Mode */}
      <span className="flex items-center gap-1" style={{ textTransform: 'capitalize' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
        {toolMode}
      </span>

      {/* AI status */}
      <div className="flex items-center gap-1.5">
        <span style={{
          width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
          background: aiStatus === 'online' ? 'var(--success)' : 'var(--text-muted)',
          boxShadow: aiStatus === 'online' ? '0 0 6px rgba(34,197,94,0.4)' : 'none',
        }} />
        <span>AI {aiStatus}</span>
      </div>

      {/* Zoom control */}
      <div className="flex items-center gap-1">
        <button className="btn-icon" style={{ width: 20, height: 20, fontSize: 12 }}
          onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div className="relative group">
          <span className="font-mono text-center cursor-pointer"
            style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 36, display: 'inline-block', fontWeight: 500 }}>
            {Math.round(zoom * 100)}%
          </span>
          {/* Quick zoom presets on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-bold)',
              borderRadius: 'var(--radius-md)',
              padding: 4, boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column', gap: 1,
            }}>
            {zoomPresets.map(z => (
              <button key={z} className="btn-ghost"
                style={{
                  fontSize: 10, padding: '3px 12px', whiteSpace: 'nowrap',
                  color: Math.abs(zoom - z) < 0.01 ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: Math.abs(zoom - z) < 0.01 ? 600 : 400,
                }}
                onClick={() => setZoom(z)}>
                {Math.round(z * 100)}%
              </button>
            ))}
          </div>
        </div>
        <button className="btn-icon" style={{ width: 20, height: 20, fontSize: 12 }}
          onClick={() => setZoom(Math.min(zoom + 0.1, 2))}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button className="btn-ghost" style={{ fontSize: 10, padding: '2px 6px', marginLeft: 2 }}
          onClick={() => setZoom(1)}>Fit</button>
      </div>
    </div>
  );
}
