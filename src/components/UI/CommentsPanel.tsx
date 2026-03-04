'use client';
/* ═══════════════════════════════════════════════════════
   CommentsPanel — Slide annotations / comments overlay
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from 'react';
import { useSlideStore } from '@/store/useSlideStore';
import { uid } from '@/lib/elements';

interface Comment {
  id: string;
  text: string;
  x: number;
  y: number;
  timestamp: string;
  resolved: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommentsPanel({ open, onClose }: Props) {
  const currentSlide = useSlideStore(s => s.presentation.slides[s.currentSlideIndex]);
  const updateSlideField = useSlideStore(s => s.updateSlideField);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newText, setNewText] = useState('');
  const [placing, setPlacing] = useState(false);

  const addComment = useCallback(() => {
    if (!newText.trim()) return;
    const comment: Comment = {
      id: uid(),
      text: newText.trim(),
      x: 50 + Math.random() * 300,
      y: 50 + Math.random() * 200,
      timestamp: new Date().toLocaleTimeString(),
      resolved: false,
    };
    setComments(prev => [...prev, comment]);
    setNewText('');
    // Also append to slide notes for persistence
    const noteText = currentSlide?.notes || '';
    updateSlideField('notes', noteText + (noteText ? '\n' : '') + `[Comment] ${comment.text}`);
  }, [newText, currentSlide, updateSlideField]);

  const resolveComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-8 bottom-0 w-72 z-[150] flex flex-col shadow-xl"
      style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          💬 Comments ({comments.filter(c => !c.resolved).length})
        </span>
        <button onClick={onClose} className="text-xs" style={{ color: 'var(--text-muted)' }}>✕</button>
      </div>

      {/* Add comment */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <textarea
          className="w-full text-xs p-2 rounded border resize-none"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          rows={2}
          placeholder="Add a comment…"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addComment(); }}
        />
        <div className="flex gap-2 mt-1">
          <button
            className="flex-1 text-[10px] py-1 rounded text-white font-medium"
            style={{ background: 'var(--accent)' }}
            onClick={addComment}
          >
            Add Comment
          </button>
          <button
            className={`text-[10px] px-2 py-1 rounded ${placing ? 'ring-1 ring-[var(--accent)]' : ''}`}
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
            onClick={() => setPlacing(!placing)}
            title="Pin comment to location on slide"
          >
            📌
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-2">
        {comments.length === 0 && (
          <div className="text-center py-8 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            No comments yet.<br />Add annotations to collaborate.
          </div>
        )}
        {comments.map(c => (
          <div
            key={c.id}
            className="mb-2 p-2 rounded-lg text-xs"
            style={{
              background: c.resolved ? 'var(--bg-hover)' : 'var(--bg-primary)',
              border: '1px solid var(--border)',
              opacity: c.resolved ? 0.6 : 1,
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.timestamp}</span>
              <div className="flex gap-1">
                <button
                  className="text-[10px] px-1 rounded"
                  style={{ color: c.resolved ? '#00b894' : 'var(--text-muted)' }}
                  onClick={() => resolveComment(c.id)}
                  title={c.resolved ? 'Unresolve' : 'Resolve'}
                >
                  {c.resolved ? '✅' : '☐'}
                </button>
                <button
                  className="text-[10px] px-1"
                  style={{ color: '#e74c3c' }}
                  onClick={() => deleteComment(c.id)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-primary)', textDecoration: c.resolved ? 'line-through' : 'none' }}>
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
