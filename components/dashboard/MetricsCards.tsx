"use client";
import { useTransactionStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';

export default function MetricsCards() {
  const { transactions, flaggedTransactions, blockedTransactions } = useTransactionStore();

  const total = transactions.length;
  const flagged = flaggedTransactions.length;
  const blocked = blockedTransactions.length;
  const avgRisk = total > 0 ? (transactions.reduce((acc, t) => acc + t.risk_score, 0) / total).toFixed(1) : '0.0';

  const metrics = [
    { title: 'Total Transactions', value: total, icon: Activity, color: 'text-primary' },
    { title: 'Flagged Transactions', value: flagged, icon: AlertTriangle, color: 'text-warning' },
    { title: 'Blocked Fraud', value: blocked, icon: ShieldAlert, color: 'text-fraud' },
    { title: 'Avg Risk Score', value: avgRisk, icon: TrendingUp, color: 'text-secondary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="glass group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white tracking-tight">{m.value}</div>
              {/* Subtle sparkline effect */}
              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "60%" }}
                   className={`h-full ${m.color === 'text-primary' ? 'bg-primary' : m.color === 'text-warning' ? 'bg-warning' : m.color === 'text-fraud' ? 'bg-fraud' : 'bg-secondary'}`} 
                 />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
