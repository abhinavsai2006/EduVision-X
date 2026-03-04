'use client';
/* ═══════════════════════════════════════════════════════
   AccessibilityChecker — Slide accessibility audit panel
   ═══════════════════════════════════════════════════════ */
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

type CheckSeverity = 'error' | 'warning' | 'info' | 'pass';

interface Check {
  id: string;
  title: string;
  description: string;
  severity: CheckSeverity;
  slideIndex: number;
  elementId?: string;
  autoFix?: () => void;
}

const SEVERITY_COLORS: Record<CheckSeverity, string> = {
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#6366f1',
  pass: '#10b981',
};

const SEVERITY_LABELS: Record<CheckSeverity, string> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  pass: 'Pass',
};

interface Props { open: boolean; onClose: () => void; }

export default function AccessibilityChecker({ open, onClose }: Props) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const slides = useSlideStore(s => s.presentation.slides);
  const highContrast = useSlideStore(s => s.highContrast);
  const reducedMotion = useSlideStore(s => s.reducedMotion);
  const altTextEnforcement = useSlideStore(s => s.altTextEnforcement);
  const toggleHighContrast = useSlideStore(s => s.toggleHighContrast);
  const toggleReducedMotion = useSlideStore(s => s.toggleReducedMotion);
  const toggleAltTextEnforcement = useSlideStore(s => s.toggleAltTextEnforcement);
  const colorBlindMode = useSlideStore(s => s.colorBlindMode);
  const setColorBlindMode = useSlideStore(s => s.setColorBlindMode);
  const goToSlide = useSlideStore(s => s.goToSlide);

  const checks = useMemo<Check[]>(() => {
    if (!done) return [];
    const results: Check[] = [];

    slides.forEach((slide, si) => {
      // Check for images without alt text
      const images = slide.elements.filter(e => e.type === 'image');
      images.forEach(img => {
        if (!img.content || img.content === 'https://via.placeholder.com/400x300') {
          results.push({
            id: `alt-${si}-${img.id}`, title: 'Missing alt text',
            description: `Image on slide ${si + 1} has no alternative text.`,
            severity: 'error', slideIndex: si, elementId: img.id,
          });
        }
      });

      // Check for text contrast
      const texts = slide.elements.filter(e => e.type === 'text' || e.type === 'heading');
      texts.forEach(txt => {
        const fontSize = Number(txt.style?.fontSize ?? 16);
        if (fontSize < 14) {
          results.push({
            id: `size-${si}-${txt.id}`, title: 'Small text size',
            description: `Text on slide ${si + 1} is ${fontSize}px — may be hard to read in presentations.`,
            severity: 'warning', slideIndex: si, elementId: txt.id,
          });
        }
      });

      // Check for empty slides
      if (slide.elements.length === 0) {
        results.push({
          id: `empty-${si}`, title: 'Empty slide',
          description: `Slide ${si + 1} has no content.`,
          severity: 'info', slideIndex: si,
        });
      }

      // Check for too many elements
      if (slide.elements.length > 15) {
        results.push({
          id: `clutter-${si}`, title: 'Cluttered slide',
          description: `Slide ${si + 1} has ${slide.elements.length} elements — consider simplifying.`,
          severity: 'warning', slideIndex: si,
        });
      }

      // Check for missing slide notes (for screen readers)
      if (!slide.notes || slide.notes.trim() === '') {
        results.push({
          id: `notes-${si}`, title: 'No speaker notes',
          description: `Slide ${si + 1} has no speaker notes (helpful for screen reader users).`,
          severity: 'info', slideIndex: si,
        });
      }
    });

    // Overall checks
    if (slides.length > 50) {
      results.push({ id: 'length', title: 'Long presentation', description: `${slides.length} slides — consider breaking into sections.`, severity: 'warning', slideIndex: 0 });
    }

    // Pass checks
    if (results.filter(r => r.severity === 'error').length === 0) {
      results.push({ id: 'pass-critical', title: 'No critical issues', description: 'No critical accessibility errors found.', severity: 'pass', slideIndex: 0 });
    }

    return results;
  }, [done, slides]);

  const runAudit = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 1500);
  };

  const errorCount = checks.filter(c => c.severity === 'error').length;
  const warnCount = checks.filter(c => c.severity === 'warning').length;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9983] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxHeight: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>♿ Accessibility Checker</h2>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Quick settings */}
            <div className="p-3 rounded-xl space-y-2" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Quick Settings</div>
              {[
                { label: 'High Contrast', value: highContrast, toggle: toggleHighContrast },
                { label: 'Reduced Motion', value: reducedMotion, toggle: toggleReducedMotion },
                { label: 'Enforce Alt Text', value: altTextEnforcement, toggle: toggleAltTextEnforcement },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <button className="w-8 h-4 rounded-full transition-colors relative"
                    style={{ background: s.value ? 'var(--accent)' : 'var(--bg-hover)', border: 'none', cursor: 'pointer' }}
                    onClick={s.toggle}>
                    <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
                      style={{ left: s.value ? 17 : 2 }} />
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Color Blind Sim</span>
                <select className="input-field" value={colorBlindMode}
                  onChange={e => setColorBlindMode(e.target.value as typeof colorBlindMode)}
                  style={{ fontSize: 10, padding: '2px 6px', width: 110 }}>
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>
            </div>

            {/* Run audit */}
            <button className="btn-primary w-full" onClick={runAudit} disabled={running}
              style={{ fontSize: 12, opacity: running ? 0.6 : 1 }}>
              {running ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⟳</motion.span>
                  Scanning…
                </span>
              ) : done ? 'Re-run Audit' : 'Run Accessibility Audit'}
            </button>

            {/* Results */}
            {done && (
              <>
                {/* Summary */}
                <div className="flex gap-2">
                  {[
                    { label: 'Errors', count: errorCount, color: SEVERITY_COLORS.error },
                    { label: 'Warnings', count: warnCount, color: SEVERITY_COLORS.warning },
                    { label: 'Total', count: checks.length, color: 'var(--accent)' },
                  ].map(s => (
                    <div key={s.label} className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
                      <div className="text-lg font-bold" style={{ color: s.color }}>{s.count}</div>
                      <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Check list */}
                <div className="space-y-1">
                  {checks.map(c => (
                    <motion.div key={c.id}
                      className="flex items-start gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                      whileHover={{ x: 2 }}
                      onClick={() => { goToSlide(c.slideIndex); onClose(); }}
                    >
                      <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: SEVERITY_COLORS[c.severity] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.title}</span>
                          <span className="text-[8px] px-1 rounded" style={{ background: `${SEVERITY_COLORS[c.severity]}20`, color: SEVERITY_COLORS[c.severity] }}>
                            {SEVERITY_LABELS[c.severity]}
                          </span>
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.description}</div>
                      </div>
                      <span className="text-[9px] shrink-0" style={{ color: 'var(--text-muted)' }}>Slide {c.slideIndex + 1}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
