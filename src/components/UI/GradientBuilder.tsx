'use client';
/* ═══════════════════════════════════════════════════════
   GradientBuilder — Visual gradient editor for slide backgrounds
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from 'react';
import { useSlideStore } from '@/store/useSlideStore';

interface GradientStop {
  color: string;
  position: number; // 0-100
}

const PRESETS = [
  { name: 'Sunset', stops: [{ color: '#ee5a24', position: 0 }, { color: '#f368e0', position: 100 }], angle: 135 },
  { name: 'Ocean', stops: [{ color: '#0984e3', position: 0 }, { color: '#00cec9', position: 100 }], angle: 135 },
  { name: 'Forest', stops: [{ color: '#00b894', position: 0 }, { color: '#006266', position: 100 }], angle: 135 },
  { name: 'Twilight', stops: [{ color: '#6366f1', position: 0 }, { color: '#fd79a8', position: 100 }], angle: 135 },
  { name: 'Dark', stops: [{ color: '#2d3436', position: 0 }, { color: '#636e72', position: 100 }], angle: 180 },
  { name: 'Aurora', stops: [{ color: '#00b894', position: 0 }, { color: '#6366f1', position: 50 }, { color: '#fd79a8', position: 100 }], angle: 135 },
  { name: 'Fire', stops: [{ color: '#fdcb6e', position: 0 }, { color: '#e17055', position: 50 }, { color: '#d63031', position: 100 }], angle: 180 },
  { name: 'Ice', stops: [{ color: '#dfe6e9', position: 0 }, { color: '#74b9ff', position: 50 }, { color: '#0984e3', position: 100 }], angle: 180 },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GradientBuilder({ open, onClose }: Props) {
  const setSlideBackground = useSlideStore(s => s.setSlideBackground);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#fd79a8', position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  const buildGradient = useCallback((s: GradientStop[], a: number, t: 'linear' | 'radial') => {
    const sorted = [...s].sort((a, b) => a.position - b.position);
    const stopStr = sorted.map(st => `${st.color} ${st.position}%`).join(', ');
    return t === 'linear'
      ? `linear-gradient(${a}deg, ${stopStr})`
      : `radial-gradient(circle, ${stopStr})`;
  }, []);

  const gradient = buildGradient(stops, angle, gradientType);

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops([...stops, { color: '#ffffff', position: 50 }]);
  };

  const removeStop = (idx: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== idx));
  };

  const updateStop = (idx: number, field: 'color' | 'position', value: string | number) => {
    const next = [...stops];
    if (field === 'color') next[idx].color = value as string;
    else next[idx].position = value as number;
    setStops(next);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setStops(preset.stops.map(s => ({ ...s })));
    setAngle(preset.angle);
    setGradientType('linear');
  };

  const apply = () => {
    setSlideBackground({ type: 'gradient', value: gradient });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="rounded-xl p-5 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Gradient Builder</h3>
          <button onClick={onClose} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* Preview */}
        <div
          className="w-full h-32 rounded-lg mb-4 border"
          style={{ background: gradient, borderColor: 'var(--border)' }}
        />

        {/* Type + Angle */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
            <select
              className="w-full text-xs p-1.5 rounded border"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              value={gradientType}
              onChange={e => setGradientType(e.target.value as 'linear' | 'radial')}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {gradientType === 'linear' && (
            <div className="flex-1">
              <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Angle: {angle}°</label>
              <input
                type="range" min="0" max="360" value={angle}
                onChange={e => setAngle(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Stops */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Color Stops</label>
            <button
              className="text-[10px] px-2 py-0.5 rounded"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              onClick={addStop}
            >
              + Add
            </button>
          </div>
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <input
                type="color" value={stop.color}
                onChange={e => updateStop(i, 'color', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none"
              />
              <input
                type="range" min="0" max="100" value={stop.position}
                onChange={e => updateStop(i, 'position', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-[10px] w-8 text-right" style={{ color: 'var(--text-muted)' }}>{stop.position}%</span>
              {stops.length > 2 && (
                <button className="text-[10px]" style={{ color: '#e74c3c' }} onClick={() => removeStop(i)}>×</button>
              )}
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.name}
                className="rounded-lg h-10 text-[9px] text-white font-medium transition-transform hover:scale-105"
                style={{ background: buildGradient(p.stops, p.angle, 'linear') }}
                onClick={() => applyPreset(p)}
                title={p.name}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* CSS output */}
        <div className="mb-4">
          <label className="text-[10px] block mb-1" style={{ color: 'var(--text-muted)' }}>CSS Value</label>
          <input
            className="w-full text-[10px] p-1.5 rounded border font-mono"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            value={gradient}
            readOnly
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1.5 text-xs rounded"
            style={{ color: 'var(--text-secondary)' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 text-xs rounded text-white font-medium"
            style={{ background: 'var(--accent)' }}
            onClick={apply}
          >
            Apply Gradient
          </button>
        </div>
      </div>
    </div>
  );
}
