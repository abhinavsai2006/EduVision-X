'use client';
/* ═══════════════════════════════════════════════════════
   SlideList v5.0 — Premium slide thumbnails
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { THEMES, ThemeKey } from '@/types/slide';

export default function SlideList({ onCollapseAction }: { onCollapseAction?: () => void }) {
  const slides = useSlideStore(s => s.presentation.slides);
  const current = useSlideStore(s => s.currentSlideIndex);
  const goTo = useSlideStore(s => s.goToSlide);
  const addSlide = useSlideStore(s => s.addSlide);
  const removeSlide = useSlideStore(s => s.removeSlide);
  const duplicateSlide = useSlideStore(s => s.duplicateSlide);
  const moveSlide = useSlideStore(s => s.moveSlide);
  const setRightPanelTab = useSlideStore(s => s.setRightPanelTab);
  const theme = useSlideStore(s => THEMES[s.presentation.meta.theme as ThemeKey] || THEMES.default);

  /* Drag reorder state */
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIdx(idx);
  };
  const onDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current <= 0) setDropIdx(null);
  };
  const onDragEnter = () => { dragCounter.current++; };
  const onDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== toIdx) {
      moveSlide(dragIdx, toIdx);
      goTo(toIdx);
    }
    setDragIdx(null);
    setDropIdx(null);
    dragCounter.current = 0;
  };
  const onDragEnd = () => { setDragIdx(null); setDropIdx(null); dragCounter.current = 0; };

  return (
    <div className="flex flex-col overflow-hidden h-full"
      style={{
        width: 220,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 shrink-0"
        style={{ height: 40, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          {onCollapseAction && (
            <button className="btn-icon" style={{ width: 24, height: 24, fontSize: 11 }}
              onClick={onCollapseAction}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </button>
          )}
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            Slides
          </span>
          <span className="badge" style={{ fontSize: 9, padding: '1px 6px' }}>{slides.length}</span>
        </div>
        <div className="flex gap-1">
          <button className="btn-icon" style={{ width: 26, height: 26 }}
            onClick={() => setRightPanelTab('ai')} data-tooltip="AI Generate">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </button>
          <motion.button
            className="flex items-center justify-center"
            style={{
              width: 26, height: 26,
              background: 'var(--accent)', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 14,
              borderRadius: 'var(--radius-sm)',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => addSlide()}
            data-tooltip="Add Slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </motion.button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        <AnimatePresence>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              draggable
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => onDragOver(e, i)}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative group cursor-pointer overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: i === current
                    ? '2px solid var(--accent)'
                    : dropIdx === i
                    ? '2px dashed var(--accent)'
                    : '2px solid var(--border)',
                  aspectRatio: '16/9',
                  background: slide.background.value === '#ffffff' || slide.background.value === '#fff'
                    ? theme.bg
                    : slide.background.value,
                  opacity: dragIdx === i ? 0.4 : 1,
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: i === current ? '0 0 0 1px var(--accent-glow), var(--shadow-sm)' : 'var(--shadow-xs)',
                }}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.02 }}
              >
                {/* Slide number */}
                <span className="absolute top-1.5 left-1.5 font-mono"
                  style={{
                    fontSize: 9, fontWeight: 700,
                    background: i === current ? 'var(--accent)' : 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backdropFilter: 'blur(4px)',
                    lineHeight: '12px',
                  }}>
                  {i + 1}
                </span>

                {/* Element count */}
                {slide.elements.length > 0 && (
                  <span className="absolute bottom-1.5 right-1.5 font-mono"
                    style={{
                      fontSize: 8, fontWeight: 500,
                      background: 'rgba(0,0,0,0.45)',
                      color: 'rgba(255,255,255,0.7)',
                      padding: '2px 5px',
                      borderRadius: 'var(--radius-xs)',
                      backdropFilter: 'blur(4px)',
                    }}>
                    {slide.elements.length} el
                  </span>
                )}

                {/* Hover actions */}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity"
                  style={{ transitionDuration: '100ms' }}>
                  <button
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: 22, height: 22,
                      background: 'rgba(0,0,0,0.65)', color: '#fff',
                      border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)',
                      backdropFilter: 'blur(4px)',
                    }}
                    onClick={e => { e.stopPropagation(); duplicateSlide(i); }}
                    data-tooltip="Duplicate"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  </button>
                  <button
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: 22, height: 22,
                      background: 'rgba(239,68,68,0.75)', color: '#fff',
                      border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)',
                      backdropFilter: 'blur(4px)',
                    }}
                    onClick={e => { e.stopPropagation(); removeSlide(i); }}
                    data-tooltip="Delete"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
