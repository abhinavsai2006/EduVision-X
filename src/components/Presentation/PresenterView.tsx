'use client';
/* ═══════════════════════════════════════════════════════
   PresenterView — Popup-like presenter view with notes
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useCallback } from 'react';
import { useSlideStore } from '@/store/useSlideStore';
import { THEMES, ThemeKey } from '@/types/slide';
import ElementRenderer from '../Elements/ElementRenderer';

interface Props { onClose: () => void; }

export default function PresenterView({ onClose }: Props) {
  const slides = useSlideStore(s => s.presentation.slides);
  const themeName = useSlideStore(s => s.presentation.meta.theme as ThemeKey);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const goToSlide = useSlideStore(s => s.goToSlide);
  const theme = THEMES[themeName] || THEMES.default;

  const [idx, setIdx] = useState(currentSlideIndex);
  const [elapsed, setElapsed] = useState(0);

  const slide = slides[idx];
  const next = slides[idx + 1];

  const goNext = useCallback(() => setIdx(i => Math.min(i + 1, slides.length - 1)), [slides.length]);
  const goPrev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);

  // Sync with store
  useEffect(() => { goToSlide(idx); }, [idx, goToSlide]);

  // Timer
  useEffect(() => {
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const renderSlide = (slideData: typeof slide, scale: number) => {
    if (!slideData) return null;
    const bg = slideData.background.value === '#ffffff' || slideData.background.value === '#fff' ? theme.bg : slideData.background.value;
    return (
      <div className="relative rounded overflow-hidden" style={{
        width: 960 * scale, height: 540 * scale,
        background: bg,
        transform: `scale(1)`,
      }}>
        {slideData.elements.map(el => (
          <div key={el.id} style={{
            position: 'absolute',
            left: el.x * scale, top: el.y * scale,
            width: el.width * scale, height: el.height * scale,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}>
            <div style={{ width: el.width, height: el.height }}>
              <ElementRenderer element={el} theme={theme} presentMode />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left: Current slide */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>Current Slide ({idx + 1}/{slides.length})</div>
        {slide && renderSlide(slide, 0.7)}
        <div className="flex gap-3 mt-3">
          <button className="text-xs px-3 py-1 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }} onClick={goPrev}>◀ Prev</button>
          <button className="text-xs px-3 py-1 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }} onClick={goNext}>Next ▶</button>
        </div>
      </div>

      {/* Right: Next slide + Notes + Timer */}
      <div className="w-80 flex flex-col" style={{ borderLeft: '1px solid var(--border)' }}>
        {/* Timer */}
        <div className="text-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-lg font-mono" style={{ color: 'var(--accent)' }}>{formatTime(elapsed)}</span>
        </div>

        {/* Next slide preview */}
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Next Slide</div>
          {next ? renderSlide(next, 0.3) : (
            <div className="text-[10px] text-center py-4" style={{ color: 'var(--text-muted)' }}>End of presentation</div>
          )}
        </div>

        {/* Speaker notes */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Speaker Notes</div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {slide?.notes || 'No notes for this slide.'}
          </div>
        </div>

        {/* Close */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="w-full text-xs px-3 py-1.5 rounded"
            style={{ background: 'var(--danger)', color: '#fff' }}
            onClick={onClose}>Exit Presenter View</button>
        </div>
      </div>
    </div>
  );
}
