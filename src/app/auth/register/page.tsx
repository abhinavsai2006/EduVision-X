'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;
const ROLES = ['Educator', 'Student', 'Researcher', 'Admin'];
const INTERESTS = ['AI & ML', 'Data Structures', 'Web Dev', 'Networks', 'Math', 'Physics', 'Chemistry', 'Biology'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', pass: '', role: '', interests: [] as string[] });
  const [focused, setFocused] = useState<string|null>(null);

  const inputStyle = (n: string): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', fontSize: 13.5,
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === n ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: 8, color: '#fff', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
  });

  const steps = [
    /* step 0: basics */
    <div key="0" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Full name</label>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
          placeholder="John Doe" style={inputStyle('name')} />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
          placeholder="you@example.com" style={inputStyle('email')} />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Password</label>
        <input type="password" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})}
          onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
          placeholder="8+ characters" style={inputStyle('pass')} />
      </div>
    </div>,

    /* step 1: role */
    <div key="1">
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>What describes you best?</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ROLES.map(r => {
          const sel = form.role === r;
          return (
            <motion.button key={r} whileTap={{ scale: 0.96 }} onClick={() => setForm({...form, role: r})}
              style={{
                padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                background: sel ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${sel ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)'}`,
                color: sel ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: sel ? 600 : 400, textAlign: 'left' as const,
                transition: 'all 0.15s',
              }}
            >{r}</motion.button>
          );
        })}
      </div>
    </div>,

    /* step 2: interests */
    <div key="2">
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>Pick your interests</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {INTERESTS.map(t => {
          const sel = form.interests.includes(t);
          return (
            <motion.button key={t} whileTap={{ scale: 0.95 }}
              onClick={() => setForm({...form, interests: sel ? form.interests.filter(x=>x!==t) : [...form.interests, t]})}
              style={{
                padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                background: sel ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${sel ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)'}`,
                color: sel ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                fontSize: 12, fontWeight: sel ? 600 : 400, transition: 'all 0.15s',
              }}
            >{t}</motion.button>
          );
        })}
      </div>
    </div>,
  ];

  const labels = ['Account', 'Role', 'Interests'];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.04), transparent 70%)',
        top: '40%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}
        style={{ width: 380, position: 'relative' }}
      >
        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: '#8b5cf6',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 14,
          }}>E</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Create account</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Start your learning journey</p>
        </div>

        {/* step indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {labels.map((l, i) => (
            <div key={l} style={{ flex: 1 }}>
              <div style={{
                height: 2, borderRadius: 1, transition: 'background 0.3s',
                background: i <= step ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
              }} />
              <p style={{
                fontSize: 10, fontWeight: 500, margin: '6px 0 0',
                color: i <= step ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                textAlign: 'center' as const,
              }}>{l}</p>
            </div>
          ))}
        </div>

        {/* card */}
        <div style={{
          padding: '24px', borderRadius: 14,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          minHeight: 200,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          {/* nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 8 }}>
            {step > 0 ? (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(step - 1)}
                style={{
                  padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
                }}>Back</motion.button>
            ) : <div/>}
            <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
              onClick={() => step < 2 ? setStep(step + 1) : null}
              style={{
                padding: '9px 24px', borderRadius: 8, border: 'none',
                background: '#8b5cf6', color: '#fff',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >{step < 2 ? 'Continue' : 'Create account'}</motion.button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
