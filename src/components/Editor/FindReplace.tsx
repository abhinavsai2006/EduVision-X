'use client';
/* ═══════════════════════════════════════════════════════
   FindReplace — Find & Replace overlay
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { useSlideStore } from '@/store/useSlideStore';

export default function FindReplace() {
  const store = useSlideStore();
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [results, setResults] = useState<{ slideIdx: number; elId: string }[]>([]);

  const doFind = () => {
    if (!find) return;
    const found: { slideIdx: number; elId: string }[] = [];
    store.presentation.slides.forEach((slide, si) => {
      slide.elements.forEach(el => {
        const text = el.content || el.question || el.front || el.back || '';
        if (text.toLowerCase().includes(find.toLowerCase())) {
          found.push({ slideIdx: si, elId: el.id });
        }
      });
    });
    setResults(found);
  };

  const doReplace = () => {
    if (!find) return;
    store.snapshot();
    store.presentation.slides.forEach((_, si) => {
      const slide = store.presentation.slides[si];
      slide.elements.forEach(el => {
        const fields: (keyof typeof el)[] = ['content', 'question', 'front', 'back'];
        fields.forEach(f => {
          const val = el[f];
          if (typeof val === 'string' && val.toLowerCase().includes(find.toLowerCase())) {
            store.updateElement(el.id, { [f]: val.replace(new RegExp(find, 'gi'), replace) });
          }
        });
      });
    });
    setResults([]);
  };

  return (
    <div className="fixed top-12 right-4 z-50 w-72 rounded-lg shadow-2xl p-3 space-y-2"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Find & Replace</span>
        <button className="text-xs" style={{ color: 'var(--text-muted)' }}
          onClick={() => store.setFindReplace(false)}>✕</button>
      </div>
      <input className="w-full px-2 py-1 rounded text-xs outline-none"
        style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        placeholder="Find…" value={find} onChange={e => setFind(e.target.value)} onKeyDown={e => e.key === 'Enter' && doFind()} />
      <input className="w-full px-2 py-1 rounded text-xs outline-none"
        style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        placeholder="Replace…" value={replace} onChange={e => setReplace(e.target.value)} />
      <div className="flex gap-2">
        <button className="flex-1 text-xs py-1 rounded" style={{ background: 'var(--accent)', color: '#fff' }}
          onClick={doFind}>Find ({results.length})</button>
        <button className="flex-1 text-xs py-1 rounded" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
          onClick={doReplace}>Replace All</button>
      </div>
      {results.length > 0 && (
        <div className="text-[10px] space-y-0.5 max-h-24 overflow-y-auto" style={{ color: 'var(--text-secondary)' }}>
          {results.map((r, i) => (
            <div key={i} className="cursor-pointer hover:underline"
              onClick={() => { store.goToSlide(r.slideIdx); store.selectElement(r.elId); }}>
              Slide {r.slideIdx + 1} — {r.elId.slice(0, 12)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
