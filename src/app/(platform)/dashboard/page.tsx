'use client';
/* ═══════════════════════════════════════════════════════════════
   EduVision X — Premium Dashboard
   Overview stats · Recent activity · Quick actions · Course grid
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import PremiumCard from '@/components/UI/PremiumCard';

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function AnimGroup({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} style={style}>
      {children}
    </motion.div>
  );
}

/* ── Data ── */
const STATS = [
  { label: 'Total Slides', value: '1,247', change: '+12%', icon: '📄', color: '#7c3aed' },
  { label: 'Active Students', value: '3,892', change: '+24%', icon: '👥', color: '#22c55e' },
  { label: 'Code Executions', value: '28.4K', change: '+18%', icon: '💻', color: '#f472b6' },
  { label: 'Avg. Engagement', value: '87%', change: '+5%', icon: '📊', color: '#fbbf24' },
];

const QUICK_ACTIONS = [
  { icon: '🎨', label: 'New Presentation', href: '/editor', gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { icon: '💻', label: 'Open Coding Lab', href: '/coding-lab', gradient: 'linear-gradient(135deg, #22c55e, #2dd4bf)' },
  { icon: '🤖', label: 'AI Generator', href: '/ai-tools', gradient: 'linear-gradient(135deg, #f472b6, #fb7185)' },
  { icon: '🔬', label: 'Simulations', href: '/simulations', gradient: 'linear-gradient(135deg, #fbbf24, #fb923c)' },
  { icon: '🏫', label: 'Start Class', href: '/classroom', gradient: 'linear-gradient(135deg, #38bdf8, #7c3aed)' },
  { icon: '📊', label: 'View Analytics', href: '/analytics', gradient: 'linear-gradient(135deg, #a78bfa, #f472b6)' },
];

const RECENT_COURSES = [
  { title: 'Data Structures & Algorithms', slides: 48, students: 156, progress: 72, color: '#7c3aed' },
  { title: 'Machine Learning Fundamentals', slides: 35, students: 203, progress: 45, color: '#22c55e' },
  { title: 'Computer Networks', slides: 62, students: 134, progress: 88, color: '#f472b6' },
  { title: 'Operating Systems', slides: 41, students: 178, progress: 60, color: '#fbbf24' },
  { title: 'Database Systems', slides: 29, students: 142, progress: 35, color: '#38bdf8' },
  { title: 'Web Development', slides: 55, students: 220, progress: 91, color: '#a78bfa' },
];

const ACTIVITY = [
  { time: '2 min ago', action: 'Edited "Sorting Algorithms" presentation', icon: '✏️' },
  { time: '15 min ago', action: '32 students joined "ML Fundamentals" class', icon: '👥' },
  { time: '1 hour ago', action: 'AI generated quiz for "Binary Trees" lecture', icon: '🤖' },
  { time: '2 hours ago', action: 'Published "Network Protocols" simulation', icon: '🔬' },
  { time: '3 hours ago', action: 'New marketplace template downloaded', icon: '📦' },
  { time: '5 hours ago', action: 'Analytics report generated for Week 12', icon: '📊' },
];

export default function DashboardPage() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  });

  return (
    <div className="enterprise-page-shell">

      {/* ═══ Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 26 }}
      >
        <div className="enterprise-hero" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="enterprise-kicker" style={{ marginBottom: 14 }}>Operations Dashboard</div>
            <h1 style={{
              fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 6,
            }}>
              {greeting}, Professor 👋
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              Command center for content delivery, classroom momentum, and weekly execution.
            </p>
          </div>
          <Link href="/editor" style={{
            textDecoration: 'none', padding: '12px 28px', fontSize: 14, fontWeight: 700,
            borderRadius: 12, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-solid))',
            boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
            transition: 'all 0.25s',
          }}>
            <span style={{ fontSize: 16 }}>+</span> New Presentation
          </Link>
        </div>
      </motion.div>

      {/* ═══ Stats Grid ═══ */}
      <AnimGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STATS.map((s, i) => (
          <motion.div key={i} variants={fadeUp} custom={i}>
            <PremiumCard style={{
              padding: '24px 28px',
              borderRadius: 18,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
            }}>
              <div style={{
                position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                borderRadius: '50%', background: s.color, opacity: 0.05, filter: 'blur(30px)',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${s.color}15`, border: `1px solid ${s.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>{s.icon}</div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(34,197,94,0.1)', color: 'var(--success)',
                }}>{s.change}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
            </PremiumCard>
          </motion.div>
        ))}
      </AnimGroup>

      {/* ═══ Quick Actions ═══ */}
      <AnimGroup style={{ marginBottom: 32 }}>
        <motion.div variants={fadeUp} custom={0}>
          <h2 className="enterprise-section-title" style={{ marginBottom: 16 }}>Quick Actions</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {QUICK_ACTIONS.map((a, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <Link href={a.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  className="motion-consistent"
                  whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '20px 18px', borderRadius: 16,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'border-color 0.3s',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: a.gradient, opacity: 0.9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 19, flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>{a.icon}</div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{a.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimGroup>

      {/* ═══ Main Content Grid ═══ */}
      <div className="enterprise-grid-2">

        {/* Courses */}
        <AnimGroup>
          <motion.div variants={fadeUp} custom={0} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
          }}>
            <h2 className="enterprise-section-title">Your Courses</h2>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>View All →</span>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {RECENT_COURSES.map((c, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <motion.div
                  className="motion-consistent"
                  whileHover={{ y: -2, borderColor: `${c.color}40` }}
                  style={{
                    padding: '22px 24px', borderRadius: 16,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{c.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                    <span>📄 {c.slides} slides</span>
                    <span>👥 {c.students} students</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      flex: 1, height: 6, borderRadius: 3,
                      background: 'var(--bg-hover)', overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        style={{ height: '100%', borderRadius: 3, background: c.color }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color, minWidth: 36, textAlign: 'right' }}>{c.progress}%</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </AnimGroup>

        {/* Activity Feed */}
        <AnimGroup>
          <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 16 }}>
            <h2 className="enterprise-section-title">Recent Activity</h2>
          </motion.div>
          <div style={{
            padding: '8px 0', borderRadius: 16,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          }}>
            {ACTIVITY.map((a, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="motion-consistent" style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 20px',
                borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{a.action}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>{a.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Engagement chart placeholder */}
          <motion.div variants={fadeUp} custom={4} style={{
            marginTop: 16, padding: '24px', borderRadius: 16,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Weekly Engagement</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {[65, 78, 52, 89, 94, 72, 85].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  style={{
                    flex: 1, borderRadius: 6,
                    background: i === 4 ? 'var(--accent)' : 'var(--bg-hover)',
                    minHeight: 4,
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d} style={{ fontSize: 10, color: 'var(--text-muted)', flex: 1, textAlign: 'center' }}>{d}</span>
              ))}
            </div>
          </motion.div>
        </AnimGroup>
      </div>
    </div>
  );
}
