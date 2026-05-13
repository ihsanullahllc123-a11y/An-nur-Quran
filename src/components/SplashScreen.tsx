import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function SplashScreen({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5, ease: "easeInOut" }}
           className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8"
        >
          <div className="flex flex-col items-center gap-6">
            <Logo className="w-20 h-20" />
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl font-black text-stone-900 tracking-tight"
              >
                An-Nur Quran
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xs text-stone-500 font-bold uppercase tracking-[0.2em] mt-2"
              >
                Illuminating Your Journey
              </motion.p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-16 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="w-full h-full bg-emerald-500"
               />
            </div>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              Premium Islamic App
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
