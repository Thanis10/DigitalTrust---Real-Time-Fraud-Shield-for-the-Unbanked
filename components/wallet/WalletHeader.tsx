import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function WalletHeader() {
  const currentDate = format(new Date(), 'MMMM d, yyyy');

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight leading-tight mb-1">
          Hello, Alex
        </h1>
        <p className="text-xs font-medium text-slate-400">
          {currentDate}
        </p>
      </div>
      <motion.div 
        whileTap={{ scale: 0.9 }}
        className="relative w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden shadow-inner"
      >
        <UserCircle className="w-8 h-8 text-slate-300 relative z-10" />
        <div className="absolute top-0 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 z-20" />
      </motion.div>
    </motion.div>
  );
}