import Head from 'next/head';
import Layout from '../components/Layout';
import { REVIEWS } from '../lib/data';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function BarChart({ data, max, color, height = 120 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height }}>
      {data.map((item, i) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              {item.value > 0 ? item.value : ''}
            </div>
            <div style={{ position: 'relative', width: '100%', height: height - 28 }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: `${pct}%`, minHeight: pct > 0 ? 4 : 0,
                background: color, borderRadius: '4px 4px 0 0',
                transition: 'height .6s ease', opacity: pct > 0 ? 1 : 0,
              }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function DonutSeg({ pct, color, offset, size = 120 }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="14"
      strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset * circ / 100}
      strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s ease' }} />
  );
}

export default function Analytiques() {
  const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  const dist = [1, 2, 3, 4, 5].map(n => ({ n, count: REVIEWS.filter(r => r.rating === n).length }));
  const responded = REVIEWS.filter(r => r.responded).length;
  const pendingPct = Math.round(((REVIEWS.length - responded) / REVIEWS.length) * 100);
  const respondedPct = 100 - pendingPct;

  const monthlyData = MONTHS.slice(0, 5).map((m, i) => ({
    label: m,
    value: [2, 1, 3, 0, 5, 1, 2][i] || 0,
  }));
  const maxMonthly = Math.max(...monthlyData.map(d => d.value));

  const sentimentData = [
    { label: 'Positif', value: REVIEWS.filter(r => r.rating >= 4).length, color: 'var(--green)' },
    { label: 'Neutre', value: REVIEWS.filter(r => r.rating === 3).length, color: '#f59e0b' },
    { label: 'Négatif', value: REVIEWS.filter(r => r.rating <= 2).length, color: 'var(--red)' },
  ];

  // donut offsets
  const total = sentimentData.reduce((a, s) => a + s.value, 0);
  const pcts = sentimentData.map(s => (s.value / total) * 100);
  const offsets = pcts.reduce((acc, p, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + pcts[i - 1]); return acc; }, []);

  const kpis = [
    { label: 'Note moyenne', value: avg, unit: '/ 5', color: '#FBBC04' },
    { label: 'Taux de réponse', value: `${respondedPct}%`, unit: '', color: 'var(--green)' },
    { label: 'Avis ce mois', value: '5', unit: 'nouveaux', color: 'var(--gold)' },
    { label: 'Score réputation', value: '82', unit: '/ 100', color: '#a78bfa' },
  ];

  return (
    <>
      <Head>
        <title>Analytiques — RepuIA</title>
        <meta name="description" content="Analysez vos avis Google avec des graphiques en temps réel." />
      </Head>
      <Layout>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>ANALYTIQUES</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Vue d'ensemble</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>Performance de votre réputation en ligne.</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '20px 22px', transition: 'border-color .2s',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '.5px', marginBottom: 8 }}>
                {k.label.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: k.color }}>{k.value}</span>
                {k.unit && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Bar chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Avis par mois</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Volume de nouveaux avis</p>
            <BarChart data={monthlyData} max={maxMonthly} color="linear-gradient(to top, var(--gold-dim), var(--gold))" />
          </div>

          {/* Donut */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Sentiment</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Répartition positive/neutre/négative</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <svg width="130" height="130" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
                <circle cx="60" cy="60" r="45" fill="none" stroke="var(--surface2)" strokeWidth="14" />
                {sentimentData.map((s, i) => (
                  <DonutSeg key={i} pct={pcts[i]} color={s.color} offset={offsets[i]} />
                ))}
                <text x="60" y="64" textAnchor="middle" fill="var(--text)" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">{avg}★</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sentimentData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 60 }}>{s.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>({pcts[i].toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rating distribution */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Distribution des notes</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Détail par étoile</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[5, 4, 3, 2, 1].map(n => {
              const count = REVIEWS.filter(r => r.rating === n).length;
              const pct = (count / REVIEWS.length) * 100;
              const color = n >= 4 ? 'var(--green)' : n === 3 ? '#f59e0b' : 'var(--red)';
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 32 }}>{n} ⭐</span>
                  <div style={{ flex: 1, height: 10, background: 'var(--surface2)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, background: color,
                      borderRadius: 6, transition: 'width .8s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color, width: 24 }}>{count}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)', width: 36 }}>{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
}
