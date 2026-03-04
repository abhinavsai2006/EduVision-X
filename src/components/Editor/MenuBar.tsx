'use client';
/* ═══════════════════════════════════════════════════════
   MenuBar — File · Edit · Insert · View · Slide · Present
   EduSlide v5.0 — Redesigned
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { createElement } from '@/lib/elements';
import { ElementType, THEMES, ThemeKey, SlideElement } from '@/types/slide';
import {
  exportISL, exportISLT, exportPDF, exportPNG, exportHTML, exportSVG, copyEmbedCode,
  importISLFromFile, importMarkdownFromFile,
} from '@/lib/exports';
import SaveAsModal from '@/components/UI/SaveAsModal';
import OpenModal from '@/components/UI/OpenModal';

/* ── Menu type ─── */
interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  divider?: boolean;
  sub?: MenuItem[];
}

/* ── Tiny SVG icons for menu items ─── */
const menuIcons: Record<string, React.ReactNode> = {
  /* File */
  'New Presentation': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  'Open…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  'Save': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  'Save As…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  'Import ISL File…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  'Import Markdown…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  'Export ISL JSON': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  'Export ISLT': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  'Export PDF': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  'Export PNG': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  'Export SVG': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  'Export HTML': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  'Copy Embed Code': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  /* Edit */
  'Undo': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  'Redo': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  'Cut': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  'Copy': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  'Paste': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  'Duplicate Element': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  'Select All': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  'Find & Replace': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  'Align Left': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  'Align Center': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>,
  'Align Right': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
  'Distribute H': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="4" height="12"/><rect x="10" y="6" width="4" height="12"/><rect x="19" y="6" width="4" height="12"/></svg>,
  'Distribute V': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="1" width="12" height="4"/><rect x="6" y="10" width="12" height="4"/><rect x="6" y="19" width="12" height="4"/></svg>,
  'Format Painter': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l4 4-8 8H4v-4l8-8z"/><path d="M16 6l2-2"/></svg>,
  /* Insert */
  'Heading': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  'Text': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  'List': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  'Image': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  'Shape': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>,
  'Chart': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  'Code Block': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  'Math': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  'Table': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  'Quiz': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  'Poll': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  'Flashcard': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  'Timer': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  'Video': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  'Audio': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  'Divider': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  'Note': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  'Callout': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  'Progress Bar': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="9" width="22" height="6" rx="3"/><rect x="1" y="9" width="14" height="6" rx="3" fill="currentColor" opacity="0.3"/></svg>,
  'Icon': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  'Connector': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  'Timeline': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>,
  'Mermaid Diagram': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="8.5" y="14" width="7" height="7"/><line x1="6.5" y1="10" x2="10" y2="14"/><line x1="17.5" y1="10" x2="14" y2="14"/></svg>,
  '3D Element': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  'Word Cloud': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
  'Function Plot': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  'QR Code': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>,
  'Embed HTML': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  /* View */
  'Toggle Grid': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  'Toggle Ruler': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3H3v18h18V3zM3 9h4M3 15h4M9 3v4M15 3v4"/></svg>,
  'Drawing Mode': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  'Zoom In': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  'Zoom Out': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  'Reset Zoom': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  'Slide Sorter': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  'Template Gallery': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  'Template Gallery…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  'Keyboard Shortcuts': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>,
  /* Slide */
  'Add Slide': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  'Duplicate Slide': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  'Delete Slide': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  'Move Up': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  'Move Down': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  'Apply Layout…': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  /* Present */
  'Start Presentation': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  'Present from Current': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  'Presenter View': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
};

/* ── Dropdown animation config ─── */
const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' as const } },
};

