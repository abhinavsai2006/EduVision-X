'use client';
/* ═══════════════════════════════════════════════════════
   ContextMenu — Right-click context menu on canvas
   ═══════════════════════════════════════════════════════ */
import React, { useState, useEffect, useCallback } from 'react';
import { useSlideStore } from '@/store/useSlideStore';
import { createElement } from '@/lib/elements';

interface MenuPos { x: number; y: number; }

export default function ContextMenu() {
  const [pos, setPos] = useState<MenuPos | null>(null);
  const selectedIds = useSlideStore(s => s.selectedElementIds);
  const copySelection = useSlideStore(s => s.copySelection);
  const pasteClipboard = useSlideStore(s => s.pasteClipboard);
  const cutSelection = useSlideStore(s => s.cutSelection);
  const removeElements = useSlideStore(s => s.removeElements);
  const bringForward = useSlideStore(s => s.bringForward);
  const sendBackward = useSlideStore(s => s.sendBackward);
  const bringToFront = useSlideStore(s => s.bringToFront);
  const sendToBack = useSlideStore(s => s.sendToBack);
  const updateElement = useSlideStore(s => s.updateElement);
  const selectAll = useSlideStore(s => s.selectAll);
  const formatPainterStyle = useSlideStore(s => s.formatPainterStyle);
  const setFormatPainterStyle = useSlideStore(s => s.setFormatPainterStyle);
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);

  const hasSelection = selectedIds.length > 0;
  const elId = selectedIds[0];
  const slide = slides[currentSlideIndex];
  const el = elId ? slide?.elements.find(e => e.id === elId) : null;

  const handleCtx = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.slide-canvas') || target.closest('.element-selected')) {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const close = useCallback(() => setPos(null), []);

  useEffect(() => {
    window.addEventListener('contextmenu', handleCtx);
    window.addEventListener('click', close);
    return () => { window.removeEventListener('contextmenu', handleCtx); window.removeEventListener('click', close); };
  }, [handleCtx, close]);

  if (!pos) return null;

  const items: { label: string; action: () => void; divider?: boolean; disabled?: boolean }[] = [
    { label: '✂ Cut', action: () => cutSelection(), disabled: !hasSelection },
    { label: '📋 Copy', action: () => copySelection(), disabled: !hasSelection },
    { label: '📌 Paste', action: () => pasteClipboard() },
    { label: '⧉ Duplicate', action: () => { copySelection(); pasteClipboard(); }, disabled: !hasSelection },
    { label: '---', action: () => {}, divider: true },
    { label: '⬆ Bring Forward', action: () => { if (elId) bringForward(elId); }, disabled: !elId },
    { label: '⬇ Send Backward', action: () => { if (elId) sendBackward(elId); }, disabled: !elId },
    { label: '⤴ Bring to Front', action: () => { if (elId) bringToFront(elId); }, disabled: !elId },
    { label: '⤵ Send to Back', action: () => { if (elId) sendToBack(elId); }, disabled: !elId },
    { label: '---', action: () => {}, divider: true },
    { label: el?.locked ? '🔓 Unlock' : '🔒 Lock', action: () => { if (el) updateElement(el.id, { locked: !el.locked }); }, disabled: !el },
    { label: '🖌 Copy Format', action: () => { if (el) setFormatPainterStyle(el.style as Record<string, unknown>); }, disabled: !el },
    { label: '🎨 Paste Format', action: () => {
      if (el && formatPainterStyle) updateElement(el.id, { style: { ...el.style, ...formatPainterStyle } as typeof el.style });
    }, disabled: !el || !formatPainterStyle },
    { label: '---', action: () => {}, divider: true },
    { label: '⊞ Select All', action: () => selectAll() },
    { label: '🗑 Delete', action: () => removeElements(), disabled: !hasSelection },
  ];

  return (
    <div className="fixed z-[9997] py-1 min-w-[200px]"
      style={{
        left: pos.x, top: pos.y,
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-bold)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
      }}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="my-1 mx-2" style={{ borderTop: '1px solid var(--border)' }} />
        ) : (
          <button key={i}
            className="w-full text-left px-3 py-1.5 text-xs transition-colors disabled:opacity-30"
            style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            disabled={item.disabled}
            onMouseOver={e => { if (!item.disabled) e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onClick={() => { item.action(); close(); }}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
