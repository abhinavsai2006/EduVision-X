import { NextRequest, NextResponse } from 'next/server';

/* ──────────────────────────────────────────────────────────────
   Real Code Execution — Paiza.io (free guest key, no signup)
   Docs: https://paiza.io/api-doc

   For R / Julia / SQL fallback: add to next-app/.env.local
     JUDGE0_API_KEY=your_rapidapi_key
   Free 100 req/day: https://rapidapi.com/judge0-official/api/judge0-ce
   ────────────────────────────────────────────────────────────── */

const PAIZA = 'https://api.paiza.io/runners';
const PAIZA_KEY = process.env.PAIZA_API_KEY || 'guest';

/* Paiza.io language identifiers */
const PAIZA_LANG: Record<string, { lang: string; label: string }> = {
  python:     { lang: 'python3',    label: 'Python 3'      },
  javascript: { lang: 'javascript', label: 'Node.js'       },
  typescript: { lang: 'typescript', label: 'TypeScript'    },
  cpp:        { lang: 'cpp',        label: 'C++ (GCC)'     },
  java:       { lang: 'java',       label: 'Java'          },
  rust:       { lang: 'rust',       label: 'Rust'          },
  go:         { lang: 'go',         label: 'Go'            },
  ruby:       { lang: 'ruby',       label: 'Ruby'          },
  php:        { lang: 'php',        label: 'PHP'           },
  kotlin:     { lang: 'kotlin',     label: 'Kotlin'        },
  r:          { lang: 'r',          label: 'R'             },
  julia:      { lang: 'julia',      label: 'Julia'         },
};

/* Judge0 language IDs — used if JUDGE0_API_KEY is set (R, Julia, SQL, or any Paiza failure) */
const JUDGE0_LANG: Record<string, { id: number; label: string }> = {
  python:     { id: 71,  label: 'Python 3.11'  },
  javascript: { id: 93,  label: 'Node.js 18'   },
  typescript: { id: 94,  label: 'TypeScript 5' },
  cpp:        { id: 54,  label: 'C++ GCC 9'    },
  java:       { id: 62,  label: 'Java 15'      },
  rust:       { id: 73,  label: 'Rust 1.58'    },
  go:         { id: 95,  label: 'Go 1.18'      },
  ruby:       { id: 72,  label: 'Ruby 2.7'     },
  php:        { id: 68,  label: 'PHP 7.4'      },
  kotlin:     { id: 78,  label: 'Kotlin 1.6'   },
  r:          { id: 99,  label: 'R 4.0'        },
  julia:      { id: 87,  label: 'Julia 1.6'    },
  sql:        { id: 82,  label: 'SQLite 3.36'  },
};

interface PaizaCreate { id: string; status: string; error?: string; }
interface PaizaDetails {
  id: string;
  status: 'running' | 'completed' | 'error';
  build_result?: 'failure' | 'success' | string;
  build_stdout?: string;
  build_stderr?: string;
  stdout?: string;
  stderr?: string;
  time?: string;
  memory?: string;
}

function resp(
  stdout: string, stderr: string, compileOut: string,
  exitCode: number, runtime: string, version: string,
) {
  return NextResponse.json({ stdout, stderr, compile_output: compileOut, code: exitCode, runtime, version });
}

