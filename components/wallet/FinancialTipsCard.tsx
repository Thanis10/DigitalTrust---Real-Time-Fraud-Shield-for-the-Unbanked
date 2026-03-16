"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Lightbulb, ShieldCheck, TrendingUp, ArrowRight, GraduationCap, 
  Lock, AlertOctagon, Users, Zap, X, Check, Award, Trophy, Star
} from 'lucide-react';
import { useState } from 'react';
import { useWalletStore } from '@/store';
import { useAcademyStore } from '@/store/academyStore';

export default function FinancialTipsCard() {
  const { t } = useWalletStore();
  const { totalPoints, lessons } = useAcademyStore();
  const [selectedTip, setSelectedTip] = useState<any | null>(null);

  const tips = t('tips') || [];
  const completedCount = lessons.filter(l => l.completed).length;

  const getTipIcon = (title: string) => {
    if (title.toLowerCase().includes('safety') || title.toLowerCase().includes('keselamatan')) return ShieldCheck;
    if (title.toLowerCase().includes('savings') || title.toLowerCase().includes('simpanan')) return TrendingUp;
    return AlertOctagon;
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] p-4 flex items-center justify-between mx-1 shadow-inner">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
               <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('shield_mastery')}</p>
               <p className="text-sm font-black text-white">{totalPoints} {t('points')}</p>
            </div>
         </div>
         <div className="flex gap-1">
            {[1, 2, 3].map(i => (
               <div key={i} className={`w-2 h-2 rounded-full ${completedCount >= i * 2 ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,241,0.8)]' : 'bg-white/10'}`} />
            ))}
         </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-xs">{t('helpful_tips')}</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {tips.map((tip: any, i: number) => {
            const Icon = getTipIcon(tip.title);
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTip(tip)}
                className="min-w-[280px] p-6 rounded-[2.5rem] border border-white/10 bg-white/5 flex gap-4 items-start relative overflow-hidden cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{tip.title}</h4>
                  <p className="text-sm font-bold text-white leading-snug">{tip.text}</p>
                  <div className="flex items-center gap-1 text-[10px] font-black text-white/40 mt-2">
                    {t('tap_to_learn')} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <h3 className="font-black text-white uppercase tracking-widest text-xs">{t('security_academy')}</h3>
          </div>
          <Link href="/security-academy" className="text-[10px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded-lg hover:bg-indigo-500/20 transition-colors">
            {t('open_academy')}
          </Link>
        </div>

        <Link href="/security-academy" className="block">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="p-8 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 shadow-2xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="flex gap-6 items-center relative z-10">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-md shadow-inner">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-black text-white mb-1 tracking-tight">Security Academy</h4>
                <p className="text-sm text-white/80 font-bold leading-relaxed">
                  Learn to spot scams and earn real cash rewards!
                </p>
                <div className="flex items-center gap-2 mt-4">
                   <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                          {['🔍', '🛡️', '🕵️', '🔑'][i-1]}
                        </div>
                      ))}
                   </div>
                   <span className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-2">7 LESSONS READY</span>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>
      </div>

      <AnimatePresence>
        {selectedTip && (
          <div className="absolute inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 space-y-6 shadow-2xl"
            >
              <button onClick={() => setSelectedTip(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <ShieldCheck className="w-7 h-7 text-indigo-400" />
                </div>
                <h2 className="text-xl font-black text-white">{selectedTip.text}</h2>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed bg-white/5 p-6 rounded-[2rem] border border-white/5">{selectedTip.fullStory}</p>
              <button onClick={() => setSelectedTip(null)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-slate-300">{t('understood')}</button>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}