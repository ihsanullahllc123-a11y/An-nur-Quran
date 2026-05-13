import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettings {
  theme: 'light' | 'dark' | 'amoled' | 'emerald';
  fontFamily: string;
  fontSize: number;
  translation: string;
  reciter: string;
  prayerMethod: number;
  asrSchool: number; // 0 for Shafi, 1 for Hanafi
}

interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  timestamp: number;
}

interface AppState {
  user: any | null;
  settings: UserSettings;
  progress: ReadingProgress | null;
  prayerTimes: any | null;
  location: { latitude: number; longitude: number; city?: string } | null;
  setUser: (user: any) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  setProgress: (progress: ReadingProgress) => void;
  setPrayerTimes: (times: any) => void;
  setLocation: (loc: { latitude: number; longitude: number; city?: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      settings: {
        theme: 'emerald',
        fontFamily: 'Inter',
        fontSize: 18,
        translation: 'en.sahih',
        reciter: 'ar.alafasy',
        prayerMethod: 2, // ISNA
        asrSchool: 0, // Shafi
      },
      progress: null,
      prayerTimes: null,
      location: null,
      setUser: (user) => set({ user }),
      setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      setProgress: (progress) => set({ progress }),
      setPrayerTimes: (prayerTimes) => set({ prayerTimes }),
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'annur-storage',
    }
  )
);
