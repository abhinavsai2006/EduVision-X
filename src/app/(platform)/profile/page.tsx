'use client';
/* ═══════════════════════════════════════════════════════
   Profile v3.0 — Premium User Profile & Achievements
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PROFILE = {
  name: 'Alex Rivera',
  username: '@alexrivera',
  role: 'Full-Stack Instructor',
  avatar: '👨‍🏫',
  joinDate: 'Joined March 2024',
  bio: 'Passionate about making computer science accessible. Building the future of interactive education.',
  tags: ['React', 'TypeScript', 'Next.js', 'Python', 'AI/ML'],
  social: { github: 'alexrivera', twitter: '@alexrivera', linkedin: 'alexrivera' },
};

const STATS = [
  { label: 'Presentations', value: '148', icon: '📊', rgb: '124,58,237' },
  { label: 'Students', value: '3.2k', icon: '🎓', rgb: '34,197,94' },
  { label: 'XP Earned', value: '24.5k', icon: '⚡', rgb: '234,179,8' },
  { label: 'Rating', value: '4.9', icon: '⭐', rgb: '244,114,182' },
];

const ACHIEVEMENTS = [
  { title: 'First Presentation', desc: 'Created your first slide deck', icon: '🏅', earned: true, date: 'Mar 2024', rgb: '124,58,237' },
  { title: 'Quiz Master', desc: 'Won 10 quiz battles', icon: '🏆', earned: true, date: 'Apr 2024', rgb: '234,179,8' },
  { title: 'Top Creator', desc: '100+ marketplace downloads', icon: '💎', earned: true, date: 'Jun 2024', rgb: '56,189,248' },
  { title: 'Streak Legend', desc: '30-day login streak', icon: '🔥', earned: true, date: 'Jul 2024', rgb: '239,68,68' },
  { title: 'Community Star', desc: '500+ helpful answers', icon: '⭐', earned: false, date: null, rgb: '100,116,139' },
  { title: 'AI Pioneer', desc: 'Generate 50 AI presentations', icon: '🤖', earned: false, date: null, rgb: '100,116,139' },
];

const RECENT_WORK = [
  { title: 'Graph Algorithms — CS201', type: 'Presentation', date: '2 hours ago', slides: 24, views: 156, rgb: '124,58,237' },
  { title: 'React Hooks Deep Dive', type: 'Presentation', date: '1 day ago', slides: 32, views: 289, rgb: '34,197,94' },
  { title: 'Binary Search Quiz', type: 'Quiz', date: '3 days ago', slides: 15, views: 412, rgb: '56,189,248' },
  { title: 'ML Pipeline Workshop', type: 'Workshop', date: '1 week ago', slides: 48, views: 1023, rgb: '244,114,182' },
  { title: 'Database Design Basics', type: 'Presentation', date: '2 weeks ago', slides: 20, views: 567, rgb: '234,179,8' },
];

const ACTIVITY_HEATMAP = Array.from({ length: 52 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
);

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }) };

function GlassCard({ children, rgb = '124,58,237', style, hover = true }: { children: React.ReactNode; rgb?: string; style?: React.CSSProperties; hover?: boolean }) {
  return (
    <motion.div whileHover={hover ? { y: -3, transition: { duration: 0.3 } } : undefined} style={{
      borderRadius: 18, padding: 1.5,
      background: `linear-gradient(160deg, rgba(${rgb},0.2), rgba(${rgb},0.04) 60%, rgba(${rgb},0.12))`,
      ...style,
    }}>
      <div style={{
        borderRadius: 16.5, padding: '20px 22px',
        background: 'linear-gradient(160deg, rgba(22,22,31,0.97), rgba(16,16,24,0.99))',
        position: 'relative', overflow: 'hidden', height: '100%',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.4), transparent)`,
        }} />
        {children}
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'work' | 'achievements' | 'activity'>('work');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 24px 64px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ═══ Profile Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            borderRadius: 24, padding: 2,
            background: 'linear-gradient(160deg, rgba(124,58,237,0.25), rgba(124,58,237,0.04) 40%, rgba(34,197,94,0.1) 70%, rgba(56,189,248,0.15))',
          }}>
            <div style={{
              borderRadius: 22, padding: '36px 32px',
              background: 'linear-gradient(160deg, rgba(18,18,28,0.98), rgba(14,14,20,0.99))',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Background decor */}
              <div style={{
                position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                {/* Avatar */}
                <div style={{
                  width: 90, height: 90, borderRadius: 22, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))',
                  border: '2px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42,
                }}>{PROFILE.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h1 style={{
                      margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em',
                      background: 'linear-gradient(135deg, #fff 50%, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{PROFILE.name}</h1>
                    <span style={{
                      fontSize: 9, padding: '3px 10px', borderRadius: 99, fontWeight: 700,
                      background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                      border: '1px solid rgba(34,197,94,0.15)',
                    }}>PRO</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>{PROFILE.username}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{PROFILE.role}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{PROFILE.joinDate}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', maxWidth: 500, lineHeight: 1.6 }}>{PROFILE.bio}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {PROFILE.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, padding: '4px 10px', borderRadius: 8, fontWeight: 600,
                        background: 'rgba(124,58,237,0.06)', color: '#a78bfa',
                        border: '1px solid rgba(124,58,237,0.1)',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <button style={{
                  padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 12,
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff',
                  border: 'none', cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                }}>✏️ Edit Profile</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Stats ═══ */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp}>
              <GlassCard rgb={s.rgb}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{
                    fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em',
                    background: `linear-gradient(135deg, rgb(${s.rgb}), rgba(${s.rgb},0.6))`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ Tabs ═══ */}
        <div style={{ display: 'flex', gap: 4, marginTop: 28, marginBottom: 18 }}>
          {[
            { id: 'work' as const, label: '📂 Recent Work' },
            { id: 'achievements' as const, label: '🏆 Achievements' },
            { id: 'activity' as const, label: '📈 Activity' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '10px 20px', fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              borderRadius: 12, cursor: 'pointer',
              border: '1px solid',
              borderColor: activeTab === t.id ? 'rgba(124,58,237,0.3)' : 'transparent',
              background: activeTab === t.id ? 'rgba(124,58,237,0.08)' : 'transparent',
              color: activeTab === t.id ? '#c4b5fd' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ═══ Recent Work ═══ */}
        {activeTab === 'work' && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RECENT_WORK.map((w, i) => (
              <motion.div key={w.title} custom={i} variants={fadeUp}>
                <GlassCard rgb={w.rgb}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: `rgba(${w.rgb},0.08)`,
                      border: `1px solid rgba(${w.rgb},0.15)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>📄</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em' }}>{w.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.type} · {w.date}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: `rgb(${w.rgb})` }}>{w.slides}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>slides</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-secondary)' }}>{w.views}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>views</div>
                      </div>
                      <button style={{
                        padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 10,
                        background: `rgba(${w.rgb},0.08)`, color: `rgb(${w.rgb})`,
                        border: `1px solid rgba(${w.rgb},0.15)`, cursor: 'pointer',
                      }}>Open</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══ Achievements ═══ */}
        {activeTab === 'achievements' && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={a.title} custom={i} variants={fadeUp}>
                <GlassCard rgb={a.rgb}>
                  <div style={{ textAlign: 'center', opacity: a.earned ? 1 : 0.4 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
                      background: a.earned ? `rgba(${a.rgb},0.1)` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${a.earned ? `rgba(${a.rgb},0.2)` : 'rgba(255,255,255,0.04)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                    }}>{a.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{a.desc}</div>
                    {a.earned ? (
                      <span style={{
                        fontSize: 9, padding: '3px 10px', borderRadius: 99, fontWeight: 700,
                        background: `rgba(${a.rgb},0.1)`, color: `rgb(${a.rgb})`,
                        border: `1px solid rgba(${a.rgb},0.2)`,
                      }}>Earned {a.date}</span>
                    ) : (
                      <span style={{
                        fontSize: 9, padding: '3px 10px', borderRadius: 99, fontWeight: 700,
                        background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}>🔒 Locked</span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══ Activity Heatmap ═══ */}
        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassCard rgb="124,58,237" hover={false}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Contribution Activity</div>
              <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
                {ACTIVITY_HEATMAP.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((level, di) => (
                      <div key={di} style={{
                        width: 12, height: 12, borderRadius: 3,
                        background: level === 0 ? 'rgba(255,255,255,0.03)' :
                          level === 1 ? 'rgba(124,58,237,0.15)' :
                          level === 2 ? 'rgba(124,58,237,0.3)' :
                          level === 3 ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.8)',
                        border: '1px solid rgba(255,255,255,0.02)',
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} style={{
                    width: 12, height: 12, borderRadius: 3,
                    background: l === 0 ? 'rgba(255,255,255,0.03)' :
                      l === 1 ? 'rgba(124,58,237,0.15)' :
                      l === 2 ? 'rgba(124,58,237,0.3)' :
                      l === 3 ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.8)',
                    border: '1px solid rgba(255,255,255,0.02)',
                  }} />
                ))}
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>More</span>
              </div>
            </GlassCard>

            {/* Activity stats summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
              {[
                { label: 'This Week', value: '18 contributions', rgb: '124,58,237' },
                { label: 'Longest Streak', value: '34 days', rgb: '234,179,8' },
                { label: 'Total Contributions', value: '1,247', rgb: '34,197,94' },
              ].map((s, i) => (
                <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <GlassCard rgb={s.rgb}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: `rgb(${s.rgb})`, letterSpacing: '-0.02em' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
