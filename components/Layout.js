import { useRouter } from 'next/router';
import Link from 'next/link';

const NAV = [
  { href: '/', icon: '◈', label: 'Dashboard' },
  { href: '/avis', icon: '⊞', label: 'Tous les avis' },
  { href: '/analytiques', icon: '◎', label: 'Analytiques' },
  { href: '/parametres', icon: '⚙', label: 'Paramètres' },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 230,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--border)' }}>
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

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
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

        {/* Restaurant info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
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
            <span style={{ fontSize: 11, color: 'var(--green)' }}>Connecté · Google My Business</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 230, flex: 1, padding: '40px 48px', maxWidth: 'calc(100vw - 230px)' }}>
        {children}
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes blink { 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        a { color: inherit; }
      `}</style>
    </div>
  );
}
