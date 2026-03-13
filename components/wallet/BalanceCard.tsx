import { useWalletStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BalanceCard() {
  const { walletBalance } = useWalletStore();
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-[2.5rem] p-[1px] mb-10 group"
    >
      {/* Neon Gradient Border */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
      
      {/* Main Card Body */}
      <div className="relative w-full bg-[#0c021a]/90 backdrop-blur-2xl rounded-[2.5rem] p-8 overflow-hidden z-10 shadow-[0_10px_40px_rgba(99,102,241,0.2)]">
        
        {/* 3D Lighting Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/40 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/40 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-sm font-medium text-indigo-200">
                Total Balance
              </p>
              <button 
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-lg h-[48px] sm:h-[60px] flex items-center">
              <AnimatePresence mode="wait">
                {isBalanceHidden ? (
                  <motion.span 
                    key="hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="tracking-widest"
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
                    ${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.span>
                )}
              </AnimatePresence>
            </h2>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            +2.4%
          </div>
        </div>
      </div>
    </motion.div>
  );
}