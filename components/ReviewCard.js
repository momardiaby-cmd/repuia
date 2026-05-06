import { useState } from 'react';
import { useTranslation } from '../lib/i18n';

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

export default function ReviewCard({ review, onStatusChange }) {
  const [status, setStatus] = useState(review.status);
  const [response, setResponse] = useState(review.response || '');
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [expanded, setExpanded] = useState(status === 'auto_published' || status === 'manual_published');
  const { t } = useTranslation();

  const isPositive = review.rating >= 4;
  const ratingColor = review.rating >= 4 ? 'var(--green)' : review.rating === 3 ? '#f59e0b' : 'var(--red)';
  const avatarGrad = isPositive
    ? 'linear-gradient(135deg,#22c55e,#166534)'
    : review.rating === 3
    ? 'linear-gradient(135deg,#f59e0b,#92400e)'
    : 'linear-gradient(135deg,#ef4444,#991b1b)';

  const platformIcons = {
    Google: <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
    TripAdvisor: <span style={{fontSize: 14, color: '#34E0A1', fontWeight: 800}}>TA</span>,
    TheFork: <span style={{fontSize: 14, color: '#5A8C43', fontWeight: 800}}>TF</span>
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setExpanded(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (e) {
      setResponse("Erreur de génération. Veuillez réessayer.");
    }
    setGenerating(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id, responseText: response })
      });
      setStatus('manual_published');
      if (onStatusChange) onStatusChange(review.id, 'manual_published');
    } catch (e) {
      alert("Erreur de publication");
    }
    setPublishing(false);
  };

  const renderBadge = () => {
    if (status === 'auto_published') return <div style={{...badgeStyle, background: '#22c55e18', border: '1px solid #22c55e40', color: 'var(--green)'}}>✓ {t('published_auto')}</div>;
    if (status === 'manual_published') return <div style={{...badgeStyle, background: '#22c55e18', border: '1px solid #22c55e40', color: 'var(--green)'}}>✓ {t('published')}</div>;
    if (status === 'needs_review') return <div style={{...badgeStyle, background: '#ef444420', border: '1px solid #ef444450', color: 'var(--red)'}}>⚠️ {t('needs_action')}</div>;
    return null;
  };

  const badgeStyle = { position: 'absolute', top: 14, right: 14, borderRadius: 20, padding: '4px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '.8px' };

  const isTreated = status === 'auto_published' || status === 'manual_published';

  return (
    <div style={{
      background: isTreated ? '#0b160b' : status === 'needs_review' ? '#1a0b0b' : 'var(--surface)',
      border: `1px solid ${isTreated ? '#1e3a1e' : status === 'needs_review' ? '#3a1e1e' : 'var(--border)'}`,
      borderRadius: 14, padding: '24px', transition: 'all .3s', position: 'relative',
      opacity: isTreated ? 0.75 : 1,
    }}>
      {renderBadge()}

      <div className="review-card-header" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: avatarGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff',
        }}>{review.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{review.author}</span>
            <span style={{ background: `${ratingColor}20`, border: `1px solid ${ratingColor}40`, borderRadius: 20, padding: '2px 8px', fontSize: 10, color: ratingColor, fontWeight: 700 }}>
              {review.rating}/5
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Stars rating={review.rating} />
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{review.dateLabel}</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {platformIcons[review.platform] || platformIcons.Google}
          {review.platform}
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.75, marginBottom: 18 }}>{review.text}</p>

      {status === 'needs_review' && (
        <div style={{ background: '#ef444410', borderLeft: '3px solid var(--red)', padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: 18, fontSize: 13, color: '#ffaaaa' }}>
          <strong>Motif du blocage auto-pilot :</strong> {review.riskReason}
        </div>
      )}

      {!isTreated && !expanded && (
        <button onClick={handleGenerate} disabled={generating}
          style={{
            background: generating ? 'var(--surface3)' : 'linear-gradient(135deg,#d4af37,#a8882a)',
            color: generating ? 'var(--text-muted)' : '#000', border: 'none',
            borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600,
            cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
          }}>
          {generating ? <><Spinner />&nbsp;{t('generating')}</> : <><span>✨</span> {t('generate_ai')}</>}
        </button>
      )}

      {expanded && (
        <div style={{ marginTop: 18, background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1px' }}>✨ {t('ai_response')} {isTreated ? '' : t('ai_proposed')}</span>
          </div>
          
          {generating ? (
             <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-muted)', fontSize:13 }}>
               <Spinner color="var(--gold)" /> {t('generating')}
             </div>
          ) : (
             <textarea 
               value={response} 
               onChange={e => setResponse(e.target.value)}
               disabled={isTreated}
               style={{
                 width: '100%', minHeight: '80px', background: isTreated ? 'transparent' : 'var(--surface)', 
                 border: isTreated ? 'none' : '1px solid var(--border-hover)', borderRadius: 8, 
                 padding: isTreated ? 0 : '10px 12px', color: 'var(--text)', fontSize: 14, 
                 lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit'
               }}
             />
          )}

          {!isTreated && !generating && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, gap: 10 }}>
              <button onClick={() => setExpanded(false)} style={{
                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
                borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer'
              }}>{t('cancel')}</button>
              
              <button onClick={handlePublish} disabled={publishing} style={{
                background: publishing ? 'var(--surface3)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: publishing ? 'var(--text-muted)' : '#fff', border: 'none',
                borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: publishing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                {publishing ? <><Spinner color="#fff" /> {t('publishing')}</> : <>🚀 {t('approve_publish')}</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner({ color = '#888' }) {
  return <span style={{
    display:'inline-block', width:14, height:14, border:`2px solid ${color}40`, borderTopColor: color, borderRadius:'50%', animation:'spin 1s linear infinite',
  }} />;
}
