/* ═══════════════════════════════════════════════════════
   EduSlide — Core Type Definitions
   ═══════════════════════════════════════════════════════ */

export interface Presentation {
  meta: PresentationMeta;
  slides: Slide[];
  settings: PresentationSettings;
}

export interface PresentationMeta {
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  theme: ThemeKey;
  aspectRatio: string;
}

export interface PresentationSettings {
  transition: TransitionType;
  transitionDuration: number;
  autoPlay: boolean;
  autoPlayInterval: number;
  showSlideNumbers: boolean;
  enableAI: boolean;
  enableInteractive: boolean;
}

export interface Slide {
  id: string;
  order: number;
  layout: string;
  masterSlide?: string;
  background: SlideBackground;
  elements: SlideElement[];
  notes: string;
  transition: string;
  animations: unknown[];
}

export interface SlideBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  value: string;
}

/* ── Element Types ───────────────────────────────── */
export type ElementType =
  | 'heading' | 'text' | 'list' | 'image' | 'shape' | 'code'
  | 'chart' | 'math' | 'quiz' | 'video' | 'embed' | 'note'
  | 'divider' | 'table' | 'connector' | 'poll' | 'flashcard'
  | 'timer' | 'audio' | 'callout' | 'progress' | 'icon'
  | 'mermaid' | 'timeline' | '3d' | 'wordcloud' | 'functionplot'
  | 'qrcode';

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: string;
  lineHeight?: string;
  textDecoration?: string;
  textShadow?: string;
  textOutline?: string;
  letterSpacing?: string;
  paragraphSpacing?: string;
  gradientText?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  background?: string;
  padding?: string;
  borderRadius?: string;
  headerBg?: string;
  headerColor?: string;
  cellBg?: string;
  cellColor?: string;
  borderColor?: string;
  frontBg?: string;
  frontColor?: string;
  backBg?: string;
  backColor?: string;
  barColor?: string;
  bgColor?: string;
  colors?: string[];
  // Filters
  brightness?: string;
  contrast?: string;
  saturate?: string;
  blurPx?: string;
  grayscale?: string;
  sepia?: string;
  hueRotate?: string;
  // Shadow / border
  boxShadow?: string;
  shadowX?: string;
  shadowY?: string;
  shadowBlur?: string;
  shadowColor?: string;
  border?: string;
  glow?: string;
  // Video
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  // Embed
  sandbox?: boolean;
  [key: string]: unknown;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  groupId?: string;
  animation: string | null;
  style: ElementStyle;
  // Content fields
  content?: string;
  level?: number;
  items?: string[];
  listType?: string;
  src?: string;
  alt?: string;
  objectFit?: string;
  shape?: string;
  language?: string;
  executable?: boolean;
  chartType?: string;
  data?: ChartData | string[][];
  question?: string;
  options?: string[];
  correct?: number;
  autoplay?: boolean;
  html?: string;
  // New element fields
  rows?: number;
  cols?: number;
  connectorType?: string;
  lineStyle?: string;
  lineWidth?: number;
  startCap?: string;
  endCap?: string;
  votes?: number[];
  front?: string;
  back?: string;
  flipped?: boolean;
  duration?: number;
  calloutType?: string;
  value?: number;
  max?: number;
  label?: string;
  icon?: string;
  entries?: TimelineEntry[];
  shape3d?: string;
  color3d?: string;
  wireframe3d?: boolean;
  // New element fields
  flipH?: boolean;
  flipV?: boolean;
  aspectLock?: boolean;
  animTrigger?: 'auto' | 'click' | 'withPrevious';
  words?: WordCloudItem[];
  fn?: string;
  xMin?: number;
  xMax?: number;
  qrText?: string;
  csvData?: string;
  bulletStyle?: string;
  indentLevel?: number;
  shapeText?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface TimelineEntry {
  date: string;
  text: string;
}

export interface WordCloudItem {
  text: string;
  weight: number;
}

/* ── Themes ──────────────────────────────────────── */
export type ThemeKey =
  | 'default' | 'dark' | 'ocean' | 'sunset' | 'forest'
  | 'minimal' | 'neon' | 'academic' | 'gradient-blue'
  | 'gradient-purple' | 'pastel' | 'corporate';

export interface Theme {
  bg: string;
  text: string;
  accent: string;
  heading: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  'default':         { bg: '#ffffff', text: '#1a1a2e', accent: '#6366f1', heading: '#1a1a2e' },
  'dark':            { bg: '#1a1a2e', text: '#e8e8f0', accent: '#5cb8ff', heading: '#fff' },
  'ocean':           { bg: '#e8f4f8', text: '#2d3436', accent: '#0984e3', heading: '#1e3a5f' },
  'sunset':          { bg: '#fff5f5', text: '#2d3436', accent: '#e17055', heading: '#c0392b' },
  'forest':          { bg: '#f0fff4', text: '#2d3436', accent: '#00b894', heading: '#1e7a5e' },
  'minimal':         { bg: '#fafafa', text: '#333', accent: '#333', heading: '#111' },
  'neon':            { bg: '#0f0f23', text: '#e0e0ff', accent: '#ff6bcb', heading: '#fff' },
  'academic':        { bg: '#fffff0', text: '#2d3436', accent: '#6366f1', heading: '#1a1a2e' },
  'gradient-blue':   { bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#fff', accent: '#ffd700', heading: '#fff' },
  'gradient-purple': { bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', text: '#2d3436', accent: '#6366f1', heading: '#2d3436' },
  'pastel':          { bg: '#fce4ec', text: '#4a4a4a', accent: '#e91e63', heading: '#333' },
  'corporate':       { bg: '#f5f7fa', text: '#2c3e50', accent: '#2980b9', heading: '#1a252f' },
};

/* ── Transitions / Animations ────────────────────── */
export type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'flip' | 'cube' | 'drop';

export const TRANSITIONS: TransitionType[] = ['none', 'fade', 'slide', 'zoom', 'flip', 'cube', 'drop'];

export const ANIMATIONS = [
  'none', 'fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown',
  'scaleIn', 'rotateIn', 'bounceIn', 'typewriter', 'blurIn', 'flipIn',
  'pulse', 'float', 'shake', 'swing', 'rubberBand', 'jello'
] as const;

export type AnimationType = typeof ANIMATIONS[number];
