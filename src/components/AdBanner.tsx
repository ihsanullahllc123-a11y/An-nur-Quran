import { motion } from 'framer-motion';
import { getBannerId, ADMOB_CONFIG } from '../lib/admob';
import { useState, useEffect } from 'react';

export default function AdBanner({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const bannerId = getBannerId();

  useEffect(() => {
    // Simulate ad loading logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full bg-stone-50 dark:bg-stone-950 border-y border-stone-200/50 dark:border-stone-800/50 flex flex-col items-center justify-center min-h-[85px] py-3 ${className}`}>
      <div className="flex items-center gap-1.5 mb-2 opacity-50">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[7px] font-black text-stone-400 uppercase tracking-[0.2em]">
          {ADM_CONFIG.IS_TEST_MODE ? 'Test Ad Environment' : 'Islamic Community Ads'}
        </span>
      </div>

      <div className="w-full max-w-[320px] h-[50px] bg-white dark:bg-stone-900 rounded-xl flex items-center justify-center border border-stone-200 dark:border-stone-800 relative shadow-sm overflow-hidden group">
        {isLoading ? (
          <div className="flex bg-stone-100 dark:bg-stone-800/50 absolute inset-0 items-center justify-center gap-3">
             <div className="w-12 h-8 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
             <div className="flex-1 max-w-[120px] space-y-1">
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded w-full animate-pulse" />
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded w-2/3 animate-pulse" />
             </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-4 w-full h-full bg-emerald-500/[0.02]"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-black text-emerald-600 text-[10px]">AD</div>
            <div className="flex-1 text-left">
              <p className="text-[10px] font-bold text-stone-800 dark:text-stone-200 leading-tight">
                {ADM_CONFIG.IS_TEST_MODE 
                  ? "AdMob Test Banner Loaded"
                  : "Premium Islamic Content"}
              </p>
              <p className="text-[8px] font-medium text-stone-400 uppercase tracking-tighter truncate max-w-[180px]">
                {bannerId}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-1">
              <div className="bg-stone-100 dark:bg-stone-800 text-[6px] px-1 rounded-sm font-bold text-stone-400">Info</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const ADM_CONFIG = ADMOB_CONFIG;
