'use client';
/* ═══════════════════════════════════════════════════════
   EditorLayout v5.0 — Premium editor shell
   ═══════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuBar from './MenuBar';
import Toolbar from './Toolbar';
import SlideList from './SlideList';
import SlideCanvas from './SlideCanvas';
import PropertyPanel from '../Panels/PropertyPanel';
import PresentMode from '../Presentation/PresentMode';
import FindReplace from './FindReplace';
import StatusBar from './StatusBar';
import ContextMenu from './ContextMenu';
import SlideSorter from './SlideSorter';
import PresenterView from '../Presentation/PresenterView';
import ShortcutsHelp from '../UI/ShortcutsHelp';
import TemplateGallery from '../UI/TemplateGallery';
import ToastContainer from '../UI/ToastContainer';
import SplashScreen from '../UI/SplashScreen';
import GradientBuilder from '../UI/GradientBuilder';
import CommentsPanel from '../UI/CommentsPanel';
import AIPanel from '../Panels/AIPanel';
import LayersPanel from '../Panels/LayersPanel';
/* ── New component imports ── */
import CommandPalette from '../UI/CommandPalette';
import ExportDialog from '../UI/ExportDialog';
import SettingsDialog from '../UI/SettingsDialog';
import AnimationTimeline from '../UI/AnimationTimeline';
import MediaLibrary from '../UI/MediaLibrary';
import EmojiSymbolPicker from '../UI/EmojiSymbolPicker';
import CollaborationPanel2 from '../UI/CollaborationPanel2';
import PluginMarketplace from '../UI/PluginMarketplace';
import ThemeEditor from '../UI/ThemeEditor';
import AccessibilityChecker from '../UI/AccessibilityChecker';
import VersionHistory from '../UI/VersionHistory';
import PerformanceMonitor from '../UI/PerformanceMonitor';
import NotificationCenter from '../UI/NotificationCenter';
import CodingLab from '../UI/CodingLab';
import SimulationEngine from '../UI/SimulationEngine';
import AnalyticsDashboard from '../UI/AnalyticsDashboard';
import LinkEditor from '../UI/LinkEditor';
import { useSlideStore } from '@/store/useSlideStore';
import useAutosave from '@/hooks/useAutosave';

const PANEL_TABS = [
  { key: 'properties' as const, label: 'Design', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  )},
  { key: 'ai' as const, label: 'AI', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  )},
  { key: 'layers' as const, label: 'Layers', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  )},
];

