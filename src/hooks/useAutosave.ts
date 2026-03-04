/* ═══════════════════════════════════════════════════════
   useAutosave — Auto-save presentation every 30 seconds
   ═══════════════════════════════════════════════════════ */
'use client';
import { useEffect, useRef } from 'react';
import { useSlideStore } from '@/store/useSlideStore';

export default function useAutosave(intervalMs = 30000) {
  const presentation = useSlideStore(s => s.presentation);
  const lastSaved = useRef<string>('');

  useEffect(() => {
    const iv = setInterval(async () => {
      const json = JSON.stringify(presentation);
      if (json === lastSaved.current) return; // no changes
      lastSaved.current = json;
      try {
        await fetch('/api/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        });
      } catch {
        // silently fail
      }
    }, intervalMs);
    return () => clearInterval(iv);
  }, [presentation, intervalMs]);
}
