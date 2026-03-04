/* ═══════════════════════════════════════════════════════
   API: /api/autosave — Auto-save / auto-load last state
   ═══════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

const AUTOSAVE_PATH = path.join(process.cwd(), 'data', 'autosave.json');

async function fileExists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dir = path.dirname(AUTOSAVE_PATH);
    if (!(await fileExists(dir))) await mkdir(dir, { recursive: true });
    await writeFile(AUTOSAVE_PATH, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!(await fileExists(AUTOSAVE_PATH))) return NextResponse.json(null);
    const raw = await readFile(AUTOSAVE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
