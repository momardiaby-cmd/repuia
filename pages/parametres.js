import Head from 'next/head';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { useAppContext } from '../lib/AppContext';
import { useRouter } from 'next/router';

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

function Toggle({ value, onChange, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, paddingRight: 16 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: value ? 'var(--green)' : 'var(--surface3)', position: 'relative', transition: 'background .2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18,
          borderRadius: '50%', background: value ? '#fff' : '#555', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.4)',
        }} />
      </button>
    </div>
  );
}

export default function Parametres() {
  const [autoPilot, setAutoPilot] = useState(true);
  const [riskHealth, setRiskHealth] = useState(true);
  const [risk1Star, setRisk1Star] = useState(true);
  const [reportFreq, setReportFreq] = useState('hebdomadaire');
  
  // Nouveaux états pour les APIs et Webhooks
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [zapierWebhook, setZapierWebhook] = useState('');
  
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();
  
  const { restaurant, isLoaded, demoMode, setDemoMode } = useAppContext();
  const router = useRouter();

  // Chargement des données sauvegardées
  useEffect(() => {
    if (isLoaded && !restaurant) {
      router.push('/onboarding');
      return;
    }
    if (typeof window !== 'undefined') {
      setOpenAIApiKey(localStorage.getItem('repuia_openai_key') || '');
      setGoogleApiKey(localStorage.getItem('repuia_google_key') || '');
      setSlackWebhook(localStorage.getItem('repuia_slack_webhook') || '');
      setZapierWebhook(localStorage.getItem('repuia_zapier_webhook') || '');
      
      const storedAutoPilot = localStorage.getItem('repuia_autopilot');
      if (storedAutoPilot !== null) setAutoPilot(storedAutoPilot === 'true');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('repuia_openai_key', openAIApiKey);
    localStorage.setItem('repuia_google_key', googleApiKey);
    localStorage.setItem('repuia_autopilot', autoPilot);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleWebhookConnect = (platform, currentVal, setter, storageKey) => {
    if (currentVal) {
      const confirmDisconnect = window.confirm(`Voulez-vous déconnecter ${platform} ? L'URL du webhook sera effacée.`);
      if (confirmDisconnect) {
        setter('');
        localStorage.removeItem(storageKey);
      }
    } else {
      const url = window.prompt(`Entrez l'URL du Webhook ${platform} :`);
      if (url && url.trim() !== '') {
        setter(url.trim());
        localStorage.setItem(storageKey, url.trim());
      }
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px',
    fontSize: 14, outline: 'none', fontFamily: 'monospace'
  };

  return (
    <>
      <Head>
        <title>{t('settings')} — RepuIA</title>
      </Head>
      <Layout>
        <div className="flex-between" style={{ marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>CONFIGURATION AVANCÉE</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.5px' }}>{t('settings')} & {t('auto_pilot')}</h1>
          </div>
          <button onClick={handleSave} style={{
            background: saved ? '#22c55e' : 'linear-gradient(135deg,var(--gold),var(--gold-dim))',
            border: 'none', color: saved ? '#fff' : '#000', borderRadius: 8, padding: '11px 28px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .3s',
          }}>
            {saved ? `✓ ${t('saved')}` : `💾 ${t('save')}`}
          </button>
        </div>

        {/* CLES API */}
        <Section title="🔑 Connexions API & Plateformes">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            Configurez vos clés d'accès pour permettre à RepuIA de se synchroniser avec vos comptes et générer des réponses intelligentes. Ces clés sont stockées localement de manière sécurisée.
          </p>
          <div className="grid-2">
            <Field label="Clé API Google Business Profile" hint="Nécessaire pour lire et publier automatiquement sur Google Maps (à fournir par le restaurateur).">
              <input 
                type="password" 
                value={googleApiKey} 
                onChange={e => setGoogleApiKey(e.target.value)} 
                placeholder="AIzaSy..." 
                style={inputStyle} 
              />
            </Field>
          </div>
          <div style={{ marginTop: 24, padding: 20, background: demoMode ? '#d4af3715' : 'var(--surface2)', border: `1px solid ${demoMode ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 10 }}>
            <Toggle value={demoMode} onChange={setDemoMode} 
              label="🌟 Mode Démonstration (Remplissage auto)" 
              sub="Génère de faux avis et de fausses statistiques pour vous permettre de tester ou de faire une démo de l'application sans connecter de vrai compte Google." 
            />
          </div>
        </Section>

        {/* AUTO PILOT */}
        <Section title={`🤖 ${t('auto_pilot')}`}>
          <div style={{ background: autoPilot ? '#22c55e10' : 'var(--surface2)', border: `1px solid ${autoPilot ? '#22c55e40' : 'var(--border)'}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <Toggle value={autoPilot} onChange={setAutoPilot} 
              label="Activer la Réponse et Publication 100% Autonome" 
              sub="L'IA lira, génèrera et publiera les réponses directement sur Google Maps en quelques minutes." 
            />
          </div>

          {autoPilot && (
            <div style={{ paddingLeft: 20, borderLeft: '2px solid var(--border)', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 12 }}>🛡️ GARDE-FOUS DE SÉCURITÉ (FEU VERT REQUIS)</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Si un avis remplit ces critères, l'IA ne publiera rien et demandera votre validation manuelle :
              </p>
              <Toggle value={riskHealth} onChange={setRiskHealth} label="Risque Sanitaire / Légal" sub="Mots clés détectés : intoxication, malade, plainte, avocat, hygiène..." />
              <Toggle value={risk1Star} onChange={setRisk1Star} label="Avis à 1 étoile" sub="Tous les avis contenant une note minimale de 1/5." />
              <Toggle value={false} onChange={() => {}} label="Agressivité verbale extrême" sub="Insultes, racisme (Détecté automatiquement par l'IA NLP)." />
            </div>
          )}
        </Section>

        <div className="grid-2">
          {/* RAPPORTS */}
          <Section title="📊 Rapports Automatisés">
            <Field label="Fréquence d'envoi des Insights Quantitatifs" hint="Recevez un résumé analytique directement par email.">
              <select value={reportFreq} onChange={e => setReportFreq(e.target.value)}
                style={{
                  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, 
                  padding: '10px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer'
                }}>
                <option value="quotidien">Quotidien (Tous les matins à 8h)</option>
                <option value="hebdomadaire">Hebdomadaire (Le lundi matin)</option>
                <option value="mensuel">Mensuel (Le 1er du mois)</option>
                <option value="off">Désactivé</option>
              </select>
            </Field>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 16, display: 'flex', gap: 8 }}>
              <span>ℹ️</span> Propulsé par Vercel Cron Jobs. Les e-mails incluront les tendances sémantiques et le benchmark.
            </div>
          </Section>

          {/* INTEGRATIONS */}
          <Section title="🔌 Intégrations (Webhooks)">
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Connectez RepuIA à vos outils internes pour être notifié instantanément en cas d'alerte sécurité.
            </p>
            
            {/* SLACK */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: slackWebhook ? '#22c55e10' : 'var(--surface2)', borderRadius: 10, border: `1px solid ${slackWebhook ? '#22c55e40' : 'var(--border)'}` }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3800/3800024.png" alt="Slack" width="28" height="28" style={{ filter: slackWebhook ? 'none' : 'grayscale(1)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Slack</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  {slackWebhook ? '#alertes-repuia' : 'Recevez les alertes sur Slack'}
                </div>
              </div>
              <button 
                onClick={() => handleWebhookConnect('Slack', slackWebhook, setSlackWebhook, 'repuia_slack_webhook')} 
                style={{ 
                  background: slackWebhook ? 'transparent' : 'var(--surface3)', 
                  color: slackWebhook ? 'var(--red)' : 'var(--text)', 
                  border: `1px solid ${slackWebhook ? 'var(--red)' : 'var(--border)'}`, 
                  borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' 
                }}
              >
                {slackWebhook ? 'Déconnecter' : 'Connecter'}
              </button>
            </div>

            {/* ZAPIER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', background: zapierWebhook ? '#22c55e10' : 'var(--surface2)', borderRadius: 10, border: `1px solid ${zapierWebhook ? '#22c55e40' : 'var(--border)'}`, marginTop: 10 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2504/2504930.png" alt="Zapier" width="28" height="28" style={{ filter: zapierWebhook ? 'none' : 'grayscale(1)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Zapier</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  {zapierWebhook ? 'Connecté via Webhook' : 'Automatisez vos workflows'}
                </div>
              </div>
              <button 
                onClick={() => handleWebhookConnect('Zapier', zapierWebhook, setZapierWebhook, 'repuia_zapier_webhook')} 
                style={{ 
                  background: zapierWebhook ? 'transparent' : 'var(--surface3)', 
                  color: zapierWebhook ? 'var(--red)' : 'var(--text)', 
                  border: `1px solid ${zapierWebhook ? 'var(--red)' : 'var(--border)'}`, 
                  borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' 
                }}
              >
                {zapierWebhook ? 'Déconnecter' : 'Connecter'}
              </button>
            </div>
          </Section>
        </div>
      </Layout>
    </>
  );
}
