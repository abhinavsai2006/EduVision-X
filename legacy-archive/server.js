/*  ─────────────────────────────────────────────────────
    EduSlide Platform v3.0 — Express Server + Ollama AI
    ───────────────────────────────────────────────────── */
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const http    = require('http');
const multer  = require('multer');

const app  = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

/* ── middleware ────────────────────────────────────── */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'app')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/samples', express.static(path.join(__dirname, 'samples')));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _f, cb) => {
      const dir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});

/* ══════════════════════════════════════════════════════
   OLLAMA AI ENGINE
   ══════════════════════════════════════════════════════ */
function ollamaFetch(urlPath, payload, timeout = 180000) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlPath, OLLAMA_HOST);
    const data = JSON.stringify(payload);
    const reqOpts = {
      hostname: parsedUrl.hostname, port: parsedUrl.port, path: parsedUrl.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      timeout
    };
    const req = http.request(reqOpts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({ response: body }); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(data); req.end();
  });
}

async function ollamaChat(model, messages, opts = {}) {
  const res = await ollamaFetch('/api/chat', {
    model: model || 'gemma3:1b', messages, stream: false,
    options: { temperature: opts.temperature ?? 0.7, num_predict: opts.max_tokens ?? 2048 }
  });
  return res.message?.content || res.response || 'No response';
}

async function ollamaGenerate(model, prompt, opts = {}) {
  const res = await ollamaFetch('/api/generate', {
    model: model || 'gemma3:1b', prompt, stream: false,
    options: { temperature: opts.temperature ?? 0.7, num_predict: opts.max_tokens ?? 4096, top_p: 0.9 }
  });
  return res.response || '';
}

/* ── AI status ────────────────────────────────────── */
app.get('/api/ai/status', async (_req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      http.get(`${OLLAMA_HOST}/api/tags`, { timeout: 5000 }, resp => {
        let d = ''; resp.on('data', c => d += c);
        resp.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error('parse')); } });
      }).on('error', reject);
    });
    res.json({ ok: true, provider: 'ollama', host: OLLAMA_HOST,
      models: (data.models || []).map(m => ({ name: m.name, size: m.size, modified: m.modified_at })) });
  } catch {
    res.json({ ok: false, provider: 'none', error: 'Ollama not reachable', models: [] });
  }
});

/* ── AI Chat ──────────────────────────────────────── */
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    const result = await ollamaChat(model, messages, { temperature, max_tokens });
    res.json({ ok: true, result });
  } catch (e) {
    console.error('AI chat error:', e.message);
    res.json({ ok: true, result: localFallback(req.body) });
  }
});

/* ══════════════════════════════════════════════════════
   AI GENERATE SLIDES — WITH AUTO-LAYOUT
   ══════════════════════════════════════════════════════ */
app.post('/api/ai/generate-slides', async (req, res) => {
  try {
    const { topic, slideCount, style, model } = req.body;
    const count = slideCount || 5;
    const prompt = `Create a ${count}-slide educational presentation about "${topic}".
Style: ${style || 'educational'}.

Return ONLY valid JSON. No markdown fences. No explanation text.
{
  "title": "Title",
  "slides": [
    {
      "elements": [
        {"type":"heading","content":"Title"},
        {"type":"text","content":"Body"},
        {"type":"list","items":["A","B","C"]},
        {"type":"code","content":"code","language":"javascript"},
        {"type":"math","content":"E=mc^2"},
        {"type":"note","content":"Note"},
        {"type":"quiz","question":"Q?","options":["A","B","C","D"],"correct":0}
      ],
      "notes":"Speaker notes"
    }
  ]
}

Rules: First=title, Last=summary, 2-4 elements/slide, include quiz+code.`;

    let raw = '';
    try { raw = await ollamaGenerate(model, prompt, { temperature: 0.7, max_tokens: 4096 }); }
    catch (e) { console.error('Ollama fail:', e.message); }

    let parsed = tryParseJSON(raw);
    if (parsed && parsed.slides && parsed.slides.length > 0) {
      parsed.slides = parsed.slides.map(s => autoLayoutSlide(s));
      res.json({ ok: true, result: parsed });
    } else {
      console.log('AI parse failed, using fallback for:', topic);
      res.json({ ok: true, result: localSlides(topic, count, style) });
    }
  } catch (e) {
    console.error('Generate error:', e.message);
    res.json({ ok: true, result: localSlides(req.body.topic, req.body.slideCount || 5) });
  }
});

