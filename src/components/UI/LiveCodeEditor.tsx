'use client';
/* ═══════════════════════════════════════════════════════
   LiveCodeEditor — Modal for editing & executing code
   ═══════════════════════════════════════════════════════ */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Modal from '@/components/UI/Modal';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'html', 'css',
  'java', 'cpp', 'sql', 'rust', 'go',
];

interface Props {
  open: boolean;
  onClose: () => void;
  code: string;
  language: string;
  executable?: boolean;
  onSave: (code: string, language: string) => void;
}

export default function LiveCodeEditor({ open, onClose, code: initialCode, language: initialLang, executable = false, onSave }: Props) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLang || 'javascript');
  const [output, setOutput] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setCode(initialCode);
      setLanguage(initialLang || 'javascript');
      setOutput([]);
    }
  }, [open, initialCode, initialLang]);

  const runCode = useCallback(() => {
    if (!executable && language !== 'javascript' && language !== 'typescript' && language !== 'html' && language !== 'css') {
      setOutput([`⚠️ ${language} execution is not supported in the browser.`]);
      return;
    }

    const lines: string[] = [];
    const mockConsole = {
      log: (...args: unknown[]) => lines.push(args.map(String).join(' ')),
      warn: (...args: unknown[]) => lines.push('⚠️ ' + args.map(String).join(' ')),
      error: (...args: unknown[]) => lines.push('❌ ' + args.map(String).join(' ')),
      info: (...args: unknown[]) => lines.push('ℹ️ ' + args.map(String).join(' ')),
    };

    if (language === 'html' || language === 'css') {
      // Create an iframe for HTML/CSS
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(language === 'css' ? `<style>${code}</style><p>CSS applied</p>` : code);
          doc.close();
          lines.push('✅ HTML/CSS rendered successfully');
        }
      } catch (e: unknown) {
        lines.push('❌ ' + (e instanceof Error ? e.message : String(e)));
      } finally {
        document.body.removeChild(iframe);
      }
      setOutput(lines);
      return;
    }

    // JavaScript/TypeScript execution
    try {
      const fn = new Function('console', code);
      const result = fn(mockConsole);
      if (result !== undefined) lines.push('→ ' + String(result));
      if (lines.length === 0) lines.push('✅ Executed (no output)');
    } catch (e: unknown) {
      lines.push('❌ ' + (e instanceof Error ? e.message : String(e)));
    }
    setOutput(lines);
  }, [code, language, executable]);

  const handleSave = () => {
    onSave(code, language);
    onClose();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  }, [runCode]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <Modal open={open} onClose={onClose} title="Live Code Editor" width="800px">
      <div className="flex flex-col gap-3" style={{ maxHeight: '70vh' }}>
        {/* Controls bar */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="px-2 py-1 rounded text-xs"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={runCode} className="px-3 py-1 rounded text-xs font-bold" style={{ background: '#00b894', color: '#fff' }}>
            ▶ Run (Ctrl+Enter)
          </button>
          <button onClick={() => setOutput([])} className="px-3 py-1 rounded text-xs" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            Clear Output
          </button>
          <div className="flex-1" />
          <button onClick={handleSave} className="px-3 py-1 rounded text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
            Save &amp; Close
          </button>
        </div>

        {/* Editor */}
        <div style={{ height: 300, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <MonacoEditor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={v => setCode(v || '')}
            theme="vs-dark"
            onMount={editor => { editorRef.current = editor; }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 8 },
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Output */}
        <div className="rounded p-2 font-mono text-xs overflow-auto" style={{
          background: '#1a1a2e', color: '#e8e8f0', border: '1px solid var(--border)',
          minHeight: 60, maxHeight: 150,
        }}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Output</div>
          {output.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>Run code to see output here…</div>
          ) : output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
