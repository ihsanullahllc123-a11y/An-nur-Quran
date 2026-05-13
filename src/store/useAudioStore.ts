import { create } from 'zustand';
import { Howl } from 'howler';

interface Qari {
  identifier: string;
  name: string;
  englishName: string;
}

export const QARIS: Qari[] = [
  { identifier: 'ar.alafasy', name: 'مشاري راشد العفاسي', englishName: 'Mishary Rashid Alafasy' },
  { identifier: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)', englishName: 'AbdulBaset AbdulSamad' },
  { identifier: 'ar.abdulsamad', name: 'عبد الباسط عبد الصمد (مجود)', englishName: 'AbdulBaset AbdulSamad (Mujawwad)' },
  { identifier: 'ar.as-sudais', name: 'عبد الرحمن السديس', englishName: 'Abdurrahmaan As-Sudais' },
  { identifier: 'ar.maheralmuaiqly', name: 'ماهر المعيقلي', englishName: 'Maher Al Muaiqly' },
  { identifier: 'ar.ghamidi', name: 'سعد الغامدي', englishName: 'Saad El Ghamidi' },
];

interface AudioState {
  isPlaying: boolean;
  currentSurah: number | null;
  currentAyah: number | null;
  currentQari: string;
  playbackSpeed: number;
  isRepeatAyah: boolean;
  isAutoNextSurah: boolean;
  volume: number;
  duration: number;
  seek: number;
  
  // Actions
  play: (surah: number, ayah: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setQari: (identifier: string) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleRepeat: () => void;
  setSeek: (seek: number) => void;
  setVolume: (vol: number) => void;
  nextAyah: () => void;
  prevAyah: () => void;
}

let sound: Howl | null = null;

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  currentSurah: null,
  currentAyah: null,
  currentQari: 'ar.alafasy',
  playbackSpeed: 1,
  isRepeatAyah: false,
  isAutoNextSurah: true,
  volume: 1,
  duration: 0,
  seek: 0,

  play: async (surah, ayah) => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    const { currentQari, playbackSpeed, volume, currentSurah } = get();
    
    try {
      // If we are already on this surah, we might have the URLs cached if we implemented that,
      // but for now let's just fetch the surah audio data to get all URLs at once for the current surah.
      // This is much more reliable than fetching ayah by ayah.
      const url = `https://api.alquran.cloud/v1/surah/${surah}/${currentQari}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== 200 || !data.data || !data.data.ayahs) {
        throw new Error("Could not fetch surah audio data");
      }

      const ayahs = data.data.ayahs;
      const targetAyah = ayahs.find((a: any) => a.numberInSurah === ayah);

      if (!targetAyah || !targetAyah.audio) {
        // Fallback pattern if specific ayah not found in metadata
        // Most common pattern: https://cdn.islamic.network/quran/audio/128/{qari}/{absolute_ayah_number}.mp3
        // We'll try to use the absolute number from the API if available
        throw new Error("Ayah audio not found");
      }

      const audioUrl = targetAyah.audio;
      
      sound = new Howl({
        src: [audioUrl],
        html5: true,
        format: ['mp3'],
        rate: playbackSpeed,
        volume: volume,
        onplay: () => {
          set({ isPlaying: true, duration: sound?.duration() || 0 });
          const step = () => {
            if (sound && sound.playing()) {
              set({ seek: (sound.seek() as number) });
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        },
        onpause: () => set({ isPlaying: false }),
        onend: () => {
          set({ isPlaying: false });
          if (get().isRepeatAyah) {
            get().play(surah, ayah);
          } else {
            // Check if next ayah exists in same surah
            if (ayah < ayahs.length) {
              get().play(surah, ayah + 1);
            } else if (get().isAutoNextSurah && surah < 114) {
              get().play(surah + 1, 1);
            }
          }
        },
        onloaderror: (id, err) => {
          console.error("Howl Load Error:", err);
          set({ isPlaying: false });
        },
        onplayerror: (id, err) => {
          console.error("Howl Play Error:", err);
          sound?.once('unlock', () => sound?.play());
        }
      });

      sound.play();
      set({ currentSurah: surah, currentAyah: ayah, isPlaying: true });
    } catch (err) {
      console.error("Audio Playback Error:", err);
      // Last resort fallback using absolute number pattern if API fails
      // We don't have the absolute number here easily without another fetch,
      // so we'll just stop.
      set({ isPlaying: false });
    }
  },

  pause: () => {
    sound?.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    sound?.play();
    set({ isPlaying: true });
  },

  stop: () => {
    sound?.stop();
    set({ isPlaying: false, currentSurah: null, currentAyah: null });
  },

  setQari: (identifier) => {
    set({ currentQari: identifier });
    const { currentSurah, currentAyah } = get();
    if (currentSurah && currentAyah) {
      get().play(currentSurah, currentAyah);
    }
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
    sound?.rate(speed);
  },

  toggleRepeat: () => set(state => ({ isRepeatAyah: !state.isRepeatAyah })),

  setSeek: (seek) => {
    set({ seek });
    sound?.seek(seek);
  },

  setVolume: (vol) => {
    set({ volume: vol });
    sound?.volume(vol);
  },

  nextAyah: () => {
    const { currentSurah, currentAyah } = get();
    if (currentSurah && currentAyah) {
      // Logic for next ayah (needs to know surah length, simplified for now)
      get().play(currentSurah, currentAyah + 1);
    }
  },

  prevAyah: () => {
    const { currentSurah, currentAyah } = get();
    if (currentSurah && currentAyah && currentAyah > 1) {
      get().play(currentSurah, currentAyah - 1);
    }
  }
}));
