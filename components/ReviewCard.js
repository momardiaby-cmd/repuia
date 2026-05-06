import { useState } from 'react';
import { generateAIResponse } from '../lib/data';

function Stars({ rating, size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= rating ? '#FBBC04' : 'none'}
          stroke={i <= rating ? '#FBBC04' : '#333'} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export { Stars };

export default function ReviewCard({ review, onTreated }) {
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [treated, setTreated] = useState(review.responded || false);
  const [expanded, setExpanded] = useState(false);

  const isPositive = review.rating >= 4;
  const ratingColor = review.rating >= 4 ? 'var(--green)' : review.rating === 3 ? '#f59e0b' : 'var(--red)';
  const avatarGrad = isPositive
    ? 'linear-gradient(135deg,#22c55e,#166534)'
    : review.rating === 3
    ? 'linear-gradient(135deg,#f59e0b,#92400e)'
    : 'linear-gradient(135deg,#ef4444,#991b1b)';

  const handleGenerate = async () => {
    setGenerating(true);
    setResponse('');
    setExpanded(true);
    await new Promise(r => setTimeout(r, 900));
    const full = generateAIResponse(review);
    let i = 0;
    setGenerating(false);
    const iv = setInterval(() => {
      i += 3;
      setResponse(full.slice(0, i));
      if (i >= full.length) clearInterval(iv);
    }, 16);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTreat = () => {
    setTreated(true);
    if (onTreated) onTreated(review.id);
  };

  return (
    <div style={{
      background: treated ? '#0b160b' : 'var(--surface)',
      border: `1px solid ${treated ? '#1e3a1e' : 'var(--border)'}`,
      borderRadius: 14, padding: '22px 24px',
      transition: 'all .3s', position: 'relative',
      opacity: treated ? 0.75 : 1,
    }}>
      {treated && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: '#22c55e18', border: '1px solid #22c55e40',
          borderRadius: 20, padding: '3px 12px', fontSize: 10,
          color: 'var(--green)', fontWeight: 700, letterSpacing: '.8px',
        }}>✓ TRAITÉ</div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: avatarGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>{review.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{review.author}</span>
            <span style={{
              background: `${ratingColor}20`, border: `1px solid ${ratingColor}40`,
              borderRadius: 20, padding: '2px 8px', fontSize: 10,
              color: ratingColor, fontWeight: 700,
            }}>{review.rating}/5</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Stars rating={review.rating} />
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{review.dateLabel}</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.75, marginBottom: 18 }}>{review.text}</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handleGenerate} disabled={generating || treated}
          style={{
            background: generating ? 'var(--surface3)' : 'linear-gradient(135deg,#d4af37,#a8882a)',
            color: generating ? 'var(--text-muted)' : '#000', border: 'none',
            borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600,
            cursor: generating || treated ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
            opacity: treated ? .5 : 1,
          }}>
          {generating
            ? <><Spinner />&nbsp;Génération…</>
            : <><span>✨</span> Générer une réponse IA</>}
        </button>

        {response && !treated && (
          <>
            <button onClick={handleCopy} style={{
              background: copied ? '#22c55e18' : 'var(--surface2)',
              border: `1px solid ${copied ? '#22c55e50' : 'var(--border-hover)'}`,
              color: copied ? 'var(--green)' : 'var(--text)', borderRadius: 8,
              padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
            }}>
              {copied ? '✓ Copié !' : '📋 Copier'}
            </button>
            <button onClick={handleTreat} style={{
              background: 'var(--surface2)', border: '1px solid var(--border-hover)',
              color: 'var(--text)', borderRadius: 8, padding: '9px 16px',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
            }}>✓ Marquer traité</button>
          </>
        )}
      </div>

      {expanded && (
        <div style={{
          marginTop: 18, background: 'var(--surface2)',
          border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)',
          borderRadius: 10, padding: 16,
        }}>
          <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1px', marginBottom: 8 }}>
            ✨ RÉPONSE GÉNÉRÉE PAR IA
          </div>
          {generating
            ? <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-muted)', fontSize:13 }}>
                <Spinner color="var(--gold)" /> Analyse de l'avis en cours…
              </div>
            : <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8 }}>
                {response}
                <span style={{ display:'inline-block', width:2, height:14, background:'var(--gold)', marginLeft:2, animation:'blink 1s step-end infinite', verticalAlign:'middle' }} />
              </p>
          }
        </div>
      )}
    </div>
  );
}

function Spinner({ color = '#888' }) {
  return <span style={{
    display:'inline-block', width:13, height:13,
    border:`2px solid ${color}40`, borderTopColor: color,
    borderRadius:'50%', animation:'spin 1s linear infinite',
  }} />;
}
