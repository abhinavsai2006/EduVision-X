'use client';
/* ═══════════════════════════════════════════════════════
   AnalyticsDashboard — Learning analytics & insights
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

interface Props { open: boolean; onClose: () => void; }

const METRIC_CARDS = [
  { label: 'Total Slides', icon: '📊', color: '#6366f1' },
  { label: 'Total Elements', icon: '🧩', color: '#ec4899' },
  { label: 'Images', icon: '🖼️', color: '#10b981' },
  { label: 'Code Blocks', icon: '💻', color: '#f59e0b' },
  { label: 'Charts', icon: '📈', color: '#8b5cf6' },
  { label: 'Text Elements', icon: '📝', color: '#06b6d4' },
];

export default function AnalyticsDashboard({ open, onClose }: Props) {
  const slides = useSlideStore(s => s.presentation.slides);
  const [tab, setTab] = useState<'overview' | 'slides' | 'engagement'>('overview');
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Compute analytics
  const allElements = slides.flatMap(s => s.elements);
  const stats = {
    slides: slides.length,
    elements: allElements.length,
    images: allElements.filter(e => e.type === 'image').length,
    code: allElements.filter(e => e.type === 'code').length,
    charts: allElements.filter(e => e.type === 'chart' || (e.type as string) === 'd3-chart').length,
    text: allElements.filter(e => e.type === 'text' || e.type === 'heading').length,
    shapes: allElements.filter(e => e.type === 'shape').length,
    math: allElements.filter(e => e.type === 'math').length,
    tables: allElements.filter(e => e.type === 'table').length,
    videos: allElements.filter(e => e.type === 'video').length,
    threeD: allElements.filter(e => e.type === '3d').length,
  };

  const avgElementsPerSlide = slides.length > 0 ? (stats.elements / slides.length).toFixed(1) : '0';
  const emptySlides = slides.filter(s => s.elements.length === 0).length;
  const slidesWithNotes = slides.filter(s => s.notes && s.notes.trim()).length;

  // Draw a simple bar chart
  useEffect(() => {
    if (!chartRef.current || tab !== 'slides') return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    const w = chartRef.current.width;
    const h = chartRef.current.height;
    ctx.clearRect(0, 0, w, h);

    const maxEl = Math.max(...slides.map(s => s.elements.length), 1);
    const barW = Math.min(30, Math.floor((w - 40) / slides.length) - 2);

    slides.forEach((s, i) => {
      const barH = (s.elements.length / maxEl) * (h - 40);
      const x = 20 + i * (barW + 2);
      const y = h - 20 - barH;

      // Bar
      const grad = ctx.createLinearGradient(x, y, x, h - 20);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#71717a';
      ctx.font = '9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, x + barW / 2, h - 6);

      // Count
      if (s.elements.length > 0) {
        ctx.fillStyle = '#e4e4e7';
        ctx.fillText(`${s.elements.length}`, x + barW / 2, y - 4);
      }
    });
  }, [slides, tab]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9986] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxHeight: '85vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>📈 Presentation Analytics</h2>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-5 pt-3 gap-1 shrink-0">
            {(['overview', 'slides', 'engagement'] as const).map(t => (
              <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: tab === t ? 'var(--accent-dim)' : 'transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setTab(t)}
              >{t}</button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {tab === 'overview' && (
              <>
                {/* Top metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {METRIC_CARDS.map((card, i) => {
                    const values = [stats.slides, stats.elements, stats.images, stats.code, stats.charts, stats.text];
                    return (
                      <motion.div key={card.label}
                        className="p-3 rounded-xl"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span>{card.icon}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{card.label}</span>
                        </div>
                        <div className="text-xl font-bold" style={{ color: card.color }}>{values[i]}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick stats */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Avg elements/slide', value: avgElementsPerSlide },
                      { label: 'Empty slides', value: emptySlides },
                      { label: 'Slides with notes', value: `${slidesWithNotes}/${slides.length}` },
                      { label: 'Shapes', value: stats.shapes },
                      { label: 'Math equations', value: stats.math },
                      { label: 'Tables', value: stats.tables },
                      { label: 'Videos', value: stats.videos },
                      { label: '3D Elements', value: stats.threeD },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1 px-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Element distribution */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Element Distribution</h3>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Text', count: stats.text, color: '#6366f1' },
                      { label: 'Images', count: stats.images, color: '#ec4899' },
                      { label: 'Shapes', count: stats.shapes, color: '#f59e0b' },
                      { label: 'Code', count: stats.code, color: '#10b981' },
                      { label: 'Charts', count: stats.charts, color: '#8b5cf6' },
                      { label: 'Math', count: stats.math, color: '#06b6d4' },
                    ].filter(i => i.count > 0).map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] w-14 shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.elements > 0 ? (item.count / stats.elements) * 100 : 0}%` }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-[10px] w-8 text-right font-medium" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
                      </div>
                    ))}
                    {stats.elements === 0 && (
                      <div className="text-[10px] text-center py-2" style={{ color: 'var(--text-muted)' }}>No elements yet</div>
                    )}
                  </div>
                </div>
              </>
            )}

            {tab === 'slides' && (
              <>
                {/* Bar chart */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Elements per Slide</h3>
                  <canvas ref={chartRef} width={600} height={200} style={{ width: '100%', borderRadius: 8 }} />
                </div>

                {/* Slide list */}
                <div className="space-y-1">
                  {slides.map((slide, i) => (
                    <div key={slide.id} className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          Slide {i + 1} · {slide.elements.length} elements
                        </div>
                        <div className="flex gap-1 mt-0.5">
                          {[...new Set(slide.elements.map(e => e.type))].map(t => (
                            <span key={t} className="text-[8px] px-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{t}</span>
                          ))}
                          {slide.elements.length === 0 && <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>empty</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {slide.notes ? <span className="text-[8px] px-1 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>Notes</span> : null}
                        {slide.transition !== 'none' && <span className="text-[8px] px-1 rounded" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>{slide.transition}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'engagement' && (
              <>
                {/* Simulated engagement data */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Est. Presentation Time', value: `${Math.max(1, slides.length * 2)} min`, icon: '⏱️' },
                      { label: 'Interactive Elements', value: allElements.filter(e => ['code', 'quiz', 'poll'].includes(e.type)).length, icon: '🎯' },
                      { label: 'Visual Density Score', value: `${Math.min(100, Math.round(stats.elements / Math.max(1, slides.length) * 15))}%`, icon: '📊' },
                      { label: 'Accessibility Score', value: `${Math.max(50, 100 - emptySlides * 5 - (slides.length - slidesWithNotes) * 3)}%`, icon: '♿' },
                    ].map(m => (
                      <div key={m.label} className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span>{m.icon}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                        </div>
                        <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>💡 Improvement Tips</h3>
                  <div className="space-y-2">
                    {[
                      emptySlides > 0 && { text: `Remove ${emptySlides} empty slide(s) or add content`, priority: 'high' },
                      slidesWithNotes < slides.length && { text: `Add speaker notes to ${slides.length - slidesWithNotes} slide(s)`, priority: 'medium' },
                      stats.images === 0 && { text: 'Add images to make your presentation more engaging', priority: 'medium' },
                      stats.code > 0 && stats.charts === 0 && { text: 'Consider adding visualizations for code-heavy slides', priority: 'low' },
                      slides.length > 20 && { text: 'Consider breaking long presentations into sections', priority: 'low' },
                      stats.elements / Math.max(1, slides.length) > 10 && { text: 'Some slides may be too cluttered — simplify for clarity', priority: 'medium' },
                    ].filter(Boolean).map((tip, i) => tip && (
                      <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded" style={{ background: 'var(--bg-secondary)' }}>
                        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{
                          background: tip.priority === 'high' ? '#ef4444' : tip.priority === 'medium' ? '#f59e0b' : '#10b981'
                        }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-primary)' }}>{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
