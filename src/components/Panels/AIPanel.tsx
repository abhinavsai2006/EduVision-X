'use client';
/* ═══════════════════════════════════════════════════════
   AIPanel v5.0 — Premium AI Chat + Actions
   Typing indicators, animated messages, smart suggestions
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';
import { useToastStore } from '@/store/useToastStore';
import { createElement } from '@/lib/elements';
import Modal from '../UI/Modal';

interface Message { role: 'user' | 'assistant'; content: string; timestamp?: number; }

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    className="flex items-center gap-2 p-3 mr-auto"
    style={{
      background: 'var(--bg-primary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      maxWidth: '70%',
    }}
  >
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>AI is thinking...</span>
  </motion.div>
);

export default function AIPanel() {
  const slides = useSlideStore(s => s.presentation.slides);
  const currentSlideIndex = useSlideStore(s => s.currentSlideIndex);
  const addElement = useSlideStore(s => s.addElement);
  const setSlides = useSlideStore(s => s.setSlides);
  const snapshot = useSlideStore(s => s.snapshot);
  const toast = useToastStore(s => s.addToast);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemma3:1b');
  const [models, setModels] = useState<string[]>(['gemma3:1b']);
  const [genOpen, setGenOpen] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genCount, setGenCount] = useState(5);
  const [genStyle, setGenStyle] = useState('educational');
  const [genInstructions, setGenInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'actions'>('chat');
  const chatEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const slide = slides[currentSlideIndex];

  useEffect(() => {
    fetch('/api/ai/status').then(r => r.json()).then(d => {
      if (d.models) setModels(d.models);
    }).catch(() => {});
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const getSlideContext = () => {
    const texts = slide.elements.map(e => e.content || e.question || e.front || '').filter(Boolean);
    return texts.length > 0 ? `Current slide content: ${texts.join('; ')}` : 'Slide is empty.';
  };

  const sendChat = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    if (inputRef.current) inputRef.current.style.height = '38px';
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.slice(-10), model, context: getSlideContext() }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error || 'No response', timestamp: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to AI service. Make sure Ollama is running.', timestamp: Date.now() }]);
    }
    setLoading(false);
  }, [input, messages, model, slide]);

  const quickAction = async (action: string) => {
    setLoading(true);
    setActiveTab('chat');
    const ctx = getSlideContext();
    const promptMap: Record<string, string> = {
      summarize: `Summarize this slide in 3-5 bullet points: ${ctx}`,
      improve: `Give 3-5 specific improvement suggestions for this slide: ${ctx}`,
      quiz: `Create a quiz question with 4 options from this content (format as JSON with question, options array, correct index): ${ctx}`,
      explain: `Explain the code or content on this slide step by step: ${ctx}`,
      simplify: `Simplify this content for a wider audience: ${ctx}`,
      examples: `Give practical examples for the concepts on this slide: ${ctx}`,
      outline: `Create a detailed outline for a presentation based on this slide: ${ctx}`,
      translate: `Translate the content of this slide to Spanish: ${ctx}`,
    };
    const prompt = promptMap[action] || ctx;
    setMessages(prev => [...prev, { role: 'user', content: `[${action.toUpperCase()}] Analyzing slide...`, timestamp: Date.now() }]);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model }),
      });
      const data = await res.json();
      const reply = data.response || data.error || 'No response';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);

      if (action === 'quiz') {
        try {
          const json = JSON.parse(reply.match(/\{[\s\S]*\}/)?.[0] || '{}');
          if (json.question) {
            snapshot();
            addElement(createElement('quiz', {
              question: json.question,
              options: json.options || [],
              correct: json.correct ?? 0,
            }));
            toast('success', 'Quiz added to slide');
          }
        } catch { /* not valid JSON */ }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'AI unavailable', timestamp: Date.now() }]);
    }
    setLoading(false);
  };

  const generateSlides = async () => {
    if (!genTopic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic, count: genCount, style: genStyle, instructions: genInstructions, model }),
      });
      const data = await res.json();
      if (data.slides) {
        snapshot();
        setSlides(data.slides);
        toast('success', `Generated ${data.slides.length} slides`);
        setGenOpen(false);
      } else {
        toast('error', data.error || 'Generation failed');
      }
    } catch {
      toast('error', 'Failed to generate slides');
    }
    setLoading(false);
  };

  const quickBtns = [
    { label: 'Summarize', icon: '📝', desc: 'Condense slide content', action: () => quickAction('summarize'), color: 'var(--teal)' },
    { label: 'Improve', icon: '💡', desc: 'Get suggestions', action: () => quickAction('improve'), color: 'var(--amber)' },
    { label: 'Make Quiz', icon: '❓', desc: 'Auto-create quiz', action: () => quickAction('quiz'), color: 'var(--violet)' },
    { label: 'Explain', icon: '📖', desc: 'Step-by-step breakdown', action: () => quickAction('explain'), color: 'var(--sky)' },
    { label: 'Simplify', icon: '✨', desc: 'Easier language', action: () => quickAction('simplify'), color: 'var(--pink)' },
    { label: 'Examples', icon: '📌', desc: 'Add real examples', action: () => quickAction('examples'), color: 'var(--lime)' },
    { label: 'Outline', icon: '📋', desc: 'Create presentation outline', action: () => quickAction('outline'), color: 'var(--orange)' },
    { label: 'Translate', icon: '🌐', desc: 'Translate content', action: () => quickAction('translate'), color: 'var(--rose)' },
  ];

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = '38px';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Top bar: Model + Generate + Tab toggle */}
        <div className="flex items-center gap-2 px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <select className="select-field" style={{ fontSize: 11, padding: '4px 24px 4px 8px', flex: 1 }}
            value={model} onChange={e => setModel(e.target.value)}>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <motion.button
            className="flex items-center gap-1 shrink-0"
            style={{
              padding: '4px 10px', fontSize: 10, fontWeight: 600,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-solid))',
              color: '#fff', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setGenOpen(true)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Generate
          </motion.button>
        </div>

        {/* Tab toggle */}
        <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {(['chat', 'actions'] as const).map(tab => (
            <button key={tab}
              className="flex-1 relative"
              style={{
                padding: '8px 0', fontSize: 11, fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textTransform: 'capitalize',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'chat' ? '💬 Chat' : '⚡ Quick Actions'}
              {activeTab === tab && (
                <motion.div layoutId="ai-tab-indicator"
                  className="absolute bottom-0 left-3 right-3"
                  style={{ height: 2, background: 'var(--accent)', borderRadius: 99 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'actions' ? (
          /* Quick Actions Grid */
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {quickBtns.map(b => (
                <motion.button key={b.label}
                  className="flex flex-col items-start gap-1 p-2.5 rounded-lg text-left"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.02, borderColor: 'var(--border-bold)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={b.action}
                  disabled={loading}
                >
                  <span style={{ fontSize: 18 }}>{b.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{b.label}</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.3 }}>{b.desc}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat messages */
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-8 px-4"
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  AI Assistant
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Ask me to improve your slides, generate content, create quizzes, or explain concepts.
                </span>
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {['Improve this slide', 'Add more detail', 'Create a quiz'].map(suggestion => (
                    <button key={suggestion}
                      className="btn-ghost"
                      style={{ fontSize: 10, padding: '4px 10px', border: '1px solid var(--border)' }}
                      onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                    >{suggestion}</button>
                  ))}
                </div>
              </motion.div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col gap-1 max-w-[92%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center gap-1.5" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                    {msg.role === 'assistant' && (
                      <span style={{
                        width: 14, height: 14, borderRadius: 'var(--radius-xs)',
                        background: 'var(--accent-dim)', display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                      </span>
                    )}
                    <span>{msg.role === 'user' ? 'You' : 'AI'}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.6,
                      padding: '8px 12px',
                      borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, var(--accent), var(--accent-solid))'
                        : 'var(--bg-primary)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                      wordBreak: 'break-word',
                    }}
                  >
                    <pre className="whitespace-pre-wrap font-sans m-0">{msg.content}</pre>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {loading && <TypingIndicator />}
            </AnimatePresence>
            <div ref={chatEnd} />
          </div>
        )}

        {/* Input area */}
        <div className="shrink-0 p-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-end gap-1.5"
            style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-bold)',
              padding: '4px 4px 4px 12px',
            }}>
            <textarea
              ref={inputRef}
              className="flex-1 outline-none resize-none"
              style={{
                fontSize: 12, minHeight: 30, maxHeight: 120,
                background: 'transparent', color: 'var(--text-primary)',
                border: 'none', padding: '6px 0', lineHeight: 1.5,
                fontFamily: 'var(--font-body)',
              }}
              placeholder="Ask AI anything..."
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
              disabled={loading}
              rows={1}
            />
            <motion.button
              className="flex items-center justify-center shrink-0"
              style={{
                width: 32, height: 32,
                background: input.trim() ? 'var(--accent)' : 'var(--bg-surface)',
                color: input.trim() ? '#fff' : 'var(--text-muted)',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                borderRadius: 'var(--radius-md)',
              }}
              whileHover={input.trim() ? { scale: 1.06 } : {}}
              whileTap={input.trim() ? { scale: 0.92 } : {}}
              onClick={sendChat}
              disabled={loading || !input.trim()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </motion.button>
          </div>
          {messages.length > 0 && (
            <button
              className="btn-ghost w-full mt-1.5"
              style={{ fontSize: 10, color: 'var(--text-muted)' }}
              onClick={() => setMessages([])}
            >Clear conversation</button>
          )}
        </div>
      </div>

      {/* AI Generate Modal */}
      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="AI Slide Generator" width="440px">
        <div className="space-y-4">
          <div>
            <label className="panel-section-title" style={{ marginBottom: 6, display: 'block' }}>Topic</label>
            <input className="input-field" placeholder="e.g. Machine Learning Basics"
              value={genTopic} onChange={e => setGenTopic(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="panel-section-title" style={{ marginBottom: 6, display: 'block' }}>Slides</label>
              <input type="number" min={3} max={20} className="input-field"
                value={genCount} onChange={e => setGenCount(+e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="panel-section-title" style={{ marginBottom: 6, display: 'block' }}>Style</label>
              <select className="select-field" value={genStyle} onChange={e => setGenStyle(e.target.value)}>
                {['educational', 'technical', 'creative', 'minimal', 'detailed', 'corporate', 'playful'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="panel-section-title" style={{ marginBottom: 6, display: 'block' }}>Instructions (optional)</label>
            <textarea className="input-field" style={{ minHeight: 64, resize: 'vertical' }}
              placeholder="Additional instructions for the AI..."
              value={genInstructions} onChange={e => setGenInstructions(e.target.value)} />
          </div>
          <motion.button
            className="btn-primary w-full"
            style={{ padding: '10px 20px' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateSlides}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
                Generate Slides
              </span>
            )}
          </motion.button>
        </div>
      </Modal>
    </>
  );
}