export default function EditorLayout() {
  const isPresentMode = useSlideStore(s => s.isPresentMode);
  const findReplaceOpen = useSlideStore(s => s.findReplaceOpen);
  const showPresenterView = useSlideStore(s => s.showPresenterView);
  const showSlideSorter = useSlideStore(s => s.showSlideSorter);
  const showShortcutsHelp = useSlideStore(s => s.showShortcutsHelp);
  const showTemplateGallery = useSlideStore(s => s.showTemplateGallery);
  const rightPanelTab = useSlideStore(s => s.rightPanelTab);
  const setRightPanelTab = useSlideStore(s => s.setRightPanelTab);
  const showGradient = useSlideStore(s => s.showGradient);
  const setShowGradient = useSlideStore(s => s.setShowGradient);
  const showComments = useSlideStore(s => s.showComments);
  const setShowComments = useSlideStore(s => s.setShowComments);
  /* ── New dialog states ── */
  const commandPaletteOpen = useSlideStore(s => s.commandPaletteOpen);
  const showExportDialog = useSlideStore(s => s.showExportDialog);
  const showSettingsDialog = useSlideStore(s => s.showSettingsDialog);
  const showAnimationTimeline = useSlideStore(s => s.showAnimationTimeline);
  const mediaLibrary = useSlideStore(s => s.mediaLibrary);
  const symbolPicker = useSlideStore(s => s.symbolPicker);
  const emojiPicker = useSlideStore(s => s.emojiPicker);
  const pluginPanelOpen = useSlideStore(s => s.pluginPanelOpen);
  const showThemeEditor = useSlideStore(s => s.showThemeEditor);
  const showAccessibilityChecker = useSlideStore(s => s.showAccessibilityChecker);
  const showVersionHistory = useSlideStore(s => s.showVersionHistory);
  const showNotificationCenter = useSlideStore(s => s.showNotificationCenter);
  const showCodingLab = useSlideStore(s => s.showCodingLab);
  const showSimulationEngine = useSlideStore(s => s.showSimulationEngine);
  const showAnalyticsDashboard = useSlideStore(s => s.showAnalyticsDashboard);
  const showCollaborationPanel = useSlideStore(s => s.showCollaborationPanel);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  useAutosave(30000);

  if (isPresentMode) return <PresentMode />;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* ── Top chrome: Menu + Toolbar ── */}
      <MenuBar />
      <Toolbar />

      {/* ── Main workspace ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Slide list */}
        <AnimatePresence mode="wait">
          {!leftPanelCollapsed ? (
            <motion.div
              key="slide-list"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 overflow-hidden"
            >
              <SlideList onCollapseAction={() => setLeftPanelCollapsed(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="slide-list-collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center py-3 shrink-0 gap-2"
              style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
            >
              <button
                className="btn-icon"
                onClick={() => setLeftPanelCollapsed(false)}
                data-tooltip="Show Slides"
                style={{ width: 28, height: 28, fontSize: 13 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Canvas workspace */}
        <div className="flex-1 flex items-center justify-center overflow-auto relative"
          style={{ background: 'var(--canvas-bg)' }}>
          <SlideCanvas />
          <ContextMenu />
        </div>

        {/* Right: Panel */}
        <AnimatePresence mode="wait">
          {!rightPanelCollapsed ? (
            <motion.div
              key="right-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 296, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col overflow-hidden shrink-0"
              style={{
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border)',
              }}
            >
              {/* Tab bar */}
              <div className="flex items-center shrink-0"
                style={{ borderBottom: '1px solid var(--border)', height: 40 }}>
                {PANEL_TABS.map(tab => {
                  const isActive = rightPanelTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      className="flex items-center justify-center gap-2 flex-1 relative transition-all"
                      style={{
                        height: '100%',
                        background: 'transparent',
                        color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        border: 'none',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                      }}
                      onClick={() => setRightPanelTab(tab.key)}
                    >
                      <span style={{ opacity: isActive ? 1 : 0.6 }}>{tab.icon}</span>
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="panel-tab-indicator"
                          className="absolute bottom-0 left-3 right-3"
                          style={{ height: 2, background: 'var(--accent)', borderRadius: 99 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
                {/* Collapse button */}
                <button
                  className="btn-icon shrink-0"
                  style={{ width: 32, height: '100%', borderRadius: 0, fontSize: 13 }}
                  onClick={() => setRightPanelCollapsed(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* Panel body */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rightPanelTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="h-full min-h-0"
                  >
                    {rightPanelTab === 'properties' && <PropertyPanel />}
                    {rightPanelTab === 'ai' && <AIPanel />}
                    {rightPanelTab === 'layers' && <LayersPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="right-panel-collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center py-3 gap-1 shrink-0"
              style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
            >
              {PANEL_TABS.map(tab => (
                <button
                  key={tab.key}
                  className="btn-icon"
                  style={{
                    width: 28, height: 28,
                    color: rightPanelTab === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                    background: rightPanelTab === tab.key ? 'var(--accent-dim)' : 'transparent',
                  }}
                  onClick={() => { setRightPanelTab(tab.key); setRightPanelCollapsed(false); }}
                  data-tooltip={tab.label}
                >
                  {tab.icon}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom: Status Bar ── */}
      <StatusBar />

      {/* ── Overlays ── */}
      {findReplaceOpen && <FindReplace />}
      {showPresenterView && <PresenterView onClose={() => useSlideStore.getState().setPresenterView(false)} />}
      {showSlideSorter && <SlideSorter open={showSlideSorter} onClose={() => useSlideStore.getState().setSlideSorter(false)} />}
      {showShortcutsHelp && <ShortcutsHelp open={showShortcutsHelp} onClose={() => useSlideStore.getState().setShortcutsHelp(false)} />}
      {showTemplateGallery && <TemplateGallery open={showTemplateGallery} onClose={() => useSlideStore.getState().setTemplateGallery(false)} />}
      <ToastContainer />
      <SplashScreen />
      <GradientBuilder open={showGradient} onClose={() => setShowGradient(false)} />
      <CommentsPanel open={showComments} onClose={() => setShowComments(false)} />

      {/* ── New Component Overlays ── */}
      <CommandPalette />
      <ExportDialog />
      <LinkEditor />
      <PerformanceMonitor />
      <SettingsDialog open={showSettingsDialog} onClose={() => useSlideStore.getState().setShowSettingsDialog(false)} />
      <AnimationTimeline open={showAnimationTimeline} onClose={() => useSlideStore.getState().setShowAnimationTimeline(false)} />
      <MediaLibrary open={mediaLibrary} onClose={() => useSlideStore.getState().toggleMediaLibrary()} />
      <EmojiSymbolPicker open={symbolPicker || emojiPicker} onClose={() => { if (symbolPicker) useSlideStore.getState().toggleSymbolPicker(); if (emojiPicker) useSlideStore.getState().toggleEmojiPicker(); }} />
      <PluginMarketplace open={pluginPanelOpen} onClose={() => useSlideStore.getState().togglePluginPanel()} />
      <ThemeEditor open={showThemeEditor} onClose={() => useSlideStore.getState().setShowThemeEditor(false)} />
      <AccessibilityChecker open={showAccessibilityChecker} onClose={() => useSlideStore.getState().setShowAccessibilityChecker(false)} />
      <VersionHistory open={showVersionHistory} onClose={() => useSlideStore.getState().toggleVersionHistory()} />
      <NotificationCenter open={showNotificationCenter} onClose={() => useSlideStore.getState().setShowNotificationCenter(false)} />
      <CodingLab open={showCodingLab} onClose={() => useSlideStore.getState().setShowCodingLab(false)} />
      <SimulationEngine open={showSimulationEngine} onClose={() => useSlideStore.getState().setShowSimulationEngine(false)} />
      <AnalyticsDashboard open={showAnalyticsDashboard} onClose={() => useSlideStore.getState().setShowAnalyticsDashboard(false)} />
      <CollaborationPanel2 open={showCollaborationPanel} onClose={() => useSlideStore.getState().setShowCollaborationPanel(false)} />
    </div>
  );
}
