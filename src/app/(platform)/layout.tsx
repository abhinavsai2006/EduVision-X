'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Palette, Code2, Sparkles, Atom,
  GraduationCap, BarChart3, Store, User, Settings,
  ChevronLeft, Menu, X, Search,
} from 'lucide-react';

/* ── nav data ── */
const NAV = [
  { href: '/dashboard',  label: 'Dashboard',   Icon: LayoutDashboard },
  { href: '/editor',     label: 'Editor',       Icon: Palette },
  { href: '/coding-lab', label: 'Coding Lab',   Icon: Code2 },
  { href: '/ai-tools',   label: 'AI Tools',     Icon: Sparkles },
  { href: '/simulations',label: 'Simulations',  Icon: Atom },
  { href: '/classroom',  label: 'Classroom',    Icon: GraduationCap },
  { href: '/analytics',  label: 'Analytics',    Icon: BarChart3 },
  { href: '/marketplace',label: 'Marketplace',  Icon: Store },
];
const BOT = [
  { href: '/profile',  label: 'Profile',  Icon: User },
  { href: '/settings', label: 'Settings', Icon: Settings },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [col, setCol] = useState(false);
  const [mob, setMob] = useState(false);
  const [isMob, setIsMob] = useState(false);

  useEffect(() => {
    const c = () => setIsMob(window.innerWidth < 860);
    c(); window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  useEffect(() => { setMob(false); }, [pathname]);

  const sw = isMob ? 260 : col ? 60 : 220;
  const show = isMob ? mob : true;

  const NavItem = useCallback(({ href, label, Icon, bottom }: { href: string; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; bottom?: boolean }) => {
    const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <motion.div
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: col && !isMob ? '8px 0' : '7px 12px',
            justifyContent: col && !isMob ? 'center' : 'flex-start',
            borderRadius: 8, cursor: 'pointer',
            background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
            color: active ? '#a78bfa' : bottom ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.45)',
            fontSize: 13, fontWeight: active ? 600 : 400,
            transition: 'all 0.15s ease',
            position: 'relative',
          }}
        >
          {active && !col && (
            <motion.div
              layoutId="nav-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              style={{
                position: 'absolute', left: 0, top: '20%', bottom: '20%',
                width: 2, borderRadius: 4, background: '#8b5cf6',
              }}
            />
          )}
          <Icon size={17} strokeWidth={active ? 2 : 1.5} />
          <AnimatePresence>
            {(col && !isMob ? false : true) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.12 }}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
              >{label}</motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    );
  }, [pathname, col, isMob]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0a0f' }}>

      {/* mobile bar */}
      {isMob && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 52, zIndex: 200,
          background: '#0d0d14', borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#8b5cf6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff' }}>E</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>EduVision X</span>
          </div>
          <button onClick={() => setMob(!mob)} style={{
            width: 36, height: 36, borderRadius: 8, border: 'none',
            background: mob ? 'rgba(139,92,246,0.15)' : 'transparent',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{mob ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
      )}

      {/* overlay */}
      <AnimatePresence>
        {isMob && mob && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 299, backdropFilter: 'blur(3px)' }}
            onClick={() => setMob(false)}
          />
        )}
      </AnimatePresence>

      {/* sidebar */}
      <AnimatePresence>
        {show && (
          <motion.aside
            initial={isMob ? { x: -260 } : false}
            animate={{ width: sw, x: 0 }}
            exit={isMob ? { x: -260 } : undefined}
            transition={{ duration: 0.22, ease }}
            style={{
              background: '#0d0d14',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
              position: isMob ? 'fixed' : 'relative',
              top: isMob ? 52 : 0, left: 0, bottom: 0, zIndex: isMob ? 300 : 1,
            }}
          >
            {/* logo */}
            {!isMob && (
              <div style={{
                padding: col ? '16px 0' : '16px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                justifyContent: col ? 'center' : 'flex-start',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#8b5cf6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>E</div>
                <AnimatePresence>
                  {!col && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}
                    >EduVision X</motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* search hint */}
            {!col && !isMob && (
              <div style={{
                margin: '0 12px 8px', padding: '6px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.2)', fontSize: 12, cursor: 'pointer',
              }}>
                <Search size={13} />
                <span>Search</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 10, padding: '1px 5px', borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)',
                }}>Ctrl K</span>
              </div>
            )}

            {/* main nav */}
            <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
              <p style={{
                fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.15)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: col ? '8px 0' : '8px 12px', margin: 0,
                textAlign: col ? 'center' : 'left',
              }}>{col ? '...' : 'Navigation'}</p>
              {NAV.map(n => <NavItem key={n.href} {...n} />)}
            </nav>

            {/* bottom */}
            <div style={{ padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              {BOT.map(n => <NavItem key={n.href} {...n} bottom />)}
            </div>

            {/* collapse */}
            {!isMob && (
              <button onClick={() => setCol(!col)} style={{
                padding: '10px', border: 'none', background: 'transparent',
                color: 'rgba(255,255,255,0.15)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                borderTop: '1px solid rgba(255,255,255,0.03)',
              }}>
                <motion.div animate={{ rotate: col ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                  <ChevronLeft size={13} />
                </motion.div>
                {!col && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>Collapse</span>}
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* main */}
      <main style={{
        flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        marginTop: isMob ? 52 : 0, position: 'relative',
      }}>
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
