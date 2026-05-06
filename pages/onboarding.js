import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAppContext } from '../lib/AppContext';

export default function Onboarding() {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [importing, setImporting] = useState(false);
  
  const router = useRouter();
  const { loginRestaurant } = useAppContext();
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    // Load Google Maps API script
    const loadScript = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Pas de clé API Google Maps détectée. Mode simulation activé.");
        return;
      }
      
      if (window.google) {
        initServices();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initServices;
      document.body.appendChild(script);
    };

    const initServices = () => {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      // Need a dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    };

    loadScript();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length < 3) {
      setPredictions([]);
      return;
    }

    if (autocompleteService.current) {
      // Real API call
      autocompleteService.current.getPlacePredictions({ input: val, types: ['establishment'] }, (preds, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
          setPredictions(preds.slice(0, 5));
        } else {
          setPredictions([]);
        }
      });
    } else {
      // Mock simulation mode if no API key
      setTimeout(() => {
        setPredictions([
          { place_id: 'mock1', description: `${val} (Paris)`, structured_formatting: { main_text: val, secondary_text: 'Paris, France' } },
          { place_id: 'mock2', description: `${val} (Lyon)`, structured_formatting: { main_text: val, secondary_text: 'Lyon, France' } },
        ]);
      }, 300);
    }
  };

  const handleSelect = (place) => {
    setSelectedPlace(place);
    setPredictions([]);
    setQuery(place.description || place.structured_formatting.main_text);
  };

  const handleImport = async () => {
    if (!selectedPlace) return;
    setImporting(true);
    
    const name = selectedPlace.structured_formatting?.main_text || selectedPlace.description;
    const address = selectedPlace.structured_formatting?.secondary_text || 'Adresse inconnue';
    
    // Simulate fetching reviews from Google
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Save to global state and redirect
    loginRestaurant({ name, address, id: selectedPlace.place_id });
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', padding: 20 }}>
      <Head><title>Bienvenue — RepuIA</title></Head>
      
      <div style={{ width: '100%', maxWidth: 500, animation: 'fadeUp .5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.5px', lineHeight: 1, marginBottom: 12 }}>
            <span style={{ color: 'var(--gold)' }}>Repu</span>
            <span style={{ color: 'var(--text)' }}>IA</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Trouvez votre établissement</h1>
          <p style={{ color: 'var(--text-muted)' }}>Synchronisez vos avis Google My Business en un clic.</p>
        </div>

        <div style={{ position: 'relative', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--gold)', borderRadius: 12, padding: '4px 14px', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)' }}>
            <span style={{ fontSize: 20, color: 'var(--gold)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Ex: Le Bistrot Parisien..."
              value={query}
              onChange={handleSearch}
              disabled={importing}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text)', padding: '14px', fontSize: 16, outline: 'none' }}
            />
          </div>

          {predictions.length > 0 && !importing && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, marginTop: 8, overflow: 'hidden', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {predictions.map(p => (
                <div 
                  key={p.place_id} 
                  onClick={() => handleSelect(p)}
                  style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4285F420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4285F4' }}>📍</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.structured_formatting?.main_text || p.description}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.structured_formatting?.secondary_text || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPlace && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <button 
              onClick={handleImport}
              disabled={importing}
              style={{
                width: '100%', background: importing ? 'var(--surface3)' : 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                color: importing ? 'var(--text-muted)' : '#000', border: 'none', borderRadius: 12, padding: '16px',
                fontSize: 16, fontWeight: 700, cursor: importing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all .3s', boxShadow: importing ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)'
              }}
            >
              {importing ? (
                <><span style={{display:'inline-block', width:18, height:18, border:'2px solid #888', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 1s linear infinite'}} /> Synchronisation Google en cours...</>
              ) : (
                <>Importer cet établissement ⚡</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
