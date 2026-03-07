"use client";
import { useTransactionStore, Transaction } from '@/store';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

export default function TransactionTable({ onSelect }: { onSelect: (t: Transaction) => void }) {
  const { transactions } = useTransactionStore();

  return (
    <div className="w-full overflow-hidden glass rounded-2xl border border-white/5 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              {['Transaction ID', 'Amount', 'Location', 'Device', 'Risk', 'Decision', ''].map((header) => (
                <th key={header} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {transactions.slice(0, 15).map((t) => (
                <motion.tr
                  layout
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-white/[0.03] cursor-pointer transition-all duration-300"
                  onClick={() => onSelect(t)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">#{t.id.split('-')[1]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white">${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                    {t.location}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{t.device_id.split(' ')[0]}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${t.risk_score >= 80 ? 'bg-fraud' : t.risk_score >= 50 ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${t.risk_score}%` }}
                          />
                       </div>
                       <span className="text-[10px] font-bold text-slate-300">{t.risk_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={t.decision === 'APPROVE' ? 'success' : t.decision === 'FLAG' ? 'warning' : 'fraud'}>
                      {t.decision}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <MoreHorizontal className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto" />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="p-20 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MoreHorizontal className="w-6 h-6 text-slate-700 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting Live Feed Data</p>
        </div>
      )}
    </div>
  );
}
