
export const ADMOB_CONFIG = {
  APP_ID: "ca-app-pub-9722480803829956~8304060688",
  BANNER_ID: "ca-app-pub-9722480803829956/3051734005",
  INTERSTITIAL_ID: "ca-app-pub-9722480803829956/4692118736",
  IS_TEST_MODE: process.env.NODE_ENV !== 'production',
  // Test IDs from Google documentation
  TEST_BANNER_ID: "ca-app-pub-3940256099942544/6300978111",
  TEST_INTERSTITIAL_ID: "ca-app-pub-3940256099942544/1033173712"
};

export const getBannerId = () => ADMOB_CONFIG.IS_TEST_MODE ? ADMOB_CONFIG.TEST_BANNER_ID : ADMOB_CONFIG.BANNER_ID;
export const getInterstitialId = () => ADMOB_CONFIG.IS_TEST_MODE ? ADMOB_CONFIG.TEST_INTERSTITIAL_ID : ADMOB_CONFIG.INTERSTITIAL_ID;

// Ad counter for interstitial frequency
let navigationCount = 0;
const INTERSTITIAL_THRESHOLD = 3;

export const incrementNavigationCount = () => {
  navigationCount++;
  if (navigationCount >= INTERSTITIAL_THRESHOLD) {
    navigationCount = 0;
    return true; // Should show ad
  }
  return false;
};
