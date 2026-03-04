'use client';
/* ═══════════════════════════════════════════════════════
   Marketplace v4.0 — Full Production Build
   Cart · Checkout · Preview Modal · Reviews · Ratings
   Upload to Sell · Revenue Dashboard · Collections
   Downloads History · Deep Filters · Creator Profiles
   ═══════════════════════════════════════════════════════ */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ─── */
interface Template {
  id: number; name: string; author: string; authorId: string; category: string;
  price: number; priceLabel: string; priceType: 'free' | 'paid' | 'premium';
  downloads: number; downloadsLabel: string; rating: number; reviews: number;
  rgb: string; icon: string; featured: boolean; tags: string[];
  description: string; slides: number; lastUpdated: string; preview: string[];
  collection?: string;
}
interface Review {
  templateId: number; author: string; avatar: string; rating: number;
  text: string; date: string; helpful: number;
}
interface CartItem { template: Template; quantity: number; }
interface Creator {
  id: string; name: string; avatar: string; bio: string; templates: number;
  followers: string; totalDownloads: string; totalRevenue: string; rgb: string; joined: string;
}
interface Purchase {
  templateId: number; name: string; date: string; price: string; icon: string;
}

/* ─── Data ─── */
const CREATORS: Creator[] = [
  { id: 'alice', name: 'Alice Chen', avatar: '👩‍🏫', bio: 'Educator & designer. 5+ years creating premium templates.', templates: 24, followers: '3.2k', totalDownloads: '124k', totalRevenue: '$8,240', rgb: '124,58,237', joined: 'Jan 2024' },
  { id: 'grace', name: 'Grace Park', avatar: '👩‍🔬', bio: 'Science educator with a passion for visual learning.', templates: 18, followers: '2.8k', totalDownloads: '98k', totalRevenue: '$5,960', rgb: '244,114,182', joined: 'Mar 2024' },
  { id: 'david', name: 'David Obi', avatar: '🧑‍💻', bio: 'Business strategist & pitch deck specialist.', templates: 15, followers: '2.1k', totalDownloads: '72k', totalRevenue: '$6,140', rgb: '34,197,94', joined: 'Feb 2024' },
  { id: 'feng', name: 'Feng Li', avatar: '🧑‍🎓', bio: 'Data scientist. Makes complex data beautiful.', templates: 12, followers: '1.9k', totalDownloads: '61k', totalRevenue: '$4,320', rgb: '56,189,248', joined: 'Apr 2024' },
  { id: 'carla', name: 'Carla Diaz', avatar: '👩‍💼', bio: 'Marketing expert. Conversion-focused templates.', templates: 9, followers: '1.4k', totalDownloads: '45k', totalRevenue: '$3,890', rgb: '239,68,68', joined: 'Jun 2024' },
  { id: 'hiro', name: 'Hiro Tanaka', avatar: '👨‍💻', bio: 'Engineer + technical writer. API docs made easy.', templates: 11, followers: '1.7k', totalDownloads: '53k', totalRevenue: '$2,100', rgb: '234,179,8', joined: 'May 2024' },
];

