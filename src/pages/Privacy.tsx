import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Data We Collect",
      icon: Eye,
      content: "We only collect minimal data required for your experience, such as your display name, profile photo (if signed in), and application settings stored locally on your device."
    },
    {
      title: "How We Use Your Data",
      icon: FileText,
      content: "Your data is used to provide features like bookmarking, progress tracking, and personalized Quran reading experiences. We do not sell or share your personal information with third parties."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "We use industry-standard security measures provided by Firebase (Google) to protect your authenticated session and stored data."
    },
    {
      title: "Your Choices",
      icon: CheckCircle2,
      content: "You can clear your local data at any time from the Settings menu. Signing out will remove your session from the device."
    }
  ];

  return (
    <div className="p-5 flex flex-col gap-6 bg-background min-h-screen">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')} 
          className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors text-emerald-600"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none mt-1">An-Nur Quran</p>
        </div>
      </header>

      <div className="bg-emerald-600/5 p-6 rounded-3xl border border-emerald-500/10 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-600">
          <Shield size={32} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Your Privacy Matters</h2>
          <p className="text-sm text-muted-foreground">We are committed to protecting your data and providing a secure platform for your spiritual journey.</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white/5 border border-emerald-500/10 rounded-3xl backdrop-blur-sm shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <section.icon size={20} />
              </div>
              <h3 className="font-bold text-foreground">{section.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <footer className="mt-auto py-8 text-center space-y-4">
        <div className="flex justify-center gap-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          <button onClick={() => navigate('/terms')} className="hover:underline">Terms of Service</button>
          <span>•</span>
          <p className="">Last Updated: May 2026</p>
        </div>
        <p className="text-xs text-muted-foreground/60 px-8">
          By using An-Nur Quran, you agree to our terms of service and this privacy policy. 
          If you have any questions, please contact us through our official channels.
        </p>
      </footer>
    </div>
  );
}
