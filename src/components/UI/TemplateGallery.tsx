'use client';
/* ═══════════════════════════════════════════════════════
   TemplateGallery — Browse + apply presentation templates
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect } from 'react';
import { useSlideStore } from '@/store/useSlideStore';
import { useToastStore } from '@/store/useToastStore';
import Modal from '../UI/Modal';
import { Presentation } from '@/types/slide';

interface Template { id: string; name: string; description: string; slideCount: number; }

interface Props { open: boolean; onClose: () => void; }

export default function TemplateGallery({ open, onClose }: Props) {
  const loadPresentation = useSlideStore(s => s.loadPresentation);
  const toast = useToastStore(s => s.addToast);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch('/api/templates').then(r => r.json()).then(setTemplates).catch(() => {});
  }, [open]);

  const apply = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/templates?id=${id}`);
      const data: Presentation = await res.json();
      loadPresentation(data);
      toast('success', `Template '${id}' applied`);
      onClose();
    } catch {
      toast('error', 'Failed to load template');
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Template Gallery" width="560px">
      <div className="grid grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id}
            className="rounded-lg p-3 cursor-pointer hover:border-[var(--accent)] transition-colors"
            style={{ background: 'var(--bg-hover)', border: '2px solid var(--border)' }}
            onClick={() => apply(t.id)}>
            <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</h3>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
            <span className="text-[9px] mt-1 inline-block px-1.5 rounded"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{t.slideCount} slides</span>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-2 text-center text-[10px] py-4" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Loading...' : 'No templates available'}
          </div>
        )}
      </div>
    </Modal>
  );
}
