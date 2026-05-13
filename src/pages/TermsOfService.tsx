import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, ScrollText, Gavel, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-5 py-4 border-b border-emerald-500/10 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground/70 hover:text-emerald-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Terms of Service</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none mt-1">An-Nur Quran</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-24">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <ScrollText size={20} />
            <h2 className="font-bold text-lg">1. Acceptance of Terms</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing and using An-Nur Quran ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck size={20} />
            <h2 className="font-bold text-lg">2. User Content & Privacy</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect and use your data. The App is designed to be used primarily for personal spiritual growth and educational purposes.
          </p>
        </section>

        <section className="space-y-4">
           <div className="flex items-center gap-2 text-emerald-600">
            <Gavel size={20} />
            <h2 className="font-bold text-lg">3. Prohibited Use</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may not use the App for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the App. Modification, reverse engineering, or redistribution of the App's source code or assets is strictly prohibited.
          </p>
        </section>

        <section className="space-y-4">
           <div className="flex items-center gap-2 text-emerald-600">
            <Scale size={20} />
            <h2 className="font-bold text-lg">4. Disclaimer of Warranty</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The App is provided "as is" without any warranties, express or implied. While we strive for accuracy in Quranic text, translations, and prayer times, users are encouraged to verify critical information with local scholars and mosques.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-lg">5. Changes to Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to modify these terms at any time. Your continued use of the App following any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <div className="pt-8 border-t border-emerald-500/10 text-center">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Last Updated: May 2026</p>
          <p className="text-xs text-muted-foreground/60 px-4">
            If you have any questions regarding these terms, please contact us.
          </p>
        </div>
      </main>
    </div>
  );
}
