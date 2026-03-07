"use client";
import { Transaction } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Info, MapPin, Smartphone, Activity, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIExplanationPanel({ transaction, onClose }: { transaction: Transaction | null, onClose: () => void }) {
  if (!transaction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 h-full w-[400px] glass border-l border-white/5 p-8 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Reasoning Engine</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Transaction Analysis Report</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Risk Score Highlight */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5 overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-20 h-20 text-primary" />
           </div>
           
           <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Security Risk Score</p>
                <div className={`text-4xl font-bold ${transaction.risk_score >= 80 ? 'text-fraud' : transaction.risk_score >= 50 ? 'text-warning' : 'text-success'}`}>
                  {transaction.risk_score}
                  <span className="text-sm font-medium text-slate-500 ml-1">/100</span>
                </div>
              </div>
              <Badge variant={transaction.decision === 'APPROVE' ? 'success' : transaction.decision === 'FLAG' ? 'warning' : 'fraud'} className="mb-1 uppercase font-bold px-3">
                {transaction.decision}
              </Badge>
           </div>
           
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${transaction.risk_score}%` }}
                className={`h-full ${transaction.risk_score >= 80 ? 'bg-fraud' : transaction.risk_score >= 50 ? 'bg-warning' : 'bg-success'}`} 
              />
           </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Metadata Context</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Amount', value: `$${transaction.amount.toFixed(2)}`, icon: Activity },
              { label: 'Location', value: transaction.location, icon: MapPin },
              { label: 'Device ID', value: transaction.device_id.split(' ')[0], icon: Smartphone },
              { label: 'Confidence', value: `${transaction.confidence}%`, icon: Info },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <item.icon className="w-4 h-4 text-primary mb-2" />
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">{item.label}</p>
                <p className="text-xs font-bold text-white truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Narrative */}
        {transaction.reason && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Decision Narrative</h3>
            <div className={`p-5 rounded-2xl border ${
              transaction.decision === 'BLOCK' ? 'bg-fraud/5 border-fraud/20' : 
              transaction.decision === 'FLAG' ? 'bg-warning/5 border-warning/20' : 'bg-primary/5 border-primary/20'
            }`}>
               <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "{transaction.reason}"
               </p>
               <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <ArrowRight className="w-3 h-3 text-primary" /> Model Version: v2.4.0-Alpha
               </div>
            </div>
          </div>
        )}

        <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
          Download Analysis Report (PDF)
        </Button>
      </div>
    </motion.div>
  );
}
