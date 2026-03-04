'use client';
/* ═══════════════════════════════════════════════════════
   SaveAsModal — Save presentation with custom filename
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect } from 'react';
import Modal from '@/components/UI/Modal';
import { useSlideStore } from '@/store/useSlideStore';
import { useToastStore } from '@/store/useToastStore';

interface Props { open: boolean; onClose: () => void; }

export default function SaveAsModal({ open, onClose }: Props) {
  const title = useSlideStore(s => s.presentation.meta.title);
  const [filename, setFilename] = useState(title || 'Untitled');

  useEffect(() => {
    if (open) setFilename(title || 'Untitled');
  }, [open, title]);

  const handleSave = async () => {
    const pres = useSlideStore.getState().presentation;
    const payload = { ...pres, meta: { ...pres.meta, title: filename, updatedAt: new Date().toISOString() } };
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: filename, data: payload }),
      });
      if (res.ok) {
        // Update store title
        useSlideStore.getState().setTitle(filename);
        useToastStore.getState().addToast('success', 'Saved as "' + filename + '"');
        onClose();
      } else {
        useToastStore.getState().addToast('error', 'Save failed');
      }
    } catch {
      useToastStore.getState().addToast('error', 'Save failed');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Save As">
      <div className="flex flex-col gap-3">
        <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Filename</label>
        <input
          value={filename}
          onChange={e => setFilename(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="px-3 py-2 rounded text-sm"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 rounded text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
