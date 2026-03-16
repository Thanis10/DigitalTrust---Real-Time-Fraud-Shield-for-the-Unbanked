'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademyStore, Lesson } from '@/store/academyStore';
import AcademyHeader from '@/components/security/AcademyHeader';
import LessonCard from '@/components/security/LessonCard';
import BadgeGrid from '@/components/security/BadgeGrid';
import RewardProgress from '@/components/security/RewardProgress';
import QuizQuestion from '@/components/security/QuizQuestion';
import SimulationActivity from '@/components/security/SimulationActivity';
import { LESSON_CONTENT, QuizContent, SimulationContent } from '@/data/lessonsContent';
import { X, Trophy, Star, ShieldCheck, Sparkles } from 'lucide-react';

export default function SecurityAcademyPage() {
  const { lessons, completeLesson } = useAcademyStore();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleLessonStart = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleLessonComplete = () => {
    if (activeLesson) {
      completeLesson(activeLesson.id);
      setActiveLesson(null);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#02000a] flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] relative bg-slate-950 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-10 pb-24 scrollbar-hide relative z-10">
          <AcademyHeader />

          <div className="mt-8 space-y-8">
            {/* Rewards Section */}
            <section>
              <RewardProgress />
            </section>

            {/* Lessons Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Learning Activities</h3>
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    index={idx} 
                    onClick={handleLessonStart}
                  />
                ))}
              </div>
            </section>

            {/* Badges Section */}
            <section>
              <BadgeGrid />
            </section>
          </div>
        </div>

        {/* Floating Lesson Overlay (Stays within the frame) */}
        <AnimatePresence>
          {activeLesson && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-50 bg-[#020617] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate w-32">{activeLesson.title}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{activeLesson.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveLesson(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
                <div className="max-w-md mx-auto h-full">
                  {activeLesson.type === 'quiz' && LESSON_CONTENT[activeLesson.id] && (
                    <QuizQuestion 
                      content={LESSON_CONTENT[activeLesson.id] as QuizContent} 
                      onComplete={handleLessonComplete}
                    />
                  )}
                  
                  {activeLesson.type === 'simulation' && LESSON_CONTENT[activeLesson.id] && (
                    <SimulationActivity 
                      content={LESSON_CONTENT[activeLesson.id] as SimulationContent} 
                      onComplete={handleLessonComplete}
                    />
                  )}

                  {activeLesson.type === 'tip' && (
                    <div className="space-y-8 h-full flex flex-col justify-center">
                       <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex flex-col items-center justify-center p-8 text-center space-y-6">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                            <ShieldCheck className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-xl font-black text-white">Always Protect Your Codes</h2>
                          <p className="text-xs text-slate-300 leading-relaxed font-bold">
                            Your One-Time Password (OTP) is like a key to your house. 
                            Never share it with anyone, not even someone claiming to be from DigitalTrust.
                          </p>
                       </div>
                       <button
                          onClick={handleLessonComplete}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 rounded-[1.5rem] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all"
                        >
                          I understand, Thanks!
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration Overlay (Stays within the frame) */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none p-6"
            >
              <div className="bg-indigo-600/90 backdrop-blur-md border border-indigo-500/50 p-8 rounded-[3rem] text-center space-y-4 relative overflow-hidden shadow-2xl">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 opacity-20"
                 >
                   <Sparkles className="w-full h-full text-white p-4" />
                 </motion.div>
                 
                 <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(234,179,8,0.5)] border-4 border-white/20">
                   <Trophy className="w-8 h-8 text-white" />
                 </div>
                 <h2 className="text-2xl font-black text-white">Lesson Complete!</h2>
                 <p className="text-indigo-100 font-bold uppercase tracking-[0.2em] text-[10px]">Points Earned +50</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
