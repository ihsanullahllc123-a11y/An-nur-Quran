import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check, X, Search } from 'lucide-react';
import { useAudioStore, QARIS, Qari } from '../store/useAudioStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

export function ReciterHeader({ onOpen }: { onOpen: () => void }) {
  const { currentQari } = useAudioStore();
  const activeQari = QARIS.find(q => q.identifier === currentQari) || QARIS[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="mx-4 mb-6 p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-3xl border border-emerald-500/10 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
          {activeQari.englishName.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-0.5">Current Reciter</p>
          <h3 className="font-black text-lg tracking-tight text-foreground">{activeQari.englishName}</h3>
        </div>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <ChevronRight size={20} />
      </div>
    </motion.div>
  );
}

export function ReciterDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentQari, setQari } = useAudioStore();
  const [search, setSearch] = useState('');

  const filteredQaris = QARIS.filter(q => 
    q.englishName.toLowerCase().includes(search.toLowerCase()) || 
    q.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[101] bg-background rounded-t-[3rem] border-t border-emerald-500/20 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mx-auto mt-4 mb-2" />
            
            <header className="px-8 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight">Select Reciter</h2>
                <button onClick={onClose} className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search 20 world famous Qaris..." 
                  className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
              <div className="space-y-3">
                {filteredQaris.map((q) => (
                  <button
                    key={q.identifier}
                    onClick={() => {
                      setQari(q.identifier);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-[0.98]",
                      currentQari === q.identifier 
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" 
                        : "bg-white/5 border-emerald-500/5 hover:border-emerald-500/20"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 transition-colors",
                      currentQari === q.identifier 
                        ? "bg-white text-emerald-500" 
                        : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {q.englishName.charAt(0)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-black text-base truncate">{q.englishName}</h4>
                      <p className={cn(
                        "text-[10px] uppercase font-bold tracking-widest truncate", 
                        currentQari === q.identifier ? "text-white/70" : "text-emerald-500/50"
                      )}>
                        {q.origin}
                      </p>
                    </div>
                    {currentQari === q.identifier && (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
                
                {filteredQaris.length === 0 && (
                  <div className="py-20 text-center opacity-30">
                    <Search size={48} className="mx-auto mb-4" />
                    <p className="font-bold">No reciter found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
