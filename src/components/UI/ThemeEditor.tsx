'use client';
/* ═══════════════════════════════════════════════════════
   ThemeEditor — Custom theme creator & manager
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { THEMES } from '@/types/slide';
import type { ThemeKey } from '@/types/slide';

interface Props { open: boolean; onClose: () => void; }

export default function ThemeEditor({ open, onClose }: Props) {
  const [tab, setTab] = useState<'presets' | 'custom' | 'style'>('presets');
  const [newThemeName, setNewThemeName] = useState('');
  const [editColors, setEditColors] = useState({ bg: '#ffffff', text: '#1a1a2e', accent: '#6366f1', heading: '#f1f5f9' });

  const setTheme = useSlideStore(s => s.setTheme);
  const customThemes = useSlideStore(s => s.customThemes);
  const addCustomTheme = useSlideStore(s => s.addCustomTheme);
  const removeCustomTheme = useSlideStore(s => s.removeCustomTheme);
  const globalFontFamily = useSlideStore(s => s.globalFontFamily);
  const setGlobalFontFamily = useSlideStore(s => s.setGlobalFontFamily);
  const headingFont = useSlideStore(s => s.headingFont);
  const setHeadingFont = useSlideStore(s => s.setHeadingFont);
  const bodyFont = useSlideStore(s => s.bodyFont);
  const setBodyFont = useSlideStore(s => s.setBodyFont);
  const colorScheme = useSlideStore(s => s.colorScheme);
  const setColorScheme = useSlideStore(s => s.setColorScheme);
  const gradientPresets = useSlideStore(s => s.gradientPresets);
  const addGradientPreset = useSlideStore(s => s.addGradientPreset);
  const removeGradientPreset = useSlideStore(s => s.removeGradientPreset);
  const slideNumberFormat = useSlideStore(s => s.slideNumberFormat);
  const setSlideNumberFormat = useSlideStore(s => s.setSlideNumberFormat);
  const headerFooter = useSlideStore(s => s.headerFooter);
  const setHeaderFooter = useSlideStore(s => s.setHeaderFooter);

  const themeKeys = Object.keys(THEMES) as ThemeKey[];

  const handleSaveTheme = () => {
    if (!newThemeName.trim()) return;
    addCustomTheme(newThemeName.trim(), editColors);
    setNewThemeName('');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9984] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxHeight: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🎨 Theme & Style Editor</h2>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-5 pt-3 gap-1">
            {(['presets', 'custom', 'style'] as const).map(t => (
              <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: tab === t ? 'var(--accent-dim)' : 'transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setTab(t)}
              >{t === 'style' ? 'Typography & Layout' : t}</button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {tab === 'presets' && (
              <>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Built-in Themes</div>
                <div className="grid grid-cols-3 gap-2">
                  {themeKeys.map(key => {
                    const t = THEMES[key];
                    return (
                      <motion.button key={key} className="p-2 rounded-lg text-left transition-all"
                        style={{ background: t.bg, border: '2px solid var(--border)', cursor: 'pointer' }}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setTheme(key)}
                      >
                        <div className="text-[10px] font-bold mb-1" style={{ color: t.heading }}>Heading</div>
                        <div className="text-[9px]" style={{ color: t.text }}>Body text</div>
                        <div className="flex gap-1 mt-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ background: t.accent }} />
                          <div className="w-3 h-3 rounded-full" style={{ background: t.text, opacity: 0.5 }} />
                        </div>
                        <div className="text-[8px] mt-1 capitalize font-medium" style={{ color: t.text, opacity: 0.6 }}>{key}</div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Custom themes list */}
                {Object.keys(customThemes).length > 0 && (
                  <>
                    <div className="text-xs pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>Custom Themes</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(customThemes).map(([name, t]) => (
                        <div key={name} className="p-2 rounded-lg relative group"
                          style={{ background: t.bg, border: '2px solid var(--border)' }}>
                          <div className="text-[10px] font-bold mb-1" style={{ color: t.heading }}>Heading</div>
                          <div className="text-[9px]" style={{ color: t.text }}>Body</div>
                          <div className="flex gap-1 mt-1">
                            <div className="w-3 h-3 rounded-full" style={{ background: t.accent }} />
                          </div>
                          <div className="text-[8px] mt-1 font-medium" style={{ color: t.text, opacity: 0.6 }}>{name}</div>
                          <button
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4, width: 16, height: 16, fontSize: 10 }}
                            onClick={() => removeCustomTheme(name)}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {tab === 'custom' && (
              <>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Create Custom Theme</div>
                <div className="p-3 rounded-lg space-y-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <input className="input-field w-full" placeholder="Theme name" value={newThemeName}
                    onChange={e => setNewThemeName(e.target.value)} style={{ fontSize: 12, padding: '6px 10px' }} />

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Background', key: 'bg' as const },
                      { label: 'Text Color', key: 'text' as const },
                      { label: 'Accent', key: 'accent' as const },
                      { label: 'Heading', key: 'heading' as const },
                    ].map(item => (
                      <div key={item.key}>
                        <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-muted)' }}>{item.label}</label>
                        <div className="flex gap-1 items-center">
                          <input type="color" value={editColors[item.key]}
                            onChange={e => setEditColors(prev => ({ ...prev, [item.key]: e.target.value }))}
                            style={{ width: 24, height: 24, cursor: 'pointer', border: 'none', borderRadius: 4 }} />
                          <input className="input-field flex-1" value={editColors[item.key]}
                            onChange={e => setEditColors(prev => ({ ...prev, [item.key]: e.target.value }))}
                            style={{ fontSize: 10, padding: '3px 6px' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="rounded-lg p-3" style={{ background: editColors.bg, border: '1px solid var(--border)' }}>
                    <div className="text-xs font-bold mb-1" style={{ color: editColors.heading }}>Theme Preview</div>
                    <div className="text-[10px]" style={{ color: editColors.text }}>This is how your slides will look with this theme.</div>
                    <div className="w-full h-1 rounded mt-2" style={{ background: editColors.accent }} />
                  </div>

                  <button className="btn-primary w-full" onClick={handleSaveTheme} style={{ fontSize: 12 }}>Save Theme</button>
                </div>

                {/* Color scheme */}
                <div className="text-xs pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>Color Scheme</div>
                <div className="flex gap-1 items-center flex-wrap">
                  {colorScheme.map((c, i) => (
                    <div key={i} className="relative group">
                      <input type="color" value={c}
                        onChange={e => {
                          const newScheme = [...colorScheme];
                          newScheme[i] = e.target.value;
                          setColorScheme(newScheme);
                        }}
                        style={{ width: 24, height: 24, cursor: 'pointer', border: '1px solid var(--border)', borderRadius: 4 }} />
                    </div>
                  ))}
                  <button className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: 'var(--bg-primary)', border: '1px dashed var(--border)', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}
                    onClick={() => setColorScheme([...colorScheme, '#6366f1'])}
                  >+</button>
                </div>

                {/* Gradient presets */}
                <div className="text-xs pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>Gradient Presets</div>
                <div className="flex gap-1 flex-wrap">
                  {gradientPresets.map(g => (
                    <div key={g.name} className="relative group">
                      <div className="w-10 h-10 rounded-lg cursor-pointer" style={{ background: g.value }} title={g.name} />
                      <button className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] opacity-0 group-hover:opacity-100"
                        style={{ background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', lineHeight: '12px' }}
                        onClick={() => removeGradientPreset(g.name)}
                      >×</button>
                    </div>
                  ))}
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--bg-primary)', border: '1px dashed var(--border)', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}
                    onClick={() => addGradientPreset({ name: `Gradient ${gradientPresets.length + 1}`, value: 'linear-gradient(135deg, #6366f1, #ec4899)' })}
                  >+</button>
                </div>
              </>
            )}

            {tab === 'style' && (
              <>
                {/* Fonts */}
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Typography</div>
                <div className="space-y-2">
                  {[
                    { label: 'Global Font', value: globalFontFamily, set: setGlobalFontFamily },
                    { label: 'Heading Font', value: headingFont, set: setHeadingFont },
                    { label: 'Body Font', value: bodyFont, set: setBodyFont },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <label className="text-xs w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</label>
                      <select className="input-field flex-1" value={item.value}
                        onChange={e => item.set(e.target.value)}
                        style={{ fontSize: 11, padding: '4px 8px' }}>
                        {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather', 'Fira Code', 'Space Grotesk', 'DM Sans', 'IBM Plex Sans', 'JetBrains Mono'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Slide numbering */}
                <div className="text-xs pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>Slide Numbers</div>
                <div className="flex gap-1">
                  {(['number', 'fraction', 'roman', 'none'] as const).map(f => (
                    <button key={f} className="flex-1 py-1.5 rounded text-xs capitalize transition-colors"
                      style={{
                        background: slideNumberFormat === f ? 'var(--accent-dim)' : 'transparent',
                        color: slideNumberFormat === f ? 'var(--accent)' : 'var(--text-muted)',
                        border: `1px solid ${slideNumberFormat === f ? 'var(--accent)' : 'var(--border)'}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSlideNumberFormat(f)}
                    >{f}</button>
                  ))}
                </div>

                {/* Header/Footer */}
                <div className="text-xs pt-3" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>Header & Footer</div>
                <div className="space-y-2">
                  <input className="input-field w-full" placeholder="Header text" value={headerFooter.header}
                    onChange={e => setHeaderFooter({ ...headerFooter, header: e.target.value })}
                    style={{ fontSize: 11, padding: '5px 8px' }} />
                  <input className="input-field w-full" placeholder="Footer text" value={headerFooter.footer}
                    onChange={e => setHeaderFooter({ ...headerFooter, footer: e.target.value })}
                    style={{ fontSize: 11, padding: '5px 8px' }} />
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                      <input type="checkbox" checked={headerFooter.showDate} onChange={e => setHeaderFooter({ ...headerFooter, showDate: e.target.checked })} />
                      Show Date
                    </label>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                      <input type="checkbox" checked={headerFooter.showPageNumber} onChange={e => setHeaderFooter({ ...headerFooter, showPageNumber: e.target.checked })} />
                      Page Number
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
