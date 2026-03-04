'use client';
/* ═══════════════════════════════════════════════════════
   Editor Page — Full slide editor (moved from root)
   ═══════════════════════════════════════════════════════ */
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const EditorLayout = dynamic(() => import('@/components/Editor/EditorLayout'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
      <div className="flex flex-col items-center gap-3">
        <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>EduVision X</span>
        <span className="text-sm">Loading editor…</span>
      </div>
    </div>
  ),
});

export default function EditorPage() {
  useEffect(() => {
    document.body.classList.add('editor-mode');
    return () => document.body.classList.remove('editor-mode');
  }, []);

  return <EditorLayout />;
}
