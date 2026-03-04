/* ═══════════════════════════════════════════════════════
   API: /api/load — Load a saved presentation
   ═══════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'presentations');

async function fileExists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get('name');
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    const safe = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(DATA_DIR, `${safe}.json`);
    if (!(await fileExists(filePath))) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
