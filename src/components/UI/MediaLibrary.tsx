'use client';
/* ═══════════════════════════════════════════════════════
   MediaLibrary — Browse, search, and insert media assets
   Stock photos, uploaded images, videos, audio
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const CATEGORIES = ['All', 'Images', 'Videos', 'Audio', 'Icons', 'Shapes'] as const;

const STOCK_IMAGES = [
  { id: '1', url: 'https://picsum.photos/300/200?random=1', label: 'Nature', category: 'Images' },
  { id: '2', url: 'https://picsum.photos/300/200?random=2', label: 'Business', category: 'Images' },
  { id: '3', url: 'https://picsum.photos/300/200?random=3', label: 'Technology', category: 'Images' },
  { id: '4', url: 'https://picsum.photos/300/200?random=4', label: 'Education', category: 'Images' },
  { id: '5', url: 'https://picsum.photos/300/200?random=5', label: 'Science', category: 'Images' },
  { id: '6', url: 'https://picsum.photos/300/200?random=6', label: 'Architecture', category: 'Images' },
  { id: '7', url: 'https://picsum.photos/300/200?random=7', label: 'Abstract', category: 'Images' },
  { id: '8', url: 'https://picsum.photos/300/200?random=8', label: 'People', category: 'Images' },
  { id: '9', url: 'https://picsum.photos/300/200?random=9', label: 'Food', category: 'Images' },
  { id: '10', url: 'https://picsum.photos/300/200?random=10', label: 'Travel', category: 'Images' },
  { id: '11', url: 'https://picsum.photos/300/200?random=11', label: 'Health', category: 'Images' },
  { id: '12', url: 'https://picsum.photos/300/200?random=12', label: 'Sports', category: 'Images' },
];

interface Props { open: boolean; onClose: () => void; }

export default function MediaLibrary({ open, onClose }: Props) {
  const addElement = useSlideStore(s => s.addElement);
  const snapshot = useSlideStore(s => s.snapshot);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [tab, setTab] = useState<'stock' | 'upload'>('stock');

  const filtered = STOCK_IMAGES.filter(img => {
    if (category !== 'All' && img.category !== category) return false;
    if (search && !img.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const insertImage = (url: string) => {
    snapshot();
    addElement({
      id: crypto.randomUUID(),
      type: 'image',
      x: 100, y: 100, width: 300, height: 200,
      rotation: 0, opacity: 1, locked: false,
      animation: 'fadeIn', style: {},
      content: '', src: url, alt: 'Stock image',
    });
    onClose();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      insertImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-3xl rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', height: '70vh' }}
          initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Media Library</span>
            </div>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="flex items-center gap-3 px-5 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex gap-1">
              {(['stock', 'upload'] as const).map(t => (
                <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{
                    background: tab === t ? 'var(--accent-dim)' : 'transparent',
                    color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
                    border: tab === t ? '1px solid var(--accent)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTab(t)}
                >{t === 'stock' ? 'Stock Photos' : 'Upload'}</button>
              ))}
            </div>
            <div className="flex-1">
              <input
                className="input-field w-full"
                placeholder="Search media…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '5px 10px', fontSize: 12 }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 px-5 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className="px-2.5 py-1 rounded text-xs transition-all"
                style={{
                  background: category === cat ? 'var(--accent-dim)' : 'var(--bg-primary)',
                  color: category === cat ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5" style={{ height: 'calc(70vh - 140px)' }}>
            {tab === 'stock' ? (
              <div className="grid grid-cols-4 gap-3">
                {filtered.map(img => (
                  <motion.div
                    key={img.id}
                    className="relative rounded-lg overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '3/2', background: 'var(--bg-primary)' }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => insertImage(img.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-white text-xs">
                        {img.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Drop files here or click to upload</div>
                <label className="btn-primary cursor-pointer" style={{ padding: '8px 24px', fontSize: 12 }}>
                  Choose File
                  <input type="file" accept="image/*,video/*,audio/*" className="hidden" onChange={handleUpload} />
                </label>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Supports JPG, PNG, SVG, MP4, MP3 up to 50MB</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