/* ══════════════════════════════════════════════════════
   AUTO-LAYOUT ENGINE — Prevents overlapping
   ══════════════════════════════════════════════════════ */
function autoLayoutSlide(slideData) {
  const elements = slideData.elements || [];
  let y = 30;
  const PAD = 50, SLIDE_W = 960, W = SLIDE_W - PAD * 2;

  const laid = elements.map((el, idx) => {
    const base = { ...el, x: PAD, width: W };
    switch (el.type) {
      case 'heading': {
        const isTitle = idx === 0 && elements.length <= 2;
        const h = isTitle ? 70 : 55;
        const obj = { ...base, y: isTitle ? 180 : y, height: h, level: el.level || (idx === 0 ? 1 : 2),
          style: { fontSize: isTitle ? '42px' : '32px', fontWeight: 'bold', color: '#1a1a2e',
            fontFamily: 'Segoe UI', textAlign: isTitle ? 'center' : 'left' } };
        y = (isTitle ? 180 : y) + h + 16;
        return obj;
      }
      case 'text': {
        const lines = Math.ceil((el.content || '').length / 80);
        const h = Math.max(40, lines * 28 + 10);
        const isSub = idx === 1 && elements[0]?.type === 'heading' && elements.length <= 3;
        const obj = { ...base, y, height: h,
          style: { fontSize: isSub ? '22px' : '18px', color: isSub ? '#666' : '#444',
            fontFamily: 'Segoe UI', lineHeight: '1.6', textAlign: isSub ? 'center' : 'left' } };
        y += h + 14;
        return obj;
      }
      case 'list': {
        const h = Math.max(100, (el.items || []).length * 36 + 16);
        const obj = { ...base, y, height: h, style: { fontSize: '18px', color: '#444', lineHeight: '1.7' } };
        y += h + 14;
        return obj;
      }
      case 'code': {
        const h = Math.min(300, Math.max(120, (el.content || '').split('\n').length * 22 + 50));
        const obj = { ...base, y, height: h, executable: el.executable !== false,
          language: el.language || 'javascript', style: { fontSize: '13px', fontFamily: 'Fira Code, monospace' } };
        y += h + 14;
        return obj;
      }
      case 'math': {
        const obj = { ...base, y, height: 60, style: { fontSize: '28px', color: '#2d3436', textAlign: 'center' } };
        y += 74;
        return obj;
      }
      case 'quiz': {
        const h = Math.max(160, 50 + (el.options || []).length * 42);
        const obj = { ...base, y, height: h };
        y += h + 14;
        return obj;
      }
      case 'note': {
        const h = Math.max(50, Math.ceil((el.content || '').length / 80) * 24 + 24);
        const obj = { ...base, y, height: h };
        y += h + 14;
        return obj;
      }
      case 'chart': {
        const obj = { ...base, y, height: 250, chartType: el.chartType || 'bar',
          data: el.data || { labels: ['A','B','C','D'], values: [30,60,45,80] } };
        y += 264;
        return obj;
      }
      case 'divider': {
        const obj = { ...base, y: y + 4, height: 4 };
        y += 18;
        return obj;
      }
      case 'table': {
        const rows = el.rows || 4;
        const h = Math.max(120, rows * 32 + 30);
        const obj = { ...base, y, height: h, rows: el.rows || 4, cols: el.cols || 4, data: el.data };
        y += h + 14;
        return obj;
      }
      case 'connector': {
        const obj = { ...base, y, height: 4 };
        y += 20;
        return obj;
      }
      case 'poll': {
        const h = Math.max(180, 50 + (el.options || []).length * 44);
        const obj = { ...base, y, height: h };
        y += h + 14;
        return obj;
      }
      case 'flashcard': {
        const obj = { ...base, y, height: 220, width: Math.min(W, 500) };
        y += 234;
        return obj;
      }
      case 'timer': {
        const obj = { ...base, y, height: 100, width: 200 };
        y += 114;
        return obj;
      }
      case 'callout': {
        const h = Math.max(60, Math.ceil((el.content || '').length / 70) * 24 + 30);
        const obj = { ...base, y, height: h };
        y += h + 14;
        return obj;
      }
      case 'progress': {
        const obj = { ...base, y, height: 40 };
        y += 54;
        return obj;
      }
      default: {
        const obj = { ...base, y, height: 50 };
        y += 64;
        return obj;
      }
    }
  });
  return { ...slideData, elements: laid };
}

