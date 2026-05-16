import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Bell, Moon, Globe, Type, Trash2, Info, ChevronRight, ChevronDown, LogIn, LogOut, Sparkles, Mic, Scale, School, ScrollText, HandHeart, MessageCircle, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAudioStore, QARIS } from '../store/useAudioStore';
import { signInWithGoogle, logout } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PRAYER_METHODS } from '../lib/prayerUtils';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import AdBanner from '../components/AdBanner';
import SelectionOverlay from '../components/SelectionOverlay';

const TRANSLATIONS = [
  { id: 'en.sahih', name: 'English', detail: 'Sahih International' },
  { id: 'ur.ahmedali', name: 'Urdu', detail: 'Ahmed Ali' },
  { id: 'ur.jalandhry', name: 'Urdu', detail: 'Fateh Muhammad Jalandhry' },
  { id: 'hi.hindi', name: 'Hindi', detail: 'Suhel Farooq Khan' },
  { id: 'bn.bengali', name: 'Bengali', detail: 'Zohurul Hoque' },
  { id: 'tr.diyanet', name: 'Turkish', detail: 'Diyanet Isleri' },
  { id: 'fr.hamidullah', name: 'French', detail: 'Muhammad Hamidullah' },
  { id: 'de.aburida', name: 'German', detail: 'Abu Rida' },
  { id: 'es.asad', name: 'Spanish', detail: 'Muhammad Asad' },
  { id: 'ru.kuliev', name: 'Russian', detail: 'Elmir Kuliev' },
  { id: 'id.indonesian', name: 'Indonesian', detail: 'Bahasa Indonesia' },
  { id: 'my.melayu', name: 'Malay', detail: 'Basmeih' },
  { id: 'zh.jian', name: 'Chinese', detail: 'Ma Jian' },
  { id: 'fa.ghomshei', name: 'Persian', detail: 'Mahdi Elahi Ghomshei' },
  { id: 'it.piccardo', name: 'Italian', detail: 'Hamza Roberto Piccardo' },
  { id: 'nl.siregar', name: 'Dutch', detail: 'Sofian S. Siregar' },
  { id: 'sv.bernstrom', name: 'Swedish', detail: 'Kanut Bernström' },
  { id: 'no.berg', name: 'Norwegian', detail: 'Einar Berg' },
  { id: 'pl.bielawski', name: 'Polish', detail: 'Józef Bielawski' },
  { id: 'pt.nasr', name: 'Portuguese', detail: 'Helmy Nasr' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { settings, setSettings, user } = useAppStore();
  const { currentQari, setQari } = useAudioStore();
  const [selectionData, setSelectionData] = useState<{
    isOpen: boolean;
    title: string;
    options: any[];
    selectedValue: any;
    onSelect: (val: any) => void;
    showSearch?: boolean;
  }>({
    isOpen: false,
    title: "",
    options: [],
    selectedValue: "",
    onSelect: () => {},
    showSearch: false
  });

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const [cacheSize, setCacheSize] = useState("Calculating...");

  useEffect(() => {
    // Sync with localStorage preference if needed, but primary is browser permission
    const savedPermission = localStorage.getItem('annur_notifications');
    if (savedPermission === 'granted' && Notification.permission === 'default') {
      // We can't actually force it granted from storage, but we can track intent
    }
  }, []);

  useEffect(() => {
    // Basic cache size estimation
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        if (estimate.usage) {
          const mb = (estimate.usage / (1024 * 1024)).toFixed(1);
          setCacheSize(`${mb} MB`);
        } else {
          setCacheSize("0 MB");
        }
      });
    } else {
      setCacheSize("Unknown");
    }
  }, []);

  const handleRequestNotifications = () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then(permission => {
      setNotifPermission(permission);
      localStorage.setItem('annur_notifications', permission);
      
      if (permission === 'granted') {
        new Notification("An-Nur Quran", {
          body: "BarakAllah! Notifications are now enabled.",
          icon: "/icon-192.png"
        });
      } else if (permission === 'denied') {
        alert("Notifications are blocked by your browser settings. Please enable them to receive prayer alerts.");
      }
    });
  };

  const handleClearCache = async () => {
    if (!window.confirm("Are you sure you want to clear all cached data? This will remove offline Quran pages, audio, and reset your local settings.")) {
      return;
    }

    try {
      // 1. Clear Storage
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 2. Clear Service Worker Caches
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }

      // 3. Reset UI state immediately
      setCacheSize("0.0 MB");
      
      alert("Cache cleared successfully! Re-syncing app state...");
      
      // 4. Reload after 1 second as requested
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Failed to clear cache:", err);
      alert("An error occurred while clearing the cache.");
    }
  };

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
          action: () => setSelectionData({
            isOpen: true,
            title: "Select Reciter",
            options: QARIS.map(q => ({ id: q.identifier, name: q.englishName, detail: q.origin })),
            selectedValue: currentQari,
            onSelect: (id) => setQari(id),
            showSearch: true
          })
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
          action: () => setSelectionData({
            isOpen: true,
            title: "Calculation Method",
            options: PRAYER_METHODS.map(m => ({ id: m.id, name: m.name })),
            selectedValue: settings.prayerMethod,
            onSelect: (id) => setSettings({ prayerMethod: id }),
            showSearch: false
          })
        },
        { 
          icon: School, 
          label: "Asr School", 
          value: settings.asrSchool === 0 ? "SHAFII/STANDARD" : "HANAFI", 
          action: () => setSelectionData({
            isOpen: true,
            title: "Asr Jurisprudence",
            options: [
              { id: 0, name: "Shafii (Standard)" },
              { id: 1, name: "Hanafi" }
            ],
            selectedValue: settings.asrSchool,
            onSelect: (id) => setSettings({ asrSchool: id }),
            showSearch: false
          })
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
          action: () => setSelectionData({
            isOpen: true,
            title: "Font Size",
            options: [16, 20, 24, 28, 32].map(s => ({ id: s, name: `${s}px` })),
            selectedValue: settings.fontSize,
            onSelect: (id) => setSettings({ fontSize: id }),
            showSearch: false
          })
        },
        { 
          icon: Globe, 
          label: "Translation", 
          value: settings.translation.split('.')[1]?.toUpperCase() || 'SAHIH', 
          action: () => setSelectionData({
            isOpen: true,
            title: "Quran Translation",
            options: TRANSLATIONS,
            selectedValue: settings.translation,
            onSelect: (id) => setSettings({ translation: id }),
            showSearch: true
          })
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
          action: () => setSelectionData({
            isOpen: true,
            title: "Select Theme",
            options: [
              { id: 'light', name: 'LIGHT ☀️' },
              { id: 'dark', name: 'DARK 🌙' },
              { id: 'amoled', name: 'AMOLED ⚫' },
              { id: 'emerald', name: 'EMERALD 🌿' }
            ],
            selectedValue: settings.theme,
            onSelect: (id) => setSettings({ theme: id }),
            showSearch: false
          })
        },
      ]
    },
    {
      title: "System",
      items: [
        { icon: HandHeart, label: "Support Project", value: "Sadaqah Jariya", color: "text-amber-500", action: () => navigate('/support') },
        { 
          icon: Bell, 
          label: "Notifications", 
          value: notifPermission === 'granted' ? "ENABLED" : (notifPermission === 'denied' ? "BLOCKED" : "DISABLED"), 
          action: handleRequestNotifications 
        },
        { icon: Shield, label: "Privacy Policy", value: "", action: () => navigate('/privacy') },
        { icon: ScrollText, label: "Terms of Service", value: "", action: () => navigate('/terms') },
        { 
          icon: Trash2, 
          label: "Clear Cache", 
          value: cacheSize, 
          color: "text-red-500", 
          action: handleClearCache 
        },
      ]
    },
    {
      title: "Support & Feedback",
      items: [
        { 
          icon: MessageCircle, 
          label: "WhatsApp Support", 
          value: "03705814905", 
          color: "text-emerald-500", 
          action: () => window.open('https://wa.me/923705814905', '_blank') 
        },
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
        <SelectionOverlay 
          {...selectionData} 
          onClose={() => setSelectionData(prev => ({ ...prev, isOpen: false }))} 
        />

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
        <div className="flex items-center gap-2">
           <Logo className="w-8 h-8" />
           <span className="font-bold text-lg text-foreground">An-Nur Quran</span>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Version 1.2.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">Made with barakah for the Ummah</p>
        </div>

        <div className="w-full max-w-[320px] mx-auto mt-6 pb-12">
          <AdBanner className="rounded-2xl shadow-sm border border-emerald-500/5 bg-emerald-500/5" />
        </div>
      </div>
    </div>
  );
}
