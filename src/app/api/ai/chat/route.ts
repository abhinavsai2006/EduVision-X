/* ═══════════════════════════════════════════════════════
   API: /api/ai/chat — Ollama AI chat endpoint
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

async function ollamaChat(messages: { role: string; content: string }[], model: string) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.message?.content || '';
}

async function ollamaGenerate(prompt: string) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.response || '';
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const model = await resolveModel();
    const reply = await ollamaChat(messages, model);
    return NextResponse.json({ reply, model, ollamaUrl: OLLAMA_URL });
  } catch (err: unknown) {
    return NextResponse.json({ reply: `AI unavailable: ${err}`, model: MODEL, ollamaUrl: OLLAMA_URL }, { status: 200 });
  }
}
