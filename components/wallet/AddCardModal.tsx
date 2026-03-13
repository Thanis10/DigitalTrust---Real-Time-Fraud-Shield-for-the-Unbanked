import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCardModal({ isOpen, onClose }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding card
    setTimeout(() => onClose(), 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-[60] bg-slate-950 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-8 relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Add New Card</h2>
            <button 
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
            
          <div className="absolute top-0 left-0 right-0 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input 
                    placeholder="0000 0000 0000 0000" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-14 pl-12 bg-slate-900/80 border-white/10 text-white rounded-xl focus:border-indigo-500 shadow-inner placeholder:text-slate-600 font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expiry</label>
                  <Input 
                    placeholder="MM/YY" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="h-14 bg-slate-900/80 border-white/10 text-white rounded-xl focus:border-indigo-500 shadow-inner px-4 placeholder:text-slate-600 text-center font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">CVV</label>
                  <Input 
                    type="password"
                    placeholder="•••" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="h-14 bg-slate-900/80 border-white/10 text-white rounded-xl focus:border-indigo-500 shadow-inner px-4 placeholder:text-slate-600 text-center font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="mt-auto pt-8">
                <Button 
                  type="submit" 
                  className="w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_4px_30px_rgba(99,102,241,0.4)] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Card
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}