import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const DUAS = [
  {
    id: 1,
    title: "Morning Dua",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    translation: "We have entered a new day and with it all dominion is Allah's. All praise is to Allah. There is none worthy of worship but Allah alone.",
    reference: "Hisn al-Muslim"
  },
  {
    id: 2,
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Sahih al-Bukhari"
  },
  {
    id: 3,
    title: "Dua for Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    reference: "Surah Taha (114)"
  },
  {
    id: 4,
    title: "Dua for Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    reference: "Surah Al-Isra (24)"
  },
  {
    id: 5,
    title: "After Prayer",
    arabic: "اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الْجَلالِ وَالإِكْرَامِ",
    translation: "O Allah, You are As-Salam (the Source of Peace) and from You comes peace. Blessed are You, O Owner of Majesty and Honor.",
    reference: "Sahih Muslim"
  },
  {
    id: 6,
    title: "Dua for Difficulty",
    arabic: "اللَّهُمَّ لا سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً",
    translation: "O Allah, there is no ease except in what You have made easy, and You make the difficulty, if You wish, easy.",
    reference: "Ibn Hibban"
  },
  {
    id: 7,
    title: "Dua for Protection",
    arabic: "بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    translation: "In the name of Allah, with Whose name nothing in the earth or in the sky can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud & At-Tirmidhi"
  },
  {
    id: 8,
    title: "Dua for Relief from Stress",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    translation: "O Ever Living One, O Self-Sustaining One, I seek relief through Your mercy.",
    reference: "At-Tirmidhi"
  }
];

export default function Duas() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-5 py-4 border-b border-emerald-500/10 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-foreground/70 hover:text-emerald-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Duas</h1>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Fortress of the Believer</p>
        </div>
      </header>

      <main className="flex-1 p-5 pb-24 space-y-6">
        {DUAS.map((dua, index) => (
          <motion.div
            key={dua.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-emerald-500/10 rounded-3xl p-6 space-y-5 backdrop-blur-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <BookOpen size={120} className="text-emerald-500" />
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{dua.title}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-emerald-500/40 hover:text-emerald-500 transition-colors"><Heart size={18} /></button>
                <button className="p-2 text-emerald-500/40 hover:text-emerald-500 transition-colors"><Share2 size={18} /></button>
              </div>
            </div>

            <p className="font-arabic text-3xl leading-[1.8] text-right text-foreground dir-rtl">
              {dua.arabic}
            </p>

            <div className="pt-4 border-t border-emerald-500/5 space-y-2">
              <p className="text-sm text-foreground/70 leading-relaxed italic">
                "{dua.translation}"
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">
                <div className="w-4 h-[1px] bg-emerald-500/20" />
                {dua.reference}
              </div>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
