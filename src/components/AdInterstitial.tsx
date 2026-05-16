
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AdInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  isTest: boolean;
}

export default function AdInterstitial({ isOpen, onClose, adId, isTest }: AdInterstitialProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-6 text-white"
      >
        <div className="absolute top-4 left-4 flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Advertisement</span>
          <span className="text-[8px] font-bold opacity-30 tracking-tight">{adId}</span>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full max-w-sm aspect-[9/16] bg-stone-900 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
          <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
          
          <div className="p-8 space-y-6 bg-stone-800/80 backdrop-blur-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-xl">N</div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">An-Nur Quran</h3>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Sponsored Content</p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                {isTest 
                  ? "This is a Test Interstitial Ad for Google AdMob. Interrestial ads are shown between screen transitions."
                  : "Discover the best features of An-Nur Quran. Experience premium design with no distractions."}
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Learn More
            </button>
            <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest cursor-pointer hover:text-white/50 transition-colors" onClick={onClose}>
              Continue to App
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
