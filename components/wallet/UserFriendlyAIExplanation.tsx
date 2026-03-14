"use client";
import { motion } from 'framer-motion';
import { Info, Smartphone, MapPin, TrendingUp, AlertCircle, Scale } from 'lucide-react';

interface UserFriendlyAIExplanationProps {
  reasons: string[];
}

export default function UserFriendlyAIExplanation({ reasons }: UserFriendlyAIExplanationProps) {
  const getIcon = (reason: string) => {
    if (reason.toLowerCase().includes('device')) return Smartphone;
    if (reason.toLowerCase().includes('location') || reason.toLowerCase().includes('place')) return MapPin;
    if (reason.toLowerCase().includes('amount') || reason.toLowerCase().includes('high')) return TrendingUp;
    return Info;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-black uppercase tracking-widest text-xs">Why was this blocked?</h3>
        </div>
        <p className="text-sm text-slate-400">Our AI found these specific risks in this transaction:</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {reasons.map((reason, i) => {
          const Icon = getIcon(reason);
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">{reason}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bias Prevention Section */}
      <div className="p-5 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Scale className="w-16 h-16 text-indigo-400" />
        </div>
        
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Our Fairness Promise</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed relative z-10">
          This decision was made based <strong>only</strong> on technical security patterns. 
          We never block transactions based on who you are, your background, or where you come from. 
          Our AI is regularly checked to prevent bias and ensure every gig worker is treated fairly.
        </p>
      </div>
      
      <p className="text-[10px] text-slate-500 italic text-center uppercase tracking-widest">
        Helping you keep your hard-earned money safe.
      </p>
    </div>
  );
}