import { motion } from 'framer-motion';
import { useAcademyStore } from '@/store/academyStore';
import { Gift, CheckCircle2 } from 'lucide-react';

export default function RewardProgress() {
  const { lessons, rewards, claimReward } = useAcademyStore();
  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-5 space-y-5">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-base font-black text-white">Your Rewards</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complete lessons to earn money</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-indigo-400">{completedCount}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase ml-1">Lessons</span>
        </div>
      </div>

      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / 7) * 100}%` }}
        />
      </div>

      <div className="space-y-2.5">
        {rewards.map((reward) => {
          const isUnlocked = completedCount >= reward.threshold;
          return (
            <div 
              key={reward.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                reward.claimed 
                  ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                  : isUnlocked 
                    ? 'bg-indigo-500/20 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    : 'bg-white/5 border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  reward.claimed ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}>
                  <Gift className={`w-4 h-4 ${reward.claimed ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-xs font-black text-white">{reward.label}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter leading-none">
                    {reward.threshold} Lessons Required
                  </p>
                </div>
              </div>
              
              {reward.claimed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              ) : (
                <button
                  disabled={!isUnlocked}
                  onClick={() => claimReward(reward.id)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    isUnlocked 
                      ? 'bg-indigo-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {isUnlocked ? 'Claim' : 'Locked'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