const ALL_TEMPLATES: Template[] = [
  { id: 1, name: 'Modern Lecture Kit', author: 'Alice Chen', authorId: 'alice', category: 'Education', price: 0, priceLabel: 'Free', priceType: 'free', downloads: 12400, downloadsLabel: '12.4k', rating: 4.9, reviews: 312, rgb: '124,58,237', icon: '🎓', featured: true, tags: ['slides', 'quizzes', 'notes'], description: 'A complete lecture kit with 40+ professional slides, quiz templates, and note-taking layouts. Perfect for university-level courses.', slides: 42, lastUpdated: '2026-02-20', preview: ['📊', '📝', '🗒️'], collection: 'Education Essentials' },
  { id: 2, name: 'Startup Pitch Deck', author: 'David Obi', authorId: 'david', category: 'Business', price: 14.99, priceLabel: '$14.99', priceType: 'paid', downloads: 8200, downloadsLabel: '8.2k', rating: 4.8, reviews: 224, rgb: '34,197,94', icon: '🚀', featured: true, tags: ['pitch', 'investors', 'growth'], description: 'Raise your next round with this battle-tested pitch deck. 25 slides covering problem, solution, market, traction, team, and ask.', slides: 25, lastUpdated: '2026-01-15', preview: ['💡', '📈', '👥'], collection: 'Business Premium' },
  { id: 3, name: 'Data Science Dashboard', author: 'Feng Li', authorId: 'feng', category: 'Science', price: 9.99, priceLabel: '$9.99', priceType: 'paid', downloads: 6100, downloadsLabel: '6.1k', rating: 4.7, reviews: 186, rgb: '56,189,248', icon: '📊', featured: false, tags: ['charts', 'analytics', 'python'], description: 'Pre-built dashboard layouts for data science presentations. Includes chart templates, metric cards, and pipeline diagrams.', slides: 30, lastUpdated: '2026-02-10', preview: ['📉', '🔢', '🧮'], collection: 'Science Series' },
  { id: 4, name: 'Creative Portfolio', author: 'Grace Park', authorId: 'grace', category: 'Creative', price: 7.99, priceLabel: '$7.99', priceType: 'paid', downloads: 9800, downloadsLabel: '9.8k', rating: 4.9, reviews: 445, rgb: '244,114,182', icon: '🎨', featured: true, tags: ['portfolio', 'design', 'art'], description: 'Showcase your work beautifully. 20 portfolio layouts with project showcase grids, about pages, and client testimonial blocks.', slides: 20, lastUpdated: '2026-02-28', preview: ['🎭', '✏️', '🖼️'], collection: 'Creative Suite' },
  { id: 5, name: 'API Documentation', author: 'Hiro Tanaka', authorId: 'hiro', category: 'Tech', price: 0, priceLabel: 'Free', priceType: 'free', downloads: 15300, downloadsLabel: '15.3k', rating: 4.6, reviews: 278, rgb: '234,179,8', icon: '⚙️', featured: false, tags: ['api', 'docs', 'rest'], description: 'Technical docs template for REST APIs. Includes endpoint tables, code blocks, auth flows, and versioning notes.', slides: 18, lastUpdated: '2026-01-30', preview: ['🔌', '📡', '🛡️'], collection: 'Tech Toolkit' },
  { id: 6, name: 'Marketing Campaign', author: 'Carla Diaz', authorId: 'carla', category: 'Marketing', price: 19.99, priceLabel: '$19.99', priceType: 'premium', downloads: 4500, downloadsLabel: '4.5k', rating: 4.8, reviews: 134, rgb: '239,68,68', icon: '📢', featured: false, tags: ['campaign', 'ads', 'roi'], description: 'Full campaign strategy deck with funnel diagrams, A/B test results layout, competitor analysis, and ROI calculation frames.', slides: 28, lastUpdated: '2026-02-15', preview: ['🎯', '💰', '📣'], collection: 'Marketing Pro' },
  { id: 7, name: 'Lab Report Template', author: 'Grace Park', authorId: 'grace', category: 'Science', price: 0, priceLabel: 'Free', priceType: 'free', downloads: 11700, downloadsLabel: '11.7k', rating: 4.5, reviews: 198, rgb: '139,92,246', icon: '🔬', featured: false, tags: ['lab', 'research', 'report'], description: 'Structured lab report template for chemistry, biology, and physics. Sections: hypothesis, method, results, analysis, conclusion.', slides: 12, lastUpdated: '2026-01-25', preview: ['🧪', '📈', '📋'], },
  { id: 8, name: 'SaaS Landing Page', author: 'David Obi', authorId: 'david', category: 'Tech', price: 12.99, priceLabel: '$12.99', priceType: 'paid', downloads: 7600, downloadsLabel: '7.6k', rating: 4.7, reviews: 167, rgb: '16,185,129', icon: '💻', featured: false, tags: ['saas', 'landing', 'conversion'], description: 'High-converting SaaS landing deck. Hero, features, social proof, pricing table, FAQ, and CTA sections — all editable.', slides: 16, lastUpdated: '2026-02-05', preview: ['🌐', '💳', '✅'], collection: 'Tech Toolkit' },
  { id: 9, name: 'Weekly Newsletter', author: 'Alice Chen', authorId: 'alice', category: 'Marketing', price: 4.99, priceLabel: '$4.99', priceType: 'paid', downloads: 3200, downloadsLabel: '3.2k', rating: 4.4, reviews: 89, rgb: '251,146,60', icon: '📧', featured: false, tags: ['email', 'newsletter', 'digest'], description: 'Beautiful newsletter template with hero image, featured articles, event highlights, and CTA blocks.', slides: 8, lastUpdated: '2026-02-18', preview: ['📰', '✉️', '📌'], },
  { id: 10, name: 'Mathematics Masterclass', author: 'Alice Chen', authorId: 'alice', category: 'Education', price: 11.99, priceLabel: '$11.99', priceType: 'paid', downloads: 5400, downloadsLabel: '5.4k', rating: 4.8, reviews: 156, rgb: '99,102,241', icon: '🧮', featured: false, tags: ['math', 'calculus', 'algebra'], description: 'Comprehensive math lecture slides with LaTeX-ready formula blocks, graph placeholders, and problem sets.', slides: 55, lastUpdated: '2026-03-01', preview: ['∑', '∫', 'π'], collection: 'Education Essentials' },
  { id: 11, name: 'AI Product Roadmap', author: 'Feng Li', authorId: 'feng', category: 'Tech', price: 24.99, priceLabel: '$24.99', priceType: 'premium', downloads: 2100, downloadsLabel: '2.1k', rating: 4.9, reviews: 78, rgb: '168,85,247', icon: '🤖', featured: true, tags: ['ai', 'roadmap', 'product'], description: 'Plan your AI product with this premium roadmap template. Timeline Gantt charts, feature prioritization matrix, and stakeholder views.', slides: 22, lastUpdated: '2026-03-05', preview: ['🗺️', '🧠', '📅'], collection: 'Business Premium' },
  { id: 12, name: 'Biology Cell Biology', author: 'Grace Park', authorId: 'grace', category: 'Science', price: 6.99, priceLabel: '$6.99', priceType: 'paid', downloads: 4800, downloadsLabel: '4.8k', rating: 4.6, reviews: 112, rgb: '20,184,166', icon: '🦠', featured: false, tags: ['biology', 'cell', 'microscopy'], description: 'Detailed cell biology lecture set with annotated diagrams, microscopy layouts, and comparative tables.', slides: 35, lastUpdated: '2026-02-22', preview: ['🔬', '🧬', '🦠'], collection: 'Science Series' },
];

