'use client';
/* ═══════════════════════════════════════════════════════
   SettingsDialog — Editor preferences, accessibility,
   AI settings, performance, keybindings, brand kit
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

interface SectionProps { title: string; children: React.ReactNode; }
function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: () => void; }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-1">
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{description}</div>}
      </div>
      <button
        onClick={e => { e.preventDefault(); onChange(); }}
        className="relative shrink-0 rounded-full transition-colors"
        style={{
          width: 36, height: 20,
          background: checked ? 'var(--accent)' : 'var(--bg-hover)',
        }}
      >
        <motion.div
          className="absolute top-1 rounded-full"
          style={{ width: 12, height: 12, background: '#fff' }}
          animate={{ left: checked ? 20 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </label>
  );
}

const TABS = [
  { key: 'editor', label: 'Editor', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { key: 'appearance', label: 'Appearance', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> },
  { key: 'ai', label: 'AI', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { key: 'accessibility', label: 'Accessibility', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="4" r="2"/><path d="M12 6v6m-4-4l4 2 4-2m-8 6l4 6 4-6"/></svg> },
  { key: 'brand', label: 'Brand Kit', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg> },
  { key: 'performance', label: 'Performance', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
] as const;

interface Props { open: boolean; onClose: () => void; }

export default function SettingsDialog({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('editor');
  const store = useSlideStore();

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
          className="w-full max-w-3xl rounded-xl overflow-hidden flex"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', height: '70vh' }}
          initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Sidebar */}
          <div className="shrink-0 flex flex-col py-4 px-2 gap-1" style={{ width: 180, background: 'var(--bg-primary)', borderRight: '1px solid var(--border)' }}>
            <div className="px-3 mb-3" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Settings</div>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  background: activeTab === tab.key ? 'var(--accent-dim)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400,
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {activeTab === 'editor' && (
                  <>
                    <Section title="Canvas">
                      <Toggle label="Snap to Grid" description="Align elements to grid positions" checked={store.snapToGrid} onChange={store.toggleSnapToGrid} />
                      <Toggle label="Smart Guides" description="Show alignment guides" checked={store.smartGuides} onChange={store.toggleSmartGuides} />
                      <Toggle label="Snap to Guides" description="Snap elements to guides" checked={store.snapToGuides} onChange={store.toggleSnapToGuides} />
                      <Toggle label="Show Snap Indicators" checked={store.showSnapIndicators} onChange={store.toggleSnapIndicators} />
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 80 }}>Grid Size</span>
                        <input className="input-field" type="number" min={5} max={100} value={store.gridSize}
                          onChange={e => store.setGridSize(Number(e.target.value))} style={{ width: 80, padding: '4px 8px', fontSize: 12 }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 80 }}>Grid Color</span>
                        <input type="color" value={store.gridColor} onChange={e => store.setGridColor(e.target.value)}
                          style={{ width: 32, height: 24, border: 'none', background: 'none', cursor: 'pointer' }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 80 }}>Ruler Unit</span>
                        <select className="select-field" value={store.rulerUnit} onChange={e => store.setRulerUnit(e.target.value as 'px' | 'in' | 'cm')}
                          style={{ width: 80, padding: '4px 8px', fontSize: 12 }}>
                          <option value="px">Pixels</option>
                          <option value="in">Inches</option>
                          <option value="cm">Centimeters</option>
                        </select>
                      </div>
                    </Section>
                    <Section title="Editing">
                      <Toggle label="Spell Check" checked={store.spellCheck} onChange={store.toggleSpellCheck} />
                      <Toggle label="Focus Mode" description="Dim everything except selected" checked={store.focusMode} onChange={store.toggleFocusMode} />
                      <Toggle label="Auto-save" checked={store.autoSaveEnabled} onChange={store.toggleAutoSave} />
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 120 }}>Auto-save Interval</span>
                        <select className="select-field" value={store.autoSaveInterval} onChange={e => store.setAutoSaveInterval(Number(e.target.value))}
                          style={{ width: 100, padding: '4px 8px', fontSize: 12 }}>
                          <option value={10000}>10 seconds</option>
                          <option value={30000}>30 seconds</option>
                          <option value={60000}>1 minute</option>
                          <option value={300000}>5 minutes</option>
                        </select>
                      </div>
                    </Section>
                    <Section title="Canvas Size">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 60 }}>Width</span>
                        <input className="input-field" type="number" value={store.canvasWidth}
                          onChange={e => store.setCanvasWidth(Number(e.target.value))} style={{ width: 100, padding: '4px 8px', fontSize: 12 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 60 }}>Height</span>
                        <input className="input-field" type="number" value={store.canvasHeight}
                          onChange={e => store.setCanvasHeight(Number(e.target.value))} style={{ width: 100, padding: '4px 8px', fontSize: 12 }} />
                      </div>
                    </Section>
                  </>
                )}

                {activeTab === 'appearance' && (
                  <>
                    <Section title="Display">
                      <Toggle label="Dark Canvas" description="Dark workspace background" checked={store.darkCanvas} onChange={store.toggleDarkCanvas} />
                      <Toggle label="Show Minimap" checked={store.showMinimap} onChange={store.toggleMinimap} />
                      <Toggle label="Compact Mode" description="Reduce UI spacing" checked={store.compactMode} onChange={store.toggleCompactMode} />
                      <Toggle label="Show Tooltips" checked={store.showTooltips} onChange={store.toggleTooltips} />
                      <Toggle label="Show Element Bounds" checked={store.showElementBounds} onChange={store.toggleElementBounds} />
                      <Toggle label="Show Safe Area" checked={store.showSafeArea} onChange={store.toggleSafeArea} />
                      <Toggle label="Outline Mode" description="Show element outlines only" checked={store.outlineMode} onChange={store.toggleOutlineMode} />
                      <Toggle label="Show Pixel Grid" description="Fine grid at high zoom" checked={store.showPixelGrid} onChange={store.togglePixelGrid} />
                      <Toggle label="Show Baseline Grid" checked={store.showBaseline} onChange={store.toggleBaseline} />
                    </Section>
                    <Section title="Typography">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Heading Font</span>
                        <input className="input-field flex-1" value={store.headingFont}
                          onChange={e => store.setHeadingFont(e.target.value)} style={{ padding: '4px 8px', fontSize: 12 }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Body Font</span>
                        <input className="input-field flex-1" value={store.bodyFont}
                          onChange={e => store.setBodyFont(e.target.value)} style={{ padding: '4px 8px', fontSize: 12 }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Base Size</span>
                        <input className="input-field" type="number" value={store.globalFontSize}
                          onChange={e => store.setGlobalFontSize(Number(e.target.value))} style={{ width: 80, padding: '4px 8px', fontSize: 12 }} />
                      </div>
                    </Section>
                    <Section title="Slide Number Format">
                      <div className="flex gap-2">
                        {(['number', 'fraction', 'roman', 'none'] as const).map(f => (
                          <button
                            key={f}
                            className="px-3 py-1.5 rounded-lg text-xs capitalize transition-all"
                            style={{
                              background: store.slideNumberFormat === f ? 'var(--accent-dim)' : 'var(--bg-primary)',
                              border: store.slideNumberFormat === f ? '1px solid var(--accent)' : '1px solid var(--border)',
                              color: store.slideNumberFormat === f ? 'var(--accent)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                            onClick={() => store.setSlideNumberFormat(f)}
                          >{f}</button>
                        ))}
                      </div>
                    </Section>
                  </>
                )}

                {activeTab === 'ai' && (
                  <>
                    <Section title="AI Assistant">
                      <Toggle label="Enable AI" description="AI-powered features" checked={store.aiEnabled} onChange={store.toggleAI} />
                      <Toggle label="Auto-complete" description="AI text suggestions" checked={store.aiAutoComplete} onChange={store.toggleAIAutoComplete} />
                      <Toggle label="Design Suggestions" description="Layout & design recommendations" checked={store.aiDesignSuggestions} onChange={store.toggleAIDesignSuggestions} />
                      <Toggle label="Accessibility Check" description="AI-powered a11y analysis" checked={store.aiAccessibilityCheck} onChange={store.toggleAIAccessibilityCheck} />
                    </Section>
                    <Section title="Model Settings">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>AI Model</span>
                        <select className="select-field flex-1" value={store.aiModel} onChange={e => store.setAIModel(e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12 }}>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="gemma3:1b">Gemma 3 1B (Local)</option>
                          <option value="claude-3">Claude 3</option>
                          <option value="llama-3">Llama 3</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Temperature</span>
                        <input type="range" min={0} max={2} step={0.1} value={store.aiTemperature}
                          onChange={e => store.setAITemperature(Number(e.target.value))}
                          style={{ flex: 1, accentColor: 'var(--accent)' }} />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 30, textAlign: 'right' }}>{store.aiTemperature}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Language</span>
                        <select className="select-field flex-1" value={store.aiLanguage} onChange={e => store.setAILanguage(e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12 }}>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                          <option value="ja">Japanese</option>
                          <option value="hi">Hindi</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>Tone</span>
                        <select className="select-field flex-1" value={store.aiToneOfVoice} onChange={e => store.setAIToneOfVoice(e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12 }}>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="academic">Academic</option>
                          <option value="creative">Creative</option>
                          <option value="simplified">Simplified</option>
                        </select>
                      </div>
                    </Section>
                  </>
                )}

                {activeTab === 'accessibility' && (
                  <>
                    <Section title="Visual">
                      <Toggle label="High Contrast" description="Increase contrast ratios" checked={store.highContrast} onChange={store.toggleHighContrast} />
                      <Toggle label="Reduced Motion" description="Minimize animations" checked={store.reducedMotion} onChange={store.toggleReducedMotion} />
                      <Toggle label="Focus Ring Visible" description="Show keyboard focus indicator" checked={store.focusRingVisible} onChange={store.toggleFocusRing} />
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 100 }}>UI Font Size</span>
                        <select className="select-field" value={store.fontSize} onChange={e => store.setFontSize(e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
                          style={{ width: 100, padding: '4px 8px', fontSize: 12 }}>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                        </select>
                      </div>
                    </Section>
                    <Section title="Color Blind Support">
                      <div className="flex gap-2 flex-wrap">
                        {(['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map(mode => (
                          <button
                            key={mode}
                            className="px-3 py-1.5 rounded-lg text-xs capitalize transition-all"
                            style={{
                              background: store.colorBlindMode === mode ? 'var(--accent-dim)' : 'var(--bg-primary)',
                              border: store.colorBlindMode === mode ? '1px solid var(--accent)' : '1px solid var(--border)',
                              color: store.colorBlindMode === mode ? 'var(--accent)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                            onClick={() => store.setColorBlindMode(mode)}
                          >{mode}</button>
                        ))}
                      </div>
                    </Section>
                    <Section title="Content">
                      <Toggle label="Screen Reader Mode" description="Optimize for assistive tech" checked={store.screenReaderMode} onChange={store.toggleScreenReaderMode} />
                      <Toggle label="Keyboard Shortcuts" checked={store.keyboardShortcutsEnabled} onChange={store.toggleKeyboardShortcuts} />
                      <Toggle label="Enforce Alt Text" description="Require alt text for images" checked={store.altTextEnforcement} onChange={store.toggleAltTextEnforcement} />
                    </Section>
                  </>
                )}

                {activeTab === 'brand' && (
                  <>
                    <Section title="Brand Colors">
                      <div className="flex gap-2 flex-wrap">
                        {store.brandKit.colors.map((color, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <input type="color" value={color}
                              onChange={e => {
                                const newColors = [...store.brandKit.colors];
                                newColors[i] = e.target.value;
                                store.setBrandKit({ ...store.brandKit, colors: newColors });
                              }}
                              style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
                            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{color}</span>
                          </div>
                        ))}
                        <button
                          className="btn-ghost flex items-center justify-center"
                          style={{ width: 40, height: 32, fontSize: 16 }}
                          onClick={() => store.setBrandKit({ ...store.brandKit, colors: [...store.brandKit.colors, '#000000'] })}
                        >+</button>
                      </div>
                    </Section>
                    <Section title="Brand Fonts">
                      {store.brandKit.fonts.map((font, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input className="input-field flex-1" value={font}
                            onChange={e => {
                              const newFonts = [...store.brandKit.fonts];
                              newFonts[i] = e.target.value;
                              store.setBrandKit({ ...store.brandKit, fonts: newFonts });
                            }}
                            style={{ padding: '4px 8px', fontSize: 12 }} />
                        </div>
                      ))}
                    </Section>
                    <Section title="Color Palette">
                      <div className="flex gap-2 flex-wrap">
                        {store.customPalette.map((color, i) => (
                          <input key={i} type="color" value={color}
                            onChange={e => {
                              const newPalette = [...store.customPalette];
                              newPalette[i] = e.target.value;
                              store.setCustomPalette(newPalette);
                            }}
                            style={{ width: 28, height: 24, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
                        ))}
                      </div>
                    </Section>
                  </>
                )}

                {activeTab === 'performance' && (
                  <>
                    <Section title="Rendering">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 120 }}>Render Quality</span>
                        <select className="select-field" value={store.renderQuality}
                          onChange={e => store.setRenderQuality(e.target.value as 'low' | 'medium' | 'high')}
                          style={{ width: 100, padding: '4px 8px', fontSize: 12 }}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <Toggle label="Cache Enabled" description="Cache rendered elements" checked={store.cacheEnabled} onChange={store.toggleCache} />
                      <Toggle label="Lazy Load Images" checked={store.lazyLoadImages} onChange={store.toggleLazyLoadImages} />
                    </Section>
                    <Section title="History">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', width: 120 }}>Max Undo Steps</span>
                        <input className="input-field" type="number" min={10} max={200} value={store.maxUndoSteps}
                          onChange={e => store.setMaxUndoSteps(Number(e.target.value))} style={{ width: 80, padding: '4px 8px', fontSize: 12 }} />
                      </div>
                    </Section>
                    <Section title="Debug">
                      <Toggle label="Debug Mode" description="Show debug overlays" checked={store.debugMode} onChange={store.toggleDebugMode} />
                      <Toggle label="Show FPS Counter" checked={store.showFPS} onChange={store.toggleShowFPS} />
                    </Section>
                    {store.performanceMetrics && (
                      <Section title="Metrics">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'FPS', value: store.performanceMetrics.fps },
                            { label: 'Memory', value: `${store.performanceMetrics.memory}MB` },
                            { label: 'Render', value: `${store.performanceMetrics.renderTime}ms` },
                          ].map(m => (
                            <div key={m.label} className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
                              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{m.value}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
