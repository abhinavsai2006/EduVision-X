'use client';
/* ═══════════════════════════════════════════════════════
   PerformanceMonitor — FPS, memory, render info overlay
   ═══════════════════════════════════════════════════════ */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

export default function PerformanceMonitor() {
  const debugMode = useSlideStore(s => s.debugMode);
  const showFPS = useSlideStore(s => s.showFPS);
  const performanceMetrics = useSlideStore(s => s.performanceMetrics);
  const setPerformanceMetrics = useSlideStore(s => s.setPerformanceMetrics);
  const errorLog = useSlideStore(s => s.errorLog);
  const zoom = useSlideStore(s => s.zoom);
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const selectedElementIds = useSlideStore(s => s.selectedElementIds);
  const undoStack = useSlideStore(s => s.undoStack);
  const redoStack = useSlideStore(s => s.redoStack);

  const [expanded, setExpanded] = useState(false);
  const fpsFrames = useRef<number[]>([]);
  const lastFrame = useRef(performance.now());
  const rafId = useRef(0);

  useEffect(() => {
    if (!showFPS && !debugMode) return;

    const tick = () => {
      const now = performance.now();
      fpsFrames.current.push(now);
      // Keep last 60 frames
      while (fpsFrames.current.length > 0 && fpsFrames.current[0]! < now - 1000) {
        fpsFrames.current.shift();
      }
      const fps = fpsFrames.current.length;
      const renderTime = now - lastFrame.current;
      lastFrame.current = now;

      // Memory (if available)
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0;

      setPerformanceMetrics({ fps, memory: Math.round(memory / 1024 / 1024), renderTime: Math.round(renderTime * 100) / 100 });
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [showFPS, debugMode, setPerformanceMetrics]);

  if (!showFPS && !debugMode) return null;

  const totalElements = slides.reduce((a, s) => a + s.elements.length, 0);
  const currentElements = slides[currentSlideIndex]?.elements.length ?? 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-[9999] select-none"
        style={{ bottom: 40, left: 8 }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      >
        {/* Mini bar */}
        <motion.div
          className="rounded-lg px-2 py-1 cursor-pointer flex items-center gap-2"
          style={{
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'monospace',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <span style={{
            color: performanceMetrics.fps > 50 ? '#10b981' : performanceMetrics.fps > 30 ? '#f59e0b' : '#ef4444',
            fontSize: 10, fontWeight: 700,
          }}>
            {performanceMetrics.fps} FPS
          </span>
          {debugMode && (
            <>
              <span style={{ color: '#71717a', fontSize: 9 }}>|</span>
              <span style={{ color: '#a1a1aa', fontSize: 9 }}>{performanceMetrics.memory}MB</span>
              <span style={{ color: '#71717a', fontSize: 9 }}>|</span>
              <span style={{ color: '#a1a1aa', fontSize: 9 }}>{performanceMetrics.renderTime}ms</span>
            </>
          )}
        </motion.div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && debugMode && (
            <motion.div
              className="rounded-lg mt-1 p-3 space-y-2"
              style={{
                background: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: 240,
                fontFamily: 'monospace',
                fontSize: 10,
              }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-[10px] font-bold" style={{ color: '#6366f1' }}>Debug Panel</div>

              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Slides', value: slides.length },
                  { label: 'Total Elements', value: totalElements },
                  { label: 'Current Elements', value: currentElements },
                  { label: 'Selected', value: selectedElementIds.length },
                  { label: 'Zoom', value: `${Math.round(zoom * 100)}%` },
                  { label: 'Undo Stack', value: undoStack.length },
                  { label: 'Redo Stack', value: redoStack.length },
                  { label: 'Slide Index', value: currentSlideIndex },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span style={{ color: '#71717a' }}>{item.label}</span>
                    <span style={{ color: '#e4e4e7' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Error log */}
              {errorLog.length > 0 && (
                <div className="pt-1 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="text-[9px] font-bold" style={{ color: '#ef4444' }}>Errors ({errorLog.length})</div>
                  {errorLog.slice(-3).map((e, i) => (
                    <div key={i} className="text-[8px]" style={{ color: e.severity === 'error' ? '#ef4444' : e.severity === 'warn' ? '#f59e0b' : '#a1a1aa' }}>
                      [{e.severity}] {e.message}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
