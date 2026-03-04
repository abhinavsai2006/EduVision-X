'use client';
/* ═══════════════════════════════════════════════════════
   EmojiSymbolPicker — Combined emoji + symbol picker
   for inserting special characters into elements
   ═══════════════════════════════════════════════════════ */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideStore } from '@/store/useSlideStore';

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Smileys': ['😀','😂','🥹','😊','😎','🤩','🥳','😤','😱','🤔','😴','🤯','🥰','😇','🤗','😈','💀','👻','🤖','👽'],
  'Gestures': ['👍','👎','✌️','🤞','🤟','🤙','👋','🙌','👏','🤝','💪','🙏','☝️','✋','🤚','🖐️','👊','✊','🫶','🫡'],
  'People': ['👤','👥','🧑‍💻','👩‍🏫','🧑‍🎓','👨‍🔬','👩‍🎨','🧑‍🚀','🦸','🧙','🧑‍⚕️','👷','💂','🕵️','👸','🤴','🧕','👳','🎅','🤶'],
  'Nature': ['🌟','⭐','🌙','☀️','🌈','🔥','💧','❄️','🌊','⚡','🌺','🌻','🌸','🍀','🌿','🌴','🌵','🍁','🌍','🌏'],
  'Objects': ['📱','💻','⌨️','🖥️','💡','🔧','⚙️','🔬','🔭','💊','🧪','📡','🔋','💾','📀','🎮','🎯','🏆','🎨','🎭'],
  'Education': ['📚','📖','📝','✏️','📐','📏','🎓','🏫','📊','📈','📉','🔍','💯','✅','❌','❓','❗','💬','🗂️','📋'],
  'Math': ['➕','➖','✖️','➗','🟰','♾️','📐','📏','🔢','🔣','#️⃣','*️⃣','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣'],
  'Arrows': ['⬆️','⬇️','⬅️','➡️','↗️','↘️','↙️','↖️','↕️','↔️','🔄','🔃','🔀','🔁','🔂','▶️','◀️','⏩','⏪','⏫'],
};

const SYMBOLS: Record<string, string[]> = {
  'Math': ['±','×','÷','≠','≈','≤','≥','∞','∑','∏','∫','√','∛','∜','∆','∇','∂','∈','∉','∋','∌','⊂','⊃','⊆','⊇','∪','∩','∅','∀','∃','∄','¬','∧','∨','⊕','⊗','⊥','∥','∠','∡','π','ℯ','ℕ','ℤ','ℚ','ℝ','ℂ'],
  'Greek': ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω','Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'],
  'Arrows': ['←','↑','→','↓','↔','↕','↖','↗','↘','↙','⇐','⇑','⇒','⇓','⇔','⇕','⟵','⟶','⟷','⟸','⟹','⟺','↦','↤','↩','↪','↰','↱','↲','↳','⤴','⤵'],
  'Subscript': ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉','₊','₋','₌','₍','₎','ₐ','ₑ','ₒ','ₓ','ₔ','ₕ','ₖ','ₗ','ₘ','ₙ','ₚ','ₛ','ₜ'],
  'Superscript': ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','⁺','⁻','⁼','⁽','⁾','ⁿ','ⁱ'],
  'Currency': ['$','€','£','¥','₹','₽','₩','₿','¢','₣','₤','₦','₧','₪','₫','₭','₮','₱','₲','₳','₴','₵','₶','₷','₸','₹','₺','₻','₼','₽','₾','₿'],
  'Misc': ['©','®','™','°','†','‡','§','¶','•','…','‰','‱','′','″','‹','›','«','»','‐','–','—','~','⁓','‖','¦','⁂','☆','★','♠','♣','♥','♦','♩','♪','♫','♬','✓','✗','✘','✔','✕','✖'],
};

interface Props { open: boolean; onClose: () => void; }

export default function EmojiSymbolPicker({ open, onClose }: Props) {
  const [tab, setTab] = useState<'emoji' | 'symbol'>('emoji');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(EMOJI_CATEGORIES)[0]);
  const [recent, setRecent] = useState<string[]>([]);

  const categories = tab === 'emoji' ? EMOJI_CATEGORIES : SYMBOLS;
  const categoryKeys = Object.keys(categories);

  const filteredItems = useMemo(() => {
    if (!search) return categories[selectedCategory] || [];
    const q = search.toLowerCase();
    return Object.values(categories).flat().filter(item =>
      item.toLowerCase().includes(q) || selectedCategory.toLowerCase().includes(q)
    );
  }, [search, categories, selectedCategory]);

  const handleSelect = (char: string) => {
    // Copy to clipboard and insert
    navigator.clipboard.writeText(char);
    setRecent(prev => [char, ...prev.filter(c => c !== char)].slice(0, 20));

    // Try to insert into active element
    const store = useSlideStore.getState();
    const sel = store.selectedElementIds;
    if (sel.length === 1) {
      const slide = store.presentation.slides[store.currentSlideIndex];
      const el = slide.elements.find(e => e.id === sel[0]);
      if (el && el.content !== undefined) {
        store.snapshot();
        store.updateElement(el.id, { content: (el.content || '') + char });
      }
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', height: 440 }}
          initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex gap-1">
              {(['emoji', 'symbol'] as const).map(t => (
                <button key={t} className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{
                    background: tab === t ? 'var(--accent-dim)' : 'transparent',
                    color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer',
                  }}
                  onClick={() => { setTab(t); setSelectedCategory(Object.keys(t === 'emoji' ? EMOJI_CATEGORIES : SYMBOLS)[0]); }}
                >{t === 'emoji' ? '😊 Emoji' : '∑ Symbols'}</button>
              ))}
            </div>
            <button className="btn-icon" onClick={onClose} style={{ width: 24, height: 24 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-2">
            <input
              className="input-field w-full"
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '5px 10px', fontSize: 12 }}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-1 px-4 py-1 overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
            {recent.length > 0 && (
              <button className="px-2 py-1 rounded text-xs shrink-0 transition-all"
                style={{
                  background: selectedCategory === 'Recent' ? 'var(--accent-dim)' : 'transparent',
                  color: selectedCategory === 'Recent' ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setSelectedCategory('Recent')}
              >Recent</button>
            )}
            {categoryKeys.map(cat => (
              <button key={cat} className="px-2 py-1 rounded text-xs shrink-0 transition-all"
                style={{
                  background: selectedCategory === cat ? 'var(--accent-dim)' : 'transparent',
                  color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                }}
                onClick={() => setSelectedCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-3" style={{ height: 260 }}>
            <div className="flex flex-wrap gap-1">
              {(selectedCategory === 'Recent' ? recent : filteredItems).map((item, i) => (
                <motion.button
                  key={`${item}-${i}`}
                  className="flex items-center justify-center rounded-md transition-colors"
                  style={{
                    width: tab === 'emoji' ? 36 : 32,
                    height: tab === 'emoji' ? 36 : 32,
                    fontSize: tab === 'emoji' ? 20 : 16,
                    background: 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                  whileHover={{ scale: 1.2, background: 'var(--bg-hover)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSelect(item)}
                  title={item}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>Click to insert into selected element</span>
            <span>Also copied to clipboard</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
