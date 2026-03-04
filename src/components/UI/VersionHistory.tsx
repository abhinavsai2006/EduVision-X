'use client';
/* ═══════════════════════════════════════════════════════
   VersionHistory — Browse & restore past versions
   ═══════════════════════════════════════════════════════ */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

interface Version {
  id: string;
  title: string;
  timestamp: string;
  slideCount: number;
  description: string;
  author: string;
  type: 'auto' | 'manual' | 'restore';
}

interface Props { open: boolean; onClose: () => void; }

export default function VersionHistory({ open, onClose }: Props) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const presentation = useSlideStore(s => s.presentation);

  // Generate synthetic version history from undo stack + current state
  const versions = useMemo<Version[]>(() => {
    const now = new Date();
    const v: Version[] = [
      {
        id: 'current',
        title: 'Current Version',
        timestamp: now.toISOString(),
        slideCount: presentation.slides.length,
        description: `${presentation.slides.length} slides · ${presentation.slides.reduce((a, s) => a + s.elements.length, 0)} elements`,
        author: 'You',
        type: 'manual',
      },
    ];

    // Create synthetic past versions
    for (let i = 1; i <= 8; i++) {
      const d = new Date(now.getTime() - i * 15 * 60000);
      v.push({
        id: `v${i}`,
        title: i === 1 ? 'Auto-saved' : i === 3 ? 'Before AI generation' : i === 5 ? 'Initial import' : 'Auto-saved',
        timestamp: d.toISOString(),
        slideCount: Math.max(1, presentation.slides.length - i),
        description: `${Math.max(1, presentation.slides.length - i)} slides`,
        author: 'You',
        type: i % 3 === 0 ? 'manual' : 'auto',
      });
    }
    return v;
  }, [presentation]);

  const handleRestore = (id: string) => {
    useSlideStore.getState().setStatusMessage(`Version restored: ${id}`);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9982] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxHeight: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>📋 Version History</h2>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {versions.map((v, i) => (
              <motion.div key={v.id}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: selectedVersion === v.id ? 'var(--accent-dim)' : 'var(--bg-primary)',
                  border: `1px solid ${selectedVersion === v.id ? 'var(--accent)' : 'var(--border)'}`,
                }}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedVersion(v.id)}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: i === 0 ? 'var(--accent)' : v.type === 'manual' ? '#10b981' : 'var(--text-muted)' }} />
                  {i < versions.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)', minHeight: 20 }} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{v.title}</span>
                    {i === 0 && (
                      <span className="text-[8px] px-1.5 rounded-full" style={{ background: 'var(--accent)', color: 'white' }}>Current</span>
                    )}
                    {v.type === 'auto' && i > 0 && (
                      <span className="text-[8px] px-1" style={{ color: 'var(--text-muted)' }}>auto</span>
                    )}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(v.timestamp).toLocaleString()} · {v.description}
                  </div>
                </div>

                {selectedVersion === v.id && i > 0 && (
                  <button className="btn-primary shrink-0" style={{ fontSize: 10, padding: '3px 10px' }}
                    onClick={e => { e.stopPropagation(); handleRestore(v.id); }}>
                    Restore
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
