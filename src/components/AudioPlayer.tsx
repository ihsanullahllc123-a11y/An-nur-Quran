import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Repeat, Volume2, X, ChevronUp, ChevronDown, 
  FastForward, Rewind, ListMusic, Timer, Info
} from 'lucide-react';
import { useAudioStore, QARIS } from '../store/useAudioStore';
import { cn } from '../lib/utils';

export default function AudioPlayer() {
  const { 
    isPlaying, currentSurah, currentAyah, currentQari, 
    playbackSpeed, isRepeatAyah, seek, duration,
    play, pause, resume, stop, setQari, setPlaybackSpeed, 
    toggleRepeat, setSeek, nextAyah, prevAyah 
  } = useAudioStore();

  const [isFull, setIsFull] = useState(false);
  const activeQari = QARIS.find(q => q.identifier === currentQari);

  if (!currentSurah) return null;

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <AnimatePresence>
      {/* Mini Player */}
      {!isFull && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-20 left-4 right-4 bg-background/95 backdrop-blur-xl border border-emerald-500/10 rounded-2xl p-3 shadow-2xl z-40 flex items-center justify-between"
          onClick={() => setIsFull(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600">{currentSurah}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground truncate max-w-[120px]">Ayah {currentAyah}</p>
              <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{activeQari?.englishName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); prevAyah(); }}
              className="p-2 text-foreground/50 hover:text-emerald-500"
            >
              <SkipBack size={18} />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                isPlaying ? pause() : resume(); 
              }}
              className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextAyah(); }}
              className="p-2 text-foreground/50 hover:text-emerald-500"
            >
              <SkipForward size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); stop(); }}
              className="p-2 text-red-500/50 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar Mini */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-emerald-500"
               initial={false}
               animate={{ width: `${(seek / duration) * 100}%` }}
             />
          </div>
        </motion.div>
      )}

      {/* Full Player Overlay */}
      {isFull && (
        <motion.div 
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          className="fixed inset-0 bg-background z-50 flex flex-col p-8 pb-12"
        >
          <header className="flex justify-between items-center mb-12">
            <button onClick={() => setIsFull(false)} className="p-2 -ml-2 text-foreground/70">
              <ChevronDown size={28} />
            </button>
            <div className="text-center">
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Now Reciting</p>
              <h2 className="text-lg font-black text-foreground">Surah {currentSurah}</h2>
            </div>
            <button className="p-2 text-foreground/70"><Info size={22} /></button>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center gap-12">
            {/* Artwork/Visualization */}
            <div className="relative w-64 h-64 flex items-center justify-center">
               <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-emerald-500/10 bg-gradient-to-tr from-emerald-500/10 to-transparent"
               />
               <div className="w-48 h-48 bg-white/5 border border-emerald-500/20 rounded-full flex flex-col items-center justify-center shadow-inner relative">
                  <span className="text-5xl font-black text-emerald-600/20">{currentSurah}</span>
                  <div className="absolute inset-0 flex items-center justify-center rotate-45">
                    <div className="w-full h-[1px] bg-emerald-500/5" />
                    <div className="h-full w-[1px] bg-emerald-500/5" />
                  </div>
               </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-foreground">Ayah {currentAyah}</h3>
              <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/10">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{activeQari?.englishName}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full space-y-8">
              {/* Slider */}
              <div className="space-y-3">
                <div className="relative h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden cursor-pointer">
                  <motion.div 
                    className="absolute inset-0 h-full bg-emerald-500"
                    initial={false}
                    animate={{ width: `${(seek / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-1">
                  <span>{formatTime(seek)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between px-4">
                <button 
                  onClick={toggleRepeat}
                  className={cn(
                    "p-3 rounded-xl transition-colors",
                    isRepeatAyah ? "text-emerald-500 bg-emerald-500/10" : "text-foreground/30"
                  )}
                >
                  <Repeat size={20} />
                </button>
                <div className="flex items-center gap-6">
                  <button onClick={prevAyah} className="p-3 text-foreground/70 active:scale-90 transition-transform"><SkipBack size={28} fill="currentColor" /></button>
                  <button 
                    onClick={() => isPlaying ? pause() : resume()}
                    className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/30 active:scale-95 transition-transform"
                  >
                    {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} className="ml-1" fill="currentColor" />}
                  </button>
                  <button onClick={nextAyah} className="p-3 text-foreground/70 active:scale-90 transition-transform"><SkipForward size={28} fill="currentColor" /></button>
                </div>
                <button className="p-3 text-foreground/30"><ListMusic size={20} /></button>
              </div>

              <div className="flex items-center justify-center gap-8 py-4 px-8 bg-white/5 rounded-3xl border border-emerald-500/10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                    className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-foreground/50 hover:text-emerald-500 transition-colors"><Timer size={20} /></button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-foreground/50 hover:text-emerald-500 transition-colors"><Volume2 size={20} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Qari Selector */}
          <div className="mt-8 space-y-4">
             <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-1">Selected Reciter</p>
             <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {QARIS.map(q => (
                  <button
                    key={q.identifier}
                    onClick={() => setQari(q.identifier)}
                    className={cn(
                      "flex-shrink-0 px-5 py-3 rounded-2xl border text-xs font-bold transition-all",
                      currentQari === q.identifier 
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-lg" 
                        : "bg-white/5 text-foreground/50 border-emerald-500/10"
                    )}
                  >
                    {q.englishName}
                  </button>
                ))}
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
