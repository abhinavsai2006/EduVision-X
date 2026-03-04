'use client';
/* ═══════════════════════════════════════════════════════
   LinkEditor — Insert/edit hyperlinks on elements
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

export default function LinkEditor() {
  const linkEditor = useSlideStore(s => s.linkEditor);
  const setLinkEditor = useSlideStore(s => s.setLinkEditor);
  const updateElement = useSlideStore(s => s.updateElement);
  const snapshot = useSlideStore(s => s.snapshot);

  const [url, setUrl] = useState('');
  const [target, setTarget] = useState<'_blank' | '_self'>('_blank');

  useEffect(() => {
    if (linkEditor) {
      setUrl(linkEditor.url);
      setTarget(linkEditor.target);
    }
  }, [linkEditor]);

  const handleSave = () => {
    if (!linkEditor) return;
    snapshot();
    updateElement(linkEditor.elementId, { content: url } as Record<string, unknown>);
    setLinkEditor(null);
  };

  const handleRemove = () => {
    if (!linkEditor) return;
    snapshot();
    setLinkEditor(null);
  };

  if (!linkEditor) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9991] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setLinkEditor(null)}
      >
        <motion.div
          className="w-full max-w-sm rounded-xl p-5 space-y-3"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🔗 Insert Link</h3>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>URL</label>
            <input className="input-field w-full" placeholder="https://example.com" value={url}
              onChange={e => setUrl(e.target.value)} style={{ fontSize: 12, padding: '6px 10px' }} autoFocus />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Open in</label>
            <div className="flex gap-1">
              {([['_blank', 'New Tab'], ['_self', 'Same Tab']] as const).map(([val, label]) => (
                <button key={val} className="flex-1 py-1.5 rounded text-xs transition-colors"
                  style={{
                    background: target === val ? 'var(--accent-dim)' : 'transparent',
                    color: target === val ? 'var(--accent)' : 'var(--text-muted)',
                    border: `1px solid ${target === val ? 'var(--accent)' : 'var(--border)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setTarget(val)}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button className="btn-secondary flex-1" onClick={handleRemove} style={{ fontSize: 11 }}>Remove</button>
            <button className="btn-primary flex-1" onClick={handleSave} disabled={!url.trim()} style={{ fontSize: 11 }}>Save Link</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
