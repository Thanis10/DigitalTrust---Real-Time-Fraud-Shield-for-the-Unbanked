"use client";
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useWalletStore } from '@/store';

export default function TrustShieldIndicator() {
  const { shieldStatus } = useWalletStore();
  const isActive = shieldStatus === 'active';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 border shadow-lg ${
        isActive 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      }`}
    >
      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
        isActive ? 'bg-emerald-500/20' : 'bg-amber-500/20'
      }`}>
        {isActive ? (
          <>
            <ShieldCheck className="w-7 h-7" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500 rounded-full blur-md"
            />
          </>
        ) : (
          <>
            <ShieldAlert className="w-7 h-7" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-amber-500 rounded-full blur-md"
            />
          </>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg">
          {isActive ? 'Shield Status: Active' : 'Shield Alert'}
        </h3>
        <p className="text-sm opacity-80">
          {isActive 
            ? 'Your wallet is protected by AI fraud detection.' 
            : 'We detected unusual activity and are protecting your wallet.'}
        </p>
      </div>

      <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
        AI Protected
      </div>
    </motion.div>
  );
}