/* ── Poll Paiza until completed or timeout ── */
async function paizaPoll(id: string, deadlineMs: number): Promise<PaizaDetails | null> {
  const url = `${PAIZA}/get_details?id=${id}&api_key=${PAIZA_KEY}`;
  for (let i = 0; i < 30; i++) {
    if (Date.now() > deadlineMs) return null;
    await new Promise(r => setTimeout(r, 500 + i * 100));
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const d: PaizaDetails = await r.json();
      if (d.status !== 'running') return d;
    } catch { /* retry */ }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    language: string;
    code: string;
    stdin?: string;
    timeout?: number;
  };
  const { language, code, stdin = '', timeout = 15 } = body;

  /* HTML renders as live iframe client-side */
  if (language === 'html') {
    return resp('__HTML_PREVIEW__', '', '', 0, '0ms', 'HTML5');
  }

  const timeoutSec = Math.min(Math.max(timeout, 3), 30);
  const deadline   = Date.now() + timeoutSec * 1000 + 10_000;

  /* ══════════════════════════════════════════════════
     1. PAIZA.IO — free guest key, works for everything
        except SQL
     ════════════════════════════════════════════════ */
  const pz = PAIZA_LANG[language];
  if (pz) {
    try {
      const start = Date.now();

      /* Create run */
      const createRes = await fetch(`${PAIZA}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language: pz.lang,
          input: stdin,
          longpoll: true,
          longpoll_timeout: Math.min(timeoutSec, 10),
          api_key: PAIZA_KEY,
        }),
        signal: AbortSignal.timeout(deadline - Date.now()),
      });

      if (!createRes.ok) throw new Error(`Paiza create ${createRes.status}`);
      const created: PaizaCreate = await createRes.json();
      if (!created.id) throw new Error('No run ID returned');

      /* If longpoll returned a completed result already */
      let details: PaizaDetails | null = null;
      if (created.status && created.status !== 'running') {
        details = created as unknown as PaizaDetails;
      } else {
        details = await paizaPoll(created.id, deadline);
      }

      if (!details) throw new Error('Timed out waiting for Paiza result');

      const elapsed     = `${Date.now() - start}ms`;
      const stdout      = details.stdout ?? '';
      const stderr      = details.stderr ?? '';
      const buildOut    = ((details.build_stdout ?? '') + (details.build_stderr ?? '')).trim();
      const buildFailed = details.build_result === 'failure';
      const exitCode    = buildFailed ? 1 : (stderr ? 1 : 0);

      return resp(stdout, stderr, buildOut, exitCode, elapsed, pz.label);

    } catch (err) {
      /* If Paiza fails, fall through to Judge0 */
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Paiza.io failed:', msg);
    }
  }

  /* ══════════════════════════════════════════════════
     2. JUDGE0 CE — needs JUDGE0_API_KEY or self-hosted
        Required for: SQL, any Paiza failure
        .env.local: JUDGE0_API_KEY=your_rapidapi_key
        Self-host:  JUDGE0_URL=http://localhost:2358
     ════════════════════════════════════════════════ */
  const j0key  = process.env.JUDGE0_API_KEY ?? '';
  const j0url  = (process.env.JUDGE0_URL ?? 'https://judge0-ce.p.rapidapi.com').replace(/\/$/, '');
  const j0lang = JUDGE0_LANG[language];

  if (j0lang && (j0key || j0url.includes('localhost') || j0url.includes('127.0.0.1'))) {
    try {
      const start   = Date.now();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (j0key) {
        headers['X-RapidAPI-Key']  = j0key;
        headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
      }
      const sub = await fetch(`${j0url}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language_id: j0lang.id,
          source_code: code,
          stdin,
          cpu_time_limit: timeoutSec,
          memory_limit: 262144,
        }),
        signal: AbortSignal.timeout(timeoutSec * 1000 + 15_000),
      });
      const d = await sub.json() as {
        stdout?: string; stderr?: string; compile_output?: string;
        exit_code?: number;
      };
      return resp(
        d.stdout ?? '', d.stderr ?? '', d.compile_output ?? '',
        d.exit_code ?? ((d.stderr || d.compile_output) ? 1 : 0),
        `${Date.now() - start}ms`, j0lang.label,
      );
    } catch (err) {
      return resp('', `Judge0 error: ${err instanceof Error ? err.message : err}`, '', 1, '0ms', '');
    }
  }

  /* ══════════════════════════════════════════════════
     3. Nothing worked — give actionable instructions
     ════════════════════════════════════════════════ */
  const isSQL = language === 'sql';
  const hint  = isSQL || (!pz && j0lang)
    ? [
        `Add a free Judge0 key (100 req/day) to next-app/.env.local:`,
        ``,
        `  JUDGE0_API_KEY=your_rapidapi_key`,
        ``,
        `Get one at: https://rapidapi.com/judge0-official/api/judge0-ce`,
      ].join('\n')
    : `Language "${language}" is not supported.`;

  return resp('', hint, '', 1, '0ms', '');
}

/* GET — for health check / runtime list */
export async function GET() {
  return NextResponse.json({
    service: 'Paiza.io (primary) + Judge0 CE (fallback)',
    paiza_supported: Object.keys(PAIZA_LANG),
    judge0_supported: Object.keys(JUDGE0_LANG),
    judge0_configured: !!(process.env.JUDGE0_API_KEY || process.env.JUDGE0_URL),
  });
}
