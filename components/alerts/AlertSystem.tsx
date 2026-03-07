"use client";
import { useEffect, useState } from 'react';
import { useTransactionStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

export default function AlertSystem() {
  const { transactions } = useTransactionStore();
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (transactions.length > 0) {
      const latest = transactions[0];
      if (latest.decision === 'BLOCK' || latest.decision === 'FLAG') {
        const newAlert = {
          id: Math.random().toString(36).substr(2, 9),
          ...latest
        };
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 3));
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setActiveAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        }, 5000);
      }
    }
  }, [transactions]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 w-80 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-2xl glass border shadow-2xl flex gap-4 items-start ${
              alert.decision === 'BLOCK' ? 'border-fraud/50 bg-fraud/10' : 'border-warning/50 bg-warning/10'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              alert.decision === 'BLOCK' ? 'bg-fraud/20 text-fraud' : 'bg-warning/20 text-warning'
            }`}>
              {alert.decision === 'BLOCK' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">
                {alert.decision === 'BLOCK' ? 'Fraud Blocked' : 'Suspicious Activity'}
              </h4>
              <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">
                {alert.reason || `Transaction of $${alert.amount} flagged for review.`}
              </p>
            </div>
            <button 
              onClick={() => setActiveAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
