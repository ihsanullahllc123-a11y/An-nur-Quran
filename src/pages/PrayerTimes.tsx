import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Navigation, Bell, Map as MapIcon, ChevronRight, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { getNextPrayer, getTimeRemaining, formatTime12h } from '../lib/prayerUtils';
import AdBanner from '../components/AdBanner';

export default function PrayerTimes() {
  const [loading, setLoading] = useState(true);
  const { location, setLocation, prayerTimes, setPrayerTimes, settings } = useAppStore();
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        (err) => {
          console.error(err);
          // Fallback to a default location (e.g., Mecca) if denied
          setLocation({ latitude: 21.4225, longitude: 39.8262 });
        }
      );
    }
  }, [location, setLocation]);

  useEffect(() => {
    if (location) {
      setLoading(true);
      const timestamp = Math.floor(Date.now() / 1000);
      const { prayerMethod, asrSchool } = settings;
      fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${location.latitude}&longitude=${location.longitude}&method=${prayerMethod}&school=${asrSchool}`)
        .then(res => res.json())
        .then(data => {
          setPrayerTimes(data.data.timings);
          // Try to get a human readable location name
          if (!location.city) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`)
              .then(res => res.json())
              .then(geo => {
                const city = geo.address.city || geo.address.town || geo.address.village || geo.address.suburb || "Unknown City";
                setLocation({ ...location, city });
              })
              .catch(() => {});
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [location, setPrayerTimes, setLocation, settings.prayerMethod, settings.asrSchool]);

  useEffect(() => {
    if (prayerTimes) {
      const updateNextPrayer = () => {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);
      };

      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const prayers = prayerNames.map(name => ({
    name,
    time: prayerTimes?.[name],
    isActive: nextPrayer?.name === name
  }));

  if (loading && !prayerTimes) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4 bg-background min-h-screen">
      <header className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-500">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h1>
            <div className="flex items-center gap-1 text-emerald-500 mt-1">
              <MapPin size={10} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{location?.city || "Current Location"}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((pos) => {
              setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            });
          }}
          className="bg-white/5 border border-emerald-500/10 p-2.5 rounded-xl text-emerald-500"
        >
          <Navigation size={20} />
        </button>
      </header>

      {/* Hero Card */}
      <div className="bg-emerald-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden h-44 flex flex-col justify-between group">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold">Up Next</span>
            <h2 className="text-3xl font-black mt-1 tracking-tight">{nextPrayer?.name || '...'}</h2>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => document.getElementById('prayer-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white/50"
          >
            <ChevronDown size={20} />
          </motion.button>
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <Clock size={16} className="text-emerald-300" />
            <span className="text-lg font-bold">{nextPrayer ? formatTime12h(nextPrayer.time) : '--:--'}</span>
          </div>
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg border border-emerald-400 text-xs font-bold flex items-center gap-2 whitespace-nowrap">
            {getTimeRemaining(nextPrayer)}
            <button 
              onClick={() => {
                setLoading(true);
                // Force re-fetch by clearing prayerTimes temporarily or just calling fetch again
                const timestamp = Math.floor(Date.now() / 1000);
                const { prayerMethod, asrSchool } = settings;
                fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${location?.latitude}&longitude=${location?.longitude}&method=${prayerMethod}&school=${asrSchool}`)
                  .then(res => res.json())
                  .then(data => {
                    setPrayerTimes(data.data.timings);
                    setLoading(false);
                  });
              }}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Prayer List */}
      <div id="prayer-list" className="grid gap-3 scroll-mt-24">
        {prayers.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "flex justify-between items-center p-5 rounded-2xl border transition-all duration-300",
              p.isActive ? "bg-emerald-500/10 border-emerald-500/20 shadow-sm" : "bg-white/5 border-emerald-500/5"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                p.isActive ? "bg-emerald-600 text-white" : "bg-emerald-500/10 text-emerald-500"
              )}>
                <Clock size={20} />
              </div>
              <div>
                <h3 className={cn("font-bold text-sm", p.isActive ? "text-emerald-500" : "text-foreground")}>
                  {p.name}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground tracking-tight">{p.time ? formatTime12h(p.time) : '--:--'}</span>
              <button className="text-emerald-500/30">
                <Bell size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nearby Mosques Link */}
      <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl flex justify-between items-center mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/10">
            <MapIcon className="text-amber-500" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-amber-500">Find Nearby Mosques</h3>
            <p className="text-xs text-amber-500/50">Find the nearest place to pray</p>
          </div>
        </div>
        <ChevronRight className="text-amber-500" />
      </div>

      <AdBanner className="rounded-3xl mt-4" />
    </div>
  );
}
