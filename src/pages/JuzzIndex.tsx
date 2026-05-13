import { motion } from 'framer-motion';
import { ChevronLeft, Book, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const JUZZ_DATA = [
  { id: 1, name: "Alif Lam Meem", range: "1:1 - 2:141", page: 1 },
  { id: 2, name: "Sayaqool", range: "2:142 - 2:252", page: 22 },
  { id: 3, name: "Tilkal Rusul", range: "2:253 - 3:92", page: 42 },
  { id: 4, name: "Lan Tanalu", range: "3:93 - 4:23", page: 62 },
  { id: 5, name: "Wal Muhsanat", range: "4:24 - 4:147", page: 82 },
  { id: 6, name: "La Yuhibbullah", range: "4:148 - 5:81", page: 102 },
  { id: 7, name: "Wa Iza Samiu", range: "5:82 - 6:110", page: 122 },
  { id: 8, name: "Walau Annana", range: "6:111 - 7:87", page: 142 },
  { id: 9, name: "Qal al-Mala'u", range: "7:88 - 8:40", page: 162 },
  { id: 10, name: "Walamu", range: "8:41 - 9:92", page: 182 },
  { id: 11, name: "Ya'taziruna", range: "9:93 - 11:5", page: 202 },
  { id: 12, name: "Wa Ma Min Daabbatin", range: "11:6 - 12:52", page: 222 },
  { id: 13, name: "Wa Ma Ubarri'u", range: "12:53 - 14:52", page: 242 },
  { id: 14, name: "Rubama", range: "15:1 - 16:128", page: 262 },
  { id: 15, name: "Subhanalladhi", range: "17:1 - 18:74", page: 282 },
  { id: 16, name: "Qal Alam", range: "18:75 - 20:135", page: 302 },
  { id: 17, name: "Iqtaraba Linnasi", range: "21:1 - 22:78", page: 322 },
  { id: 18, name: "Qad Aflaha", range: "23:1 - 25:20", page: 342 },
  { id: 19, name: "Wa Qalalladhina", range: "25:21 - 27:55", page: 362 },
  { id: 20, name: "Amman Khalaqa", range: "27:56 - 29:45", page: 382 },
  { id: 21, name: "Utlu Ma Uhiya", range: "29:46 - 33:30", page: 402 },
  { id: 22, name: "Wa Man Yaqnut", range: "33:31 - 36:27", page: 422 },
  { id: 23, name: "Wa Maliya", range: "36:28 - 39:31", page: 442 },
  { id: 24, name: "Faman Azlamu", range: "39:32 - 41:46", page: 462 },
  { id: 25, name: "Ilaihi Yuraddu", range: "41:47 - 45:37", page: 482 },
  { id: 26, name: "Ha Meem", range: "46:1 - 51:30", page: 502 },
  { id: 27, name: "Qala Fa Ma Khatbukum", range: "51:31 - 57:29", page: 522 },
  { id: 28, name: "Qad Sami'allah", range: "58:1 - 66:12", page: 542 },
  { id: 29, name: "Tabarakalladhi", range: "67:1 - 77:50", page: 562 },
  { id: 30, name: "Amma Yatasa'aluna", range: "78:1 - 114:6", page: 582 },
];

export default function JuzzIndex() {
  const navigate = useNavigate();

  return (
    <div className="p-5 flex flex-col gap-6 bg-background min-h-screen">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-emerald-500/10 rounded-full transition-colors text-emerald-600"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Paras (Juzz)</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Holy Quran Index</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 pb-8">
        {JUZZ_DATA.map((juzz) => (
          <motion.button
            key={juzz.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mushaf', { state: { startPage: juzz.page } })}
            className="group relative flex items-center justify-between p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl overflow-hidden hover:bg-emerald-500/[0.06] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12">
                <Star size={44} className="text-emerald-500/10 absolute rotate-12" strokeWidth={1} />
                <span className="text-lg font-black text-emerald-600 z-10">{juzz.id}</span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-600 transition-colors">{juzz.name}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{juzz.range}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter leading-none">Page</p>
                <p className="text-sm font-bold text-foreground">{juzz.page}</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Book size={18} />
              </div>
            </div>

            {/* Decorative background number */}
            <span className="absolute -right-4 -bottom-6 text-8xl font-black text-emerald-500/05 select-none pointer-events-none group-hover:scale-110 transition-transform">
              {juzz.id}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
