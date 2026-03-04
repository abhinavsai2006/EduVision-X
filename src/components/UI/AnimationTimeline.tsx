'use client';
/* ═══════════════════════════════════════════════════════
   AnimationTimeline — Timeline editor for slide animations
   Keyframe-based animation controller
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { ANIMATIONS } from '@/types/slide';

interface Props { open: boolean; onClose: () => void; }

export default function AnimationTimeline({ open, onClose }: Props) {
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const updateElement = useSlideStore(s => s.updateElement);
  const snapshot = useSlideStore(s => s.snapshot);
  const animationTimeline = useSlideStore(s => s.animationTimeline);
  const setAnimationTimeline = useSlideStore(s => s.setAnimationTimeline);
  const animationPreview = useSlideStore(s => s.animationPreview);
  const toggleAnimationPreview = useSlideStore(s => s.toggleAnimationPreview);
  const defaultAnimDuration = useSlideStore(s => s.defaultAnimDuration);
  const setDefaultAnimDuration = useSlideStore(s => s.setDefaultAnimDuration);
  const defaultAnimEasing = useSlideStore(s => s.defaultAnimEasing);
  const setDefaultAnimEasing = useSlideStore(s => s.setDefaultAnimEasing);

  const slide = slides[currentSlideIndex];
  const elements = slide?.elements || [];
  const [selectedEl, setSelectedEl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const totalDuration = 5000; // 5 seconds timeline
  const pixelsPerMs = 0.1;

  const getTimelineEntry = (elementId: string) =>
    animationTimeline.find(t => t.elementId === elementId);

  const updateTimelineEntry = (elementId: string, startTime: number, duration: number, animation: string) => {
    const existing = animationTimeline.filter(t => t.elementId !== elementId);
    setAnimationTimeline([...existing, { elementId, startTime, duration, animation }]);
  };

  const handlePlay = () => {
    setPlaying(true);
    setCurrentTime(0);
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= totalDuration) {
        setPlaying(false);
        setCurrentTime(0);
        return;
      }
      setCurrentTime(elapsed);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[9980]"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 shrink-0" style={{ height: 36, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Animation Timeline</span>
          <span className="badge badge-muted" style={{ fontSize: 9 }}>{elements.length} elements</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={handlePlay}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button className={`btn-ghost ${animationPreview ? 'text-accent' : ''}`}
            style={{ fontSize: 10, padding: '3px 8px' }} onClick={toggleAnimationPreview}>
            Preview {animationPreview ? 'ON' : 'OFF'}
          </button>
          {/* Duration */}
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Default:</span>
          <input className="input-field" type="number" value={defaultAnimDuration} min={100} max={5000} step={100}
            onChange={e => setDefaultAnimDuration(Number(e.target.value))}
            style={{ width: 60, padding: '2px 6px', fontSize: 10 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>ms</span>
          {/* Easing */}
          <select className="select-field" value={defaultAnimEasing} onChange={e => setDefaultAnimEasing(e.target.value)}
            style={{ padding: '2px 6px', fontSize: 10 }}>
            <option value="ease">Ease</option>
            <option value="linear">Linear</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In-Out</option>
            <option value="spring">Spring</option>
          </select>
          <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Timeline body */}
      <div className="flex" style={{ height: 200 }}>
        {/* Element labels */}
        <div className="shrink-0 overflow-y-auto" style={{ width: 160, borderRight: '1px solid var(--border)' }}>
          {elements.map(el => (
            <div
              key={el.id}
              className="flex items-center gap-2 px-3 cursor-pointer transition-colors"
              style={{
                height: 32,
                background: selectedEl === el.id ? 'var(--accent-dim)' : 'transparent',
                borderBottom: '1px solid var(--border)',
              }}
              onClick={() => setSelectedEl(el.id)}
            >
              <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 18 }}>{el.type.slice(0, 3)}</span>
              <span style={{ fontSize: 11, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {el.content?.slice(0, 20) || el.type}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline tracks */}
        <div className="flex-1 overflow-x-auto overflow-y-auto relative" ref={timelineRef}>
          {/* Time ruler */}
          <div className="sticky top-0 z-10" style={{ height: 20, background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
            {Array.from({ length: Math.ceil(totalDuration / 1000) + 1 }, (_, i) => (
              <span key={i} className="absolute" style={{
                left: i * 1000 * pixelsPerMs,
                fontSize: 9, color: 'var(--text-muted)', top: 4,
              }}>{i}s</span>
            ))}
          </div>

          {/* Playhead */}
          {playing && (
            <motion.div
              className="absolute top-0 bottom-0 z-20"
              style={{ width: 1, background: 'var(--danger)', left: currentTime * pixelsPerMs }}
            />
          )}

          {/* Tracks */}
          {elements.map(el => {
            const entry = getTimelineEntry(el.id);
            const anim = el.animation || 'fadeIn';
            const startMs = entry?.startTime || 0;
            const durMs = entry?.duration || defaultAnimDuration;

            return (
              <div
                key={el.id}
                className="relative"
                style={{ height: 32, borderBottom: '1px solid var(--border)' }}
              >
                {/* Keyframe bar */}
                <motion.div
                  className="absolute top-1 bottom-1 rounded cursor-pointer"
                  style={{
                    left: startMs * pixelsPerMs,
                    width: Math.max(durMs * pixelsPerMs, 20),
                    background: selectedEl === el.id ? 'var(--accent)' : 'var(--accent-dim)',
                    border: `1px solid ${selectedEl === el.id ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                  drag="x"
                  dragMomentum={false}
                  dragConstraints={timelineRef}
                  onDragEnd={(_, info) => {
                    const newStart = Math.max(0, startMs + info.offset.x / pixelsPerMs);
                    updateTimelineEntry(el.id, newStart, durMs, anim);
                  }}
                  onClick={() => setSelectedEl(el.id)}
                >
                  <span style={{ fontSize: 8, color: 'var(--text-primary)', padding: '0 4px', whiteSpace: 'nowrap' }}>
                    {anim}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Properties sidebar */}
        {selectedEl && (
          <div className="shrink-0 overflow-y-auto p-3 space-y-3"
            style={{ width: 200, borderLeft: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Properties</div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>Animation</label>
              <select
                className="select-field w-full mt-1"
                style={{ fontSize: 11, padding: '4px 6px' }}
                value={elements.find(e => e.id === selectedEl)?.animation || 'none'}
                onChange={e => {
                  snapshot();
                  updateElement(selectedEl, { animation: e.target.value });
                }}
              >
                {ANIMATIONS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>Trigger</label>
              <select
                className="select-field w-full mt-1"
                style={{ fontSize: 11, padding: '4px 6px' }}
                value={elements.find(e => e.id === selectedEl)?.animTrigger || 'auto'}
                onChange={e => {
                  snapshot();
                  updateElement(selectedEl, { animTrigger: e.target.value as 'auto' | 'click' | 'withPrevious' });
                }}
              >
                <option value="auto">On Enter</option>
                <option value="click">On Click</option>
                <option value="withPrevious">With Previous</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-muted)' }}>Duration (ms)</label>
              <input
                className="input-field w-full mt-1"
                type="number" min={100} max={5000} step={100}
                value={getTimelineEntry(selectedEl)?.duration || defaultAnimDuration}
                onChange={e => {
                  const entry = getTimelineEntry(selectedEl);
                  updateTimelineEntry(
                    selectedEl,
                    entry?.startTime || 0,
                    Number(e.target.value),
                    entry?.animation || elements.find(el => el.id === selectedEl)?.animation || 'fadeIn'
                  );
                }}
                style={{ fontSize: 11, padding: '4px 6px' }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