export default function MenuBar() {
  const store = useSlideStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  /* Helper to build current Presentation object for exports */
  const getPres = () => useSlideStore.getState().presentation;
  const barRef = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const normalizeMediaUrl = (url: string): string => {
    const v = url.trim();
    if (!v) return '';
    const yt1 = v.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/);
    const yt2 = v.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    const yt3 = v.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
    const ytId = yt1?.[1] || yt2?.[1] || yt3?.[1];
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    const vm = v.match(/vimeo\.com\/(\d+)/);
    if (vm?.[1]) return `https://player.vimeo.com/video/${vm[1]}`;
    return v;
  };

  const uploadMedia = async (accept: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const fd = new FormData();
        fd.append('file', file);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const data = await res.json();
          resolve(data?.url || null);
        } catch {
          resolve(null);
        }
      };
      input.click();
    });
  };

  const ins = async (type: ElementType, props?: Partial<SlideElement>) => {
    if (type === 'image') {
      const url = window.prompt('Paste image URL. Leave blank to upload from device.');
      const src = url?.trim() ? url.trim() : await uploadMedia('image/*');
      if (!src) return;
      store.addElement(createElement('image', { ...props, src }));
      setOpenMenu(null);
      return;
    }

    if (type === 'video') {
      const url = window.prompt('Paste YouTube/Vimeo/direct video URL. Leave blank to upload local video.');
      const src = url?.trim() ? normalizeMediaUrl(url) : await uploadMedia('video/*');
      if (!src) return;
      store.addElement(createElement('video', { ...props, src }));
      setOpenMenu(null);
      return;
    }

    if (type === 'audio') {
      const url = window.prompt('Paste direct audio URL (.mp3/.wav). Leave blank to upload local audio.');
      const src = url?.trim() ? url.trim() : await uploadMedia('audio/*');
      if (!src) return;
      store.addElement(createElement('audio', { ...props, src }));
      setOpenMenu(null);
      return;
    }

    store.addElement(createElement(type, props));
    setOpenMenu(null);
  };

  /* ─── Menu definitions ─── */
  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New Presentation', shortcut: 'Ctrl+N', action: () => { if (confirm('Create a new presentation? Unsaved changes will be lost.')) { store.loadPresentation({ meta: { title: 'Untitled', author: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: '3.0', theme: 'default', aspectRatio: '16:9' }, slides: [{ id: 's_new', order: 0, layout: 'blank', background: { type: 'solid', value: '#fff' }, elements: [], notes: '', transition: 'none', animations: [] }], settings: { transition: 'fade', transitionDuration: 500, autoPlay: false, autoPlayInterval: 5000, showSlideNumbers: true, enableAI: true, enableInteractive: true } }); } setOpenMenu(null); } },
      { label: 'Open…', shortcut: 'Ctrl+O', action: () => { setShowOpen(true); setOpenMenu(null); } },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => { savePres(); setOpenMenu(null); } },
      { label: 'Save As…', shortcut: 'Ctrl+Shift+S', action: () => { setShowSaveAs(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Import ISL File…', action: async () => { setOpenMenu(null); const p = await importISLFromFile(); if (p) store.loadPresentation(p); } },
      { label: 'Import Markdown…', action: async () => { setOpenMenu(null); const p = await importMarkdownFromFile(); if (p) store.loadPresentation(p); } },
      { label: 'divider', divider: true },
      { label: 'Export ISL JSON', action: () => { exportISL(getPres()); setOpenMenu(null); } },
      { label: 'Export ISLT', action: () => { exportISLT(getPres()); setOpenMenu(null); } },
      { label: 'Export PDF', action: () => { exportPDF(); setOpenMenu(null); } },
      { label: 'Export PNG', action: () => { exportPNG(store.currentSlideIndex); setOpenMenu(null); } },
      { label: 'Export SVG', action: () => { exportSVG(getPres(), store.currentSlideIndex); setOpenMenu(null); } },
      { label: 'Export HTML', action: () => { exportHTML(getPres()); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Copy Embed Code', action: async () => { const ok = await copyEmbedCode(getPres()); if (ok) alert('Embed code copied to clipboard!'); setOpenMenu(null); } },
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => { store.undo(); setOpenMenu(null); } },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: () => { store.redo(); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Cut', shortcut: 'Ctrl+X', action: () => { store.cutSelection(); setOpenMenu(null); } },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => { store.copySelection(); setOpenMenu(null); } },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => { store.pasteClipboard(); setOpenMenu(null); } },
      { label: 'Duplicate Element', shortcut: 'Ctrl+D', action: () => { store.duplicateElement(); setOpenMenu(null); } },
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => { store.selectAll(); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Find & Replace', shortcut: 'Ctrl+H', action: () => { store.setFindReplace(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Align Left', action: () => { store.alignElements('left'); setOpenMenu(null); } },
      { label: 'Align Center', action: () => { store.alignElements('center'); setOpenMenu(null); } },
      { label: 'Align Right', action: () => { store.alignElements('right'); setOpenMenu(null); } },
      { label: 'Distribute H', action: () => { store.distributeElements('h'); setOpenMenu(null); } },
      { label: 'Distribute V', action: () => { store.distributeElements('v'); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Format Painter', shortcut: 'Ctrl+Shift+C', action: () => {
        const els = store.selectedElements();
        if (els.length === 1) { store.setFormatPainterStyle(els[0].style as Record<string, unknown>); }
        setOpenMenu(null);
      } },
    ],
    Insert: [
      { label: 'Heading', action: () => ins('heading') },
      { label: 'Text', action: () => ins('text') },
      { label: 'List', action: () => ins('list') },
      { label: 'Image', action: () => ins('image') },
      { label: 'Shape', sub: [
        { label: 'Rectangle', action: () => ins('shape', { shape: 'rectangle' }) },
        { label: 'Circle', action: () => ins('shape', { shape: 'circle' }) },
        { label: 'Triangle', action: () => ins('shape', { shape: 'triangle' }) },
        { label: 'Diamond', action: () => ins('shape', { shape: 'diamond' }) },
        { label: 'Star', action: () => ins('shape', { shape: 'star' }) },
        { label: 'Hexagon', action: () => ins('shape', { shape: 'hexagon' }) },
        { label: 'Heart', action: () => ins('shape', { shape: 'heart' }) },
        { label: 'Arrow', action: () => ins('shape', { shape: 'arrow' }) },
      ] },
      { label: 'Chart', action: () => ins('chart') },
      { label: 'Code Block', action: () => ins('code') },
      { label: 'Math', action: () => ins('math') },
      { label: 'Table', action: () => ins('table') },
      { label: 'divider', divider: true },
      { label: 'Quiz', action: () => ins('quiz') },
      { label: 'Poll', action: () => ins('poll') },
      { label: 'Flashcard', action: () => ins('flashcard') },
      { label: 'Timer', action: () => ins('timer') },
      { label: 'divider', divider: true },
      { label: 'Video', action: () => ins('video') },
      { label: 'Audio', action: () => ins('audio') },
      { label: 'Divider', action: () => ins('divider') },
      { label: 'Note', action: () => ins('note') },
      { label: 'Callout', action: () => ins('callout') },
      { label: 'Progress Bar', action: () => ins('progress') },
      { label: 'Icon', action: () => ins('icon') },
      { label: 'Connector', action: () => ins('connector') },
      { label: 'Timeline', action: () => ins('timeline') },
      { label: 'Mermaid Diagram', action: () => ins('mermaid') },
      { label: '3D Element', action: () => ins('3d') },
      { label: 'divider', divider: true },
      { label: 'Word Cloud', action: () => ins('wordcloud') },
      { label: 'Function Plot', action: () => ins('functionplot') },
      { label: 'QR Code', action: () => ins('qrcode') },
      { label: 'Embed HTML', action: () => ins('embed') },
      { label: 'divider', divider: true },
      { label: 'Emoji Picker', action: () => { store.toggleEmojiPicker(); setOpenMenu(null); } },
      { label: 'Symbol Picker', action: () => { store.toggleSymbolPicker(); setOpenMenu(null); } },
      { label: 'Media Library', action: () => { store.toggleMediaLibrary(); setOpenMenu(null); } },
      { label: 'Link…', shortcut: 'Ctrl+K', action: () => { store.setCommandPalette(true); setOpenMenu(null); } },
    ],
    View: [
      { label: 'Toggle Grid', shortcut: 'Ctrl+G', action: () => { store.toggleGrid(); setOpenMenu(null); } },
      { label: 'Toggle Ruler', action: () => { store.toggleRuler(); setOpenMenu(null); } },
      { label: 'Drawing Mode', action: () => { store.setToolMode(store.toolMode === 'draw' ? 'select' : 'draw'); setOpenMenu(null); } },
      { label: 'Zoom In', shortcut: 'Ctrl+=', action: () => { store.setZoom(Math.min(store.zoom + 0.1, 2)); setOpenMenu(null); } },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => { store.setZoom(Math.max(store.zoom - 0.1, 0.3)); setOpenMenu(null); } },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: () => { store.setZoom(1); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Slide Sorter', action: () => { store.setSlideSorter(true); setOpenMenu(null); } },
      { label: 'Template Gallery', action: () => { store.setTemplateGallery(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+/', action: () => { store.setShortcutsHelp(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Animation Timeline', action: () => { store.setShowAnimationTimeline(true); setOpenMenu(null); } },
      { label: 'Version History', action: () => { store.toggleVersionHistory(); setOpenMenu(null); } },
      { label: 'Notifications', action: () => { store.setShowNotificationCenter(true); setOpenMenu(null); } },
      { label: 'Collaboration Panel', action: () => { store.setShowCollaborationPanel(true); setOpenMenu(null); } },
    ],
    Slide: [
      { label: 'Add Slide', shortcut: 'Ctrl+M', action: () => { store.addSlide(); setOpenMenu(null); } },
      { label: 'Duplicate Slide', action: () => { store.duplicateSlide(); setOpenMenu(null); } },
      { label: 'Delete Slide', action: () => { store.removeSlide(); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Move Up', action: () => { if (store.currentSlideIndex > 0) store.moveSlide(store.currentSlideIndex, store.currentSlideIndex - 1); setOpenMenu(null); } },
      { label: 'Move Down', action: () => { if (store.currentSlideIndex < store.presentation.slides.length - 1) store.moveSlide(store.currentSlideIndex, store.currentSlideIndex + 1); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Apply Layout…', action: () => { /* handled via PropertyPanel */ setOpenMenu(null); } },
      { label: 'Template Gallery…', action: () => { store.setTemplateGallery(true); setOpenMenu(null); } },
    ],
    Theme: (Object.keys(THEMES) as ThemeKey[]).map(k => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      action: () => { store.setTheme(k); setOpenMenu(null); },
    })),
    Tools: [
      { label: 'Coding Lab', action: () => { store.setShowCodingLab(true); setOpenMenu(null); } },
      { label: 'Simulation Engine', action: () => { store.setShowSimulationEngine(true); setOpenMenu(null); } },
      { label: 'Analytics Dashboard', action: () => { store.setShowAnalyticsDashboard(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Theme Editor', action: () => { store.setShowThemeEditor(true); setOpenMenu(null); } },
      { label: 'Plugin Marketplace', action: () => { store.togglePluginPanel(); setOpenMenu(null); } },
      { label: 'Accessibility Checker', action: () => { store.setShowAccessibilityChecker(true); setOpenMenu(null); } },
      { label: 'divider', divider: true },
      { label: 'Export Options…', action: () => { store.setShowExportDialog(true); setOpenMenu(null); } },
      { label: 'Settings', action: () => { store.setShowSettingsDialog(true); setOpenMenu(null); } },
    ],
    Present: [
      { label: 'Start Presentation', shortcut: 'F5', action: () => { store.enterPresent(); setOpenMenu(null); } },
      { label: 'Present from Current', shortcut: 'Shift+F5', action: () => { store.setPresentFromSlide(store.currentSlideIndex); store.enterPresent(); setOpenMenu(null); } },
      { label: 'Presenter View', action: () => { store.setPresenterView(true); setOpenMenu(null); } },
    ],
  };

  /* ─── Global keyboard shortcuts ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      /* ─ File ─ */
      if (ctrl && e.key === 'n') { e.preventDefault(); if (confirm('Create a new presentation? Unsaved changes will be lost.')) menus.File[0].action?.(); }
      if (ctrl && e.key === 'o') { e.preventDefault(); setShowOpen(true); }
      if (ctrl && shift && e.key === 'S') { e.preventDefault(); setShowSaveAs(true); return; }
      if (ctrl && e.key === 's') { e.preventDefault(); savePres(); }
      /* ─ Edit ─ */
      if (ctrl && e.key === 'z') { e.preventDefault(); store.undo(); }
      if (ctrl && e.key === 'y') { e.preventDefault(); store.redo(); }
      if (ctrl && !shift && e.key === 'c') { store.copySelection(); }
      if (ctrl && e.key === 'v') { e.preventDefault(); store.pasteClipboard(); }
      if (ctrl && e.key === 'x') { store.cutSelection(); }
      if (ctrl && e.key === 'a') { e.preventDefault(); store.selectAll(); }
      if (ctrl && e.key === 'd') { e.preventDefault(); store.duplicateElement(); }
      if (ctrl && e.key === 'h') { e.preventDefault(); store.setFindReplace(true); }
      if (ctrl && shift && e.key === 'C') { e.preventDefault(); const els = store.selectedElements(); if (els.length === 1) store.setFormatPainterStyle(els[0].style as Record<string, unknown>); }
      /* ─ View ─ */
      if (ctrl && e.key === 'g') { e.preventDefault(); store.toggleGrid(); }
      if (ctrl && (e.key === '=' || e.key === '+')) { e.preventDefault(); store.setZoom(Math.min(store.zoom + 0.1, 2)); }
      if (ctrl && e.key === '-') { e.preventDefault(); store.setZoom(Math.max(store.zoom - 0.1, 0.3)); }
      if (ctrl && e.key === '0') { e.preventDefault(); store.setZoom(1); }
      if (ctrl && e.key === '/') { e.preventDefault(); store.setShortcutsHelp(true); }
      /* ─ Slide ─ */
      if (ctrl && e.key === 'm') { e.preventDefault(); store.addSlide(); }
      /* ─ Delete / Escape ─ */
      if (e.key === 'Delete') store.removeElements();
      if (e.key === 'Escape') { store.clearSelection(); store.setFindReplace(false); }
      /* ─ Present ─ */
      if (e.key === 'F5' && !shift) { e.preventDefault(); store.enterPresent(); }
      if (e.key === 'F5' && shift) { e.preventDefault(); store.setPresentFromSlide(store.currentSlideIndex); store.enterPresent(); }
      /* ─ Arrow nudge ─ */
      if (e.key === 'ArrowLeft' && !ctrl && store.selectedElementIds.length > 0) { e.preventDefault(); store.nudgeSelection(store.showGrid ? -20 : -1, 0); }
      if (e.key === 'ArrowRight' && !ctrl && store.selectedElementIds.length > 0) { e.preventDefault(); store.nudgeSelection(store.showGrid ? 20 : 1, 0); }
      if (e.key === 'ArrowUp' && !ctrl && store.selectedElementIds.length > 0) { e.preventDefault(); store.nudgeSelection(0, store.showGrid ? -20 : -1); }
      if (e.key === 'ArrowDown' && !ctrl && store.selectedElementIds.length > 0) { e.preventDefault(); store.nudgeSelection(0, store.showGrid ? 20 : 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store]);

  /* ─── Helpers ─── */
  const savePres = useCallback(async () => {
    try {
      await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(store.presentation) });
    } catch { /* ignore */ }
  }, [store.presentation]);

  const loadPres = useCallback(async () => {
    try {
      const res = await fetch('/api/presentations');
      const list: string[] = await res.json();
      if (list.length === 0) return alert('No saved presentations.');
      const name = prompt('Load which?\n' + list.join('\n'), list[0]);
      if (!name) return;
      const r2 = await fetch('/api/load?name=' + encodeURIComponent(name));
      const data = await r2.json();
      store.loadPresentation(data);
    } catch { /* ignore */ }
  }, [store]);

  /* ── Theme swatch dot for Theme menu ── */
  const themeColorDot = (label: string) => {
    const key = label.toLowerCase() as ThemeKey;
    const theme = THEMES[key];
    if (!theme) return null;
    const color = (theme as unknown as Record<string, string>).accent || 'var(--accent)';
    return (
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          border: '1px solid rgba(255,255,255,0.15)',
          flexShrink: 0,
        }}
      />
    );
  };

  return (
    <div
      ref={barRef}
      className="flex items-center shrink-0 select-none"
      style={{
        height: 42,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '0 12px',
        gap: 0,
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* ─── Logo ─── */}
      <div className="flex items-center gap-2 mr-3" style={{ marginRight: 14 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-solid))',
            boxShadow: '0 0 12px color-mix(in srgb, var(--accent) 40%, transparent)',
            position: 'relative',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            E
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          Edu<span style={{ color: 'var(--accent)', fontWeight: 800 }}>Slide</span>
        </span>
      </div>

      {/* ─── Separator ─── */}
      <div
        style={{
          width: 1,
          height: 18,
          background: 'var(--border)',
          marginRight: 6,
          flexShrink: 0,
        }}
      />

      {/* ─── Menu buttons ─── */}
      <div className="flex items-center" style={{ gap: 1 }}>
        {Object.entries(menus).map(([name, items]) => (
          <div key={name} className="relative">
            <motion.button
              className="flex items-center justify-center"
              style={{
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                color: openMenu === name ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: openMenu === name ? 'var(--accent-dim)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                lineHeight: '20px',
                transition: 'color 0.15s, background 0.15s',
              }}
              whileHover={{
                backgroundColor: openMenu === name ? undefined : 'var(--bg-hover)',
                color: 'var(--text-primary)',
              }}
              whileTap={{ scale: 0.97 }}
              onMouseDown={() => setOpenMenu(openMenu === name ? null : name)}
              onMouseEnter={() => openMenu && setOpenMenu(name)}
            >
              {name}
            </motion.button>

            {/* ─── Dropdown ─── */}
            <AnimatePresence>
              {openMenu === name && (
                <motion.div
                  className="absolute left-0 top-full min-w-[230px] max-h-[70vh] overflow-y-auto z-50"
                  style={{
                    marginTop: 3,
                    padding: '4px 0',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-bold)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    backdropFilter: 'blur(12px)',
                  }}
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {items.map((item, i) =>
                    item.divider ? (
                      <div
                        key={i}
                        style={{
                          height: 1,
                          margin: '4px 10px',
                          background: 'var(--border)',
                          opacity: 0.6,
                        }}
                      />
                    ) : (
                      <motion.button
                        key={i}
                        className="w-full flex items-center text-left"
                        style={{
                          padding: '6px 12px',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          gap: 8,
                          lineHeight: '18px',
                          borderRadius: 0,
                        }}
                        whileHover={{
                          backgroundColor: 'var(--accent-dim)',
                        }}
                        onClick={item.action}
                      >
                        {/* Icon */}
                        <span
                          className="flex items-center justify-center shrink-0"
                          style={{
                            width: 16,
                            height: 16,
                            color: 'var(--text-muted)',
                            opacity: 0.7,
                          }}
                        >
                          {name === 'Theme'
                            ? themeColorDot(item.label)
                            : (menuIcons[item.label] || (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1" />
                                </svg>
                              ))}
                        </span>
                        {/* Label */}
                        <span className="flex-1 truncate">{item.label}</span>
                        {/* Shortcut */}
                        {item.shortcut && (
                          <span
                            className="ml-auto shrink-0 font-mono"
                            style={{
                              fontSize: 10,
                              color: 'var(--text-muted)',
                              opacity: 0.6,
                              paddingLeft: 16,
                            }}
                          >
                            {item.shortcut}
                          </span>
                        )}
                      </motion.button>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ─── Center spacer ─── */}
      <div className="flex-1" />

      {/* ─── Title input ─── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 260 }}
      >
        <input
          className="text-center outline-none w-full"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            background: 'transparent',
            border: 'none',
            borderBottom: '1.5px solid transparent',
            padding: '4px 8px',
            borderRadius: 0,
            transition: 'border-color 0.2s ease',
            letterSpacing: '-0.01em',
          }}
          onFocus={e => {
            e.currentTarget.style.borderBottomColor = 'var(--accent)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderBottomColor = 'transparent';
          }}
          value={store.presentation.meta.title}
          onChange={e => store.setTitle(e.target.value)}
          placeholder="Untitled Presentation"
        />
      </div>

      {/* ─── Center spacer ─── */}
      <div className="flex-1" />

      {/* ─── Right controls ─── */}
      <div className="flex items-center" style={{ gap: 8 }}>
        {/* Zoom badge */}
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            background: 'var(--bg-primary)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            lineHeight: '14px',
            border: '1px solid var(--border)',
          }}
        >
          {Math.round(store.zoom * 100)}%
        </span>

        {/* Share button */}
        <motion.button
          className="flex items-center shrink-0"
          style={{
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent)',
            background: 'transparent',
            border: '1.5px solid var(--accent)',
            cursor: 'pointer',
            gap: 5,
            lineHeight: '18px',
          }}
          whileHover={{
            backgroundColor: 'var(--accent-dim)',
            scale: 1.02,
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const url = window.location.origin + '/viewer';
            navigator.clipboard.writeText(url).then(() => alert('Share link copied!')).catch(() => {});
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </motion.button>

        {/* Present button */}
        <motion.button
          className="flex items-center shrink-0"
          style={{
            padding: '5px 18px',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-solid))',
            border: 'none',
            cursor: 'pointer',
            gap: 6,
            lineHeight: '18px',
            boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 50%, transparent)',
            y: -1,
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => store.enterPresent()}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Present
        </motion.button>
      </div>

      {/* ─── Modals ─── */}
      <SaveAsModal open={showSaveAs} onClose={() => setShowSaveAs(false)} />
      <OpenModal open={showOpen} onClose={() => setShowOpen(false)} />
    </div>
  );
}