const ALL_REVIEWS: Review[] = [
  { templateId: 1, author: 'Emma Wilson', avatar: '👩‍🎓', rating: 5, text: 'Absolutely stunning template. Used it for 3 straight semesters and students always compliment the design.', date: '2026-02-28', helpful: 34 },
  { templateId: 1, author: 'Bob Kumar', avatar: '👨‍💻', rating: 5, text: 'Best free template I have seen. The quiz section is particularly well designed.', date: '2026-02-15', helpful: 22 },
  { templateId: 1, author: 'Hiro Tanaka', avatar: '👨‍🎓', rating: 4, text: 'Really good overall. Would love a dark mode version.', date: '2026-02-10', helpful: 11 },
  { templateId: 2, author: 'Carla Diaz', avatar: '👩‍💼', rating: 5, text: 'Got funded after using this deck. Worth every penny.', date: '2026-02-20', helpful: 56 },
  { templateId: 2, author: 'Feng Li', avatar: '🧑‍🎓', rating: 4, text: 'Professional and well-structured. Minor tweaks needed for international use.', date: '2026-01-30', helpful: 18 },
  { templateId: 4, author: 'David Obi', avatar: '🧑‍💻', rating: 5, text: 'Beautiful design. My clients were impressed immediately.', date: '2026-02-25', helpful: 41 },
];

const COLLECTIONS = [
  { name: 'Education Essentials', icon: '📚', count: 12, rgb: '99,102,241' },
  { name: 'Business Premium', icon: '💼', count: 8, rgb: '34,197,94' },
  { name: 'Science Series', icon: '🔬', count: 6, rgb: '56,189,248' },
  { name: 'Creative Suite', icon: '🎨', count: 7, rgb: '244,114,182' },
  { name: 'Tech Toolkit', icon: '⚙️', count: 10, rgb: '234,179,8' },
  { name: 'Marketing Pro', icon: '📢', count: 5, rgb: '239,68,68' },
];

const PURCHASES: Purchase[] = [
  { templateId: 2, name: 'Startup Pitch Deck', date: '2026-02-15', price: '$14.99', icon: '🚀' },
  { templateId: 6, name: 'Marketing Campaign', date: '2026-01-28', price: '$19.99', icon: '📢' },
  { templateId: 9, name: 'Weekly Newsletter', date: '2026-01-10', price: '$4.99', icon: '📧' },
];

const CATEGORIES = ['All', 'Education', 'Business', 'Creative', 'Science', 'Tech', 'Marketing'];
const PRICE_FILTERS = ['All Prices', 'Free', 'Paid', 'Premium'];
const SORT_OPTIONS = ['Most Popular', 'Top Rated', 'Newest', 'Price: Low to High', 'Price: High to Low'];

