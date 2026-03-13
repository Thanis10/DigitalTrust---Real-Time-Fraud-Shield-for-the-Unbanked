import { ArrowDownLeft, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useWalletStore, Transaction } from '@/store';
import { format } from 'date-fns';
import { useState } from 'react';
import TransactionDetailsModal from './TransactionDetailsModal';
import TransactionItem from './TransactionItem';

const STATIC_MOCK_TXNS = [
  { id: '1', name: 'Online Shopping', desc: 'Today', amount: -120.00, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: '2', name: 'Taxi Ride', desc: 'Today', amount: -25.00, icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: '3', name: 'Salary', desc: 'Yesterday', amount: 2000.00, icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

export default function TransactionList() {
  const { transactionHistory } = useWalletStore();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const allTxns = [
    ...transactionHistory.map(t => ({
      id: t.id,
      name: 'Transfer',
      desc: format(new Date(t.timestamp), 'MMM d, h:mm a'),
      amount: -t.amount, 
      icon: ArrowUpRight,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      isDynamic: true,
      originalTx: t
    })),
    ...STATIC_MOCK_TXNS.map(t => ({
      ...t,
      originalTx: {
        id: t.id,
        user_id: 'me',
        amount: t.amount,
        location: 'Local',
        device_id: 'Current Device',
        timestamp: new Date().toISOString(),
        risk_score: 0,
        decision: 'APPROVE' as const,
        reason: t.name
      }
    }))
  ].slice(0, 6);

  return (
    <div className="pb-8 relative">
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="text-lg font-bold text-white tracking-tight">Transaction</h3>
        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">See All</button>
      </div>
      <div>
        {allTxns.map((tx, i) => (
          <TransactionItem 
            key={tx.id} 
            transaction={tx} 
            index={i} 
            onClick={() => setSelectedTx(tx.originalTx)} 
          />
        ))}
      </div>

      <TransactionDetailsModal 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  );
}