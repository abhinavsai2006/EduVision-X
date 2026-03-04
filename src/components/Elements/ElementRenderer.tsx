'use client';
/* ═══════════════════════════════════════════════════════
   ElementRenderer — Renders any SlideElement by type
   with entrance animations via Framer Motion
   ═══════════════════════════════════════════════════════ */
import React, { useState, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { SlideElement, Theme, AnimationType } from '@/types/slide';
import dynamic from 'next/dynamic';

/* Lazy-load heavy components */
const D3Chart = dynamic(() => import('./D3Chart'), { ssr: false });
const MonacoCode = dynamic(() => import('./MonacoCode'), { ssr: false });
const KaTeXMath = dynamic(() => import('./KaTeXMath'), { ssr: false });
const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), { ssr: false });
const ThreeD = dynamic(() => import('./ThreeD'), { ssr: false });
const WordCloud = dynamic(() => import('./WordCloud'), { ssr: false });
const FunctionPlot = dynamic(() => import('./FunctionPlot'), { ssr: false });
const QRCode = dynamic(() => import('./QRCode'), { ssr: false });

/* ── Animation variant map ─── */
function getAnimVariants(anim: string | null): Variants {
  switch (anim) {
    case 'fadeIn':
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    case 'slideInLeft':
      return { hidden: { x: -80, opacity: 0 }, visible: { x: 0, opacity: 1 } };
    case 'slideInRight':
      return { hidden: { x: 80, opacity: 0 }, visible: { x: 0, opacity: 1 } };
    case 'slideInUp':
      return { hidden: { y: 80, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    case 'slideInDown':
      return { hidden: { y: -80, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    case 'scaleIn':
      return { hidden: { scale: 0.5, opacity: 0 }, visible: { scale: 1, opacity: 1 } };
    case 'rotateIn':
      return { hidden: { rotate: -90, opacity: 0 }, visible: { rotate: 0, opacity: 1 } };
    case 'bounceIn':
      return { hidden: { scale: 0.3, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } } };
    case 'blurIn':
      return { hidden: { filter: 'blur(12px)', opacity: 0 }, visible: { filter: 'blur(0px)', opacity: 1 } };
    case 'flipIn':
      return { hidden: { rotateY: 90, opacity: 0 }, visible: { rotateY: 0, opacity: 1 } };
    case 'typewriter':
      return { hidden: { clipPath: 'inset(0 100% 0 0)' }, visible: { clipPath: 'inset(0 0% 0 0)' } };
    case 'pulse':
      return { hidden: { scale: 1 }, visible: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } };
    case 'float':
      return { hidden: { y: 0 }, visible: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } } };
    case 'shake':
      return { hidden: { x: 0 }, visible: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.6 } } };
    case 'swing':
      return { hidden: { rotate: 0, transformOrigin: 'top center' }, visible: { rotate: [0, 15, -10, 5, -5, 0], transition: { duration: 0.8 } } };
    case 'rubberBand':
      return { hidden: { scaleX: 1, scaleY: 1 }, visible: { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1], scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1], transition: { duration: 0.8 } } };
    case 'jello':
      return { hidden: { skewX: 0, skewY: 0 }, visible: { skewX: [0, -12, 6, -4, 2, 0], skewY: [0, -12, 6, -4, 2, 0], transition: { duration: 0.9 } } };
    default:
      return { hidden: {}, visible: {} };
  }
}

interface Props {
  element: SlideElement;
  theme: Theme;
  presentMode?: boolean;
}

