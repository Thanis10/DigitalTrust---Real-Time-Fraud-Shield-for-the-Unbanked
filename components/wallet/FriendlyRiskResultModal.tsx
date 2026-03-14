"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, AlertTriangle, ShieldAlert, ShieldCheck, 
  ArrowRight, Info, Fingerprint, MessageSquare, Monitor
} from 'lucide-react';

interface Props {
  decision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  score: number | null;
  explanation: string | null;
  userMessage?: string | null;
  verification?: 'biometric' | 'whatsapp_otp' | 'none' | null;
  channel?: 'MAIN' | 'VAULT' | null;
  confidence?: number | null;
  edgeFallbackUsed?: boolean;
  agentReport?: string | null;
  onClose: () => void;
}

export default function FriendlyRiskResultModal({ 
  decision, score, explanation, userMessage, verification, 
  channel, confidence, edgeFallbackUsed, agentReport, onClose 
}: Props) {
  if (!decision) return null;

  const config = {
    APPROVE: { 
      icon: CheckCircle, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      title: 'Money Sent Safely!', 
      desc: userMessage || 'Our AI verified this was safe. Your earnings are secure.' 
    },
    FLAG: { 
      icon: AlertTriangle, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      title: 'Security Review', 
      desc: userMessage || 'We noticed something unusual. Please double check the details.' 
    },
    BLOCK: { 
      icon: ShieldAlert, 
      color: 'text-red-400', 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/20',
      title: 'Payment Blocked', 
      desc: userMessage || 'To protect your wallet, our AI shield stopped this payment.' 
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
          className={`w-full max-w-sm bg-slate-900 border ${config.border} rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90%]`}
        >
          <div className="p-8 text-center space-y-6 overflow-y-auto scrollbar-hide">
            <div className={`mx-auto w-24 h-24 rounded-full ${config.bg} flex items-center justify-center border-2 ${config.border} relative shrink-0`}>
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

            {/* AI Metrics (Preserving Teammate Info) */}
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Risk Score</p>
                  <p className={`text-sm font-black ${config.color}`}>{score}/100</p>
               </div>
               <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-sm font-black text-indigo-400">{confidence ? `${(confidence).toFixed(1)}%` : 'N/A'}</p>
               </div>
            </div>

            {/* Detailed Metadata (Additional but preserved) */}
            <div className="space-y-2 text-left">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Technical Details</p>
               <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                     <span className="text-slate-500 font-bold uppercase">Channel</span>
                     <span className="text-slate-300 font-black">{channel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                     <span className="text-slate-500 font-bold uppercase">Verification</span>
                     <div className="flex items-center gap-1.5 text-slate-300 font-black">
                        {verification === 'biometric' ? <Fingerprint className="w-3 h-3" /> : verification === 'whatsapp_otp' ? <MessageSquare className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                        {verification || 'None'}
                     </div>
                  </div>
                  {edgeFallbackUsed && (
                    <div className="flex items-center justify-between text-[10px] text-amber-400">
                       <span className="font-bold uppercase">Mode</span>
                       <span className="font-black flex items-center gap-1"><Monitor className="w-3 h-3" /> Edge AI</span>
                    </div>
                  )}
               </div>
            </div>

            {explanation && (
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-left">
                <div className="flex items-center gap-2 mb-1">
                   <ShieldCheck className="w-3 h-3 text-indigo-400" />
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">AI Reason</p>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{explanation}</p>
              </div>
            )}

            {agentReport && (
               <div className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Agent Report</p>
                  <p className="text-[10px] text-slate-400 font-medium italic">"{agentReport}"</p>
               </div>
            )}

            <button 
              onClick={onClose}
              className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
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