/* ─── Helpers ─── */
const priceColor = (t: string) => t === 'free' ? '#4ade80' : t === 'premium' ? '#c4b5fd' : '#60a5fa';
const modalOverlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(8px)', zIndex: 1000,
  display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto',
};
const modalBox: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(22,22,31,0.99), rgba(14,14,20,0.99))',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: 32,
  width: '100%', maxWidth: 700, flexShrink: 0,
};
const btnP: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px',
  fontSize: 13, fontWeight: 700, border: 'none', borderRadius: 12, cursor: 'pointer',
  background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: '#fff',
};
const btnS: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px',
  fontSize: 12, fontWeight: 600, borderRadius: 12, cursor: 'pointer',
  background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
  border: '1px solid rgba(255,255,255,0.08)',
};
const iStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: 13,
  background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  outline: 'none', boxSizing: 'border-box',
};

/* ─── Star Rating ─── */
const Stars = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <span style={{ fontSize: size }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}>★</span>
    ))}
  </span>
);

/* ─── Field label ─── */
const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════ */
export default function MarketplacePage() {
  /* ─── State ─── */
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeView,     setActiveView]     = useState<'browse' | 'collections' | 'creators' | 'downloads' | 'dashboard'>('browse');
  const [priceFilter,    setPriceFilter]    = useState('All Prices');
  const [sortBy,         setSortBy]         = useState('Most Popular');
  const [search,         setSearch]         = useState('');
  const [cart,           setCart]           = useState<CartItem[]>([]);
  const [showCart,       setShowCart]       = useState(false);
  const [showCheckout,   setShowCheckout]   = useState(false);
  const [checkoutDone,   setCheckoutDone]   = useState(false);
  const [showUpload,     setShowUpload]     = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeCreator,    setActiveCreator]    = useState<Creator | null>(null);
  const [wishlist,     setWishlist]     = useState<number[]>([]);
  const [purchases,    setPurchases]    = useState<Purchase[]>(PURCHASES);
  const [previewSlide, setPreviewSlide] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'Education', price: '0', description: '', tags: '' });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' });

  /* ─── Derived ─── */
  const cartTotal = cart.reduce((s, i) => s + i.template.price, 0);
  const cartCount = cart.length;

  const filtered = useMemo(() => {
    let list = ALL_TEMPLATES;
    if (activeCategory !== 'All')    list = list.filter(t => t.category === activeCategory);
    if (priceFilter === 'Free')      list = list.filter(t => t.priceType === 'free');
    if (priceFilter === 'Paid')      list = list.filter(t => t.priceType === 'paid');
    if (priceFilter === 'Premium')   list = list.filter(t => t.priceType === 'premium');
    if (search) list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(g => g.includes(search.toLowerCase())));
    if (sortBy === 'Top Rated')             list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Most Popular')          list = [...list].sort((a, b) => b.downloads - a.downloads);
    if (sortBy === 'Price: Low to High')    list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low')    list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, priceFilter, sortBy, search]);

  /* ─── Actions ─── */
  const addToCart = (t: Template) => {
    if (!cart.find(c => c.template.id === t.id)) setCart(prev => [...prev, { template: t, quantity: 1 }]);
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.template.id !== id));
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const completeCheckout = () => {
    const newPurchases = cart.map(c => ({ templateId: c.template.id, name: c.template.name, date: new Date().toISOString().slice(0, 10), price: c.template.priceLabel, icon: c.template.icon }));
    setPurchases(prev => [...newPurchases, ...prev]);
    setCart([]);
    setCheckoutDone(true);
  };
  const submitUpload = () => {
    setShowUpload(false);
    setUploadForm({ name: '', category: 'Education', price: '0', description: '', tags: '' });
    alert('Template submitted for review! It will appear in the marketplace within 24 hours.');
  };
  const templateReviews = selectedTemplate ? ALL_REVIEWS.filter(r => r.templateId === selectedTemplate.id) : [];

  /* ─── Modal ─── */
  const Modal = ({ show, width = 700, onClose, children }: { show: boolean; width?: number; onClose: () => void; children: React.ReactNode }) =>
    show ? (
      <div style={modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ ...modalBox, maxWidth: width }}>
          {children}
        </motion.div>
      </div>
    ) : null;

  /* ─── Template Card ─── */
  const TemplateCard = ({ t, idx }: { t: Template; idx: number }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} style={{ borderRadius: 18, padding: 1.5, background: `linear-gradient(160deg,rgba(${t.rgb},0.2),rgba(${t.rgb},0.04) 60%,rgba(${t.rgb},0.1))`, cursor: 'pointer' }} onClick={() => { setSelectedTemplate(t); setPreviewSlide(0); }}>
        <div style={{ borderRadius: 16.5, overflow: 'hidden', background: 'linear-gradient(160deg,rgba(22,22,31,0.97),rgba(16,16,24,0.99))' }}>
          {/* Preview area */}
          <div style={{ height: 140, position: 'relative', background: `linear-gradient(160deg,rgba(${t.rgb},0.07),rgba(${t.rgb},0.01))`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {t.preview?.map((p, i) => (
              <span key={i} style={{ fontSize: 32, opacity: i === 0 ? 1 : 0.5 }}>{p}</span>
            ))}
            {t.featured && <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, padding: '3px 9px', borderRadius: 99, fontWeight: 800, background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.2)' }}>⭐ FEATURED</span>}
            <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 12, padding: '4px 11px', borderRadius: 8, fontWeight: 800, background: t.priceType === 'free' ? 'rgba(34,197,94,0.12)' : t.priceType === 'premium' ? 'rgba(139,92,246,0.12)' : 'rgba(96,165,250,0.12)', color: priceColor(t.priceType), border: `1px solid ${priceColor(t.priceType)}28` }}>{t.priceLabel}</span>
            {/* Wishlist btn */}
            <button onClick={e => { e.stopPropagation(); toggleWishlist(t.id); }} style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 14, background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '4px 8px' }}>{wishlist.includes(t.id) ? '❤️' : '🤍'}</button>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>by {t.author} · {t.slides} slides</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Stars rating={t.rating} size={11} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.rating} ({t.reviews})</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⬇ {t.downloadsLabel}</span>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
              {t.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ fontSize: 9, padding: '3px 7px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.04)' }}>#{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {t.priceType === 'free' ? (
                <button onClick={e => { e.stopPropagation(); addToCart(t); }} style={{ ...btnP, flex: 1, justifyContent: 'center', fontSize: 11, padding: '7px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                  {cart.find(c => c.template.id === t.id) ? '✅ Added' : '⬇ Get Free'}
                </button>
              ) : (
                <>
                  <button onClick={e => { e.stopPropagation(); addToCart(t); }} style={{ ...btnP, flex: 1, justifyContent: 'center', fontSize: 11, padding: '7px' }}>
                    {cart.find(c => c.template.id === t.id) ? '✅ In Cart' : '🛒 Add to Cart'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  /* ─── Views ─── */
  const BrowseView = () => (
    <>
      {/* Featured banner */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {ALL_TEMPLATES.filter(t => t.featured).map(t => (
          <motion.div key={t.id} whileHover={{ scale: 1.02 }} onClick={() => { setSelectedTemplate(t); setPreviewSlide(0); }}
            style={{ minWidth: 280, borderRadius: 18, padding: '20px 24px', cursor: 'pointer', background: `linear-gradient(135deg,rgba(${t.rgb},0.15),rgba(${t.rgb},0.05))`, border: `1px solid rgba(${t.rgb},0.2)` }}>
            <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: 'rgba(234,179,8,0.15)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.25)', display: 'inline-block', marginBottom: 10, fontWeight: 700 }}>⭐ FEATURED</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 36 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.author} · {t.priceLabel}</div>
                <div style={{ marginTop: 4 }}><Stars rating={t.rating} /></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ ...btnS, padding: '6px 14px', background: activeCategory === c ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)', color: activeCategory === c ? '#c4b5fd' : 'var(--text-muted)', border: activeCategory === c ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}>{c}</button>
        ))}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={{ ...iStyle, width: 'auto', padding: '6px 12px', fontSize: 12 }}>
            {PRICE_FILTERS.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...iStyle, width: 'auto', padding: '6px 12px', fontSize: 12 }}>
            {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14 }}>{filtered.length} templates</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((t, i) => <TemplateCard key={t.id} t={t} idx={i} />)}
        </AnimatePresence>
      </div>
    </>
  );

  const CollectionsView = () => (
    <>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Collections</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 32 }}>
        {COLLECTIONS.map((col, i) => (
          <motion.div key={col.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => { setActiveView('browse'); setSearch(col.name); }} style={{ borderRadius: 18, padding: 1.5, background: `linear-gradient(160deg,rgba(${col.rgb},0.2),rgba(${col.rgb},0.04))`, cursor: 'pointer' }}>
            <div style={{ borderRadius: 16.5, padding: '24px 22px', background: 'linear-gradient(160deg,rgba(22,22,31,0.97),rgba(16,16,24,0.99))' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{col.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{col.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{col.count} templates</div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  const CreatorsView = () => (
    <>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Top Creators</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {CREATORS.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div style={{ borderRadius: 18, padding: 1.5, background: `linear-gradient(160deg,rgba(${c.rgb},0.2),rgba(${c.rgb},0.04))` }}>
              <div style={{ borderRadius: 16.5, padding: '22px 20px', background: 'linear-gradient(160deg,rgba(22,22,31,0.97),rgba(16,16,24,0.99))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `rgba(${c.rgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{c.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Joined {c.joined}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{c.bio}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[['Templates', c.templates], ['Followers', c.followers], ['Downloads', c.totalDownloads], ['Revenue', c.totalRevenue]].map(([k, v]) => (
                    <div key={k as string} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 6px' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{v}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setActiveCreator(c)} style={{ ...btnP, flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}>View Profile</button>
                  <button style={{ ...btnS, fontSize: 12, padding: '8px 16px' }}>Follow</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  const DownloadsView = () => (
    <>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>My Downloads & Purchases</h2>
      {purchases.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>No purchases yet. Browse the marketplace to get started.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {purchases.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Purchased {p.date}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: p.price === 'Free' ? '#4ade80' : '#c4b5fd' }}>{p.price}</span>
              <button style={{ ...btnP, fontSize: 12, padding: '8px 16px' }}>⬇ Download</button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const DashboardView = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>Creator Dashboard</h2>
        <button onClick={() => setShowUpload(true)} style={btnP}>+ Upload Template</button>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[['Total Revenue', '$8,240', '📈'], ['Templates', '24', '📦'], ['Downloads', '124k', '⬇'], ['Reviews', '1,234', '⭐']].map(([label, val, icon]) => (
          <div key={label as string} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>My Templates</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ALL_TEMPLATES.filter(t => t.authorId === 'alice').map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px' }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.category} · {t.downloadsLabel} downloads · {t.reviews} reviews</div>
            </div>
            <Stars rating={t.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: priceColor(t.priceType), width: 60, textAlign: 'right' }}>{t.priceLabel}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ ...btnS, fontSize: 11, padding: '5px 10px' }}>Edit</button>
              <button style={{ ...btnS, fontSize: 11, padding: '5px 10px', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  /* ─── Main Render ─── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ═══ Hero ═══ */}
      <div style={{ padding: '48px 32px 32px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)', top: -180, right: '10%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 99, background: 'rgba(124,58,237,0.08)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.15)', marginBottom: 14, letterSpacing: '0.04em' }}>🏪 MARKETPLACE</span>
          <h1 style={{ margin: '0 0 10px', fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(135deg,#fff 30%,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Discover, Buy & Sell Templates</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', maxWidth: 440, marginInline: 'auto' }}>Browse premium templates from our creator community or publish your own to earn revenue.</p>
          <div style={{ display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto' }}>
            <div style={{ flex: 1, borderRadius: 14, padding: 1.5, background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(124,58,237,0.04))' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates, tags, creators…" style={{ width: '100%', padding: '12px 16px', fontSize: 14, borderRadius: 12.5, background: 'rgba(14,14,20,0.98)', border: 'none', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
            </div>
            <button style={{ ...btnP, padding: '0 20px' }}>Search</button>
          </div>
        </div>
      </div>

      {/* ═══ Nav bar ═══ */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {([['browse', '🏪 Browse'], ['collections', '📚 Collections'], ['creators', '👥 Creators'], ['downloads', '⬇ My Purchases'], ['dashboard', '📊 Creator Hub']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setActiveView(v)} style={{ ...btnS, padding: '7px 14px', fontSize: 12, background: activeView === v ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)', color: activeView === v ? '#c4b5fd' : 'var(--text-muted)', border: activeView === v ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowUpload(true)} style={{ ...btnS, fontSize: 12 }}>+ Sell Template</button>
            <button onClick={() => setShowCart(true)} style={{ ...btnP, fontSize: 12, padding: '8px 16px', position: 'relative' }}>
              🛒 Cart {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, fontSize: 9, fontWeight: 900, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {activeView === 'browse'      && <BrowseView />}
            {activeView === 'collections' && <CollectionsView />}
            {activeView === 'creators'    && <CreatorsView />}
            {activeView === 'downloads'   && <DownloadsView />}
            {activeView === 'dashboard'   && <DashboardView />}
          </motion.div>
        </AnimatePresence>
        <div style={{ height: 48 }} />
      </div>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Template Detail / Preview Modal */}
      <Modal show={!!selectedTemplate} onClose={() => setSelectedTemplate(null)} width={720}>
        {selectedTemplate && (
          <div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              {/* Preview carousel */}
              <div style={{ width: 220, flexShrink: 0, background: `rgba(${selectedTemplate.rgb},0.06)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: '20px 0' }}>
                <div style={{ fontSize: 64 }}>{selectedTemplate.preview?.[previewSlide] || selectedTemplate.icon}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selectedTemplate.preview?.map((_, i) => (
                    <div key={i} onClick={() => setPreviewSlide(i)} style={{ width: 6, height: 6, borderRadius: '50%', background: previewSlide === i ? `rgb(${selectedTemplate.rgb})` : 'rgba(255,255,255,0.2)', cursor: 'pointer' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Slide {previewSlide + 1} of {selectedTemplate.preview?.length || 1}</div>
              </div>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {selectedTemplate.featured && <span style={{ fontSize: 9, padding: '3px 9px', borderRadius: 99, fontWeight: 800, background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.25)' }}>⭐ FEATURED</span>}
                  <span style={{ fontSize: 9, padding: '3px 9px', borderRadius: 99, fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{selectedTemplate.category}</span>
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>{selectedTemplate.name}</h2>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>by {selectedTemplate.author} · Updated {selectedTemplate.lastUpdated}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Stars rating={selectedTemplate.rating} size={14} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTemplate.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({selectedTemplate.reviews} reviews)</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· ⬇ {selectedTemplate.downloadsLabel}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>{selectedTemplate.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[['Slides', selectedTemplate.slides], ['Downloads', selectedTemplate.downloadsLabel], ['Reviews', selectedTemplate.reviews]].map(([k, v]) => (
                    <div key={k as string} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{v}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: priceColor(selectedTemplate.priceType), marginBottom: 14 }}>{selectedTemplate.priceLabel}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedTemplate.priceType === 'free' ? (
                    <button onClick={() => addToCart(selectedTemplate)} style={{ ...btnP, flex: 1, justifyContent: 'center', background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>⬇ Download Free</button>
                  ) : (
                    <button onClick={() => addToCart(selectedTemplate)} style={{ ...btnP, flex: 1, justifyContent: 'center' }}>🛒 {cart.find(c => c.template.id === selectedTemplate.id) ? 'In Cart' : 'Add to Cart'}</button>
                  )}
                  <button onClick={() => toggleWishlist(selectedTemplate.id)} style={{ ...btnS }}>{wishlist.includes(selectedTemplate.id) ? '❤️ Saved' : '🤍 Save'}</button>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {selectedTemplate.tags.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>#{t}</span>
              ))}
            </div>
            {/* Reviews section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Reviews ({templateReviews.length})</div>
              {templateReviews.map((r, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{r.avatar}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{r.author}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.date}</div>
                      </div>
                    </div>
                    <Stars rating={r.rating} size={12} />
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px' }}>{r.text}</p>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>👍 {r.helpful} found this helpful</div>
                </div>
              ))}
              {templateReviews.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>}
              {/* Write review */}
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Write a Review</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(n => (
                    <span key={n} onClick={() => setNewReviewRating(n)} style={{ fontSize: 22, cursor: 'pointer', color: n <= newReviewRating ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}>★</span>
                  ))}
                </div>
                <textarea value={newReviewText} onChange={e => setNewReviewText(e.target.value)} rows={3} placeholder="Share your experience with this template…" style={{ ...iStyle, resize: 'none', marginBottom: 8 }} />
                <button onClick={() => setNewReviewText('')} style={btnP}>Submit Review</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cart Modal */}
      <Modal show={showCart} onClose={() => setShowCart(false)} width={500}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>🛒 Cart ({cartCount})</h3>
          <button onClick={() => setShowCart(false)} style={{ ...btnS, padding: '4px 8px' }}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <div>Your cart is empty</div>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.template.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 28 }}>{item.template.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.template.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.template.author}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: priceColor(item.template.priceType) }}>{item.template.priceLabel}</span>
                <button onClick={() => removeFromCart(item.template.id)} style={{ ...btnS, padding: '4px 8px', fontSize: 11, color: '#ef4444' }}>✕</button>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>${cartTotal.toFixed(2)}</div>
              </div>
              <button onClick={() => { setShowCart(false); setShowCheckout(true); setCheckoutDone(false); }} style={{ ...btnP, fontSize: 14, padding: '12px 24px' }}>Checkout →</button>
            </div>
          </>
        )}
      </Modal>

      {/* Checkout Modal */}
      <Modal show={showCheckout} onClose={() => setShowCheckout(false)} width={500}>
        {checkoutDone ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>Purchase Complete!</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Your templates are now available in My Downloads.</p>
            <button onClick={() => { setShowCheckout(false); setActiveView('downloads'); }} style={{ ...btnP, margin: 'auto' }}>Go to Downloads</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>💳 Checkout</h3>
              <button onClick={() => setShowCheckout(false)} style={{ ...btnS, padding: '4px 8px' }}>✕</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
              {cart.map(c => (
                <div key={c.template.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span>{c.template.name}</span>
                  <span style={{ fontWeight: 700 }}>{c.template.priceLabel}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontSize: 15, fontWeight: 900, color: 'var(--text-primary)' }}>
                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <FL label="Full Name"><input value={checkoutForm.name} onChange={e => setCheckoutForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" style={iStyle} /></FL>
            <FL label="Email"><input value={checkoutForm.email} onChange={e => setCheckoutForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" type="email" style={iStyle} /></FL>
            <FL label="Card Number"><input value={checkoutForm.card} onChange={e => setCheckoutForm(p => ({ ...p, card: e.target.value }))} placeholder="4242 4242 4242 4242" style={iStyle} /></FL>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
              <FL label="Expiry"><input value={checkoutForm.expiry} onChange={e => setCheckoutForm(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" style={iStyle} /></FL>
              <FL label="CVV"><input value={checkoutForm.cvv} onChange={e => setCheckoutForm(p => ({ ...p, cvv: e.target.value }))} placeholder="123" style={iStyle} /></FL>
            </div>
            <button onClick={completeCheckout} style={{ ...btnP, width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}>💳 Pay ${cartTotal.toFixed(2)}</button>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>🔒 Secured with 256-bit encryption</div>
          </>
        )}
      </Modal>

      {/* Creator Profile Modal */}
      <Modal show={!!activeCreator} onClose={() => setActiveCreator(null)} width={640}>
        {activeCreator && (
          <>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ width: 70, height: 70, borderRadius: 18, background: `rgba(${activeCreator.rgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{activeCreator.avatar}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{activeCreator.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px' }}>{activeCreator.bio}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnP}>Follow</button>
                  <button style={btnS}>Message</button>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {[['Templates', activeCreator.templates], ['Followers', activeCreator.followers], ['Downloads', activeCreator.totalDownloads], ['Revenue', activeCreator.totalRevenue]].map(([k, v]) => (
                <div key={k as string} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Templates by {activeCreator.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ALL_TEMPLATES.filter(t => t.authorId === activeCreator.id).map(t => (
                <div key={t.id} onClick={() => { setActiveCreator(null); setSelectedTemplate(t); }} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, cursor: 'pointer' }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.downloadsLabel} downloads</div>
                  </div>
                  <Stars rating={t.rating} size={11} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: priceColor(t.priceType) }}>{t.priceLabel}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>

      {/* Upload / Sell Template Modal */}
      <Modal show={showUpload} onClose={() => setShowUpload(false)} width={560}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>📤 Sell a Template</h3>
          <button onClick={() => setShowUpload(false)} style={{ ...btnS, padding: '4px 8px' }}>✕</button>
        </div>
        <FL label="Template Name"><input value={uploadForm.name} onChange={e => setUploadForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Advanced UI Starter Kit" style={iStyle} /></FL>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FL label="Category">
            <select value={uploadForm.category} onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))} style={iStyle}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </FL>
          <FL label="Price ($)"><input value={uploadForm.price} onChange={e => setUploadForm(p => ({ ...p, price: e.target.value }))} placeholder="0 for free" type="number" min="0" step="0.01" style={iStyle} /></FL>
        </div>
        <FL label="Description"><textarea value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe your template…" style={{ ...iStyle, resize: 'none' }} /></FL>
        <FL label="Tags (comma separated)"><input value={uploadForm.tags} onChange={e => setUploadForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g., slides, education, charts" style={iStyle} /></FL>
        <FL label="Template File">
          <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Drop .isl file or click to browse</div>
          </div>
        </FL>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowUpload(false)} style={btnS}>Cancel</button>
          <button onClick={submitUpload} style={btnP}>Submit for Review</button>
        </div>
      </Modal>
    </div>
  );
}
