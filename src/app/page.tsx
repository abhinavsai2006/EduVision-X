'use client';
/* =====================================================================
   EduVision X  --  Cinematic Landing Page v2
   Orbital motion, Magnetic cursor, Staggered cinema reveals
   Morphing gradient mesh, 3D tilt cards, Horizontal scroll
   100% new architecture -- zero overlap with previous design
   ===================================================================== */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

/* --- helpers -------------------------------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* === NOISE SVG (inline) === */
const NoiseSVG = () => (
  <svg
    style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      opacity: 0.03,
      mixBlendMode: 'overlay',
    }}
  >
    <filter id="noiseFilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="4"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

/* === MAGNETIC BUTTON === */
function MagneticButton({
  children,
  className,
  style,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.25);
      y.set((e.clientY - cy) * 0.25);
    },
    [x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: 'inline-block', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

/* === TILT CARD === */
function TiltCard({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * 12);
      rotateX.set(-py * 12);
    },
    [rotateX, rotateY],
  );

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* === REVEAL TEXT (per-word cinema reveal) === */
function RevealText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');
  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 0.3em', ...style }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotateX: -40 }}
            animate={inView ? { y: 0, rotateX: 0 } : { y: '110%', rotateX: -40 }}
            transition={{ duration: 0.7, delay: delay + i * 0.04, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* === COUNTER === */
function AnimCounter({
  target,
  suffix = '',
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, target, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* === MARQUEE === */
function InfiniteMarquee({
  items,
  speed = 30,
}: {
  items: { icon: string; text: string }[];
  speed?: number;
}) {
  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(90deg, var(--bg-primary), transparent)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(270deg, var(--bg-primary), transparent)',
          zIndex: 2,
        }}
      />
      <motion.div
        animate={{ x: [0, -50 * items.length] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' as const }}
        style={{ display: 'flex', gap: 32, width: 'max-content', padding: '16px 0' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 24px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* === FLOATING PARTICLE FIELD === */
function ParticleField() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number; dur: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        dur: Math.random() * 8 + 6,
      })),
    );
  }, []);

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(167,139,250,0.4)',
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      ))}
    </div>
  );
}

