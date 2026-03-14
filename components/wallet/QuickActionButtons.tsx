"use client";
import { motion } from 'framer-motion';
import { Send, Download, Plus, ArrowRightLeft } from 'lucide-react';

interface QuickActionButtonsProps {
  onSendClick: () => void;
  onTopUpClick: () => void;
  onReceiveClick: () => void;
  onMoveToVaultClick: () => void;
}

export default function QuickActionButtons({ 
  onSendClick, 
  onTopUpClick, 
  onReceiveClick, 
  onMoveToVaultClick 
}: QuickActionButtonsProps) {
  const actions = [
    { icon: Send, label: 'Send Money', onClick: onSendClick, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20' },
    { icon: Download, label: 'Receive', onClick: onReceiveClick, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
    { icon: Plus, label: 'Top Up', onClick: onTopUpClick, color: 'bg-purple-500', shadow: 'shadow-purple-500/20' },
    { icon: ArrowRightLeft, label: 'To Vault', onClick: onMoveToVaultClick, color: 'bg-amber-500', shadow: 'shadow-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="flex flex-col items-center gap-3 group"
        >
          <div className={`w-16 h-16 rounded-[2rem] ${action.color} flex items-center justify-center shadow-xl ${action.shadow} group-hover:scale-110 transition-transform relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <action.icon className="w-7 h-7 text-white relative z-10" />
          </div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest text-center">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}