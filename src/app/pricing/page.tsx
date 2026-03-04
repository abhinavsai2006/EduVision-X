'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══ Animation Variants ═══ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeInOut" as const },
  }),
};

/* ═══ Data ═══ */
const PLANS = {
  monthly: [
    {
      name: 'Starter', price: '$0', period: '', desc: 'For individual educators exploring the platform',
      cta: 'Start Free', href: '/auth/register', rgb: '100,116,139',
      features: ['Up to 3 courses', 'Basic slide editor', 'Community templates', 'Standard analytics', '1 GB storage'],
      icon: '🌱',
    },
    {
      name: 'Pro', price: '$29', period: '/mo', desc: 'For serious instructors and growing departments',
      cta: 'Upgrade to Pro', href: '/auth/register', featured: true, rgb: '124,58,237',
      features: ['Unlimited courses', 'AI-powered tools', 'Advanced analytics', 'Live classroom suite', 'Priority support', '50 GB storage', 'Custom branding'],
      icon: '⚡', badge: 'Most Popular',
    },
    {
      name: 'Enterprise', price: 'Custom', period: '', desc: 'For institutions requiring governance & compliance',
      cta: 'Contact Sales', href: '/auth/register', rgb: '234,179,8',
      features: ['Everything in Pro', 'SSO + RBAC', 'Security controls', 'SLA guarantee', 'Dedicated CSM', 'Unlimited storage', 'On-premise option', 'Custom integrations'],
      icon: '🏛️',
    },
  ],
  yearly: [
    {
      name: 'Starter', price: '$0', period: '', desc: 'For individual educators exploring the platform',
      cta: 'Start Free', href: '/auth/register', rgb: '100,116,139',
      features: ['Up to 3 courses', 'Basic slide editor', 'Community templates', 'Standard analytics', '1 GB storage'],
      icon: '🌱',
    },
    {
      name: 'Pro', price: '$24', period: '/mo', desc: 'Save 20% — billed $288/year',
      cta: 'Upgrade to Pro', href: '/auth/register', featured: true, rgb: '124,58,237',
      features: ['Unlimited courses', 'AI-powered tools', 'Advanced analytics', 'Live classroom suite', 'Priority support', '50 GB storage', 'Custom branding'],
      icon: '⚡', badge: 'Best Value',
    },
    {
      name: 'Enterprise', price: 'Custom', period: '', desc: 'For institutions requiring governance & compliance',
      cta: 'Contact Sales', href: '/auth/register', rgb: '234,179,8',
      features: ['Everything in Pro', 'SSO + RBAC', 'Security controls', 'SLA guarantee', 'Dedicated CSM', 'Unlimited storage', 'On-premise option', 'Custom integrations'],
      icon: '🏛️',
    },
  ],
};

