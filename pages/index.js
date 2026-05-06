import Head from 'next/head';
import Layout from '../components/Layout';
import ReviewCard from '../components/ReviewCard';
import { REVIEWS } from '../lib/data';
import { useState } from 'react';

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
        width: 50, height: 50, borderRadius: 14,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [treatedIds, setTreatedIds] = useState(
    REVIEWS.filter(r => r.responded).map(r => r.id)
  );

  const handleTreated = (id) => setTreatedIds(prev => [...prev, id]);

  const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  const positive = REVIEWS.filter(r => r.rating >= 4).length;
  const negative = REVIEWS.filter(r => r.rating <= 2).length;
  const pending = REVIEWS.filter(r => !r.responded).length - (treatedIds.filter(id => !REVIEWS.find(r => r.id === id && r.responded)).length);

  const recentReviews = REVIEWS.slice(0, 5);

  return (
    <>
      <Head>
        <title>Dashboard — RepuIA</title>
        <meta name="description" content="Gérez vos avis Google avec l'IA. Dashboard RepuIA pour restaurateurs." />
      </Head>
      <Layout>
        <style>{`
          .stat-card:hover { border-color: #d4af3750 !important; transform: translateY(-2px) !important; }
          .fade-up { animation: fadeUp .4s ease both; }
        `}</style>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>TABLEAU DE BORD</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Bonjour 👋</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>
                Voici un aperçu de vos avis Google en temps réel.
              </p>
            </div>
            {pending > 0 && (
              <div style={{
                background: '#ef444418', border: '1px solid #ef444440',
                borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{pending} avis en attente de réponse</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
          <StatCard value={REVIEWS.length} label="Avis total" color="var(--gold)" icon="⭐" sub="Ce mois" />
          <StatCard value={avg} label="Note moyenne" color="#FBBC04" icon="📊" sub="/5 étoiles" />
          <StatCard value={positive} label="Avis positifs" color="var(--green)" icon="😊" sub={`${Math.round(positive / REVIEWS.length * 100)}% du total`} />
          <StatCard value={negative} label="Avis négatifs" color="var(--red)" icon="⚠️" sub="À traiter en priorité" />
        </div>

        {/* Section title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Avis récents</h2>
          <a href="/avis" style={{
            fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>Voir tous les avis →</a>
        </div>

        {/* Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {recentReviews.map((r, i) => (
            <div key={r.id} className="fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <ReviewCard review={r} onTreated={handleTreated} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>RepuIA · Propulsé par l'Intelligence Artificielle</p>
          <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>v1.0 PRO</span>
        </div>
      </Layout>
    </>
  );
}
