'use client';
/* ═══════════════════════════════════════════════════════
   Toolbar v5.0 — Premium polished toolbar
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore, ToolMode } from '@/store/useSlideStore';
import { createElement } from '@/lib/elements';
import { ElementType, SlideElement } from '@/types/slide';

const FONTS = ['Inter', 'Arial', 'Georgia', 'Fira Code', 'Courier New', 'Verdana', 'Times New Roman', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Playfair Display', 'Lato', 'Raleway'];

interface InsertItem {
  icon: string;
  label: string;
  type: ElementType;
  props?: Partial<SlideElement>;
}

/* ── Categorized insert items ── */
const INSERT_CATEGORIES = [
  {
    label: 'Text',
    items: [
      { icon: 'H', label: 'Heading', type: 'heading' as ElementType },
      { icon: '¶', label: 'Text', type: 'text' as ElementType },
      { icon: '☰', label: 'List', type: 'list' as ElementType },
      { icon: '💬', label: 'Callout', type: 'callout' as ElementType },
      { icon: '📌', label: 'Note', type: 'note' as ElementType },
    ],
  },
  {
    label: 'Media',
    items: [
      { icon: '🖼', label: 'Image', type: 'image' as ElementType },
      { icon: '🎬', label: 'Video', type: 'video' as ElementType },
      { icon: '🔊', label: 'Audio', type: 'audio' as ElementType },
      { icon: '⭐', label: 'Icon', type: 'icon' as ElementType },
    ],
  },
  {
    label: 'Shapes & Lines',
    items: [
      { icon: '▭', label: 'Rectangle', type: 'shape' as ElementType, props: { shape: 'rectangle' } },
      { icon: '◯', label: 'Circle', type: 'shape' as ElementType, props: { shape: 'circle' } },
      { icon: '△', label: 'Triangle', type: 'shape' as ElementType, props: { shape: 'triangle' } },
      { icon: '◇', label: 'Diamond', type: 'shape' as ElementType, props: { shape: 'diamond' } },
      { icon: '★', label: 'Star', type: 'shape' as ElementType, props: { shape: 'star' } },
      { icon: '⬢', label: 'Hexagon', type: 'shape' as ElementType, props: { shape: 'hexagon' } },
      { icon: '♥', label: 'Heart', type: 'shape' as ElementType, props: { shape: 'heart' } },
      { icon: '➤', label: 'Arrow', type: 'shape' as ElementType, props: { shape: 'arrow' } },
      { icon: '━', label: 'Divider', type: 'divider' as ElementType },
      { icon: '🔗', label: 'Connector', type: 'connector' as ElementType },
    ],
  },
  {
    label: 'Data & Code',
    items: [
      { icon: '📊', label: 'Chart', type: 'chart' as ElementType },
      { icon: '⊞', label: 'Table', type: 'table' as ElementType },
      { icon: '<>', label: 'Code', type: 'code' as ElementType },
      { icon: '∑', label: 'Math', type: 'math' as ElementType },
      { icon: 'f(x)', label: 'Function Plot', type: 'functionplot' as ElementType },
    ],
  },
  {
    label: 'Interactive',
    items: [
      { icon: '❓', label: 'Quiz', type: 'quiz' as ElementType },
      { icon: '📋', label: 'Poll', type: 'poll' as ElementType },
      { icon: '🃏', label: 'Flashcard', type: 'flashcard' as ElementType },
      { icon: '⏱', label: 'Timer', type: 'timer' as ElementType },
      { icon: '▓', label: 'Progress', type: 'progress' as ElementType },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { icon: '📅', label: 'Timeline', type: 'timeline' as ElementType },
      { icon: '📐', label: 'Mermaid', type: 'mermaid' as ElementType },
      { icon: '🧊', label: '3D', type: '3d' as ElementType },
      { icon: '☁', label: 'Word Cloud', type: 'wordcloud' as ElementType },
      { icon: '▣', label: 'QR Code', type: 'qrcode' as ElementType },
      { icon: '🌐', label: 'Embed', type: 'embed' as ElementType },
    ],
  },
];