const COMPARISON = [
  { feature: 'Courses', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Generation', starter: '—', pro: '✓', enterprise: '✓' },
  { feature: 'Live Classroom', starter: '—', pro: '✓', enterprise: '✓' },
  { feature: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Enterprise' },
  { feature: 'Storage', starter: '1 GB', pro: '50 GB', enterprise: 'Unlimited' },
  { feature: 'Simulations', starter: '5/mo', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'SSO / RBAC', starter: '—', pro: '—', enterprise: '✓' },
  { feature: 'SLA', starter: '—', pro: '—', enterprise: '99.9%' },
  { feature: 'Support', starter: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
];

const FAQ = [
  { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade at any time. Changes take effect immediately with prorated billing.' },
  { q: 'Is there a free trial for Pro?', a: 'Pro includes a 14-day free trial. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.' },
  { q: 'Can I cancel my subscription?', a: 'Cancel anytime from your account settings. You\'ll keep access until the end of your billing period.' },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 600, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* ═══ Hero ═══ */}
        <motion.div
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <motion.div variants={fadeUp} custom={0}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999,
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
              fontSize: 12, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>💎 Pricing</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} style={{
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, letterSpacing: '-0.04em',
            lineHeight: 1.08, color: 'var(--text-primary)', margin: '20px 0 0',
          }}>
            Invest in Learning<br />
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>That Scales</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} style={{
            fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.65,
          }}>
            Choose a plan that matches your growth stage. Start free, upgrade anytime — no disruption.
          </motion.p>

          {/* Billing toggle */}
          <motion.div variants={fadeUp} custom={3} style={{
            marginTop: 32, display: 'inline-flex', padding: 4, borderRadius: 16,
            background: 'rgba(20,20,30,0.6)', border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, transition: 'all 0.3s ease',
                background: billing === b ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: billing === b ? '#c4b5fd' : 'var(--text-muted)',
                position: 'relative',
              }}>
                {b === 'yearly' ? 'Yearly' : 'Monthly'}
                {b === 'yearly' && (
                  <span style={{
                    position: 'absolute', top: -8, right: -8, fontSize: 9, fontWeight: 800,
                    padding: '2px 6px', borderRadius: 6,
                    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                  }}>-20%</span>
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* ═══ Plan Cards ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={billing}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 80 }}
          >
            {PLANS[billing].map((plan, i) => {
              const isFeatured = Boolean(plan.featured);
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                  style={{
                    borderRadius: 24, padding: isFeatured ? 2 : 1.5, position: 'relative',
                    background: isFeatured
                      ? 'linear-gradient(160deg, rgba(124,58,237,0.6), rgba(167,139,250,0.2) 50%, rgba(124,58,237,0.4))'
                      : `linear-gradient(160deg, rgba(${plan.rgb},0.2), rgba(${plan.rgb},0.05) 60%, rgba(${plan.rgb},0.12))`,
                    transform: isFeatured ? 'scale(1.03)' : undefined,
                    zIndex: isFeatured ? 2 : 1,
                  }}
                >
                  <div style={{
                    borderRadius: 22, padding: '36px 28px',
                    background: isFeatured
                      ? 'linear-gradient(160deg, rgba(22,18,35,0.98), rgba(14,14,20,0.99))'
                      : 'linear-gradient(160deg, rgba(22,22,31,0.97), rgba(16,16,24,0.99))',
                    minHeight: 520, display: 'flex', flexDirection: 'column',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Top accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(${plan.rgb},${isFeatured ? 0.7 : 0.4}), transparent)` }} />
                    <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle, rgba(${plan.rgb},${isFeatured ? 0.1 : 0.05}), transparent 70%)`, top: -80, right: -60, pointerEvents: 'none' }} />

                    {'badge' in plan && plan.badge && (
                      <span style={{
                        display: 'inline-flex', alignSelf: 'flex-start', padding: '4px 12px', borderRadius: 999, marginBottom: 16,
                        background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                        fontSize: 10, fontWeight: 800, color: '#c4b5fd', letterSpacing: '0.04em',
                      }}>{plan.badge}</span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, position: 'relative' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: `rgba(${plan.rgb},0.1)`, border: `1px solid rgba(${plan.rgb},0.2)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      }}>{plan.icon}</div>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{plan.name}</h3>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{plan.price}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>{plan.period}</span>
                    </div>
                    <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{plan.desc}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: 6, background: `rgba(${plan.rgb},0.1)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, color: isFeatured ? '#a78bfa' : `rgb(${plan.rgb})`, flexShrink: 0,
                          }}>✓</div>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={plan.href} style={{ textDecoration: 'none', marginTop: 28 }}>
                      <button style={{
                        width: '100%', padding: '14px 20px', borderRadius: 14,
                        border: isFeatured ? 'none' : `1px solid rgba(${plan.rgb},0.25)`,
                        background: isFeatured ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : `rgba(${plan.rgb},0.08)`,
                        color: isFeatured ? '#fff' : 'var(--text-primary)',
                        fontWeight: 800, fontSize: 14, cursor: 'pointer',
                        boxShadow: isFeatured ? '0 8px 28px rgba(124,58,237,0.3)' : 'none',
                      }}>{plan.cta}</button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ═══ Comparison Table ═══ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 80 }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 32 }}>
            Compare <span style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Plans</span>
          </h2>
          <div style={{ borderRadius: 22, overflow: 'hidden', padding: 2, background: 'linear-gradient(160deg, rgba(124,58,237,0.15), rgba(255,255,255,0.03) 50%, rgba(124,58,237,0.1))' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(16,16,24,0.98)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(124,58,237,0.04)' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Feature</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Starter</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Pro</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Enterprise</span>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.feature} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 28px',
                  borderBottom: i < COMPARISON.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.feature}</span>
                  {[row.starter, row.pro, row.enterprise].map((val, j) => (
                    <span key={j} style={{
                      fontSize: 13, textAlign: 'center', fontWeight: val === '✓' ? 700 : 500,
                      color: val === '✓' ? '#22c55e' : val === '—' ? 'var(--text-muted)' : j === 1 ? '#c4b5fd' : 'var(--text-secondary)',
                    }}>{val}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══ FAQ ═══ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginBottom: 80, maxWidth: 720, margin: '0 auto 80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 32 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.01 }} style={{
                borderRadius: 16, overflow: 'hidden',
                background: 'rgba(22,22,31,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '18px 24px', border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'var(--text-primary)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'left',
                }}>
                  {item.q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 16 }}>▼</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <p style={{ padding: '0 24px 18px', margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ Bottom CTA ═══ */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center', padding: '56px 24px', borderRadius: 24,
            background: 'linear-gradient(160deg, rgba(124,58,237,0.1), rgba(16,16,24,0.8))',
            border: '1px solid rgba(124,58,237,0.12)', position: 'relative', overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 12 }}>
            Ready to transform your teaching?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            Join thousands of educators already using EduVision X.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 32px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(124,58,237,0.3)',
              }}>Get Started Free</button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 32px', borderRadius: 14, border: '1px solid rgba(124,58,237,0.25)',
                background: 'transparent', color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Talk to Sales</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