/* ── Other AI endpoints ───────────────────────────── */
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const result = await ollamaChat(req.body.model, [
      { role: 'system', content: 'Provide clear, concise summaries with bullet points. Max 150 words.' },
      { role: 'user', content: `Summarize:\n\n${req.body.content}` }
    ], { temperature: 0.3 });
    res.json({ ok: true, result });
  } catch { res.json({ ok: true, result: '📝 Review the key points highlighted in headings and emphasized text.' }); }
});

app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { content, count, model } = req.body;
    const raw = await ollamaGenerate(model,
      `Create ${count || 3} quiz questions. Return ONLY JSON array:\n[{"question":"...","options":["A","B","C","D"],"correct":0}]\n\nContent: ${content}`,
      { temperature: 0.5 });
    let parsed = tryParseJSON(raw);
    if (!Array.isArray(parsed)) { const m = raw.match(/\[[\s\S]*\]/); if (m) try { parsed = JSON.parse(m[0]); } catch {} }
    res.json({ ok: true, result: Array.isArray(parsed) && parsed.length ? parsed :
      [{ question: 'What is the main concept?', options: ['A', 'B', 'C', 'D'], correct: 0 }] });
  } catch { res.json({ ok: true, result: [{ question: 'What is the main topic?', options: ['A', 'B', 'C', 'D'], correct: 0 }] }); }
});

app.post('/api/ai/improve', async (req, res) => {
  try {
    const result = await ollamaChat(req.body.model, [
      { role: 'system', content: 'Give 3-5 specific, actionable slide improvements.' },
      { role: 'user', content: `Improve:\n${JSON.stringify(req.body.slideData)}` }
    ], { temperature: 0.6 });
    res.json({ ok: true, result });
  } catch { res.json({ ok: true, result: '💡 Add visuals, break text into bullets, include code examples, add quizzes.' }); }
});

app.post('/api/ai/explain-code', async (req, res) => {
  try {
    const result = await ollamaChat(req.body.model, [
      { role: 'system', content: 'Explain code clearly, step by step.' },
      { role: 'user', content: `Explain this ${req.body.language || ''} code:\n\`\`\`\n${req.body.code}\n\`\`\`` }
    ], { temperature: 0.4 });
    res.json({ ok: true, result });
  } catch { res.json({ ok: true, result: '💡 Run the code to see output, then experiment.' }); }
});

/* legacy */
app.post('/api/ai', async (req, res) => {
  try {
    const r = await ollamaChat(req.body.model, req.body.messages || [], { temperature: req.body.temperature, max_tokens: req.body.max_tokens });
    res.json({ ok: true, result: r });
  } catch { res.json({ ok: true, result: localFallback(req.body) }); }
});

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */
function tryParseJSON(str) {
  if (!str || typeof str !== 'string') return null;
  let clean = str.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*"slides"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (m) try { return JSON.parse(m[0]); } catch {}
  const m2 = clean.match(/\{[\s\S]*\}/);
  if (m2) try { const p = JSON.parse(m2[0]); if (p.slides) return p; } catch {}
  return null;
}

