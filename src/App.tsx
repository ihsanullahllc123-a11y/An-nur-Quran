import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAppStore } from './store/useAppStore';

// Components
import Navigation from './components/Navigation';
import AudioPlayer from './components/AudioPlayer';
import SplashScreen from './components/SplashScreen';
import AdInterstitial from './components/AdInterstitial';
import AdBanner from './components/AdBanner';
import { useInterstitial } from './hooks/useInterstitial';

// Pages
import Home from './pages/Home';
import QuranReader from './pages/QuranReader';
import PrayerTimes from './pages/PrayerTimes';
import Qibla from './pages/Qibla';
import Tasbeeh from './pages/Tasbeeh';
import Settings from './pages/Settings';
import IslamicAI from './pages/IslamicAI';
import JuzzIndex from './pages/JuzzIndex';
import Duas from './pages/Duas';
import Privacy from './pages/Privacy';
import TermsOfService from './pages/TermsOfService';
import Support from './pages/Support';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pb-52 min-h-screen"
  >
    {children}
  </motion.div>
);

const AppContent = () => {
  const location = useLocation();
  const { setUser, settings, setSettings } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);
  const { showInterstitial, closeAd, interstitialId, isTest } = useInterstitial();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore if needed
        setUser(user);
        
        // Optionally fetch and sync settings
        try {
          const { getDoc, doc } = await import('firebase/firestore');
          const { db } = await import('./lib/firebase');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.settings) {
              setSettings(userData.settings);
            }
          }
        } catch (error) {
          console.error('Error fetching user settings:', error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser, setSettings]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'amoled', 'emerald');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen transition-colors duration-300">
      <SplashScreen isVisible={showSplash} />
      <AdInterstitial 
        isOpen={showInterstitial} 
        onClose={closeAd} 
        adId={interstitialId}
        isTest={isTest}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/quran" element={<PageWrapper><QuranReader /></PageWrapper>} />
          <Route path="/prayer-times" element={<PageWrapper><PrayerTimes /></PageWrapper>} />
          <Route path="/qibla" element={<PageWrapper><Qibla /></PageWrapper>} />
          <Route path="/tasbeeh" element={<PageWrapper><Tasbeeh /></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
          <Route path="/ai" element={<PageWrapper><IslamicAI /></PageWrapper>} />
          <Route path="/juzz" element={<PageWrapper><JuzzIndex /></PageWrapper>} />
          <Route path="/duas" element={<PageWrapper><Duas /></PageWrapper>} />
          <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Navigation />
      <AudioPlayer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
