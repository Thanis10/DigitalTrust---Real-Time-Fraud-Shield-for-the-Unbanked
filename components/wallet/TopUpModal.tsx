import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, Landmark, Check, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWalletStore, BankAccount } from '@/store';
import SecurityVerificationModal from './SecurityVerificationModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BANKS = [
  { name: 'Maybank', id: 'mbb' },
  { name: 'CIMB Bank', id: 'cimb' },
  { name: 'Public Bank', id: 'pbb' },
  { name: 'RHB Bank', id: 'rhb' },
  { name: 'Hong Leong', id: 'hlb' },
  { name: 'AmBank', id: 'amb' },
];

export default function TopUpModal({ isOpen, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'card' | 'fpx'>('card');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);

  const { deductBalance, cards, bankAccounts, addBankAccount, locationCurrency, isUserVerified } = useWalletStore();

  const handleFinalizeTopUp = () => {
    setLoading(true);
    setTimeout(() => {
      deductBalance(-parseFloat(amount));
      setLoading(false);
      setAmount('');
      setSelectedBank('');
      setAccountNumber('');
      setAccountHolder('');
      onClose();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    if (method === 'fpx') {
      const bankName = BANKS.find(b => b.id === selectedBank)?.name || selectedBank;
      const existingBank = bankAccounts.find(b => b.bankName === bankName);

      if (!existingBank && !showAddBank) {
        setShowAddBank(true);
        return;
      }

      if (showAddBank) {
        if (!selectedBank || !accountNumber || !accountHolder) {
          alert('Please fill in all bank details');
          return;
        }

        addBankAccount({
          id: `bank-${Math.random().toString(36).substr(2, 9)}`,
          bankName,
          accountNumber,
          accountHolder
        });
        setShowAddBank(false);
      }
    }

    setIsVerifying(true);
  };
  const handleVerificationSuccess = () => {
    setIsVerifying(false);
    handleFinalizeTopUp();
  };

  return (
    <>
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
              <h2 className="text-2xl font-bold text-white tracking-tight">Top Up Wallet</h2>
              <button 
                type="button"
                onClick={onClose}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute top-0 left-0 right-0 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none" />

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full">

                {/* Amount Input */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100, 500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset.toString())}
                        className={`py-4 rounded-2xl border font-bold transition-all ${
                          amount === preset.toString() 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        +{locationCurrency.symbol}{preset}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter Amount</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">{locationCurrency.symbol}</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-20 pl-14 bg-slate-900/80 border-white/10 text-3xl font-bold text-white rounded-2xl focus:border-emerald-500 shadow-inner placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Method Selector */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        method === 'card' 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 ${method === 'card' ? 'text-indigo-400' : ''}`} />
                      <span className="text-xs font-bold">Credit/Debit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('fpx')}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        method === 'fpx' 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <Landmark className={`w-6 h-6 ${method === 'fpx' ? 'text-emerald-400' : ''}`} />
                      <span className="text-xs font-bold">FPX Banking</span>
                    </button>
                  </div>
                </div>

                {/* Method Details */}
                <AnimatePresence mode="wait">
                  {method === 'card' ? (
                    <motion.div 
                      key="card-select"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className="space-y-3"
                    >
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Choose Card</label>
                      <div className="space-y-2">
                        {cards.map((card) => (
                          <div 
                            key={card.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-7 rounded bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                <span className="text-[8px] font-black italic text-white">{card.type}</span>
                              </div>
                              <span className="text-sm font-medium text-white">•••• {card.number.slice(-4)}</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="fpx-select"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Linked Bank Accounts</label>
                        <div className="space-y-2">
                          {bankAccounts.map((bank) => (
                            <button
                              key={bank.id}
                              type="button"
                              onClick={() => { setSelectedBank(bank.bankName); setShowAddBank(false); }}
                              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                selectedBank === bank.bankName && !showAddBank
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                                : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-4 text-left">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                  <Landmark className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{bank.bankName}</p>
                                  <p className="text-[10px] font-medium text-slate-500 tracking-wider">•••• {bank.accountNumber.slice(-4)}</p>
                                </div>
                              </div>
                              {selectedBank === bank.bankName && !showAddBank && (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setShowAddBank(true)}
                            className={`w-full p-4 rounded-2xl border border-dashed flex items-center gap-4 transition-all ${
                              showAddBank 
                              ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-400' 
                              : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                              <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold">Link New Bank Account</span>
                          </button>
                        </div>
                      </div>

                      {showAddBank && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4 pt-4 border-t border-white/5"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Select Bank</label>
                            <div className="grid grid-cols-2 gap-2">
                              {BANKS.map((bank) => (
                                <button
                                  key={bank.id}
                                  type="button"
                                  onClick={() => setSelectedBank(bank.id)}
                                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                                    selectedBank === bank.id 
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white' 
                                    : 'bg-white/5 border-white/10 text-slate-400'
                                  }`}
                                >
                                  {bank.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Number</label>
                            <Input 
                              placeholder="e.g. 164800001234"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              className="bg-white/5 border-white/10 text-white font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Holder Name</label>
                            <Input 
                              placeholder="As per bank records"
                              value={accountHolder}
                              onChange={(e) => setAccountHolder(e.target.value)}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-auto pt-8">
                  <Button 
                    type="submit" 
                    disabled={loading || !amount || (method === 'fpx' && !selectedBank && !showAddBank) || (showAddBank && (!accountNumber || !accountHolder))}
                    className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-[0_4px_30px_rgba(16,185,129,0.4)] transition-all overflow-hidden relative"
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <ShieldCheck className="w-5 h-5" />
                      {showAddBank ? 'Link & Verify' : 'Verify & Top Up'}
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SecurityVerificationModal 
        isOpen={isVerifying} 
        onClose={() => setIsVerifying(false)} 
        onVerify={handleVerificationSuccess}
      />
    </>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}