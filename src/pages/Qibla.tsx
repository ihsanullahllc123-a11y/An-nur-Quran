import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Qibla() {
  const navigate = useNavigate();
  const { location } = useAppStore();
  const [qiblaDir, setQiblaDir] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (location) {
      const qibla = calculateQibla(location.latitude, location.longitude);
      setQiblaDir(qibla);
    }

    const handler = (e: any) => {
      if (e.webkitCompassHeading) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setHeading(360 - e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [location]);

  function calculateQibla(lat: number, lng: number) {
    const kaabaLat = 21.4225 * Math.PI / 180;
    const kaabaLng = 39.8262 * Math.PI / 180;
    const myLat = lat * Math.PI / 180;
    const myLng = lng * Math.PI / 180;

    const y = Math.sin(kaabaLng - myLng);
    const x = Math.cos(myLat) * Math.tan(kaabaLat) - Math.sin(myLat) * Math.cos(kaabaLng - myLng);
    let qibla = Math.atan2(y, x) * 180 / Math.PI;
    return (qibla + 360) % 360;
  }

  return (
    <div className="p-5 flex flex-col h-[calc(100vh-80px)] bg-[#fcfdfa] overflow-hidden">
       <header className="flex justify-between items-center bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-emerald-50 mb-8">
        <button onClick={() => navigate('/')} className="p-2 text-emerald-700">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-emerald-950">Qibla Compass</h1>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Direction to Kaaba</p>
        </div>
        <button className="p-2 text-emerald-700">
          <Info size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-around">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center text-emerald-400 mb-2">
            <MapPin size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mecca is {Math.round(qiblaDir || 0)}° from North</span>
          </div>
          <div className="text-xs text-emerald-500 max-w-[200px] font-medium leading-relaxed">
            Rotate your phone until the Kaaba icon points straight up.
          </div>
        </div>

        {/* Compass Visual */}
        <div className="relative w-80 h-80">
          {/* Compass Ring */}
          <motion.div 
            style={{ rotate: -heading }}
            className="absolute inset-0 rounded-full border-2 border-emerald-100 flex items-center justify-center"
          >
            {[0, 90, 180, 270].map(deg => (
              <div 
                key={deg} 
                className="absolute font-bold text-emerald-300 text-xs tracking-tighter"
                style={{ transform: `rotate(${deg}deg) translateY(-145px)` }}
              >
                {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
              </div>
            ))}
            <div className="absolute inset-4 rounded-full border border-emerald-50 shadow-inner" />
          </motion.div>

          {/* Qibla Needle */}
          <motion.div 
            style={{ rotate: (qiblaDir || 0) - heading }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[280px] w-1 bg-gradient-to-t from-transparent via-amber-500 to-amber-500 rounded-full shadow-lg relative">
              <div className="absolute -top-4 -left-3.5 w-8 h-8 bg-white border-2 border-amber-500 rounded-lg flex items-center justify-center transform rotate-45 shadow-md">
                 <div className="absolute inset-1 bg-emerald-900 rounded-sm transform -rotate-45" />
              </div>
            </div>
          </motion.div>

          {/* Center Point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-900 rounded-full border-2 border-white shadow-md z-20" />
            <Compass size={40} className="text-emerald-100/20" />
          </div>
        </div>

        {/* Help */}
        <div className="bg-white border border-emerald-50 p-4 rounded-2xl flex items-center gap-3 shadow-sm max-w-xs transition-transform active:scale-95">
          <div className="bg-emerald-50 p-2 rounded-xl">
             <HelpCircle className="text-emerald-700" size={20} />
          </div>
          <p className="text-[10px] text-emerald-800 font-medium leading-normal italic">
            Calibrate your compass before use by moving your device in a figure-8 motion.
          </p>
        </div>
      </div>
    </div>
  );
}
