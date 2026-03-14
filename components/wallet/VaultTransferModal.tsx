"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Wallet, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store';

interface VaultTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'deposit' | 'withdraw';
}

export default function VaultTransferModal({ isOpen, onClose, mode: initialMode }: VaultTransferModalProps) {
  const { walletBalance, vaultBalance, moveToVault, releaseFromVault, locationCurrency, t } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw'>(initialMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (mode === 'deposit') {
      if (val > walletBalance) return;
      moveToVault(val);
    } else {
      if (val > vaultBalance) return;
      releaseFromVault(val);
    }
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[350] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {mode === 'deposit' ? t('move_in') : t('withdraw')}
                </h2>
                <p className="text-sm text-slate-400 font-medium">Protect your earnings with AI</p>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-[2rem] border border-white/5">
                <div className={`flex-1 text-center p-3 rounded-2xl transition-all ${mode === 'deposit' ? 'bg-indigo-500/20 border border-indigo-500/30' : 'opacity-40'}`}>
                  <Wallet className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('main_wallet')}</p>
                  <p className="text-xs font-bold text-white">{locationCurrency.symbol}{walletBalance.toLocaleString()}</p>
                </div>
                
                <button onClick={() => setMode(mode === 'deposit' ? 'withdraw' : 'deposit')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                   <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                </button>

                <div className={`flex-1 text-center p-3 rounded-2xl transition-all ${mode === 'withdraw' ? 'bg-indigo-500/20 border border-indigo-500/30' : 'opacity-40'}`}>
                  <Lock className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('secure_vault')}</p>
                  <p className="text-xs font-bold text-white">{locationCurrency.symbol}{vaultBalance.toLocaleString()}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Amount to Move</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-400">{locationCurrency.symbol}</span>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-20 pl-14 bg-slate-900/80 border-white/10 text-4xl font-black text-white rounded-[2rem] focus:border-indigo-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                   {[100, 500, 1000].map(val => (
                     <button 
                      key={val} 
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:bg-white/10 transition-colors"
                     >
                       +{locationCurrency.symbol}{val}
                     </button>
                   ))}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {mode === 'deposit' 
                      ? 'Money in the Vault is locked behind Face Scan and earns 0.5% security rewards monthly.' 
                      : 'Withdrawing from the Vault requires AI identity verification to ensure your savings are safe.'}
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-16 bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  {mode === 'deposit' ? t('move_in') : t('withdraw')}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}