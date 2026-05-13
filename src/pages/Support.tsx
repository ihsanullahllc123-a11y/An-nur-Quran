import { motion } from 'framer-motion';
import { ChevronLeft, HandHeart, Copy, Check, Landmark, CreditCard, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../components/Logo';

const DonationMethod = ({ icon: Icon, title, account, name, details }: any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-emerald-500/10 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl">
            <Icon size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100">{title}</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{details}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl space-y-1">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Account Number / IBAN</p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-sm font-bold text-stone-800 dark:text-stone-200 tracking-wider break-all">{account}</p>
          <button 
            onClick={copyToClipboard}
            className="p-2 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 active:scale-90 transition-all text-emerald-600"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Account Title</p>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-200">{name}</p>
      </div>
    </div>
  );
};

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-5 py-4 border-b border-emerald-500/10 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground/70 hover:text-emerald-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Support An-Nur</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none mt-1">Sadaqah Jariya</p>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 pb-24">
        <section className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
              <HandHeart size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Invest in the Hereafter</h2>
              <p className="text-xs text-emerald-50/80 leading-relaxed font-light">
                An-Nur Quran is an independent mission to build the world's most premium & free Quran experience. Your support helps us maintain servers, add new features, and keep the app ad-supported or ad-free.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </section>

        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 px-2 flex items-center gap-2">
            Local Payments (Pakistan)
          </h2>
          <DonationMethod 
            icon={Wallet}
            title="Easypaisa / JazzCash"
            account="03705814905"
            name="IHSAN Ullah"
            details="Mobile Wallet"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 px-2 flex items-center gap-2">
            Bank Transfer
          </h2>
          <DonationMethod 
            icon={Landmark}
            title="Bank Al Habib"
            account="PK53BAHL2055098100228301"
            name="IHSAN ULLAH"
            details="Digital Banking"
          />
          <DonationMethod 
            icon={CreditCard}
            title="Bank Islami"
            account="316600074120001"
            name="Ihsan Ullah"
            details="Standard Savings"
          />
        </div>

        <section className="bg-stone-100 dark:bg-stone-900 rounded-3xl p-6 text-center">
          <div className="flex flex-col items-center gap-2 opacity-50">
            <Logo className="w-8 h-8 grayscale" />
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest leading-none">An-Nur Quran Team</p>
            <p className="text-[9px] text-stone-400 italic">May Allah accept your kindness</p>
          </div>
        </section>
      </main>
    </div>
  );
}
