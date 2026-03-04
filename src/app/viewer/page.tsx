/* ═══════════════════════════════════════════════════════
   Viewer Page — Standalone presentation viewer with
   file picker, overview, notes, search, fullscreen
   ═══════════════════════════════════════════════════════ */
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Slide, THEMES, ThemeKey, TransitionType } from '@/types/slide';
import ElementRenderer from '@/components/Elements/ElementRenderer';
import { getLastImportError, importPresentationFromFile } from '@/lib/exports';

const CANVAS_W = 960;
const CANVAS_H = 540;

function getVariants(t: TransitionType) {
  switch (t) {
    case 'fade': return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    case 'slide': return { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-100%' } };
    case 'zoom': return { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.5, opacity: 0 } };
    case 'flip': return { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 } };
    case 'cube': return { initial: { rotateY: 90, x: '50%' }, animate: { rotateY: 0, x: 0 }, exit: { rotateY: -90, x: '-50%' } };
    case 'drop': return { initial: { y: '-100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '100%', opacity: 0 } };
    default: return { initial: {}, animate: {}, exit: {} };
  }
}

export default function ViewerPage() {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [serverFiles, setServerFiles] = useState<string[]>([]);
  const [overviewMode, setOverviewMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Load from query param or prompt */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) {
      fetch(`/api/load?name=${encodeURIComponent(name)}`)
        .then(r => r.json())
        .then(setPresentation)
        .catch(() => setError('Failed to load presentation'));
    } else {
      fetch('/api/presentations')
        .then(r => r.json())
        .then((list: string[]) => {
          if (list.length > 0) {
            return fetch(`/api/load?name=${encodeURIComponent(list[0])}`).then(r => r.json());
          }
          throw new Error('No presentations');
        })
        .then(setPresentation)
        .catch(() => setShowFilePicker(true));
    }
  }, []);

  /* Load saved notes from localStorage */
  useEffect(() => {
    if (!presentation) return;
    const key = `viewer-notes-${presentation.meta.title}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setNotes(JSON.parse(saved)); } catch { /* ignored */ }
    }
  }, [presentation]);

  /* Save notes to localStorage */
  const saveNote = useCallback((slideId: string, text: string) => {
    if (!presentation) return;
    const updated = { ...notes, [slideId]: text };
    setNotes(updated);
    localStorage.setItem(`viewer-notes-${presentation.meta.title}`, JSON.stringify(updated));
  }, [notes, presentation]);

  /* Search through slide content */
  const runSearch = useCallback((q: string) => {
    if (!presentation || !q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results: number[] = [];
    presentation.slides.forEach((slide, i) => {
      const hasMatch = slide.elements.some(el => {
        const text = [el.content, el.question, el.front, el.back, el.label, el.html, ...(el.items || [])].filter(Boolean).join(' ');
        return text.toLowerCase().includes(lower);
      });
      if (hasMatch) results.push(i);
    });
    setSearchResults(results);
  }, [presentation]);

  /* Load local file */
  const loadLocalFile = async (file: File) => {
    const data = await importPresentationFromFile(file);
    if (data) {
      setPresentation(data);
      setIdx(0);
      setShowFilePicker(false);
      setError('');
      return;
    }
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.ppt') || lower.endsWith('.pptx') || lower.endsWith('.pptm') || lower.endsWith('.pps') || lower.endsWith('.ppsx') || lower.endsWith('.pot') || lower.endsWith('.potx')) {
      const detail = getLastImportError();
      setError(detail ? `PowerPoint import failed: ${detail}` : 'PowerPoint import failed. Install LibreOffice or Microsoft PowerPoint desktop and retry.');
      return;
    }
    setError('Unsupported or invalid file format');
  };

  /* Fetch server files for picker */
  const openFilePicker = () => {
    setShowFilePicker(true);
    fetch('/api/presentations')
      .then(r => r.json())
      .then(setServerFiles)
      .catch(() => setServerFiles([]));
  };

  const loadServerFile = (name: string) => {
    fetch(`/api/load?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(p => { setPresentation(p); setIdx(0); setShowFilePicker(false); setError(''); })
      .catch(() => setError('Failed to load'));
  };

  const next = useCallback(() => {
    if (!presentation) return;
    setIdx(i => Math.min(i + 1, presentation.slides.length - 1));
  }, [presentation]);

  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);

  /* Keyboard nav */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showSearch && e.key !== 'Escape') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { if (!overviewMode) next(); }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') { if (!overviewMode) prev(); }
      if (e.key === 'f' || e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
      if (e.key === 'o' || e.key === 'O') setOverviewMode(v => !v);
      if (e.key === 'n' || e.key === 'N') setShowNotes(v => !v);
      if (e.key === 'Escape') {
        if (overviewMode) setOverviewMode(false);
        else if (showSearch) { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }
        else if (showNotes) setShowNotes(false);
        else if (showFilePicker) setShowFilePicker(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, overviewMode, showSearch, showNotes, showFilePicker]);

  /* ═══ File Picker Screen ═══ */
  if (showFilePicker && !presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="max-w-md w-full p-8 rounded-xl" style={{ background: '#1e1e2e', border: '1px solid #333' }}>
          <h2 className="text-xl font-bold mb-4">Open Presentation</h2>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          {/* Local file upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mb-4 hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) loadLocalFile(e.dataTransfer.files[0]); }}>
            <p className="text-lg mb-1">📁 Drop file here or click to browse</p>
            <p className="text-xs text-gray-400">Supports .isl, .islt, .json, .pdf, .ppt, .pptx files</p>
            <input ref={fileInputRef} type="file" accept=".isl,.islt,.json,.pdf,.ppt,.pptx" className="hidden"
              onChange={e => { if (e.target.files?.[0]) loadLocalFile(e.target.files[0]); }} />
          </div>

          {/* Server files */}
          {serverFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Server Presentations</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {serverFiles.map(f => (
                  <button key={f} onClick={() => loadServerFile(f)}
                    className="w-full text-left px-3 py-2 rounded text-sm hover:bg-purple-600/20 transition-colors"
                    style={{ color: '#ccc' }}>
                    📄 {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error && !presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        <div className="text-center">
          <p>{error}</p>
          <button onClick={openFilePicker} className="mt-4 px-4 py-2 bg-purple-600 rounded text-sm">Open File</button>
        </div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  const slide = presentation.slides[idx];
  const theme = THEMES[(presentation.meta.theme as ThemeKey)] || THEMES.default;
  const transition = (slide.transition || presentation.settings.transition || 'fade') as TransitionType;
  const variants = getVariants(transition);
  const dur = (presentation.settings.transitionDuration || 500) / 1000;

  const bgStyle: React.CSSProperties = {};
  if (slide.background.type === 'solid') bgStyle.background = slide.background.value;
  else if (slide.background.type === 'gradient') bgStyle.background = slide.background.value;
  if (slide.background.value === '#ffffff' || slide.background.value === '#fff') {
    bgStyle.background = theme.bg;
  }

  const scale = typeof window !== 'undefined'
    ? Math.min(window.innerWidth / CANVAS_W, (window.innerHeight - (showNotes ? 150 : 0)) / CANVAS_H)
    : 1;

  /* ═══ Overview Mode ═══ */
  if (overviewMode) {
    return (
      <div className="h-screen bg-gray-900 overflow-y-auto p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-bold">{presentation.meta.title} — Overview</h2>
          <div className="flex gap-2">
            <button onClick={openFilePicker} className="text-xs px-3 py-1 bg-gray-700 text-white rounded">Open File</button>
            <button onClick={() => setOverviewMode(false)} className="text-xs px-3 py-1 bg-purple-600 text-white rounded">Close (O)</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {presentation.slides.map((s, i) => {
            const sBg: React.CSSProperties = {};
            if (s.background.type === 'solid') sBg.background = s.background.value;
            else if (s.background.type === 'gradient') sBg.background = s.background.value;
            if (s.background.value === '#ffffff' || s.background.value === '#fff') sBg.background = theme.bg;
            return (
              <div key={s.id}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-purple-500 ${i === idx ? 'ring-2 ring-purple-400' : ''}`}
                style={{ aspectRatio: '16/9', position: 'relative', ...sBg }}
                onClick={() => { setIdx(i); setOverviewMode(false); }}>
                <div className="absolute inset-0" style={{ transform: `scale(${0.25})`, transformOrigin: 'top left', width: CANVAS_W, height: CANVAS_H }}>
                  {s.elements.map(el => (
                    <div key={el.id} style={{
                      position: 'absolute', left: el.x, top: el.y,
                      width: el.width, height: el.height,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      opacity: el.opacity,
                    }}>
                      <ElementRenderer element={el} theme={theme} presentMode />
                    </div>
                  ))}
                </div>
                <span className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,.6)', color: '#fff' }}>
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Search bar */}
      {showSearch && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-xl"
          style={{ background: 'rgba(30,30,46,.95)', border: '1px solid #555' }}>
          <span className="text-white text-sm">🔍</span>
          <input
            autoFocus
            className="bg-transparent text-white text-sm outline-none w-64"
            placeholder="Search slides..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); runSearch(e.target.value); }}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                const cur = searchResults.findIndex(r => r >= idx);
                const next = cur >= 0 ? searchResults[(cur + 1) % searchResults.length] : searchResults[0];
                setIdx(next);
              }
              if (e.key === 'Escape') { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }
            }}
          />
          {searchResults.length > 0 && (
            <span className="text-xs text-gray-400">{searchResults.length} match{searchResults.length !== 1 ? 'es' : ''}</span>
          )}
        </div>
      )}

      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center cursor-none relative"
        onClick={next} onContextMenu={e => { e.preventDefault(); prev(); }}>
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
              ...bgStyle,
            }}
          >
            {slide.elements.map(el => (
              <div key={el.id} style={{
                position: 'absolute',
                left: el.x, top: el.y,
                width: el.width, height: el.height,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                opacity: el.opacity,
              }}>
                <ElementRenderer element={el} theme={theme} presentMode />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div className="h-full bg-purple-500 transition-all" style={{ width: `${((idx + 1) / presentation.slides.length) * 100}%` }} />
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-4 right-4 text-xs px-2 py-1 rounded"
          style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}>
          {idx + 1} / {presentation.slides.length}
        </div>

        {/* Navigation arrows on hover */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); prev(); }}>
          ‹
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); next(); }}>
          ›
        </button>

        {/* Top-left controls */}
        <div className="absolute top-4 left-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); openFilePicker(); }}
            className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}
            title="Open File">📁</button>
          <button onClick={e => { e.stopPropagation(); setOverviewMode(true); }}
            className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,.5)', color: '#fff' }}
            title="Overview (O)">🔲</button>
          <button onClick={e => { e.stopPropagation(); setShowNotes(v => !v); }}
            className="text-xs px-2 py-1 rounded" style={{ background: showNotes ? 'rgba(13,153,255,.7)' : 'rgba(0,0,0,.5)', color: '#fff' }}
            title="Notes (N)">📝</button>
          <button onClick={e => { e.stopPropagation(); setShowSearch(v => !v); }}
            className="text-xs px-2 py-1 rounded" style={{ background: showSearch ? 'rgba(13,153,255,.7)' : 'rgba(0,0,0,.5)', color: '#fff' }}
            title="Search (Ctrl+F)">🔍</button>
        </div>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="h-36 shrink-0 flex" style={{ background: '#1e1e2e', borderTop: '1px solid #333' }}>
          <div className="flex-1 p-3 flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 mb-1">Speaker Notes</span>
            <div className="text-xs text-gray-300 flex-1 overflow-y-auto whitespace-pre-wrap">
              {slide.notes || <span className="text-gray-500 italic">No speaker notes for this slide</span>}
            </div>
          </div>
          <div className="w-px bg-gray-700" />
          <div className="flex-1 p-3 flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 mb-1">My Notes</span>
            <textarea
              className="flex-1 bg-transparent text-xs text-gray-200 outline-none resize-none"
              placeholder="Type your notes..."
              value={notes[slide.id] || ''}
              onChange={e => saveNote(slide.id, e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* File picker overlay */}
      {showFilePicker && presentation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.7)' }}
          onClick={() => setShowFilePicker(false)}>
          <div className="max-w-md w-full p-6 rounded-xl" style={{ background: '#1e1e2e', border: '1px solid #444' }}
            onClick={e => e.stopPropagation()}>
            <h3 className="text-white text-lg font-bold mb-3">Open Presentation</h3>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center mb-3 cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) loadLocalFile(e.dataTransfer.files[0]); }}>
              <p className="text-white text-sm">📁 Drop file or click to browse</p>
              <input ref={fileInputRef} type="file" accept=".isl,.islt,.json,.pdf,.ppt,.pptx" className="hidden"
                onChange={e => { if (e.target.files?.[0]) loadLocalFile(e.target.files[0]); }} />
            </div>
            {serverFiles.length > 0 && (
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {serverFiles.map(f => (
                  <button key={f} onClick={() => loadServerFile(f)}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-gray-300 hover:bg-purple-600/20">
                    📄 {f}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowFilePicker(false)}
              className="mt-3 text-xs text-gray-500 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
