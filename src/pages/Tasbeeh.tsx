import { useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RotateCcw, Hash, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

export default function Tasbeeh() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const controls = useAnimation();
  const navigate = useNavigate();

  const handleTap = useCallback(async () => {
    setCount(prev => (prev + 1) % 34);
    setTotal(prev => prev + 1);
    
    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    await controls.start({
      scale: [1, 0.9, 1],
      transition: { duration: 0.1 }
    });
  }, [controls]);

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="p-5 flex flex-col h-[calc(100vh-80px)] bg-[#fcfdfa] overflow-hidden">
      <header className="flex justify-between items-center bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-emerald-50 mb-8">
        <button onClick={() => navigate('/')} className="p-2 text-emerald-700">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-emerald-950">Tasbeeh Counter</h1>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Dhikr Al-Allah</p>
        </div>
        <button className="p-2 text-emerald-700">
          <SettingsIcon size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-around">
        {/* Total Stats */}
        <div className="text-center">
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em]">Session Total</span>
           <div className="text-4xl font-black text-emerald-900 tracking-tighter mt-1">{total}</div>
        </div>

        {/* The Big Button */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-emerald-50 scale-110 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-100 scale-125" />
          
          <motion.button
            animate={controls}
            onClick={handleTap}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-2xl flex flex-col items-center justify-center relative active:shadow-inner transition-shadow group overflow-hidden"
          >
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] scale-150" />
            
            <span className="text-[10px] text-emerald-200 uppercase tracking-[0.4em] font-bold mb-2 z-10">Subhan Allah</span>
            <span className="text-8xl font-black text-white tracking-tighter drop-shadow-lg z-10 tabular-nums">
              {count}
            </span>
            <div className="mt-4 w-12 h-1 bg-white/20 rounded-full z-10" />
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex gap-4 w-full px-12">
          <button 
            onClick={handleReset}
            className="flex-1 bg-white border border-emerald-100 p-4 rounded-2xl flex flex-col items-center gap-2 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <RotateCcw size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
          </button>
          <div 
            className="flex-1 bg-white border border-emerald-100 p-4 rounded-2xl flex flex-col items-center gap-2 text-emerald-700 shadow-sm"
          >
            <Hash size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{Math.floor(total / 33)} Sets</span>
          </div>
        </div>

        <AdBanner className="rounded-3xl mt-4" />
      </div>
    </div>
  );
}
