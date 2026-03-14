"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  decision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  score: number | null;
  explanation: string | null;
  onClose: () => void;
}

export default function FriendlyRiskResultModal({ decision, score, explanation, onClose }: Props) {
  if (!decision) return null;

  const config = {
    APPROVE: { 
      icon: CheckCircle, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      title: 'Money Sent Safely!', 
      desc: 'Our AI verified this was safe. Your earnings are secure.' 
    },
    FLAG: { 
      icon: AlertTriangle, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      title: 'Security Review', 
      desc: 'We noticed something unusual. Please double check the details.' 
    },
    BLOCK: { 
      icon: ShieldAlert, 
      color: 'text-red-400', 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/20',
      title: 'Payment Blocked', 
      desc: 'To protect your wallet, our AI shield stopped this payment.' 
    },
  }[decision];

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`w-full max-w-sm bg-slate-900 border ${config.border} rounded-[3rem] overflow-hidden shadow-2xl relative`}
        >
          <div className="p-8 text-center space-y-6">
            <div className={`mx-auto w-24 h-24 rounded-full ${config.bg} flex items-center justify-center border-2 ${config.border} relative`}>
              <Icon className={`w-12 h-12 ${config.color}`} />
              {decision === 'APPROVE' && (
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500 rounded-full"
                />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{config.title}</h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{config.desc}</p>
            </div>

            {/* Risk Score Indicator (Simplified) */}
            <div className="flex justify-center">
               <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">AI Risk Score: {score}/100</span>
               </div>
            </div>

            {explanation && decision !== 'APPROVE' && (
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reason</p>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{explanation}</p>
              </div>
            )}

            <button 
              onClick={onClose}
              className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                decision === 'APPROVE' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                decision === 'FLAG' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 
                'bg-red-500 text-white shadow-lg shadow-red-500/20'
              }`}
            >
              {decision === 'APPROVE' ? 'Great!' : 'Understood'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}