function localFallback(body) {
  const t = (body.messages || []).map(m => m.content).join(' ').toLowerCase();
  if (t.includes('summarize') || t.includes('summary'))
    return '📝 **Summary**: Review headings for main ideas, bullet points for details, and code examples for practice.';
  if (t.includes('quiz'))
    return '❓ 1) What is the main concept? 2) How would you apply this? 3) What are the key differences?';
  if (t.includes('explain'))
    return '💡 Step by step:\n1. Core concept in the heading\n2. Supporting details\n3. Code examples — try running them\n4. Test with quizzes';
  if (t.includes('improve'))
    return '✨ Add visuals, break text into bullets, include code examples, add quizzes, use 3D visualizations.';
  return '🤖 I can: Summarize, Explain, Quiz, Improve, Generate slides. What would you like?';
}

function localSlides(topic, count) {
  const slides = [];
  slides.push(autoLayoutSlide({ elements: [
    { type: 'heading', content: topic },
    { type: 'text', content: `A comprehensive overview of ${topic}` }
  ], notes: 'Title slide' }));

  slides.push(autoLayoutSlide({ elements: [
    { type: 'heading', content: 'Overview' },
    { type: 'text', content: `In this presentation, we explore the key concepts and applications of ${topic}.` },
    { type: 'list', items: ['Core concepts and definitions', 'Key principles', 'Practical applications', 'Hands-on examples', 'Summary and review'] }
  ], notes: 'Overview' }));

  for (let i = 1; i <= count - 3; i++) {
    const els = [{ type: 'heading', content: `${topic} — Part ${i}` }];
    if (i % 3 === 1) {
      els.push({ type: 'list', items: [`Key concept ${i}.1 — fundamental principle`, `Key concept ${i}.2 — practical application`, `Key concept ${i}.3 — real-world example`] });
      els.push({ type: 'note', content: `Understanding Part ${i} is essential for the next sections.` });
    } else if (i % 3 === 2) {
      els.push({ type: 'text', content: `This section explores detailed aspects of ${topic} Part ${i}.` });
      els.push({ type: 'code', content: `// Example: ${topic}\nfunction demo() {\n  console.log("Part ${i}");\n  return "result";\n}\ndemo();`, language: 'javascript' });
    } else {
      els.push({ type: 'text', content: `Test your understanding of the concepts covered so far.` });
      els.push({ type: 'quiz', question: `Key takeaway from ${topic} Part ${i}?`,
        options: ['Understanding core principles', 'Memorizing definitions', 'Skipping practice', 'Ignoring examples'], correct: 0 });
    }
    slides.push(autoLayoutSlide({ elements: els, notes: `Section ${i}` }));
  }

  slides.push(autoLayoutSlide({ elements: [
    { type: 'heading', content: 'Summary & Key Takeaways' },
    { type: 'list', items: ['✅ Core concepts reviewed', '✅ Practical examples demonstrated', '✅ Knowledge tested with quizzes', '📖 Continue learning', '🔗 Practice recommended'] },
    { type: 'note', content: 'Thank you! Questions welcome.' }
  ], notes: 'Summary' }));

  return { title: topic, slides };
}

/* ══════════════════════════════════════════════════════
   FILE API
   ══════════════════════════════════════════════════════ */
app.post('/api/save', (req, res) => {
  try {
    const { filename, data } = req.body;
    const dir = path.join(__dirname, 'presentations');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const fn = filename.endsWith('.isl') ? filename : `${filename}.isl`;
    fs.writeFileSync(path.join(dir, fn), JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, filename: fn });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/load/:filename', (req, res) => {
  try {
    let fp = path.join(__dirname, 'presentations', req.params.filename);
    if (!fs.existsSync(fp)) fp = path.join(__dirname, 'samples', req.params.filename);
    if (!fs.existsSync(fp)) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, data: JSON.parse(fs.readFileSync(fp, 'utf8')) });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/presentations', (_req, res) => {
  const files = [];
  ['presentations', 'samples'].forEach(d => {
    const dir = path.join(__dirname, d);
    if (fs.existsSync(dir)) fs.readdirSync(dir).filter(f => f.endsWith('.isl')).forEach(f => {
      const s = fs.statSync(path.join(dir, f));
      files.push({ name: f, folder: d, size: s.size, modified: s.mtime });
    });
  });
  res.json({ ok: true, files });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'No file' });
  res.json({ ok: true, url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});

