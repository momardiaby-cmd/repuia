import '../styles/globals.css';
import { LanguageProvider } from '../lib/i18n';
import { AppProvider } from '../lib/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </AppProvider>
  );
}

export default MyApp;
