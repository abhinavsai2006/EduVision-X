'use client';
/* ═══════════════════════════════════════════════════════
   LayersPanel v5.0 — Element z-order management
   ═══════════════════════════════════════════════════════ */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const typeIcons: Record<string, React.ReactNode> = {
  heading: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 4v16M20 4v16"/></svg>,
  text:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  list:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  image:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  shape:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  code:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  chart:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  video:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  audio:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
};

export default function LayersPanel() {
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const selectedElementIds = useSlideStore(s => s.selectedElementIds);
  const selectElement = useSlideStore(s => s.selectElement);
  const bringForward = useSlideStore(s => s.bringForward);
  const sendBackward = useSlideStore(s => s.sendBackward);
  const updateElement = useSlideStore(s => s.updateElement);
  const removeElements = useSlideStore(s => s.removeElements);

  const slide = slides[currentSlideIndex];
  const elements = slide ? [...slide.elements].reverse() : [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <rect x="2" y="2" width="20" height="6" rx="1"/><rect x="2" y="10" width="20" height="6" rx="1"/><rect x="2" y="18" width="20" height="4" rx="1"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Layers</span>
        <span className="badge badge-muted ml-auto">{elements.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {elements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4, marginBottom: 8 }}>
              <rect x="2" y="2" width="20" height="6" rx="1"/><rect x="2" y="10" width="20" height="6" rx="1"/><rect x="2" y="18" width="20" height="4" rx="1"/>
            </svg>
            <span style={{ fontSize: 11 }}>No elements on this slide</span>
          </div>
        )}
        <AnimatePresence>
          {elements.map((el, i) => {
            const isSelected = selectedElementIds.includes(el.id);
            const icon = typeIcons[el.type] || <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
            return (
              <motion.div key={el.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                className="layer-item flex items-center gap-2 px-3 py-1.5 cursor-pointer group"
                style={{
                  background: isSelected ? 'var(--accent-dim)' : 'transparent',
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 11,
                }}
                onClick={() => selectElement(el.id)}>
                <span style={{ width: 18, display: 'flex', justifyContent: 'center', opacity: isSelected ? 1 : 0.6 }}>
                  {icon}
                </span>
                <span className="flex-1 truncate" style={{ fontWeight: isSelected ? 500 : 400 }}>
                  {el.content?.slice(0, 22) || el.question?.slice(0, 22) || el.type}
                </span>
                {el.locked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                )}
                <span className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button className="btn-icon" style={{ width: 20, height: 20 }} title="Up"
                    onClick={e => { e.stopPropagation(); bringForward(el.id); }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                  </button>
                  <button className="btn-icon" style={{ width: 20, height: 20 }} title="Down"
                    onClick={e => { e.stopPropagation(); sendBackward(el.id); }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <button className="btn-icon" style={{ width: 20, height: 20 }}
                    title={el.locked ? 'Unlock' : 'Lock'}
                    onClick={e => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {el.locked
                        ? <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>
                        : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>
                      }
                    </svg>
                  </button>
                  <button className="btn-icon" style={{ width: 20, height: 20, color: '#ef4444' }} title="Delete"
                    onClick={e => { e.stopPropagation(); removeElements([el.id]); }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
