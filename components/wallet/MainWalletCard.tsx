"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { useWalletStore } from '@/store';

export default function MainWalletCard() {
  const { walletBalance, locationCurrency } = useWalletStore();
  const [displayBalance, setDisplayBalance] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setDisplayBalance(walletBalance * (currentStep / steps));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [walletBalance]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-[2.5rem] p-[1px] group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-50 blur-[2px]" />
      
      <div className="relative w-full bg-slate-950 backdrop-blur-2xl rounded-[2.5rem] p-8 overflow-hidden z-10">
        {/* Animated background orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse delay-1000" />
        
        <div className="flex justify-between items-start relative z-10 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-indigo-200 tracking-wide">
                Main Wallet
              </p>
              <button 
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="text-slate-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full backdrop-blur-sm"
              >
                {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg flex items-center gap-2">
              <span className="text-2xl text-indigo-400 font-bold mb-auto mt-1">{locationCurrency.symbol}</span>
              <AnimatePresence mode="wait">
                {isBalanceHidden ? (
                  <motion.span 
                    key="hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="tracking-widest text-4xl"
                  >
                    ••••••
                  </motion.span>
                ) : (
                  <motion.span 
                    key="visible"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </motion.span>
                )}
              </AnimatePresence>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Spending Money</p>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 mt-1">+12%</span>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
           <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Today's Income</p>
              <p className="text-lg font-black text-white">{locationCurrency.symbol}1,250</p>
           </div>
           <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Spent Today</p>
              <p className="text-lg font-black text-white">{locationCurrency.symbol}450</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}