export default function ElementRenderer({ element: el, theme, presentMode }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(el.votes || []);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState(el.duration || 300);

  const s = el.style || {};

  const hasAnim = el.animation && el.animation !== 'none';
  const variants = hasAnim ? getAnimVariants(el.animation) : undefined;

  const content = (() => {
    switch (el.type) {
    /* ── Heading ─── */
    case 'heading': {
      const headingStyle: React.CSSProperties = {
        fontSize: s.fontSize || '36px', fontWeight: s.fontWeight || 'bold',
        color: s.gradientText ? 'transparent' : (s.color || theme.heading),
        fontFamily: s.fontFamily || 'Inter',
        textAlign: (s.textAlign as React.CSSProperties['textAlign']) || 'left',
        textShadow: s.textShadow || undefined,
        WebkitTextStroke: s.textOutline || undefined,
        letterSpacing: s.letterSpacing || undefined,
        textDecoration: s.textDecoration || undefined,
        lineHeight: s.lineHeight || undefined,
        ...(s.gradientText ? { background: s.gradientText, WebkitBackgroundClip: 'text', backgroundClip: 'text' } : {}),
      };
      return (
        <div className="w-full h-full flex items-center" style={headingStyle}>
          {el.content || 'Heading'}
        </div>
      );
    }

    /* ── Text ─── */
    case 'text': {
      const textStyle: React.CSSProperties = {
        fontSize: s.fontSize || '20px', color: s.gradientText ? 'transparent' : (s.color || theme.text),
        fontFamily: s.fontFamily || 'Inter', lineHeight: s.lineHeight || '1.6',
        textAlign: (s.textAlign as React.CSSProperties['textAlign']) || 'left',
        fontWeight: s.fontWeight, fontStyle: s.fontStyle,
        textDecoration: s.textDecoration || undefined,
        textShadow: s.textShadow || undefined,
        WebkitTextStroke: s.textOutline || undefined,
        letterSpacing: s.letterSpacing || undefined,
        ...(s.gradientText ? { background: s.gradientText, WebkitBackgroundClip: 'text', backgroundClip: 'text' } : {}),
      };
      return (
        <div className="w-full h-full overflow-hidden" style={textStyle}
          dangerouslySetInnerHTML={{ __html: (el.content || 'Text').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/_(.+?)_/g, '<em>$1</em>').replace(/~~(.+?)~~/g, '<del>$1</del>') }} />
      );
    }

    /* ── List ─── */
    case 'list': {
      const Tag = el.listType === 'numbered' ? 'ol' : 'ul';
      const bulletIcons: Record<string, string> = { check: '✓', arrow: '→', star: '★', dash: '–', diamond: '◆' };
      const customBullet = el.bulletStyle && bulletIcons[el.bulletStyle];
      return (
        <Tag className="w-full h-full overflow-hidden px-4" style={{
          fontSize: s.fontSize || '18px', color: s.color || theme.text,
          listStyleType: customBullet ? 'none' : (el.listType === 'numbered' ? 'decimal' : 'disc'),
        }}>
          {(el.items || []).map((item, i) => (
            <li key={i} style={{ paddingLeft: el.indentLevel ? `${el.indentLevel * 20}px` : undefined }}>
              {customBullet && <span className="mr-2">{customBullet}</span>}{item}
            </li>
          ))}
        </Tag>
      );
    }

    /* ── Image ─── */
    case 'image': {
      const imgFilter = [
        s.brightness && s.brightness !== '100' ? `brightness(${s.brightness}%)` : '',
        s.contrast && s.contrast !== '100' ? `contrast(${s.contrast}%)` : '',
        s.saturate && s.saturate !== '100' ? `saturate(${s.saturate}%)` : '',
        s.blurPx && s.blurPx !== '0' ? `blur(${s.blurPx}px)` : '',
        s.grayscale && s.grayscale !== '0' ? `grayscale(${s.grayscale}%)` : '',
        s.sepia && s.sepia !== '0' ? `sepia(${s.sepia}%)` : '',
        s.hueRotate && s.hueRotate !== '0' ? `hue-rotate(${s.hueRotate}deg)` : '',
      ].filter(Boolean).join(' ') || undefined;
      return el.src ? (
        <img src={el.src} alt={el.alt || ''} className="w-full h-full"
          style={{ objectFit: (el.objectFit as React.CSSProperties['objectFit']) || 'contain', filter: imgFilter }} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs"
          style={{ background: '#eee', color: '#999' }}>
          🖼 No image
        </div>
      );
    }

    /* ── Shape ─── */
    case 'shape':
      return (
        <div className="w-full h-full relative">
          <svg width="100%" height="100%" viewBox={`0 0 ${el.width} ${el.height}`}>
            {(() => {
              const fill = s.fill || '#6366f1';
              const stroke = s.stroke || '#4f46e5';
              const sw = (s.strokeWidth as number) || 2;
              const w = el.width;
              const h = el.height;

              if (el.shape === 'circle' || el.shape === 'ellipse') {
                return <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 2} ry={h / 2 - 2} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'triangle') {
                return <polygon points={`${w / 2},2 2,${h - 2} ${w - 2},${h - 2}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'star') {
                return <polygon points={starPoints(w / 2, h / 2, Math.min(w, h) / 2 - 2, 5)} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'diamond') {
                return <polygon points={`${w / 2},2 ${w - 2},${h / 2} ${w / 2},${h - 2} 2,${h / 2}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'pentagon') {
                return <polygon points={regularPolygonPoints(w / 2, h / 2, Math.min(w, h) / 2 - 2, 5)} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'hexagon') {
                return <polygon points={regularPolygonPoints(w / 2, h / 2, Math.min(w, h) / 2 - 2, 6)} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'trapezoid') {
                return <polygon points={`14,2 ${w - 14},2 ${w - 2},${h - 2} 2,${h - 2}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'parallelogram') {
                return <polygon points={`14,2 ${w - 2},2 ${w - 14},${h - 2} 2,${h - 2}`} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'arrow') {
                return <path d={`M2 ${h * 0.3} H${w * 0.62} V2 L${w - 2} ${h / 2} L${w * 0.62} ${h - 2} V${h * 0.7} H2 Z`} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }
              if (el.shape === 'heart') {
                return <path d={heartPath(w, h)} fill={fill} stroke={stroke} strokeWidth={sw} />;
              }

              return <rect x={2} y={2} width={w - 4} height={h - 4} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />;
            })()}
          </svg>
          {el.shapeText && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-2"
              style={{ color: s.color || '#fff', fontSize: s.fontSize || '14px', fontFamily: s.fontFamily || 'Inter', fontWeight: s.fontWeight || 'normal' }}>
              {el.shapeText}
            </div>
          )}
        </div>
      );

    /* ── Code ─── */
    case 'code':
      return <MonacoCode element={el} presentMode={presentMode} />;

    /* ── Chart ─── */
    case 'chart':
      return <D3Chart element={el} />;

    /* ── Math (KaTeX) ─── */
    case 'math':
      return <KaTeXMath latex={el.content || 'E = mc^2'} fontSize={s.fontSize || '28px'} color={s.color || theme.text} />;

    /* ── Quiz ─── */
    case 'quiz':
      return (
        <div className="w-full h-full p-3 flex flex-col gap-2 overflow-auto"
          style={{ background: '#f8f9fa', borderRadius: 8, border: '2px solid #6366f1' }}>
          <div className="font-bold text-sm" style={{ color: '#1a1a2e' }}>
            {el.question}
          </div>
          {(el.options || []).map((opt, i) => (
            <button key={i}
              className="text-left text-xs px-3 py-1.5 rounded transition-colors"
              style={{
                background: selectedOption === i
                  ? (i === el.correct ? '#00b894' : '#e74c3c')
                  : '#fff',
                color: selectedOption === i ? '#fff' : '#333',
                border: '1px solid #dee2e6',
              }}
              onClick={() => setSelectedOption(i)}
            >
              {String.fromCharCode(65 + i)}) {opt}
            </button>
          ))}
        </div>
      );

    /* ── Video ─── */
    case 'video':
      if (!el.src) {
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#1a1a2e', color: '#666' }}>
            ▶ No video
          </div>
        );
      }
      if (isEmbeddableVideo(el.src)) {
        return (
          <iframe
            src={toVideoEmbedUrl(el.src)}
            className="w-full h-full"
            style={{ border: 'none', background: '#000' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={el.content || 'Embedded video'}
          />
        );
      }
      return (
        <video src={el.src} controls className="w-full h-full"
          style={{ background: '#000' }}
          loop={!!(s.loop)} muted={!!(s.muted)} autoPlay={el.autoplay}
          poster={(s.poster as string) || undefined} playsInline preload="metadata" />
      );

    /* ── Note ─── */
    case 'note':
      return (
        <div className="w-full h-full p-3 rounded-md overflow-auto" style={{
          background: s.background || '#ffeaa7', color: s.color || '#2d3436',
          fontSize: s.fontSize || '14px',
        }}>
          {el.content}
        </div>
      );

    /* ── Divider ─── */
    case 'divider':
      return (
        <div className="w-full h-full flex items-center">
          <div className="w-full" style={{ height: 2, background: s.background || '#dfe6e9' }} />
        </div>
      );

    /* ── Table ─── */
    case 'table': {
      const data = (el.data as string[][]) || [];
      return (
        <div className="w-full h-full overflow-auto">
          <table className="w-full border-collapse" style={{ fontSize: s.fontSize || '13px' }}>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    ri === 0 ? (
                      <th key={ci} className="px-2 py-1 text-left" style={{
                        background: s.headerBg || '#6366f1', color: s.headerColor || '#fff',
                        border: `1px solid ${s.borderColor || '#dee2e6'}`,
                      }}>{cell}</th>
                    ) : (
                      <td key={ci} className="px-2 py-1" style={{
                        color: s.cellColor || '#333', border: `1px solid ${s.borderColor || '#dee2e6'}`,
                        background: ri % 2 === 0 ? '#f8f9fa' : '#fff',
                      }}>{cell}</td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    /* ── Connector ─── */
    case 'connector':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${el.width} ${el.height}`}>
          <defs>
            <marker id={`arrow-${el.id}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={s.stroke || '#6366f1'} />
            </marker>
          </defs>
          {el.connectorType === 'freeform' && el.content ? (
            <path d={el.content}
              fill="none"
              stroke={s.stroke || '#6366f1'}
              strokeWidth={(s.strokeWidth as number) || (el.lineWidth || 2)}
              strokeLinecap="round"
              strokeLinejoin="round" />
          ) : (
            <line x1={0} y1={el.height / 2} x2={el.width} y2={el.height / 2}
              stroke={s.stroke || '#6366f1'} strokeWidth={el.lineWidth || 2}
              strokeDasharray={el.lineStyle === 'dashed' ? '8,4' : el.lineStyle === 'dotted' ? '2,4' : undefined}
              markerEnd={el.endCap === 'arrow' ? `url(#arrow-${el.id})` : undefined} />
          )}
        </svg>
      );

    /* ── Poll ─── */
    case 'poll': {
      const totalV = votes.reduce((a, b) => a + b, 0) || 1;
      return (
        <div className="w-full h-full p-3 flex flex-col gap-1.5 overflow-auto"
          style={{ background: '#f8f9fa', borderRadius: 8 }}>
          <div className="font-bold text-sm" style={{ color: '#1a1a2e' }}>{el.question}</div>
          {(el.options || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer"
              onClick={() => { const v = [...votes]; v[i] = (v[i] || 0) + 1; setVotes(v); }}>
              <div className="flex-1 rounded overflow-hidden" style={{ background: '#e9ecef', height: 22 }}>
                <div className="h-full rounded text-[10px] px-2 flex items-center text-white"
                  style={{
                    width: `${(votes[i] || 0) / totalV * 100}%`,
                    background: ['#6366f1', '#00cec9', '#fdcb6e', '#e17055', '#00b894'][i % 5],
                    transition: 'width .3s',
                  }}>
                  {opt}
                </div>
              </div>
              <span className="text-[10px]" style={{ color: '#666' }}>{votes[i] || 0}</span>
            </div>
          ))}
        </div>
      );
    }

    /* ── Flashcard ─── */
    case 'flashcard':
      return (
        <div className="w-full h-full cursor-pointer rounded-lg flex items-center justify-center p-4 text-center transition-all duration-300"
          style={{
            background: flipped ? (s.backBg || '#00b894') : (s.frontBg || '#6366f1'),
            color: flipped ? (s.backColor || '#fff') : (s.frontColor || '#fff'),
            fontSize: s.fontSize || '20px',
          }}
          onClick={() => setFlipped(f => !f)}>
          {flipped ? el.back : el.front}
        </div>
      );

    /* ── Timer ─── */
    case 'timer': {
      const mins = Math.floor(timerLeft / 60);
      const secs = timerLeft % 60;
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 rounded-lg"
          style={{ background: '#1a1a2e' }}>
          <div style={{ fontSize: s.fontSize || '48px', color: s.color || '#e17055', fontFamily: 'monospace' }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="flex gap-2">
            <button className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#00b894', color: '#fff' }}
              onClick={() => {
                if (timerRunning) return;
                setTimerRunning(true);
                const iv = setInterval(() => {
                  setTimerLeft(t => { if (t <= 0) { clearInterval(iv); setTimerRunning(false); return 0; } return t - 1; });
                }, 1000);
              }}>Start</button>
            <button className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#e74c3c', color: '#fff' }}
              onClick={() => { setTimerRunning(false); setTimerLeft(el.duration || 300); }}>Reset</button>
          </div>
        </div>
      );
    }

    /* ── Audio ─── */
    case 'audio':
      return el.src ? (
        <audio src={el.src} controls className="w-full" preload="metadata" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: '#2d3436', color: '#999', borderRadius: 8 }}>
          🎵 No audio
        </div>
      );

    /* ── Callout ─── */
    case 'callout': {
      const colors: Record<string, { bg: string; border: string; icon: string }> = {
        info: { bg: '#e3f2fd', border: '#2196f3', icon: 'ℹ️' },
        warning: { bg: '#fff3e0', border: '#ff9800', icon: '⚠️' },
        success: { bg: '#e8f5e9', border: '#4caf50', icon: '✅' },
        error: { bg: '#fce4ec', border: '#e91e63', icon: '❌' },
        tip: { bg: '#f3e5f5', border: '#9c27b0', icon: '💡' },
      };
      const ct = colors[el.calloutType || 'info'] || colors.info;
      return (
        <div className="w-full h-full flex items-start gap-2 p-3 rounded-md"
          style={{ background: ct.bg, borderLeft: `4px solid ${ct.border}`, fontSize: s.fontSize || '14px', color: '#333' }}>
          <span>{ct.icon}</span>
          <span>{el.content}</span>
        </div>
      );
    }

    /* ── Progress ─── */
    case 'progress':
      return (
        <div className="w-full h-full flex flex-col justify-center gap-1">
          {el.label && <span className="text-[11px]" style={{ color: '#666' }}>{el.label}</span>}
          <div className="w-full rounded-full overflow-hidden" style={{ background: s.bgColor || '#e9ecef', height: 16 }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${((el.value || 0) / (el.max || 100)) * 100}%`,
              background: s.barColor || '#6366f1',
            }} />
          </div>
          <span className="text-[10px]" style={{ color: '#999' }}>
            {el.value || 0}/{el.max || 100}
          </span>
        </div>
      );

    /* ── Icon ─── */
    case 'icon':
      return (
        <div className="w-full h-full flex items-center justify-center"
          style={{ fontSize: s.fontSize || '48px', color: s.color || '#6366f1' }}>
          {el.icon || '⭐'}
        </div>
      );

    /* ── Mermaid Diagram ─── */
    case 'mermaid':
      return <MermaidDiagram code={el.content || 'graph TD\n  A-->B'} />;

    /* ── Timeline ─── */
    case 'timeline': {
      const entries = el.entries || [];
      return (
        <div className="w-full h-full flex items-center px-4 overflow-x-auto">
          {entries.map((ent, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center shrink-0">
                <div className="w-3 h-3 rounded-full" style={{ background: '#6366f1' }} />
                <span className="text-[10px] font-bold mt-1" style={{ color: '#6366f1' }}>{ent.date}</span>
                <span className="text-[9px]" style={{ color: '#666' }}>{ent.text}</span>
              </div>
              {i < entries.length - 1 && (
                <div className="flex-1 min-w-[30px] h-[2px] mx-2" style={{ background: '#6366f1' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    /* ── 3D Visualization (Three.js) ─── */
    case '3d':
      return <ThreeD shape={(el.shape3d as any) || 'cube'} color={el.color3d || '#6366f1'} wireframe={el.wireframe3d || false} />;

    /* ── Embed ─── */
    case 'embed':
      return (
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: el.html || '' }} />
      );

    /* ── Word Cloud ─── */
    case 'wordcloud':
      return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs opacity-40">Loading word cloud…</div>}>
          <WordCloud words={el.words || []} width={el.width} height={el.height} />
        </Suspense>
      );

    /* ── Function Plot ─── */
    case 'functionplot':
      return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs opacity-40">Loading plot…</div>}>
          <FunctionPlot fn={el.fn || 'Math.sin(x)'} xMin={el.xMin ?? -10} xMax={el.xMax ?? 10} width={el.width} height={el.height} strokeColor={s.stroke || '#6366f1'} />
        </Suspense>
      );

    /* ── QR Code ─── */
    case 'qrcode':
      return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs opacity-40">Loading QR…</div>}>
          <QRCode text={el.qrText || 'https://example.com'} size={Math.min(el.width, el.height)} />
        </Suspense>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#999' }}>
          [{el.type}]
        </div>
      );
    }
  })();

  /* Flip transform */
  const flipTransform = (el.flipH || el.flipV) ? `scaleX(${el.flipH ? -1 : 1}) scaleY(${el.flipV ? -1 : 1})` : undefined;
  const glowFilter = s.glow ? `drop-shadow(0 0 ${s.glow})` : undefined;

  /* Wrap with animation if present mode & animation set */
  if (hasAnim && presentMode && variants) {
    return (
      <motion.div
        className="w-full h-full"
        style={{ boxShadow: (s.boxShadow as string) || undefined, borderRadius: s.borderRadius || undefined, border: (s.border as string) || undefined, transform: flipTransform, filter: glowFilter }}
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    );
  }

  /* Apply shadow/border/flip/glow if set */
  if (s.boxShadow || s.borderRadius || s.border || flipTransform || glowFilter) {
    return (
      <div className="w-full h-full" style={{ boxShadow: (s.boxShadow as string) || undefined, borderRadius: s.borderRadius || undefined, border: (s.border as string) || undefined, overflow: 'hidden', transform: flipTransform, filter: glowFilter }}>
        {content}
      </div>
    );
  }

  return content;
}

/* ── Star points helper ─── */
function starPoints(cx: number, cy: number, r: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = (i % 2 === 0 ? r : r * 0.45);
    const angle = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

function regularPolygonPoints(cx: number, cy: number, r: number, sides: number): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

function heartPath(w: number, h: number): string {
  const x = w / 2;
  const y = h * 0.25;
  return `M ${x} ${h - 4} C ${x - w * 0.45} ${h * 0.62}, 4 ${h * 0.38}, ${x - w * 0.24} ${y} C ${x - w * 0.1} ${h * 0.02}, ${x + w * 0.1} ${h * 0.02}, ${x + w * 0.24} ${y} C ${w - 4} ${h * 0.38}, ${x + w * 0.45} ${h * 0.62}, ${x} ${h - 4} Z`;
}

function isEmbeddableVideo(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toVideoEmbedUrl(url: string): string {
  const yt1 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/);
  const yt2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const yt3 = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  const ytId = yt1?.[1] || yt2?.[1] || yt3?.[1] || ytEmbed?.[1];
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;

  const vm = url.match(/vimeo\.com\/(\d+)/) || url.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vm?.[1]) return `https://player.vimeo.com/video/${vm[1]}`;

  return url;
}
