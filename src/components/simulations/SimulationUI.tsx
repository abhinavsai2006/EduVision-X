'use client';
/* ═══════════════════════════════════════════════════════════════════
   Premium Simulation UI Components — Professional Grade
   Reusable building blocks for all simulation panels.
   ═══════════════════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Shared style tokens ── */
const glassBackground = 'rgba(24,24,30,0.78)';
const glassBorder = 'rgba(124,58,237,0.12)';
const panelRadius = 16;

/* ═══════════════════════════════════════════════════════
   SimPanel — Premium panel container with glass effect
   ═══════════════════════════════════════════════════════ */
interface SimPanelProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  glass?: boolean;
  accent?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
  noPad?: boolean;
}

export function SimPanel({
  title, subtitle, icon, children, glass, accent, collapsible, defaultOpen = true,
  actions, style, noPad,
}: SimPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: glass ? glassBackground : 'var(--bg-surface)',
      border: `1px solid ${accent ? 'rgba(124,58,237,0.3)' : glassBorder}`,
      borderRadius: panelRadius,
      backdropFilter: glass ? 'blur(20px)' : undefined, WebkitBackdropFilter: glass ? 'blur(20px)' : undefined,
      overflow: 'hidden',
      boxShadow: accent ? '0 0 24px rgba(124,58,237,0.08)' : 'var(--shadow-xs)',
      ...style,
    }}>
      {title && (
        <div
          style={{
            padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: open ? `1px solid ${glassBorder}` : 'none',
            cursor: collapsible ? 'pointer' : undefined,
            userSelect: collapsible ? 'none' : undefined,
          }}
          onClick={collapsible ? () => setOpen(!open) : undefined}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
              {subtitle && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {actions}
            {collapsible && (
              <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }} style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</motion.span>
            )}
          </div>
        </div>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: noPad ? 0 : 16 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimSlider — Labeled range slider with value display
   ═══════════════════════════════════════════════════════ */
interface SimSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export function SimSlider({ label, value, min, max, step = 1, unit = '', onChange, disabled }: SimSliderProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: 'var(--accent)',
          background: 'rgba(124,58,237,0.12)', padding: '1px 8px', borderRadius: 6,
        }}>{typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ width: '100%', accentColor: 'var(--accent)' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimSelect — Premium dropdown select
   ═══════════════════════════════════════════════════════ */
interface SimSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function SimSelect({ label, value, options, onChange, disabled }: SimSelectProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%', padding: '7px 10px', fontSize: 11, fontWeight: 600,
          background: 'var(--bg-input)', color: 'var(--text-primary)',
          border: '1px solid var(--border)', borderRadius: 8, outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimInput — Premium text / number input
   ═══════════════════════════════════════════════════════ */
interface SimInputProps {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  width?: string;
  disabled?: boolean;
}

export function SimInput({ label, value, onChange, placeholder, type = 'text', width, disabled }: SimInputProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: width || '100%', padding: '7px 10px', fontSize: 11, fontWeight: 600,
          background: 'var(--bg-input)', color: 'var(--text-primary)',
          border: '1px solid var(--border)', borderRadius: 8, outline: 'none',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimMetric — Real-time metric display card
   ═══════════════════════════════════════════════════════ */
interface SimMetricProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  small?: boolean;
}

export function SimMetric({ label, value, icon, color, trend, small }: SimMetricProps) {
  return (
    <div style={{
      background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
      borderRadius: 10, padding: small ? '8px 10px' : '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 4,
      minWidth: small ? 80 : 100,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: small ? 16 : 20, fontWeight: 800, color: color || 'var(--text-primary)',
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</span>
        {trend && (
          <span style={{ fontSize: 10, color: trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : 'var(--text-muted)' }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimMetricRow — Row of metrics
   ═══════════════════════════════════════════════════════ */
export function SimMetricRow({ children, cols }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols || 'auto-fill'}, minmax(${cols ? '0' : '120px'}, 1fr))`,
      gap: 8, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimLogViewer — Professional execution log
   ═══════════════════════════════════════════════════════ */
interface SimLogViewerProps {
  logs: string[];
  maxHeight?: number;
  title?: string;
}

export function SimLogViewer({ logs, maxHeight = 180, title }: SimLogViewerProps) {
  return (
    <div style={{
      background: '#0a0a0f', border: '1px solid rgba(124,58,237,0.15)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{
        padding: '8px 12px', borderBottom: '1px solid rgba(124,58,237,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title || 'Execution Log'}
        </span>
      </div>
      <div style={{ maxHeight, overflow: 'auto', padding: '8px 12px' }}>
        {logs.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>No log entries yet</div>
        ) : logs.map((line, idx) => (
          <div key={idx} style={{
            fontSize: 11, fontFamily: 'var(--font-mono)', color: idx === 0 ? '#86efac' : 'var(--text-muted)',
            padding: '3px 0', borderBottom: idx < logs.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            display: 'flex', gap: 8,
          }}>
            <span style={{ color: 'rgba(124,58,237,0.5)', fontSize: 10, minWidth: 20, textAlign: 'right' }}>{logs.length - idx}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimProgressBar — Animated progress bar
   ═══════════════════════════════════════════════════════ */
interface SimProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  height?: number;
  showValue?: boolean;
}

export function SimProgressBar({ value, max = 100, label, color, height = 8, showValue = true }: SimProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {label && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</span>}
          {showValue && <span style={{ fontSize: 10, fontWeight: 700, color: color || 'var(--accent)' }}>{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div style={{ height, borderRadius: 999, background: 'var(--bg-hover)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: 999,
            background: color || 'linear-gradient(90deg, var(--accent), #a78bfa)',
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimButton — Premium action button
   ═══════════════════════════════════════════════════════ */
interface SimButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  disabled?: boolean;
  icon?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export function SimButton({ children, onClick, variant = 'primary', disabled, icon, size = 'sm', fullWidth }: SimButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, var(--accent), #6d28d9)', color: '#fff', border: 'none', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' },
    secondary: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' },
    danger: { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    success: { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' },
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: size === 'sm' ? '6px 14px' : '8px 18px',
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 700,
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        width: fullWidth ? '100%' : undefined,
        justifyContent: fullWidth ? 'center' : undefined,
        letterSpacing: '0.01em',
        transition: 'all 0.15s ease',
      }}
    >
      {icon && <span style={{ fontSize: size === 'sm' ? 12 : 14 }}>{icon}</span>}
      {children}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   SimBadge — Status / difficulty badge
   ═══════════════════════════════════════════════════════ */
interface SimBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';
}

export function SimBadge({ text, variant = 'neutral' }: SimBadgeProps) {
  const colors: Record<string, { bg: string; fg: string; border: string }> = {
    success: { bg: 'rgba(34,197,94,0.12)', fg: '#22c55e', border: 'rgba(34,197,94,0.3)' },
    warning: { bg: 'rgba(234,179,8,0.12)', fg: '#eab308', border: 'rgba(234,179,8,0.3)' },
    danger: { bg: 'rgba(239,68,68,0.12)', fg: '#ef4444', border: 'rgba(239,68,68,0.3)' },
    info: { bg: 'rgba(56,189,248,0.12)', fg: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
    accent: { bg: 'rgba(124,58,237,0.12)', fg: '#a78bfa', border: 'rgba(124,58,237,0.3)' },
    neutral: { bg: 'var(--bg-tertiary)', fg: 'var(--text-muted)', border: 'var(--border)' },
  };
  const c = colors[variant] || colors.neutral;

  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
      background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{text}</span>
  );
}

/* ═══════════════════════════════════════════════════════
   SimTabGroup — Tab switching
   ═══════════════════════════════════════════════════════ */
interface SimTabGroupProps {
  tabs: { id: string; label: string; icon?: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function SimTabGroup({ tabs, active, onChange }: SimTabGroupProps) {
  return (
    <div style={{
      display: 'flex', gap: 2, background: 'var(--bg-tertiary)',
      borderRadius: 10, padding: 3, marginBottom: 12,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '6px 12px', fontSize: 11, fontWeight: 600,
            border: 'none', borderRadius: 8, cursor: 'pointer',
            background: active === tab.id ? 'var(--accent)' : 'transparent',
            color: active === tab.id ? '#fff' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimStepIndicator — Step progress tracker
   ═══════════════════════════════════════════════════════ */
interface SimStepIndicatorProps {
  steps: string[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
}

export function SimStepIndicator({ steps, current, orientation = 'horizontal' }: SimStepIndicatorProps) {
  if (orientation === 'vertical') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, idx) => (
          <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: idx < steps.length - 1 ? 8 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                background: idx < current ? '#22c55e' : idx === current ? 'var(--accent)' : 'var(--bg-hover)',
                color: idx <= current ? '#fff' : 'var(--text-muted)',
                border: `2px solid ${idx === current ? 'var(--accent)' : idx < current ? '#22c55e' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}>
                {idx < current ? '✓' : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div style={{ width: 2, height: 14, background: idx < current ? '#22c55e' : 'var(--border)', transition: 'all 0.2s' }} />
              )}
            </div>
            <div style={{
              fontSize: 11, color: idx <= current ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: idx === current ? 700 : 400, paddingTop: 2,
            }}>{step}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12 }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 40 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700,
              background: idx < current ? '#22c55e' : idx === current ? 'var(--accent)' : 'var(--bg-hover)',
              color: idx <= current ? '#fff' : 'var(--text-muted)',
              border: `2px solid ${idx === current ? 'var(--accent)' : idx < current ? '#22c55e' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}>
              {idx < current ? '✓' : idx + 1}
            </div>
            <span style={{
              fontSize: 9, color: idx <= current ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: idx === current ? 700 : 400, textAlign: 'center', maxWidth: 70,
            }}>{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: idx < current ? '#22c55e' : 'var(--border)', minWidth: 16, marginBottom: 18, transition: 'all 0.2s' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimTheory — Theory / documentation panel
   ═══════════════════════════════════════════════════════ */
interface SimTheoryProps {
  title?: string;
  complexity?: { best?: string; average?: string; worst?: string; space?: string };
  description?: string;
  keyPoints?: string[];
}

export function SimTheory({ title, complexity, description, keyPoints }: SimTheoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)',
      borderRadius: 10, overflow: 'hidden', marginBottom: 12,
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>📖</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{title || 'Theory & Complexity'}</span>
        </div>
        <motion.span animate={{ rotate: open ? 0 : -90 }} style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
              {description && <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.5 }}>{description}</p>}
              {complexity && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: keyPoints ? 8 : 0 }}>
                  {complexity.best && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Best: <span style={{ color: '#22c55e', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{complexity.best}</span></div>}
                  {complexity.average && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Average: <span style={{ color: '#eab308', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{complexity.average}</span></div>}
                  {complexity.worst && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Worst: <span style={{ color: '#ef4444', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{complexity.worst}</span></div>}
                  {complexity.space && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Space: <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{complexity.space}</span></div>}
                </div>
              )}
              {keyPoints && keyPoints.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {keyPoints.map((p, i) => (
                    <div key={i} style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimToolbar — Professional action toolbar
   ═══════════════════════════════════════════════════════ */
interface SimToolbarProps {
  children: React.ReactNode;
  status?: string;
  statusColor?: string;
}

export function SimToolbar({ children, status, statusColor }: SimToolbarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      padding: '10px 0', marginBottom: 8,
    }}>
      {children}
      {status && (
        <span style={{
          fontSize: 11, color: statusColor || 'var(--text-muted)',
          marginLeft: 'auto',
          fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: statusColor || 'var(--text-muted)',
          }} />
          {status}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimDataTable — Professional data table
   ═══════════════════════════════════════════════════════ */
interface SimDataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  highlightRow?: number;
  compact?: boolean;
}

export function SimDataTable({ headers, rows, highlightRow, compact }: SimDataTableProps) {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden',
      background: 'var(--bg-surface)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-tertiary)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: compact ? '6px 10px' : '8px 12px', fontSize: 10,
                fontWeight: 700, color: 'var(--text-muted)', textAlign: 'left',
                textTransform: 'uppercase', letterSpacing: '0.04em',
                borderBottom: '1px solid var(--border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{
              background: ri === highlightRow ? 'rgba(124,58,237,0.08)' : undefined,
              transition: 'background 0.15s',
            }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: compact ? '5px 10px' : '7px 12px', fontSize: 11,
                  color: 'var(--text-secondary)', fontWeight: 500,
                  borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimMiniChart — Simple SVG bar/line chart
   ═══════════════════════════════════════════════════════ */
interface SimMiniChartProps {
  data: number[];
  height?: number;
  color?: string;
  type?: 'bar' | 'line';
  labels?: string[];
}

export function SimMiniChart({ data, height = 120, color = 'var(--accent)', type = 'bar', labels }: SimMiniChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const w = 100;
  const h = height;
  const barW = Math.max(4, (w - (data.length - 1) * 2) / data.length);

  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {type === 'bar' ? (
          data.map((v, i) => {
            const barH = (v / max) * (h - 16);
            const x = i * (barW + 2);
            return (
              <rect
                key={i}
                x={x} y={h - 12 - barH}
                width={barW} height={barH}
                rx={2}
                fill={color}
                opacity={0.8}
              />
            );
          })
        ) : (
          <polyline
            points={data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - 12 - (v / max) * (h - 20)}`).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
        )}
      </svg>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {labels.map((l, i) => (
            <span key={i} style={{ fontSize: 9, color: 'var(--text-muted)' }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimGrid — Responsive grid layout
   ═══════════════════════════════════════════════════════ */
export function SimGrid({ children, cols = 2, gap = 12, style: s }: { children: React.ReactNode; cols?: number; gap?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap, ...s,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimSVGContainer — Styled SVG viewport
   ═══════════════════════════════════════════════════════ */
export function SimSVGContainer({ children, height = 280, viewBox, style: s }: {
  children: React.ReactNode; height?: number; viewBox?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(124,58,237,0.1)',
      borderRadius: 12, padding: 8, overflow: 'hidden', ...s,
    }}>
      <svg width="100%" height={height} viewBox={viewBox || `0 0 560 ${height}`}>
        {children}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimExportBar — Export controls bar
   ═══════════════════════════════════════════════════════ */
export function SimExportBar({ onExportPNGAction, onExportCSVAction, onExportJSONAction }: {
  onExportPNGAction?: () => void; onExportCSVAction?: () => void; onExportJSONAction?: () => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '8px 0',
      borderTop: '1px solid var(--border)', marginTop: 8,
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', marginRight: 4 }}>EXPORT</span>
      {onExportPNGAction && <SimButton variant="ghost" onClick={onExportPNGAction} icon="📷" size="sm">PNG</SimButton>}
      {onExportCSVAction && <SimButton variant="ghost" onClick={onExportCSVAction} icon="📊" size="sm">CSV</SimButton>}
      {onExportJSONAction && <SimButton variant="ghost" onClick={onExportJSONAction} icon="📋" size="sm">JSON</SimButton>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimStatusHeader — Top status bar in simulation area
   ═══════════════════════════════════════════════════════ */
interface SimStatusHeaderProps {
  simName: string;
  simIcon: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isRunning: boolean;
  isPaused: boolean;
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset?: () => void;
  extraControls?: React.ReactNode;
}

export function SimStatusHeader({
  simName, simIcon, description, difficulty,
  isRunning, isPaused, onRun, onPause, onStop, onReset, extraControls,
}: SimStatusHeaderProps) {
  const diffBadge = difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger';

  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)',
      background: 'linear-gradient(135deg, rgba(24,24,30,0.95), rgba(24,24,30,0.8))',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(139,92,246,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          {simIcon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{simName}</h3>
            <SimBadge text={difficulty} variant={diffBadge as any} />
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {extraControls}
        {!isRunning ? (
          <SimButton onClick={onRun} variant="primary" icon="▶" size="md">Run Simulation</SimButton>
        ) : (
          <>
            <SimButton onClick={onPause} variant={isPaused ? 'success' : 'secondary'} icon={isPaused ? '▶' : '⏸'} size="md">
              {isPaused ? 'Resume' : 'Pause'}
            </SimButton>
            <SimButton onClick={onStop} variant="danger" icon="⏹" size="md">Stop</SimButton>
          </>
        )}
        {onReset && <SimButton onClick={onReset} variant="ghost" icon="↺" size="md">Reset</SimButton>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SimConfigSidebar — Professional config sidebar
   ═══════════════════════════════════════════════════════ */
interface SimConfigSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  tags?: string[];
}

export function SimConfigSidebar({ children, isOpen, onToggle, tags }: SimConfigSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border)',
            flexShrink: 0, overflow: 'hidden',
          }}
        >
          <div style={{ width: 280, height: '100%', overflow: 'auto', padding: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>⚙️</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Configuration</span>
              </div>
              <button onClick={onToggle} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 10,
              }}>✕</button>
            </div>
            {children}
            {tags && tags.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Tags</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {tags.map(t => (
                    <span key={t} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
