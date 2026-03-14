"use client";
import { motion } from 'framer-motion';
import { Lightbulb, ShieldCheck, TrendingUp, ArrowRight, GraduationCap, Lock } from 'lucide-react';

const TIPS = [
  {
    id: 1,
    title: 'Safety Tip',
    text: 'Never send money to unknown contacts.',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    id: 2,
    title: 'Savings Tip',
    text: 'Move extra earnings into your Secure Vault.',
    icon: TrendingUp,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  }
];

const SECURITY_LESSONS = [
  {
    title: "Why we protect you",
    desc: "A scammer can take your entire day's work in seconds. Our AI works as your digital bodyguard.",
    icon: Lock,
    color: "from-indigo-500 to-purple-600"
  },
  {
    title: "Smart Spending",
    desc: "Only keep what you need in your main wallet. The vault is for your long-term dreams.",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-600"
  }
];

export default function FinancialTipsCard() {
  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-xs">Helpful Tips</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {TIPS.map((tip) => (
            <motion.div
              key={tip.id}
              whileHover={{ y: -5 }}
              className={`min-w-[280px] p-6 rounded-[2.5rem] border ${tip.bg} ${tip.borderColor} flex gap-4 items-start relative overflow-hidden`}
            >
              <div className={`w-12 h-12 rounded-2xl ${tip.bg} border ${tip.borderColor} flex items-center justify-center shrink-0`}>
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              
              <div className="space-y-1">
                <h4 className={`text-xs font-black uppercase tracking-widest ${tip.color}`}>
                  {tip.title}
                </h4>
                <p className="text-sm font-bold text-white pr-2">
                  {tip.text}
                </p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors mt-2">
                  Learn how <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-xs">Security Academy</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {SECURITY_LESSONS.map((lesson, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${lesson.color} flex gap-4 items-center shadow-lg relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-sm">
                <lesson.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pr-6">
                <h4 className="text-sm font-black text-white mb-1 uppercase tracking-wider">{lesson.title}</h4>
                <p className="text-xs text-white/80 leading-snug font-medium">{lesson.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}