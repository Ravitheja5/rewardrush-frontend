import '../styles/globals.css';
import { ToastProvider } from '../context/ToastContext';
import { LanguageProvider } from '../context/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </LanguageProvider>
  );
}
