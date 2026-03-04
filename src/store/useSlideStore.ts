/* ═══════════════════════════════════════════════════════
   Zustand Store — Presentation state & operations
   ═══════════════════════════════════════════════════════ */
import { create } from 'zustand';
import {
  Presentation, Slide, SlideElement, ThemeKey, TransitionType,
} from '@/types/slide';
import { createElement, slideUid } from '@/lib/elements';

/* ── Helper ─────────────────────────────────────── */
function defaultSlide(order = 0): Slide {
  return {
    id: slideUid(),
    order,
    layout: 'blank',
    background: { type: 'solid', value: '#ffffff' },
    elements: [],
    notes: '',
    transition: 'none',
    animations: [],
  };
}

function defaultPresentation(): Presentation {
  return {
    meta: {
      title: 'Untitled Presentation',
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '3.0',
      theme: 'default',
      aspectRatio: '16:9',
    },
    slides: [defaultSlide(0)],
    settings: {
      transition: 'fade',
      transitionDuration: 500,
      autoPlay: false,
      autoPlayInterval: 5000,
      showSlideNumbers: true,
      enableAI: true,
      enableInteractive: true,
    },
  };
}

/* ── Snapshot for undo / redo ─────────────────────── */
interface Snapshot {
  slides: Slide[];
  currentSlide: number;
}

/* ── Tool modes ──────────────────────────────────── */
export type ToolMode = 'select' | 'draw' | 'text' | 'shape' | 'pan';

/* ── Store Interface ─────────────────────────────── */
export interface SlideStore {
  /* ─── Data ─── */
  presentation: Presentation;
  currentSlideIndex: number;
  selectedElementIds: string[];
  clipboard: SlideElement[];
  toolMode: ToolMode;
  drawColor: string;
  drawStrokeWidth: number;
  zoom: number;
  showGrid: boolean;
  showRuler: boolean;
  isPresentMode: boolean;
  formatPainterStyle: Record<string, unknown> | null;
  findReplaceOpen: boolean;

  /* ─── Undo / Redo ─── */
  undoStack: Snapshot[];
  redoStack: Snapshot[];

  /* ─── Derived helpers ─── */
  currentSlide: () => Slide;
  selectedElements: () => SlideElement[];

  /* ─── Slide CRUD ─── */
  addSlide: (slide?: Partial<Slide>) => void;
  duplicateSlide: (idx?: number) => void;
  removeSlide: (idx?: number) => void;
  moveSlide: (from: number, to: number) => void;
  goToSlide: (idx: number) => void;
  updateSlideField: <K extends keyof Slide>(key: K, value: Slide[K]) => void;
  setSlideBackground: (bg: Slide['background']) => void;

