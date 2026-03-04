'use client';
/* ═══════════════════════════════════════════════════════
   SplashScreen v5.0 — Premium welcome overlay
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const TIPS = [
  'Press F5 to start presenting',
  'Use Ctrl+D to duplicate elements',
  'Double-click text to edit inline',
  'Drag & drop to reorder slides',
  'Use Ctrl+G to toggle the grid',
  'Press N for speaker notes in Present mode',
  'Try the Run button on code blocks!',
  'Use AI to generate slide content instantly',
  'Export to PDF, PPTX, or HTML with one click',
  'Add charts, 3D elements, and word clouds',
];

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const setTemplateGallery = useSlideStore(s => s.setTemplateGallery);

  useEffect(() => {
    const seen = sessionStorage.getItem('edusplash');
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem('edusplash', '1');
    }
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative text-center"
            style={{
              maxWidth: 420, width: '100%', margin: '0 16px',
              padding: '40px 36px 32px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-bold)',
              borderRadius: 16,
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center mx-auto mb-5"
              style={{
                width: 56, height: 56,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-solid))',
                borderRadius: 14,
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
              }}
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
              </svg>
            </motion.div>

            <motion.div
              className="text-xl font-bold mb-1"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              EduSlide
            </motion.div>
            <motion.div
              className="text-xs mb-6"
              style={{ color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Interactive Presentation Platform v5.0
            </motion.div>

            {/* Tip */}
            <motion.div
              className="rounded-lg px-3.5 py-3 mb-6 text-xs text-left"
              style={{
                background: 'var(--accent-dim)',
                border: '1px solid var(--border-accent)',
                color: 'var(--text-secondary)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>💡 Tip:</span> {tip}
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <motion.button
                className="btn-primary w-full"
                style={{ padding: '11px 0', fontSize: 14, fontWeight: 600 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisible(false)}
              >
                Start Editing
              </motion.button>
              <motion.button
                className="btn-secondary w-full"
                style={{ padding: '10px 0', fontSize: 13 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setTemplateGallery(true); setVisible(false); }}
              >
                Browse Templates
              </motion.button>
            </div>

            {/* Footer */}
            <motion.div
              className="mt-5 text-[10px]"
              style={{ color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
            >
              Built with Next.js · React · Framer Motion
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
