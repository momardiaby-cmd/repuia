import { useState } from 'react'

const DEMO_REVIEWS = [
  { id: 1, author: 'Marie L.', rating: 5, date: 'il y a 2 jours', text: 'Repas exceptionnel ! Le risotto aux truffes était divin et le service impeccable. On reviendra sans hésiter.', responded: false },
  { id: 2, author: 'Thomas B.', rating: 2, date: 'il y a 3 jours', text: 'Déçu par l\'attente de 45 minutes et la viande trop cuite. Le cadre est beau mais la cuisine ne suit pas.', responded: false },
  { id: 3, author: 'Sophie M.', rating: 4, date: 'il y a 5 jours', text: 'Très bon restaurant, belle carte des vins. Le dessert un peu décevant mais l\'ensemble reste de qualité.', responded: false },
  { id: 4, author: 'Jean-Pierre K.', rating: 1, date: 'il y a 1 semaine', text: 'Service désastreux, on a attendu 1h pour être servis et le plat était froid. Jamais on ne reviendra.', responded: true, existingResponse: 'Merci pour votre retour. Nous sommes vraiment désolés de cette expérience. N\'hésitez pas à nous contacter directement. — L\'équipe' },
  { id: 5, author: 'Camille R.', rating: 5, date: 'il y a 1 semaine', text: 'Un coup de coeur ! La burrata maison est incroyable. Ambiance chaleureuse et personnel aux petits soins.', responded: false },
]

const stars = (n) => Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('')

const ratingColor = (r) => r >= 4 ? '#4ade80' : r === 3 ? '#fbbf24' : '#f87171'

export default function Home() {
  const [restaurant, setRestaurant] = useState({ name: 'Le Petit Bistrot', type: 'bistrot français' })
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [generating, setGenerating] = useState(null)
  const [responses, setResponses] = useState({})
  const [copied, setCopied] = useState(null)
  const [setup, setSetup] = useState(false)
  const [tab, setTab] = useState('pending')

  const pending = reviews.filter(r => !r.responded)
  const done = reviews.filter(r => r.responded)

  const generate = async (review) => {
    setGenerating(review.id)
    try {
      const res = await fetch('/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review: review.text,
          rating: review.rating,
          restaurantName: restaurant.name,
          restaurantType: restaurant.type
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResponses(r => ({ ...r, [review.id]: data.response }))
    } catch (e) {
      setResponses(r => ({ ...r, [review.id]: 'Erreur : ' + e.message }))
    } finally {
      setGenerating(null)
    }
  }

  const markDone = (id) => {
    setReviews(r => r.map(rv => rv.id === id ? { ...rv, responded: true, existingResponse: responses[id] } : rv))
    setResponses(r => { const n = { ...r }; delete n[id]; return n })
  }

  const copy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase', marginBottom: 8 }}>Tableau de bord</div>
            <h1 style={{ fontSize: 28, fontWeight: 500, fontFamily: 'Playfair Display, serif', color: '#f0ede8' }}>
              Repu<span style={{ color: '#c8b896' }}>IA</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 300, color: '#f0ede8' }}>{avgRating}</div>
            <div style={{ fontSize: 14, color: '#fbbf24' }}>{stars(Math.round(avgRating))}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{reviews.length} avis</div>
          </div>
        </div>

        {/* Restaurant setup */}
        {!setup ? (
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: 12 }}>Votre établissement</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>Nom</label>
                <input value={restaurant.name} onChange={e => setRestaurant(r => ({ ...r, name: e.target.value }))}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 12px', color: '#f0ede8', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>Type</label>
                <input value={restaurant.type} onChange={e => setRestaurant(r => ({ ...r, type: e.target.value }))}
                  placeholder="bistrot, brasserie, pizzeria..."
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '9px 12px', color: '#f0ede8', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
            </div>
            <button onClick={() => setSetup(true)}
              style={{ marginTop: 12, background: '#c8b896', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirmer →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#f0ede8' }}>{restaurant.name}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{restaurant.type}</div>
            </div>
            <button onClick={() => setSetup(false)} style={{ fontSize: 12, color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>Modifier</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: 'À répondre', value: pending.length, color: '#f87171' },
            { label: 'Répondus', value: done.length, color: '#4ade80' },
            { label: 'Score moyen', value: avgRating + ' ★', color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 300, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {['pending', 'done'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', border: tab === t ? 'none' : '1px solid #222', background: tab === t ? '#c8b896' : 'transparent', color: tab === t ? '#0a0a0a' : '#666', fontWeight: tab === t ? 500 : 400, transition: 'all 0.15s' }}>
              {t === 'pending' ? `À répondre (${pending.length})` : `Traités (${done.length})`}
            </button>
          ))}
        </div>

        {/* Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(tab === 'pending' ? pending : done).map(review => (
            <div key={review.id} style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#f0ede8' }}>{review.author}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{review.date}</div>
                </div>
                <div style={{ fontSize: 16, color: ratingColor(review.rating) }}>{stars(review.rating)}</div>
              </div>

              <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.6, marginBottom: 12 }}>{review.text}</p>

              {review.responded && review.existingResponse && (
                <div style={{ background: '#0a0a0a', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#666', borderLeft: '2px solid #2a2a2a', lineHeight: 1.6 }}>
                  {review.existingResponse}
                </div>
              )}

              {!review.responded && (
                <>
                  {responses[review.id] && (
                    <div style={{ background: '#0f1a0f', border: '1px solid #1a3a1a', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#a0c8a0', lineHeight: 1.6, marginBottom: 10 }}>
                      {responses[review.id]}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => generate(review)} disabled={generating === review.id}
                      style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: generating === review.id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', background: '#c8b896', color: '#0a0a0a', border: 'none', fontWeight: 500, opacity: generating === review.id ? 0.6 : 1 }}>
                      {generating === review.id ? '⟳ Génération...' : responses[review.id] ? '↺ Régénérer' : '✦ Générer une réponse'}
                    </button>
                    {responses[review.id] && (
                      <>
                        <button onClick={() => copy(review.id, responses[review.id])}
                          style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', color: '#888', border: '1px solid #2a2a2a' }}>
                          {copied === review.id ? '✓ Copié !' : '⎘ Copier'}
                        </button>
                        <button onClick={() => markDone(review.id)}
                          style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', color: '#4ade80', border: '1px solid #1a3a1a' }}>
                          ✓ Marquer traité
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: 11, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          RepuIA · Gestion d'avis par IA · 49€/mois
        </div>
      </div>
    </div>
  )
}
