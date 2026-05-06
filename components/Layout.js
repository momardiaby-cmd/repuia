import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../lib/i18n';

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, changeLanguage } = useTranslation();

  const NAV = [
    { href: '/', icon: '◈', label: t('dashboard') },
    { href: '/avis', icon: '⊞', label: t('reviews') },
    { href: '/analytiques', icon: '◎', label: t('analytics') },
    { href: '/parametres', icon: '⚙', label: t('settings') },
  ];

  const langs = [
    { code: 'FR', flag: '🇫🇷' },
    { code: 'EN', flag: '🇬🇧' },
    { code: 'ES', flag: '🇪🇸' },
    { code: 'DE', flag: '🇩🇪' },
    { code: 'IT', flag: '🇮🇹' },
    { code: 'AR', flag: '🇦🇪' },
    { code: 'ZH', flag: '🇨🇳' }
  ];

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo & Mobile Toggle */}
        <div className="sidebar-logo-container" style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px', lineHeight: 1 }}>
              <span style={{ color: 'var(--gold)' }}>Repu</span>
              <span style={{ color: 'var(--text)' }}>IA</span>
            </div>
            <div style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#d4af3715', border: '1px solid #d4af3730',
              borderRadius: 20, padding: '2px 10px',
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600, letterSpacing: '.5px' }}>PRO PLAN</span>
            </div>
          </div>
          <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Nav */}
        <nav className={`sidebar-nav ${mobileOpen ? 'open' : ''}`} style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                  borderRadius: 10, marginBottom: 3, cursor: 'pointer',
                  background: active ? '#d4af3720' : 'transparent',
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  transition: 'all .15s',
                  border: active ? '1px solid #d4af3730' : '1px solid transparent',
                }}>
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {active && (
                    <div style={{ marginLeft: 'auto', width: 5, height: 5, background: 'var(--gold)', borderRadius: '50%' }} />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <select 
            value={lang} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              width: '100%', background: 'var(--surface2)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px',
              fontSize: 13, outline: 'none', cursor: 'pointer'
            }}
          >
            {langs.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.code}</option>
            ))}
          </select>
        </div>

        {/* Restaurant info */}
        <div className="sidebar-restaurant-info" style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #d4af37, #a8882a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#000', flexShrink: 0,
            }}>BG</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Le Bon Goût</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>Paris, France</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--green)' }}>Connecté · GMB</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
