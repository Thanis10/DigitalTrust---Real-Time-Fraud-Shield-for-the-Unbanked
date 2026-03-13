import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpRight, Plus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import TopUpModal from './TopUpModal';

interface Props {
  onSendClick: () => void;
}

export default function QuickActions({ onSendClick }: Props) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const actions = [
    { icon: ArrowDownToLine, label: 'Withdraw', onClick: () => {} },
    { icon: ArrowUpRight, label: 'Transfer', onClick: onSendClick },
    { icon: Plus, label: 'Top Up', onClick: () => setIsTopUpOpen(true) },
    { icon: MoreHorizontal, label: 'More', onClick: () => {} },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8 px-2">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2.5 group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 shadow-lg flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <action.icon className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors relative z-10" />
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
      
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </>
  );
}