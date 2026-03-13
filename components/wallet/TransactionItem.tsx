import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  transaction: {
    id: string;
    name: string;
    desc: string;
    amount: number;
    icon?: LucideIcon;
    color?: string;
    bg?: string;
    isDynamic?: boolean;
    originalTx?: { decision?: string };
  };
  index: number;
  onClick: () => void;
}

export default function TransactionItem({ transaction, index, onClick }: Props) {
  const isPositive = transaction.amount > 0 && !transaction.isDynamic;
  const Icon: LucideIcon = transaction.icon || ArrowUpRight;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 + 0.4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 transition-colors shadow-sm cursor-pointer mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.bg || 'bg-indigo-500/10'} shadow-inner`}>
          <Icon className={`w-5 h-5 ${transaction.color || 'text-indigo-400'}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
            {transaction.name}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {transaction.desc}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-base font-black tracking-tight ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
          {isPositive ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </div>
        {transaction.isDynamic && transaction.originalTx?.decision && (
          <span className={`text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
            transaction.originalTx.decision === 'APPROVE' ? 'text-indigo-400 bg-indigo-500/10' :
            transaction.originalTx.decision === 'FLAG' ? 'text-amber-400 bg-amber-500/10' :
            'text-red-400 bg-red-500/10'
          }`}>
            {transaction.originalTx.decision === 'APPROVE' ? 'Protected' : `${transaction.originalTx.decision}ED`}
          </span>
        )}
      </div>
    </motion.div>
  );
}