import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAppStore } from './store/useAppStore';

// Pages (to be created)
import Home from './pages/Home';
import QuranReader from './pages/QuranReader';
import PrayerTimes from './pages/PrayerTimes';
import Qibla from './pages/Qibla';
import Tasbeeh from './pages/Tasbeeh';
import Settings from './pages/Settings';
import IslamicAI from './pages/IslamicAI';
import JuzzIndex from './pages/JuzzIndex';
import MushafReader from './pages/MushafReader';
import Privacy from './pages/Privacy';
import Navigation from './components/Navigation';
import AudioPlayer from './components/AudioPlayer';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pb-20 min-h-screen"
  >
    {children}
  </motion.div>
);

const AppContent = () => {
  const location = useLocation();
  const { setUser, settings } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'amoled', 'emerald');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen transition-colors duration-300">
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
          <Route path="/mushaf" element={<PageWrapper><MushafReader /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
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
