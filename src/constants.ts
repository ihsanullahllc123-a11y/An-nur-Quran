export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AMOLED: 'amoled',
  EMERALD: 'emerald',
} as const;

export const QURAN_FONTS = {
  USMANI: 'usmani',
  INDO_PAK: 'indopak',
};

export const LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Indonesian' },
];

export const APP_COLORS = {
  primary: '#065F46', // Emerald 800
  accent: '#D97706',  // Amber 600 (Gold)
  background: '#F9FAFB', // Gray 50
};

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
