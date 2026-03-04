/* ═══════════════════════════════════════════════════════
   API: /api/ai/status — Check Ollama availability
   ═══════════════════════════════════════════════════════ */
import { NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const models = data.models?.map((m: { name: string }) => m.name) || [];
      const selectedModel = models.includes(MODEL) ? MODEL : (models[0] || MODEL);
      return NextResponse.json({
        available: true,
        ollamaUrl: OLLAMA_URL,
        configuredModel: MODEL,
        selectedModel,
        models,
      });
    }
    return NextResponse.json({ available: false, ollamaUrl: OLLAMA_URL, configuredModel: MODEL });
  } catch {
    return NextResponse.json({ available: false, ollamaUrl: OLLAMA_URL, configuredModel: MODEL });
  }
}
