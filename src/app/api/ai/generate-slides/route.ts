/* ═══════════════════════════════════════════════════════
   API: /api/ai/generate-slides — AI slide generation
   ═══════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

async function resolveModel() {
  const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(4000) });
  if (!tagsRes.ok) return MODEL;
  const tags = await tagsRes.json();
  const names: string[] = Array.isArray(tags?.models) ? tags.models.map((m: { name?: string }) => m?.name).filter(Boolean) : [];
  if (names.includes(MODEL)) return MODEL;
  return names[0] || MODEL;
}

async function ollamaGenerate(prompt: string, model: string) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.response || '';
}

function tryParseJSON(text: string) {
  try {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
  } catch { /* ignore */ }
  return null;
}

function localSlides(topic: string, count: number) {
  const slides = [];
  slides.push({
    title: topic,
    bullets: ['Overview and introduction', 'Key concepts', 'Detailed analysis'],
  });
  for (let i = 1; i < count; i++) {
    slides.push({
      title: `${topic} — Part ${i + 1}`,
      bullets: [`Point ${i * 2 - 1}: Explanation`, `Point ${i * 2}: Details`, 'Summary and takeaways'],
    });
  }
  return slides;
}

function autoLayoutSlide(slideData: { title: string; bullets?: string[] }, order: number) {
  const elements: unknown[] = [];
  let elId = 0;
  const mkId = () => `ai_${order}_${elId++}`;

  elements.push({
    id: mkId(), type: 'heading', x: 60, y: 30, width: 840, height: 60,
    rotation: 0, opacity: 1, locked: false, animation: null,
    content: slideData.title, level: order === 0 ? 1 : 2,
    style: { fontSize: order === 0 ? '42px' : '32px', fontWeight: 'bold', color: '#1a1a2e', textAlign: order === 0 ? 'center' : 'left' },
  });

  if (slideData.bullets?.length) {
    elements.push({
      id: mkId(), type: 'list', x: 60, y: order === 0 ? 160 : 110, width: 840, height: 350,
      rotation: 0, opacity: 1, locked: false, animation: null,
      items: slideData.bullets, listType: 'bullet',
      style: { fontSize: '22px', color: '#444' },
    });
  }

  return {
    id: `s_ai_${Date.now()}_${order}`,
    order,
    layout: order === 0 ? 'title' : 'content',
    background: { type: 'solid' as const, value: '#ffffff' },
    elements,
    notes: '',
    transition: 'fade',
    animations: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { topic, count = 5 } = await req.json();
    const prompt = `Generate exactly ${count} presentation slides about "${topic}". Return ONLY a JSON array where each item has "title" (string) and "bullets" (array of strings, 3-5 items each). No markdown, no explanation.`;

    let slidesData;
    let source: 'ai' | 'fallback' = 'ai';
    try {
      const model = await resolveModel();
      const raw = await ollamaGenerate(prompt, model);
      slidesData = tryParseJSON(raw);
    } catch { /* ignore */ }

    if (!slidesData) {
      slidesData = localSlides(topic, count);
      source = 'fallback';
    }

    const slides = slidesData.slice(0, count).map((s: { title: string; bullets?: string[] }, i: number) => autoLayoutSlide(s, i));

    return NextResponse.json({ slides, source });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
