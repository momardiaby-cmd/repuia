import Head from 'next/head';
import Layout from '../components/Layout';
import { REVIEWS } from '../lib/data';
import { useState } from 'react';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function BarChart({ data, max, color, height = 120 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height }}>
      {data.map((item, i) => {
        const pct = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', group: 'true' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.value > 0 ? item.value : ''}</div>
            <div style={{ position: 'relative', width: '100%', height: height - 28 }}>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, minHeight: pct > 0 ? 4 : 0,
                background: color, borderRadius: '4px 4px 0 0', transition: 'height .6s ease', opacity: pct > 0 ? 1 : 0,
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
  const r = 45; const circ = 2 * Math.PI * r; const dash = (pct / 100) * circ;
  return <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="14" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset * circ / 100} strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s ease' }} />;
}

export default function Analytiques() {
  const [tab, setTab] = useState('overview');

  const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  const respondedPct = 85;

  const monthlyData = MONTHS.slice(0, 5).map((m, i) => ({ label: m, value: [2, 1, 3, 0, 5, 1, 2][i] || 0 }));
  const maxMonthly = Math.max(...monthlyData.map(d => d.value));

  const sentimentData = [
    { label: 'Positif', value: REVIEWS.filter(r => r.rating >= 4).length, color: 'var(--green)' },
    { label: 'Neutre', value: REVIEWS.filter(r => r.rating === 3).length, color: '#f59e0b' },
    { label: 'Négatif', value: REVIEWS.filter(r => r.rating <= 2).length, color: 'var(--red)' },
  ];
  const total = sentimentData.reduce((a, s) => a + s.value, 0);
  const pcts = sentimentData.map(s => (s.value / total) * 100);
  const offsets = pcts.reduce((acc, p, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + pcts[i - 1]); return acc; }, []);

  const kpis = [
    { label: 'Note moyenne', value: avg, unit: '/ 5', color: '#FBBC04' },
    { label: 'Taux de réponse', value: `${respondedPct}%`, unit: '', color: 'var(--green)' },
    { label: 'Score SEO Local', value: '94', unit: '/ 100', color: 'var(--gold)' },
    { label: 'Position Marché', value: '#3', unit: 'dans votre quartier', color: '#a78bfa' },
  ];

  const competitors = [
    { name: "Le Bon Goût (Vous)", rating: 4.2, reviews: 142, responseRate: 85, color: 'var(--gold)' },
    { name: "L'Atelier Parisien", rating: 4.5, reviews: 310, responseRate: 98, color: '#3b82f6' },
    { name: "Bistrot des Amis", rating: 3.9, reviews: 89, responseRate: 40, color: 'var(--text-dim)' },
    { name: "La Table de Chef", rating: 4.1, reviews: 405, responseRate: 15, color: 'var(--text-dim)' },
  ];

  return (
    <>
      <Head><title>Analytiques & Benchmark — RepuIA</title></Head>
      <Layout>
        <div className="flex-between" style={{ marginBottom: 36, alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>INTELLIGENCE ARTIFICIELLE</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Analytiques & Benchmark</h1>
          </div>
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 4, border: '1px solid var(--border)' }}>
            <button onClick={() => setTab('overview')} style={{ background: tab === 'overview' ? 'var(--surface)' : 'transparent', color: tab === 'overview' ? 'var(--text)' : 'var(--text-muted)', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', boxShadow: tab === 'overview' ? '0 1px 3px rgba(0,0,0,.3)' : 'none' }}>
              Vue d'ensemble
            </button>
            <button onClick={() => setTab('benchmark')} style={{ background: tab === 'benchmark' ? 'var(--surface)' : 'transparent', color: tab === 'benchmark' ? 'var(--gold)' : 'var(--text-muted)', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', boxShadow: tab === 'benchmark' ? '0 1px 3px rgba(0,0,0,.3)' : 'none' }}>
              ✦ Benchmark Concurrentiel
            </button>
          </div>
        </div>

        {tab === 'overview' ? (
          <>
            {/* KPIs */}
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '.5px', marginBottom: 8 }}>{k.label.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 34, fontWeight: 800, color: k.color }}>{k.value}</span>
                    {k.unit && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
              {/* Bar chart */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Avis par mois</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Volume de nouveaux avis détectés</p>
                <BarChart data={monthlyData} max={maxMonthly} color="linear-gradient(to top, var(--gold-dim), var(--gold))" />
              </div>

              {/* Donut */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Analyse Sémantique (NLP)</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Répartition positive/neutre/négative par l'IA</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <svg width="130" height="130" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="var(--surface2)" strokeWidth="14" />
                    {sentimentData.map((s, i) => <DonutSeg key={i} pct={pcts[i]} color={s.color} offset={offsets[i]} />)}
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
          </>
        ) : (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Positionnement local (Paris 11e)</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>L'IA surveille quotidiennement vos concurrents directs sur Google Maps pour comparer votre attractivité.</p>
              </div>
              <div style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Établissement</th>
                      <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Note Globale</th>
                      <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Volume d'Avis</th>
                      <th style={{ padding: '16px 28px', fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Taux de Réponse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.sort((a,b) => b.rating - a.rating).map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: c.name.includes('Vous') ? '#d4af3708' : 'transparent' }}>
                        <td style={{ padding: '20px 28px', fontSize: 14, fontWeight: c.name.includes('Vous') ? 700 : 500, color: c.color }}>
                          {i === 0 && <span style={{marginRight: 8}}>🥇</span>}
                          {i === 1 && <span style={{marginRight: 8}}>🥈</span>}
                          {i === 2 && <span style={{marginRight: 8}}>🥉</span>}
                          {c.name}
                        </td>
                        <td style={{ padding: '20px 28px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 700 }}>{c.rating}</span>
                            <span style={{ fontSize: 12, color: '#FBBC04' }}>★</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 28px', fontSize: 14, color: 'var(--text-muted)' }}>{c.reviews} avis</td>
                        <td style={{ padding: '20px 28px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${c.responseRate}%`, background: c.responseRate > 80 ? 'var(--green)' : c.responseRate > 40 ? '#f59e0b' : 'var(--red)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, width: 36 }}>{c.responseRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ marginTop: 24, padding: 20, background: 'linear-gradient(135deg, #1a140a, #120d04)', border: '1px solid #d4af3740', borderRadius: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>💡 Insight Concurrentiel par l'IA</div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>Votre taux de réponse de 85% vous donne un avantage majeur sur <strong>Bistrot des Amis</strong> et <strong>La Table de Chef</strong>. Cependant, <strong>L'Atelier Parisien</strong> répond à 98% de ses avis. Le <strong>Mode Pilote Automatique</strong> de RepuIA peut vous aider à atteindre les 100% de taux de réponse pour récupérer la première place locale.</p>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