  /* ─── Element CRUD ─── */
  addElement: (el: SlideElement) => void;
  updateElement: (id: string, patch: Partial<SlideElement>) => void;
  removeElements: (ids?: string[]) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  /* ─── Selection ─── */
  selectElement: (id: string | null, multi?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;

  /* ─── Clipboard ─── */
  copySelection: () => void;
  pasteClipboard: () => void;
  cutSelection: () => void;

  /* ─── Undo/Redo ─── */
  snapshot: () => void;
  undo: () => void;
  redo: () => void;

  /* ─── Meta / settings ─── */
  setTheme: (theme: ThemeKey) => void;
  setTransition: (t: TransitionType) => void;
  setTitle: (title: string) => void;
  setZoom: (z: number) => void;
  toggleGrid: () => void;
  toggleRuler: () => void;
  setToolMode: (m: ToolMode) => void;
  setDrawColor: (c: string) => void;
  setDrawStrokeWidth: (w: number) => void;
  enterPresent: () => void;
  exitPresent: () => void;
  setFindReplace: (open: boolean) => void;
  setFormatPainterStyle: (s: Record<string, unknown> | null) => void;

  /* ─── New actions ─── */
  duplicateElement: () => void;
  alignElements: (dir: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeElements: (axis: 'h' | 'v') => void;
  nudgeSelection: (dx: number, dy: number) => void;
  presentFromSlide: number | null;
  setPresentFromSlide: (idx: number | null) => void;
  showPresenterView: boolean;
  setPresenterView: (v: boolean) => void;
  showSlideSorter: boolean;
  setSlideSorter: (v: boolean) => void;
  showShortcutsHelp: boolean;
  setShortcutsHelp: (v: boolean) => void;
  showTemplateGallery: boolean;
  setTemplateGallery: (v: boolean) => void;
  rightPanelTab: 'properties' | 'ai' | 'layers';
  setRightPanelTab: (t: 'properties' | 'ai' | 'layers') => void;

  /* ─── Load / import ─── */
  loadPresentation: (p: Presentation) => void;

  /* ─── bulk update slides (e.g. from AI) ─── */
  setSlides: (slides: Slide[]) => void;

  /* ─── Lock/Group ─── */
  toggleLock: (ids?: string[]) => void;
  groupElements: (ids?: string[]) => void;
  ungroupElements: () => void;
  showGradient: boolean;
  setShowGradient: (v: boolean) => void;
  showComments: boolean;
  setShowComments: (v: boolean) => void;

  /* ─── Flip / Aspect Lock ─── */
  flipElements: (axis: 'h' | 'v') => void;
  toggleAspectLock: () => void;

  /* ─── Animation trigger ─── */
  setAnimTrigger: (trigger: 'auto' | 'click' | 'withPrevious') => void;

  /* ─── Custom color palette per presentation ─── */
  customPalette: string[];
  setCustomPalette: (colors: string[]) => void;

  /* ─── Brand Kit ─── */
  brandKit: { colors: string[]; fonts: string[]; logo: string };
  setBrandKit: (kit: { colors: string[]; fonts: string[]; logo: string }) => void;

  /* ─── Master slides ─── */
  masterSlides: Record<string, Partial<import('@/types/slide').Slide>>;
  setMasterSlide: (name: string, slide: Partial<import('@/types/slide').Slide>) => void;
  applyMasterSlide: (name: string) => void;

  /* ─── Autosave ─── */
  lastSaved: string | null;
  setLastSaved: (t: string) => void;

  /* ═══════════════════════════════════════════════════════
     NEW FEATURES — 200+ additions below
     ═══════════════════════════════════════════════════════ */

  /* ─── Editor Settings ─── */
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  snapToGuides: boolean;
  toggleSnapToGuides: () => void;
  smartGuides: boolean;
  toggleSmartGuides: () => void;
  customGuides: { axis: 'h' | 'v'; position: number }[];
  addGuide: (guide: { axis: 'h' | 'v'; position: number }) => void;
  removeGuide: (index: number) => void;
  clearGuides: () => void;
  canvasBg: string;
  setCanvasBg: (c: string) => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
  darkCanvas: boolean;
  toggleDarkCanvas: () => void;
  spellCheck: boolean;
  toggleSpellCheck: () => void;
  autoSaveInterval: number;
  setAutoSaveInterval: (ms: number) => void;
  showMinimap: boolean;
  toggleMinimap: () => void;
  showSnapIndicators: boolean;
  toggleSnapIndicators: () => void;
  gridSize: number;
  setGridSize: (s: number) => void;
  gridColor: string;
  setGridColor: (c: string) => void;
  rulerUnit: 'px' | 'in' | 'cm';
  setRulerUnit: (u: 'px' | 'in' | 'cm') => void;
  cursorMode: string;
  setCursorMode: (m: string) => void;
  panOffset: { x: number; y: number };
  setPanOffset: (o: { x: number; y: number }) => void;
  canvasWidth: number;
  setCanvasWidth: (w: number) => void;
  canvasHeight: number;
  setCanvasHeight: (h: number) => void;
  recentColors: string[];
  addRecentColor: (c: string) => void;
  statusMessage: string;
  setStatusMessage: (m: string) => void;
  commandPaletteOpen: boolean;
  setCommandPalette: (open: boolean) => void;

  /* ─── View & Display ─── */
  showElementBounds: boolean;
  toggleElementBounds: () => void;
  showSafeArea: boolean;
  toggleSafeArea: () => void;
  outlineMode: boolean;
  toggleOutlineMode: () => void;
  showPixelGrid: boolean;
  togglePixelGrid: () => void;
  highlightOverflow: boolean;
  toggleHighlightOverflow: () => void;
  showBaseline: boolean;
  toggleBaseline: () => void;
  previewMode: boolean;
  togglePreviewMode: () => void;
  splitView: boolean;
  toggleSplitView: () => void;
  showVersionHistory: boolean;
  toggleVersionHistory: () => void;
  showActivityLog: boolean;
  toggleActivityLog: () => void;
  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;
  rightPanelWidth: number;
  setRightPanelWidth: (w: number) => void;
  compactMode: boolean;
  toggleCompactMode: () => void;
  showTooltips: boolean;
  toggleTooltips: () => void;

  /* ─── Collaboration ─── */
  collaborators: { id: string; name: string; color: string; cursor?: { x: number; y: number } }[];
  setCollaborators: (c: { id: string; name: string; color: string; cursor?: { x: number; y: number } }[]) => void;
  activeUsers: string[];
  setActiveUsers: (u: string[]) => void;
  comments: { id: string; slideId: string; elementId?: string; text: string; author: string; timestamp: string; resolved: boolean; replies: { text: string; author: string; timestamp: string }[] }[];
  addComment: (comment: { id: string; slideId: string; elementId?: string; text: string; author: string; timestamp: string; resolved: boolean; replies: { text: string; author: string; timestamp: string }[] }) => void;
  resolveComment: (id: string) => void;
  deleteComment: (id: string) => void;
  shareLink: string;
  setShareLink: (link: string) => void;
  sharePermission: 'view' | 'comment' | 'edit';
  setSharePermission: (p: 'view' | 'comment' | 'edit') => void;
  isShared: boolean;
  setIsShared: (v: boolean) => void;
  changeTracking: boolean;
  toggleChangeTracking: () => void;
  reviewMode: boolean;
  toggleReviewMode: () => void;
  selectedComment: string | null;
  setSelectedComment: (id: string | null) => void;
  showCollaboratorCursors: boolean;
  toggleCollaboratorCursors: () => void;
  notifications: { id: string; type: string; message: string; timestamp: string; read: boolean }[];
  addNotification: (n: { id: string; type: string; message: string; timestamp: string; read: boolean }) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  chatMessages: { id: string; author: string; text: string; timestamp: string }[];
  addChatMessage: (m: { id: string; author: string; text: string; timestamp: string }) => void;

  /* ─── Animation & Transition ─── */
  animationTimeline: { elementId: string; startTime: number; duration: number; animation: string }[];
  setAnimationTimeline: (t: { elementId: string; startTime: number; duration: number; animation: string }[]) => void;
  animationPreview: boolean;
  toggleAnimationPreview: () => void;
  defaultAnimDuration: number;
  setDefaultAnimDuration: (d: number) => void;
  defaultAnimEasing: string;
  setDefaultAnimEasing: (e: string) => void;
  defaultAnimDelay: number;
  setDefaultAnimDelay: (d: number) => void;
  morphTransition: boolean;
  toggleMorphTransition: () => void;
  parallaxEnabled: boolean;
  toggleParallax: () => void;
  customEasings: { name: string; value: string }[];
  addCustomEasing: (e: { name: string; value: string }) => void;
  removeCustomEasing: (name: string) => void;
  animationLoop: boolean;
  toggleAnimationLoop: () => void;
  motionPaths: Record<string, { x: number; y: number }[]>;
  setMotionPath: (elementId: string, path: { x: number; y: number }[]) => void;
  clearMotionPath: (elementId: string) => void;
  transitionDuration: number;
  setTransitionDuration: (d: number) => void;
  slideTimings: Record<string, number>;
  setSlideTimingForSlide: (slideId: string, timing: number) => void;
  autoAdvance: boolean;
  toggleAutoAdvance: () => void;

  /* ─── Export & Import ─── */
  exportFormat: 'pdf' | 'pptx' | 'html' | 'png' | 'jpg' | 'gif' | 'video' | 'markdown';
  setExportFormat: (f: 'pdf' | 'pptx' | 'html' | 'png' | 'jpg' | 'gif' | 'video' | 'markdown') => void;
  exportQuality: 'low' | 'medium' | 'high' | 'ultra';
  setExportQuality: (q: 'low' | 'medium' | 'high' | 'ultra') => void;
  exportSlideRange: { start: number; end: number } | null;
  setExportSlideRange: (r: { start: number; end: number } | null) => void;
  exportIncludeNotes: boolean;
  toggleExportNotes: () => void;
  exportIncludeAnimations: boolean;
  toggleExportAnimations: () => void;
  exportBackground: boolean;
  toggleExportBackground: () => void;
  isExporting: boolean;
  setIsExporting: (v: boolean) => void;
  exportProgress: number;
  setExportProgress: (p: number) => void;
  importSource: string | null;
  setImportSource: (s: string | null) => void;
  showExportDialog: boolean;
  setShowExportDialog: (v: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (v: boolean) => void;
  lastExportPath: string | null;
  setLastExportPath: (p: string | null) => void;
  watermark: { text: string; opacity: number; position: 'center' | 'bottomRight' | 'topLeft' } | null;
  setWatermark: (w: { text: string; opacity: number; position: 'center' | 'bottomRight' | 'topLeft' } | null) => void;

  /* ─── AI Features ─── */
  aiEnabled: boolean;
  toggleAI: () => void;
  aiModel: string;
  setAIModel: (m: string) => void;
  aiTemperature: number;
  setAITemperature: (t: number) => void;
  aiHistory: { role: 'user' | 'assistant'; content: string }[];
  addAIMessage: (m: { role: 'user' | 'assistant'; content: string }) => void;
  clearAIHistory: () => void;
  aiSuggestions: string[];
  setAISuggestions: (s: string[]) => void;
  aiAutoComplete: boolean;
  toggleAIAutoComplete: () => void;
  aiDesignSuggestions: boolean;
  toggleAIDesignSuggestions: () => void;
  aiAccessibilityCheck: boolean;
  toggleAIAccessibilityCheck: () => void;
  aiGenerating: boolean;
  setAIGenerating: (v: boolean) => void;
  aiError: string | null;
  setAIError: (e: string | null) => void;
  aiLanguage: string;
  setAILanguage: (l: string) => void;
  aiToneOfVoice: string;
  setAIToneOfVoice: (t: string) => void;
  showAIPanel: boolean;
  toggleAIPanel: () => void;
  aiQuickActions: string[];

  /* ─── Accessibility ─── */
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  setFontSize: (s: 'sm' | 'md' | 'lg' | 'xl') => void;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  setColorBlindMode: (m: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void;
  screenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
  keyboardShortcutsEnabled: boolean;
  toggleKeyboardShortcuts: () => void;
  focusRingVisible: boolean;
  toggleFocusRing: () => void;
  tabOrder: Record<string, number>;
  setTabOrder: (o: Record<string, number>) => void;
  altTextEnforcement: boolean;
  toggleAltTextEnforcement: () => void;
  readingOrder: string[];
  setReadingOrder: (o: string[]) => void;

  /* ─── Presentation Mode ─── */
  presentationTimer: number;
  setPresentationTimer: (t: number) => void;
  presentationTimerRunning: boolean;
  togglePresentationTimer: () => void;
  laserPointer: boolean;
  toggleLaserPointer: () => void;
  laserColor: string;
  setLaserColor: (c: string) => void;
  drawOverlay: boolean;
  toggleDrawOverlay: () => void;
  drawOverlayColor: string;
  setDrawOverlayColor: (c: string) => void;
  blackScreen: boolean;
  toggleBlackScreen: () => void;
  whiteScreen: boolean;
  toggleWhiteScreen: () => void;
  presentCursor: 'default' | 'pointer' | 'none' | 'crosshair';
  setPresentCursor: (c: 'default' | 'pointer' | 'none' | 'crosshair') => void;
  presentNotes: boolean;
  togglePresentNotes: () => void;
  audienceViewUrl: string;
  setAudienceViewUrl: (u: string) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  liveCaptions: boolean;
  toggleLiveCaptions: () => void;
  slideJumpTarget: number | null;
  setSlideJumpTarget: (t: number | null) => void;
  qaSessions: { question: string; votes: number; answered: boolean }[];
  addQAQuestion: (q: { question: string; votes: number; answered: boolean }) => void;
  answerQAQuestion: (index: number) => void;
  presentationPassword: string;
  setPresentationPassword: (p: string) => void;
  loopPresentation: boolean;
  toggleLoopPresentation: () => void;
  hideSlideCount: boolean;
  toggleHideSlideCount: () => void;
  pointerHighlight: boolean;
  togglePointerHighlight: () => void;
  presenterDisplay: 'notes' | 'preview' | 'timer' | 'qa';
  setPresenterDisplay: (d: 'notes' | 'preview' | 'timer' | 'qa') => void;

  /* ─── Theme & Styling ─── */
  customThemes: Record<string, { bg: string; text: string; accent: string; heading: string }>;
  addCustomTheme: (name: string, theme: { bg: string; text: string; accent: string; heading: string }) => void;
  removeCustomTheme: (name: string) => void;
  activeStylePreset: string | null;
  setActiveStylePreset: (p: string | null) => void;
  globalFontFamily: string;
  setGlobalFontFamily: (f: string) => void;
  globalFontSize: number;
  setGlobalFontSize: (s: number) => void;
  headingFont: string;
  setHeadingFont: (f: string) => void;
  bodyFont: string;
  setBodyFont: (f: string) => void;
  colorScheme: string[];
  setColorScheme: (c: string[]) => void;
  gradientPresets: { name: string; value: string }[];
  addGradientPreset: (p: { name: string; value: string }) => void;
  removeGradientPreset: (name: string) => void;
  shadowPresets: { name: string; value: string }[];
  addShadowPreset: (p: { name: string; value: string }) => void;
  removeShadowPreset: (name: string) => void;
  borderPresets: { name: string; value: string }[];
  addBorderPreset: (p: { name: string; value: string }) => void;
  removeBorderPreset: (name: string) => void;
  backgroundPatterns: string[];
  setBackgroundPatterns: (p: string[]) => void;
  slideNumberFormat: 'number' | 'fraction' | 'roman' | 'none';
  setSlideNumberFormat: (f: 'number' | 'fraction' | 'roman' | 'none') => void;
  headerFooter: { header: string; footer: string; showDate: boolean; showPageNumber: boolean };
  setHeaderFooter: (hf: { header: string; footer: string; showDate: boolean; showPageNumber: boolean }) => void;

  /* ─── Selection & Transform ─── */
  selectionBox: { x: number; y: number; width: number; height: number } | null;
  setSelectionBox: (b: { x: number; y: number; width: number; height: number } | null) => void;
  transformOrigin: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  setTransformOrigin: (o: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => void;
  constrainProportions: boolean;
  toggleConstrainProportions: () => void;
  rotationSnap: number;
  setRotationSnap: (d: number) => void;
  moveSnap: number;
  setMoveSnap: (s: number) => void;
  resizeSnap: number;
  setResizeSnap: (s: number) => void;
  dragThreshold: number;
  setDragThreshold: (t: number) => void;
  multiSelectMode: 'click' | 'rubber' | 'lasso';
  setMultiSelectMode: (m: 'click' | 'rubber' | 'lasso') => void;
  selectedSlideIds: string[];
  setSelectedSlideIds: (ids: string[]) => void;

  /* ─── Content & Data ─── */
  symbolPicker: boolean;
  toggleSymbolPicker: () => void;
  emojiPicker: boolean;
  toggleEmojiPicker: () => void;
  linkEditor: { elementId: string; url: string; target: '_blank' | '_self' } | null;
  setLinkEditor: (l: { elementId: string; url: string; target: '_blank' | '_self' } | null) => void;
  mediaLibrary: boolean;
  toggleMediaLibrary: () => void;
  stockPhotos: boolean;
  toggleStockPhotos: () => void;
  tableEditor: { elementId: string; selectedCell: { row: number; col: number } } | null;
  setTableEditor: (t: { elementId: string; selectedCell: { row: number; col: number } } | null) => void;
  chartEditor: { elementId: string } | null;
  setChartEditor: (c: { elementId: string } | null) => void;
  codeEditor: { elementId: string } | null;
  setCodeEditor: (c: { elementId: string } | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: { slideIndex: number; elementId: string; match: string }[];
  setSearchResults: (r: { slideIndex: number; elementId: string; match: string }[]) => void;
  replaceQuery: string;
  setReplaceQuery: (q: string) => void;
  findAndReplaceAll: () => void;
  recentFiles: { name: string; path: string; timestamp: string }[];
  addRecentFile: (f: { name: string; path: string; timestamp: string }) => void;
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  unsavedChanges: boolean;
  setUnsavedChanges: (v: boolean) => void;

  /* ─── Layout & Arrangement ─── */
  showLayoutGuides: boolean;
  toggleLayoutGuides: () => void;
  snapDistance: number;
  setSnapDistance: (d: number) => void;
  pageMargins: { top: number; right: number; bottom: number; left: number };
  setPageMargins: (m: { top: number; right: number; bottom: number; left: number }) => void;
  contentPadding: number;
  setContentPadding: (p: number) => void;
  autoLayout: boolean;
  toggleAutoLayout: () => void;
  magneticSnap: boolean;
  toggleMagneticSnap: () => void;
  equalSpacing: boolean;
  toggleEqualSpacing: () => void;
  showDistanceIndicators: boolean;
  toggleDistanceIndicators: () => void;

  /* ─── Plugin & Extensions ─── */
  installedPlugins: { id: string; name: string; version: string; enabled: boolean }[];
  installPlugin: (p: { id: string; name: string; version: string; enabled: boolean }) => void;
  uninstallPlugin: (id: string) => void;
  togglePlugin: (id: string) => void;
  pluginPanelOpen: boolean;
  togglePluginPanel: () => void;
  customElementTypes: { type: string; renderer: string; icon: string }[];
  registerCustomElement: (e: { type: string; renderer: string; icon: string }) => void;
  webhooks: { id: string; url: string; events: string[] }[];
  addWebhook: (w: { id: string; url: string; events: string[] }) => void;
  removeWebhook: (id: string) => void;
  apiKey: string;
  setApiKey: (k: string) => void;
  integrations: { service: string; connected: boolean; token?: string }[];
  connectIntegration: (i: { service: string; connected: boolean; token?: string }) => void;
  disconnectIntegration: (service: string) => void;

  /* ─── Performance & Debug ─── */
  debugMode: boolean;
  toggleDebugMode: () => void;
  showFPS: boolean;
  toggleShowFPS: () => void;
  renderQuality: 'low' | 'medium' | 'high';
  setRenderQuality: (q: 'low' | 'medium' | 'high') => void;
  cacheEnabled: boolean;
  toggleCache: () => void;
  lazyLoadImages: boolean;
  toggleLazyLoadImages: () => void;
  maxUndoSteps: number;
  setMaxUndoSteps: (n: number) => void;
  performanceMetrics: { fps: number; memory: number; renderTime: number };
  setPerformanceMetrics: (m: { fps: number; memory: number; renderTime: number }) => void;
  errorLog: { message: string; timestamp: string; severity: 'info' | 'warn' | 'error' }[];
  addErrorLog: (e: { message: string; timestamp: string; severity: 'info' | 'warn' | 'error' }) => void;
  clearErrorLog: () => void;

  /* ─── UI Dialog Toggles ─── */
  showSettingsDialog: boolean;
  setShowSettingsDialog: (v: boolean) => void;
  showAnimationTimeline: boolean;
  setShowAnimationTimeline: (v: boolean) => void;
  showThemeEditor: boolean;
  setShowThemeEditor: (v: boolean) => void;
  showCodingLab: boolean;
  setShowCodingLab: (v: boolean) => void;
  showSimulationEngine: boolean;
  setShowSimulationEngine: (v: boolean) => void;
  showAccessibilityChecker: boolean;
  setShowAccessibilityChecker: (v: boolean) => void;
  showAnalyticsDashboard: boolean;
  setShowAnalyticsDashboard: (v: boolean) => void;
  showNotificationCenter: boolean;
  setShowNotificationCenter: (v: boolean) => void;
  showCollaborationPanel: boolean;
  setShowCollaborationPanel: (v: boolean) => void;
}

/* ═══════════════════════════════════════════════════════
   Store Implementation
   ═══════════════════════════════════════════════════════ */
export const useSlideStore = create<SlideStore>((set, get) => ({
  presentation: defaultPresentation(),
  currentSlideIndex: 0,
  selectedElementIds: [],
  clipboard: [],
  toolMode: 'select',
  drawColor: '#6366f1',
  drawStrokeWidth: 2,
  zoom: 1,
  showGrid: false,
  showRuler: false,
  isPresentMode: false,
  formatPainterStyle: null,
  findReplaceOpen: false,
  presentFromSlide: null,
  showPresenterView: false,
  showSlideSorter: false,
  showShortcutsHelp: false,
  showTemplateGallery: false,
  rightPanelTab: 'properties' as const,
  undoStack: [],
  redoStack: [],

  /* ─── Derived ─── */
  currentSlide: () => {
    const s = get();
    return s.presentation.slides[s.currentSlideIndex] ?? defaultSlide();
  },
  selectedElements: () => {
    const s = get();
    const slide = s.presentation.slides[s.currentSlideIndex];
    if (!slide) return [];
    return slide.elements.filter(e => s.selectedElementIds.includes(e.id));
  },

  /* ─── SLIDES ─── */
  addSlide: (partial) => {
    get().snapshot();
    set(s => {
      const slides = [...s.presentation.slides];
      const order = slides.length;
      const newSlide: Slide = { ...defaultSlide(order), ...partial, id: partial?.id ?? slideUid(), order };
      slides.push(newSlide);
      return {
        presentation: { ...s.presentation, slides },
        currentSlideIndex: slides.length - 1,
        selectedElementIds: [],
      };
    });
  },

  duplicateSlide: (idx) => {
    get().snapshot();
    set(s => {
      const i = idx ?? s.currentSlideIndex;
      const slides = [...s.presentation.slides];
      const dup: Slide = JSON.parse(JSON.stringify(slides[i]));
      dup.id = slideUid();
      dup.elements = dup.elements.map(e => ({ ...e, id: `${e.id}_dup_${Math.random().toString(36).slice(2, 6)}` }));
      dup.order = i + 1;
      slides.splice(i + 1, 0, dup);
      for (let j = i + 2; j < slides.length; j++) slides[j].order = j;
      return {
        presentation: { ...s.presentation, slides },
        currentSlideIndex: i + 1,
        selectedElementIds: [],
      };
    });
  },

  removeSlide: (idx) => {
    get().snapshot();
    set(s => {
      if (s.presentation.slides.length <= 1) return s;
      const i = idx ?? s.currentSlideIndex;
      const slides = s.presentation.slides.filter((_, j) => j !== i);
      slides.forEach((sl, j) => (sl.order = j));
      return {
        presentation: { ...s.presentation, slides },
        currentSlideIndex: Math.min(i, slides.length - 1),
        selectedElementIds: [],
      };
    });
  },

  moveSlide: (from, to) => {
    get().snapshot();
    set(s => {
      const slides = [...s.presentation.slides];
      const [moved] = slides.splice(from, 1);
      slides.splice(to, 0, moved);
      slides.forEach((sl, j) => (sl.order = j));
      return {
        presentation: { ...s.presentation, slides },
        currentSlideIndex: to,
      };
    });
  },

  goToSlide: (idx) => {
    set(s => ({
      currentSlideIndex: Math.max(0, Math.min(idx, s.presentation.slides.length - 1)),
      selectedElementIds: [],
    }));
  },

  updateSlideField: (key, value) => {
    set(s => {
      const slides = [...s.presentation.slides];
      slides[s.currentSlideIndex] = { ...slides[s.currentSlideIndex], [key]: value };
      return { presentation: { ...s.presentation, slides } };
    });
  },

  setSlideBackground: (bg) => {
    get().snapshot();
    set(s => {
      const slides = [...s.presentation.slides];
      slides[s.currentSlideIndex] = { ...slides[s.currentSlideIndex], background: bg };
      return { presentation: { ...s.presentation, slides } };
    });
  },

  /* ─── ELEMENTS ─── */
  addElement: (el) => {
    get().snapshot();
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      slide.elements = [...slide.elements, el];
      slides[s.currentSlideIndex] = slide;
      return {
        presentation: { ...s.presentation, slides },
        selectedElementIds: [el.id],
      };
    });
  },

  updateElement: (id, patch) => {
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      slide.elements = slide.elements.map(e => (e.id === id ? { ...e, ...patch } : e));
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides } };
    });
  },

  removeElements: (ids) => {
    get().snapshot();
    set(s => {
      const removeIds = ids ?? s.selectedElementIds;
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      slide.elements = slide.elements.filter(e => !removeIds.includes(e.id));
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides }, selectedElementIds: [] };
    });
  },

