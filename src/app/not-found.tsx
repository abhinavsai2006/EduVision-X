'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: 'center', position: 'relative' }}
      >
        {/* big 404 */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: 120, fontWeight: 800, letterSpacing: '-0.06em',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.05))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1, marginBottom: 20, userSelect: 'none',
          }}
        >404</motion.div>

        <h1 style={{
          fontSize: 20, fontWeight: 600, color: '#fff',
          margin: '0 0 8px', letterSpacing: '-0.02em',
        }}>Page not found</h1>
        <p style={{
          fontSize: 13.5, color: 'rgba(255,255,255,0.35)',
          margin: '0 0 28px', maxWidth: 340, lineHeight: 1.5,
        }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '9px 20px', borderRadius: 8, background: '#8b5cf6',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Dashboard</motion.div>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ background: 'rgba(255,255,255,0.06)' }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '9px 20px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
                color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>Home</motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
