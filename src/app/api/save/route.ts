/* ═══════════════════════════════════════════════════════
   API: /api/save — Save presentation to disk
   ═══════════════════════════════════════════════════════ */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'presentations');

async function dirExists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!(await dirExists(DATA_DIR))) await mkdir(DATA_DIR, { recursive: true });
    const title = body.meta?.title || 'Untitled';
    const safe = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(DATA_DIR, `${safe}.json`);
    await writeFile(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true, name: safe });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
