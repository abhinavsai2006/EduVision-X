/* ═══════════════════════════════════════════════════════
   API: /api/presentations — List saved presentations
   ═══════════════════════════════════════════════════════ */
import { NextResponse } from 'next/server';
import { readdir, access } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'presentations');

async function dirExists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function GET() {
  try {
    if (!(await dirExists(DATA_DIR))) return NextResponse.json([]);
    const entries = await readdir(DATA_DIR);
    const files = entries.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
    return NextResponse.json(files);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
