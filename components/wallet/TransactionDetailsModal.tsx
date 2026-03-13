import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/store';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailsModal({ transaction, onClose }: Props) {
  if (!transaction) return null;

  const isPositive = transaction.amount > 0 && !transaction.decision; // Mock positive check
  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
  const statusColor = transaction.decision === 'APPROVE' ? 'text-emerald-400' : transaction.decision === 'FLAG' ? 'text-amber-400' : 'text-red-400';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full bg-slate-900 border-t border-white/10 rounded-t-[2rem] p-6 shadow-2xl relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full mt-3" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="mt-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Transaction Details</h2>
            <p className="text-sm text-slate-400">{format(new Date(transaction.timestamp), 'MMMM d, yyyy • h:mm a')}</p>
            
            <div className="text-4xl font-black text-white my-6">
              {isPositive ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4 space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Status</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${statusColor}`}>
                {transaction.decision || 'COMPLETED'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Transaction ID</span>
              <span className="text-xs font-mono text-slate-300">{transaction.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Location</span>
              <span className="text-xs font-medium text-slate-300">{transaction.location || 'Unknown'}</span>
            </div>
            {transaction.reason && (
              <div className="pt-3 border-t border-white/5">
                <span className="text-xs font-medium text-slate-500 block mb-1">Note</span>
                <span className="text-xs font-medium text-slate-300 leading-relaxed">{transaction.reason}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}