'use client';
/* ═══════════════════════════════════════════════════════
   PropertyPanel v5.0 — Premium property editor
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { SlideElement, ElementStyle, ANIMATIONS, AnimationType, TRANSITIONS, TransitionType } from '@/types/slide';

/* ── Reusable input row ─── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2" style={{ fontSize: 12 }}>
      <span className="shrink-0 text-right" style={{ width: 68, color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function Input({ value, onChange, type = 'text', ...props }: { value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; min?: string; max?: string; step?: string }) {
  return (
    <input
      className="input-field w-full"
      style={{ padding: '5px 8px', fontSize: 12 }}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      className="select-field w-full"
      style={{ padding: '5px 8px', fontSize: 12 }}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function normalizeMediaUrl(url: string): string {
  const v = url.trim();
  if (!v) return '';

  const yt1 = v.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/);
  const yt2 = v.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const yt3 = v.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  const ytId = yt1?.[1] || yt2?.[1] || yt3?.[1];
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;

  const vimeo = v.match(/vimeo\.com\/(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return v;
}

export default function PropertyPanel() {
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const selectedElementIds = useSlideStore(s => s.selectedElementIds);
  const updateElement = useSlideStore(s => s.updateElement);
  const setSlideBackground = useSlideStore(s => s.setSlideBackground);
  const updateSlideField = useSlideStore(s => s.updateSlideField);

  const slide = slides[currentSlideIndex];
  const el = selectedElementIds.length === 1
    ? slide?.elements.find(e => e.id === selectedElementIds[0]) ?? null
    : null;

  const update = (patch: Partial<SlideElement>) => {
    if (el) updateElement(el.id, patch);
  };

  const updateStyle = (key: string, value: unknown) => {
    if (!el) return;
    updateElement(el.id, { style: { ...el.style, [key]: value } });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2.5 space-y-2 pb-20">

        {/* ── No selection → Slide props ─── */}
        {!el && (
          <>
            <Section title="Background">
              <Row label="Type">
                <Select value={slide.background.type}
                  onChange={v => setSlideBackground({ ...slide.background, type: v as 'solid' | 'gradient' | 'image' | 'pattern' })}
                  options={[{ value: 'solid', label: 'Solid' }, { value: 'gradient', label: 'Gradient' }, { value: 'image', label: 'Image' }, { value: 'pattern', label: 'Pattern' }]} />
              </Row>
              <Row label="Value">
                {slide.background.type === 'solid' ? (
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={slide.background.value} onChange={e => setSlideBackground({ ...slide.background, value: e.target.value })} />
                ) : (
                  <Input value={slide.background.value}
                    onChange={v => setSlideBackground({ ...slide.background, value: v })} />
                )}
              </Row>
              {/* Background presets */}
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Presets</div>
              <div className="grid grid-cols-5 gap-1">
                {['#ffffff', '#1a1a2e', '#2d3436', '#f5f6fa', '#ffeaa7',
                  'linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)',
                  'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)',
                  'linear-gradient(135deg, #fa709a, #fee140)'].map((v, i) => (
                  <button key={i} className="w-full h-5 rounded border cursor-pointer"
                    style={{ background: v, borderColor: slide.background.value === v ? 'var(--accent)' : 'var(--border)' }}
                    onClick={() => setSlideBackground({ type: v.startsWith('linear') ? 'gradient' : 'solid', value: v })} />
                ))}
              </div>
            </Section>
            <Section title="Transition">
              <Row label="Effect">
                <Select value={slide.transition || 'none'}
                  onChange={v => updateSlideField('transition', v)}
                  options={TRANSITIONS.map(t => ({ value: t, label: t }))} />
              </Row>
            </Section>
            <Section title="Layout">
              <Row label="Layout">
                <Select value={slide.layout}
                  onChange={v => updateSlideField('layout', v)}
                  options={['blank', 'title', 'content', 'two-column', 'image-left', 'image-right'].map(l => ({ value: l, label: l }))} />
              </Row>
            </Section>
            <Section title="Notes">
              <textarea className="w-full h-20 px-2 py-1 rounded text-xs outline-none resize-none"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                value={slide.notes}
                onChange={e => updateSlideField('notes', e.target.value)} />
            </Section>
          </>
        )}

        {/* ── Element selected ─── */}
        {el && (
          <>
            {/* Position / Size */}
            <Section title="Transform">
              <Row label="X"><Input type="number" value={el.x} onChange={v => update({ x: +v })} /></Row>
              <Row label="Y"><Input type="number" value={el.y} onChange={v => update({ y: +v })} /></Row>
              <Row label="W"><Input type="number" value={el.width} onChange={v => update({ width: +v })} /></Row>
              <Row label="H"><Input type="number" value={el.height} onChange={v => update({ height: +v })} /></Row>
              <Row label="Rotation"><Input type="number" value={el.rotation} onChange={v => update({ rotation: +v })} /></Row>
              <Row label="Opacity">
                <input type="range" min="0" max="1" step="0.05" className="w-full"
                  value={el.opacity} onChange={e => update({ opacity: +e.target.value })} />
              </Row>
            </Section>

            {/* Content (for text-based elements) */}
            {hasContent(el) && (
              <Section title="Content">
                <textarea className="w-full h-16 px-2 py-1 rounded text-xs outline-none resize-none"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                  value={el.content || ''}
                  onChange={e => update({ content: e.target.value })} />
              </Section>
            )}

            {/* Heading */}
            {el.type === 'heading' && (
              <Section title="Heading">
                <Row label="Level">
                  <Select value={String(el.level || 1)}
                    onChange={v => update({ level: +v })}
                    options={[1, 2, 3, 4, 5, 6].map(l => ({ value: String(l), label: `H${l}` }))} />
                </Row>
              </Section>
            )}

            {/* Typography */}
            {hasTypography(el) && (
              <Section title="Typography">
                <Row label="Font Size"><Input value={el.style?.fontSize || '20px'}
                  onChange={v => updateStyle('fontSize', v)} /></Row>
                <Row label="Font">
                  <Select value={el.style?.fontFamily || 'Inter'}
                    onChange={v => updateStyle('fontFamily', v)}
                    options={['Inter', 'Arial', 'Georgia', 'Fira Code', 'Courier New', 'Verdana', 'Times New Roman'].map(f => ({ value: f, label: f }))} />
                </Row>
                <Row label="Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.color || '#333333'}
                    onChange={e => updateStyle('color', e.target.value)} />
                </Row>
                <Row label="Weight">
                  <Select value={el.style?.fontWeight || 'normal'}
                    onChange={v => updateStyle('fontWeight', v)}
                    options={[{ value: 'normal', label: 'Normal' }, { value: 'bold', label: 'Bold' }, { value: '300', label: 'Light' }]} />
                </Row>
                <Row label="Align">
                  <Select value={el.style?.textAlign || 'left'}
                    onChange={v => updateStyle('textAlign', v)}
                    options={['left', 'center', 'right', 'justify'].map(a => ({ value: a, label: a }))} />
                </Row>
              </Section>
            )}

            {/* Text Effects */}
            {hasTypography(el) && (
              <Section title="Text Effects">
                <Row label="Underline">
                  <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={(el.style?.textDecoration as string) === 'underline'}
                      onChange={e => updateStyle('textDecoration', e.target.checked ? 'underline' : 'none')} />
                    Underline
                  </label>
                </Row>
                <Row label="Shadow">
                  <Input value={(el.style?.textShadow as string) || ''} onChange={v => updateStyle('textShadow', v)} placeholder="2px 2px 4px #000" />
                </Row>
                <Row label="Outline">
                  <Input value={(el.style?.textOutline as string) || ''} onChange={v => updateStyle('textOutline', v)} placeholder="1px #000" />
                </Row>
                <Row label="Spacing">
                  <Input value={(el.style?.letterSpacing as string) || ''} onChange={v => updateStyle('letterSpacing', v)} placeholder="2px" />
                </Row>
                <Row label="Gradient">
                  <Input value={(el.style?.gradientText as string) || ''} onChange={v => updateStyle('gradientText', v)} placeholder="linear-gradient(90deg, #f00, #00f)" />
                </Row>
                <div className="flex gap-1 flex-wrap mt-1">
                  {[
                    { label: 'Fire', val: 'linear-gradient(90deg, #ff512f, #f09819)' },
                    { label: 'Ocean', val: 'linear-gradient(90deg, #2193b0, #6dd5ed)' },
                    { label: 'Neon', val: 'linear-gradient(90deg, #f953c6, #b91d73)' },
                    { label: 'Gold', val: 'linear-gradient(90deg, #f7971e, #ffd200)' },
                  ].map(p => (
                    <button key={p.label} className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                      onClick={() => updateStyle('gradientText', p.val)}>
                      {p.label}
                    </button>
                  ))}
                  {el.style?.gradientText && (
                    <button className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-hover)', color: '#e74c3c', border: '1px solid var(--border)' }}
                      onClick={() => updateStyle('gradientText', '')}>
                      Clear
                    </button>
                  )}
                </div>
              </Section>
            )}

            {/* Flip & Aspect Lock */}
            <Section title="Flip / Lock">
              <div className="flex gap-2">
                <button className="flex-1 text-[11px] px-2 py-1.5 rounded-md transition-all"
                  style={{ background: el.flipH ? 'var(--accent)' : 'var(--bg-input)', color: el.flipH ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border-bold)' }}
                  onClick={() => update({ flipH: !el.flipH })}>
                  ↔ Flip H
                </button>
                <button className="flex-1 text-[11px] px-2 py-1.5 rounded-md transition-all"
                  style={{ background: el.flipV ? 'var(--accent)' : 'var(--bg-input)', color: el.flipV ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border-bold)' }}
                  onClick={() => update({ flipV: !el.flipV })}>
                  ↕ Flip V
                </button>
              </div>
              <label className="flex items-center gap-2 text-[11px] cursor-pointer mt-1" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={el.aspectLock || false} onChange={e => update({ aspectLock: e.target.checked })} />
                🔒 Lock Aspect Ratio
              </label>
            </Section>

            {/* Shape */}
            {el.type === 'shape' && (
              <Section title="Shape">
                <Row label="Shape">
                  <Select value={el.shape || 'rectangle'}
                    onChange={v => update({ shape: v })}
                    options={[
                      'rectangle', 'circle', 'ellipse', 'triangle', 'diamond', 'star',
                      'pentagon', 'hexagon', 'trapezoid', 'parallelogram', 'arrow', 'heart',
                    ].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
                </Row>
                <Row label="Fill">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.fill || '#6366f1'}
                    onChange={e => updateStyle('fill', e.target.value)} />
                </Row>
                <Row label="Stroke">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.stroke || '#4f46e5'}
                    onChange={e => updateStyle('stroke', e.target.value)} />
                </Row>
                <Row label="Label">
                  <Input value={el.shapeText || ''} onChange={v => update({ shapeText: v })} placeholder="Text inside shape" />
                </Row>
              </Section>
            )}

            {/* Chart */}
            {el.type === 'chart' && (
              <Section title="Chart">
                <Row label="Type">
                  <Select value={el.chartType || 'bar'}
                    onChange={v => update({ chartType: v })}
                    options={['bar', 'line', 'pie', 'doughnut', 'scatter', 'radar'].map(t => ({ value: t, label: t }))} />
                </Row>
                <Row label="Labels">
                  <Input value={(el.data && 'labels' in (el.data as object) ? (el.data as { labels: string[] }).labels.join(',') : 'A,B,C,D')}
                    onChange={v => {
                      const labels = v.split(',');
                      const existing = el.data && 'values' in (el.data as object) ? (el.data as { values: number[] }).values : [30, 50, 20, 40];
                      update({ data: { labels, values: existing } });
                    }} />
                </Row>
                <Row label="Values">
                  <Input value={(el.data && 'values' in (el.data as object) ? (el.data as { values: number[] }).values.join(',') : '30,50,20,40')}
                    onChange={v => {
                      const values = v.split(',').map(Number);
                      const existing = el.data && 'labels' in (el.data as object) ? (el.data as { labels: string[] }).labels : ['A', 'B', 'C', 'D'];
                      update({ data: { labels: existing, values } });
                    }} />
                </Row>
              </Section>
            )}

            {/* Code */}
            {el.type === 'code' && (
              <Section title="Code">
                <Row label="Language">
                  <Select value={el.language || 'javascript'}
                    onChange={v => update({ language: v })}
                    options={['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown', 'cpp', 'java', 'rust', 'go', 'sql'].map(l => ({ value: l, label: l }))} />
                </Row>
                <Row label="Executable">
                  <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={el.executable || false} onChange={e => update({ executable: e.target.checked })} />
                    Allow execution
                  </label>
                </Row>
              </Section>
            )}

            {/* Image */}
            {el.type === 'image' && (
              <Section title="Image">
                <Row label="URL"><Input value={el.src || ''} onChange={v => update({ src: v })} /></Row>
                <Row label="Alt"><Input value={el.alt || ''} onChange={v => update({ alt: v })} /></Row>
                <Row label="Fit">
                  <Select value={el.objectFit || 'contain'}
                    onChange={v => update({ objectFit: v })}
                    options={['contain', 'cover', 'fill', 'none'].map(f => ({ value: f, label: f }))} />
                </Row>
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={async () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async () => {
                      const file = input.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const { url } = await res.json();
                        update({ src: url });
                      } catch { /* ignore */ }
                    };
                    input.click();
                  }}>
                  Upload Image
                </button>
              </Section>
            )}

            {/* Image Filters */}
            {el.type === 'image' && (
              <Section title="Filters">
                <Row label="Brightness">
                  <input type="range" min="0" max="200" step="5" className="w-full"
                    value={parseInt(el.style?.brightness as string || '100')}
                    onChange={e => updateStyle('brightness', e.target.value)} />
                </Row>
                <Row label="Contrast">
                  <input type="range" min="0" max="200" step="5" className="w-full"
                    value={parseInt(el.style?.contrast as string || '100')}
                    onChange={e => updateStyle('contrast', e.target.value)} />
                </Row>
                <Row label="Saturate">
                  <input type="range" min="0" max="200" step="5" className="w-full"
                    value={parseInt(el.style?.saturate as string || '100')}
                    onChange={e => updateStyle('saturate', e.target.value)} />
                </Row>
                <Row label="Blur (px)">
                  <input type="range" min="0" max="20" step="1" className="w-full"
                    value={parseInt(el.style?.blurPx as string || '0')}
                    onChange={e => updateStyle('blurPx', e.target.value)} />
                </Row>
                <Row label="Grayscale">
                  <input type="range" min="0" max="100" step="5" className="w-full"
                    value={parseInt(el.style?.grayscale as string || '0')}
                    onChange={e => updateStyle('grayscale', e.target.value)} />
                </Row>
                <Row label="Sepia">
                  <input type="range" min="0" max="100" step="5" className="w-full"
                    value={parseInt(el.style?.sepia as string || '0')}
                    onChange={e => updateStyle('sepia', e.target.value)} />
                </Row>
                <Row label="Hue Rotate">
                  <input type="range" min="0" max="360" step="5" className="w-full"
                    value={parseInt(el.style?.hueRotate as string || '0')}
                    onChange={e => updateStyle('hueRotate', e.target.value)} />
                </Row>
                <button className="btn-ghost mt-1" style={{ padding: '3px 10px', fontSize: 11, color: 'var(--text-secondary)' }}
                  onClick={() => {
                    updateStyle('brightness', '100');
                    updateStyle('contrast', '100');
                    updateStyle('saturate', '100');
                    updateStyle('blurPx', '0');
                    updateStyle('grayscale', '0');
                    updateStyle('sepia', '0');
                    updateStyle('hueRotate', '0');
                  }}>
                  Reset Filters
                </button>
              </Section>
            )}

            {/* Video */}
            {el.type === 'video' && (
              <Section title="Video">
                <Row label="URL"><Input value={el.src || ''} onChange={v => update({ src: normalizeMediaUrl(v) })} placeholder="YouTube/Vimeo/direct .mp4 URL" /></Row>
                <Row label="Autoplay">
                  <input type="checkbox" checked={el.autoplay || false} onChange={e => update({ autoplay: e.target.checked })} />
                </Row>
                <Row label="Loop">
                  <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={(el.style?.loop as boolean) || false} onChange={e => updateStyle('loop', e.target.checked)} />
                    Loop playback
                  </label>
                </Row>
                <Row label="Muted">
                  <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={(el.style?.muted as boolean) || false} onChange={e => updateStyle('muted', e.target.checked)} />
                    Mute audio
                  </label>
                </Row>
                <Row label="Poster URL">
                  <Input value={(el.style?.poster as string) || ''} onChange={v => updateStyle('poster', v)} placeholder="Thumbnail URL" />
                </Row>
                <div className="flex gap-2 mt-1">
                  <button className="btn-primary" style={{ padding: '3px 10px', fontSize: 11 }}
                    onClick={async () => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*';
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: fd });
                          const { url } = await res.json();
                          update({ src: url });
                        } catch { /* ignore */ }
                      };
                      input.click();
                    }}>
                    Upload Video
                  </button>
                </div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Tip: Paste YouTube/Vimeo links to auto-convert for slide preview.
                </div>
              </Section>
            )}

            {/* Audio */}
            {el.type === 'audio' && (
              <Section title="Audio">
                <Row label="URL"><Input value={el.src || ''} onChange={v => update({ src: v.trim() })} placeholder="Direct .mp3/.wav URL" /></Row>
                <div className="flex gap-2 mt-1">
                  <button className="btn-primary" style={{ padding: '3px 10px', fontSize: 11 }}
                    onClick={async () => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'audio/*';
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: fd });
                          const { url } = await res.json();
                          update({ src: url });
                        } catch { /* ignore */ }
                      };
                      input.click();
                    }}>
                    Upload Audio
                  </button>
                </div>
              </Section>
            )}

            {/* Table */}
            {el.type === 'table' && (
              <Section title="Table">
                <Row label="Rows"><Input type="number" value={el.rows || (Array.isArray(el.data) ? (el.data as string[][]).length : 3)} onChange={v => {
                  const rows = +v;
                  const data = (Array.isArray(el.data) ? el.data : [['H1', 'H2', 'H3'], ['a', 'b', 'c'], ['d', 'e', 'f']]) as string[][];
                  while (data.length < rows) data.push(Array(data[0]?.length || 3).fill(''));
                  while (data.length > rows && data.length > 1) data.pop();
                  update({ data, rows });
                }} /></Row>
                <Row label="Cols"><Input type="number" value={el.cols || (Array.isArray(el.data) && (el.data as string[][])[0] ? (el.data as string[][])[0].length : 3)} onChange={v => {
                  const cols = +v;
                  const data = (Array.isArray(el.data) ? el.data : [['H1', 'H2', 'H3'], ['a', 'b', 'c']]) as string[][];
                  const nd = data.map(row => {
                    while (row.length < cols) row.push('');
                    return row.slice(0, cols);
                  });
                  update({ data: nd, cols });
                }} /></Row>
                <Row label="CSV Data">
                  <textarea className="w-full h-16 px-2 py-1 rounded text-[10px] outline-none resize-none font-mono"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                    value={Array.isArray(el.data) ? (el.data as string[][]).map(r => r.join(',')).join('\n') : ''}
                    onChange={e => {
                      const data = e.target.value.split('\n').map(r => r.split(','));
                      update({ data });
                    }} />
                </Row>
                <Row label="Header Bg">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={(el.style?.headerBg as string) || '#6366f1'}
                    onChange={e => updateStyle('headerBg', e.target.value)} />
                </Row>
                <Row label="Border">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={(el.style?.borderColor as string) || '#dfe6e9'}
                    onChange={e => updateStyle('borderColor', e.target.value)} />
                </Row>
              </Section>
            )}

            {/* Quiz */}
            {el.type === 'quiz' && (
              <Section title="Quiz">
                <Row label="Question"><Input value={el.question || ''} onChange={v => update({ question: v })} /></Row>
                <Row label="Correct">
                  <Input type="number" value={el.correct ?? 0} onChange={v => update({ correct: +v })} />
                </Row>
                {(el.options || []).map((opt, i) => (
                  <Row key={i} label={`Option ${i + 1}`}>
                    <Input value={opt} onChange={v => {
                      const opts = [...(el.options || [])];
                      opts[i] = v;
                      update({ options: opts });
                    }} />
                  </Row>
                ))}
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={() => update({ options: [...(el.options || []), `Option ${(el.options || []).length + 1}`] })}>
                  + Add Option
                </button>
              </Section>
            )}

            {/* Poll */}
            {el.type === 'poll' && (
              <Section title="Poll">
                <Row label="Question"><Input value={el.question || ''} onChange={v => update({ question: v })} /></Row>
                {(el.options || []).map((opt, i) => (
                  <Row key={i} label={`Option ${i + 1}`}>
                    <Input value={opt} onChange={v => {
                      const opts = [...(el.options || [])];
                      opts[i] = v;
                      update({ options: opts });
                    }} />
                  </Row>
                ))}
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={() => {
                    update({
                      options: [...(el.options || []), `Option ${(el.options || []).length + 1}`],
                      votes: [...(el.votes || []), 0],
                    });
                  }}>
                  + Add Option
                </button>
              </Section>
            )}

            {/* Flashcard */}
            {el.type === 'flashcard' && (
              <Section title="Flashcard">
                <Row label="Front"><Input value={el.front || ''} onChange={v => update({ front: v })} /></Row>
                <Row label="Back"><Input value={el.back || ''} onChange={v => update({ back: v })} /></Row>
                <Row label="Front Bg">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={(el.style?.frontBg as string) || '#ffffff'}
                    onChange={e => updateStyle('frontBg', e.target.value)} />
                </Row>
                <Row label="Back Bg">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={(el.style?.backBg as string) || '#f8f9fa'}
                    onChange={e => updateStyle('backBg', e.target.value)} />
                </Row>
              </Section>
            )}

            {/* Timer */}
            {el.type === 'timer' && (
              <Section title="Timer">
                <Row label="Duration (s)"><Input type="number" value={el.duration || 300} onChange={v => update({ duration: +v })} min="1" max="7200" /></Row>
                <Row label="Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.color || '#6366f1'}
                    onChange={e => updateStyle('color', e.target.value)} />
                </Row>
              </Section>
            )}

            {/* Progress */}
            {el.type === 'progress' && (
              <Section title="Progress">
                <Row label="Value"><Input type="number" value={el.value ?? 65} onChange={v => update({ value: +v })} /></Row>
                <Row label="Max"><Input type="number" value={el.max ?? 100} onChange={v => update({ max: +v })} /></Row>
                <Row label="Label"><Input value={el.label || ''} onChange={v => update({ label: v })} /></Row>
                <Row label="Bar Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={(el.style?.barColor as string) || '#6366f1'}
                    onChange={e => updateStyle('barColor', e.target.value)} />
                </Row>
              </Section>
            )}

            {/* Callout */}
            {el.type === 'callout' && (
              <Section title="Callout">
                <Row label="Type">
                  <Select value={el.calloutType || 'info'}
                    onChange={v => update({ calloutType: v })}
                    options={['info', 'warning', 'success', 'error', 'tip'].map(t => ({ value: t, label: t }))} />
                </Row>
              </Section>
            )}

            {/* Connector */}
            {el.type === 'connector' && (
              <Section title="Connector">
                <Row label="Line Style">
                  <Select value={el.lineStyle || 'solid'}
                    onChange={v => update({ lineStyle: v })}
                    options={['solid', 'dashed', 'dotted'].map(s => ({ value: s, label: s }))} />
                </Row>
                <Row label="End Cap">
                  <Select value={el.endCap || 'arrow'}
                    onChange={v => update({ endCap: v })}
                    options={['none', 'arrow', 'circle'].map(c => ({ value: c, label: c }))} />
                </Row>
                <Row label="Start Cap">
                  <Select value={el.startCap || 'none'}
                    onChange={v => update({ startCap: v })}
                    options={['none', 'arrow', 'circle'].map(c => ({ value: c, label: c }))} />
                </Row>
                <Row label="Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.stroke || '#6366f1'}
                    onChange={e => updateStyle('stroke', e.target.value)} />
                </Row>
                <Row label="Width"><Input type="number" value={el.lineWidth || 2} onChange={v => update({ lineWidth: +v })} min="1" max="10" /></Row>
              </Section>
            )}

            {/* Icon */}
            {el.type === 'icon' && (
              <Section title="Icon">
                <Row label="Emoji"><Input value={el.icon || '⭐'} onChange={v => update({ icon: v })} /></Row>
                <Row label="Size"><Input type="number" value={parseInt(el.style?.fontSize as string || '48')} onChange={v => updateStyle('fontSize', v + 'px')} min="12" max="200" /></Row>
              </Section>
            )}

            {/* List */}
            {el.type === 'list' && (
              <Section title="List">
                <Row label="Type">
                  <Select value={el.listType || 'bullet'}
                    onChange={v => update({ listType: v })}
                    options={[{ value: 'bullet', label: 'Bullet' }, { value: 'numbered', label: 'Numbered' }]} />
                </Row>
                <Row label="Bullet">
                  <Select value={el.bulletStyle || 'default'}
                    onChange={v => update({ bulletStyle: v })}
                    options={[{ value: 'default', label: 'Default' }, { value: 'check', label: '✓ Check' }, { value: 'arrow', label: '→ Arrow' }, { value: 'star', label: '★ Star' }, { value: 'dash', label: '– Dash' }, { value: 'diamond', label: '◆ Diamond' }]} />
                </Row>
                <Row label="Indent">
                  <Input type="number" value={el.indentLevel || 0} onChange={v => update({ indentLevel: +v })} min="0" max="5" />
                </Row>
                {(el.items || []).map((item, i) => (
                  <Row key={i} label={`Item ${i + 1}`}>
                    <Input value={item} onChange={v => {
                      const items = [...(el.items || [])];
                      items[i] = v;
                      update({ items });
                    }} />
                  </Row>
                ))}
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={() => update({ items: [...(el.items || []), `Item ${(el.items || []).length + 1}`] })}>
                  + Add Item
                </button>
              </Section>
            )}

            {/* Timeline */}
            {el.type === 'timeline' && (
              <Section title="Timeline">
                {(el.entries || []).map((ent, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <Input value={ent.date} onChange={v => {
                      const entries = [...(el.entries || [])];
                      entries[i] = { ...entries[i], date: v };
                      update({ entries });
                    }} />
                    <Input value={ent.text} onChange={v => {
                      const entries = [...(el.entries || [])];
                      entries[i] = { ...entries[i], text: v };
                      update({ entries });
                    }} />
                  </div>
                ))}
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={() => update({ entries: [...(el.entries || []), { date: '2024', text: 'Event' }] })}>
                  + Add Entry
                </button>
              </Section>
            )}

            {/* Divider */}
            {el.type === 'divider' && (
              <Section title="Divider">
                <Row label="Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.background as string || '#dfe6e9'}
                    onChange={e => updateStyle('background', e.target.value)} />
                </Row>
              </Section>
            )}

            {/* Mermaid */}
            {el.type === 'mermaid' && (
              <Section title="Mermaid">
                <textarea className="w-full h-24 px-2 py-1 rounded text-[10px] outline-none resize-none font-mono"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                  value={el.content || 'graph TD\n A-->B'}
                  onChange={e => update({ content: e.target.value })} />
              </Section>
            )}

            {/* 3D */}
            {el.type === '3d' && (
              <Section title="3D Element">
                <Row label="Shape">
                  <Select value={el.shape3d || 'cube'}
                    onChange={v => update({ shape3d: v })}
                    options={['cube', 'sphere', 'torus', 'cone', 'cylinder', 'octahedron', 'dodecahedron', 'knot'].map(s => ({ value: s, label: s }))} />
                </Row>
                <Row label="Color">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.color3d || '#667eea'}
                    onChange={e => update({ color3d: e.target.value })} />
                </Row>
                <Row label="Wireframe">
                  <input type="checkbox" checked={el.wireframe3d || false} onChange={e => update({ wireframe3d: e.target.checked })} />
                </Row>
              </Section>
            )}

            {/* Embed */}
            {el.type === 'embed' && (
              <Section title="Embed">
                <textarea className="w-full h-24 px-2 py-1 rounded text-[10px] outline-none resize-none font-mono"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                  placeholder="Paste HTML or iframe code..."
                  value={el.html || ''}
                  onChange={e => update({ html: e.target.value })} />
                <Row label="Sandbox">
                  <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={(el.style?.sandbox as boolean) ?? true} onChange={e => updateStyle('sandbox', e.target.checked)} />
                    Sandbox iframe
                  </label>
                </Row>
              </Section>
            )}

            {/* Word Cloud */}
            {el.type === 'wordcloud' && (
              <Section title="Word Cloud">
                {(el.words || []).map((w, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <Input value={w.text} onChange={v => {
                      const words = [...(el.words || [])];
                      words[i] = { ...words[i], text: v };
                      update({ words });
                    }} />
                    <input type="number" className="w-14 px-1 py-1 rounded text-xs outline-none"
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                      value={w.weight} min={1} max={100}
                      onChange={e => {
                        const words = [...(el.words || [])];
                        words[i] = { ...words[i], weight: +e.target.value };
                        update({ words });
                      }} />
                    <button className="text-[10px] text-red-400" onClick={() => {
                      const words = (el.words || []).filter((_, j) => j !== i);
                      update({ words });
                    }}>✕</button>
                  </div>
                ))}
                <button className="btn-primary mt-1" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={() => update({ words: [...(el.words || []), { text: 'Word', weight: 5 }] })}>
                  + Add Word
                </button>
              </Section>
            )}

            {/* Function Plot */}
            {el.type === 'functionplot' && (
              <Section title="Function Plot">
                <Row label="f(x)">
                  <Input value={el.fn || 'Math.sin(x)'} onChange={v => update({ fn: v })} placeholder="Math.sin(x)" />
                </Row>
                <Row label="X Min">
                  <Input type="number" value={el.xMin ?? -10} onChange={v => update({ xMin: +v })} />
                </Row>
                <Row label="X Max">
                  <Input type="number" value={el.xMax ?? 10} onChange={v => update({ xMax: +v })} />
                </Row>
                <Row label="Stroke">
                  <input type="color" className="w-full h-6 rounded cursor-pointer"
                    value={el.style?.stroke || '#6366f1'}
                    onChange={e => updateStyle('stroke', e.target.value)} />
                </Row>
                <div className="flex gap-1 flex-wrap mt-1">
                  {[
                    { label: 'sin(x)', fn: 'Math.sin(x)' },
                    { label: 'cos(x)', fn: 'Math.cos(x)' },
                    { label: 'x²', fn: 'x*x' },
                    { label: 'tan(x)', fn: 'Math.tan(x)' },
                    { label: '1/x', fn: '1/x' },
                    { label: 'sqrt(x)', fn: 'Math.sqrt(Math.abs(x))' },
                  ].map(p => (
                    <button key={p.label} className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                      onClick={() => update({ fn: p.fn })}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* QR Code */}
            {el.type === 'qrcode' && (
              <Section title="QR Code">
                <Row label="Text/URL">
                  <Input value={el.qrText || 'https://example.com'} onChange={v => update({ qrText: v })} placeholder="URL or text" />
                </Row>
              </Section>
            )}

            {/* Shadow */}
            <Section title="Shadow">
              <Row label="Enable">
                <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={!!(el.style?.boxShadow as string)} onChange={e => {
                    if (e.target.checked) updateStyle('boxShadow', '0 4px 12px rgba(0,0,0,0.15)');
                    else updateStyle('boxShadow', '');
                  }} />
                  Box Shadow
                </label>
              </Row>
              {(el.style?.boxShadow as string) && (
                <>
                  <Row label="X"><Input type="number" value={parseInt((el.style?.shadowX as string) || '0')} onChange={v => {
                    const sx = v, sy = el.style?.shadowY || '4', sb = el.style?.shadowBlur || '12', sc = el.style?.shadowColor || 'rgba(0,0,0,0.15)';
                    updateStyle('shadowX', sx); updateStyle('boxShadow', `${sx}px ${sy}px ${sb}px ${sc}`);
                  }} /></Row>
                  <Row label="Y"><Input type="number" value={parseInt((el.style?.shadowY as string) || '4')} onChange={v => {
                    const sx = el.style?.shadowX || '0', sy = v, sb = el.style?.shadowBlur || '12', sc = el.style?.shadowColor || 'rgba(0,0,0,0.15)';
                    updateStyle('shadowY', sy); updateStyle('boxShadow', `${sx}px ${sy}px ${sb}px ${sc}`);
                  }} /></Row>
                  <Row label="Blur"><Input type="number" value={parseInt((el.style?.shadowBlur as string) || '12')} onChange={v => {
                    const sx = el.style?.shadowX || '0', sy = el.style?.shadowY || '4', sb = v, sc = el.style?.shadowColor || 'rgba(0,0,0,0.15)';
                    updateStyle('shadowBlur', sb); updateStyle('boxShadow', `${sx}px ${sy}px ${sb}px ${sc}`);
                  }} /></Row>
                  <Row label="Color">
                    <input type="color" className="w-full h-6 rounded cursor-pointer"
                      value={(el.style?.shadowColor as string) || '#000000'}
                      onChange={e => {
                        const sx = el.style?.shadowX || '0', sy = el.style?.shadowY || '4', sb = el.style?.shadowBlur || '12';
                        updateStyle('shadowColor', e.target.value); updateStyle('boxShadow', `${sx}px ${sy}px ${sb}px ${e.target.value}`);
                      }} />
                  </Row>
                </>
              )}
            </Section>

            {/* Border Radius */}
            <Section title="Border">
              <Row label="Radius">
                <Input type="number" value={parseInt(el.style?.borderRadius as string || '0')} onChange={v => updateStyle('borderRadius', v + 'px')} min="0" max="100" />
              </Row>
              <Row label="Border">
                <Input value={(el.style?.border as string) || ''} onChange={v => updateStyle('border', v)} placeholder="e.g. 2px solid #333" />
              </Row>
            </Section>

            {/* Animation */}
            <Section title="Animation">
              <Row label="Effect">
                <Select
                  value={el.animation || 'none'}
                  onChange={v => update({ animation: v as AnimationType })}
                  options={ANIMATIONS.map(a => ({ value: a, label: a }))}
                />
              </Row>
              <Row label="Trigger">
                <Select value={el.animTrigger || 'auto'}
                  onChange={v => update({ animTrigger: v as 'auto' | 'click' | 'withPrevious' })}
                  options={[{ value: 'auto', label: 'Auto (on slide)' }, { value: 'click', label: 'On Click' }, { value: 'withPrevious', label: 'With Previous' }]} />
              </Row>
            </Section>

            {/* Glow Effect */}
            <Section title="Glow">
              <Row label="Glow">
                <Input value={(el.style?.glow as string) || ''} onChange={v => updateStyle('glow', v)} placeholder="8px #6366f1" />
              </Row>
              <div className="flex gap-1 flex-wrap mt-1">
                {[
                  { label: 'Indigo Glow', val: '8px #6366f1' },
                  { label: 'Blue', val: '8px #3b82f6' },
                  { label: 'Gold', val: '8px #fdcb6e' },
                  { label: 'Red', val: '8px #e74c3c' },
                  { label: 'None', val: '' },
                ].map(p => (
                  <button key={p.label} className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-bold)', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => updateStyle('glow', p.val)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Lock */}
            <Section title="Options">
              <label className="flex items-center gap-2 text-[11px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={el.locked} onChange={e => update({ locked: e.target.checked })} />
                Locked
              </label>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Section wrapper (collapsible, animated) ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="panel-section">
      <button
        className="panel-section-title flex items-center gap-2 w-full text-left px-3"
        style={{
          height: 32,
          borderBottom: open ? '1px solid var(--border)' : 'none',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <motion.svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.15 }}
          style={{ opacity: 0.5 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
        {title}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-3 py-2.5 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helpers ─── */
function hasContent(el: SlideElement) {
  return ['heading', 'text', 'note', 'callout', 'math', 'mermaid'].includes(el.type);
}
function hasTypography(el: SlideElement) {
  return ['heading', 'text', 'list', 'note', 'callout', 'math', 'shape'].includes(el.type);
}
