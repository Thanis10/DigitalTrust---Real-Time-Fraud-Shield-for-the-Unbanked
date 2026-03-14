"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, ShieldCheck, TrendingUp, ArrowRight, GraduationCap, 
  Lock, AlertOctagon, Users, Zap, X, Check, Award, Trophy, Star
} from 'lucide-react';
import { useState } from 'react';
import { useWalletStore } from '@/store';

export default function FinancialTipsCard() {
  const { t } = useWalletStore();
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizState, setQuizState] = useState<'reading' | 'quiz' | 'correct'>('reading');
  const [shieldPoints, setShieldPoints] = useState(0);

  const tips = t('tips') || [];
  const lessons = t('lessons') || [];

  const handleCompleteLesson = (title: string) => {
    if (!completedLessons.includes(title)) {
      setCompletedLessons([...completedLessons, title]);
      setShieldPoints(pts => pts + 50);
    }
    setSelectedLesson(null);
    setQuizState('reading');
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('dog') || title.toLowerCase().includes('pengawal')) return Lock;
    if (title.toLowerCase().includes('customer') || title.toLowerCase().includes('pelanggan')) return Users;
    if (title.toLowerCase().includes('vault') || title.toLowerCase().includes('simpanan')) return Zap;
    return GraduationCap;
  };

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
               <p className="text-sm font-black text-white">{shieldPoints} {t('points')}</p>
            </div>
         </div>
         <div className="flex gap-1">
            {[1, 2, 3].map(i => (
               <div key={i} className={`w-2 h-2 rounded-full ${shieldPoints >= i * 50 ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,241,0.8)]' : 'bg-white/10'}`} />
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
          <span className="text-[10px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded-lg">{t('lessons_ready')}</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {lessons.map((lesson: any, i: number) => {
            const isDone = completedLessons.includes(lesson.title);
            const Icon = getIcon(lesson.title);
            const colors = ["from-indigo-500 to-purple-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600"];
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedLesson(lesson); setQuizState('reading'); }}
                className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${colors[i % colors.length]} flex gap-5 items-center shadow-xl relative overflow-hidden group cursor-pointer ${isDone ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="w-14 h-14 rounded-[1.5rem] bg-white/20 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-md">
                  {isDone ? <Check className="w-7 h-7 text-white" /> : <Icon className="w-7 h-7 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-black text-white mb-0.5 tracking-tight">{lesson.title}</h4>
                  <p className="text-xs text-white/70 font-bold">{isDone ? t('lesson_mastered') + ' ✓' : lesson.summary}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/50" />
              </motion.div>
            );
          })}
        </div>
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

        {selectedLesson && (
          <div className="absolute inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-[340px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 shadow-2xl overflow-hidden`}
            >
              <div className="relative z-10 space-y-8 text-center">
                <div className="mx-auto w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl">
                  {quizState === 'correct' ? <Star className="w-10 h-10 text-white animate-spin" /> : <GraduationCap className="w-10 h-10 text-white" />}
                </div>
                
                {quizState === 'reading' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white leading-tight">{selectedLesson.title}</h2>
                    <p className="text-sm font-bold text-white leading-relaxed bg-black/20 p-6 rounded-[2rem] border border-white/10">{selectedLesson.detail}</p>
                    <button onClick={() => setQuizState('quiz')} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest">{t('take_quiz')}</button>
                  </div>
                )}

                {quizState === 'quiz' && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Question</h4>
                    <h2 className="text-lg font-black text-white leading-tight">{selectedLesson.question}</h2>
                    <div className="space-y-3">
                      {selectedLesson.options.map((opt: string, idx: number) => (
                        <button key={idx} onClick={() => idx === 0 ? setQuizState('correct') : null}
                          className="w-full py-4 px-6 bg-white/10 border border-white/20 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizState === 'correct' && (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-6">
                    <Award className="w-16 h-16 text-white mx-auto" />
                    <h2 className="text-3xl font-black text-white">{t('correct')}</h2>
                    <p className="text-sm font-bold text-white/80">{t('correct_desc')}</p>
                    <button onClick={() => handleCompleteLesson(selectedLesson.title)} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl">{t('collect_reward')}</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}