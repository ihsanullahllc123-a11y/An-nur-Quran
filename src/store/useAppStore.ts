import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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
      setSettings: async (newSettings) => {
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          
          // Sync with Firestore if user is logged in
          if (state.user) {
            updateDoc(doc(db, 'users', state.user.uid), {
              settings: updatedSettings
            }).catch(err => console.error('Error syncing settings:', err));
          }
          
          return { settings: updatedSettings };
        });
      },
      setProgress: async (progress) => {
        set((state) => {
          // Sync with Firestore if user is logged in
          if (state.user) {
            updateDoc(doc(db, 'users', state.user.uid), {
              lastRead: progress
            }).catch(err => console.error('Error syncing progress:', err));
          }
          return { progress };
        });
      },
      setPrayerTimes: (prayerTimes) => set({ prayerTimes }),
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'annur-storage',
    }
  )
);
