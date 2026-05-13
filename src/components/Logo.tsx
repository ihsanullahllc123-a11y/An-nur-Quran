import { motion } from 'framer-motion';

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 bg-emerald-600 rounded-2xl rotate-6 shadow-xl shadow-emerald-600/20"
      />
      <motion.div
        initial={{ scale: 0.8, rotate: 15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="absolute inset-0 bg-emerald-500 rounded-2xl -rotate-6 shadow-lg shadow-emerald-500/10"
      />
      <div className="relative text-white font-arabic text-2xl font-bold">
        ن
      </div>
    </div>
  );
}
