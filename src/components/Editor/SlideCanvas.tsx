'use client';
/* ═══════════════════════════════════════════════════════
   SlideCanvas — DOM-based rendered slide with drag/resize,
   grid snapping, rulers, drawing, inline editing,
   marquee selection, rotation handle, snap guides
   ═══════════════════════════════════════════════════════ */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { SlideElement, THEMES, ThemeKey } from '@/types/slide';
import ElementRenderer from '../Elements/ElementRenderer';
import { createElement } from '@/lib/elements';
import dynamic from 'next/dynamic';

const LiveCodeEditor = dynamic(() => import('../UI/LiveCodeEditor'), { ssr: false });

const CANVAS_W = 960;
const CANVAS_H = 540;
const GRID_SIZE = 20;
const SNAP_THRESHOLD = 5;

export default function SlideCanvas() {
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const selectedElementIds = useSlideStore(s => s.selectedElementIds);
  const zoom = useSlideStore(s => s.zoom);
  const showGrid = useSlideStore(s => s.showGrid);
  const showRuler = useSlideStore(s => s.showRuler);
  const toolMode = useSlideStore(s => s.toolMode);
  const drawColor = useSlideStore(s => s.drawColor);
  const drawStrokeWidth = useSlideStore(s => s.drawStrokeWidth);
  const setDrawColor = useSlideStore(s => s.setDrawColor);
  const setDrawStrokeWidth = useSlideStore(s => s.setDrawStrokeWidth);
  const themeName = useSlideStore(s => s.presentation.meta.theme);
  const selectElement = useSlideStore(s => s.selectElement);
  const clearSelection = useSlideStore(s => s.clearSelection);
  const updateElement = useSlideStore(s => s.updateElement);
  const snapshot = useSlideStore(s => s.snapshot);
  const addElement = useSlideStore(s => s.addElement);
  const formatPainterStyle = useSlideStore(s => s.formatPainterStyle);
  const setFormatPainterStyle = useSlideStore(s => s.setFormatPainterStyle);

  const slide = slides[currentSlideIndex];
  const theme = THEMES[themeName as ThemeKey] || THEMES.default;
  const canvasRef = useRef<HTMLDivElement>(null);

  /* ─── Drag state ─── */
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; corner: string; startX: number; startY: number; elW: number; elH: number; elX: number; elY: number } | null>(null);

  /* ─── Drawing state ─── */
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  /* ─── Inline editing state ─── */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  /* ─── Code editor modal state ─── */
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [codeEditorElId, setCodeEditorElId] = useState<string | null>(null);

  /* ─── Marquee selection state ─── */
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; x: number; y: number; w: number; h: number } | null>(null);

  /* ─── Rotation state ─── */
  const [rotating, setRotating] = useState<{ id: string; startAngle: number; elRotation: number; cx: number; cy: number } | null>(null);

  /* ─── Snap guides state ─── */
  const [snapGuides, setSnapGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  /* ─── Grid snap helper ─── */
  const snap = (v: number) => showGrid ? Math.round(v / GRID_SIZE) * GRID_SIZE : Math.round(v);

  /* ─── Snap guide computation (element-to-element alignment) ─── */
  const computeSnapGuides = useCallback((dragId: string, newX: number, newY: number, w: number, h: number) => {
    const guides: { x: number[]; y: number[] } = { x: [], y: [] };
    const others = slide.elements.filter(e => e.id !== dragId);
    const edges = { left: newX, center: newX + w / 2, right: newX + w, top: newY, middle: newY + h / 2, bottom: newY + h };
    // Canvas center guides
    const canvasCX = CANVAS_W / 2;
    const canvasCY = CANVAS_H / 2;
    if (Math.abs(edges.center - canvasCX) < SNAP_THRESHOLD) guides.x.push(canvasCX);
    if (Math.abs(edges.middle - canvasCY) < SNAP_THRESHOLD) guides.y.push(canvasCY);

    for (const o of others) {
      const oEdges = { left: o.x, center: o.x + o.width / 2, right: o.x + o.width, top: o.y, middle: o.y + o.height / 2, bottom: o.y + o.height };
      // X alignment
      for (const eKey of ['left', 'center', 'right'] as const) {
        for (const oKey of ['left', 'center', 'right'] as const) {
          if (Math.abs(edges[eKey] - oEdges[oKey]) < SNAP_THRESHOLD) guides.x.push(oEdges[oKey]);
        }
      }
      // Y alignment
      for (const eKey of ['top', 'middle', 'bottom'] as const) {
        for (const oKey of ['top', 'middle', 'bottom'] as const) {
          if (Math.abs(edges[eKey] - oEdges[oKey]) < SNAP_THRESHOLD) guides.y.push(oEdges[oKey]);
        }
      }
    }
    setSnapGuides(guides);
    return guides;
  }, [slide.elements]);

  /* ─── Background style ─── */
  const bgStyle: React.CSSProperties = {};
  if (slide.background.type === 'solid') bgStyle.background = slide.background.value;
  else if (slide.background.type === 'gradient') bgStyle.background = slide.background.value;
  else if (slide.background.type === 'image') {
    bgStyle.backgroundImage = `url(${slide.background.value})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }
  if (slide.background.value === '#ffffff' || slide.background.value === '#fff') {
    bgStyle.background = theme.bg;
  }

  /* ─── Canvas click → deselect ─── */
  const onCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('slide-bg')) {
      clearSelection();
      if (editingId) {
        // Save inline edit
        const el = slide.elements.find(x => x.id === editingId);
        if (el && editText !== (el.content || '')) {
          updateElement(editingId, { content: editText });
        }
        setEditingId(null);
      }
    }
  };

  /* ─── Canvas mouse down for drawing mode OR marquee selection ─── */
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (toolMode === 'draw') {
      setIsDrawing(true);
      setDrawingPoints([{ x, y }]);
      return;
    }

    // Start marquee selection if clicking on empty canvas area
    if (toolMode === 'select' && (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('slide-bg') || (e.target as HTMLElement).classList.contains('grid-overlay'))) {
      setMarquee({ startX: x, startY: y, x, y: y, w: 0, h: 0 });
    }
  };

  /* ─── Element mouse down → start drag ─── */
  const onElementMouseDown = useCallback((e: React.MouseEvent, el: SlideElement) => {
    e.stopPropagation();
    if (el.locked) return;

    // Format painter: paste style on click
    if (formatPainterStyle) {
      updateElement(el.id, { style: { ...el.style, ...formatPainterStyle } });
      setFormatPainterStyle(null);
      return;
    }

    const multi = e.shiftKey || e.ctrlKey;
    selectElement(el.id, multi);
    setDragging({
      id: el.id,
      startX: e.clientX,
      startY: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  }, [selectElement, formatPainterStyle, updateElement, setFormatPainterStyle]);

  /* ─── Double-click for inline editing / code editor / flip ─── */
  const onElementDoubleClick = useCallback((e: React.MouseEvent, el: SlideElement) => {
    e.stopPropagation();
    // Text-based elements → inline edit
    const editableTypes = ['heading', 'text', 'note', 'callout', 'math', 'mermaid'];
    if (editableTypes.includes(el.type)) {
      setEditingId(el.id);
      setEditText(el.content || '');
      return;
    }
    // Code → Live Code Editor modal
    if (el.type === 'code') {
      setCodeEditorElId(el.id);
      setCodeEditorOpen(true);
      return;
    }
    // Quiz → prompt to edit question
    if (el.type === 'quiz') {
      const q = prompt('Edit quiz question:', el.question || '');
      if (q !== null) updateElement(el.id, { question: q });
      return;
    }
    // Flashcard → flip
    if (el.type === 'flashcard') {
      // Toggle a "flipped" flag in the element (ElementRenderer reads this)
      updateElement(el.id, { flipped: !el.flipped } as Partial<SlideElement>);
      return;
    }
  }, [updateElement]);

  /* ─── Resize handle mouse down ─── */
  const onResizeMouseDown = useCallback((e: React.MouseEvent, el: SlideElement, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing({
      id: el.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      elW: el.width,
      elH: el.height,
      elX: el.x,
      elY: el.y,
    });
  }, []);

  /* ─── Rotation handle mouse down ─── */
  const onRotateMouseDown = useCallback((e: React.MouseEvent, el: SlideElement) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + (el.x + el.width / 2) * zoom;
    const cy = rect.top + (el.y + el.height / 2) * zoom;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    setRotating({ id: el.id, startAngle, elRotation: el.rotation || 0, cx, cy });
  }, [zoom]);

  /* ─── Mouse move ─── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / zoom;
        const dy = (e.clientY - dragging.startY) / zoom;
        const newX = snap(dragging.elX + dx);
        const newY = snap(dragging.elY + dy);
        const el = slide.elements.find(x => x.id === dragging.id);
        if (el) computeSnapGuides(dragging.id, newX, newY, el.width, el.height);
        updateElement(dragging.id, { x: newX, y: newY });
      }
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        let { elW, elH, elX, elY } = resizing;
        const c = resizing.corner;
        if (c.includes('e')) elW = Math.max(20, resizing.elW + dx);
        if (c.includes('s')) elH = Math.max(20, resizing.elH + dy);
        if (c.includes('w')) { elW = Math.max(20, resizing.elW - dx); elX = resizing.elX + dx; }
        if (c.includes('n')) { elH = Math.max(20, resizing.elH - dy); elY = resizing.elY + dy; }
        updateElement(resizing.id, {
          width: snap(elW),
          height: snap(elH),
          x: snap(elX),
          y: snap(elY),
        });
      }
      if (rotating) {
        const angle = Math.atan2(e.clientY - rotating.cy, e.clientX - rotating.cx) * (180 / Math.PI);
        const delta = angle - rotating.startAngle;
        let newRot = rotating.elRotation + delta;
        // Snap to 15-degree increments when holding Shift
        if (e.shiftKey) newRot = Math.round(newRot / 15) * 15;
        updateElement(rotating.id, { rotation: Math.round(newRot) });
      }
      if (isDrawing && toolMode === 'draw') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        setDrawingPoints(prev => [...prev, { x, y }]);
      }
      if (marquee) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        const mx = Math.min(marquee.startX, x);
        const my = Math.min(marquee.startY, y);
        const mw = Math.abs(x - marquee.startX);
        const mh = Math.abs(y - marquee.startY);
        setMarquee({ ...marquee, x: mx, y: my, w: mw, h: mh });
      }
    };
    const onMouseUp = () => {
      if (dragging) { snapshot(); setDragging(null); setSnapGuides({ x: [], y: [] }); }
      if (resizing) { snapshot(); setResizing(null); }
      if (rotating) { snapshot(); setRotating(null); }
      if (isDrawing && drawingPoints.length > 1) {
        // Create freeform drawing element (SVG path data)
        const xs = drawingPoints.map(p => p.x);
        const ys = drawingPoints.map(p => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        const el = createElement('connector');
        el.x = minX;
        el.y = minY;
        el.width = Math.max(maxX - minX, 20);
        el.height = Math.max(maxY - minY, 20);
        // Store the normalized points as a path for freeform drawing
        const pathData = drawingPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x - minX).toFixed(1)},${(p.y - minY).toFixed(1)}`).join(' ');
        el.style = { ...el.style, stroke: drawColor, strokeWidth: drawStrokeWidth };
        el.content = pathData;
        el.connectorType = 'freeform';
        addElement(el);
        setIsDrawing(false);
        setDrawingPoints([]);
      }
      if (marquee && marquee.w > 5 && marquee.h > 5) {
        // Select all elements that fall within the marquee
        const ids = slide.elements.filter(el => {
          return el.x < marquee.x + marquee.w && el.x + el.width > marquee.x &&
                 el.y < marquee.y + marquee.h && el.y + el.height > marquee.y;
        }).map(el => el.id);
        if (ids.length > 0) {
          // Use multi-select
          ids.forEach((id, i) => selectElement(id, i > 0));
        }
      }
      setMarquee(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, resizing, rotating, zoom, updateElement, snapshot, isDrawing, drawingPoints, toolMode, addElement, showGrid, drawColor, drawStrokeWidth, marquee, selectElement, slide.elements, computeSnapGuides]);

  /* ─── Resize handles + rotation handle for selected element ─── */
  const renderHandles = (el: SlideElement) => {
    if (!selectedElementIds.includes(el.id)) return null;
    const corners = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
    const cursorMap: Record<string, string> = {
      nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize',
      n: 'n-resize', s: 's-resize', e: 'e-resize', w: 'w-resize',
    };
    const posMap: Record<string, React.CSSProperties> = {
      nw: { top: -4, left: -4 }, ne: { top: -4, right: -4 },
      sw: { bottom: -4, left: -4 }, se: { bottom: -4, right: -4 },
      n: { top: -4, left: '50%', marginLeft: -4 },
      s: { bottom: -4, left: '50%', marginLeft: -4 },
      e: { top: '50%', right: -4, marginTop: -4 },
      w: { top: '50%', left: -4, marginTop: -4 },
    };
    return (
      <>
        {corners.map(c => (
          <div key={c}
            className="resize-handle"
            style={{ ...posMap[c], cursor: cursorMap[c] }}
            onMouseDown={e => onResizeMouseDown(e, el, c)}
          />
        ))}
        {/* Rotation handle */}
        <div
          className="rotation-handle"
          style={{ position: 'absolute', top: -24, left: '50%', marginLeft: -5, width: 10, height: 10, borderRadius: '50%', background: '#00b894', border: '2px solid #fff', cursor: 'grab', zIndex: 101 }}
          onMouseDown={e => onRotateMouseDown(e, el)}
          title="Rotate"
        />
        {/* Rotation handle connector line */}
        <div style={{ position: 'absolute', top: -14, left: '50%', width: 1, height: 14, background: '#00b894', zIndex: 100, marginLeft: 0 }} />
        {/* Lock indicator */}
        {el.locked && (
          <div className="absolute -top-3 -right-3 text-[10px] z-50" title="Locked">🔒</div>
        )}
      </>
    );
  };

  /* ─── Ruler rendering ─── */
  const renderRuler = () => {
    if (!showRuler) return null;
    const ticks: React.ReactNode[] = [];
    // Horizontal ruler
    for (let x = 0; x <= CANVAS_W; x += 50) {
      ticks.push(
        <div key={`hx-${x}`} className="ruler-tick-h" style={{ left: x }}>
          <span className="ruler-label">{x}</span>
        </div>
      );
    }
    // Vertical ruler
    for (let y = 0; y <= CANVAS_H; y += 50) {
      ticks.push(
        <div key={`vy-${y}`} className="ruler-tick-v" style={{ top: y }}>
          <span className="ruler-label">{y}</span>
        </div>
      );
    }
    return <>{ticks}</>;
  };

  /* ─── Shared canvas content renderer ─── */
  const renderCanvasContent = () => (
    <>
      {showGrid && <div className="grid-overlay" />}

      {/* Snap guides */}
      <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H} style={{ zIndex: 200 }}>
        {snapGuides.x.map((x, i) => (
          <line key={`sx-${i}`} x1={x} y1={0} x2={x} y2={CANVAS_H} stroke="#e74c3c" strokeWidth={1} strokeDasharray="4,4" />
        ))}
        {snapGuides.y.map((y, i) => (
          <line key={`sy-${i}`} x1={0} y1={y} x2={CANVAS_W} y2={y} stroke="#e74c3c" strokeWidth={1} strokeDasharray="4,4" />
        ))}
      </svg>

      {slide.elements.map(el => (
        <div
          key={el.id}
          className={selectedElementIds.includes(el.id) ? 'element-selected' : ''}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
            opacity: el.opacity,
            cursor: el.locked ? 'not-allowed' : formatPainterStyle ? 'copy' : 'move',
            zIndex: slide.elements.indexOf(el),
          }}
          onMouseDown={e => onElementMouseDown(e, el)}
          onDoubleClick={e => onElementDoubleClick(e, el)}
        >
          {editingId === el.id ? (
            <textarea
              autoFocus
              className="w-full h-full p-2 outline-none resize-none"
              style={{
                fontSize: el.style?.fontSize || '20px',
                fontFamily: el.style?.fontFamily || 'Inter',
                color: el.style?.color || '#333',
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid var(--accent)',
                borderRadius: 4,
              }}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={() => {
                updateElement(el.id, { content: editText });
                setEditingId(null);
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') { setEditingId(null); }
                e.stopPropagation();
              }}
            />
          ) : (
            <ElementRenderer element={el} theme={theme} />
          )}
          {renderHandles(el)}
        </div>
      ))}

      {/* Drawing preview (freeform polyline) */}
      {isDrawing && drawingPoints.length > 1 && (
        <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
          <polyline
            points={drawingPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={drawColor}
            strokeWidth={drawStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Marquee selection rectangle */}
      {marquee && marquee.w > 2 && marquee.h > 2 && (
        <div className="marquee-selection" style={{
          position: 'absolute',
          left: marquee.x,
          top: marquee.y,
          width: marquee.w,
          height: marquee.h,
          border: '1px dashed var(--accent)',
          background: 'rgba(13,153,255,0.1)',
          zIndex: 300,
          pointerEvents: 'none',
        }} />
      )}
    </>
  );

  const canvasClass = `slide-canvas relative ${formatPainterStyle ? 'cursor-copy' : toolMode === 'draw' ? 'cursor-crosshair' : toolMode === 'pan' ? 'cursor-grab' : ''}`;

  return (
    <div style={{ position: 'relative' }}>
      {/* Rulers */}
      {showRuler && (
        <>
          <div className="ruler-h" style={{ width: CANVAS_W * zoom, height: 18, marginLeft: showRuler ? 18 : 0 }}>
            {Array.from({ length: Math.ceil(CANVAS_W / 50) + 1 }, (_, i) => (
              <span key={i} className="absolute text-[8px] select-none" style={{ left: i * 50 * zoom, color: 'var(--text-muted)' }}>
                {i * 50}
              </span>
            ))}
          </div>
          <div className="flex">
            <div className="ruler-v" style={{ width: 18, height: CANVAS_H * zoom }}>
              {Array.from({ length: Math.ceil(CANVAS_H / 50) + 1 }, (_, i) => (
                <span key={i} className="absolute text-[8px] select-none" style={{ top: i * 50 * zoom, color: 'var(--text-muted)', writingMode: 'vertical-lr' }}>
                  {i * 50}
                </span>
              ))}
            </div>
            <div ref={canvasRef} className={canvasClass}
              style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transformOrigin: 'top left', ...bgStyle }}
              onClick={onCanvasClick} onMouseDown={onCanvasMouseDown}>
              {renderCanvasContent()}
            </div>
          </div>
        </>
      )}

      {/* No ruler layout */}
      {!showRuler && (
        <div ref={canvasRef} className={canvasClass}
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transformOrigin: 'center center', ...bgStyle }}
          onClick={onCanvasClick} onMouseDown={onCanvasMouseDown}>
          {renderCanvasContent()}
        </div>
      )}

      {/* ─── Drawing config toolbar (shown when in draw mode) ─── */}
      {toolMode === 'draw' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-lg z-50"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <span className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Draw</span>
          <label className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-primary)' }}>
            Color
            <input type="color" value={drawColor}
              onChange={e => setDrawColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 cursor-pointer" />
          </label>
          <label className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-primary)' }}>
            Width
            <select value={drawStrokeWidth} onChange={e => setDrawStrokeWidth(Number(e.target.value))}
              className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              {[1, 2, 3, 4, 6, 8, 12].map(w => (
                <option key={w} value={w}>{w}px</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Live Code Editor Modal */}
      {codeEditorElId && (() => {
        const codeEl = slide.elements.find(x => x.id === codeEditorElId);
        return codeEl ? (
          <LiveCodeEditor
            open={codeEditorOpen}
            onClose={() => { setCodeEditorOpen(false); setCodeEditorElId(null); }}
            code={codeEl.content || ''}
            language={codeEl.language || 'javascript'}
            executable={codeEl.executable}
            onSave={(code, lang) => updateElement(codeEl.id, { content: code, language: lang })}
          />
        ) : null;
      })()}
    </div>
  );
}