  bringForward: (id) => {
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      const els = [...slide.elements];
      const idx = els.findIndex(e => e.id === id);
      if (idx < els.length - 1) [els[idx], els[idx + 1]] = [els[idx + 1], els[idx]];
      slide.elements = els;
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides } };
    });
  },

  sendBackward: (id) => {
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      const els = [...slide.elements];
      const idx = els.findIndex(e => e.id === id);
      if (idx > 0) [els[idx], els[idx - 1]] = [els[idx - 1], els[idx]];
      slide.elements = els;
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides } };
    });
  },

  bringToFront: (id) => {
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      const els = [...slide.elements];
      const idx = els.findIndex(e => e.id === id);
      if (idx >= 0) { const [el] = els.splice(idx, 1); els.push(el); }
      slide.elements = els;
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides } };
    });
  },

  sendToBack: (id) => {
    set(s => {
      const slides = [...s.presentation.slides];
      const slide = { ...slides[s.currentSlideIndex] };
      const els = [...slide.elements];
      const idx = els.findIndex(e => e.id === id);
      if (idx >= 0) { const [el] = els.splice(idx, 1); els.unshift(el); }
      slide.elements = els;
      slides[s.currentSlideIndex] = slide;
      return { presentation: { ...s.presentation, slides } };
    });
  },

  /* ─── SELECTION ─── */
  selectElement: (id, multi) => {
    set(s => {
      if (!id) return { selectedElementIds: [] };
      if (multi) {
        const current = s.selectedElementIds;
        return { selectedElementIds: current.includes(id) ? current.filter(i => i !== id) : [...current, id] };
      }
      return { selectedElementIds: [id] };
    });
  },
  selectAll: () => {
    set(s => ({
      selectedElementIds: s.presentation.slides[s.currentSlideIndex]?.elements.map(e => e.id) ?? [],
    }));
  },
  clearSelection: () => set({ selectedElementIds: [] }),

  /* ─── CLIPBOARD ─── */
  copySelection: () => {
    const s = get();
    const slide = s.presentation.slides[s.currentSlideIndex];
    if (!slide) return;
    const copied = slide.elements.filter(e => s.selectedElementIds.includes(e.id));
    set({ clipboard: JSON.parse(JSON.stringify(copied)) });
  },

  pasteClipboard: () => {
    const s = get();
    if (s.clipboard.length === 0) return;
    s.snapshot();
    const newEls: SlideElement[] = s.clipboard.map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: `${el.id}_paste_${Math.random().toString(36).slice(2, 6)}`,
      x: el.x + 20,
      y: el.y + 20,
    }));
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = [...slide.elements, ...newEls];
      slides[state.currentSlideIndex] = slide;
      return {
        presentation: { ...state.presentation, slides },
        selectedElementIds: newEls.map(e => e.id),
      };
    });
  },

  cutSelection: () => {
    get().copySelection();
    get().removeElements();
  },

  /* ─── UNDO / REDO ─── */
  snapshot: () => {
    set(s => ({
      undoStack: [
        ...s.undoStack.slice(-49),
        { slides: JSON.parse(JSON.stringify(s.presentation.slides)), currentSlide: s.currentSlideIndex },
      ],
      redoStack: [],
    }));
  },

  undo: () => {
    set(s => {
      if (s.undoStack.length === 0) return s;
      const stack = [...s.undoStack];
      const snap = stack.pop()!;
      return {
        undoStack: stack,
        redoStack: [
          ...s.redoStack,
          { slides: JSON.parse(JSON.stringify(s.presentation.slides)), currentSlide: s.currentSlideIndex },
        ],
        presentation: { ...s.presentation, slides: snap.slides },
        currentSlideIndex: snap.currentSlide,
        selectedElementIds: [],
      };
    });
  },

  redo: () => {
    set(s => {
      if (s.redoStack.length === 0) return s;
      const stack = [...s.redoStack];
      const snap = stack.pop()!;
      return {
        redoStack: stack,
        undoStack: [
          ...s.undoStack,
          { slides: JSON.parse(JSON.stringify(s.presentation.slides)), currentSlide: s.currentSlideIndex },
        ],
        presentation: { ...s.presentation, slides: snap.slides },
        currentSlideIndex: snap.currentSlide,
        selectedElementIds: [],
      };
    });
  },

  /* ─── META / SETTINGS ─── */
  setTheme: (theme) => set(s => ({
    presentation: { ...s.presentation, meta: { ...s.presentation.meta, theme } },
  })),
  setTransition: (t) => set(s => ({
    presentation: { ...s.presentation, settings: { ...s.presentation.settings, transition: t } },
  })),
  setTitle: (title) => set(s => ({
    presentation: { ...s.presentation, meta: { ...s.presentation.meta, title } },
  })),
  setZoom: (z) => set({ zoom: z }),
  toggleGrid: () => set(s => ({ showGrid: !s.showGrid })),
  toggleRuler: () => set(s => ({ showRuler: !s.showRuler })),
  setToolMode: (m) => set({ toolMode: m }),
  setDrawColor: (c) => set({ drawColor: c }),
  setDrawStrokeWidth: (w) => set({ drawStrokeWidth: w }),
  enterPresent: () => set({ isPresentMode: true }),
  exitPresent: () => set({ isPresentMode: false }),
  setFindReplace: (open) => set({ findReplaceOpen: open }),
  setFormatPainterStyle: (s) => set({ formatPainterStyle: s }),

  /* ─── New actions ─── */
  setPresentFromSlide: (idx) => set({ presentFromSlide: idx }),
  setPresenterView: (v) => set({ showPresenterView: v }),
  setSlideSorter: (v) => set({ showSlideSorter: v }),
  setShortcutsHelp: (v) => set({ showShortcutsHelp: v }),
  setTemplateGallery: (v) => set({ showTemplateGallery: v }),
  setRightPanelTab: (t) => set({ rightPanelTab: t }),

  duplicateElement: () => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      const newEls: SlideElement[] = [];
      slide.elements.forEach(el => {
        if (state.selectedElementIds.includes(el.id)) {
          const dup: SlideElement = {
            ...JSON.parse(JSON.stringify(el)),
            id: `${el.id}_dup_${Math.random().toString(36).slice(2, 6)}`,
            x: el.x + 20,
            y: el.y + 20,
          };
          newEls.push(dup);
        }
      });
      slide.elements = [...slide.elements, ...newEls];
      slides[state.currentSlideIndex] = slide;
      return {
        presentation: { ...state.presentation, slides },
        selectedElementIds: newEls.map(e => e.id),
      };
    });
  },

  alignElements: (dir) => {
    const s = get();
    if (s.selectedElementIds.length < 2) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      const selected = slide.elements.filter(e => state.selectedElementIds.includes(e.id));
      let target: number;
      switch (dir) {
        case 'left': target = Math.min(...selected.map(e => e.x)); break;
        case 'right': target = Math.max(...selected.map(e => e.x + e.width)); break;
        case 'center': { const xs = selected.map(e => e.x + e.width / 2); target = (Math.min(...xs) + Math.max(...xs)) / 2; break; }
        case 'top': target = Math.min(...selected.map(e => e.y)); break;
        case 'bottom': target = Math.max(...selected.map(e => e.y + e.height)); break;
        case 'middle': { const ys = selected.map(e => e.y + e.height / 2); target = (Math.min(...ys) + Math.max(...ys)) / 2; break; }
      }
      slide.elements = slide.elements.map(e => {
        if (!state.selectedElementIds.includes(e.id)) return e;
        switch (dir) {
          case 'left': return { ...e, x: target };
          case 'right': return { ...e, x: target - e.width };
          case 'center': return { ...e, x: target - e.width / 2 };
          case 'top': return { ...e, y: target };
          case 'bottom': return { ...e, y: target - e.height };
          case 'middle': return { ...e, y: target - e.height / 2 };
        }
        return e;
      });
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  distributeElements: (axis) => {
    const s = get();
    if (s.selectedElementIds.length < 3) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      const ids = state.selectedElementIds;
      const selected = slide.elements.filter(e => ids.includes(e.id))
        .sort((a, b) => axis === 'h' ? a.x - b.x : a.y - b.y);
      const n = selected.length;
      if (axis === 'h') {
        const min = selected[0].x;
        const max = selected[n - 1].x + selected[n - 1].width;
        const totalW = selected.reduce((s, e) => s + e.width, 0);
        const gap = (max - min - totalW) / (n - 1);
        let x = min;
        const positions = new Map<string, number>();
        selected.forEach(e => { positions.set(e.id, x); x += e.width + gap; });
        slide.elements = slide.elements.map(e => positions.has(e.id) ? { ...e, x: positions.get(e.id)! } : e);
      } else {
        const min = selected[0].y;
        const max = selected[n - 1].y + selected[n - 1].height;
        const totalH = selected.reduce((s, e) => s + e.height, 0);
        const gap = (max - min - totalH) / (n - 1);
        let y = min;
        const positions = new Map<string, number>();
        selected.forEach(e => { positions.set(e.id, y); y += e.height + gap; });
        slide.elements = slide.elements.map(e => positions.has(e.id) ? { ...e, y: positions.get(e.id)! } : e);
      }
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  nudgeSelection: (dx, dy) => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e => {
        if (!state.selectedElementIds.includes(e.id) || e.locked) return e;
        return { ...e, x: e.x + dx, y: e.y + dy };
      });
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  /* ─── LOAD ─── */
  loadPresentation: (p) => set({
    presentation: p,
    currentSlideIndex: 0,
    selectedElementIds: [],
    undoStack: [],
    redoStack: [],
  }),

  setSlides: (slides) => {
    get().snapshot();
    set(s => ({
      presentation: { ...s.presentation, slides },
      currentSlideIndex: 0,
      selectedElementIds: [],
    }));
  },

  /* ─── Lock Toggle ─── */
  toggleLock: (ids) => {
    const s = get();
    const targets = ids || s.selectedElementIds;
    if (targets.length === 0) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e =>
        targets.includes(e.id) ? { ...e, locked: !e.locked } : e
      );
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  /* ─── Group / Ungroup ─── */
  groupElements: (ids) => {
    const s = get();
    const targets = ids || s.selectedElementIds;
    if (targets.length < 2) return;
    const groupId = 'g_' + Date.now().toString(36);
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e =>
        targets.includes(e.id) ? { ...e, groupId } : e
      );
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  ungroupElements: () => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    // Find groupIds of selected elements and clear them
    const slide = s.presentation.slides[s.currentSlideIndex];
    const groupIds = new Set(
      slide.elements.filter(e => s.selectedElementIds.includes(e.id) && e.groupId).map(e => e.groupId!)
    );
    if (groupIds.size === 0) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const sl = { ...slides[state.currentSlideIndex] };
      sl.elements = sl.elements.map(e =>
        e.groupId && groupIds.has(e.groupId) ? { ...e, groupId: undefined } : e
      );
      slides[state.currentSlideIndex] = sl;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  showGradient: false,
  setShowGradient: (v) => set({ showGradient: v }),
  showComments: false,
  setShowComments: (v) => set({ showComments: v }),

  /* ─── Flip ─── */
  flipElements: (axis) => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e => {
        if (!state.selectedElementIds.includes(e.id)) return e;
        return axis === 'h' ? { ...e, flipH: !e.flipH } : { ...e, flipV: !e.flipV };
      });
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  toggleAspectLock: () => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e => {
        if (!state.selectedElementIds.includes(e.id)) return e;
        return { ...e, aspectLock: !e.aspectLock };
      });
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  setAnimTrigger: (trigger) => {
    const s = get();
    if (s.selectedElementIds.length === 0) return;
    set(state => {
      const slides = [...state.presentation.slides];
      const slide = { ...slides[state.currentSlideIndex] };
      slide.elements = slide.elements.map(e => {
        if (!state.selectedElementIds.includes(e.id)) return e;
        return { ...e, animTrigger: trigger };
      });
      slides[state.currentSlideIndex] = slide;
      return { presentation: { ...state.presentation, slides } };
    });
  },

  customPalette: ['#6366f1', '#00cec9', '#fdcb6e', '#e17055', '#00b894', '#0984e3'],
  setCustomPalette: (colors) => set({ customPalette: colors }),

  brandKit: { colors: ['#6366f1', '#1a1a2e', '#fff'], fonts: ['Inter', 'Fira Code'], logo: '' },
  setBrandKit: (kit) => set({ brandKit: kit }),

  masterSlides: {},
  setMasterSlide: (name, slide) => set(s => ({ masterSlides: { ...s.masterSlides, [name]: slide } })),
  applyMasterSlide: (name) => {
    const s = get();
    const master = s.masterSlides[name];
    if (!master) return;
    s.snapshot();
    set(state => {
      const slides = [...state.presentation.slides];
      const current = slides[state.currentSlideIndex];
      slides[state.currentSlideIndex] = {
        ...current,
        background: master.background || current.background,
        layout: master.layout || current.layout,
        elements: [...(master.elements || []).map(e => ({ ...e, id: e.id + '_m' + Math.random().toString(36).slice(2, 5) })), ...current.elements],
      };
      return { presentation: { ...state.presentation, slides } };
    });
  },

  lastSaved: null,
  setLastSaved: (t) => set({ lastSaved: t }),

  /* ═══════════════════════════════════════════════════════
     NEW FEATURES — 200+ additions below
     ═══════════════════════════════════════════════════════ */

  /* ─── Editor Settings ─── */
  snapToGrid: true,
  toggleSnapToGrid: () => set(s => ({ snapToGrid: !s.snapToGrid })),
  snapToGuides: true,
  toggleSnapToGuides: () => set(s => ({ snapToGuides: !s.snapToGuides })),
  smartGuides: true,
  toggleSmartGuides: () => set(s => ({ smartGuides: !s.smartGuides })),
  customGuides: [],
  addGuide: (guide) => set(s => ({ customGuides: [...s.customGuides, guide] })),
  removeGuide: (index) => set(s => ({ customGuides: s.customGuides.filter((_, i) => i !== index) })),
  clearGuides: () => set({ customGuides: [] }),
  canvasBg: '#f0f0f0',
  setCanvasBg: (c) => set({ canvasBg: c }),
  focusMode: false,
  toggleFocusMode: () => set(s => ({ focusMode: !s.focusMode })),
  darkCanvas: false,
  toggleDarkCanvas: () => set(s => ({ darkCanvas: !s.darkCanvas })),
  spellCheck: true,
  toggleSpellCheck: () => set(s => ({ spellCheck: !s.spellCheck })),
  autoSaveInterval: 30000,
  setAutoSaveInterval: (ms) => set({ autoSaveInterval: ms }),
  showMinimap: false,
  toggleMinimap: () => set(s => ({ showMinimap: !s.showMinimap })),
  showSnapIndicators: true,
  toggleSnapIndicators: () => set(s => ({ showSnapIndicators: !s.showSnapIndicators })),
  gridSize: 20,
  setGridSize: (sz) => set({ gridSize: sz }),
  gridColor: '#cccccc',
  setGridColor: (c) => set({ gridColor: c }),
  rulerUnit: 'px' as const,
  setRulerUnit: (u) => set({ rulerUnit: u }),
  cursorMode: 'default',
  setCursorMode: (m) => set({ cursorMode: m }),
  panOffset: { x: 0, y: 0 },
  setPanOffset: (o) => set({ panOffset: o }),
  canvasWidth: 1920,
  setCanvasWidth: (w) => set({ canvasWidth: w }),
  canvasHeight: 1080,
  setCanvasHeight: (h) => set({ canvasHeight: h }),
  recentColors: [],
  addRecentColor: (c) => set(s => ({
    recentColors: [c, ...s.recentColors.filter(rc => rc !== c)].slice(0, 20),
  })),
  statusMessage: '',
  setStatusMessage: (m) => set({ statusMessage: m }),
  commandPaletteOpen: false,
  setCommandPalette: (open) => set({ commandPaletteOpen: open }),

  /* ─── View & Display ─── */
  showElementBounds: false,
  toggleElementBounds: () => set(s => ({ showElementBounds: !s.showElementBounds })),
  showSafeArea: false,
  toggleSafeArea: () => set(s => ({ showSafeArea: !s.showSafeArea })),
  outlineMode: false,
  toggleOutlineMode: () => set(s => ({ outlineMode: !s.outlineMode })),
  showPixelGrid: false,
  togglePixelGrid: () => set(s => ({ showPixelGrid: !s.showPixelGrid })),
  highlightOverflow: false,
  toggleHighlightOverflow: () => set(s => ({ highlightOverflow: !s.highlightOverflow })),
  showBaseline: false,
  toggleBaseline: () => set(s => ({ showBaseline: !s.showBaseline })),
  previewMode: false,
  togglePreviewMode: () => set(s => ({ previewMode: !s.previewMode })),
  splitView: false,
  toggleSplitView: () => set(s => ({ splitView: !s.splitView })),
  showVersionHistory: false,
  toggleVersionHistory: () => set(s => ({ showVersionHistory: !s.showVersionHistory })),
  showActivityLog: false,
  toggleActivityLog: () => set(s => ({ showActivityLog: !s.showActivityLog })),
  sidebarWidth: 260,
  setSidebarWidth: (w) => set({ sidebarWidth: w }),
  rightPanelWidth: 300,
  setRightPanelWidth: (w) => set({ rightPanelWidth: w }),
  compactMode: false,
  toggleCompactMode: () => set(s => ({ compactMode: !s.compactMode })),
  showTooltips: true,
  toggleTooltips: () => set(s => ({ showTooltips: !s.showTooltips })),

  /* ─── Collaboration ─── */
  collaborators: [],
  setCollaborators: (c) => set({ collaborators: c }),
  activeUsers: [],
  setActiveUsers: (u) => set({ activeUsers: u }),
  comments: [],
  addComment: (comment) => set(s => ({ comments: [...s.comments, comment] })),
  resolveComment: (id) => set(s => ({
    comments: s.comments.map(c => c.id === id ? { ...c, resolved: true } : c),
  })),
  deleteComment: (id) => set(s => ({
    comments: s.comments.filter(c => c.id !== id),
  })),
  shareLink: '',
  setShareLink: (link) => set({ shareLink: link }),
  sharePermission: 'view' as const,
  setSharePermission: (p) => set({ sharePermission: p }),
  isShared: false,
  setIsShared: (v) => set({ isShared: v }),
  changeTracking: false,
  toggleChangeTracking: () => set(s => ({ changeTracking: !s.changeTracking })),
  reviewMode: false,
  toggleReviewMode: () => set(s => ({ reviewMode: !s.reviewMode })),
  selectedComment: null,
  setSelectedComment: (id) => set({ selectedComment: id }),
  showCollaboratorCursors: true,
  toggleCollaboratorCursors: () => set(s => ({ showCollaboratorCursors: !s.showCollaboratorCursors })),
  notifications: [],
  addNotification: (n) => set(s => ({ notifications: [...s.notifications, n] })),
  markNotificationRead: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  clearNotifications: () => set({ notifications: [] }),
  chatMessages: [],
  addChatMessage: (m) => set(s => ({ chatMessages: [...s.chatMessages, m] })),

  /* ─── Animation & Transition ─── */
  animationTimeline: [],
  setAnimationTimeline: (t) => set({ animationTimeline: t }),
  animationPreview: false,
  toggleAnimationPreview: () => set(s => ({ animationPreview: !s.animationPreview })),
  defaultAnimDuration: 500,
  setDefaultAnimDuration: (d) => set({ defaultAnimDuration: d }),
  defaultAnimEasing: 'ease',
  setDefaultAnimEasing: (e) => set({ defaultAnimEasing: e }),
  defaultAnimDelay: 0,
  setDefaultAnimDelay: (d) => set({ defaultAnimDelay: d }),
  morphTransition: false,
  toggleMorphTransition: () => set(s => ({ morphTransition: !s.morphTransition })),
  parallaxEnabled: false,
  toggleParallax: () => set(s => ({ parallaxEnabled: !s.parallaxEnabled })),
  customEasings: [],
  addCustomEasing: (e) => set(s => ({ customEasings: [...s.customEasings, e] })),
  removeCustomEasing: (name) => set(s => ({
    customEasings: s.customEasings.filter(e => e.name !== name),
  })),
  animationLoop: false,
  toggleAnimationLoop: () => set(s => ({ animationLoop: !s.animationLoop })),
  motionPaths: {},
  setMotionPath: (elementId, path) => set(s => ({
    motionPaths: { ...s.motionPaths, [elementId]: path },
  })),
  clearMotionPath: (elementId) => set(s => {
    const updated = { ...s.motionPaths };
    delete updated[elementId];
    return { motionPaths: updated };
  }),
  transitionDuration: 500,
  setTransitionDuration: (d) => set({ transitionDuration: d }),
  slideTimings: {},
  setSlideTimingForSlide: (slideId, timing) => set(s => ({
    slideTimings: { ...s.slideTimings, [slideId]: timing },
  })),
  autoAdvance: false,
  toggleAutoAdvance: () => set(s => ({ autoAdvance: !s.autoAdvance })),

  /* ─── Export & Import ─── */
  exportFormat: 'pdf' as const,
  setExportFormat: (f) => set({ exportFormat: f }),
  exportQuality: 'high' as const,
  setExportQuality: (q) => set({ exportQuality: q }),
  exportSlideRange: null,
  setExportSlideRange: (r) => set({ exportSlideRange: r }),
  exportIncludeNotes: true,
  toggleExportNotes: () => set(s => ({ exportIncludeNotes: !s.exportIncludeNotes })),
  exportIncludeAnimations: true,
  toggleExportAnimations: () => set(s => ({ exportIncludeAnimations: !s.exportIncludeAnimations })),
  exportBackground: true,
  toggleExportBackground: () => set(s => ({ exportBackground: !s.exportBackground })),
  isExporting: false,
  setIsExporting: (v) => set({ isExporting: v }),
  exportProgress: 0,
  setExportProgress: (p) => set({ exportProgress: p }),
  importSource: null,
  setImportSource: (src) => set({ importSource: src }),
  showExportDialog: false,
  setShowExportDialog: (v) => set({ showExportDialog: v }),
  showImportDialog: false,
  setShowImportDialog: (v) => set({ showImportDialog: v }),
  lastExportPath: null,
  setLastExportPath: (p) => set({ lastExportPath: p }),
  watermark: null,
  setWatermark: (w) => set({ watermark: w }),

  /* ─── AI Features ─── */
  aiEnabled: true,
  toggleAI: () => set(s => ({ aiEnabled: !s.aiEnabled })),
  aiModel: 'gpt-4',
  setAIModel: (m) => set({ aiModel: m }),
  aiTemperature: 0.7,
  setAITemperature: (t) => set({ aiTemperature: t }),
  aiHistory: [],
  addAIMessage: (m) => set(s => ({ aiHistory: [...s.aiHistory, m] })),
  clearAIHistory: () => set({ aiHistory: [] }),
  aiSuggestions: [],
  setAISuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
  aiAutoComplete: true,
  toggleAIAutoComplete: () => set(s => ({ aiAutoComplete: !s.aiAutoComplete })),
  aiDesignSuggestions: true,
  toggleAIDesignSuggestions: () => set(s => ({ aiDesignSuggestions: !s.aiDesignSuggestions })),
  aiAccessibilityCheck: false,
  toggleAIAccessibilityCheck: () => set(s => ({ aiAccessibilityCheck: !s.aiAccessibilityCheck })),
  aiGenerating: false,
  setAIGenerating: (v) => set({ aiGenerating: v }),
  aiError: null,
  setAIError: (e) => set({ aiError: e }),
  aiLanguage: 'en',
  setAILanguage: (l) => set({ aiLanguage: l }),
  aiToneOfVoice: 'professional',
  setAIToneOfVoice: (t) => set({ aiToneOfVoice: t }),
  showAIPanel: false,
  toggleAIPanel: () => set(s => ({ showAIPanel: !s.showAIPanel })),
  aiQuickActions: [
    'Summarize slide',
    'Improve text',
    'Generate speaker notes',
    'Suggest layout',
    'Fix grammar',
    'Translate content',
    'Add visual suggestions',
    'Create outline',
  ],

  /* ─── Accessibility ─── */
  highContrast: false,
  toggleHighContrast: () => set(s => ({ highContrast: !s.highContrast })),
  reducedMotion: false,
  toggleReducedMotion: () => set(s => ({ reducedMotion: !s.reducedMotion })),
  fontSize: 'md' as const,
  setFontSize: (sz) => set({ fontSize: sz }),
  colorBlindMode: 'none' as const,
  setColorBlindMode: (m) => set({ colorBlindMode: m }),
  screenReaderMode: false,
  toggleScreenReaderMode: () => set(s => ({ screenReaderMode: !s.screenReaderMode })),
  keyboardShortcutsEnabled: true,
  toggleKeyboardShortcuts: () => set(s => ({ keyboardShortcutsEnabled: !s.keyboardShortcutsEnabled })),
  focusRingVisible: true,
  toggleFocusRing: () => set(s => ({ focusRingVisible: !s.focusRingVisible })),
  tabOrder: {},
  setTabOrder: (o) => set({ tabOrder: o }),
  altTextEnforcement: false,
  toggleAltTextEnforcement: () => set(s => ({ altTextEnforcement: !s.altTextEnforcement })),
  readingOrder: [],
  setReadingOrder: (o) => set({ readingOrder: o }),

  /* ─── Presentation Mode ─── */
  presentationTimer: 0,
  setPresentationTimer: (t) => set({ presentationTimer: t }),
  presentationTimerRunning: false,
  togglePresentationTimer: () => set(s => ({ presentationTimerRunning: !s.presentationTimerRunning })),
  laserPointer: false,
  toggleLaserPointer: () => set(s => ({ laserPointer: !s.laserPointer })),
  laserColor: '#ff0000',
  setLaserColor: (c) => set({ laserColor: c }),
  drawOverlay: false,
  toggleDrawOverlay: () => set(s => ({ drawOverlay: !s.drawOverlay })),
  drawOverlayColor: '#ff0000',
  setDrawOverlayColor: (c) => set({ drawOverlayColor: c }),
  blackScreen: false,
  toggleBlackScreen: () => set(s => ({ blackScreen: !s.blackScreen })),
  whiteScreen: false,
  toggleWhiteScreen: () => set(s => ({ whiteScreen: !s.whiteScreen })),
  presentCursor: 'default' as const,
  setPresentCursor: (c) => set({ presentCursor: c }),
  presentNotes: true,
  togglePresentNotes: () => set(s => ({ presentNotes: !s.presentNotes })),
  audienceViewUrl: '',
  setAudienceViewUrl: (u) => set({ audienceViewUrl: u }),
  isRecording: false,
  toggleRecording: () => set(s => ({ isRecording: !s.isRecording })),
  liveCaptions: false,
  toggleLiveCaptions: () => set(s => ({ liveCaptions: !s.liveCaptions })),
  slideJumpTarget: null,
  setSlideJumpTarget: (t) => set({ slideJumpTarget: t }),
  qaSessions: [],
  addQAQuestion: (q) => set(s => ({ qaSessions: [...s.qaSessions, q] })),
  answerQAQuestion: (index) => set(s => ({
    qaSessions: s.qaSessions.map((q, i) => i === index ? { ...q, answered: true } : q),
  })),
  presentationPassword: '',
  setPresentationPassword: (p) => set({ presentationPassword: p }),
  loopPresentation: false,
  toggleLoopPresentation: () => set(s => ({ loopPresentation: !s.loopPresentation })),
  hideSlideCount: false,
  toggleHideSlideCount: () => set(s => ({ hideSlideCount: !s.hideSlideCount })),
  pointerHighlight: false,
  togglePointerHighlight: () => set(s => ({ pointerHighlight: !s.pointerHighlight })),
  presenterDisplay: 'notes' as const,
  setPresenterDisplay: (d) => set({ presenterDisplay: d }),

  /* ─── Theme & Styling ─── */
  customThemes: {},
  addCustomTheme: (name, theme) => set(s => ({
    customThemes: { ...s.customThemes, [name]: theme },
  })),
  removeCustomTheme: (name) => set(s => {
    const updated = { ...s.customThemes };
    delete updated[name];
    return { customThemes: updated };
  }),
  activeStylePreset: null,
  setActiveStylePreset: (p) => set({ activeStylePreset: p }),
  globalFontFamily: 'Inter',
  setGlobalFontFamily: (f) => set({ globalFontFamily: f }),
  globalFontSize: 16,
  setGlobalFontSize: (sz) => set({ globalFontSize: sz }),
  headingFont: 'Inter',
  setHeadingFont: (f) => set({ headingFont: f }),
  bodyFont: 'Inter',
  setBodyFont: (f) => set({ bodyFont: f }),
  colorScheme: ['#6366f1', '#4f46e5', '#00cec9', '#fdcb6e', '#e17055', '#00b894'],
  setColorScheme: (c) => set({ colorScheme: c }),
  gradientPresets: [],
  addGradientPreset: (p) => set(s => ({ gradientPresets: [...s.gradientPresets, p] })),
  removeGradientPreset: (name) => set(s => ({
    gradientPresets: s.gradientPresets.filter(p => p.name !== name),
  })),
  shadowPresets: [],
  addShadowPreset: (p) => set(s => ({ shadowPresets: [...s.shadowPresets, p] })),
  removeShadowPreset: (name) => set(s => ({
    shadowPresets: s.shadowPresets.filter(p => p.name !== name),
  })),
  borderPresets: [],
  addBorderPreset: (p) => set(s => ({ borderPresets: [...s.borderPresets, p] })),
  removeBorderPreset: (name) => set(s => ({
    borderPresets: s.borderPresets.filter(p => p.name !== name),
  })),
  backgroundPatterns: [],
  setBackgroundPatterns: (p) => set({ backgroundPatterns: p }),
  slideNumberFormat: 'number' as const,
  setSlideNumberFormat: (f) => set({ slideNumberFormat: f }),
  headerFooter: { header: '', footer: '', showDate: false, showPageNumber: true },
  setHeaderFooter: (hf) => set({ headerFooter: hf }),

  /* ─── Selection & Transform ─── */
  selectionBox: null,
  setSelectionBox: (b) => set({ selectionBox: b }),
  transformOrigin: 'center' as const,
  setTransformOrigin: (o) => set({ transformOrigin: o }),
  constrainProportions: false,
  toggleConstrainProportions: () => set(s => ({ constrainProportions: !s.constrainProportions })),
  rotationSnap: 15,
  setRotationSnap: (d) => set({ rotationSnap: d }),
  moveSnap: 1,
  setMoveSnap: (sn) => set({ moveSnap: sn }),
  resizeSnap: 1,
  setResizeSnap: (sn) => set({ resizeSnap: sn }),
  dragThreshold: 3,
  setDragThreshold: (t) => set({ dragThreshold: t }),
  multiSelectMode: 'click' as const,
  setMultiSelectMode: (m) => set({ multiSelectMode: m }),
  selectedSlideIds: [],
  setSelectedSlideIds: (ids) => set({ selectedSlideIds: ids }),

  /* ─── Content & Data ─── */
  symbolPicker: false,
  toggleSymbolPicker: () => set(s => ({ symbolPicker: !s.symbolPicker })),
  emojiPicker: false,
  toggleEmojiPicker: () => set(s => ({ emojiPicker: !s.emojiPicker })),
  linkEditor: null,
  setLinkEditor: (l) => set({ linkEditor: l }),
  mediaLibrary: false,
  toggleMediaLibrary: () => set(s => ({ mediaLibrary: !s.mediaLibrary })),
  stockPhotos: false,
  toggleStockPhotos: () => set(s => ({ stockPhotos: !s.stockPhotos })),
  tableEditor: null,
  setTableEditor: (t) => set({ tableEditor: t }),
  chartEditor: null,
  setChartEditor: (c) => set({ chartEditor: c }),
  codeEditor: null,
  setCodeEditor: (c) => set({ codeEditor: c }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  searchResults: [],
  setSearchResults: (r) => set({ searchResults: r }),
  replaceQuery: '',
  setReplaceQuery: (q) => set({ replaceQuery: q }),
  findAndReplaceAll: () => {
    const s = get();
    if (!s.searchQuery || !s.replaceQuery) return;
    s.snapshot();
    set(state => {
      const slides = state.presentation.slides.map(slide => ({
        ...slide,
        elements: slide.elements.map(el => {
          if (el.content && el.content.includes(state.searchQuery)) {
            return { ...el, content: el.content.replaceAll(state.searchQuery, state.replaceQuery) };
          }
          return el;
        }),
      }));
      return { presentation: { ...state.presentation, slides }, searchResults: [] };
    });
  },
  recentFiles: [],
  addRecentFile: (f) => set(s => ({
    recentFiles: [f, ...s.recentFiles.filter(rf => rf.path !== f.path)].slice(0, 10),
  })),
  autoSaveEnabled: true,
  toggleAutoSave: () => set(s => ({ autoSaveEnabled: !s.autoSaveEnabled })),
  unsavedChanges: false,
  setUnsavedChanges: (v) => set({ unsavedChanges: v }),

  /* ─── Layout & Arrangement ─── */
  showLayoutGuides: false,
  toggleLayoutGuides: () => set(s => ({ showLayoutGuides: !s.showLayoutGuides })),
  snapDistance: 8,
  setSnapDistance: (d) => set({ snapDistance: d }),
  pageMargins: { top: 40, right: 40, bottom: 40, left: 40 },
  setPageMargins: (m) => set({ pageMargins: m }),
  contentPadding: 16,
  setContentPadding: (p) => set({ contentPadding: p }),
  autoLayout: false,
  toggleAutoLayout: () => set(s => ({ autoLayout: !s.autoLayout })),
  magneticSnap: true,
  toggleMagneticSnap: () => set(s => ({ magneticSnap: !s.magneticSnap })),
  equalSpacing: false,
  toggleEqualSpacing: () => set(s => ({ equalSpacing: !s.equalSpacing })),
  showDistanceIndicators: false,
  toggleDistanceIndicators: () => set(s => ({ showDistanceIndicators: !s.showDistanceIndicators })),

  /* ─── Plugin & Extensions ─── */
  installedPlugins: [],
  installPlugin: (p) => set(s => ({ installedPlugins: [...s.installedPlugins, p] })),
  uninstallPlugin: (id) => set(s => ({
    installedPlugins: s.installedPlugins.filter(p => p.id !== id),
  })),
  togglePlugin: (id) => set(s => ({
    installedPlugins: s.installedPlugins.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p),
  })),
  pluginPanelOpen: false,
  togglePluginPanel: () => set(s => ({ pluginPanelOpen: !s.pluginPanelOpen })),
  customElementTypes: [],
  registerCustomElement: (e) => set(s => ({ customElementTypes: [...s.customElementTypes, e] })),
  webhooks: [],
  addWebhook: (w) => set(s => ({ webhooks: [...s.webhooks, w] })),
  removeWebhook: (id) => set(s => ({
    webhooks: s.webhooks.filter(w => w.id !== id),
  })),
  apiKey: '',
  setApiKey: (k) => set({ apiKey: k }),
  integrations: [],
  connectIntegration: (i) => set(s => ({
    integrations: [...s.integrations.filter(x => x.service !== i.service), i],
  })),
  disconnectIntegration: (service) => set(s => ({
    integrations: s.integrations.map(i => i.service === service ? { ...i, connected: false, token: undefined } : i),
  })),

  /* ─── Performance & Debug ─── */
  debugMode: false,
  toggleDebugMode: () => set(s => ({ debugMode: !s.debugMode })),
  showFPS: false,
  toggleShowFPS: () => set(s => ({ showFPS: !s.showFPS })),
  renderQuality: 'high' as const,
  setRenderQuality: (q) => set({ renderQuality: q }),
  cacheEnabled: true,
  toggleCache: () => set(s => ({ cacheEnabled: !s.cacheEnabled })),
  lazyLoadImages: true,
  toggleLazyLoadImages: () => set(s => ({ lazyLoadImages: !s.lazyLoadImages })),
  maxUndoSteps: 50,
  setMaxUndoSteps: (n) => set({ maxUndoSteps: n }),
  performanceMetrics: { fps: 60, memory: 0, renderTime: 0 },
  setPerformanceMetrics: (m) => set({ performanceMetrics: m }),
  errorLog: [],
  addErrorLog: (e) => set(s => ({ errorLog: [...s.errorLog, e] })),
  clearErrorLog: () => set({ errorLog: [] }),

  /* ─── UI Dialog Toggles ─── */
  showSettingsDialog: false,
  setShowSettingsDialog: (v) => set({ showSettingsDialog: v }),
  showAnimationTimeline: false,
  setShowAnimationTimeline: (v) => set({ showAnimationTimeline: v }),
  showThemeEditor: false,
  setShowThemeEditor: (v) => set({ showThemeEditor: v }),
  showCodingLab: false,
  setShowCodingLab: (v) => set({ showCodingLab: v }),
  showSimulationEngine: false,
  setShowSimulationEngine: (v) => set({ showSimulationEngine: v }),
  showAccessibilityChecker: false,
  setShowAccessibilityChecker: (v) => set({ showAccessibilityChecker: v }),
  showAnalyticsDashboard: false,
  setShowAnalyticsDashboard: (v) => set({ showAnalyticsDashboard: v }),
  showNotificationCenter: false,
  setShowNotificationCenter: (v) => set({ showNotificationCenter: v }),
  showCollaborationPanel: false,
  setShowCollaborationPanel: (v) => set({ showCollaborationPanel: v }),
}));
