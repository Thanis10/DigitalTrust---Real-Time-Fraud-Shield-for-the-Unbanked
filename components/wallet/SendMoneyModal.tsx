import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { user_id: string; amount: number; location: string; device_id: string; recipient: string }) => void;
  loading: boolean;
}

export default function SendMoneyModal({ isOpen, onClose, onSend, loading }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    onSend({
      user_id: 'USR-8821',
      amount: parseFloat(amount),
      location: 'Singapore',
      device_id: 'iPhone 15 Pro',
      recipient
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50 bg-slate-950 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-8 relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Send Money</h2>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient</label>
                <Input 
                  placeholder="@username or Wallet ID" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="h-14 bg-slate-900/80 border-white/10 text-white rounded-2xl focus:border-indigo-500 shadow-inner px-4 placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-20 pl-12 bg-slate-900/80 border-white/10 text-3xl font-bold text-white rounded-2xl focus:border-indigo-500 shadow-inner placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex gap-4 shadow-inner mt-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-300 mb-1">AI Shield Active</h4>
                  <p className="text-[11px] text-indigo-200/80 leading-relaxed font-medium">
                    Transaction will be evaluated by our AI shield before processing to ensure maximum security.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_4px_30px_rgba(99,102,241,0.4)] transition-all overflow-hidden relative"
                >
                  {loading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                      </span>
                      Evaluating Risk...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2 relative z-10">
                      <Send className="w-5 h-5" /> Send Transaction
                    </div>
                  )}
                  {loading && (
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}