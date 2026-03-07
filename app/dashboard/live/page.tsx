"use client";
import { useTransactionStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, Cpu, Activity } from 'lucide-react';

export default function LiveStreamPage() {
  const { transactions, liveStreamEnabled } = useTransactionStore();

  return (
    <div className="flex flex-col h-full bg-[#030109]">
      {/* HUD Header */}
      <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
            <Terminal className="w-3 h-3" /> System Kernel: Live
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <Database className="w-3 h-3" /> DB Conn: Established
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <Cpu className="w-3 h-3" /> TPU Load: 24%
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Activity className="w-4 h-4 text-primary animate-pulse" />
           <span className="text-[10px] font-bold text-white uppercase tracking-widest">Buffer Syncing...</span>
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] leading-relaxed">
        <AnimatePresence mode="popLayout">
          {transactions.map((t, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={t.id + i}
              className={`flex gap-4 py-1 group border-l-2 pl-4 mb-1 transition-colors ${
                t.decision === 'BLOCK' ? 'border-fraud bg-fraud/5 text-fraud/80' : 
                t.decision === 'FLAG' ? 'border-warning bg-warning/5 text-warning/80' : 
                'border-primary/20 hover:bg-white/[0.02] text-slate-400'
              }`}
            >
              <span className="text-slate-600 shrink-0">[{new Date(t.timestamp).toLocaleTimeString()}]</span>
              <span className="font-bold shrink-0">{t.id}</span>
              <span className="text-white shrink-0">${t.amount.toFixed(2)}</span>
              <span className="opacity-60 truncate">| INFERENCE_RECV | LOC: {t.location} | DEV: {t.device_id.split(' ')[0]} | SCORE: {t.risk_score}</span>
              <span className={`ml-auto font-bold uppercase ${
                t.decision === 'BLOCK' ? 'text-fraud' : 
                t.decision === 'FLAG' ? 'text-warning' : 
                'text-success'
              }`}>
                {t.decision}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 grayscale grayscale-0">
             <Terminal className="w-20 h-20 mb-4 animate-pulse" />
             <p className="font-bold uppercase tracking-widest">Awaiting kernel signal...</p>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="px-8 py-3 bg-black/60 border-t border-white/5 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
         <span>Session Trace: {transactions.length} entries</span>
         <span className="text-primary">Low Latency Buffer v2.1</span>
      </div>
    </div>
  );
}
