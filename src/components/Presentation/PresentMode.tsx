'use client';
/* ═══════════════════════════════════════════════════════
   PresentMode — Full-screen presentation with transitions,
   progress bar, nav controls, speaker notes, staggered animations
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { THEMES, ThemeKey, TransitionType } from '@/types/slide';
import ElementRenderer from '../Elements/ElementRenderer';

const CANVAS_W = 960;
const CANVAS_H = 540;

/* ── Transition variants ─── */
function getVariants(t: TransitionType) {
  switch (t) {
    case 'fade':
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    case 'slide':
      return { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-100%' } };
    case 'zoom':
      return { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.5, opacity: 0 } };
    case 'flip':
      return { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 } };
    case 'cube':
      return { initial: { rotateY: 90, x: '50%', perspective: 1200 }, animate: { rotateY: 0, x: 0 }, exit: { rotateY: -90, x: '-50%' } };
    case 'drop':
      return { initial: { y: '-100%', opacity: 0, scale: 0.8 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: '100%', opacity: 0, scale: 0.8 } };
    default:
      return { initial: {}, animate: {}, exit: {} };
  }
}

export default function PresentMode() {
  const slides = useSlideStore(s => s.presentation.slides);
  const settings = useSlideStore(s => s.presentation.settings);
  const themeName = useSlideStore(s => s.presentation.meta.theme as ThemeKey);
  const exitPresent = useSlideStore(s => s.exitPresent);
  const presentFromSlide = useSlideStore(s => s.presentFromSlide);
  const setPresentFromSlide = useSlideStore(s => s.setPresentFromSlide);
  const theme = THEMES[themeName] || THEMES.default;

  const [idx, setIdx] = useState(presentFromSlide ?? 0);
  const [showControls, setShowControls] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [mouseTimeout, setMouseTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const slide = slides[idx];

  /* Clear presentFromSlide after using it */
  useEffect(() => {
    if (presentFromSlide !== null) setPresentFromSlide(null);
  }, [presentFromSlide, setPresentFromSlide]);

  /* Request fullscreen on enter */
  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, []);

  const next = useCallback(() => setIdx(i => Math.min(i + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') prev();
      if (e.key === 'Escape') exitPresent();
      if (e.key === 'Home') setIdx(0);
      if (e.key === 'End') setIdx(slides.length - 1);
      if (e.key === 'n' || e.key === 'N') setShowNotes(v => !v);
      if (e.key === 'g' || e.key === 'G') {
        const target = prompt(`Go to slide (1-${slides.length}):`);
        if (target) setIdx(Math.max(0, Math.min(+target - 1, slides.length - 1)));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, exitPresent, slides.length]);

  /* Auto-play */
  useEffect(() => {
    if (!settings.autoPlay) return;
    const iv = setInterval(next, settings.autoPlayInterval || 5000);
    return () => clearInterval(iv);
  }, [settings.autoPlay, settings.autoPlayInterval, next]);

  /* Show controls on mouse move, hide after 3s */
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (mouseTimeout) clearTimeout(mouseTimeout);
    const tid = setTimeout(() => setShowControls(false), 3000);
    setMouseTimeoutId(tid);
  }, [mouseTimeout]);

  if (!slide) return null;

  const transition = (slide.transition || settings.transition || 'fade') as TransitionType;
  const variants = getVariants(transition);
  const dur = (settings.transitionDuration || 500) / 1000;

  /* Compute scale to fit viewport */
  const scale = typeof window !== 'undefined' ? Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H) : 1;

  /* Background */
  const bgStyle: React.CSSProperties = {};
  if (slide.background.type === 'solid') bgStyle.background = slide.background.value;
  else if (slide.background.type === 'gradient') bgStyle.background = slide.background.value;
  if (slide.background.value === '#ffffff' || slide.background.value === '#fff') {
    bgStyle.background = theme.bg;
  }

  const progressPct = ((idx + 1) / slides.length) * 100;

  return (
    <div className="present-mode" onClick={next} onContextMenu={e => { e.preventDefault(); prev(); }} onMouseMove={handleMouseMove}>
      {/* ── Progress bar at top ── */}
      <div className="absolute top-0 left-0 right-0 z-50" style={{ height: 3, background: 'rgba(255,255,255,.15)' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: theme.accent || '#6366f1', transition: 'width 0.4s ease' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: dur, ease: 'easeInOut' }}
          className="relative"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            perspective: 1200,
            ...bgStyle,
          }}
        >
          {slide.elements.map((el, elIdx) => (
            <motion.div
              key={el.id}
              initial={el.animation && el.animation !== 'none' ? { opacity: 0, y: 20 } : undefined}
              animate={{ opacity: el.opacity, y: 0 }}
              transition={{ delay: elIdx * 0.15, duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: el.x, top: el.y,
                width: el.width, height: el.height,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
              }}
            >
              <ElementRenderer element={el} theme={theme} presentMode />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Slide counter ── */}
      {settings.showSlideNumbers && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,.5)', color: '#fff', backdropFilter: 'blur(8px)' }}>
          {idx + 1} / {slides.length}
        </div>
      )}

      {/* ── Bottom nav controls (show on hover) ── */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0 }}>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); setIdx(0); }} title="First slide">⏮</button>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); prev(); }} title="Previous">◀</button>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); next(); }} title="Next">▶</button>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); setIdx(slides.length - 1); }} title="Last slide">⏭</button>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); setShowNotes(v => !v); }} title="Toggle notes (N)">📝</button>
        <button className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); exitPresent(); }} title="Exit (ESC)">✕</button>
      </div>

      {/* ── Speaker notes overlay ── */}
      {showNotes && slide.notes && (
        <div className="absolute bottom-14 left-4 right-4 z-50 p-3 rounded-lg"
          style={{ background: 'rgba(0,0,0,.8)', color: '#e8e8f0', fontSize: 13, lineHeight: 1.5, backdropFilter: 'blur(8px)', maxHeight: '30vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#888' }}>Speaker Notes</div>
          <div className="whitespace-pre-wrap">{slide.notes}</div>
        </div>
      )}

      {/* ── Slide overview grid (press G to go to slide) ── */}
      {/* Exit button always visible */}
      <button className="absolute top-4 right-4 text-xs px-2 py-1 rounded transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,.5)', color: '#fff', opacity: showControls ? 1 : 0.3 }}
        onClick={e => { e.stopPropagation(); exitPresent(); }}>
        ESC
      </button>
    </div>
  );
}
