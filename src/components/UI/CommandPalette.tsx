'use client';
/* ═══════════════════════════════════════════════════════
   CommandPalette — Spotlight-style command launcher
   Ctrl+K / Cmd+K to open
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function CommandPalette() {
  const open = useSlideStore(s => s.commandPaletteOpen);
  const setOpen = useSlideStore(s => s.setCommandPalette);
  const store = useSlideStore;
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = useMemo(() => {
    const s = store.getState();
    return [
      // File
      { id: 'new', label: 'New Presentation', category: 'File', shortcut: 'Ctrl+N', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, action: () => { s.loadPresentation(s.presentation); } },
      { id: 'save', label: 'Save Presentation', category: 'File', shortcut: 'Ctrl+S', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>, action: () => { window.dispatchEvent(new Event('eduslideSave')); } },
      { id: 'export', label: 'Export Presentation', category: 'File', shortcut: 'Ctrl+E', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, action: () => s.setShowExportDialog(true) },
      { id: 'import', label: 'Import File', category: 'File', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, action: () => s.setShowImportDialog(true) },

      // Edit
      { id: 'undo', label: 'Undo', category: 'Edit', shortcut: 'Ctrl+Z', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>, action: () => s.undo() },
      { id: 'redo', label: 'Redo', category: 'Edit', shortcut: 'Ctrl+Shift+Z', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>, action: () => s.redo() },
      { id: 'copy', label: 'Copy', category: 'Edit', shortcut: 'Ctrl+C', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>, action: () => s.copySelection() },
      { id: 'paste', label: 'Paste', category: 'Edit', shortcut: 'Ctrl+V', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>, action: () => s.pasteClipboard() },
      { id: 'selectall', label: 'Select All', category: 'Edit', shortcut: 'Ctrl+A', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>, action: () => s.selectAll() },
      { id: 'findreplace', label: 'Find & Replace', category: 'Edit', shortcut: 'Ctrl+H', icon: <SearchIcon />, action: () => s.setFindReplace(true) },
      { id: 'duplicate', label: 'Duplicate Element', category: 'Edit', shortcut: 'Ctrl+D', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16V4a2 2 0 012-2h12"/></svg>, action: () => s.duplicateElement() },

      // View
      { id: 'grid', label: 'Toggle Grid', category: 'View', shortcut: 'Ctrl+G', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>, action: () => s.toggleGrid() },
      { id: 'ruler', label: 'Toggle Ruler', category: 'View', shortcut: 'Ctrl+R', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4h20v6H2z"/><line x1="6" y1="4" x2="6" y2="7"/><line x1="10" y1="4" x2="10" y2="7"/><line x1="14" y1="4" x2="14" y2="7"/><line x1="18" y1="4" x2="18" y2="7"/></svg>, action: () => s.toggleRuler() },
      { id: 'zoom-in', label: 'Zoom In', category: 'View', shortcut: 'Ctrl++', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, action: () => s.setZoom(Math.min(s.zoom + 0.1, 3)) },
      { id: 'zoom-out', label: 'Zoom Out', category: 'View', shortcut: 'Ctrl+-', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, action: () => s.setZoom(Math.max(s.zoom - 0.1, 0.2)) },
      { id: 'zoom-fit', label: 'Zoom to Fit', category: 'View', shortcut: 'Ctrl+0', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>, action: () => s.setZoom(1) },
      { id: 'focus', label: 'Toggle Focus Mode', category: 'View', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, action: () => s.toggleFocusMode() },
      { id: 'minimap', label: 'Toggle Minimap', category: 'View', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="13" y="13" width="6" height="6" rx="1"/></svg>, action: () => s.toggleMinimap() },

      // Slide
      { id: 'add-slide', label: 'Add Slide', category: 'Slide', shortcut: 'Ctrl+M', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, action: () => s.addSlide() },
      { id: 'dup-slide', label: 'Duplicate Slide', category: 'Slide', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16V4a2 2 0 012-2h12"/></svg>, action: () => s.duplicateSlide() },
      { id: 'del-slide', label: 'Delete Slide', category: 'Slide', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>, action: () => s.removeSlide() },
      { id: 'slide-sorter', label: 'Slide Sorter', category: 'Slide', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, action: () => s.setSlideSorter(true) },

      // Present
      { id: 'present', label: 'Start Presentation', category: 'Present', shortcut: 'F5', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>, action: () => s.enterPresent() },
      { id: 'presenter-view', label: 'Presenter View', category: 'Present', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, action: () => s.setPresenterView(true) },

      // Tools
      { id: 'templates', label: 'Template Gallery', category: 'Tools', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>, action: () => s.setTemplateGallery(true) },
      { id: 'shortcuts', label: 'Keyboard Shortcuts', category: 'Tools', shortcut: 'Ctrl+/', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8.01"/><line x1="10" y1="8" x2="10" y2="8.01"/><line x1="14" y1="8" x2="14" y2="8.01"/><line x1="18" y1="8" x2="18" y2="8.01"/><line x1="8" y1="16" x2="16" y2="16"/></svg>, action: () => s.setShortcutsHelp(true) },
      { id: 'comments', label: 'Comments', category: 'Tools', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, action: () => s.setShowComments(true) },
      { id: 'gradient', label: 'Gradient Builder', category: 'Tools', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 3l18 18"/></svg>, action: () => s.setShowGradient(true) },

      // Accessibility
      { id: 'high-contrast', label: 'Toggle High Contrast', category: 'Accessibility', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20z" fill="currentColor"/></svg>, action: () => s.toggleHighContrast() },
      { id: 'reduced-motion', label: 'Toggle Reduced Motion', category: 'Accessibility', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 4l-4 4M18 4v4M18 4h-4"/><path d="M6 20l4-4M6 20v-4M6 20h4"/></svg>, action: () => s.toggleReducedMotion() },

      // Debug
      { id: 'debug', label: 'Toggle Debug Mode', category: 'Debug', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 19.5h20L12 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg>, action: () => s.toggleDebugMode() },
      { id: 'fps', label: 'Toggle FPS Counter', category: 'Debug', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, action: () => s.toggleShowFPS() },
    ];
  }, [store]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach(c => {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    });
    return map;
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      filtered[selectedIdx].action();
      setOpen(false);
    }
  };

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  if (!open) return null;

  let flatIdx = 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          initial={{ y: -20, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: -20, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-none outline-none"
              style={{ color: 'var(--text-primary)', fontSize: 14 }}
              placeholder="Type a command…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className="kbd">Esc</kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
            {filtered.length === 0 && (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                No commands found
              </div>
            )}
            {[...grouped.entries()].map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-1.5" style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {category}
                </div>
                {cmds.map(cmd => {
                  const idx = flatIdx++;
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={cmd.id}
                      data-idx={idx}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left transition-colors"
                      style={{
                        background: isSelected ? 'var(--accent-dim)' : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        fontSize: 13,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => { cmd.action(); setOpen(false); }}
                      onMouseEnter={() => setSelectedIdx(idx)}
                    >
                      <span style={{ opacity: 0.7 }}>{cmd.icon}</span>
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.shortcut && <kbd className="kbd" style={{ fontSize: 10 }}>{cmd.shortcut}</kbd>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2" style={{ borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><kbd className="kbd" style={{ fontSize: 9 }}>↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="kbd" style={{ fontSize: 9 }}>↵</kbd> Run</span>
            <span className="flex items-center gap-1"><kbd className="kbd" style={{ fontSize: 9 }}>Esc</kbd> Close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
