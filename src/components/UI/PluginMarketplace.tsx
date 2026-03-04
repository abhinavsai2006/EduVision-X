'use client';
/* ═══════════════════════════════════════════════════════
   PluginMarketplace — Install, manage & configure plugins
   ═══════════════════════════════════════════════════════ */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const SAMPLE_PLUGINS = [
  { id: 'quiz-builder', name: 'Quiz Builder', version: '2.1.0', desc: 'Create interactive quizzes with scoring, timers, and analytics.', author: 'EduVision Labs', icon: '🧪', category: 'Interactive', downloads: '12.4k' },
  { id: 'code-runner', name: 'Live Code Runner', version: '1.5.2', desc: 'Run Python, JS, and C++ code directly in slides with auto-grading.', author: 'DevTools Inc', icon: '💻', category: 'Development', downloads: '8.7k' },
  { id: 'math-eq', name: 'LaTeX Equations Pro', version: '3.0.1', desc: 'Advanced equation editor with visual builder and hundreds of templates.', author: 'MathWorks', icon: '📐', category: 'Math & Science', downloads: '25.1k' },
  { id: 'diagram-ai', name: 'AI Diagram Generator', version: '1.2.0', desc: 'Describe any diagram in natural language and get instant visuals.', author: 'DiagramAI', icon: '🎨', category: 'AI', downloads: '15.3k' },
  { id: 'collab-whiteboard', name: 'Collaborative Whiteboard', version: '2.0.0', desc: 'Real-time collaborative whiteboard with infinite canvas.', author: 'ColabTech', icon: '🖊️', category: 'Collaboration', downloads: '9.8k' },
  { id: 'video-embed', name: 'Smart Video Embed', version: '1.8.0', desc: 'Embed YouTube, Vimeo, TikTok with in-slide controls & annotations.', author: 'MediaPlus', icon: '🎬', category: 'Media', downloads: '18.2k' },
  { id: 'poll-survey', name: 'Live Polls & Surveys', version: '1.4.0', desc: 'Real-time audience polling with visual results and export.', author: 'PollStream', icon: '📊', category: 'Interactive', downloads: '11.5k' },
  { id: '3d-molecules', name: '3D Molecule Viewer', version: '1.1.0', desc: 'Interactive 3D molecular structures for chemistry education.', author: 'ChemViz', icon: '⚛️', category: 'Science', downloads: '6.2k' },
  { id: 'timeline-pro', name: 'Timeline Pro', version: '2.3.0', desc: 'Create beautiful interactive timelines with multimedia support.', author: 'HistoryViz', icon: '📅', category: 'Education', downloads: '7.9k' },
  { id: 'accessibility', name: 'Accessibility Checker', version: '1.6.0', desc: 'Ensure WCAG 2.1 compliance with automated checks & suggestions.', author: 'A11y Tools', icon: '♿', category: 'Accessibility', downloads: '14.1k' },
  { id: 'gamify', name: 'Gamification Engine', version: '1.0.0', desc: 'Add points, badges, leaderboards and achievements to presentations.', author: 'GameLearn', icon: '🎮', category: 'Interactive', downloads: '5.4k' },
  { id: 'analytics-pro', name: 'Analytics Pro', version: '2.0.0', desc: 'Deep learning analytics with engagement heatmaps and retention curves.', author: 'DataEd', icon: '📈', category: 'Analytics', downloads: '10.3k' },
];

const CATEGORIES = ['All', 'Interactive', 'AI', 'Math & Science', 'Development', 'Collaboration', 'Media', 'Education', 'Analytics', 'Accessibility'];

interface Props { open: boolean; onClose: () => void; }

export default function PluginMarketplace({ open, onClose }: Props) {
  const [tab, setTab] = useState<'browse' | 'installed'>('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const installedPlugins = useSlideStore(s => s.installedPlugins);
  const installPlugin = useSlideStore(s => s.installPlugin);
  const uninstallPlugin = useSlideStore(s => s.uninstallPlugin);
  const togglePlugin = useSlideStore(s => s.togglePlugin);

  const installedIds = new Set(installedPlugins.map(p => p.id));

  const filteredPlugins = useMemo(() => {
    let list = SAMPLE_PLUGINS;
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    return list;
  }, [search, category]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9985] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxHeight: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🧩</span>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Plugin Marketplace</h2>
            </div>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-5 pt-3">
            {(['browse', 'installed'] as const).map(t => (
              <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: tab === t ? 'var(--accent-dim)' : 'transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setTab(t)}
              >
                {t} {t === 'installed' && `(${installedPlugins.length})`}
              </button>
            ))}
          </div>

          {tab === 'browse' && (
            <>
              {/* Search + Categories */}
              <div className="px-5 py-3 space-y-2">
                <input className="input-field w-full" placeholder="Search plugins…" value={search}
                  onChange={e => setSearch(e.target.value)} style={{ fontSize: 12, padding: '7px 12px' }} />
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {CATEGORIES.map(c => (
                    <button key={c} className="px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 transition-all"
                      style={{
                        background: category === c ? 'var(--accent)' : 'var(--bg-primary)',
                        color: category === c ? 'white' : 'var(--text-muted)',
                        border: 'none', cursor: 'pointer',
                      }}
                      onClick={() => setCategory(c)}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Plugin grid */}
              <div className="flex-1 overflow-y-auto px-5 pb-4 grid grid-cols-2 gap-3">
                {filteredPlugins.map(p => {
                  const installed = installedIds.has(p.id);
                  return (
                    <motion.div key={p.id} className="p-3 rounded-xl" whileHover={{ y: -2 }}
                      style={{ background: 'var(--bg-primary)', border: `1px solid ${installed ? 'var(--accent)' : 'var(--border)'}` }}>
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xl">{p.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                          <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{p.author} · v{p.version}</div>
                        </div>
                      </div>
                      <p className="text-[10px] mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>⬇ {p.downloads}</span>
                        {installed ? (
                          <button className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                            style={{ background: 'var(--danger-dim, rgba(239,68,68,0.1))', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                            onClick={() => uninstallPlugin(p.id)}
                          >Remove</button>
                        ) : (
                          <button className="btn-primary" style={{ fontSize: 10, padding: '2px 10px' }}
                            onClick={() => installPlugin({ id: p.id, name: p.name, version: p.version, enabled: true })}
                          >Install</button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'installed' && (
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {installedPlugins.length === 0 && (
                <div className="text-center py-16 text-xs" style={{ color: 'var(--text-muted)' }}>
                  No plugins installed yet. Browse the marketplace to get started!
                </div>
              )}
              {installedPlugins.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <span className="text-xl">{SAMPLE_PLUGINS.find(sp => sp.id === p.id)?.icon || '🧩'}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                    <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>v{p.version}</div>
                  </div>
                  <button className="w-8 h-4 rounded-full transition-colors relative"
                    style={{ background: p.enabled ? 'var(--accent)' : 'var(--bg-hover)', border: 'none', cursor: 'pointer' }}
                    onClick={() => togglePlugin(p.id)}>
                    <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
                      style={{ left: p.enabled ? 17 : 2 }} />
                  </button>
                  <button className="btn-icon" style={{ width: 24, height: 24, color: '#ef4444' }}
                    onClick={() => uninstallPlugin(p.id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
