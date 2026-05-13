import { motion } from 'framer-motion';

export default function AdBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-1 flex flex-col items-center justify-center min-h-[60px] overflow-hidden ${className}`}>
      <div className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Advertisement</div>
      <div className="w-full max-w-sm h-[50px] bg-stone-200 dark:bg-stone-800 rounded flex items-center justify-center border-2 border-dashed border-stone-300 dark:border-stone-700">
        <motion.p 
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-bold text-stone-500 uppercase tracking-tighter"
        >
          Google AdMob Placeholder
        </motion.p>
      </div>
    </div>
  );
}
