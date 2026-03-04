'use client';
/* ═══════════════════════════════════════════════════════
   Toast — Notification popups
   ═══════════════════════════════════════════════════════ */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';

const icons: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
const colors: Record<string, string> = { success: '#00b894', error: '#e74c3c', warning: '#fdcb6e', info: '#0984e3' };

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);
  const remove = useToastStore(s => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer min-w-[200px]"
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${colors[t.type]}`,
              borderLeft: `4px solid ${colors[t.type]}`,
              color: 'var(--text-primary)',
            }}
            onClick={() => remove(t.id)}
          >
            <span>{icons[t.type]}</span>
            <span className="text-xs">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
