import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronLeft, Volume2, Bookmark, Type, Menu, ArrowRight, Play, Pause, Hash } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore } from '../store/useAudioStore';
import AudioPlayer from '../components/AudioPlayer';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function QuranReader() {
  const location = useLocation();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'reader'>('list');
  const [readerStyle, setReaderStyle] = useState<'translation' | 'mushaf'>('translation');
  const { settings, setProgress } = useAppStore();
  const { currentAyah, currentSurah, isPlaying, play, pause, resume } = useAudioStore();

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);

        // Check for resume state from home page
        if (location.state?.resumeSurah) {
          handleSurahClick(location.state.resumeSurah, location.state.resumeAyah);
        }
      });
  }, [location.state]);

  const handleSurahClick = async (num: number, targetAyah?: number) => {
    setLoading(true);
    setSelectedSurah(num);
    const audioEdition = settings.reciter || 'ar.alafasy';
    const translationEdition = settings.translation || 'en.sahih';
    
    try {
      const editions = readerStyle === 'mushaf' ? 'quran-uthmani' : `quran-uthmani,${translationEdition}`;
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/${editions},${audioEdition}`);
      const data = await res.json();
      setSurahData(data.data);
      setViewMode('reader');

      // Update progress when surah is opened
      const surahInfo = surahs.find(s => s.number === num);
      if (surahInfo) {
        setProgress({
          surahNumber: num,
          ayahNumber: targetAyah || 1,
          pageNumber: 1, // Simplified
          timestamp: Date.now()
        });
      }

      // Scroll to ayah if provided
      if (targetAyah) {
        setTimeout(() => {
          const element = document.getElementById(`ayah-${num}-${targetAyah}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAyahClick = (ayahNum: number) => {
    setProgress({
      surahNumber: selectedSurah!,
      ayahNumber: ayahNum,
      pageNumber: 1,
      timestamp: Date.now()
    });
  };

  const isAyahActive = (surahNum: number, ayahNum: number) => {
    return currentSurah === surahNum && currentAyah === ayahNum;
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString() === search
  );

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 flex flex-col gap-6"
          >
            {/* Index Header */}
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Al-Quran</h1>
                <p className="text-xs text-emerald-500 font-medium tracking-wide">The Holy Book</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setReaderStyle(prev => prev === 'translation' ? 'mushaf' : 'translation')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border",
                    readerStyle === 'mushaf' ? "bg-emerald-700 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-100"
                  )}
                >
                  {readerStyle === 'mushaf' ? '16-Line Mushaf' : 'Translation Mode'}
                </button>
              </div>
            </header>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
              <input 
                type="text"
                placeholder="Search Surah (e.g. Al-Fatihah)"
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 shadow-sm text-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Surah List */}
            {loading ? (
              <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-700"></div>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredSurahs.map((s) => (
                  <motion.div
                    key={s.number}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSurahClick(s.number)}
                    className="flex justify-between items-center p-4 bg-white border border-emerald-50 rounded-2xl shadow-sm cursor-pointer hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-700 flex items-center justify-center rounded-xl text-white font-bold transform rotate-45">
                        <span className="transform -rotate-45">{s.number}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900">{s.englishName}</h3>
                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-semibold">{s.revelationType} • {s.numberOfAyahs} Ayahs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-arabic text-xl text-emerald-800 leading-tight">{s.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen"
          >
            {/* Reader Header */}
            <header className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-emerald-200/20 px-4 py-3 z-30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewMode('list')}
                  className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors text-foreground"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-left">
                  <h2 className="font-bold text-foreground text-sm">{surahData?.[0].englishName}</h2>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest leading-none">
                    {readerStyle === 'mushaf' ? 'Indo-Pak 16 Line' : 'Translation Mode'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setReaderStyle(prev => prev === 'translation' ? 'mushaf' : 'translation')}
                  className="p-2 text-emerald-600 bg-emerald-500/10 rounded-xl"
                >
                  <Type size={18} />
                </button>
                <button className="p-2 text-emerald-600 bg-emerald-500/10 rounded-xl"><Bookmark size={18} /></button>
              </div>
            </header>

            {/* Quran Text */}
            <div className={cn(
              "p-6 pb-48 space-y-8",
              readerStyle === 'mushaf' && "bg-[#fffdf8] font-arabic"
            )}>
              {/* Bismillah */}
              {selectedSurah !== 1 && selectedSurah !== 9 && (
                <div className="text-center mb-8">
                   <h2 className="font-arabic text-3xl text-emerald-900 py-6 border-b border-emerald-100/50">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
                </div>
              )}

              {readerStyle === 'mushaf' ? (
                /* 16 Line Style Mushaf Layout */
                <div className="flex flex-wrap justify-end gap-x-2 gap-y-6 dir-rtl text-right">
                  {surahData?.[0].ayahs.map((ayah: any) => (
                    <span 
                      key={ayah.number} 
                      id={`ayah-${selectedSurah}-${ayah.numberInSurah}`}
                      onClick={() => {
                        handleAyahClick(ayah.numberInSurah);
                        play(selectedSurah!, ayah.numberInSurah);
                      }}
                      className={cn(
                        "inline text-3xl leading-[1.8] text-foreground tracking-wide text-right cursor-pointer rounded-lg px-1 transition-colors",
                        isAyahActive(selectedSurah!, ayah.numberInSurah) ? "bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "hover:bg-emerald-500/5"
                      )}
                    >
                      {ayah.text} 
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50/50 text-[10px] font-bold text-emerald-700 mx-2 transform translate-y-[-2px]">
                        {ayah.numberInSurah}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                /* Translation Mode Layout */
                surahData?.[0].ayahs.map((ayah: any, index: number) => (
                  <div 
                    key={ayah.number} 
                    id={`ayah-${selectedSurah}-${ayah.numberInSurah}`}
                    onClick={() => handleAyahClick(ayah.numberInSurah)}
                    className={cn(
                      "group flex flex-col gap-6 p-4 rounded-3xl transition-all",
                      isAyahActive(selectedSurah!, ayah.numberInSurah) ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-emerald-500/5 border border-transparent"
                    )}
                  >
                    {/* Arabic Text */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                         <span className="w-8 h-8 rounded-full border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                          {ayah.numberInSurah}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => isAyahActive(selectedSurah!, ayah.numberInSurah) && isPlaying ? pause() : play(selectedSurah!, ayah.numberInSurah)}
                            className="p-2 text-emerald-600 hover:bg-emerald-500/20 rounded-xl transition-all"
                          >
                            {isAyahActive(selectedSurah!, ayah.numberInSurah) && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                          </button>
                          <button className="p-1.5 text-emerald-400 hover:text-emerald-700"><Bookmark size={16} /></button>
                        </div>
                      </div>
                      <p className="font-arabic text-3xl leading-[2] text-right text-foreground antialiased font-medium tracking-tight">
                        {ayah.text}
                      </p>
                    </div>
                    
                    {/* Translation */}
                    {surahData[1] && (
                      <div className="bg-emerald-500/5 p-4 rounded-2xl border-l-2 border-emerald-500/30">
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                          {surahData[1].ayahs[index].text}
                        </p>
                      </div>
                    )}
                    
                    {/* Divider */}
                    {!isAyahActive(selectedSurah!, ayah.numberInSurah) && (
                      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent w-full" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
