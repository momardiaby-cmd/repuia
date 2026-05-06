import Head from 'next/head';
import Layout from '../components/Layout';
import ReviewCard from '../components/ReviewCard';
import { REVIEWS } from '../lib/data';

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
  const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  const positive = REVIEWS.filter(r => r.rating >= 4).length;
  
  // Pending = pending OR needs_review
  const pendingCount = REVIEWS.filter(r => r.status === 'pending' || r.status === 'needs_review').length;

  // Simulate a live feed of the top 5 most recent reviews needing attention or recently published
  const feed = REVIEWS.slice(0, 5);

  return (
    <>
      <Head>
        <title>Dashboard — RepuIA Quant</title>
      </Head>
      <Layout>
        <style>{`.fade-up { animation: fadeUp .4s ease both; }`}</style>

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>REPUIA QUANT ENGINE</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Bonjour 👋</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>L'IA surveille votre réputation en temps réel.</p>
          </div>
          {pendingCount > 0 && (
            <div style={{ background: '#ef444418', border: '1px solid #ef444440', borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{pendingCount} action(s) requise(s)</span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard value={REVIEWS.length} label="Avis monitorés" color="var(--gold)" icon="📡" sub="Toutes plateformes" />
          <StatCard value={avg} label="Note moyenne" color="#FBBC04" icon="📊" sub="Stable depuis 7 jours" />
          <StatCard value="92%" label="Taux de réponse" color="var(--green)" icon="⚡" sub="+12% avec Auto-Pilot" />
          <StatCard value="2" label="Alerte Sécurité" color="var(--red)" icon="🛡️" sub="Mots clés sensibles détectés" />
        </div>

        {/* Quant Engine Insights */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{color: 'var(--gold)'}}>✦</span> Insights Actionnables
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

        {/* Live Feed */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Flux d'Avis (Temps Réel)</h2>
          <a href="/avis" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>Voir l'historique →</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {feed.map((r, i) => (
            <div key={r.id} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
}
