import Head from 'next/head';
import Layout from '../components/Layout';
import ReviewCard from '../components/ReviewCard';
import { REVIEWS } from '../lib/data';
import { useState } from 'react';
import { useTranslation } from '../lib/i18n';

export default function Avis() {
  const [filter, setFilter] = useState('all'); // all, pending, treated
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState(REVIEWS);
  const { t } = useTranslation();

  const handleStatusChange = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.author.toLowerCase().includes(search.toLowerCase()) || r.text.toLowerCase().includes(search.toLowerCase());
    if (filter === 'pending') return matchSearch && (r.status === 'pending' || r.status === 'needs_review');
    if (filter === 'treated') return matchSearch && (r.status === 'auto_published' || r.status === 'manual_published');
    return matchSearch;
  });

  return (
    <>
      <Head>
        <title>{t('reviews')} — RepuIA</title>
      </Head>
      <Layout>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>{t('reviews')}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>Consultez et répondez à tous vos avis depuis une seule interface.</p>
        </div>

        {/* Filters & Search */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap',
          background: 'var(--surface)', padding: '16px', borderRadius: 14, border: '1px solid var(--border)'
        }}>
          <input 
            type="text" 
            placeholder="Rechercher un avis, un client..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, background: 'var(--surface2)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px',
              fontSize: 14, outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setFilter('all')} style={btnStyle(filter === 'all')}>Tous</button>
            <button onClick={() => setFilter('pending')} style={btnStyle(filter === 'pending')}>À traiter</button>
            <button onClick={() => setFilter('treated')} style={btnStyle(filter === 'treated')}>Publiés</button>
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Aucun avis trouvé</div>
            </div>
          ) : (
            filteredReviews.map((r, i) => (
              <div key={r.id} style={{ animation: `fadeUp .4s ease ${i * 0.05}s both` }}>
                <ReviewCard review={r} onStatusChange={handleStatusChange} />
              </div>
            ))
          )}
        </div>
      </Layout>
    </>
  );
}

const btnStyle = (active) => ({
  background: active ? 'var(--gold)' : 'var(--surface2)',
  color: active ? '#000' : 'var(--text-muted)',
  border: active ? '1px solid var(--gold)' : '1px solid var(--border)',
  borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', transition: 'all .2s'
});
