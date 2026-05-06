import Head from 'next/head';
import Layout from '../components/Layout';
import ReviewCard from '../components/ReviewCard';
import { REVIEWS } from '../lib/data';
import { useState, useMemo } from 'react';

const FILTERS = ['Tous', '5 ⭐', '4 ⭐', '3 ⭐', '1-2 ⭐'];
const SORTS = [
  { label: 'Plus récents', fn: (a, b) => new Date(b.date) - new Date(a.date) },
  { label: 'Plus anciens', fn: (a, b) => new Date(a.date) - new Date(b.date) },
  { label: 'Meilleures notes', fn: (a, b) => b.rating - a.rating },
  { label: 'Pires notes', fn: (a, b) => a.rating - b.rating },
];

export default function AvisPage() {
  const [filter, setFilter] = useState('Tous');
  const [sortIdx, setSortIdx] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filtered = useMemo(() => {
    let list = [...REVIEWS];
    if (filter === '5 ⭐') list = list.filter(r => r.rating === 5);
    else if (filter === '4 ⭐') list = list.filter(r => r.rating === 4);
    else if (filter === '3 ⭐') list = list.filter(r => r.rating === 3);
    else if (filter === '1-2 ⭐') list = list.filter(r => r.rating <= 2);

    if (statusFilter === 'En attente') list = list.filter(r => !r.responded);
    else if (statusFilter === 'Traités') list = list.filter(r => r.responded);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.author.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
      );
    }
    return list.sort(SORTS[sortIdx].fn);
  }, [filter, sortIdx, search, statusFilter]);

  return (
    <>
      <Head>
        <title>Tous les avis — RepuIA</title>
        <meta name="description" content="Consultez et gérez tous vos avis Google en un seul endroit." />
      </Head>
      <Layout>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>AVIS CLIENTS</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Tous les avis</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>
            {REVIEWS.length} avis Google · {REVIEWS.filter(r => !r.responded).length} en attente de réponse
          </p>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-dim)' }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou contenu…"
            style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 16px 12px 44px', color: 'var(--text)',
              fontSize: 14, outline: 'none', transition: 'border-color .2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--gold-dim)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Note :</span>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? 'var(--gold)' : 'var(--surface)',
              border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--border)'}`,
              color: filter === f ? '#000' : 'var(--text-muted)',
              borderRadius: 20, padding: '6px 14px', fontSize: 12,
              fontWeight: filter === f ? 700 : 400, cursor: 'pointer', transition: 'all .15s',
            }}>{f}</button>
          ))}
          <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-muted)' }}>Statut :</span>
          {['Tous', 'En attente', 'Traités'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? '#ffffff10' : 'var(--surface)',
              border: `1px solid ${statusFilter === s ? 'var(--border-hover)' : 'var(--border)'}`,
              color: statusFilter === s ? 'var(--text)' : 'var(--text-muted)',
              borderRadius: 20, padding: '6px 14px', fontSize: 12,
              fontWeight: statusFilter === s ? 600 : 400, cursor: 'pointer', transition: 'all .15s',
            }}>{s}</button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <select value={sortIdx} onChange={e => setSortIdx(Number(e.target.value))}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text)', borderRadius: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer',
              }}>
              {SORTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Count */}
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          {filtered.length} avis affichés
        </div>

        {/* Review list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 15 }}>Aucun avis ne correspond à vos critères.</p>
              </div>
            : filtered.map((r, i) => (
              <div key={r.id} style={{ animation: 'fadeUp .35s ease both', animationDelay: `${i * 60}ms` }}>
                <ReviewCard review={r} />
              </div>
            ))
          }
        </div>
      </Layout>
    </>
  );
}
