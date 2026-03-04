import { NextRequest } from 'next/server';
import { mkdir, readFile, rm, writeFile, readdir } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export const runtime = 'nodejs';

type CommandResult = { ok: true } | { ok: false; error: string };
const POWERPOINT_EXTENSIONS = new Set(['.ppt', '.pptx', '.pptm', '.pps', '.ppsx', '.pot', '.potx']);

function sanitizeBaseName(filename: string): string {
  const parsed = path.parse(filename);
  const safe = parsed.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'presentation';
  return safe;
}

async function runSoffice(args: string[]): Promise<CommandResult> {
  const commands = process.platform === 'win32' ? ['soffice.exe', 'soffice'] : ['soffice'];

  for (const command of commands) {
    const result = await new Promise<CommandResult>((resolve) => {
      const proc = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stderr = '';

      proc.stderr.on('data', (chunk) => {
        stderr += String(chunk);
      });

      proc.on('error', (err) => {
        resolve({ ok: false, error: String(err) });
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ ok: true });
        } else {
          resolve({ ok: false, error: stderr || `soffice exited with code ${code}` });
        }
      });
    });

    if (result.ok) return result;
  }

  return { ok: false, error: 'LibreOffice (soffice) not found in PATH.' };
}

function psQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function runPowerPointCom(inputPath: string, outputPdfPath: string): Promise<CommandResult> {
  if (process.platform !== 'win32') {
    return { ok: false, error: 'PowerPoint COM automation is only available on Windows.' };
  }

  const script = [
    "$ErrorActionPreference = 'Stop'",
    `$inputPath = ${psQuote(inputPath)}`,
    `$outputPath = ${psQuote(outputPdfPath)}`,
    '$app = $null',
    '$presentation = $null',
    'try {',
    '  $app = New-Object -ComObject PowerPoint.Application',
    '  $app.Visible = 1',
    '  $presentation = $app.Presentations.Open($inputPath, $false, $false, $true)',
    '  $ppSaveAsPDF = 32',
    '  $presentation.SaveAs($outputPath, $ppSaveAsPDF)',
    '  Write-Output "OK"',
    '} catch {',
    '  throw $_.Exception.Message',
    '} finally {',
    '  if ($presentation -ne $null) { $presentation.Close() }',
    '  if ($app -ne $null) { $app.Quit() }',
    '}',
  ].join('; ');

  return await new Promise<CommandResult>((resolve) => {
    const proc = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';
    let stdout = '';
    proc.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    proc.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    proc.on('error', (err) => {
      resolve({ ok: false, error: String(err) });
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ ok: true });
      } else {
        resolve({ ok: false, error: stderr || stdout || `PowerPoint automation exited with code ${code}` });
      }
    });
  });
}

export async function POST(req: NextRequest) {
  let workDir = '';

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!POWERPOINT_EXTENSIONS.has(ext)) {
      return Response.json({ error: 'Only PowerPoint files are supported', detail: `Received extension: ${ext || '(none)'}` }, { status: 400 });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    workDir = path.join(process.cwd(), '.tmp', 'ppt-import', id);
    const inputDir = path.join(workDir, 'input');
    const outputDir = path.join(workDir, 'output');

    await mkdir(inputDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const baseName = sanitizeBaseName(file.name);
    const inputPath = path.join(inputDir, `${baseName}${ext}`);
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, inputBuffer);

    let convertResult = await runSoffice([
      '--headless',
      '--convert-to',
      'pdf',
      '--outdir',
      outputDir,
      inputPath,
    ]);

    if (!convertResult.ok && process.platform === 'win32') {
      const outputPdfPath = path.join(outputDir, `${baseName}.pdf`);
      convertResult = await runPowerPointCom(inputPath, outputPdfPath);
    }

    if (!convertResult.ok) {
      return Response.json(
        {
          error: 'PowerPoint conversion failed',
          detail: convertResult.error,
          hint: 'Install LibreOffice (`soffice`) or Microsoft PowerPoint desktop (Windows COM automation).',
        },
        { status: 500 },
      );
    }

    const outputFiles = await readdir(outputDir);
    const pdfName = outputFiles.find((name) => name.toLowerCase().endsWith('.pdf'));

    if (!pdfName) {
      return Response.json({ error: 'Converted PDF not found' }, { status: 500 });
    }

    const pdfPath = path.join(outputDir, pdfName);
    const pdfBuffer = await readFile(pdfPath);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${baseName}.pdf"`,
      },
    });
  } catch (err: unknown) {
    return Response.json({ error: String(err) }, { status: 500 });
  } finally {
    if (workDir) {
      try {
        await rm(workDir, { recursive: true, force: true });
      } catch {}
    }
  }
}
