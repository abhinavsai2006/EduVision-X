'use client';
/* ═══════════════════════════════════════════════════════
   Settings v3.0 — Premium Platform Settings
   15+ sections: General, Profile, Auth, Security, RBAC,
   Encryption, Rate Limiting, Sandbox, API, CDN, Monitoring,
   Backup, Compliance, Notifications, Appearance
   ═══════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Sections ── */
const SECTIONS = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'auth', label: 'Authentication', icon: '🔑' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'rbac', label: 'Roles & Access', icon: '👥' },
  { id: 'encryption', label: 'Encryption', icon: '🔐' },
  { id: 'rateLimit', label: 'Rate Limiting', icon: '⏱️' },
  { id: 'sandbox', label: 'Sandbox', icon: '📦' },
  { id: 'api', label: 'API & Webhooks', icon: '🔌' },
  { id: 'cdn', label: 'CDN & Storage', icon: '☁️' },
  { id: 'monitoring', label: 'Monitoring', icon: '📊' },
  { id: 'backup', label: 'Backup', icon: '💾' },
  { id: 'compliance', label: 'Compliance', icon: '📜' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
];

const ROLES = [
  { name: 'Admin', desc: 'Full access to all settings', perms: ['manage_users', 'manage_billing', 'manage_settings', 'view_analytics', 'manage_content'], rgb: '239,68,68' },
  { name: 'Instructor', desc: 'Create and manage classrooms', perms: ['manage_content', 'view_analytics', 'manage_classroom'], rgb: '124,58,237' },
  { name: 'Student', desc: 'Access courses and submit work', perms: ['view_content', 'submit_work', 'join_classroom'], rgb: '34,197,94' },
  { name: 'TA', desc: 'Assist with grading and support', perms: ['view_analytics', 'manage_content', 'grade_work'], rgb: '56,189,248' },
  { name: 'Viewer', desc: 'Read-only access', perms: ['view_content'], rgb: '100,116,139' },
];

