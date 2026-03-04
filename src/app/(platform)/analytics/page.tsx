'use client';
/* ═══════════════════════════════════════════════════════════════
   EduVision X — Premium Analytics Dashboard
   Features 146-165 · Charts · Engagement · Performance tracking
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function AnimGroup({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} style={style}>{children}</motion.div>;
}

const METRICS = [
  { label: 'Total Views', value: '124.8K', change: '+18%', icon: '👁️', color: '#7c3aed' },
  { label: 'Avg. Session', value: '24 min', change: '+8%', icon: '⏱️', color: '#22c55e' },
  { label: 'Completion Rate', value: '76%', change: '+5%', icon: '✅', color: '#fbbf24' },
  { label: 'Quiz Pass Rate', value: '82%', change: '+12%', icon: '🎯', color: '#f472b6' },
];

const COURSE_PERF = [
  { name: 'Data Structures', engagement: 92, completion: 78, satisfaction: 95, color: '#7c3aed' },
  { name: 'Machine Learning', engagement: 88, completion: 65, satisfaction: 90, color: '#22c55e' },
  { name: 'Computer Networks', engagement: 75, completion: 82, satisfaction: 85, color: '#f472b6' },
  { name: 'Operating Systems', engagement: 83, completion: 70, satisfaction: 88, color: '#fbbf24' },
  { name: 'Database Systems', engagement: 79, completion: 55, satisfaction: 82, color: '#38bdf8' },
];

const STUDENT_INSIGHTS = [
  { metric: 'Most Active Time', value: '2:00 PM - 4:00 PM', icon: '🕐' },
  { metric: 'Top Code Language', value: 'Python (68%)', icon: '🐍' },
  { metric: 'Avg. Questions', value: '4.2 per session', icon: '❓' },
  { metric: 'Collaboration Score', value: '8.7 / 10', icon: '🤝' },
  { metric: 'Simulation Usage', value: '3.1x per week', icon: '🔬' },
  { metric: 'AI Tool Adoption', value: '89% of students', icon: '🤖' },
];

const WEEKLY_DATA = [
  { day: 'Mon', views: 2400, sessions: 180 },
  { day: 'Tue', views: 3100, sessions: 220 },
  { day: 'Wed', views: 2800, sessions: 195 },
  { day: 'Thu', views: 3600, sessions: 260 },
  { day: 'Fri', views: 4200, sessions: 310 },
  { day: 'Sat', views: 1800, sessions: 120 },
  { day: 'Sun', views: 1200, sessions: 85 },
];

const TABS = ['Overview', 'Engagement', 'Performance', 'Students', 'Content', 'Export'];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [period, setPeriod] = useState('7d');
  const maxViews = Math.max(...WEEKLY_DATA.map(d => d.views));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Engagement':
        return (
          <AnimGroup>
            <motion.div variants={fadeUp} custom={0} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ padding: 28, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h3 className="enterprise-section-title" style={{ fontSize: 16, marginBottom: 20 }}>Session Duration Breakdown</h3>
                {[
                  { range: '< 5 min', pct: 12, color: '#ef4444' },
                  { range: '5-15 min', pct: 28, color: '#fbbf24' },
                  { range: '15-30 min', pct: 38, color: '#22c55e' },
                  { range: '30+ min', pct: 22, color: '#6366f1' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 70 }}>{d.range}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        style={{ height: '100%', borderRadius: 3, background: d.color }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 36 }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: 28, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h3 className="enterprise-section-title" style={{ fontSize: 16, marginBottom: 20 }}>Interaction Heatmap</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {Array.from({ length: 35 }, (_, i) => {
                    const intensity = Math.random();
                    return (
                      <div key={i} style={{
                        aspectRatio: '1', borderRadius: 4,
                        background: intensity > 0.7 ? 'rgba(124,58,237,0.5)' : intensity > 0.4 ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.08)',
                        transition: 'background 0.2s',
                      }} />
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <span key={d} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimGroup>
        );
      case 'Performance':
        return (
          <AnimGroup>
            <motion.div variants={fadeUp} custom={0} style={{ padding: 28, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <h3 className="enterprise-section-title" style={{ fontSize: 16, marginBottom: 20 }}>Assessment Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Average Score', value: '78%', icon: '📝', color: '#6366f1' },
                  { label: 'Pass Rate', value: '86%', icon: '✅', color: '#22c55e' },
                  { label: 'Retry Rate', value: '14%', icon: '🔄', color: '#fbbf24' },
                  { label: 'Time to Complete', value: '18 min', icon: '⏱️', color: '#f472b6' },
                  { label: 'Top Performers', value: '234', icon: '🏆', color: '#38bdf8' },
                  { label: 'Need Support', value: '42', icon: '⚠️', color: '#ef4444' },
                ].map((s, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} style={{
                    padding: '18px 20px', borderRadius: 14, background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${s.color}15`, border: `1px solid ${s.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimGroup>
        );
      case 'Students':
        return (
          <AnimGroup>
            <motion.div variants={fadeUp} custom={0} style={{ padding: 28, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <h3 className="enterprise-section-title" style={{ fontSize: 16, marginBottom: 20 }}>Student Roster</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                <span>Student</span><span>Progress</span><span>Score</span><span>Status</span>
              </div>
              {[
                { name: 'Alex Chen', progress: 92, score: 95, status: 'Active' },
                { name: 'Maria Garcia', progress: 85, score: 88, status: 'Active' },
                { name: 'James Wilson', progress: 67, score: 72, status: 'At Risk' },
                { name: 'Priya Patel', progress: 78, score: 81, status: 'Active' },
                { name: 'Omar Hassan', progress: 45, score: 58, status: 'Inactive' },
                { name: 'Sarah Kim', progress: 98, score: 97, status: 'Active' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center',
                  padding: '14px 16px', borderRadius: 12,
                  background: i % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent', marginBottom: 4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{s.progress}%</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{s.score}%</span>
                  <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'At Risk' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: 10, width: 'fit-content' }}>
                    {s.status}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimGroup>
        );
      case 'Content':
        return (
          <AnimGroup>
            <motion.div variants={fadeUp} custom={0} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { title: 'Most Viewed Slide', value: '"Binary Search Trees"', metric: '4,289 views', color: '#6366f1' },
                { title: 'Most Replayed', value: '"Recursion Demo"', metric: '1,832 replays', color: '#22c55e' },
                { title: 'Highest Quiz Score', value: '"Network Layers"', metric: '94% avg', color: '#fbbf24' },
                { title: 'Most Shared', value: '"ML Intro Deck"', metric: '312 shares', color: '#f472b6' },
              ].map((c, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} style={{
                  padding: 24, borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: c.color, opacity: 0.05, filter: 'blur(24px)' }} />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{c.value}</div>
                  <div style={{ fontSize: 13, color: c.color, fontWeight: 600 }}>{c.metric}</div>
                </motion.div>
              ))}
            </motion.div>
          </AnimGroup>
        );
      case 'Export':
        return (
          <AnimGroup>
            <motion.div variants={fadeUp} custom={0} style={{ padding: 28, borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid var(--border)', maxWidth: 600 }}>
              <h3 className="enterprise-section-title" style={{ fontSize: 16, marginBottom: 8 }}>Export Reports</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Download analytics data for your records or external reporting.</p>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { label: 'Full Analytics Report', format: 'PDF', icon: '📊' },
                  { label: 'Student Progress Data', format: 'CSV', icon: '👥' },
                  { label: 'Engagement Metrics', format: 'Excel', icon: '📈' },
                  { label: 'Assessment Results', format: 'PDF', icon: '📝' },
                ].map((r, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="motion-consistent" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', borderRadius: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.format} format</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Download →</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimGroup>
        );
      default: // Overview
        return null;
    }
  };

  return (
    <div className="enterprise-page-shell">

      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 22 }}>
        <div className="enterprise-hero" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <div className="enterprise-kicker" style={{ marginBottom: 14 }}>Intelligence Layer</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 6 }}>
              Analytics & Insights
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Real-time performance visibility for engagement, completion, and teaching quality.
            </p>
          </div>
          <div className="enterprise-toolbar">
            {['24h', '7d', '30d', '90d'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`enterprise-pill control-consistent ${period === p ? 'active' : ''}`} style={{ cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`enterprise-pill control-consistent ${activeTab === tab ? 'active' : ''}`} style={{ cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Tab-specific content ═══ */}
      {activeTab !== 'Overview' && renderTabContent()}

      {/* ═══ Overview Tab Content ═══ */}
      {activeTab === 'Overview' && (<>

      {/* ═══ Metrics ═══ */}
      <AnimGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        {METRICS.map((m, i) => (
          <motion.div key={i} variants={fadeUp} custom={i} className="motion-consistent" style={{
            padding: '22px 24px', borderRadius: 16,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 80, height: 80,
              borderRadius: '50%', background: m.color, opacity: 0.05, filter: 'blur(24px)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 16,
                background: 'rgba(34,197,94,0.1)', color: 'var(--success)',
              }}>{m.change}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{m.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{m.label}</div>
          </motion.div>
        ))}
      </AnimGroup>

      {/* ═══ Charts Row ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Weekly Views Chart */}
        <AnimGroup>
          <motion.div variants={fadeUp} custom={0} style={{
            padding: '28px', borderRadius: 18,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 className="enterprise-section-title" style={{ fontSize: 16 }}>Weekly Views</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 7 days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {WEEKLY_DATA.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{(d.views / 1000).toFixed(1)}k</span>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d.views / maxViews) * 120}px` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    style={{
                      width: '100%', borderRadius: 8,
                      background: d.day === 'Fri'
                        ? 'linear-gradient(180deg, var(--accent), var(--accent-solid))'
                        : 'var(--bg-hover)',
                      minHeight: 4,
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimGroup>

        {/* Student Insights */}
        <AnimGroup>
          <motion.div variants={fadeUp} custom={0} style={{
            padding: '28px', borderRadius: 18,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          }}>
            <h3 className="enterprise-section-title" style={{ fontSize: 16, margin: '0 0 20px' }}>Student Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STUDENT_INSIGHTS.map((s, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="motion-consistent" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.metric}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimGroup>
      </div>

      {/* ═══ Course Performance ═══ */}
      <AnimGroup>
        <motion.div variants={fadeUp} custom={0} style={{
          padding: '28px', borderRadius: 18,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 className="enterprise-section-title" style={{ fontSize: 16 }}>Course Performance</h3>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>View Details →</span>
          </div>

          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            padding: '10px 16px', borderRadius: 10, marginBottom: 8,
            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Course</span><span>Engagement</span><span>Completion</span><span>Satisfaction</span>
          </div>

          {COURSE_PERF.map((c, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', alignItems: 'center',
              padding: '14px 16px', borderRadius: 12,
              background: i % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent',
              marginBottom: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
              </div>
              {[c.engagement, c.completion, c.satisfaction].map((val, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--bg-hover)', maxWidth: 100, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: (i * 0.05) + (j * 0.03), ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      style={{ height: '100%', borderRadius: 3, background: c.color }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', minWidth: 32 }}>{val}%</span>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </AnimGroup>

      </>)}
    </div>
  );
}