/* === SECTION REVEAL === */
function Section({
  children,
  className,
  style,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0.0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

/* === HORIZONTAL SCROLL SECTION === */
function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    function measure() {
      if (innerRef.current) {
        const totalWidth = innerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        setScrollRange(Math.max(0, totalWidth - viewportWidth));
        setMeasured(true);
      }
    }
    // Wait a frame for children to render
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Container height = 100vh (sticky viewport) + scroll distance
  // Use a sensible default before measurement; once measured, use exact value
  const containerHeight = measured
    ? scrollRange > 0
      ? `calc(100vh + ${scrollRange}px)`
      : '100vh'
    : '200vh';

  return (
    <div ref={containerRef} style={{ height: containerHeight, position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <motion.div
          ref={innerRef}
          style={{ x, display: 'flex', gap: 32, paddingLeft: 80, paddingRight: 200 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* === SCROLL ANIMATED ITEM === */
function ScrollItem({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* === BENTO ITEM === */
function BentoItem({
  children,
  delay = 0,
  span,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  span: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      style={{ gridColumn: `span ${span}`, ...style }}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(cursorY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, [cursorX, cursorY]);

  /* -- Module Data -- */
  const modules = [
    {
      id: 'editor',
      label: 'Slide Editor',
      icon: '*',
      headline: 'Create Without Limits',
      body: '28 element types, drag-and-drop canvas, real-time collaboration, and AI-assisted design in one infinite workspace.',
      metrics: [
        { v: '28', l: 'Element Types' },
        { v: '12', l: 'Themes' },
        { v: '18', l: 'Animations' },
        { v: '7', l: 'Transitions' },
      ],
      color: '#a78bfa',
      href: '/editor',
    },
    {
      id: 'code',
      label: 'Coding Lab',
      icon: '#',
      headline: 'Code. Debug. Ship.',
      body: 'Full IDE with 8 languages, breakpoint debugger, profiler, unit tests, Docker sandboxing, and live collaboration.',
      metrics: [
        { v: '8', l: 'Languages' },
        { v: '30+', l: 'IDE Features' },
        { v: '9', l: 'Output Tabs' },
        { v: 'Inf', l: 'Execution' },
      ],
      color: '#34d399',
      href: '/coding-lab',
    },
    {
      id: 'sim',
      label: 'Simulations',
      icon: '@',
      headline: 'Visualize Everything',
      body: '40+ interactive simulations across algorithms, data structures, physics, AI/ML, OS, and networking with step-by-step controls.',
      metrics: [
        { v: '40+', l: 'Simulations' },
        { v: '10', l: 'Categories' },
        { v: '9', l: 'Control Panels' },
        { v: 'Live', l: 'Animation' },
      ],
      color: '#38bdf8',
      href: '/simulations',
    },
    {
      id: 'ai',
      label: 'AI Tools',
      icon: '+',
      headline: 'Intelligence Built In',
      body: '30 AI tools to generate slides, quizzes, rubrics, summaries, narration, translations, and more with one prompt.',
      metrics: [
        { v: '30', l: 'AI Tools' },
        { v: '10', l: 'Categories' },
        { v: '20+', l: 'Languages' },
        { v: '6', l: 'Voice Profiles' },
      ],
      color: '#f472b6',
      href: '/ai-tools',
    },
    {
      id: 'class',
      label: 'Classroom',
      icon: '=',
      headline: 'Teach in Real Time',
      body: 'Live sessions with whiteboard, quiz battles, breakout rooms, assignments, attendance, and XP gamification.',
      metrics: [
        { v: '10', l: 'Tabs' },
        { v: '4', l: 'Roles' },
        { v: 'Live', l: 'Chat' },
        { v: 'XP', l: 'Gamification' },
      ],
      color: '#fbbf24',
      href: '/classroom',
    },
  ];

  const capabilities = [
    {
      title: 'Drag & Drop Editor',
      desc: '28 element types on an infinite canvas with snapping, alignment, and smart guides.',
      gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    },
    {
      title: 'Live Code Execution',
      desc: '8 languages with Docker sandboxing, breakpoints, profiler, and real-time output.',
      gradient: 'linear-gradient(135deg, #22c55e, #34d399)',
    },
    {
      title: '40+ Simulations',
      desc: 'Algorithms, data structures, physics, AI/ML, OS, and networking, fully interactive.',
      gradient: 'linear-gradient(135deg, #38bdf8, #22d3ee)',
    },
    {
      title: '30 AI Tools',
      desc: 'Generate quizzes, slides, narration, translations, code reviews, and lesson plans.',
      gradient: 'linear-gradient(135deg, #f472b6, #fb7185)',
    },
    {
      title: 'Live Classroom',
      desc: 'Real-time sessions with chat, whiteboard, quiz battles, breakout rooms, and XP.',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    },
    {
      title: 'Deep Analytics',
      desc: 'Track engagement, performance, student progress, and content effectiveness.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    },
    {
      title: 'Template Marketplace',
      desc: 'Browse, purchase, and publish educational templates across 7 categories.',
      gradient: 'linear-gradient(135deg, #ec4899, #d946ef)',
    },
    {
      title: 'Enterprise Security',
      desc: 'AES-256 encryption, RBAC, SSO/SAML, GDPR/HIPAA compliance, and audit logs.',
      gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    },
  ];

  const stats = [
    { value: 200, suffix: '+', label: 'Platform Features' },
    { value: 28, suffix: '', label: 'Element Types' },
    { value: 40, suffix: '+', label: 'Simulations' },
    { value: 30, suffix: '', label: 'AI Tools' },
    { value: 8, suffix: '', label: 'Code Languages' },
    { value: 15, suffix: '', label: 'Settings Sections' },
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'Architect',
      desc: 'Design your course structure with modular slide decks, templates, and master layouts. Set up your brand kit, themes, and reusable components.',
      color: '#a78bfa',
      icon: '&#9878;',
      tags: ['Templates', 'Themes', 'Layouts'],
    },
    {
      num: '02',
      title: 'Amplify',
      desc: 'Supercharge content with AI -- auto-generate quizzes, summaries, diagrams, narration, and translations. Let intelligence handle the heavy lifting.',
      color: '#f472b6',
      icon: '&#9889;',
      tags: ['AI Tools', 'Auto-Gen', 'Narration'],
    },
    {
      num: '03',
      title: 'Activate',
      desc: 'Go live with real-time classroom tools. Students interact with code, simulations, polls, and quizzes -- all synchronized and gamified.',
      color: '#34d399',
      icon: '&#9654;',
      tags: ['Live Class', 'Gamified', 'Real-time'],
    },
    {
      num: '04',
      title: 'Optimize',
      desc: 'Measure everything. Engagement heatmaps, performance analytics, student insights, and AI-powered recommendations continuously improve outcomes.',
      color: '#38bdf8',
      icon: '&#9881;',
      tags: ['Analytics', 'Heatmaps', 'Insights'],
    },
  ];

  const socialProof = [
    { icon: 'GR', text: 'Engineering Universities' },
    { icon: 'PR', text: 'Professional Academies' },
    { icon: 'CO', text: 'Corporate Training' },
    { icon: 'BC', text: 'Bootcamps & Cohorts' },
    { icon: 'RI', text: 'Research Institutions' },
    { icon: 'GL', text: 'Global Classrooms' },
    { icon: 'RE', text: 'Remote Education' },
    { icon: 'CP', text: 'Competition Prep' },
  ];

  const curMod = modules[activeModule];

  const bentoItems = [
    {
      span: 7,
      title: 'Enterprise-Grade Infrastructure',
      desc: 'AES-256 encryption, RBAC with 5 roles, SSO/SAML, GDPR & HIPAA compliance, rate limiting, and full audit logging.',
      color: '#38bdf8',
    },
    {
      span: 5,
      title: 'AI That Actually Works',
      desc: '30 production-grade AI tools for content generation, assessment creation, and adaptive learning workflows.',
      color: '#f472b6',
    },
    {
      span: 4,
      title: '15 Settings Sections',
      desc: 'From security & RBAC to CDN, monitoring, backup, compliance, and notification preferences.',
      color: '#a78bfa',
    },
    {
      span: 4,
      title: '12 Built-in Themes',
      desc: 'Default, Dark, Ocean, Sunset, Forest, Minimal, Neon, Academic, plus custom themes and Brand Kit.',
      color: '#22c55e',
    },
    {
      span: 4,
      title: 'Export Everything',
      desc: 'PDF, PNG, SVG, HTML, Markdown, ISL, PPTX, embedded iframes -- 8+ export formats.',
      color: '#fbbf24',
    },
    {
      span: 5,
      title: 'Real-Time Collaboration',
      desc: 'Live cursors, threaded comments, chat, version history, change tracking, and 3 permission levels for sharing.',
      color: '#34d399',
    },
    {
      span: 7,
      title: 'Analytics That Drive Outcomes',
      desc: '6 dashboard tabs with engagement heatmaps, performance metrics, student insights, content analytics, and 4 export formats.',
      color: '#fb923c',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'clip' }}>
      <NoiseSVG />

      {/* CUSTOM CURSOR GLOW */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          position: 'fixed',
          top: -200,
          left: -200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ============================================================
          NAVIGATION
      ============================================================ */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 8px 8px 20px',
          borderRadius: 999,
          background: scrolled ? 'rgba(10,10,15,0.85)' : 'rgba(10,10,15,0.5)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: '#fff',
            }}
          >
            E
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            EduVision X
          </span>
        </div>

        <div
          style={{
            width: 1,
            height: 18,
            background: 'rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        />

        {['Features', 'Modules', 'Pricing'].map((label) => (
          <Link
            key={label}
            href={
              label === 'Pricing'
                ? '/pricing'
                : label === 'Modules'
                  ? '#modules'
                  : '#capabilities'
            }
            style={{
              textDecoration: 'none',
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              borderRadius: 999,
              transition: 'all 0.25s',
            }}
          >
            {label}
          </Link>
        ))}

        <div
          style={{
            width: 1,
            height: 18,
            background: 'rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        />

        <Link
          href="/auth/login"
          style={{
            textDecoration: 'none',
            padding: '6px 14px',
            fontSize: 12.5,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            borderRadius: 999,
          }}
        >
          Sign In
        </Link>

        <Link
          href="/dashboard"
          style={{
            textDecoration: 'none',
            padding: '8px 20px',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#fff',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 2px 12px rgba(124,58,237,0.4)',
            transition: 'all 0.25s',
          }}
        >
          Get Started
        </Link>
      </motion.nav>

      {/* ============================================================
          HERO  --  Cinematic Full-Viewport Reveal
      ============================================================ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '160px 24px 120px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <ParticleField />

        {/* Mesh gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: [
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124,58,237,0.12), transparent)',
              'radial-gradient(ellipse 60% 40% at 80% 30%, rgba(56,189,248,0.08), transparent)',
              'radial-gradient(ellipse 50% 60% at 50% 80%, rgba(244,114,182,0.06), transparent)',
            ].join(', '),
          }}
        />

        {/* Concentric circles */}
        {[600, 900, 1200].map((size, i) => (
          <motion.div
            key={size}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: '1px solid rgba(124,58,237,0.04)',
              top: '50%',
              left: '50%',
              marginTop: -size / 2,
              marginLeft: -size / 2,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: 'linear' as const,
            }}
          />
        ))}

        {/* Orbiting dots */}
        {[
          { size: 300, dur: 12, r: 4, color: '#a78bfa' },
          { size: 450, dur: 18, r: 3, color: '#38bdf8' },
          { size: 550, dur: 24, r: 3, color: '#f472b6' },
        ].map((orb, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              top: '50%',
              left: '50%',
              marginTop: -orb.size / 2,
              marginLeft: -orb.size / 2,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: 'linear' as const }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: -orb.r,
                width: orb.r * 2,
                height: orb.r * 2,
                borderRadius: '50%',
                background: orb.color,
                boxShadow: `0 0 16px ${orb.color}60`,
              }}
            />
          </motion.div>
        ))}

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 920 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              borderRadius: 999,
              marginBottom: 40,
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.15)',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#c4b5fd',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.5)',
              }}
            />
            Now Open -- 200+ Features Live
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(44px, 7vw, 88px)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.05em',
              color: '#fff',
              margin: '0 0 32px',
            }}
          >
            <RevealText text="The Operating System" delay={0.3} />
            <br />
            <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
              <RevealText text="for" delay={0.6} />
              <span style={{ overflow: 'hidden', display: 'inline-block' }}>
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #a78bfa, #38bdf8, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Modern Education
                </motion.span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 600,
              margin: '0 auto 52px',
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Interactive slides, live coding, 40+ simulations, AI generation, real-time
            classrooms, and deep analytics -- unified in one platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <MagneticButton href="/dashboard">
              <div
                style={{
                  padding: '16px 40px',
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 999,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  boxShadow:
                    '0 4px 32px rgba(124,58,237,0.4), 0 0 0 1px rgba(124,58,237,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Start Building Free
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {'>'}
                </motion.span>
              </div>
            </MagneticButton>

            <MagneticButton href="/editor">
              <div
                style={{
                  padding: '16px 40px',
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 999,
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Try the Editor
              </div>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: 40, left: '50%', marginLeft: -12 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 24,
              height: 40,
              borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: 8,
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 3,
                height: 8,
                borderRadius: 99,
                background: 'rgba(255,255,255,0.4)',
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================
          STATS  --  Horizontal Counter Bar
      ============================================================ */}
      <Section style={{ padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '-40px auto 0',
            padding: 2,
            borderRadius: 24,
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(56,189,248,0.15), rgba(244,114,182,0.2))',
          }}
        >
          <div
            style={{
              borderRadius: 22,
              padding: '32px 0',
              background: 'linear-gradient(135deg, rgba(16,16,24,0.98), rgba(10,10,15,0.99))',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '8px 16px',
                  borderRight:
                    i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  <AnimCounter target={s.value} suffix={s.suffix} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.35)',
                    fontWeight: 600,
                    marginTop: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================
          MARQUEE  --  Social Proof
      ============================================================ */}
      <Section style={{ padding: '80px 0 40px' }}>
        <InfiniteMarquee items={socialProof} speed={35} />
      </Section>

      {/* ============================================================
          MODULE EXPLORER  --  Interactive Tab Showcase
      ============================================================ */}
      <Section id="modules" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: 16,
            }}
          >
            Platform Modules
          </motion.span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#fff',
              margin: 0,
            }}
          >
            <RevealText text="Five Engines." />
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <RevealText text="One Platform." delay={0.2} />
            </span>
          </h2>
        </div>

        {/* Tab selector */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            padding: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            width: 'fit-content',
            margin: '0 auto 48px',
          }}
        >
          {modules.map((m, i) => (
            <motion.button
              key={m.id}
              onClick={() => setActiveModule(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                background: activeModule === i ? m.color : 'transparent',
                color: activeModule === i ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: activeModule === i ? `0 4px 24px ${m.color}40` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12 }}>{m.icon}</span>
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Active module display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={curMod.id}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              borderRadius: 28,
              padding: 2,
              background: `linear-gradient(135deg, ${curMod.color}40, transparent 50%, ${curMod.color}20)`,
            }}
          >
            <div
              style={{
                borderRadius: 26,
                padding: '56px 64px',
                background: 'linear-gradient(160deg, rgba(16,16,24,0.98), rgba(10,10,15,0.99))',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 64,
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 380,
              }}
            >
              {/* Background radial */}
              <div
                style={{
                  position: 'absolute',
                  width: 500,
                  height: 500,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${curMod.color}08, transparent 70%)`,
                  top: -100,
                  right: -100,
                  pointerEvents: 'none',
                }}
              />

              {/* Left: Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 16px',
                    borderRadius: 999,
                    marginBottom: 24,
                    background: `${curMod.color}15`,
                    border: `1px solid ${curMod.color}30`,
                    fontSize: 12,
                    fontWeight: 700,
                    color: curMod.color,
                  }}
                >
                  <span>{curMod.icon}</span> {curMod.label}
                </div>
                <h3
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.1,
                    color: '#fff',
                    margin: '0 0 18px',
                  }}
                >
                  {curMod.headline}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                    margin: '0 0 32px',
                    maxWidth: 440,
                  }}
                >
                  {curMod.body}
                </p>
                <Link
                  href={curMod.href}
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 32px',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                    background: curMod.color,
                    color: '#fff',
                    boxShadow: `0 4px 24px ${curMod.color}40`,
                    transition: 'all 0.3s',
                  }}
                >
                  {'Explore ' + curMod.label + ' ->'}
                </Link>
              </div>

              {/* Right: Metrics grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {curMod.metrics.map((m, i) => (
                  <motion.div
                    key={m.l}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    style={{
                      padding: '28px 20px',
                      borderRadius: 20,
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: curMod.color,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                      }}
                    >
                      {m.v}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 600,
                        marginTop: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {m.l}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* ============================================================
          CAPABILITIES  --  Horizontal Scroll Gallery
      ============================================================ */}
      <div id="capabilities" />
      <HorizontalScroll>
        {/* Section header card */}
        <div
          style={{
            minWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: 16,
            }}
          >
            Capabilities
          </span>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#fff',
              margin: '0 0 20px',
            }}
          >
            Everything
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              You Need.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.7,
              maxWidth: 340,
            }}
          >
            Eight core capabilities that make EduVision X the most complete education
            platform ever built.
          </p>
        </div>

        {/* Capability cards */}
        {capabilities.map((cap, idx) => (
          <TiltCard key={cap.title} style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 340,
                minHeight: 380,
                borderRadius: 24,
                padding: 2,
                background: `linear-gradient(160deg, ${cap.gradient.split(',')[1]?.replace(')', '')}40, transparent 60%)`,
              }}
            >
              <div
                style={{
                  borderRadius: 22,
                  padding: '36px 28px',
                  height: '100%',
                  background:
                    'linear-gradient(160deg, rgba(16,16,24,0.98), rgba(10,10,15,0.99))',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${cap.gradient.split(',')[1]?.replace(')', '')}10, transparent 70%)`,
                    top: -60,
                    right: -60,
                    pointerEvents: 'none',
                  }}
                />

                {/* Number */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.15)',
                    marginBottom: 24,
                  }}
                >
                  {'0' + (idx + 1)}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: cap.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 24,
                    boxShadow: `0 8px 32px ${cap.gradient.split(',')[1]?.replace(')', '')}30`,
                  }}
                >
                  {'0' + (idx + 1)}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: '0 0 12px',
                  }}
                >
                  {cap.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {cap.desc}
                </p>

                {/* Decorative line */}
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    marginTop: 24,
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)',
                  }}
                />
              </div>
            </div>
          </TiltCard>
        ))}
      </HorizontalScroll>

      {/* ============================================================
          JOURNEY  --  Four Step Process
      ============================================================ */}
      <Section style={{ padding: '120px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: 16,
              display: 'block',
            }}
          >
            The Process
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#fff',
              margin: 0,
            }}
          >
            <RevealText text="Four Steps to" />
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #34d399, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <RevealText text="Transform Education" delay={0.2} />
            </span>
          </h2>
        </div>

        {/* Journey cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            position: 'relative',
          }}
        >
          {journeySteps.map((step, i) => (
            <ScrollItem
              key={step.num}
              delay={i * 0.12}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <TiltCard>
                <div
                  style={{
                    borderRadius: 24,
                    padding: 1.5,
                    background: `linear-gradient(160deg, ${step.color}40, transparent 50%, ${step.color}15)`,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 22.5,
                      padding: '32px 24px 28px',
                      background: 'linear-gradient(160deg, rgba(16,16,24,0.98), rgba(10,10,15,0.99))',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Background glow */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${step.color}10, transparent 70%)`,
                        top: -40,
                        right: -40,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Top row: step num + icon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: `${step.color}15`,
                          border: `1px solid ${step.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          color: step.color,
                        }}
                        dangerouslySetInnerHTML={{ __html: step.icon }}
                      />
                      <span
                        style={{
                          fontSize: 48,
                          fontWeight: 900,
                          lineHeight: 1,
                          color: 'rgba(255,255,255,0.04)',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {step.num}
                      </span>
                    </div>

                    {/* Step label */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: `${step.color}10`,
                        border: `1px solid ${step.color}20`,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: step.color,
                        marginBottom: 16,
                        width: 'fit-content',
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: step.color,
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      Step {step.num}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: '-0.03em',
                        margin: '0 0 12px',
                        lineHeight: 1.15,
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 13.5,
                        color: 'rgba(255,255,255,0.4)',
                        lineHeight: 1.7,
                        margin: '0 0 20px',
                        flex: 1,
                      }}
                    >
                      {step.desc}
                    </p>

                    {/* Divider */}
                    <div
                      style={{
                        width: '100%',
                        height: 1,
                        background: `linear-gradient(90deg, ${step.color}20, transparent)`,
                        marginBottom: 16,
                      }}
                    />

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.45)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollItem>
          ))}
        </div>

        {/* Connecting progress bar below cards */}
        <div style={{ maxWidth: 800, margin: '48px auto 0', position: 'relative' }}>
          <div
            style={{
              height: 2,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE }}
              style={{
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #34d399, #38bdf8)',
              }}
            />
          </div>
          {/* Dots on the progress bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -5 }}>
            {journeySteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.4, duration: 0.4, ease: EASE }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: step.color,
                  boxShadow: `0 0 12px ${step.color}60`,
                }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================
          BENTO  --  Feature Grid
      ============================================================ */}
      <Section style={{ padding: '80px 24px 120px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#f472b6',
              marginBottom: 16,
              display: 'block',
            }}
          >
            Why Teams Choose Us
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#fff',
              margin: 0,
            }}
          >
            <RevealText text="Built for Speed." />
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f472b6, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <RevealText text="Designed for Scale." delay={0.2} />
            </span>
          </h2>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'auto auto auto',
            gap: 16,
          }}
        >
          {bentoItems.map((item, i) => (
            <BentoItem
              key={item.title}
              delay={i * 0.08}
              span={item.span}
              style={{
                borderRadius: 24,
                padding: 1.5,
                background: `linear-gradient(160deg, ${item.color}35, transparent 60%, ${item.color}15)`,
              }}
            >
              <div
                style={{
                  borderRadius: 22.5,
                  padding: item.span >= 7 ? '36px 40px' : '32px 28px',
                  background:
                    'linear-gradient(160deg, rgba(16,16,24,0.98), rgba(10,10,15,0.99))',
                  minHeight: item.span >= 7 ? 200 : 180,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${item.color}06, transparent 70%)`,
                    bottom: -80,
                    right: -60,
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: item.color,
                    marginBottom: 20,
                  }}
                >
                  {'0' + (i + 1)}
                </div>

                <h3
                  style={{
                    fontSize: item.span >= 7 ? 22 : 18,
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: '0 0 10px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.65,
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </BentoItem>
          ))}
        </div>
      </Section>

      {/* ============================================================
          CTA  --  Final Call to Action
      ============================================================ */}
      <Section style={{ padding: '80px 24px 140px' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            padding: '100px 48px',
            borderRadius: 32,
            overflow: 'hidden',
          }}
        >
          {/* Animated mesh background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: [
                'radial-gradient(ellipse 100% 100% at 30% 50%, rgba(124,58,237,0.12), transparent)',
                'radial-gradient(ellipse 80% 80% at 70% 50%, rgba(56,189,248,0.08), transparent)',
                'radial-gradient(ellipse 60% 60% at 50% 80%, rgba(244,114,182,0.06), transparent)',
              ].join(', '),
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 32,
            }}
          />

          {/* Orbiting ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' as const }}
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              top: '50%',
              left: '50%',
              marginTop: -250,
              marginLeft: -250,
              borderRadius: '50%',
              border: '1px dashed rgba(124,58,237,0.1)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                margin: '0 auto 32px',
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
              }}
            >
              X
            </motion.div>

            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#fff',
                margin: '0 0 20px',
              }}
            >
              <RevealText text="Start Building" />
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #38bdf8, #f472b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <RevealText text="What Matters" delay={0.15} />
              </span>
            </h2>

            <p
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.45)',
                maxWidth: 480,
                margin: '0 auto 44px',
                lineHeight: 1.7,
              }}
            >
              Join educators worldwide using EduVision X to create interactive, AI-powered
              learning experiences that actually move the needle.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <MagneticButton href="/dashboard">
                <div
                  style={{
                    padding: '18px 44px',
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 999,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    boxShadow: '0 4px 32px rgba(124,58,237,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  Get Started Free
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {'>'}
                  </motion.span>
                </div>
              </MagneticButton>

              <MagneticButton href="/pricing">
                <div
                  style={{
                    padding: '18px 44px',
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 999,
                    color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  View Pricing
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================
          FOOTER  --  Minimal & Clean
      ============================================================ */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '60px 24px 40px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                }}
              >
                E
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                EduVision X
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              The all-in-one interactive learning operating system for modern educators and
              institutions.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['X', 'in', 'gh'].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              title: 'Platform',
              links: [
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Editor', href: '/editor' },
                { label: 'Coding Lab', href: '/coding-lab' },
                { label: 'AI Tools', href: '/ai-tools' },
                { label: 'Simulations', href: '/simulations' },
              ],
            },
            {
              title: 'Learn',
              links: [
                { label: 'Classroom', href: '/classroom' },
                { label: 'Analytics', href: '/analytics' },
                { label: 'Marketplace', href: '/marketplace' },
                { label: 'Templates', href: '/marketplace' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About', href: '#' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Security', href: '#' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 20,
                }}
              >
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.4)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: '40px auto 0',
            padding: '20px 0 0',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <span>2026 EduVision X. All rights reserved.</span>
          <span>Crafted with precision.</span>
        </div>
      </footer>
    </div>
  );
}
