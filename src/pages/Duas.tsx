import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import AdBanner from '../components/AdBanner';

const CATEGORIES = [
  "All", "Morning", "Evening", "Protection", "Guidance", "Hardship", "Family", "Health", "Forgiveness"
];

const DUAS = [
  {
    id: 1,
    category: "Morning",
    title: "Morning Remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
    translation: "We have entered a new day and with it all dominion is Allah's. All praise is to Allah. There is none worthy of worship but Allah alone.",
    reference: "Hisn al-Muslim"
  },
  {
    id: 2,
    category: "Evening",
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "Sahih al-Bukhari"
  },
  {
    id: 3,
    category: "Guidance",
    title: "Request for Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    reference: "Surah Taha (114)"
  },
  {
    id: 4,
    category: "Family",
    title: "Dua for Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    reference: "Surah Al-Isra (24)"
  },
  {
    id: 5,
    category: "All",
    title: "Seeking Peace",
    arabic: "اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الْجَلالِ وَالإِكْرَامِ",
    translation: "O Allah, You are As-Salam (the Source of Peace) and from You comes peace. Blessed are You, O Owner of Majesty and Honor.",
    reference: "Sahih Muslim"
  },
  {
    id: 6,
    category: "Hardship",
    title: "Ease in Difficulty",
    arabic: "اللَّهُمَّ لا سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً",
    translation: "O Allah, there is no ease except in what You have made easy, and You make the difficulty, if You wish, easy.",
    reference: "Ibn Hibban"
  },
  {
    id: 7,
    category: "Protection",
    title: "Protection from Harm",
    arabic: "بِسمِ اللهِ الذي لا يَضُرُّ مَعَ اسمِهِ شَيءٌ في الأرْضِ وَلا في السَّماءِ وَهوَ السَّميعُ العَليم",
    translation: "In the name of Allah, with Whose name nothing in the earth or in the sky can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud"
  },
  {
    id: 8,
    category: "Hardship",
    title: "Relief from Stress",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    translation: "O Ever Living One, O Self-Sustaining One, I seek relief through Your mercy.",
    reference: "At-Tirmidhi"
  },
  {
    id: 9,
    category: "Forgiveness",
    title: "Master of Forgiveness",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ ، خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I am faithful to Your covenant and my promise to You as much as I can.",
    reference: "Sahih Bukhari"
  },
  {
    id: 10,
    category: "Health",
    title: "Shifa & Healing",
    arabic: "أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ اشْفِ وَأَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ",
    translation: "Take away the pain, O Lord of mankind, and grant healing, for You are the Healer, there is no healing but Your healing.",
    reference: "Sahih Bukhari"
  },
  {
    id: 11,
    category: "Protection",
    title: "Against Anxiety & Grief",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice.",
    reference: "Sahih Bukhari"
  },
  {
    id: 12,
    category: "Forgiveness",
    title: "Prophetic Forgiveness",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    translation: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    reference: "Surah Ibrahim (41)"
  }
];

export default function Duas() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDuas = activeCategory === "All" 
    ? DUAS 
    : DUAS.filter(d => d.category === activeCategory);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-5 pt-4 pb-2 border-b border-emerald-500/10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-foreground/70 hover:text-emerald-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Masnoon Duas</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">Authentication & Remembrance</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
                  : "bg-white/5 text-muted-foreground border-emerald-500/10 hover:border-emerald-500/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-5 pb-24 space-y-6">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua, index) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-stone-900 border border-emerald-500/10 rounded-3xl p-6 space-y-5 shadow-sm relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={120} className="text-emerald-500" />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <div className="bg-emerald-500/10 w-fit px-2 py-0.5 rounded-md">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{dua.category}</span>
                  </div>
                  <h2 className="text-sm font-bold text-foreground tracking-tight">{dua.title}</h2>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-emerald-500/30 hover:text-emerald-500 transition-colors"><Heart size={18} /></button>
                  <button className="p-2 text-emerald-500/30 hover:text-emerald-500 transition-colors"><Share2 size={18} /></button>
                </div>
              </div>

              <p className="font-arabic text-3xl leading-[1.8] text-right text-foreground dir-rtl pr-2 border-r-4 border-emerald-500/20">
                {dua.arabic}
              </p>

              <div className="pt-4 border-t border-emerald-500/5 space-y-3">
                <p className="text-sm text-foreground/70 leading-relaxed font-light italic">
                  "{dua.translation}"
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest justify-end">
                  <span className="italic">Source: {dua.reference}</span>
                  <div className="w-4 h-[1.5px] bg-emerald-500/20" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <BookOpen size={48} className="mb-4" />
            <p className="text-xs uppercase tracking-widest font-bold">More Duas coming soon</p>
          </div>
        )}
      </main>

      <AdBanner className="border-none" />
    </div>
  );
}
