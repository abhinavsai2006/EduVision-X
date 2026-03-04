/* ═══════════════════════════════════════════════════════
   API: /api/templates — List & get built-in templates
   ═══════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server';

/* ── Built-in templates (ported from server.js) ─── */
const TEMPLATES: Record<string, { name: string; description: string; slides: unknown[] }> = {
  lecture: {
    name: 'Lecture Slides',
    description: 'Clean academic presentation with title & content slides',
    slides: [
      { id: 't_l1', order: 0, layout: 'title', background: { type: 'solid', value: '#ffffff' },
        elements: [
          { id: 'tl1h', type: 'heading', x: 60, y: 120, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Lecture Title', level: 1, style: { fontSize: '48px', fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center' } },
          { id: 'tl1t', type: 'text', x: 60, y: 260, width: 840, height: 50, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Subtitle or Course Name', style: { fontSize: '24px', color: '#666', textAlign: 'center' } },
        ],
        notes: '', transition: 'fade', animations: [] },
      { id: 't_l2', order: 1, layout: 'content', background: { type: 'solid', value: '#ffffff' },
        elements: [
          { id: 'tl2h', type: 'heading', x: 60, y: 30, width: 840, height: 50, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Key Concepts', level: 2, style: { fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e' } },
          { id: 'tl2l', type: 'list', x: 60, y: 100, width: 840, height: 380, rotation: 0, opacity: 1, locked: false, animation: null,
            items: ['Concept 1: Description here', 'Concept 2: Details follow', 'Concept 3: More info'], listType: 'bullet',
            style: { fontSize: '22px', color: '#444' } },
        ],
        notes: '', transition: 'fade', animations: [] },
    ],
  },
  startup: {
    name: 'Startup Pitch',
    description: 'Modern pitch deck for startups',
    slides: [
      { id: 't_s1', order: 0, layout: 'title', background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
        elements: [
          { id: 'ts1h', type: 'heading', x: 60, y: 140, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Your Startup Name', level: 1, style: { fontSize: '52px', fontWeight: 'bold', color: '#fff', textAlign: 'center' } },
          { id: 'ts1t', type: 'text', x: 160, y: 260, width: 640, height: 50, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'One-line description of what you do', style: { fontSize: '22px', color: '#ddd', textAlign: 'center' } },
        ],
        notes: '', transition: 'zoom', animations: [] },
      { id: 't_s2', order: 1, layout: 'content', background: { type: 'solid', value: '#ffffff' },
        elements: [
          { id: 'ts2h', type: 'heading', x: 60, y: 40, width: 400, height: 50, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'The Problem', level: 2, style: { fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e' } },
          { id: 'ts2t', type: 'text', x: 60, y: 110, width: 400, height: 200, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Describe the problem your target audience faces. Make it relatable and urgent.',
            style: { fontSize: '20px', color: '#555', lineHeight: '1.6' } },
          { id: 'ts2c', type: 'chart', x: 500, y: 80, width: 400, height: 280, rotation: 0, opacity: 1, locked: false, animation: null,
            chartType: 'bar', data: { labels: ['2021', '2022', '2023', '2024'], values: [20, 45, 70, 95] },
            style: { colors: ['#6366f1', '#00cec9', '#fdcb6e', '#e17055'] } },
        ],
        notes: '', transition: 'slide', animations: [] },
    ],
  },
  workshop: {
    name: 'Workshop / Training',
    description: 'Interactive workshop slides with exercises',
    slides: [
      { id: 't_w1', order: 0, layout: 'title', background: { type: 'solid', value: '#f0fff4' },
        elements: [
          { id: 'tw1h', type: 'heading', x: 60, y: 140, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Workshop Title', level: 1, style: { fontSize: '44px', fontWeight: 'bold', color: '#1e7a5e', textAlign: 'center' } },
          { id: 'tw1p', type: 'progress', x: 280, y: 280, width: 400, height: 40, rotation: 0, opacity: 1, locked: false, animation: null,
            value: 0, max: 100, label: 'Progress', style: { barColor: '#00b894', bgColor: '#e9ecef' } },
        ],
        notes: '', transition: 'fade', animations: [] },
    ],
  },
  report: {
    name: 'Data Report',
    description: 'Data-driven report with charts and tables',
    slides: [
      { id: 't_r1', order: 0, layout: 'title', background: { type: 'solid', value: '#f5f7fa' },
        elements: [
          { id: 'tr1h', type: 'heading', x: 60, y: 150, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Quarterly Report', level: 1, style: { fontSize: '48px', fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' } },
        ],
        notes: '', transition: 'fade', animations: [] },
    ],
  },
  thesis: {
    name: 'Thesis Defense',
    description: 'Academic thesis presentation',
    slides: [
      { id: 't_th1', order: 0, layout: 'title', background: { type: 'solid', value: '#fffff0' },
        elements: [
          { id: 'tth1h', type: 'heading', x: 60, y: 120, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Thesis Title', level: 1, style: { fontSize: '40px', fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center' } },
          { id: 'tth1t', type: 'text', x: 160, y: 240, width: 640, height: 50, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Author Name — Department — University', style: { fontSize: '18px', color: '#666', textAlign: 'center' } },
        ],
        notes: '', transition: 'fade', animations: [] },
    ],
  },
  creative: {
    name: 'Creative Portfolio',
    description: 'Bold creative portfolio showcase',
    slides: [
      { id: 't_c1', order: 0, layout: 'title', background: { type: 'solid', value: '#0f0f23' },
        elements: [
          { id: 'tc1h', type: 'heading', x: 60, y: 140, width: 840, height: 80, rotation: 0, opacity: 1, locked: false, animation: null,
            content: 'Creative Portfolio', level: 1, style: { fontSize: '52px', fontWeight: 'bold', color: '#ff6bcb', textAlign: 'center' } },
          { id: 'tc1i', type: 'icon', x: 420, y: 260, width: 120, height: 120, rotation: 0, opacity: 1, locked: false, animation: null,
            icon: '🎨', style: { fontSize: '80px' } },
        ],
        notes: '', transition: 'zoom', animations: [] },
    ],
  },
};

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (id) {
    const t = TEMPLATES[id];
    if (!t) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    return NextResponse.json(t);
  }

  // List all templates
  const list = Object.entries(TEMPLATES).map(([key, val]) => ({
    id: key,
    name: val.name,
    description: val.description,
    slideCount: val.slides.length,
  }));
  return NextResponse.json(list);
}
