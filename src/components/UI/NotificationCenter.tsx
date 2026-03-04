'use client';
/* ═══════════════════════════════════════════════════════
   NotificationCenter — Toast-style notification center
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

interface Props { open: boolean; onClose: () => void; }

export default function NotificationCenter({ open, onClose }: Props) {
  const notifications = useSlideStore(s => s.notifications);
  const markNotificationRead = useSlideStore(s => s.markNotificationRead);
  const clearNotifications = useSlideStore(s => s.clearNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const typeIcons: Record<string, string> = {
    save: '💾', share: '🔗', collab: '👥', ai: '🤖', export: '📦', error: '⚠️',
    comment: '💬', system: '⚙️',
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-3 top-16 z-[9986] w-[320px] rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', maxHeight: 480 }}
        initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'var(--accent)', color: 'white' }}>{unreadCount}</span>
            )}
          </div>
          <div className="flex gap-1">
            {notifications.length > 0 && (
              <button className="text-[10px] px-2 py-0.5 rounded transition-colors"
                style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={clearNotifications}
              >Clear all</button>
            )}
            <button className="btn-icon" onClick={onClose} style={{ width: 24, height: 24 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1 px-4 py-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} className="px-2 py-0.5 rounded text-[10px] capitalize transition-colors"
              style={{
                background: filter === f ? 'var(--accent-dim)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer',
              }}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs" style={{ color: 'var(--text-muted)' }}>
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </div>
          ) : (
            filtered.map(n => (
              <motion.div key={n.id}
                className="flex gap-2 px-4 py-2.5 cursor-pointer transition-colors"
                style={{ background: n.read ? 'transparent' : 'var(--accent-dim)', borderBottom: '1px solid var(--border)' }}
                whileHover={{ x: 2 }}
                onClick={() => markNotificationRead(n.id)}
              >
                <span className="text-sm mt-0.5">{typeIcons[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: 'var(--text-primary)', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent)' }} />}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
