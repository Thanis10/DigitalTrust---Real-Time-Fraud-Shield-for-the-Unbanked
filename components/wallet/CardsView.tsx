import PaymentCard from './PaymentCard';
import BankCard from './BankCard';
import { motion } from 'framer-motion';
import { Plus, Settings, CreditCard, Landmark } from 'lucide-react';
import { useState } from 'react';
import AddCardModal from './AddCardModal';
import { useWalletStore } from '@/store';

export default function CardsView() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const cards = useWalletStore((state) => state.cards);
  const bankAccounts = useWalletStore((state) => state.bankAccounts);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">My Methods</h2>
          <p className="text-sm text-slate-400">Manage your cards & banks</p>
        </div>
        <button 
          onClick={() => setIsAddCardOpen(true)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Credit/Debit Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Payment Cards</span>
          </div>
          {cards.map((card) => (
            <PaymentCard key={card.id} card={card} />
          ))}
        </div>

        {/* Bank Accounts */}
        {bankAccounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Bank Accounts</span>
            </div>
            {bankAccounts.map((bank) => (
              <BankCard key={bank.id} bank={bank} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Card Settings</span>
          <Settings className="w-4 h-4 text-slate-400" />
        </h3>
        
        <div className="space-y-4">
          {[
            { label: 'Online Payments', enabled: true },
            { label: 'ATM Withdrawals', enabled: true },
            { label: 'International Usage', enabled: false },
          ].map((setting, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-slate-300">{setting.label}</span>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${setting.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddCardModal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} />
    </motion.div>
  );
}