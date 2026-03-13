import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface Props {
  decision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  score: number | null;
  explanation: string | null;
  onClose: () => void;
}

export default function RiskResultModal({ decision, score, explanation, onClose }: Props) {
  if (!decision) return null;

  const config = {
    APPROVE: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', glow: 'bg-emerald-500', title: 'Transaction Approved' },
    FLAG: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20', glow: 'bg-amber-500', title: 'Security Warning' },
    BLOCK: { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/20', glow: 'bg-red-500', title: 'Transaction Blocked' },
  }[decision];

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden text-center"
        >
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] opacity-20 ${config.glow}`} />
          
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white z-10 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 mt-6">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 ${config.bg}`}>
              <Icon className={`w-12 h-12 ${config.color}`} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{config.title}</h2>
            
            <div className="mb-6 flex justify-center items-center gap-2 bg-slate-950/50 w-fit mx-auto px-3 py-1.5 rounded-full border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Score</span>
              <span className={`px-2 py-0.5 rounded text-sm font-black bg-white/5 ${config.color}`}>
                {score}/100
              </span>
            </div>

            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-5 text-left mb-8 shadow-inner">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">AI Explanation</span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {explanation || 'The transaction was processed and verified through our real-time AI fraud shield network.'}
              </p>
            </div>

            <button 
              onClick={onClose}
              className={`w-full h-14 rounded-xl font-bold text-slate-950 transition-all shadow-lg ${
                decision === 'APPROVE' ? 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-500/20' : 
                decision === 'FLAG' ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-500/20' : 'bg-red-400 hover:bg-red-500 shadow-red-500/20'
              }`}
            >
              {decision === 'APPROVE' ? 'Done' : 'Understood'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}