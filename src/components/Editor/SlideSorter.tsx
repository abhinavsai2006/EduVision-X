'use client';
/* ═══════════════════════════════════════════════════════
   SlideSorter — Grid overview with drag-to-reorder
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { THEMES, ThemeKey } from '@/types/slide';

interface Props { open: boolean; onClose: () => void; }

export default function SlideSorter({ open, onClose }: Props) {
  const slides = useSlideStore(s => s.presentation.slides);
  const goTo = useSlideStore(s => s.goToSlide);
  const moveSlide = useSlideStore(s => s.moveSlide);
  const theme = useSlideStore(s => THEMES[s.presentation.meta.theme as ThemeKey] || THEMES.default);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9990] flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Slide Sorter</h2>
        <button className="text-xs px-3 py-1 rounded" style={{ background: 'var(--accent)', color: '#fff' }} onClick={onClose}>Close</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-wrap gap-4">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative rounded-lg overflow-hidden cursor-pointer group"
              style={{
                width: 192, height: 108,
                background: slide.background.value === '#ffffff' || slide.background.value === '#fff' ? theme.bg : slide.background.value,
                border: dragIdx === i ? '2px solid var(--accent)' : '2px solid var(--border)',
                opacity: dragIdx === i ? 0.6 : 1,
              }}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null && dragIdx !== i) moveSlide(dragIdx, i); setDragIdx(null); }}
              onDragEnd={() => setDragIdx(null)}
              onClick={() => { goTo(i); onClose(); }}
            >
              <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}>{i + 1}</span>
              <span className="absolute bottom-1 right-1 text-[9px] px-1 rounded"
                style={{ background: 'rgba(0,0,0,.5)', color: '#ccc' }}>{slide.elements.length} el</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