/* ══════════════════════════════════════════════════════
   TEMPLATE GALLERY
   ══════════════════════════════════════════════════════ */
const TEMPLATES = [
  { id:'lecture', name:'Lecture', icon:'🎓', description:'Classic academic lecture', slides:[
    {elements:[{type:'heading',content:'Lecture Title',style:{fontSize:'42px',fontWeight:'bold',color:'#1a1a2e',textAlign:'center'}},{type:'text',content:'Professor Name — Course Code',style:{fontSize:'22px',color:'#666',textAlign:'center'}}],background:{type:'solid',value:'#ffffff'}},
    {elements:[{type:'heading',content:'Outline',level:2},{type:'list',items:['Introduction','Core Concepts','Examples','Practice','Summary']}]},
    {elements:[{type:'heading',content:'Key Concept'},{type:'text',content:'Detailed explanation here'},{type:'note',content:'Remember this for the exam!'}]},
    {elements:[{type:'heading',content:'Code Example'},{type:'code',content:'function demo() {\n  console.log("Hello!");\n  return 42;\n}',language:'javascript'}]},
    {elements:[{type:'heading',content:'Quiz Time'},{type:'quiz',question:'What did you learn?',options:['Option A','Option B','Option C','Option D'],correct:0}]}
  ]},
  { id:'startup', name:'Startup Pitch', icon:'🚀', description:'Investor pitch deck', slides:[
    {elements:[{type:'heading',content:'Company Name',style:{fontSize:'48px',textAlign:'center'}},{type:'text',content:'One-line description of what we do',style:{textAlign:'center'}}],background:{type:'gradient',value:'linear-gradient(135deg,#667eea,#764ba2)'}},
    {elements:[{type:'heading',content:'The Problem'},{type:'list',items:['Pain point 1','Pain point 2','Market gap']}]},
    {elements:[{type:'heading',content:'Our Solution'},{type:'text',content:'How we solve it'},{type:'chart',chartType:'bar',data:{labels:['Before','After'],values:[20,80]}}]},
    {elements:[{type:'heading',content:'Traction'},{type:'chart',chartType:'line',data:{labels:['Q1','Q2','Q3','Q4'],values:[10,30,60,120]}}]},
    {elements:[{type:'heading',content:'The Ask',style:{textAlign:'center'}},{type:'text',content:'$X funding for Y milestones',style:{textAlign:'center',fontSize:'28px'}}]}
  ]},
  { id:'workshop', name:'Workshop', icon:'🔧', description:'Hands-on workshop', slides:[
    {elements:[{type:'heading',content:'Workshop: Topic',style:{fontSize:'40px',textAlign:'center'}},{type:'text',content:'Hands-on learning experience',style:{textAlign:'center'}}]},
    {elements:[{type:'heading',content:'Prerequisites'},{type:'list',items:['Skill 1','Skill 2','Tool installed']},{type:'note',content:'Make sure everything is set up before we start!'}]},
    {elements:[{type:'heading',content:'Exercise 1'},{type:'code',content:'// Your code here\n\n',language:'javascript'},{type:'timer',duration:600}]},
    {elements:[{type:'heading',content:'Discussion'},{type:'poll',question:'How confident do you feel?',options:['Very','Somewhat','Need more practice','Lost']}]},
    {elements:[{type:'heading',content:'Recap & Next Steps'},{type:'list',items:['What we covered','Homework','Resources','Next session']}]}
  ]},
  { id:'report', name:'Data Report', icon:'📊', description:'Data-driven report', slides:[
    {elements:[{type:'heading',content:'Quarterly Report',style:{fontSize:'42px',textAlign:'center'}},{type:'text',content:'Q4 2025 Performance Overview',style:{textAlign:'center'}}]},
    {elements:[{type:'heading',content:'KPI Dashboard'},{type:'chart',chartType:'bar',data:{labels:['Revenue','Users','NPS','Retention'],values:[85,72,90,78]}}]},
    {elements:[{type:'heading',content:'Growth Trend'},{type:'chart',chartType:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],values:[30,40,35,55,60,80]}}]},
    {elements:[{type:'heading',content:'Distribution'},{type:'chart',chartType:'pie',data:{labels:['Product A','Product B','Product C','Other'],values:[40,30,20,10]}}]},
    {elements:[{type:'heading',content:'Next Quarter Goals'},{type:'table',rows:4,cols:3,data:[['Metric','Target','Owner'],['Revenue','$1M','Sales'],['Users','50K','Marketing'],['NPS','85+','Product']]}]}
  ]},
  { id:'thesis', name:'Thesis Defense', icon:'📚', description:'Academic thesis', slides:[
    {elements:[{type:'heading',content:'Thesis Title',style:{fontSize:'36px',textAlign:'center'}},{type:'text',content:'Author Name\nDepartment, University\nDate',style:{textAlign:'center'}}]},
    {elements:[{type:'heading',content:'Research Question'},{type:'text',content:'What is the central question this research addresses?'},{type:'note',content:'Motivate why this matters'}]},
    {elements:[{type:'heading',content:'Methodology'},{type:'mermaid',content:'graph TD\n  A[Literature Review]-->B[Hypothesis]\n  B-->C[Data Collection]\n  C-->D[Analysis]\n  D-->E[Results]'}]},
    {elements:[{type:'heading',content:'Results'},{type:'chart',chartType:'bar',data:{labels:['Group A','Group B','Control'],values:[78,85,62]}},{type:'math',content:'p < 0.05'}]},
    {elements:[{type:'heading',content:'Conclusion & Future Work'},{type:'list',items:['Key finding 1','Key finding 2','Limitation','Future direction']}]}
  ]},
  { id:'creative', name:'Creative Brief', icon:'🎨', description:'Design presentation', slides:[
    {elements:[{type:'heading',content:'Creative Brief',style:{fontSize:'48px',textAlign:'center',color:'#fff'}},{type:'text',content:'Project Name — 2026',style:{textAlign:'center',color:'#fff'}}],background:{type:'gradient',value:'linear-gradient(135deg,#f093fb,#f5576c)'}},
    {elements:[{type:'heading',content:'The Vision'},{type:'text',content:'What we want to achieve and why it matters'}]},
    {elements:[{type:'heading',content:'Mood Board'},{type:'shape',shape:'rectangle',style:{fill:'#f0f0f0'}},{type:'shape',shape:'circle',style:{fill:'#e17055'}},{type:'shape',shape:'rectangle',style:{fill:'#00b894'}}]},
    {elements:[{type:'heading',content:'Color Palette'},{type:'shape',shape:'rectangle',style:{fill:'#6c5ce7'}},{type:'shape',shape:'rectangle',style:{fill:'#00cec9'}},{type:'shape',shape:'rectangle',style:{fill:'#fdcb6e'}}]},
    {elements:[{type:'heading',content:'Timeline'},{type:'timeline',entries:[{date:'Week 1',text:'Concept'},{date:'Week 2',text:'Design'},{date:'Week 3',text:'Review'},{date:'Week 4',text:'Deliver'}]}]}
  ]}
];

