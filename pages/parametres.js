import Head from 'next/head';
import Layout from '../components/Layout';
import { useState } from 'react';

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 28px', marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'var(--surface2)', border: `1px solid ${focused ? 'var(--gold-dim)' : 'var(--border)'}`,
        borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
        outline: 'none', transition: 'border-color .2s',
      }} />
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, color: 'var(--text)' }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: value ? 'var(--gold)' : 'var(--surface3)',
        position: 'relative', transition: 'background .2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18,
          borderRadius: '50%', background: value ? '#000' : '#555',
          transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.4)',
        }} />
      </button>
    </div>
  );
}

const TEMPLATES = {
  positif: "Cher(e) [Prénom], merci infiniment pour ce magnifique témoignage ! Votre satisfaction est notre plus belle récompense. Toute notre équipe sera ravie de vous accueillir à nouveau très bientôt.",
  negatif: "Cher(e) [Prénom], nous sommes sincèrement navrés que votre expérience n'ait pas été à la hauteur de vos attentes. Vos remarques sont précieuses et nous allons y remédier immédiatement. N'hésitez pas à nous contacter directement.",
};

export default function Parametres() {
  const [restaurant, setRestaurant] = useState('Le Bon Goût');
  const [adresse, setAdresse] = useState('Paris, France');
  const [email, setEmail] = useState('contact@lebongout.fr');
  const [tone, setTone] = useState('professionnel');
  const [templatePos, setTemplatePos] = useState(TEMPLATES.positif);
  const [templateNeg, setTemplateNeg] = useState(TEMPLATES.negatif);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifNeg, setNotifNeg] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <Head>
        <title>Paramètres — RepuIA</title>
        <meta name="description" content="Configurez votre espace RepuIA : restaurant, notifications, templates IA." />
      </Head>
      <Layout>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>CONFIGURATION</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>Paramètres</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 15 }}>Personnalisez RepuIA pour votre établissement.</p>
        </div>

        {/* Restaurant */}
        <Section title="🏠 Mon Restaurant">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Nom du restaurant">
              <Input value={restaurant} onChange={setRestaurant} placeholder="Nom de votre établissement" />
            </Field>
            <Field label="Ville / Adresse">
              <Input value={adresse} onChange={setAdresse} placeholder="Paris, France" />
            </Field>
            <Field label="Email de contact">
              <Input value={email} onChange={setEmail} placeholder="contact@restaurant.fr" type="email" />
            </Field>
            <Field label="Lien Google My Business" hint="Optionnel — pour synchronisation automatique">
              <Input value="" onChange={() => {}} placeholder="https://business.google.com/…" />
            </Field>
          </div>
        </Section>

        {/* IA */}
        <Section title="✨ Intelligence Artificielle">
          <Field label="Ton des réponses IA" hint="Le style utilisé pour toutes les réponses générées">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['professionnel', 'chaleureux', 'formel', 'décontracté'].map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  background: tone === t ? '#d4af3720' : 'var(--surface2)',
                  border: `1px solid ${tone === t ? 'var(--gold)' : 'var(--border)'}`,
                  color: tone === t ? 'var(--gold)' : 'var(--text-muted)',
                  borderRadius: 8, padding: '9px 18px', fontSize: 13,
                  fontWeight: tone === t ? 600 : 400, cursor: 'pointer', transition: 'all .15s',
                  textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>
          </Field>
          <Field label="Template avis positifs (≥ 4 ⭐)" hint="Utilisez [Prénom] comme variable dynamique">
            <textarea value={templatePos} onChange={e => setTemplatePos(e.target.value)} rows={4}
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 14px', color: 'var(--text)', fontSize: 13,
                lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif',
                borderLeft: '3px solid var(--green)',
              }} />
          </Field>
          <Field label="Template avis négatifs (≤ 2 ⭐)" hint="Utilisez [Prénom] comme variable dynamique">
            <textarea value={templateNeg} onChange={e => setTemplateNeg(e.target.value)} rows={4}
              style={{
                width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 14px', color: 'var(--text)', fontSize: 13,
                lineHeight: 1.7, resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif',
                borderLeft: '3px solid var(--red)',
              }} />
          </Field>
          <Toggle value={autoGenerate} onChange={setAutoGenerate} label="Génération automatique à chaque nouvel avis" />
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notifications">
          <Toggle value={notifEmail} onChange={setNotifEmail} label="Recevoir les nouveaux avis par email" />
          <Toggle value={notifNeg} onChange={setNotifNeg} label="Alerte immédiate pour les avis négatifs (≤ 2 ⭐)" />
          <div style={{ paddingTop: 4 }}>
            <Toggle value={false} onChange={() => {}} label="Rapport hebdomadaire de performance" />
          </div>
        </Section>

        {/* Plan */}
        <div style={{
          background: 'linear-gradient(135deg, #1a140a, #120d04)',
          border: '1px solid #d4af3740', borderRadius: 14, padding: 28, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: '#d4af3708' }} />
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 10 }}>VOTRE ABONNEMENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Plan <span style={{ color: 'var(--gold)' }}>PRO</span></div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Renouvellement le 6 juin 2026 · 29€/mois</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <button style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', borderRadius: 8, padding: '9px 18px',
                fontSize: 13, cursor: 'pointer',
              }}>Changer de plan</button>
              <button style={{
                background: 'linear-gradient(135deg,var(--gold),var(--gold-dim))',
                border: 'none', color: '#000', borderRadius: 8, padding: '9px 18px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>Gérer l'abonnement</button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 8, padding: '11px 22px',
            fontSize: 14, cursor: 'pointer',
          }}>Annuler</button>
          <button onClick={handleSave} style={{
            background: saved ? '#22c55e' : 'linear-gradient(135deg,var(--gold),var(--gold-dim))',
            border: 'none', color: saved ? '#fff' : '#000', borderRadius: 8, padding: '11px 28px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .3s',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {saved ? '✓ Sauvegardé !' : '💾 Sauvegarder les modifications'}
          </button>
        </div>
      </Layout>
    </>
  );
}
