'use client';
/* ═══════════════════════════════════════════════════════
   CodingLab — Multi-language code sandbox with output
   ═══════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', ext: 'js' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', ext: 'ts' },
  { id: 'python', name: 'Python', icon: '🐍', ext: 'py' },
  { id: 'html', name: 'HTML/CSS', icon: '🌐', ext: 'html' },
  { id: 'sql', name: 'SQL', icon: '🗃️', ext: 'sql' },
  { id: 'markdown', name: 'Markdown', icon: '📝', ext: 'md' },
];

const TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Sandbox
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Try it out
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,
  typescript: `// TypeScript Sandbox
interface Student {
  name: string;
  grade: number;
  courses: string[];
}

const students: Student[] = [
  { name: "Alice", grade: 95, courses: ["Math", "Physics"] },
  { name: "Bob", grade: 87, courses: ["English", "History"] },
];

const topStudents = students
  .filter(s => s.grade > 90)
  .map(s => \`\${s.name}: \${s.grade}\`);

console.log("Top students:", topStudents);`,
  python: `# Python Sandbox
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(f"Sorted: {quicksort(numbers)}")`,
  html: `<!-- HTML/CSS Sandbox -->
<style>
  .card {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 12px;
    padding: 24px;
    color: white;
    font-family: system-ui;
    max-width: 300px;
    box-shadow: 0 8px 32px rgba(99,102,241,0.3);
  }
  .card h2 { margin: 0 0 8px; }
  .card p { margin: 0; opacity: 0.8; font-size: 14px; }
</style>
<div class="card">
  <h2>Hello World</h2>
  <p>Edit this HTML and see the preview update!</p>
</div>`,
  sql: `-- SQL Sandbox (Simulated)\nSELECT \n  s.name,\n  s.grade,\n  c.course_name\nFROM students s\nJOIN enrollments e ON s.id = e.student_id\nJOIN courses c ON e.course_id = c.id\nWHERE s.grade > 90\nORDER BY s.grade DESC\nLIMIT 10;`,
  markdown: `# Markdown Preview\n\n## Features\n- **Bold** and *italic* text\n- Code blocks: \`inline code\`\n- Lists and headers\n\n### Table\n| Name | Score |\n|------|-------|\n| Alice | 95 |\n| Bob | 87 |\n\n> Blockquote example\n\n\`\`\`python\nprint("Hello from Markdown!")\n\`\`\``,
};

interface Props { open: boolean; onClose: () => void; }

export default function CodingLab({ open, onClose }: Props) {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'output' | 'preview'>('output');
  const [fontSize, setFontSize] = useState(13);

  const runCode = useCallback(() => {
    setRunning(true);
    setOutput([]);

    setTimeout(() => {
      const logs: string[] = [];
      try {
        if (lang === 'javascript' || lang === 'typescript') {
          // Capture console.log
          const origLog = console.log;
          console.log = (...args: unknown[]) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
          };
          try {
            // eslint-disable-next-line no-eval
            eval(code);
          } catch (e) {
            logs.push(`❌ Error: ${(e as Error).message}`);
          }
          console.log = origLog;
        } else if (lang === 'python') {
          logs.push('🐍 Python (simulated output):');
          // Simple regex-based simulator for print statements
          const prints = code.match(/print\((.+)\)/g);
          if (prints) {
            prints.forEach(p => {
              const content = p.replace(/print\(/, '').replace(/\)$/, '');
              logs.push(`  ${content}`);
            });
          } else {
            logs.push('  (No print statements found)');
          }
        } else if (lang === 'sql') {
          logs.push('🗃️ SQL Query Results (simulated):');
          logs.push('┌──────┬───────┬─────────────┐');
          logs.push('│ name │ grade │ course_name │');
          logs.push('├──────┼───────┼─────────────┤');
          logs.push('│ Alice│   95  │ Mathematics │');
          logs.push('│ Carol│   92  │ Physics     │');
          logs.push('└──────┴───────┴─────────────┘');
          logs.push('2 rows returned in 0.003s');
        } else if (lang === 'html') {
          logs.push('✅ HTML rendered in preview tab');
          setTab('preview');
        } else if (lang === 'markdown') {
          logs.push('✅ Markdown rendered in preview tab');
          setTab('preview');
        }
      } catch (e) {
        logs.push(`❌ Runtime Error: ${(e as Error).message}`);
      }
      setOutput(logs);
      setRunning(false);
    }, 300);
  }, [code, lang]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9987] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', height: '80vh' }}
          initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <span className="text-base">💻</span>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Coding Lab</h2>
              <div className="flex gap-1">
                {LANGUAGES.map(l => (
                  <button key={l.id}
                    className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                    style={{
                      background: lang === l.id ? 'var(--accent-dim)' : 'transparent',
                      color: lang === l.id ? 'var(--accent)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer',
                    }}
                    onClick={() => { setLang(l.id); setCode(TEMPLATES[l.id] || ''); setOutput([]); }}
                  >{l.icon} {l.name}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="input-field" value={fontSize} onChange={e => setFontSize(+e.target.value)}
                style={{ fontSize: 10, padding: '2px 4px', width: 50 }}>
                {[10, 11, 12, 13, 14, 16, 18].map(s => <option key={s} value={s}>{s}px</option>)}
              </select>
              <button className="btn-primary flex items-center gap-1" onClick={runCode} disabled={running}
                style={{ fontSize: 11, padding: '4px 12px' }}>
                {running ? '⏳' : '▶'} Run
              </button>
              <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Editor + output split */}
          <div className="flex flex-1 overflow-hidden">
            {/* Code editor area */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>
              <div className="px-3 py-1.5 flex items-center gap-2 shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {LANGUAGES.find(l => l.id === lang)?.icon} {LANGUAGES.find(l => l.id === lang)?.name}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {code.split('\n').length} lines
                </span>
              </div>
              <div className="flex-1 overflow-auto" style={{ background: '#0d1117' }}>
                <div className="flex">
                  {/* Line numbers */}
                  <div className="py-2 px-2 text-right select-none shrink-0" style={{ color: '#484f58', fontSize: fontSize - 2, fontFamily: 'monospace', lineHeight: `${fontSize + 6}px`, minWidth: 36 }}>
                    {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  {/* Textarea */}
                  <textarea
                    className="flex-1 py-2 px-2 resize-none outline-none"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    style={{
                      background: 'transparent', color: '#e6edf3',
                      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                      fontSize, lineHeight: `${fontSize + 6}px`,
                      border: 'none', tabSize: 2,
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        setCode(code.substring(0, start) + '  ' + code.substring(end));
                        setTimeout(() => {
                          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                        }, 0);
                      }
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        runCode();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Output / Preview */}
            <div className="w-[40%] flex flex-col overflow-hidden">
              <div className="flex items-center px-3 py-1.5 shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                {(['output', 'preview'] as const).map(t => (
                  <button key={t} className="px-2 py-0.5 rounded text-[10px] font-medium capitalize transition-colors"
                    style={{
                      background: tab === t ? 'var(--accent-dim)' : 'transparent',
                      color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer',
                    }}
                    onClick={() => setTab(t)}
                  >{t}</button>
                ))}
              </div>
              <div className="flex-1 overflow-auto p-3" style={{ background: tab === 'output' ? '#0d1117' : 'white' }}>
                {tab === 'output' ? (
                  <div style={{ fontFamily: 'monospace', fontSize: fontSize - 1, color: '#e6edf3' }}>
                    {output.length === 0 ? (
                      <div style={{ color: '#484f58' }}>Press Ctrl+Enter or click Run to execute…</div>
                    ) : (
                      output.map((line, i) => (
                        <div key={i} style={{ color: line.startsWith('❌') ? '#f87171' : line.startsWith('✅') ? '#34d399' : '#e6edf3', lineHeight: 1.5 }}>
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div>
                    {(lang === 'html') && (
                      <div dangerouslySetInnerHTML={{ __html: code }} />
                    )}
                    {lang === 'markdown' && (
                      <div style={{ fontFamily: 'system-ui', fontSize: 13, color: '#1a1a2e', lineHeight: 1.6 }}>
                        {code.split('\n').map((line, i) => {
                          if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{line.slice(2)}</h1>;
                          if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{line.slice(3)}</h2>;
                          if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{line.slice(4)}</h3>;
                          if (line.startsWith('> ')) return <blockquote key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: 12, color: '#666', margin: '4px 0' }}>{line.slice(2)}</blockquote>;
                          if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: 16 }}>{line.slice(2)}</li>;
                          if (line.trim() === '') return <br key={i} />;
                          return <p key={i} style={{ margin: '4px 0' }}>{line}</p>;
                        })}
                      </div>
                    )}
                    {!['html', 'markdown'].includes(lang) && (
                      <div style={{ color: '#666', fontSize: 12, textAlign: 'center', paddingTop: 40 }}>
                        Preview available for HTML and Markdown only
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-1.5 flex items-center justify-between shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Ctrl+Enter to run · Tab to indent</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {LANGUAGES.find(l => l.id === lang)?.name} · {code.length} chars
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
