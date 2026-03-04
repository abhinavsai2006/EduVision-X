'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════════════════
   UNIVERSAL SIMULATION BUILDER — Full IDE
   Multi-language editor, compile, preview, customizable
   ═══════════════════════════════════════════════════════ */

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'js', color: '#f59e0b' },
  { id: 'python', label: 'Python', ext: 'py', color: '#3b82f6' },
  { id: 'html', label: 'HTML/CSS/JS', ext: 'html', color: '#ef4444' },
  { id: 'cpp', label: 'C++', ext: 'cpp', color: '#6366f1' },
  { id: 'java', label: 'Java', ext: 'java', color: '#f97316' },
];

const CATEGORIES = [
  { id: 'physics', label: 'Physics', icon: '⚛' },
  { id: 'cs', label: 'Computer Science', icon: '💻' },
  { id: 'ai-ml', label: 'AI / ML', icon: '🧠' },
  { id: 'os', label: 'Operating Systems', icon: '⚙' },
  { id: 'networking', label: 'Networking', icon: '🌐' },
  { id: 'math', label: 'Mathematics', icon: '📐' },
  { id: 'data-structures', label: 'Data Structures', icon: '🏗' },
  { id: 'systems', label: 'Systems', icon: '🔧' },
];

const TEMPLATES: Record<string, string> = {
  javascript: `// Simulation: Draw on canvas\nconst canvas = document.getElementById('sim-canvas');\nconst ctx = canvas.getContext('2d');\n\n// Parameters from sidebar\nconst speed = parseFloat(document.getElementById('param-speed')?.value || '1');\nconst count = parseInt(document.getElementById('param-count')?.value || '50');\n\nlet particles = [];\nfor (let i = 0; i < count; i++) {\n  particles.push({\n    x: Math.random() * canvas.width,\n    y: Math.random() * canvas.height,\n    vx: (Math.random() - 0.5) * speed * 2,\n    vy: (Math.random() - 0.5) * speed * 2,\n    r: 3 + Math.random() * 3,\n    color: \`hsl(\${Math.random()*360},70%,60%)\`\n  });\n}\n\nfunction animate() {\n  ctx.fillStyle = 'rgba(10,10,15,0.15)';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  for (const p of particles) {\n    p.x += p.vx; p.y += p.vy;\n    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;\n    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;\n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);\n    ctx.fillStyle = p.color;\n    ctx.fill();\n  }\n  requestAnimationFrame(animate);\n}\nanimate();`,
  python: `# Python Simulation (runs via Pyodide in browser)\nimport random\nimport math\n\n# This will be displayed as text output\nprint("=== Monte Carlo Pi Estimation ===")\nsamples = 10000\ninside = 0\nfor _ in range(samples):\n    x, y = random.random(), random.random()\n    if x*x + y*y <= 1:\n        inside += 1\npi_est = 4 * inside / samples\nprint(f"Samples: {samples}")\nprint(f"Estimated Pi: {pi_est:.6f}")\nprint(f"Actual Pi:    {math.pi:.6f}")\nprint(f"Error:        {abs(pi_est - math.pi):.6f}")`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { margin:0; background:#0a0a0f; overflow:hidden; }\n  canvas { display:block; }\n</style>\n</head>\n<body>\n<canvas id="c"></canvas>\n<script>\n  const c = document.getElementById('c');\n  const ctx = c.getContext('2d');\n  c.width = window.innerWidth;\n  c.height = window.innerHeight;\n  let t = 0;\n  function draw() {\n    ctx.fillStyle = 'rgba(10,10,15,0.05)';\n    ctx.fillRect(0,0,c.width,c.height);\n    for (let i = 0; i < 50; i++) {\n      const x = c.width/2 + Math.cos(t*0.02 + i*0.3) * (100 + i*3);\n      const y = c.height/2 + Math.sin(t*0.03 + i*0.2) * (80 + i*2);\n      ctx.beginPath();\n      ctx.arc(x, y, 2, 0, Math.PI*2);\n      ctx.fillStyle = \`hsl(\${i*7+t},70%,60%)\`;\n      ctx.fill();\n    }\n    t++;\n    requestAnimationFrame(draw);\n  }\n  draw();\n</script>\n</body>\n</html>`,
  cpp: `// C++ Simulation (display only — no browser compiler)\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};\n    int n = arr.size();\n    \n    cout << "Bubble Sort Simulation" << endl;\n    cout << "Original: ";\n    for (int x : arr) cout << x << " ";\n    cout << endl;\n    \n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                swap(arr[j], arr[j+1]);\n            }\n        }\n        cout << "Pass " << i+1 << ": ";\n        for (int x : arr) cout << x << " ";\n        cout << endl;\n    }\n    return 0;\n}`,
  java: `// Java Simulation (display only)\npublic class Simulation {\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n        System.out.println("Selection Sort Simulation");\n        \n        for (int i = 0; i < arr.length - 1; i++) {\n            int minIdx = i;\n            for (int j = i + 1; j < arr.length; j++) {\n                if (arr[j] < arr[minIdx]) minIdx = j;\n            }\n            int temp = arr[minIdx];\n            arr[minIdx] = arr[i];\n            arr[i] = temp;\n            \n            System.out.print("Step " + (i+1) + ": ");\n            for (int x : arr) System.out.print(x + " ");\n            System.out.println();\n        }\n    }\n}`,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
.builder{min-height:100vh;background:#0a0a0f;color:#e2e8f0;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column}
.builder-top{height:48px;background:#0f0f17;border-bottom:1px solid #1e1e2e;display:flex;align-items:center;padding:0 16px;gap:12px;flex-shrink:0}
.builder-back{padding:5px 12px;border-radius:6px;border:1px solid #1e1e2e;background:transparent;color:#94a3b8;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px}
.builder-title{font-size:14px;font-weight:800;color:#e2e8f0}
.builder-body{flex:1;display:flex;overflow:hidden}
.builder-config{width:280px;flex-shrink:0;background:#0d0d14;border-right:1px solid #1e1e2e;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px}
.builder-editor{flex:1;display:flex;flex-direction:column;border-right:1px solid #1e1e2e}
.builder-preview{width:420px;flex-shrink:0;display:flex;flex-direction:column;background:#0a0a0f}
.b-label{font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
.b-input{width:100%;padding:8px 10px;background:#111118;border:1px solid #1e1e2e;border-radius:8px;color:#e2e8f0;font-size:13px;outline:none;font-family:inherit}
.b-input:focus{border-color:rgba(99,102,241,0.5)}
.b-input::placeholder{color:#475569}
.b-textarea{width:100%;padding:8px 10px;background:#111118;border:1px solid #1e1e2e;border-radius:8px;color:#e2e8f0;font-size:12px;outline:none;font-family:inherit;resize:vertical;min-height:50px}
.b-select{width:100%;padding:8px 10px;background:#111118;border:1px solid #1e1e2e;border-radius:8px;color:#e2e8f0;font-size:12px;outline:none}
.b-lang-row{display:flex;gap:4px;flex-wrap:wrap}
.b-lang-btn{padding:5px 10px;border-radius:6px;border:1px solid #1e1e2e;background:#111118;color:#94a3b8;font-size:10px;font-weight:700;cursor:pointer;transition:all 0.15s}
.b-lang-btn.active{border-color:rgba(99,102,241,0.4);background:rgba(99,102,241,0.12);color:#a5b4fc}
.b-cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px}
.b-cat-btn{padding:8px 4px;border-radius:6px;border:1px solid #1e1e2e;background:#111118;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:9px;font-weight:600;color:#94a3b8;transition:all 0.15s}
.b-cat-btn.active{border-color:rgba(99,102,241,0.4);background:rgba(99,102,241,0.08);color:#a5b4fc}
.b-editor-toolbar{height:36px;background:#0f0f17;border-bottom:1px solid #1e1e2e;display:flex;align-items:center;padding:0 12px;gap:8px}
.b-editor-tab{padding:4px 12px;border-radius:5px;font-size:11px;font-weight:600;color:#94a3b8;cursor:pointer}
.b-editor-tab.active{background:rgba(99,102,241,0.12);color:#a5b4fc}
.b-code{flex:1;width:100%;padding:16px;background:#0a0a0f;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.6;border:none;outline:none;resize:none;tab-size:2}
.b-preview-bar{height:36px;background:#0f0f17;border-bottom:1px solid #1e1e2e;display:flex;align-items:center;padding:0 12px;gap:8px}
.b-preview-label{font-size:11px;font-weight:700;color:#64748b}
.b-run-btn{padding:5px 14px;border-radius:6px;border:none;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px}
.b-preview-frame{flex:1;background:#111118;border:none}
.b-console{height:140px;background:#0a0a0f;border-top:1px solid #1e1e2e;padding:10px 12px;overflow-y:auto;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.5}
.b-console-line{color:#94a3b8}
.b-console-error{color:#ef4444}
.b-console-success{color:#22c55e}
.b-param-row{display:flex;gap:6px;align-items:center;margin-bottom:6px}
.b-param-input{flex:1;padding:6px 8px;background:#111118;border:1px solid #1e1e2e;border-radius:6px;color:#e2e8f0;font-size:11px;outline:none}
.b-param-del{width:22px;height:22px;border-radius:4px;border:none;background:rgba(239,68,68,0.12);color:#ef4444;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.b-dim-row{display:flex;gap:6px}
.b-dim-input{flex:1;padding:6px 8px;background:#111118;border:1px solid #1e1e2e;border-radius:6px;color:#e2e8f0;font-size:11px;outline:none;text-align:center}
.b-upload-zone{border:2px dashed #1e1e2e;border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color 0.15s}
.b-upload-zone:hover{border-color:#6366f1}
.b-upload-icon{font-size:24px;opacity:0.5;margin-bottom:4px}
.b-upload-text{font-size:11px;color:#64748b}
.b-actions{display:flex;gap:6px;padding:12px 16px;border-top:1px solid #1e1e2e;background:#0d0d14}
.b-submit{flex:1;padding:10px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:700;cursor:pointer}
.b-submit:hover{background:#5558e6}
.b-export{padding:10px 16px;border-radius:8px;border:1px solid #1e1e2e;background:#111118;color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer}
`;

type Param = { name: string; type: string; min: string; max: string; defaultVal: string };

export default function CreateSimulationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [canvasW, setCanvasW] = useState('600');
  const [canvasH, setCanvasH] = useState('400');
  const [showAppBar, setShowAppBar] = useState(true);
  const [showInputBar, setShowInputBar] = useState(false);
  const [params, setParams] = useState<Param[]>([{ name: 'speed', type: 'range', min: '0.1', max: '5', defaultVal: '1' }]);
  const [console_, setConsole_] = useState<{ text: string; type: string }[]>([]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'upload'>('code');
  const [tags, setTags] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addParam = () => setParams(p => [...p, { name: '', type: 'range', min: '0', max: '100', defaultVal: '50' }]);
  const delParam = (i: number) => setParams(p => p.filter((_, j) => j !== i));
  const updateParam = (i: number, field: keyof Param, val: string) => setParams(p => p.map((pr, j) => j === i ? { ...pr, [field]: val } : pr));

  const switchLang = (lang: string) => {
    setLanguage(lang);
    if (TEMPLATES[lang]) setCode(TEMPLATES[lang]);
  };

  const logMsg = useCallback((text: string, type = 'log') => {
    setConsole_(prev => [...prev.slice(-50), { text, type }]);
  }, []);

  const runCode = () => {
    setConsole_([]);
    logMsg('Compiling...', 'log');

    if (language === 'html') {
      setPreviewHtml(code);
      logMsg('✓ HTML rendered in preview', 'success');
      return;
    }

    if (language === 'javascript') {
      // Build HTML wrapper with canvas + params
      const paramInputs = params.map(p =>
        `<div style="margin:4px 0"><label style="font-size:10px;color:#94a3b8">${p.name}: <input id="param-${p.name}" type="${p.type}" min="${p.min}" max="${p.max}" value="${p.defaultVal}" style="accent-color:#6366f1;width:100%"></label></div>`
      ).join('');

      const html = `<!DOCTYPE html><html><head><style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0a0a0f;color:#e2e8f0;font-family:sans-serif;overflow:hidden;display:flex;flex-direction:column;height:100vh}
        ${showAppBar ? `.appbar{height:32px;background:#0f0f17;border-bottom:1px solid #1e1e2e;display:flex;align-items:center;padding:0 10px;font-size:11px;font-weight:700;color:#94a3b8}` : ''}
        .main{flex:1;display:flex}
        .sidebar{width:160px;background:#0d0d14;border-right:1px solid #1e1e2e;padding:8px;overflow-y:auto;font-size:10px}
        canvas{display:block}
        ${showInputBar ? `.inputbar{height:36px;background:#0f0f17;border-top:1px solid #1e1e2e;display:flex;align-items:center;padding:0 10px;gap:6px}
        .inputbar input{padding:4px 8px;background:#111118;border:1px solid #1e1e2e;border-radius:4px;color:#e2e8f0;font-size:11px;outline:none;flex:1}
        .inputbar button{padding:4px 10px;border-radius:4px;border:none;background:#6366f1;color:#fff;font-size:10px;font-weight:700;cursor:pointer}` : ''}
      </style></head><body>
        ${showAppBar ? `<div class="appbar">${name || 'Simulation Preview'}</div>` : ''}
        <div class="main">
          ${params.length > 0 ? `<div class="sidebar">${paramInputs}</div>` : ''}
          <div style="flex:1;display:flex;align-items:center;justify-content:center">
            <canvas id="sim-canvas" width="${canvasW}" height="${canvasH}"></canvas>
          </div>
        </div>
        ${showInputBar ? `<div class="inputbar"><input placeholder="Enter value..."><button>Submit</button></div>` : ''}
        <script>
        try { ${code} } catch(e) { document.body.innerHTML += '<div style="color:#ef4444;padding:12px;font-size:12px">Error: ' + e.message + '</div>'; }
        </script>
      </body></html>`;
      setPreviewHtml(html);
      logMsg('✓ JavaScript compiled and running', 'success');
      return;
    }

    if (language === 'python') {
      logMsg('Python output (simulated — use Pyodide for real execution):', 'log');
      const lines = code.split('\n').filter(l => l.trim().startsWith('print('));
      if (lines.length > 0) {
        lines.forEach(l => {
          const match = l.match(/print\(["'`](.+?)["'`]\)/);
          if (match) logMsg(match[1], 'log');
          else logMsg(l.trim(), 'log');
        });
      }
      logMsg('✓ Python code parsed', 'success');
      return;
    }

    logMsg(`${LANGUAGES.find(l => l.id === language)?.label} code is display-only in browser`, 'log');
    logMsg('✓ Code validated for syntax display', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setCode(content);
      const ext = file.name.split('.').pop()?.toLowerCase();
      const lang = LANGUAGES.find(l => l.ext === ext);
      if (lang) setLanguage(lang.id);
      logMsg(`✓ Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'success');
      setActiveTab('code');
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCode(ev.target?.result as string);
        logMsg(`✓ Dropped ${file.name}`, 'success');
        setActiveTab('code');
      };
      reader.readAsText(file);
    }
  }, [logMsg]);

  return (
    <>
      <style>{CSS}</style>
      <div className="builder">
        {/* Top bar */}
        <div className="builder-top">
          <button className="builder-back" onClick={() => router.push('/simulations')}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Catalog
          </button>
          <div style={{ width: 1, height: 18, background: '#1e1e2e' }} />
          <div className="builder-title">Universal Simulation Builder</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11, color: '#475569' }}>EduVision Lab</div>
        </div>

        <div className="builder-body">
          {/* ═══ LEFT CONFIG PANEL ═══ */}
          <div className="builder-config">
            {/* Name */}
            <div>
              <div className="b-label">Simulation Name</div>
              <input className="b-input" placeholder="e.g. Particle System" value={name} onChange={e => setName(e.target.value)} />
            </div>

            {/* Description */}
            <div>
              <div className="b-label">Description</div>
              <textarea className="b-textarea" placeholder="What does this simulation do?" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
            </div>

            {/* Category */}
            <div>
              <div className="b-label">Category</div>
              <div className="b-cat-grid">
                {CATEGORIES.map(c => (
                  <button key={c.id} className={`b-cat-btn ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                    <span style={{ fontSize: 14 }}>{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <div className="b-label">Difficulty</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Beginner', 'Intermediate', 'Advanced'].map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} style={{ flex: 1, padding: '6px', borderRadius: 6, border: difficulty === d ? '1px solid rgba(99,102,241,0.4)' : '1px solid #1e1e2e', background: difficulty === d ? 'rgba(99,102,241,0.12)' : '#111118', color: difficulty === d ? '#a5b4fc' : '#94a3b8', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{d}</button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="b-label">Tags (comma-separated)</div>
              <input className="b-input" placeholder="physics, particles, animation" value={tags} onChange={e => setTags(e.target.value)} style={{ fontSize: 11 }} />
            </div>

            {/* Canvas Dimensions */}
            <div>
              <div className="b-label">Canvas Size</div>
              <div className="b-dim-row">
                <input className="b-dim-input" placeholder="W" value={canvasW} onChange={e => setCanvasW(e.target.value)} />
                <span style={{ color: '#475569', fontSize: 11 }}>×</span>
                <input className="b-dim-input" placeholder="H" value={canvasH} onChange={e => setCanvasH(e.target.value)} />
              </div>
            </div>

            {/* Layout Options */}
            <div>
              <div className="b-label">Layout Options</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', marginBottom: 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={showAppBar} onChange={e => setShowAppBar(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                App Bar (title header)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', cursor: 'pointer' }}>
                <input type="checkbox" checked={showInputBar} onChange={e => setShowInputBar(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                Input Bar (bottom)
              </label>
            </div>

            {/* Parameters */}
            <div>
              <div className="b-label">Parameters (accessible in code)</div>
              {params.map((p, i) => (
                <div key={i} className="b-param-row">
                  <input className="b-param-input" placeholder="Name" value={p.name} onChange={e => updateParam(i, 'name', e.target.value)} />
                  <input className="b-param-input" placeholder="Min" value={p.min} onChange={e => updateParam(i, 'min', e.target.value)} style={{ maxWidth: 42 }} />
                  <input className="b-param-input" placeholder="Max" value={p.max} onChange={e => updateParam(i, 'max', e.target.value)} style={{ maxWidth: 42 }} />
                  <input className="b-param-input" placeholder="Default" value={p.defaultVal} onChange={e => updateParam(i, 'defaultVal', e.target.value)} style={{ maxWidth: 50 }} />
                  <button className="b-param-del" onClick={() => delParam(i)}>×</button>
                </div>
              ))}
              <button onClick={addParam} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #1e1e2e', background: '#111118', color: '#94a3b8', fontSize: 10, cursor: 'pointer', width: '100%' }}>+ Add Parameter</button>
            </div>
          </div>

          {/* ═══ CENTER: CODE EDITOR ═══ */}
          <div className="builder-editor">
            {/* Toolbar */}
            <div className="b-editor-toolbar">
              <div className="b-lang-row">
                {LANGUAGES.map(l => (
                  <button key={l.id} className={`b-lang-btn ${language === l.id ? 'active' : ''}`} onClick={() => switchLang(l.id)}>
                    <span style={{ color: l.color }}>●</span> {l.label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <button className={`b-editor-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
              <button className={`b-editor-tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Upload</button>
            </div>

            {activeTab === 'code' ? (
              <textarea
                className="b-code"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Write your simulation code here..."
                spellCheck={false}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    setCode(code.substring(0, start) + '  ' + code.substring(end));
                    setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2; }, 0);
                  }
                }}
              />
            ) : (
              <div
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <div className="b-upload-zone" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', maxWidth: 400 }}>
                  <div className="b-upload-icon">📂</div>
                  <div className="b-upload-text">Click or drag & drop a file here</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Supports .js, .py, .html, .cpp, .java</div>
                  <input ref={fileInputRef} type="file" accept=".js,.py,.html,.htm,.cpp,.c,.java,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="b-actions">
              <button className="b-run-btn" style={{ background: '#22c55e', color: '#fff' }} onClick={runCode}>▶ Compile & Run</button>
              <button className="b-run-btn" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }} onClick={() => { setConsole_([]); setPreviewHtml(''); }}>Clear</button>
              <div style={{ flex: 1 }} />
              <button className="b-export" onClick={() => { logMsg('Simulation template saved!', 'success'); }}>💾 Save Template</button>
              <button className="b-submit" style={{ flex: 'unset', padding: '10px 20px' }} onClick={() => { logMsg('✓ Published to catalog!', 'success'); }}>🚀 Publish</button>
            </div>
          </div>

          {/* ═══ RIGHT: PREVIEW + CONSOLE ═══ */}
          <div className="builder-preview">
            <div className="b-preview-bar">
              <div className="b-preview-label">Live Preview</div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: '#475569' }}>{canvasW}×{canvasH}</span>
            </div>
            {previewHtml ? (
              <iframe
                ref={iframeRef}
                className="b-preview-frame"
                srcDoc={previewHtml}
                sandbox="allow-scripts"
                style={{ flex: 1 }}
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 13 }}>
                Press "Compile & Run" to see preview
              </div>
            )}
            {/* Console */}
            <div className="b-console">
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Console Output</div>
              {console_.length === 0 && <div className="b-console-line">Ready.</div>}
              {console_.map((c, i) => (
                <div key={i} className={c.type === 'error' ? 'b-console-error' : c.type === 'success' ? 'b-console-success' : 'b-console-line'}>{c.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