/* ── Shared UI Components ── */
function GlassCard({ children, rgb = '124,58,237', style }: { children: React.ReactNode; rgb?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: 16, padding: 1.5,
      background: `linear-gradient(160deg, rgba(${rgb},0.15), rgba(${rgb},0.03) 60%, rgba(${rgb},0.08))`,
      ...style,
    }}>
      <div style={{
        borderRadius: 14.5, padding: '18px 20px',
        background: 'linear-gradient(160deg, rgba(22,22,31,0.97), rgba(16,16,24,0.99))',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.3), transparent)`,
        }} />
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h2>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}

function FieldGroup({ label, children, desc }: { label: string; children: React.ReactNode; desc?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
        marginBottom: 6,
      }}>{label}</label>
      {children}
      {desc && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{desc}</div>}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      color: 'var(--text-primary)', outline: 'none',
    }} />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      color: 'var(--text-primary)', outline: 'none',
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div onClick={() => onChange(!checked)} style={{
        width: 40, height: 22, borderRadius: 99, cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: 2,
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, label, suffix = '' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; suffix?: string }) {
  return (
    <div style={{ padding: '6px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} style={{
        width: '100%', accentColor: '#7c3aed', height: 4,
      }} />
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'healthy' | 'warning' | 'error'; label: string }) {
  const colors = { healthy: '34,197,94', warning: '234,179,8', error: '239,68,68' };
  const rgb = colors[status];
  return (
    <span style={{
      fontSize: 10, padding: '4px 10px', borderRadius: 99, fontWeight: 700,
      background: `rgba(${rgb},0.1)`, color: `rgb(${rgb})`,
      border: `1px solid rgba(${rgb},0.2)`,
    }}>{label}</span>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  // ── General ──
  const [platformName, setPlatformName] = useState('EduVision X');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // ── Profile ──
  const [displayName, setDisplayName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@eduvision.io');
  const [bio, setBio] = useState('Full-Stack Instructor');

  // ── Appearance ──
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#7c3aed');
  const [fontSize, setFontSize] = useState(14);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // ── Auth ──
  const [jwtExpiry, setJwtExpiry] = useState('24h');
  const [twoFactor, setTwoFactor] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [oauthGoogle, setOauthGoogle] = useState(true);
  const [oauthGithub, setOauthGithub] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState('strong');

  // ── Security ──
  const [encryptionAlgo, setEncryptionAlgo] = useState('AES-256-GCM');
  const [keyRotation, setKeyRotation] = useState(30);
  const [corsEnabled, setCorsEnabled] = useState(true);
  const [csrfProtection, setCsrfProtection] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState('');

  // ── Rate Limiting ──
  const [rateLimit, setRateLimit] = useState(100);
  const [rateBurst, setRateBurst] = useState(200);
  const [ddosProtection, setDdosProtection] = useState(true);

  // ── Sandbox ──
  const [containerTimeout, setContainerTimeout] = useState(30);
  const [maxMemory, setMaxMemory] = useState(512);
  const [networkAccess, setNetworkAccess] = useState(false);
  const [sandboxEnabled, setSandboxEnabled] = useState(true);

  // ── API ──
  const [apiKeys] = useState([
    { name: 'Production', key: 'evx_prod_••••••••', created: 'Mar 2024', status: 'active' as const },
    { name: 'Development', key: 'evx_dev_••••••••', created: 'Jan 2024', status: 'active' as const },
  ]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiVersion, setApiVersion] = useState('v2');

  // ── CDN ──
  const [cdnProvider, setCdnProvider] = useState('cloudflare');
  const [cacheMaxAge, setCacheMaxAge] = useState(3600);
  const [imageCdn, setImageCdn] = useState(true);

  // ── Monitoring ──
  const [healthChecks] = useState([
    { name: 'API Server', status: 'healthy' as const, latency: '12ms', uptime: '99.99%' },
    { name: 'Database', status: 'healthy' as const, latency: '3ms', uptime: '99.97%' },
    { name: 'Redis Cache', status: 'warning' as const, latency: '45ms', uptime: '99.90%' },
    { name: 'File Storage', status: 'healthy' as const, latency: '8ms', uptime: '99.99%' },
    { name: 'WebSocket', status: 'healthy' as const, latency: '5ms', uptime: '99.98%' },
  ]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [errorLogging, setErrorLogging] = useState(true);
  const [recentErrors] = useState([
    { message: 'Rate limit exceeded for /api/ai', time: '2 min ago', severity: 'warning' as const },
    { message: 'WebSocket reconnect attempt', time: '15 min ago', severity: 'warning' as const },
    { message: 'Slow query detected: presentations query', time: '1h ago', severity: 'warning' as const },
  ]);

  // ── Backup ──
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState('daily');
  const [backupRetention, setBackupRetention] = useState(30);
  const [backupHistory] = useState([
    { date: '2026-02-28 03:00', size: '2.4 GB', status: 'completed' as const },
    { date: '2026-02-27 03:00', size: '2.3 GB', status: 'completed' as const },
    { date: '2026-02-26 03:00', size: '2.3 GB', status: 'completed' as const },
  ]);

  // ── Compliance ──
  const [gdpr, setGdpr] = useState(true);
  const [hipaa, setHipaa] = useState(false);
  const [soc2, setSoc2] = useState(true);

  // ── Notifications ──
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [quizResults, setQuizResults] = useState(true);

  const saveBtn = (
    <button style={{
      padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 12,
      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff',
      border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
      marginTop: 8,
    }}>Save Changes</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
      {/* ═══ Sidebar ═══ */}
      <div style={{
        width: 240, borderRight: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(14,14,20,0.6)', padding: '24px 12px', flexShrink: 0,
        overflow: 'auto',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', padding: '0 10px', marginBottom: 12,
        }}>Settings</div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '9px 12px', borderRadius: 10, marginBottom: 2,
            border: '1px solid',
            borderColor: activeSection === s.id ? 'rgba(124,58,237,0.2)' : 'transparent',
            background: activeSection === s.id ? 'rgba(124,58,237,0.06)' : 'transparent',
            color: activeSection === s.id ? '#c4b5fd' : 'var(--text-muted)',
            fontSize: 12, fontWeight: activeSection === s.id ? 700 : 500,
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
          }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeSection}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: 680 }}
          >

            {/* ── General ── */}
            {activeSection === 'general' && (
              <div>
                <SectionHeader title="General Settings" desc="Platform name, language, and maintenance options" />
                <GlassCard>
                  <FieldGroup label="Platform Name" desc="Displayed in the header and emails">
                    <Input value={platformName} onChange={setPlatformName} />
                  </FieldGroup>
                  <FieldGroup label="Timezone">
                    <Select value={timezone} onChange={setTimezone} options={[
                      { value: 'UTC', label: 'UTC' }, { value: 'US/Eastern', label: 'US/Eastern' },
                      { value: 'US/Pacific', label: 'US/Pacific' }, { value: 'Europe/London', label: 'Europe/London' },
                      { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
                    ]} />
                  </FieldGroup>
                  <FieldGroup label="Language">
                    <Select value={language} onChange={setLanguage} options={[
                      { value: 'en', label: 'English' }, { value: 'es', label: 'Español' },
                      { value: 'fr', label: 'Français' }, { value: 'de', label: 'Deutsch' },
                      { value: 'ja', label: '日本語' }, { value: 'zh', label: '中文' },
                    ]} />
                  </FieldGroup>
                  <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} label="Maintenance Mode" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Profile ── */}
            {activeSection === 'profile' && (
              <div>
                <SectionHeader title="Profile Settings" desc="Update your display name, email, and bio" />
                <GlassCard>
                  <div style={{
                    width: 72, height: 72, borderRadius: 18, margin: '0 0 18px',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))',
                    border: '2px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                  }}>👨‍🏫</div>
                  <FieldGroup label="Display Name"><Input value={displayName} onChange={setDisplayName} /></FieldGroup>
                  <FieldGroup label="Email"><Input value={email} onChange={setEmail} type="email" /></FieldGroup>
                  <FieldGroup label="Bio"><Input value={bio} onChange={setBio} /></FieldGroup>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Appearance ── */}
            {activeSection === 'appearance' && (
              <div>
                <SectionHeader title="Appearance" desc="Customize theme, colors, and visual preferences" />
                <GlassCard>
                  <FieldGroup label="Theme">
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['dark', 'light', 'system'].map(t => (
                        <button key={t} onClick={() => setTheme(t)} style={{
                          flex: 1, padding: '10px 16px', fontSize: 12, fontWeight: 700, borderRadius: 10,
                          cursor: 'pointer', border: '1px solid', transition: 'all 0.2s',
                          borderColor: theme === t ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                          background: theme === t ? 'rgba(124,58,237,0.08)' : 'transparent',
                          color: theme === t ? '#c4b5fd' : 'var(--text-muted)',
                          textTransform: 'capitalize',
                        }}>{t}</button>
                      ))}
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Accent Color">
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['#7c3aed', '#22c55e', '#ef4444', '#f59e0b', '#38bdf8', '#f472b6'].map(c => (
                        <div key={c} onClick={() => setAccentColor(c)} style={{
                          width: 32, height: 32, borderRadius: 10, background: c, cursor: 'pointer',
                          border: accentColor === c ? '2px solid #fff' : '2px solid transparent',
                          transition: 'border 0.2s',
                        }} />
                      ))}
                    </div>
                  </FieldGroup>
                  <Slider value={fontSize} onChange={setFontSize} min={10} max={20} label="Font Size" suffix="px" />
                  <Toggle checked={reducedMotion} onChange={setReducedMotion} label="Reduced Motion" />
                  <Toggle checked={compactMode} onChange={setCompactMode} label="Compact Mode" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Auth ── */}
            {activeSection === 'auth' && (
              <div>
                <SectionHeader title="Authentication" desc="JWT, 2FA, SSO, and OAuth configuration" />
                <GlassCard>
                  <FieldGroup label="JWT Expiry">
                    <Select value={jwtExpiry} onChange={setJwtExpiry} options={[
                      { value: '1h', label: '1 Hour' }, { value: '24h', label: '24 Hours' },
                      { value: '7d', label: '7 Days' }, { value: '30d', label: '30 Days' },
                    ]} />
                  </FieldGroup>
                  <FieldGroup label="Password Policy">
                    <Select value={passwordPolicy} onChange={setPasswordPolicy} options={[
                      { value: 'basic', label: 'Basic (8+ chars)' },
                      { value: 'strong', label: 'Strong (8+ chars, mixed case, numbers, symbols)' },
                      { value: 'enterprise', label: 'Enterprise (12+ chars, all rules + no reuse)' },
                    ]} />
                  </FieldGroup>
                  <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-Factor Authentication" />
                  <Toggle checked={ssoEnabled} onChange={setSsoEnabled} label="SSO / SAML" />
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 12, paddingTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>OAuth Providers</div>
                    <Toggle checked={oauthGoogle} onChange={setOauthGoogle} label="Google" />
                    <Toggle checked={oauthGithub} onChange={setOauthGithub} label="GitHub" />
                  </div>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Security ── */}
            {activeSection === 'security' && (
              <div>
                <SectionHeader title="Security" desc="Encryption, CORS, CSRF, and IP whitelisting" />
                <GlassCard>
                  <FieldGroup label="Encryption Algorithm">
                    <Select value={encryptionAlgo} onChange={setEncryptionAlgo} options={[
                      { value: 'AES-256-GCM', label: 'AES-256-GCM' },
                      { value: 'AES-256-CBC', label: 'AES-256-CBC' },
                      { value: 'ChaCha20-Poly1305', label: 'ChaCha20-Poly1305' },
                    ]} />
                  </FieldGroup>
                  <Slider value={keyRotation} onChange={setKeyRotation} min={1} max={90} label="Key Rotation Interval" suffix=" days" />
                  <Toggle checked={corsEnabled} onChange={setCorsEnabled} label="CORS Enabled" />
                  <Toggle checked={csrfProtection} onChange={setCsrfProtection} label="CSRF Protection" />
                  <FieldGroup label="IP Whitelist" desc="Comma separated. Leave empty to allow all.">
                    <Input value={ipWhitelist} onChange={setIpWhitelist} placeholder="192.168.1.0/24, 10.0.0.1" />
                  </FieldGroup>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── RBAC ── */}
            {activeSection === 'rbac' && (
              <div>
                <SectionHeader title="Roles & Access Control" desc="Manage roles and their permissions" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ROLES.map(r => (
                    <GlassCard key={r.name} rgb={r.rgb}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{r.name}</span>
                            <StatusBadge status="healthy" label="Active" />
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{r.desc}</div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {r.perms.map(p => (
                              <span key={p} style={{
                                fontSize: 9, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                                background: `rgba(${r.rgb},0.06)`, color: `rgb(${r.rgb})`,
                                border: `1px solid rgba(${r.rgb},0.12)`,
                              }}>{p}</span>
                            ))}
                          </div>
                        </div>
                        <button style={{
                          padding: '7px 14px', fontSize: 11, fontWeight: 600, borderRadius: 8,
                          background: 'transparent', color: 'var(--text-muted)',
                          border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                        }}>Edit</button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── Encryption ── */}
            {activeSection === 'encryption' && (
              <div>
                <SectionHeader title="Encryption" desc="Data-at-rest and in-transit encryption settings" />
                <GlassCard rgb="124,58,237">
                  <FieldGroup label="Algorithm"><Input value={encryptionAlgo} onChange={setEncryptionAlgo} /></FieldGroup>
                  <Slider value={keyRotation} onChange={setKeyRotation} min={1} max={90} label="Key Rotation" suffix=" days" />
                  <Toggle checked={true} onChange={() => {}} label="TLS 1.3 Enforced" />
                  <Toggle checked={true} onChange={() => {}} label="Encrypt Data at Rest" />
                  <Toggle checked={true} onChange={() => {}} label="Certificate Pinning" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Rate Limiting ── */}
            {activeSection === 'rateLimit' && (
              <div>
                <SectionHeader title="Rate Limiting" desc="Control API request limits and DDoS protection" />
                <GlassCard>
                  <Slider value={rateLimit} onChange={setRateLimit} min={10} max={1000} label="Requests per minute" suffix=" req/min" />
                  <Slider value={rateBurst} onChange={setRateBurst} min={50} max={2000} label="Burst limit" suffix=" req" />
                  <Toggle checked={ddosProtection} onChange={setDdosProtection} label="DDoS Protection" />
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Quick Presets</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { label: 'Relaxed', req: 500, burst: 1000 },
                        { label: 'Standard', req: 100, burst: 200 },
                        { label: 'Strict', req: 30, burst: 60 },
                        { label: 'Lockdown', req: 10, burst: 20 },
                      ].map(p => (
                        <button key={p.label} onClick={() => { setRateLimit(p.req); setRateBurst(p.burst); }} style={{
                          flex: 1, padding: '8px 12px', fontSize: 11, fontWeight: 700, borderRadius: 10,
                          background: rateLimit === p.req ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${rateLimit === p.req ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)'}`,
                          color: rateLimit === p.req ? '#c4b5fd' : 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Sandbox ── */}
            {activeSection === 'sandbox' && (
              <div>
                <SectionHeader title="Code Sandbox" desc="Container isolation and execution limits" />
                <GlassCard>
                  <Toggle checked={sandboxEnabled} onChange={setSandboxEnabled} label="Sandbox Enabled" />
                  <Slider value={containerTimeout} onChange={setContainerTimeout} min={5} max={120} label="Container Timeout" suffix="s" />
                  <Slider value={maxMemory} onChange={setMaxMemory} min={64} max={2048} label="Max Memory" suffix=" MB" />
                  <Toggle checked={networkAccess} onChange={setNetworkAccess} label="Network Access" />
                  <Toggle checked={true} onChange={() => {}} label="Filesystem Isolation" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── API ── */}
            {activeSection === 'api' && (
              <div>
                <SectionHeader title="API & Webhooks" desc="Manage API keys, versioning, and webhooks" />
                <GlassCard>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>API Keys</div>
                  {apiKeys.map(k => (
                    <div key={k.name} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{k.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{k.key}</div>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.created}</span>
                      <StatusBadge status={k.status === 'active' ? 'healthy' : 'error'} label={k.status} />
                      <button style={{
                        padding: '5px 10px', fontSize: 10, borderRadius: 6, background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', cursor: 'pointer',
                      }}>Revoke</button>
                    </div>
                  ))}
                  <button style={{
                    marginTop: 10, padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 10,
                    background: 'rgba(124,58,237,0.06)', color: '#a78bfa',
                    border: '1px solid rgba(124,58,237,0.15)', cursor: 'pointer',
                  }}>+ Generate New Key</button>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 18, paddingTop: 14 }}>
                    <FieldGroup label="API Version">
                      <Select value={apiVersion} onChange={setApiVersion} options={[
                        { value: 'v1', label: 'v1 (Legacy)' }, { value: 'v2', label: 'v2 (Current)' }, { value: 'v3', label: 'v3 (Beta)' },
                      ]} />
                    </FieldGroup>
                    <FieldGroup label="Webhook URL" desc="Receive event notifications via HTTP POST">
                      <Input value={webhookUrl} onChange={setWebhookUrl} placeholder="https://your-server.com/webhook" />
                    </FieldGroup>
                  </div>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── CDN ── */}
            {activeSection === 'cdn' && (
              <div>
                <SectionHeader title="CDN & Storage" desc="Content delivery and caching configuration" />
                <GlassCard>
                  <FieldGroup label="CDN Provider">
                    <Select value={cdnProvider} onChange={setCdnProvider} options={[
                      { value: 'cloudflare', label: 'Cloudflare' }, { value: 'aws', label: 'AWS CloudFront' },
                      { value: 'gcp', label: 'Google Cloud CDN' }, { value: 'azure', label: 'Azure CDN' },
                    ]} />
                  </FieldGroup>
                  <Slider value={cacheMaxAge} onChange={setCacheMaxAge} min={60} max={86400} label="Cache Max Age" suffix="s" />
                  <Toggle checked={imageCdn} onChange={setImageCdn} label="Image Optimization CDN" />
                  <Toggle checked={true} onChange={() => {}} label="Brotli Compression" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Monitoring ── */}
            {activeSection === 'monitoring' && (
              <div>
                <SectionHeader title="Monitoring" desc="Health checks, alerts, and error tracking" />
                <GlassCard rgb="124,58,237">
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Service Health</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {healthChecks.map(h => (
                      <div key={h.name} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px',
                        borderRadius: 10, background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                      }}>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.latency}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.uptime}</span>
                        <StatusBadge status={h.status} label={h.status} />
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard rgb="234,179,8" style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>Recent Errors</div>
                  {recentErrors.map((e, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <StatusBadge status={e.severity} label={e.severity} />
                      <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{e.message}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.time}</span>
                    </div>
                  ))}
                </GlassCard>
                <GlassCard style={{ marginTop: 12 }}>
                  <Toggle checked={alertsEnabled} onChange={setAlertsEnabled} label="Alerts Enabled" />
                  <Toggle checked={errorLogging} onChange={setErrorLogging} label="Error Logging" />
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Backup ── */}
            {activeSection === 'backup' && (
              <div>
                <SectionHeader title="Backup & Recovery" desc="Automatic backups and data retention" />
                <GlassCard>
                  <Toggle checked={autoBackup} onChange={setAutoBackup} label="Automatic Backups" />
                  <FieldGroup label="Frequency">
                    <Select value={backupFreq} onChange={setBackupFreq} options={[
                      { value: 'hourly', label: 'Hourly' }, { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                    ]} />
                  </FieldGroup>
                  <Slider value={backupRetention} onChange={setBackupRetention} min={1} max={365} label="Retention Period" suffix=" days" />
                  {saveBtn}
                </GlassCard>
                <GlassCard rgb="34,197,94" style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>Backup History</div>
                  {backupHistory.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <span style={{ flex: 1, fontSize: 12, color: 'var(--text-primary)' }}>{b.date}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.size}</span>
                      <StatusBadge status="healthy" label={b.status} />
                      <button style={{
                        padding: '5px 10px', fontSize: 10, borderRadius: 6, background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', cursor: 'pointer',
                      }}>Restore</button>
                    </div>
                  ))}
                </GlassCard>
              </div>
            )}

            {/* ── Compliance ── */}
            {activeSection === 'compliance' && (
              <div>
                <SectionHeader title="Compliance" desc="GDPR, HIPAA, SOC 2, and regulatory compliance" />
                <GlassCard>
                  <Toggle checked={gdpr} onChange={setGdpr} label="GDPR Compliance" />
                  <Toggle checked={hipaa} onChange={setHipaa} label="HIPAA Compliance" />
                  <Toggle checked={soc2} onChange={setSoc2} label="SOC 2 Type II" />
                  <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>✅ Compliance Status</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last audit: Feb 28, 2026 · Next scheduled: May 28, 2026</div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button style={{
                      padding: '8px 16px', fontSize: 11, fontWeight: 700, borderRadius: 10,
                      background: 'rgba(124,58,237,0.06)', color: '#a78bfa',
                      border: '1px solid rgba(124,58,237,0.15)', cursor: 'pointer',
                    }}>📥 Download Compliance Report</button>
                  </div>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeSection === 'notifications' && (
              <div>
                <SectionHeader title="Notifications" desc="Email, push, and in-app notification preferences" />
                <GlassCard>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Delivery Channels</div>
                  <Toggle checked={emailNotifs} onChange={setEmailNotifs} label="Email Notifications" />
                  <Toggle checked={pushNotifs} onChange={setPushNotifs} label="Push Notifications" />
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 12, paddingTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Preferences</div>
                    <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} label="Weekly Digest" />
                    <Toggle checked={marketingEmails} onChange={setMarketingEmails} label="Marketing Emails" />
                    <Toggle checked={assignmentAlerts} onChange={setAssignmentAlerts} label="Assignment Alerts" />
                    <Toggle checked={quizResults} onChange={setQuizResults} label="Quiz Results" />
                  </div>
                  {saveBtn}
                </GlassCard>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
