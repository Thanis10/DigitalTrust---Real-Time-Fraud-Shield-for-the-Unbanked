import { motion } from 'framer-motion';
import { CheckCircle2, Play, Lock, Shield, Smartphone, Zap } from 'lucide-react';
import { Lesson } from '@/store/academyStore';

interface Props {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  index: number;
}

const ICONS = {
  scams: Shield,
  passwords: Lock,
  transactions: Zap,
  phishing: Smartphone,
  otp: Lock,
};

export default function LessonCard({ lesson, onClick, index }: Props) {
  const Icon = ICONS[lesson.category] || Shield;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onClick(lesson)}
      className={`w-full p-5 rounded-[2rem] border flex items-center justify-between transition-all group ${
        lesson.completed 
          ? 'bg-emerald-500/5 border-emerald-500/20' 
          : 'bg-white/5 border-white/5 hover:border-indigo-500/30'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          lesson.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400 group-hover:text-indigo-400'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
              {lesson.type} • {lesson.points} PTS
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
            {lesson.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
        {lesson.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <Play className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-0.5" />
        )}
      </div>
    </motion.button>
  );
}
