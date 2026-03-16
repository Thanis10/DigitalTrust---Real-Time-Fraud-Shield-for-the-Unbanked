import { motion } from 'framer-motion';
import { useAcademyStore } from '@/store/academyStore';

export default function BadgeGrid() {
  const badges = useAcademyStore(state => state.badges);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Badge Collection</h3>
      <div className="grid grid-cols-4 gap-2.5">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
              badge.unlocked 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-white' 
                : 'bg-white/5 border-white/5 text-slate-600 grayscale'
            }`}
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-[7px] font-black uppercase tracking-tighter text-center px-0.5 leading-none">
              {badge.unlocked ? badge.name : 'Locked'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