export default function Toolbar() {
  const store = useSlideStore();
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showInsert, setShowInsert] = useState(false);
  const [insertSearch, setInsertSearch] = useState('');
  const insertRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);

  const normalizeMediaUrl = (url: string): string => {
    const v = url.trim();
    if (!v) return '';
    const yt1 = v.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/);
    const yt2 = v.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    const yt3 = v.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
    const ytId = yt1?.[1] || yt2?.[1] || yt3?.[1];
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    const vm = v.match(/vimeo\.com\/(\d+)/);
    if (vm?.[1]) return `https://player.vimeo.com/video/${vm[1]}`;
    return v;
  };

  const uploadMedia = async (accept: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const fd = new FormData();
        fd.append('file', file);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const data = await res.json();
          resolve(data?.url || null);
        } catch {
          resolve(null);
        }
      };
      input.click();
    });
  };

  const ins = async (type: ElementType, props?: Partial<SlideElement>) => {
    if (type === 'image') {
      const url = window.prompt('Paste image URL. Leave blank to upload from device.');
      const src = url?.trim() ? url.trim() : await uploadMedia('image/*');
      if (!src) return;
      store.addElement(createElement('image', { ...props, src }));
      setShowInsert(false); setInsertSearch('');
      return;
    }

    if (type === 'video') {
      const url = window.prompt('Paste YouTube/Vimeo/direct video URL. Leave blank to upload local video.');
      const src = url?.trim() ? normalizeMediaUrl(url) : await uploadMedia('video/*');
      if (!src) return;
      store.addElement(createElement('video', { ...props, src }));
      setShowInsert(false); setInsertSearch('');
      return;
    }

    if (type === 'audio') {
      const url = window.prompt('Paste direct audio URL (.mp3/.wav). Leave blank to upload local audio.');
      const src = url?.trim() ? url.trim() : await uploadMedia('audio/*');
      if (!src) return;
      store.addElement(createElement('audio', { ...props, src }));
      setShowInsert(false); setInsertSearch('');
      return;
    }

    store.addElement(createElement(type, props));
    setShowInsert(false);
    setInsertSearch('');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (insertRef.current && !insertRef.current.contains(e.target as Node)) { setShowInsert(false); setInsertSearch(''); }
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) setShowFontPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sel = store.selectedElementIds.length === 1
    ? store.presentation.slides[store.currentSlideIndex]?.elements.find(e => e.id === store.selectedElementIds[0])
    : null;
  const selStyle = sel?.style || {};

  const updateStyle = (key: string, value: unknown) => {
    if (!sel) return;
    store.updateElement(sel.id, { style: { ...sel.style, [key]: value } });
  };

  /* ── Reusable button ── */
  const TBtn = ({ children, tip, action, active, compact }: { children: React.ReactNode; tip: string; action: () => void; active?: boolean; compact?: boolean }) => (
    <button
      className="btn-icon"
      style={{
        width: compact ? 28 : 30, height: compact ? 28 : 30,
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
      }}
      data-tooltip={tip}
      onClick={action}
    >
      {children}
    </button>
  );

  /* ── Divider ── */
  const Div = () => <div className="toolbar-divider" />;

  /* Filter insert items by search */
  const filteredCategories = insertSearch.trim()
    ? INSERT_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.label.toLowerCase().includes(insertSearch.toLowerCase())),
      })).filter(cat => cat.items.length > 0)
    : INSERT_CATEGORIES;

  return (
    <div className="flex items-center shrink-0 select-none"
      style={{
        height: 42, padding: '0 10px',
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border)',
        gap: 2,
      }}>

      {/* ── Tool modes ── */}
      <div className="toolbar-group">
        {([
          { mode: 'select' as ToolMode, tip: 'Select (V)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg> },
          { mode: 'draw' as ToolMode, tip: 'Draw (D)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg> },
          { mode: 'text' as ToolMode, tip: 'Text (T)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> },
          { mode: 'pan' as ToolMode, tip: 'Pan (H)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0v6M10 10.5V6a2 2 0 00-4 0v8"/><path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2c-2.21 0-4.21-.9-5.66-2.34l-3.53-3.53a2 2 0 012.83-2.83L8 15"/></svg> },
        ]).map(t => (
          <TBtn key={t.mode} tip={t.tip}
            action={() => store.setToolMode(t.mode)}
            active={store.toolMode === t.mode}>
            {t.icon}
          </TBtn>
        ))}
      </div>

      <Div />

      {/* ── Insert ── */}
      <div className="relative" ref={insertRef}>
        <motion.button
          className="flex items-center gap-1.5 rounded-md"
          style={{
            height: 30, padding: '0 12px',
            background: showInsert ? 'var(--accent-dim)' : 'transparent',
            color: showInsert ? 'var(--accent)' : 'var(--text-primary)',
            border: `1px solid ${showInsert ? 'var(--border-accent)' : 'var(--border-bold)'}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}
          whileHover={{ borderColor: 'var(--border-strong)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowInsert(!showInsert)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Insert
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><path d="M6 9l6 6 6-6"/></svg>
        </motion.button>

        <AnimatePresence>
          {showInsert && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full mt-2 z-50"
              style={{
                width: 360,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-bold)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '10px',
                maxHeight: '70vh',
                overflowY: 'auto',
              }}>
              {/* Search bar */}
              <div className="relative mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="input-field"
                  style={{ paddingLeft: 30, fontSize: 12 }}
                  placeholder="Search elements..."
                  value={insertSearch}
                  onChange={e => setInsertSearch(e.target.value)}
                  autoFocus
                />
              </div>
              {filteredCategories.map(cat => (
                <div key={cat.label} className="mb-2 last:mb-0">
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 6px' }}>
                    {cat.label}
                  </div>
                  <div className="grid grid-cols-3 gap-0.5">
                    {cat.items.map(item => (
                      <motion.button
                        key={`${item.type}-${item.label}`}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-md text-left"
                        style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12 }}
                        whileHover={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => ins(item.type, item.props)}
                      >
                        <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 12 }}>
                  No elements match &quot;{insertSearch}&quot;
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Div />

      {/* ── Typography ── */}
      <div className="toolbar-group">
        {/* Font family */}
        <div className="relative" ref={fontRef}>
          <button className="flex items-center rounded-md text-xs truncate"
            style={{
              height: 28, padding: '0 8px', maxWidth: 110,
              background: 'var(--bg-input)', color: 'var(--text-primary)',
              border: '1px solid var(--border-bold)', cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => setShowFontPicker(!showFontPicker)}
          >
            {(selStyle.fontFamily as string) || 'Inter'}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4, opacity: 0.5 }}><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <AnimatePresence>
            {showFontPicker && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 mt-1 z-50 py-1 max-h-52 overflow-y-auto"
                style={{
                  width: 180,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-bold)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                }}>
                {FONTS.map(f => (
                  <button key={f}
                    className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                    style={{
                      color: (selStyle.fontFamily as string) === f ? 'var(--accent)' : 'var(--text-primary)',
                      fontFamily: f,
                      background: (selStyle.fontFamily as string) === f ? 'var(--accent-dim)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontWeight: (selStyle.fontFamily as string) === f ? 600 : 400,
                    }}
                    onMouseOver={e => { if ((selStyle.fontFamily as string) !== f) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseOut={e => { if ((selStyle.fontFamily as string) !== f) e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => { updateStyle('fontFamily', f); setShowFontPicker(false); }}
                  >{f}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Font size */}
        <input
          className="text-center outline-none"
          style={{
            width: 42, height: 28, padding: '0 4px', fontSize: 12,
            background: 'var(--bg-input)', color: 'var(--text-primary)',
            border: '1px solid var(--border-bold)',
            borderRadius: 'var(--radius-sm)',
          }}
          data-tooltip="Font Size"
          value={(selStyle.fontSize as string)?.replace('px', '') || '20'}
          onChange={e => updateStyle('fontSize', e.target.value + 'px')}
        />

        {/* Bold / Italic / Underline */}
        <TBtn tip="Bold (Ctrl+B)" action={() => updateStyle('fontWeight', selStyle.fontWeight === 'bold' ? 'normal' : 'bold')} active={selStyle.fontWeight === 'bold'} compact>
          <span style={{ fontWeight: 800, fontSize: 13 }}>B</span>
        </TBtn>
        <TBtn tip="Italic (Ctrl+I)" action={() => updateStyle('fontStyle', selStyle.fontStyle === 'italic' ? 'normal' : 'italic')} active={selStyle.fontStyle === 'italic'} compact>
          <span style={{ fontStyle: 'italic', fontSize: 13, fontWeight: 600 }}>I</span>
        </TBtn>
        <TBtn tip="Underline" action={() => updateStyle('textDecoration', selStyle.textDecoration === 'underline' ? 'none' : 'underline')} active={selStyle.textDecoration === 'underline'} compact>
          <span style={{ textDecoration: 'underline', fontSize: 13, fontWeight: 600 }}>U</span>
        </TBtn>

        {/* Text Color */}
        <div className="relative flex items-center justify-center" style={{ width: 30, height: 30, cursor: 'pointer' }} data-tooltip="Text Color">
          <span style={{ fontSize: 13, fontWeight: 700, color: (selStyle.color as string) || 'var(--text-primary)' }}>A</span>
          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer"
            value={(selStyle.color as string) || '#333333'}
            onChange={e => updateStyle('color', e.target.value)} />
          <div className="absolute bottom-0.5 left-1.5 right-1.5 h-[3px] rounded-full"
            style={{ background: (selStyle.color as string) || 'var(--text-primary)' }} />
        </div>
      </div>

      <Div />

      {/* ── Format ── */}
      <div className="toolbar-group">
        <TBtn tip="Format Painter"
          action={() => {
            if (store.formatPainterStyle) {
              if (sel) { store.updateElement(sel.id, { style: { ...sel.style, ...store.formatPainterStyle } }); store.setFormatPainterStyle(null); }
            } else {
              if (sel) store.setFormatPainterStyle(sel.style as Record<string, unknown>);
            }
          }}
          active={!!store.formatPainterStyle}
          compact
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l4 4-8 8H4v-4l8-8z"/><path d="M16 6l2-2"/></svg>
        </TBtn>
        <TBtn tip="Gradient Builder" action={() => store.setShowGradient(true)} compact>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10" fill="currentColor" opacity="0.15"/></svg>
        </TBtn>
      </div>

      <Div />

      {/* ── History ── */}
      <div className="toolbar-group">
        <TBtn tip="Undo (Ctrl+Z)" action={() => store.undo()} compact>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        </TBtn>
        <TBtn tip="Redo (Ctrl+Y)" action={() => store.redo()} compact>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
        </TBtn>
      </div>

      <Div />

      {/* ── Arrange ── */}
      <div className="toolbar-group">
        <TBtn tip="Bring Forward" action={() => { const s = store.selectedElementIds[0]; if (s) store.bringForward(s); }} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="13" height="13" rx="2"/><rect x="3" y="9" width="13" height="13" rx="2" opacity="0.4"/></svg>
        </TBtn>
        <TBtn tip="Send Backward" action={() => { const s = store.selectedElementIds[0]; if (s) store.sendBackward(s); }} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="9" width="13" height="13" rx="2"/><rect x="8" y="2" width="13" height="13" rx="2" opacity="0.4"/></svg>
        </TBtn>
        <TBtn tip="Flip Horizontal" action={() => store.flipElements('h')} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M21 12H15l6-8v16l-6-8z" opacity="0.4"/><path d="M3 12h6L3 4v16l6-8z"/></svg>
        </TBtn>
        <TBtn tip="Flip Vertical" action={() => store.flipElements('v')} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 3v6l-8-6h16l-8 6z" opacity="0.4"/><path d="M12 21v-6l8 6H4l8-6z"/></svg>
        </TBtn>
      </div>

      <Div />

      {/* ── Align ── */}
      <div className="toolbar-group">
        <TBtn tip="Align Left" action={() => store.alignElements('left')} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="3" x2="4" y2="21"/><rect x="8" y="5" width="12" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/></svg>
        </TBtn>
        <TBtn tip="Align Center" action={() => store.alignElements('center')} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="3" x2="12" y2="21"/><rect x="4" y="5" width="16" height="4" rx="1"/><rect x="6" y="13" width="12" height="4" rx="1"/></svg>
        </TBtn>
        <TBtn tip="Align Right" action={() => store.alignElements('right')} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="20" y1="3" x2="20" y2="21"/><rect x="4" y="5" width="12" height="4" rx="1"/><rect x="8" y="13" width="8" height="4" rx="1"/></svg>
        </TBtn>
      </div>

      <div className="flex-1" />

      {/* ── View ── */}
      <div className="toolbar-group">
        <TBtn tip="Toggle Grid" action={() => store.toggleGrid()} active={store.showGrid} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
        </TBtn>
        <TBtn tip="Toggle Ruler" action={() => store.toggleRuler()} active={store.showRuler} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 3H3v6h2V7h2v2h2V7h2v2h2V7h2v2h2V7h2v2h1V3z"/></svg>
        </TBtn>
        <TBtn tip="Comments" action={() => store.setShowComments(!store.showComments)} active={store.showComments} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </TBtn>
        <TBtn tip="Toggle Lock" action={() => store.toggleLock()} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </TBtn>
        <TBtn tip="Group" action={() => store.groupElements()} compact>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/><path d="M10 6h4M6 10v4M14 18h-4M18 14v-4" strokeDasharray="2 2"/></svg>
        </TBtn>
      </div>

      <Div />

      {/* Delete */}
      <TBtn tip="Delete" action={() => store.removeElements()} compact>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      </TBtn>
    </div>
  );
}
