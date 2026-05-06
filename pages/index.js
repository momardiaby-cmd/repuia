import Head from 'next/head';
import Layout from '../components/Layout';
import ReviewCard from '../components/ReviewCard';
import { useTranslation } from '../lib/i18n';
import { useAppContext } from '../lib/AppContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function StatCard({ value, label, color, icon, sub }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16,
      transition: 'border-color .2s, transform .2s', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af3750'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function InsightCard({ type, title, desc, action }) {
  const isAlert = type === 'alert';
  const color = isAlert ? 'var(--red)' : 'var(--green)';
  const bg = isAlert ? '#ef444410' : '#22c55e10';
  const border = isAlert ? '#ef444430' : '#22c55e30';
  const icon = isAlert ? '📉' : '📈';

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ fontSize: 24, marginTop: -2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{desc}</div>
        <button style={{
          background: 'transparent', border: `1px solid ${color}`, color, borderRadius: 6,
          padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background .2s',
        }} onMouseEnter={e => e.currentTarget.style.background = `${color}20`} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {action}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { restaurant, reviews, isLoaded, demoMode } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !restaurant) {
      router.push('/onboarding');
    }
  }, [isLoaded, restaurant, router]);

  if (!isLoaded || !restaurant) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>;
  }

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const pendingCount = reviews.filter(r => r.status === 'pending' || r.status === 'needs_review').length;
  
  const respondedCount = reviews.filter(r => r.response || r.status.includes('published')).length;
  const responseRate = reviews.length ? Math.round((respondedCount / reviews.length) * 100) : 0;
  
  const feed = reviews.slice(0, 5);

  return (
    <>
      <Head>
        <title>Dashboard — RepuIA Quant</title>
      </Head>
      <Layout>
        <style>{`.fade-up { animation: fadeUp .4s ease both; }`}</style>

        {/* Header */}
        <div className="flex-between" style={{ marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>REPUIA QUANT ENGINE</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>{t('hello')}</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>{t('ai_monitor')}</p>
          </div>
          {pendingCount > 0 && (
            <div style={{ background: '#ef444418', border: '1px solid #ef444440', borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{pendingCount} {t('actions_required')}</span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          <StatCard value={reviews.length} label={t('monitored_reviews')} color="var(--gold)" icon="📡" sub={t('all_platforms')} />
          <StatCard value={avg} label={t('avg_rating')} color="#FBBC04" icon="📊" sub={reviews.length ? t('stable_7_days') : '-'} />
          <StatCard value={`${responseRate}%`} label={t('response_rate')} color="var(--green)" icon="⚡" sub={reviews.length ? `+12% ${t('with_autopilot')}` : '-'} />
          <StatCard value={demoMode ? "2" : "0"} label={t('security_alert')} color="var(--red)" icon="🛡️" sub={t('sensitive_words')} />
        </div>

        {/* Quant Engine Insights */}
        {demoMode ? (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{color: 'var(--gold)'}}>✦</span> {t('actionable_insights')}
            </h2>
            <div className="grid-2">
              <InsightCard 
                type="alert"
                title="Alerte : Temps d'attente"
                desc="Le mot-clé 'attente' est apparu dans 40% des avis négatifs cette semaine. L'IA a temporisé les réponses clients, mais une action managériale est recommandée."
                action="Analyser le service du soir"
              />
              <InsightCard 
                type="trend"
                title="Tendance Positive : Menu Dégustation"
                desc="Hausse de 15% des mentions ultra-positives concernant le Menu Dégustation. L'IA a configuré ce mot-clé en 'boost SEO' dans ses réponses."
                action="Capitaliser sur Instagram"
              />
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 40, background: 'var(--surface2)', border: '1px dashed var(--border)', borderRadius: 12, padding: 30, textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}><span style={{color: 'var(--gold)'}}>✦</span> {t('actionable_insights')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>L'Intelligence Artificielle analyse vos données en temps réel. Les insights apparaîtront ici dès qu'une tendance sera détectée.</p>
          </div>
        )}

        {/* Live Feed */}
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('live_feed')}</h2>
          <a href="/avis" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>{t('view_history')}</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {feed.length > 0 ? feed.map((r, i) => (
            <div key={r.id} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <ReviewCard review={r} />
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>En attente de nouveaux avis</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Les avis apparaîtront ici dès qu'ils seront publiés sur Google Maps.</div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
