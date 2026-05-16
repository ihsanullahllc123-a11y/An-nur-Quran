
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementNavigationCount, getInterstitialId, ADMOB_CONFIG } from '../lib/admob';

export function useInterstitial() {
  const location = useLocation();
  const [showInterstitial, setShowInterstitial] = useState(false);
  const interstitialId = getInterstitialId();

  useEffect(() => {
    // Only trigger if we are not in the reader (to avoid interruption)
    const isReader = location.pathname === '/quran' || location.pathname === '/mushaf' || location.pathname === '/ai';
    
    if (!isReader) {
      const shouldShow = incrementNavigationCount();
      if (shouldShow) {
        setShowInterstitial(true);
      }
    }
  }, [location.pathname]);

  const closeAd = () => setShowInterstitial(false);

  return { 
    showInterstitial, 
    closeAd, 
    interstitialId, 
    isTest: ADMOB_CONFIG.IS_TEST_MODE 
  };
}
