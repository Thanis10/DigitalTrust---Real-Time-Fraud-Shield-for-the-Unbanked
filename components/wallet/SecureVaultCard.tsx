"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRightLeft, Sparkles, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useWalletStore } from '@/store';

interface SecureVaultCardProps {
  onMoveMoney: (mode: 'deposit' | 'withdraw') => void;
}

export default function SecureVaultCard({ onMoveMoney }: SecureVaultCardProps) {
  const { vaultBalance, locationCurrency, isUserVerified } = useWalletStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Mock progress to goal
  const goal = 10000;
  const progress = Math.min((vaultBalance / goal) * 100, 100);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative rounded-[2.5rem] p-6 bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 overflow-hidden group shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Lock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Secure Vault</h3>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Stricter AI Rules</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/5">
             <TrendingUp className="w-3 h-3 text-emerald-400" />
             <span className="text-[10px] font-black text-emerald-400">+0.5%</span>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Savings Protected by AI</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowContent(!showContent); }}
              className="text-slate-500 hover:text-white p-1"
            >
              {showContent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl text-indigo-400 font-bold">{locationCurrency.symbol}</span>
            <h2 className="text-4xl font-black text-white transition-all">
              {(!isUserVerified || !showContent) ? '••••••' : vaultBalance.toLocaleString()}
            </h2>
            <Lock className={`w-4 h-4 mb-1 ${isUserVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
        </div>

        {/* Goal Progress - Makes it "Useful" */}
        <div className="mb-6 space-y-2">
           <div className="flex justify-between items-center px-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Savings Goal: {locationCurrency.symbol}10k</p>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{progress.toFixed(0)}%</p>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); onMoveMoney('deposit'); }}
            className="py-3.5 px-4 bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Move Money In
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMoveMoney('withdraw'); }}
            className="py-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
          >
             Withdraw
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-indigo-500/5 pointer-events-none"
          >
            <motion.div 
              animate={{ 
                x: [0, 100, 0], 
                y: [0, 50, 0],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-1/4 left-1/4"
            >
              <Sparkles className="w-4 h-4 text-indigo-400/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isUserVerified && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/80 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Verification Required</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}