import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from '../contexts/AppContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </AppProvider>
  );
}

export default MyApp;
