import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Clock, Settings, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Navigation() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/quran', icon: BookOpen, label: 'Quran' },
    { to: '/duas', icon: Heart, label: 'Duas' },
    { to: '/ai', icon: Sparkles, label: 'An-Nur' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-emerald-500/10 flex justify-around items-center py-3 px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-emerald-500 font-medium scale-110" : "text-emerald-500/40 hover:text-emerald-500/70"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} className={cn(isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute bottom-[-10px] w-8 h-8 bg-emerald-500/20 blur-xl rounded-full" 
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
