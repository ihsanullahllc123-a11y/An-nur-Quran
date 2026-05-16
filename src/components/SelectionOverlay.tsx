import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Option {
  id: string | number;
  name: string;
  detail?: string;
}

interface SelectionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: Option[];
  selectedValue: string | number;
  onSelect: (id: any) => void;
  showSearch?: boolean;
}

export default function SelectionOverlay({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  showSearch = false
}: SelectionOverlayProps) {
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    (o.detail?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl p-6 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 hover:bg-emerald-500/20 transition-colors"
            >
              <ChevronDown size={24} />
            </button>
          </div>
          
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40" size={20} />
              <input 
                type="text" 
                placeholder="Search options..." 
                className="w-full bg-white/5 border border-emerald-500/10 rounded-3xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-muted-foreground/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-10">
            {filteredOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all active:scale-[0.98]",
                  selectedValue === option.id 
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20" 
                    : "bg-white/5 border-emerald-500/5 hover:border-emerald-500/20"
                )}
              >
                <div className="text-left">
                  <p className="font-black text-lg">{option.name}</p>
                  {option.detail && (
                    <p className={cn(
                      "text-[10px] uppercase font-bold tracking-widest mt-0.5", 
                      selectedValue === option.id ? "text-white/70" : "text-emerald-500/50"
                    )}>
                      {option.detail}
                    </p>
                  )}
                </div>
                {selectedValue === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles size={20} className="text-white" />
                  </motion.div>
                )}
              </button>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="py-20 text-center space-y-4 opacity-20">
                <Search size={64} className="mx-auto" />
                <div>
                  <p className="font-black text-xl">No results</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
