'use client';
/* ═══════════════════════════════════════════════════════
   MonacoCode — Monaco Editor wrapper for code elements
   with inline ▶ Run button and output display
   ═══════════════════════════════════════════════════════ */
import React, { useCallback, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { SlideElement } from '@/types/slide';
import { useSlideStore } from '@/store/useSlideStore';

interface Props { element: SlideElement; presentMode?: boolean; }

export default function MonacoCode({ element: el, presentMode }: Props) {
  const updateElement = useSlideStore(s => s.updateElement);
  const [output, setOutput] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [running, setRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onChange = useCallback((value: string | undefined) => {
    if (!presentMode) updateElement(el.id, { content: value || '' });
  }, [el.id, updateElement, presentMode]);

  const lang = el.language || 'javascript';
  const code = el.content || '';

  const runCode = useCallback(() => {
    setRunning(true);
    const lines: string[] = [];
    const mockConsole = {
      log: (...args: unknown[]) => lines.push(args.map(String).join(' ')),
      warn: (...args: unknown[]) => lines.push('⚠️ ' + args.map(String).join(' ')),
      error: (...args: unknown[]) => lines.push('❌ ' + args.map(String).join(' ')),
      info: (...args: unknown[]) => lines.push('ℹ️ ' + args.map(String).join(' ')),
      table: (...args: unknown[]) => lines.push(JSON.stringify(args[0], null, 2)),
    };

    if (lang === 'html' || lang === 'css') {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(lang === 'css' ? `<style>${code}</style><p>CSS applied</p>` : code);
          doc.close();
          lines.push('✅ HTML/CSS rendered successfully');
        }
        document.body.removeChild(iframe);
      } catch (e: unknown) {
        lines.push('❌ ' + (e instanceof Error ? e.message : String(e)));
      }
    } else if (lang === 'javascript' || lang === 'typescript') {
      try {
        const fn = new Function('console', code);
        const result = fn(mockConsole);
        if (result !== undefined) lines.push('→ ' + String(result));
        if (lines.length === 0) lines.push('✅ Executed (no output)');
      } catch (e: unknown) {
        lines.push('❌ ' + (e instanceof Error ? e.message : String(e)));
      }
    } else if (lang === 'python') {
      lines.push('⚠️ Python execution requires a backend runtime.');
      lines.push('💡 Use JavaScript/TypeScript for browser execution.');
    } else {
      lines.push(`⚠️ ${lang} execution is not supported in the browser.`);
    }

    setOutput(lines);
    setShowOutput(true);
    setRunning(false);
  }, [code, lang]);

  const canRun = ['javascript', 'typescript', 'html', 'css'].includes(lang) || el.executable;
  const editorH = showOutput ? 'calc(100% - 28px - 60px)' : 'calc(100% - 28px)';

  return (
    <div className="w-full h-full rounded overflow-hidden flex flex-col" style={{ border: '1px solid #333', background: '#1e1e1e' }}>
      {/* ── Header bar with language label and Run button ── */}
      <div className="flex items-center justify-between px-2 shrink-0" style={{ height: 28, background: '#252526', borderBottom: '1px solid #333' }}>
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#858585' }}>
          {lang}
        </span>
        <div className="flex items-center gap-1">
          {showOutput && (
            <button
              className="text-[10px] px-1.5 py-0.5 rounded hover:bg-[#3c3c3c] transition-colors"
              style={{ color: '#858585' }}
              onClick={(e) => { e.stopPropagation(); setShowOutput(false); setOutput([]); }}
            >
              Clear
            </button>
          )}
          {canRun && (
            <button
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
              style={{ background: running ? '#555' : '#00b894', color: '#fff' }}
              onClick={(e) => { e.stopPropagation(); runCode(); }}
              title="Run Code (Ctrl+Enter)"
            >
              ▶ Run
            </button>
          )}
        </div>
      </div>

      {/* ── Editor ── */}
      <div style={{ height: editorH, flexShrink: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={lang}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 4 },
            readOnly: presentMode,
          }}
        />
      </div>

      {/* ── Inline output panel ── */}
      {showOutput && (
        <div className="shrink-0 overflow-auto font-mono" style={{
          height: 60, background: '#1a1a2e', borderTop: '1px solid #333',
          fontSize: 11, color: '#e8e8f0', padding: '4px 8px',
        }}>
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-tight">{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
