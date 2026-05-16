import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Map, Compass, Hash, Calendar, Heart, LayoutGrid, Sparkles, ChevronRight, Clock, MapPin, HandHeart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { getNextPrayer, getTimeRemaining, formatTime12h } from '../lib/prayerUtils';
import { cn } from '../lib/utils';
import Logo from '../components/Logo';
import { ReciterHeader, ReciterDialog } from '../components/ReciterSelection';
import AdBanner from '../components/AdBanner';

const DashboardCard = ({ icon: Icon, title, to, color = "bg-emerald-50" }: any) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${color} p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border border-emerald-100 shadow-sm transition-shadow hover:shadow-md h-full`}
    >
      <div className="bg-white p-2.5 rounded-xl shadow-sm">
        <Icon className="text-emerald-700" size={20} />
      </div>
      <span className="text-xs font-semibold text-emerald-900 tracking-tight text-center">{title}</span>
    </motion.div>
  </Link>
);

export default function Home() {
  const { progress, prayerTimes, setPrayerTimes, location, setLocation, user, settings } = useAppStore();
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const [curTime, setCurTime] = useState(new Date());
  const today = new Date();

  useEffect(() => {
    const timer = setInterval(() => setCurTime(new Date()), 1000);
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
          // Fallback to a default location (e.g., Mecca)
          if (!location) setLocation({ latitude: 21.4225, longitude: 39.8262 });
        }
      );
    }
  }, [location, setLocation]);

  useEffect(() => {
    if (location && !prayerTimes) {
      const timestamp = Math.floor(Date.now() / 1000);
      const { prayerMethod, asrSchool } = settings;
      fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${location.latitude}&longitude=${location.longitude}&method=${prayerMethod}&school=${asrSchool}`)
        .then(res => res.json())
        .then(data => {
          setPrayerTimes(data.data.timings);
          if (!location.city) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`)
              .then(res => res.json())
              .then(geo => {
                const city = geo.address.city || geo.address.town || geo.address.village || geo.address.suburb || "Unknown City";
                setLocation({ ...location, city });
              })
              .catch(() => {});
          }
        })
        .catch(console.error);
    }
  }, [location, prayerTimes, setPrayerTimes, settings.prayerMethod, settings.asrSchool]);

  useEffect(() => {
    if (prayerTimes) {
      const updateNext = () => {
        setNextPrayer(getNextPrayer(prayerTimes));
      };
      updateNext();
      const id = setInterval(updateNext, 60000);
      return () => clearInterval(id);
    }
  }, [prayerTimes]);

  return (
    <div className="p-5 flex flex-col gap-5 bg-background min-h-screen">
      {/* Premium Header Section - More compact as requested */}
      <section className="relative h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="relative z-10 p-5 flex flex-col justify-between h-full text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
               {user?.photoURL ? (
                 <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 overflow-hidden shadow-sm">
                   <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                 </div>
               ) : (
                 <Logo className="w-10 h-10" />
               )}
               <div>
                  <h1 className="text-lg font-bold tracking-tight">
                    {user?.displayName ? `Salam, ${user.displayName.split(' ')[0]}` : 'An-Nur Quran'}
                  </h1>
                  <div className="flex items-center gap-1 opacity-70">
                    <MapPin size={10} className="text-emerald-400" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">{location?.city || "Finding location..."}</p>
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-end">
               <p className="text-emerald-100 text-base font-bold leading-none">
                 {curTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
               <p className="text-emerald-200 text-[8px] opacity-70 mt-0.5 uppercase tracking-tighter">Live Time</p>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <span className="text-xs font-medium">{format(today, 'EEEE, d MMMM')}</span>
            </div>
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400 blur-[80px] opacity-20" />
      </section>

      {/* Continue Reading Section */}
      <section className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 rounded-3xl p-4 border border-amber-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600">Continue Reading</h2>
              {progress ? (
                <p className="text-foreground/70 text-xs mt-1">Surah {progress.surahNumber}, Ayah {progress.ayahNumber}</p>
              ) : (
                <p className="text-foreground/70 text-xs mt-1">Start your journey today</p>
              )}
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-amber-500/20">
              <BookOpen className="text-amber-500" size={18} />
            </div>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/quran" 
              state={{ 
                resumeSurah: progress?.surahNumber || 1,
                resumeAyah: progress?.ayahNumber || 1
              }} 
              className="flex-1 bg-amber-600 text-white py-2.5 px-3 rounded-xl text-center text-xs font-bold shadow-lg shadow-amber-600/20 active:scale-95 transition-transform"
            >
              {progress ? 'Resume Quran' : 'Start Reading'}
            </Link>
          </div>
        </div>
      </section>
 
      {/* Dashboard Grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 px-1">Menu</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <DashboardCard icon={BookOpen} title="Quran Index" to="/quran" color="bg-emerald-500/5" />
          <DashboardCard icon={LayoutGrid} title="Juzz Index" to="/juzz" color="bg-amber-500/5" />
          <DashboardCard icon={Compass} title="Qibla" to="/qibla" color="bg-emerald-500/5" />
          <DashboardCard icon={Clock} title="Prayer Times" to="/prayer-times" color="bg-emerald-500/5" />
          <DashboardCard icon={Hash} title="Tasbeeh" to="/tasbeeh" color="bg-emerald-500/5" />
          <DashboardCard icon={Sparkles} title="An-Nur AI" to="/ai" color="bg-indigo-500/5" />
        </div>
      </section>

      {/* Sadaqah Jariya Support Banner */}
      <section className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <HandHeart size={20} className="text-emerald-300" />
            <h2 className="text-lg font-bold">Sadaqah Jariya</h2>
          </div>
          <p className="text-emerald-100/80 text-xs font-light leading-relaxed">
            Support the ongoing development of An-Nur Quran and earn perpetual rewards. Your contribution helps us keep this app free & premium for the Ummah.
          </p>
          <Link to="/support" className="mt-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl inline-flex items-center justify-center text-xs font-bold uppercase tracking-widest transition-colors border border-white/20 w-fit">
            Support Project <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </section>

      <AdBanner className="rounded-[2.5rem] mt-2 shadow-sm border border-emerald-500/5 bg-emerald-500/5" />
    </div>
  );
}
