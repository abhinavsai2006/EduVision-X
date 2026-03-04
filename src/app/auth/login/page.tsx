'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const FEATURES = [
  { icon: '🎓', text: 'Real-time classroom controls and session tools', rgb: '124,58,237' },
  { icon: '🤖', text: 'AI generation for lessons, quizzes, and resources', rgb: '34,197,94' },
  { icon: '🔐', text: 'Secure role-based access and performance insights', rgb: '56,189,248' },
  { icon: '📊', text: 'Interactive simulations and live coding labs', rgb: '244,114,182' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)',
    }}>
      {/* ═══ Left — Branding Panel ═══ */}
      <div style={{
        padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(14,14,20,1), rgba(22,18,35,1))',
        borderRight: '1px solid rgba(124,58,237,0.1)',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12), transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -50, width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.06), transparent 60%)',
          pointerEvents: 'none',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#fff', fontWeight: 900,
              }}>E</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>EduVision X</span>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <span style={{
              display: 'inline-flex', padding: '5px 14px', borderRadius: 999,
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
              fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: 20,
            }}>Welcome Back</span>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={2} style={{
            fontSize: 42, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em',
            color: 'var(--text-primary)', margin: '0 0 14px',
          }}>
            Continue Building<br />
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Interactive Learning</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={3} style={{
            color: 'var(--text-secondary)', maxWidth: 420, lineHeight: 1.65, fontSize: 15, marginBottom: 36,
          }}>
            Sign in to access your dashboard, classrooms, coding labs, and analytics.
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map((item, i) => (
              <motion.div
                key={item.text}
                variants={fadeUp} custom={i + 4}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{item.icon}</div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ Right — Login Form ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
        background: 'var(--bg-primary)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          style={{
            width: '100%', maxWidth: 420, padding: '40px 36px', borderRadius: 24,
            background: 'rgba(22,22,31,0.6)', border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }} />

          <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Sign In</h2>
          <p style={{ margin: '0 0 28px', fontSize: 13, color: 'var(--text-muted)' }}>
            Use your work email to continue.
          </p>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 16,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
              color: '#f87171', fontSize: 13, fontWeight: 600,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input placeholder="name@company.com" type="email" value={email}
                onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input placeholder="••••••••" type="password" value={password}
                onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#7c3aed' }} /> Remember me
              </label>
              <Link href="#" style={{ fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(124,58,237,0.3)',
              transition: 'all 0.3s ease',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Google', icon: '🔵' },
                { label: 'GitHub', icon: '⚫' },
              ].map(provider => (
                <button key={provider.label} type="button" style={{
                  padding: '12px 16px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontSize: 14 }}>{provider.icon}</span> {provider.label}
                </button>
              ))}
            </div>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              New here?{' '}
              <Link href="/auth/register" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 700 }}>
                Create account
              </Link>
            </span>
          </div>

          <p style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            By signing in, you agree to our Terms and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
  marginBottom: 6, letterSpacing: '0.02em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)',
  color: 'var(--text-primary)', outline: 'none', fontSize: 14,
  transition: 'border-color 0.2s ease',
};
