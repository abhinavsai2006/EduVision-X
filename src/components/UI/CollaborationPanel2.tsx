'use client';
/* ═══════════════════════════════════════════════════════
   CollaborationPanel — Real-time collab, sharing & chat
   ═══════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const AVATAR_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#f97316'];

interface Props { open: boolean; onClose: () => void; }

export default function CollaborationPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState<'share' | 'chat' | 'activity'>('share');
  const [shareEmail, setShareEmail] = useState('');
  const [chatInput, setChatInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const collaborators = useSlideStore(s => s.collaborators);
  const shareLink = useSlideStore(s => s.shareLink);
  const sharePermission = useSlideStore(s => s.sharePermission);
  const isShared = useSlideStore(s => s.isShared);
  const chatMessages = useSlideStore(s => s.chatMessages);
  const notifications = useSlideStore(s => s.notifications);
  const changeTracking = useSlideStore(s => s.changeTracking);
  const reviewMode = useSlideStore(s => s.reviewMode);
  const showCollaboratorCursors = useSlideStore(s => s.showCollaboratorCursors);

  const setShareLink = useSlideStore(s => s.setShareLink);
  const setSharePermission = useSlideStore(s => s.setSharePermission);
  const setIsShared = useSlideStore(s => s.setIsShared);
  const addChatMessage = useSlideStore(s => s.addChatMessage);
  const toggleChangeTracking = useSlideStore(s => s.toggleChangeTracking);
  const toggleReviewMode = useSlideStore(s => s.toggleReviewMode);
  const toggleCollaboratorCursors = useSlideStore(s => s.toggleCollaboratorCursors);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  const handleShare = () => {
    if (!isShared) {
      setShareLink(`https://eduvision.app/p/${Date.now().toString(36)}`);
      setIsShared(true);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    addChatMessage({ id: crypto.randomUUID(), author: 'You', text: chatInput, timestamp: new Date().toISOString() });
    setChatInput('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    useSlideStore.getState().setStatusMessage('Link copied!');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-0 top-0 bottom-0 z-[9980] flex"
        initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Backdrop */}
        <div className="flex-1" onClick={onClose} />

        {/* Panel */}
        <div className="w-[360px] h-full flex flex-col"
          style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', boxShadow: '-8px 0 32px rgba(0,0,0,0.3)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Collaboration</h3>
            <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
            {(['share', 'chat', 'activity'] as const).map(t => (
              <button key={t} className="flex-1 py-2 text-xs font-medium capitalize transition-colors relative"
                style={{ color: tab === t ? 'var(--accent)' : 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setTab(t)}>
                {t}
                {tab === t && <motion.div layoutId="collab-tab" className="absolute bottom-0 left-2 right-2" style={{ height: 2, background: 'var(--accent)', borderRadius: 99 }} />}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>

            {tab === 'share' && (
              <>
                {/* Share toggle */}
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Share Presentation</span>
                    <button className="w-9 h-5 rounded-full transition-colors relative"
                      style={{ background: isShared ? 'var(--accent)' : 'var(--bg-hover)', border: 'none', cursor: 'pointer' }}
                      onClick={handleShare}>
                      <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all"
                        style={{ left: isShared ? 20 : 3 }} />
                    </button>
                  </div>

                  {isShared && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        <input className="input-field flex-1" value={shareLink} readOnly style={{ fontSize: 10, padding: '4px 8px' }} />
                        <button className="btn-secondary" onClick={copyLink} style={{ fontSize: 10, padding: '4px 8px' }}>Copy</button>
                      </div>

                      <div className="flex gap-1 mt-2">
                        {(['view', 'comment', 'edit'] as const).map(p => (
                          <button key={p} className="flex-1 py-1 rounded text-xs capitalize transition-colors"
                            style={{
                              background: sharePermission === p ? 'var(--accent-dim)' : 'transparent',
                              color: sharePermission === p ? 'var(--accent)' : 'var(--text-muted)',
                              border: `1px solid ${sharePermission === p ? 'var(--accent)' : 'var(--border)'}`,
                              cursor: 'pointer',
                            }}
                            onClick={() => setSharePermission(p)}
                          >{p}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Invite */}
                <div className="space-y-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Invite People</span>
                  <div className="flex gap-1">
                    <input className="input-field flex-1" placeholder="Email address" value={shareEmail}
                      onChange={e => setShareEmail(e.target.value)} style={{ fontSize: 11, padding: '5px 8px' }} />
                    <button className="btn-primary" style={{ fontSize: 10, padding: '4px 10px' }}>Invite</button>
                  </div>
                </div>

                {/* Collaborators */}
                <div className="space-y-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Active ({collaborators.length || 1})
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: 'var(--bg-primary)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: AVATAR_COLORS[0] }}>Y</div>
                      <div className="flex-1">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>You (Owner)</div>
                        <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Currently editing</div>
                      </div>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
                    </div>
                    {collaborators.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: 'var(--bg-primary)' }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length] }}>{c.name[0]}</div>
                        <div className="flex-1">
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ background: c.cursor ? '#10b981' : '#71717a' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Settings</span>
                  {[
                    { label: 'Change Tracking', value: changeTracking, toggle: toggleChangeTracking },
                    { label: 'Review Mode', value: reviewMode, toggle: toggleReviewMode },
                    { label: 'Show Cursors', value: showCollaboratorCursors, toggle: toggleCollaboratorCursors },
                  ].map(opt => (
                    <div key={opt.label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
                      <button className="w-8 h-4 rounded-full transition-colors relative"
                        style={{ background: opt.value ? 'var(--accent)' : 'var(--bg-hover)', border: 'none', cursor: 'pointer' }}
                        onClick={opt.toggle}>
                        <div className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
                          style={{ left: opt.value ? 17 : 2 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'chat' && (
              <div className="flex flex-col h-full">
                <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2 mb-3" style={{ minHeight: 200 }}>
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
                      No messages yet. Start a conversation!
                    </div>
                  )}
                  {chatMessages.map(m => (
                    <div key={m.id} className="px-2 py-1.5 rounded" style={{ background: m.author === 'You' ? 'var(--accent-dim)' : 'var(--bg-primary)' }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] font-semibold" style={{ color: m.author === 'You' ? 'var(--accent)' : 'var(--text-primary)' }}>{m.author}</span>
                        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input className="input-field flex-1" placeholder="Type a message…" value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    style={{ fontSize: 11, padding: '6px 8px' }} />
                  <button className="btn-primary" onClick={handleSendChat} style={{ fontSize: 10 }}>Send</button>
                </div>
              </div>
            )}

            {tab === 'activity' && (
              <div className="space-y-2">
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
                    No activity yet
                  </div>
                )}
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-2 px-2 py-1.5 rounded" style={{ background: n.read ? 'transparent' : 'var(--accent-dim)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? 'transparent' : 'var(--accent)' }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>{n.message}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(n.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
