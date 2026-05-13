import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bookmark, 
  Book,
  Settings, 
  Maximize2, 
  Minimize2,
  MoreVertical,
  Minus,
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

// standard 16-line Indo-Pak Mushaf often has ~611-848 pages. 
// We'll assume a standard 604-page count for global compatibility but mention Indo-Pak styling.
const TOTAL_PAGES = 604; 

export default function MushafReader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProgress } = useAppStore();
  
  const startPage = location.state?.startPage || 1;
  const [currentPage, setCurrentPage] = useState(startPage);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState(1);

  useEffect(() => {
    if (location.state?.startPage) {
      setCurrentPage(location.state.startPage);
      setImageError(false);
      setImageSource(1);
    }
  }, [location.state?.startPage]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem('mushaf_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save progress as last read
    localStorage.setItem('mushaf_last_page', currentPage.toString());
    setIsImageLoading(true);
    setImageError(false);
  }, [currentPage]);

  const nextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const toggleBookmark = () => {
    const newBookmarks = bookmarks.includes(currentPage)
      ? bookmarks.filter(b => b !== currentPage)
      : [...bookmarks, currentPage];
    setBookmarks(newBookmarks);
    localStorage.setItem('mushaf_bookmarks', JSON.stringify(newBookmarks));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') prevPage();
      if (e.key === 'ArrowLeft') nextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  // Page turn variants for 3D-like flip
  const pageVariants = {
    initial: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
  };

  // Indo-Pak 16-line images
  // Source 1: everyayah.com
  // Source 2: Pesantren Dev (GitHub) - Fallback
  const getPageImageUrl = (page: number, source: number = 1) => {
    if (source === 2) {
      return `https://raw.githubusercontent.com/pesantren-dev/quran-pakistan-api/master/images/${page}.png`;
    }
    const paddedPage = page.toString().padStart(3, '0');
    return `https://everyayah.com/data/pakistan_16row/${paddedPage}.png`;
  };

  // Surah mapping for 16-line mushaf (Standard Indo-Pak)
  const getSurahName = (page: number) => {
    if (page === 1) return "Al-Fatihah";
    if (page >= 2 && page <= 51) return "Al-Baqarah";
    if (page >= 52 && page <= 77) return "Al-Imran";
    if (page >= 78 && page <= 107) return "An-Nisa";
    if (page >= 108 && page <= 128) return "Al-Ma'idah";
    if (page >= 129 && page <= 151) return "Al-An'am";
    if (page >= 152 && page <= 177) return "Al-A'raf";
    if (page >= 178 && page <= 187) return "Al-Anfal";
    if (page >= 188 && page <= 208) return "At-Tawbah";
    if (page >= 209 && page <= 221) return "Yunus";
    if (page >= 222 && page <= 235) return "Hud";
    if (page >= 236 && page <= 249) return "Yusuf";
    if (page >= 250 && page <= 255) return "Ar-Ra'd";
    if (page >= 256 && page <= 262) return "Ibrahim";
    if (page >= 263 && page <= 268) return "Al-Hijr";
    if (page >= 269 && page <= 282) return "An-Nahl";
    if (page >= 283 && page <= 294) return "Al-Isra";
    if (page >= 295 && page <= 305) return "Al-Kahf";
    if (page >= 306 && page <= 313) return "Maryam";
    if (page >= 314 && page <= 322) return "Ta-Ha";
    if (page >= 323 && page <= 332) return "Al-Anbiya";
    if (page >= 333 && page <= 342) return "Al-Hajj";
    if (page >= 343 && page <= 351) return "Al-Mu'minun";
    if (page >= 352 && page <= 360) return "An-Nur";
    if (page >= 361 && page <= 367) return "Al-Furqan";
    if (page >= 368 && page <= 377) return "Ash-Shu'ara";
    if (page >= 378 && page <= 385) return "An-Naml";
    if (page >= 386 && page <= 396) return "Al-Qasas";
    if (page >= 397 && page <= 405) return "Al-Ankabut";
    if (page >= 406 && page <= 411) return "Ar-Rum";
    if (page >= 412 && page <= 415) return "Luqman";
    if (page >= 416 && page <= 418) return "As-Sajdah";
    if (page >= 419 && page <= 428) return "Al-Ahzab";
    if (page >= 429 && page <= 435) return "Saba";
    if (page >= 436 && page <= 441) return "Fatir";
    if (page >= 442 && page <= 446) return "Ya-Sin";
    if (page >= 447 && page <= 453) return "As-Saffat";
    if (page >= 454 && page <= 459) return "Sad";
    if (page >= 460 && page <= 467) return "Az-Zumar";
    if (page >= 468 && page <= 476) return "Ghafir";
    if (page >= 477 && page <= 483) return "Fussilat";
    if (page >= 484 && page <= 489) return "Ash-Shura";
    if (page >= 490 && page <= 496) return "Az-Zukhruf";
    if (page >= 497 && page <= 499) return "Ad-Dukhan";
    if (page >= 500 && page <= 503) return "Al-Jathiyah";
    if (page >= 504 && page <= 507) return "Al-Ahqaf";
    if (page >= 508 && page <= 511) return "Muhammad";
    if (page >= 512 && page <= 516) return "Al-Fath";
    if (page >= 517 && page <= 520) return "Al-Hujurat";
    if (page >= 521 && page <= 523) return "Qaf";
    if (page >= 524 && page <= 526) return "Adh-Dhariyat";
    if (page >= 527 && page <= 528) return "At-Tur";
    if (page >= 529 && page <= 531) return "An-Najm";
    if (page >= 532 && page <= 534) return "Al-Qamar";
    if (page >= 535 && page <= 537) return "Ar-Rahman";
    if (page >= 538 && page <= 541) return "Al-Waqi'ah";
    if (page >= 542 && page <= 545) return "Al-Hadid";
    if (page >= 546 && page <= 548) return "Al-Mujadila";
    if (page >= 549 && page <= 551) return "Al-Hashr";
    if (page >= 552 && page <= 553) return "Al-Mumtahinah";
    if (page >= 554 && page <= 555) return "As-Saff";
    if (page >= 556 && page <= 557) return "Al-Jumu'ah";
    if (page >= 558 && page <= 559) return "Al-Munafiqun";
    if (page >= 560 && page <= 561) return "At-Taghabun";
    if (page >= 562 && page <= 563) return "At-Talaq";
    if (page >= 564 && page <= 565) return "At-Tahrim";
    if (page >= 566 && page <= 568) return "Al-Mulk";
    if (page >= 569 && page <= 571) return "Al-Qalam";
    if (page >= 572 && page <= 573) return "Al-Haqqah";
    if (page >= 574 && page <= 575) return "Al-Ma'arij";
    if (page >= 576 && page <= 577) return "Nuh";
    if (page >= 578 && page <= 579) return "Al-Jinn";
    if (page >= 580 && page <= 581) return "Al-Muzzammil";
    if (page >= 582 && page <= 583) return "Al-Muddaththir";
    if (page >= 584 && page <= 585) return "Al-Qiyamah";
    if (page >= 586 && page <= 587) return "Al-Insan";
    if (page >= 588 && page <= 589) return "Al-Mursalat";
    if (page >= 590 && page <= 591) return "An-Naba";
    if (page >= 592 && page <= 593) return "An-Nazi'at";
    if (page >= 594 && page <= 594) return "Abasa";
    if (page >= 595 && page <= 595) return "At-Takwir";
    if (page >= 596 && page <= 596) return "Al-Infitar";
    if (page >= 597 && page <= 598) return "Al-Mutaffifin";
    if (page >= 599 && page <= 599) return "Al-Inshiqaq";
    if (page >= 600 && page <= 600) return "Al-Buruj";
    if (page >= 601 && page <= 601) return "At-Tariq";
    if (page >= 602 && page <= 602) return "Al-A'la";
    if (page >= 603 && page <= 603) return "Al-Ghashiyah";
    if (page >= 604 && page <= 604) return "Al-Fajr";
    return "Juzz " + Math.ceil(page / 20);
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-[#f4f1ea] z-50 flex flex-col transition-all overflow-hidden",
        isFullScreen ? "p-0" : "p-0"
      )}
      ref={readerRef}
    >
      {/* Background Texture - Realistic Paper */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      
      {/* Top Header - Hidden in focus mode */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="relative z-30 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-stone-200"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/juzz')} 
                className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h3 className="font-bold text-stone-800 leading-none">{getSurahName(currentPage)}</h3>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-1">Page {currentPage} of {TOTAL_PAGES}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleBookmark}
                className={cn(
                  "p-2 rounded-full transition-all",
                  bookmarks.includes(currentPage) ? "bg-amber-100 text-amber-600 shadow-sm" : "hover:bg-stone-100 text-stone-600"
                )}
              >
                <Bookmark size={20} fill={bookmarks.includes(currentPage) ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors"
              >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <main 
        className="flex-1 relative flex items-center justify-center p-4 cursor-pointer overflow-hidden"
        onClick={() => setIsControlsVisible(!isControlsVisible)}
      >
        <div 
          className="relative w-full max-w-2xl h-full flex items-center justify-center perspective-[2000px]"
          style={{ perspective: '2000px' }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x > 50) {
                  prevPage();
                } else if (info.offset.x < -50) {
                  nextPage();
                }
              }}
              className="absolute w-full h-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm bg-white overflow-hidden origin-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Spine shadow for realistic book feel */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/5 to-transparent z-10 pointer-events-none" />
              
              <div 
                className="w-full h-full p-4 md:p-8 flex items-center justify-center bg-white transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
              >
                {isImageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                    />
                  </div>
                )}

                {!imageError ? (
                  <img 
                    src={getPageImageUrl(currentPage, imageSource)} 
                    alt={`Quran Page ${currentPage}`}
                    className={cn(
                      "max-w-full max-h-full object-contain pointer-events-none select-none transition-opacity duration-300",
                      isImageLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                      if (imageSource === 1) {
                        setImageSource(2);
                      } else {
                        setImageError(true);
                        setIsImageLoading(false);
                      }
                    }}
                    loading="eager"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-stone-400">
                    <Book size={48} strokeWidth={1} />
                    <div className="text-center">
                      <p className="text-sm font-bold">Image failed to load</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setImageError(false); }}
                        className="text-xs text-emerald-600 font-bold mt-2 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Page Number Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/80 border border-stone-100 rounded-full text-[10px] font-bold text-stone-400 z-20">
                {currentPage}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Hotspots */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize" 
          onClick={(e) => { e.stopPropagation(); nextPage(); }} 
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize" 
          onClick={(e) => { e.stopPropagation(); prevPage(); }} 
        />
      </main>

      {/* Bottom Tray - Page Scroller */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.footer
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="relative z-30 p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4 px-2">
              <span className="text-[10px] font-bold text-stone-400 w-8">1</span>
              <input 
                type="range"
                min="1"
                max={TOTAL_PAGES}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDirection(val > currentPage ? 1 : -1);
                  setCurrentPage(val);
                }}
                className="flex-1 accent-emerald-600 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-bold text-stone-400 w-10 text-right">{TOTAL_PAGES}</span>
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button 
                  onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.2, 0.5)); }}
                  className="p-2 hover:bg-white rounded-lg text-stone-600 shadow-sm"
                >
                  <Minus size={16} />
                </button>
                <div className="px-3 text-xs font-bold text-stone-600 min-w-16 text-center">
                  {Math.round(zoom * 100)}%
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.2, 2.5)); }}
                  className="p-2 hover:bg-white rounded-lg text-stone-600 shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                   onClick={(e) => { e.stopPropagation(); prevPage(); }}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-700/20 active:scale-95 transition-transform"
                 >
                   Previous <ChevronRight size={16} />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); nextPage(); }}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-700/20 active:scale-95 transition-transform"
                 >
                   <ChevronLeft size={16} /> Next
                 </button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Page Preloading (Invisible) */}
      <div className="hidden">
        {currentPage < TOTAL_PAGES && <img src={getPageImageUrl(currentPage + 1, imageSource)} />}
        {currentPage > 1 && <img src={getPageImageUrl(currentPage - 1, imageSource)} />}
      </div>
    </div>
  );
}
