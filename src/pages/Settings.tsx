import { motion } from 'framer-motion';
import { User, Shield, Bell, Moon, Globe, Type, Trash2, Info, ChevronRight, LogIn, LogOut, Sparkles, Mic, Scale, School } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore, QARIS } from '../store/useAudioStore';
import { signInWithGoogle, logout } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PRAYER_METHODS } from '../lib/prayerUtils';

import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const { settings, setSettings, user } = useAppStore();
  const { currentQari, setQari } = useAudioStore();

  const activeQari = QARIS.find(q => q.identifier === currentQari);
  const activeMethod = PRAYER_METHODS.find(m => m.id === settings.prayerMethod);

  const sections = [
    {
      title: "Audio & Recitation",
      items: [
        { 
          icon: Mic, 
          label: "Selected Reciter", 
          value: activeQari?.englishName, 
          action: () => {
            const nextIdx = (QARIS.findIndex(q => q.identifier === currentQari) + 1) % QARIS.length;
            setQari(QARIS[nextIdx].identifier);
          } 
        },
      ]
    },
    {
      title: "Prayer Times",
      items: [
        { 
          icon: Scale, 
          label: "Calculation Method", 
          value: activeMethod?.name.substring(0, 20) + "...", 
          action: () => {
            const nextIdx = (PRAYER_METHODS.findIndex(m => m.id === settings.prayerMethod) + 1) % PRAYER_METHODS.length;
            setSettings({ prayerMethod: PRAYER_METHODS[nextIdx].id });
          } 
        },
        { 
          icon: School, 
          label: "Asr School", 
          value: settings.asrSchool === 0 ? "SHAFII/STANDARD" : "HANAFI", 
          action: () => {
            setSettings({ asrSchool: settings.asrSchool === 0 ? 1 : 0 });
          } 
        },
      ]
    },
    {
      title: "Reading Experience",
      items: [
        { 
          icon: Type, 
          label: "Font Size", 
          value: `${settings.fontSize}px`, 
          action: () => {
            const sizes = [16, 20, 24, 28, 32];
            const next = sizes[(sizes.indexOf(settings.fontSize) + 1) % sizes.length];
            setSettings({ fontSize: next });
          } 
        },
        { 
          icon: Globe, 
          label: "Translation", 
          value: settings.translation.split('.')[1]?.toUpperCase() || 'SAHIH', 
          action: () => {
            const translations = ['en.sahih', 'ur.ahmedali', 'tr.diyanet'];
            const next = translations[(translations.indexOf(settings.translation) + 1) % translations.length];
            setSettings({ translation: next });
          } 
        },
      ]
    },
    {
      title: "Appearance",
      items: [
        { 
          icon: Moon, 
          label: "Theme", 
          value: settings.theme.toUpperCase(), 
          action: () => {
            const themes: ('light' | 'dark' | 'amoled' | 'emerald')[] = ['light', 'dark', 'amoled', 'emerald'];
            const next = themes[(themes.indexOf(settings.theme) + 1) % themes.length];
            setSettings({ theme: next });
          } 
        },
      ]
    },
    {
      title: "System",
      items: [
        { icon: Bell, label: "Notifications", value: "Enabled", action: () => {} },
        { icon: Shield, label: "Privacy & Data", value: "", action: () => navigate('/privacy') },
        { icon: Trash2, label: "Clear Cache", value: "45MB", color: "text-red-500", action: () => {} },
      ]
    }
  ];

  return (
    <div className="p-5 flex flex-col gap-6 bg-background min-h-screen">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Configure your experience</p>
      </header>

      {/* Profile Card */}
      <section className="bg-white/5 border border-emerald-500/10 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4 text-center backdrop-blur-sm">
        {user ? (
          <>
            <img src={user.photoURL} alt={user.displayName} className="w-20 h-20 rounded-full border-4 border-emerald-500/20 shadow-md" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.displayName}</h2>
              <p className="text-xs text-emerald-500/70">{user.email}</p>
            </div>
            <button 
              onClick={logout}
              className="mt-2 flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500/30 border border-emerald-500/20">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Guest User</h2>
              <p className="text-xs text-emerald-500/70">Sign in to sync your progress</p>
            </div>
            <button 
              onClick={signInWithGoogle}
              className="mt-2 flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
            >
              <LogIn size={18} /> Sign in with Google
            </button>
          </>
        )}
      </section>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/50">{section.title}</h3>
            <div className="bg-white/5 border border-emerald-500/10 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center justify-between p-4 hover:bg-emerald-500/5 transition-colors text-left",
                    i !== section.items.length - 1 && "border-b border-emerald-500/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-emerald-500/10", item.color || "text-emerald-500")}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-semibold text-foreground/90">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-xs font-bold text-emerald-500/50 uppercase tracking-wider">{item.value}</span>}
                    <ChevronRight size={16} className="text-emerald-500/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex items-center gap-2 text-emerald-200">
           <Sparkles size={20} />
           <span className="font-arabic text-xl">An-Nur</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Version 1.0.0 (Premium)</p>
          <p className="text-[10px] text-emerald-200 mt-1">Made with barakah for the Ummah</p>
        </div>
      </div>
    </div>
  );
}