app.get('/api/templates', (_req, res) => {
  res.json({ ok: true, templates: TEMPLATES.map(t => ({ id: t.id, name: t.name, icon: t.icon, description: t.description, slideCount: t.slides.length })) });
});

app.get('/api/templates/:id', (req, res) => {
  const tmpl = TEMPLATES.find(t => t.id === req.params.id);
  if (!tmpl) return res.status(404).json({ ok: false, error: 'Template not found' });
  const slides = tmpl.slides.map(s => autoLayoutSlide(s));
  res.json({ ok: true, template: { ...tmpl, slides } });
});

/* ── Autosave ─────────────────────────────────────── */
app.post('/api/autosave', (req, res) => {
  try {
    const dir = path.join(__dirname, 'presentations');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, '_autosave.isl'), JSON.stringify(req.body.data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get('/api/autosave', (_req, res) => {
  try {
    const fp = path.join(__dirname, 'presentations', '_autosave.isl');
    if (!fs.existsSync(fp)) return res.json({ ok: false });
    res.json({ ok: true, data: JSON.parse(fs.readFileSync(fp, 'utf8')) });
  } catch { res.json({ ok: false }); }
});

/* ══════════════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════════════ */
app.post('/api/export/html', (req, res) => {
  try {
    const { presentation } = req.body;
    const html = genHTML(presentation);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${(presentation.meta?.title || 'presentation').replace(/[^a-z0-9]/gi, '_')}.html"`);
    res.send(html);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

function genHTML(p) {
  const e = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${e(p.meta?.title||'Presentation')}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,system-ui,sans-serif;background:#0f0f23;overflow:hidden}#app{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}.slide{width:960px;height:540px;background:#fff;border-radius:12px;position:relative;box-shadow:0 25px 80px rgba(0,0,0,.5);overflow:hidden}.el{position:absolute;overflow:hidden}.el h1,.el h2,.el h3{font-weight:700;line-height:1.2}.el p{line-height:1.6}.el ul{padding-left:24px;line-height:1.7}.code{background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;font-family:'Fira Code',monospace;font-size:13px;position:relative;overflow:auto;height:100%;white-space:pre-wrap}.code .rb{position:absolute;top:8px;right:8px;background:#6c5ce7;color:#fff;border:none;padding:5px 14px;border-radius:6px;cursor:pointer;font-size:11px}.cout{background:#11111b;color:#a6e3a1;padding:10px;font-family:'Fira Code',monospace;font-size:12px;display:none}.note{background:#ffeaa7;color:#2d3436;padding:12px 16px;border-radius:8px;font-style:italic;border-left:4px solid #fdcb6e;height:100%}.math{text-align:center;padding:12px}.quiz{background:#f8f9fa;border-radius:10px;padding:16px;border:2px solid #e9ecef;height:100%}.quiz h3{color:#2d3436;margin-bottom:10px}.qo{display:block;width:100%;text-align:left;padding:8px 14px;margin:5px 0;background:#fff;border:2px solid #dfe6e9;border-radius:8px;cursor:pointer;font-size:14px}.qo:hover{border-color:#6c5ce7}.qo.c{background:#d4edda;border-color:#28a745}.qo.w{background:#f8d7da;border-color:#dc3545}.sn{position:absolute;bottom:10px;right:16px;font-size:12px;color:#aaa}.bar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:99}.bar button{padding:10px 22px;border:none;border-radius:8px;background:rgba(108,92,231,.9);color:#fff;font-size:14px;cursor:pointer;font-family:Inter}.bar button:hover{background:#6c5ce7}.prog{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#6c5ce7,#a29bfe);transition:width .3s;z-index:99}</style></head><body>
<div class="prog" id="p"></div><div id="app"><div class="slide" id="s"></div></div>
<div class="bar"><button onclick="pv()">◀</button><span id="i" style="color:#fff;line-height:42px;font-size:14px;min-width:80px;text-align:center"></span><button onclick="nx()">▶</button><button onclick="document.documentElement.requestFullscreen?.()">⛶</button></div>
<script>const P=${JSON.stringify(p)};let x=0;function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function r(){const s=P.slides[x];if(!s)return;const sl=document.getElementById('s');sl.innerHTML='';sl.style.background=s.background?.type==='gradient'?s.background.value:(s.background?.value||'#fff');
(s.elements||[]).forEach((e,i)=>{const d=document.createElement('div');d.className='el';d.style.cssText='left:'+(e.x||50)+'px;top:'+(e.y||50)+'px;width:'+(e.width||860)+'px;height:'+(e.height||50)+'px;opacity:'+(e.opacity??1);
switch(e.type){case'heading':d.innerHTML='<h'+(e.level||1)+' style="font-size:'+(e.style?.fontSize||'32px')+';color:'+(e.style?.color||'#1a1a2e')+';font-weight:bold;text-align:'+(e.style?.textAlign||'left')+'">'+esc(e.content)+'</h'+(e.level||1)+'>';break;case'text':d.innerHTML='<p style="font-size:'+(e.style?.fontSize||'18px')+';color:'+(e.style?.color||'#444')+';text-align:'+(e.style?.textAlign||'left')+'">'+esc(e.content)+'</p>';break;case'list':d.innerHTML='<ul style="font-size:'+(e.style?.fontSize||'18px')+';color:'+(e.style?.color||'#444')+'">'+(e.items||[]).map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>';break;case'code':d.innerHTML='<div class="code"><button class="rb" onclick="rc('+i+')">▶ Run</button><pre id="c'+i+'">'+esc(e.content)+'</pre></div><div class="cout" id="o'+i+'"></div>';break;case'math':d.innerHTML='<div class="math" data-m="'+esc(e.content)+'"></div>';break;case'note':d.innerHTML='<div class="note">💡 '+esc(e.content)+'</div>';break;case'quiz':d.innerHTML='<div class="quiz"><h3>❓ '+esc(e.question)+'</h3>'+(e.options||[]).map((o,j)=>'<button class="qo" onclick="ck(this,'+j+','+(e.correct||0)+')">'+esc(o)+'</button>').join('')+'</div>';break;case'divider':d.innerHTML='<hr style="border:none;height:3px;background:linear-gradient(90deg,transparent,#dfe6e9,transparent)">';break}
sl.appendChild(d)});
sl.innerHTML+='<div class="sn">'+(x+1)+'/'+P.slides.length+'</div>';document.getElementById('i').textContent=(x+1)+'/'+P.slides.length;document.getElementById('p').style.width=((x+1)/P.slides.length*100)+'%';
document.querySelectorAll('[data-m]').forEach(el=>{try{katex.render(el.dataset.m,el,{throwOnError:false,displayMode:true})}catch{el.textContent=el.dataset.m}})}
function nx(){if(x<P.slides.length-1){x++;r()}}function pv(){if(x>0){x--;r()}}function ck(b,s,c){b.parentElement.querySelectorAll('.qo').forEach((q,i)=>{q.classList.remove('c','w');if(i===c)q.classList.add('c');else if(i===s)q.classList.add('w');q.disabled=true})}
function rc(i){const s=P.slides[x];const e=(s.elements||[])[i];if(!e)return;const o=document.getElementById('o'+i);o.style.display='block';try{const l=[];const ol=console.log;console.log=(...a)=>l.push(a.join(' '));const v=new Function(e.content)();console.log=ol;o.textContent=l.join('\\n')+(v!==undefined?'\\n→ '+v:'');o.style.color='#a6e3a1'}catch(er){o.textContent='Error: '+er.message;o.style.color='#e17055'}}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')nx();else if(e.key==='ArrowLeft')pv();else if(e.key==='f')document.documentElement.requestFullscreen?.();else if(e.key==='Escape')document.exitFullscreen?.()});r()<\/script></body></html>`;
}

/* ── Start ────────────────────────────────────────── */
['presentations', 'uploads'].forEach(d => { const p = path.join(__dirname, d); if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); });

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║             🎓  EduSlide Platform  v3.0                   ║
║                                                           ║
║   Editor    →  http://localhost:${PORT}                      ║
║   Viewer    →  http://localhost:${PORT}/viewer.html           ║
║   AI Engine →  Ollama (${OLLAMA_HOST})              ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
