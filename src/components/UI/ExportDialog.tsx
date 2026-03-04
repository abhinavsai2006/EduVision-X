'use client';
/* ═══════════════════════════════════════════════════════
   ExportDialog — Advanced export with format, quality,
   slide range, watermark, progress indicator
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { useToastStore } from '@/store/useToastStore';

const FORMATS = [
  { value: 'pdf', label: 'PDF Document', icon: '📄', desc: 'Print-ready document' },
  { value: 'pptx', label: 'PowerPoint', icon: '📊', desc: 'Editable PPTX file' },
  { value: 'html', label: 'HTML Package', icon: '🌐', desc: 'Interactive web export' },
  { value: 'png', label: 'PNG Images', icon: '🖼', desc: 'High-quality images' },
  { value: 'jpg', label: 'JPG Images', icon: '📸', desc: 'Compressed images' },
  { value: 'video', label: 'MP4 Video', icon: '🎬', desc: 'Animated video' },
  { value: 'markdown', label: 'Markdown', icon: '📝', desc: 'Plain text markup' },
  { value: 'gif', label: 'Animated GIF', icon: '🎞', desc: 'Animation export' },
] as const;

const QUALITIES = [
  { value: 'low', label: 'Low', desc: '72 DPI · Small file' },
  { value: 'medium', label: 'Medium', desc: '150 DPI · Balanced' },
  { value: 'high', label: 'High', desc: '300 DPI · Print quality' },
  { value: 'ultra', label: 'Ultra', desc: '600 DPI · Maximum' },
] as const;

export default function ExportDialog() {
  const open = useSlideStore(s => s.showExportDialog);
  const setOpen = useSlideStore(s => s.setShowExportDialog);
  const slides = useSlideStore(s => s.presentation.slides);
  const exportFormat = useSlideStore(s => s.exportFormat);
  const setExportFormat = useSlideStore(s => s.setExportFormat);
  const exportQuality = useSlideStore(s => s.exportQuality);
  const setExportQuality = useSlideStore(s => s.setExportQuality);
  const includeNotes = useSlideStore(s => s.exportIncludeNotes);
  const toggleNotes = useSlideStore(s => s.toggleExportNotes);
  const includeAnimations = useSlideStore(s => s.exportIncludeAnimations);
  const toggleAnimations = useSlideStore(s => s.toggleExportAnimations);
  const includeBg = useSlideStore(s => s.exportBackground);
  const toggleBg = useSlideStore(s => s.toggleExportBackground);
  const isExporting = useSlideStore(s => s.isExporting);
  const setIsExporting = useSlideStore(s => s.setIsExporting);
  const exportProgress = useSlideStore(s => s.exportProgress);
  const setExportProgress = useSlideStore(s => s.setExportProgress);
  const watermark = useSlideStore(s => s.watermark);
  const setWatermark = useSlideStore(s => s.setWatermark);
  const toast = useToastStore(s => s.addToast);

  const [rangeMode, setRangeMode] = useState<'all' | 'current' | 'custom'>('all');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(slides.length);
  const [watermarkEnabled, setWatermarkEnabled] = useState(!!watermark);
  const [watermarkText, setWatermarkText] = useState(watermark?.text || '');

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    if (watermarkEnabled && watermarkText) {
      setWatermark({ text: watermarkText, opacity: 0.3, position: 'bottomRight' });
    }

    try {
      const { exportPDF, exportHTML, exportPNG } = await import('@/lib/exports');
      const presentation = useSlideStore.getState().presentation;

      // Determine slide range
      let exportSlides = presentation.slides;
      const currentIdx = useSlideStore.getState().currentSlideIndex;
      if (rangeMode === 'current') {
        exportSlides = [presentation.slides[currentIdx]];
      } else if (rangeMode === 'custom') {
        exportSlides = presentation.slides.slice(rangeStart - 1, rangeEnd);
      }

      const exportPresentation = { ...presentation, slides: exportSlides };

      setExportProgress(20);
      await new Promise(r => setTimeout(r, 200));
      setExportProgress(50);

      switch (exportFormat) {
        case 'pdf':
          await exportPDF();
          break;
        case 'html':
          exportHTML(exportPresentation);
          break;
        case 'png':
          await exportPNG(rangeMode === 'current' ? currentIdx : 0);
          break;
        case 'markdown': {
          // Generate simple markdown export
          const md = exportPresentation.slides.map((s, i) =>
            `# Slide ${i + 1}\n\n` + s.elements.map(el => el.content || '').filter(Boolean).join('\n\n')
          ).join('\n\n---\n\n');
          const blob = new Blob([md], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${presentation.meta.title || 'presentation'}.md`;
          a.click();
          URL.revokeObjectURL(url);
          break;
        }
        default: {
          // Fallback: export as JSON download
          const blob = new Blob([JSON.stringify(exportPresentation, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${presentation.meta.title || 'presentation'}.${exportFormat}`;
          a.click();
          URL.revokeObjectURL(url);
          break;
        }
      }

      setExportProgress(100);
      toast('success', `Exported as ${exportFormat.toUpperCase()} successfully!`);
    } catch (err) {
      toast('error', `Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
      setTimeout(() => setOpen(false), 600);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isExporting && setOpen(false)}
      >
        <motion.div
          className="w-full max-w-2xl rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          initial={{ y: 20, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 20, scale: 0.97 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Export Presentation</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{slides.length} slides</p>
            </div>
            <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Format selection */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Format</label>
              <div className="grid grid-cols-4 gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f.value}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg transition-all"
                    style={{
                      background: exportFormat === f.value ? 'var(--accent-dim)' : 'var(--bg-primary)',
                      border: exportFormat === f.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: exportFormat === f.value ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExportFormat(f.value as typeof exportFormat)}
                  >
                    <span style={{ fontSize: 20 }}>{f.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{f.label}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Quality</label>
              <div className="grid grid-cols-4 gap-2">
                {QUALITIES.map(q => (
                  <button
                    key={q.value}
                    className="p-2.5 rounded-lg text-center transition-all"
                    style={{
                      background: exportQuality === q.value ? 'var(--accent-dim)' : 'var(--bg-primary)',
                      border: exportQuality === q.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: exportQuality === q.value ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExportQuality(q.value as typeof exportQuality)}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{q.label}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slide Range */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Slide Range</label>
              <div className="flex gap-2">
                {(['all', 'current', 'custom'] as const).map(m => (
                  <button
                    key={m}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                    style={{
                      background: rangeMode === m ? 'var(--accent-dim)' : 'var(--bg-primary)',
                      border: rangeMode === m ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: rangeMode === m ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setRangeMode(m)}
                  >
                    {m === 'all' ? `All (${slides.length})` : m === 'current' ? 'Current' : 'Custom'}
                  </button>
                ))}
              </div>
              {rangeMode === 'custom' && (
                <div className="flex items-center gap-2 mt-2">
                  <input className="input-field" type="number" min={1} max={slides.length} value={rangeStart}
                    onChange={e => setRangeStart(Number(e.target.value))} style={{ width: 60, padding: '4px 8px', fontSize: 12 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>to</span>
                  <input className="input-field" type="number" min={1} max={slides.length} value={rangeEnd}
                    onChange={e => setRangeEnd(Number(e.target.value))} style={{ width: 60, padding: '4px 8px', fontSize: 12 }} />
                </div>
              )}
            </div>

            {/* Options */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Options</label>
              <div className="space-y-2">
                {[
                  { label: 'Include speaker notes', checked: includeNotes, toggle: toggleNotes },
                  { label: 'Include animations', checked: includeAnimations, toggle: toggleAnimations },
                  { label: 'Include backgrounds', checked: includeBg, toggle: toggleBg },
                ].map(opt => (
                  <label key={opt.label} className="flex items-center gap-3 cursor-pointer" style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={opt.checked} onChange={opt.toggle}
                      style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Watermark */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={watermarkEnabled}
                  onChange={e => setWatermarkEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
                Add Watermark
              </label>
              {watermarkEnabled && (
                <input className="input-field w-full mt-2" placeholder="Watermark text…" value={watermarkText}
                  onChange={e => setWatermarkText(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: 12 }} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            {isExporting ? (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Exporting…</span>
                  <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{exportProgress}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'var(--bg-primary)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            ) : (
              <>
                <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 16px' }}
                  onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn-primary" style={{ fontSize: 12, padding: '8px 24px' }}
                  onClick={handleExport}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export {exportFormat.toUpperCase()}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
