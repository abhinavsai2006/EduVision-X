'use client';
/* ═══════════════════════════════════════════════════════
   OpenModal — Open presentation from server or local file
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from '@/components/UI/Modal';
import { useSlideStore } from '@/store/useSlideStore';
import { useToastStore } from '@/store/useToastStore';
import { getLastImportError, importPresentationFromFile } from '@/lib/exports';

interface Props { open: boolean; onClose: () => void; }

export default function OpenModal({ open, onClose }: Props) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/presentations')
      .then(r => r.json())
      .then((list: string[]) => setFiles(list))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [open]);

  const loadFromServer = async (name: string) => {
    try {
      const res = await fetch(`/api/load?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        useSlideStore.getState().loadPresentation(data);
        useToastStore.getState().addToast('success', `Loaded "${name}"`);
        onClose();
      }
    } catch {
      useToastStore.getState().addToast('error', 'Failed to load');
    }
  };

  const loadLocalFile = useCallback(async (file: File) => {
    const data = await importPresentationFromFile(file);
    if (data) {
      useSlideStore.getState().loadPresentation(data);
      useToastStore.getState().addToast('success', `Loaded "${file.name}"`);
      onClose();
      return;
    }
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.ppt') || lower.endsWith('.pptx') || lower.endsWith('.pptm') || lower.endsWith('.pps') || lower.endsWith('.ppsx') || lower.endsWith('.pot') || lower.endsWith('.potx')) {
      const detail = getLastImportError();
      useToastStore.getState().addToast('error', detail ? `PowerPoint import failed: ${detail}` : 'PowerPoint import failed. Install LibreOffice or Microsoft PowerPoint desktop and retry.');
      return;
    }
    useToastStore.getState().addToast('error', 'Unsupported or invalid file format');
  }, [onClose]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadLocalFile(file);
  }, [loadLocalFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLocalFile(file);
  };

  return (
    <Modal open={open} onClose={onClose} title="Open Presentation" width="480px">
      <div className="flex flex-col gap-4">
        {/* Drag & drop zone */}
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragOver ? 'var(--accent)' : 'var(--border)',
            background: dragOver ? 'var(--accent-dim)' : 'transparent',
            color: 'var(--text-secondary)',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-2xl mb-2">📂</div>
          <div className="text-sm">Drop .isl / .islt / .json / .pdf / .ppt / .pptx / .pptm / .ppsx file here</div>
          <div className="text-xs mt-1">or click to browse</div>
          <input ref={fileRef} type="file" accept=".isl,.islt,.json,.pdf,.ppt,.pptx,.pptm,.pps,.ppsx,.pot,.potx" className="hidden" onChange={handleFileInput} />
        </div>

        {/* Server files */}
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Server Files</div>
          {loading && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading…</div>}
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {files.length === 0 && !loading && (
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No presentations found</div>
            )}
            {files.map(f => (
              <button
                key={f}
                onClick={() => loadFromServer(f)}
                className="text-left px-3 py-2 rounded text-sm transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              >
                📄 {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
