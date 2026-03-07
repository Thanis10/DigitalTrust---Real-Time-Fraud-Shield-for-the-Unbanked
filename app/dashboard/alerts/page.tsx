"use client";
import { useTransactionStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AlertsPage() {
  const { flaggedTransactions, blockedTransactions } = useTransactionStore();
  const allAlerts = [...flaggedTransactions, ...blockedTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Incident Log</h2>
          <p className="text-slate-400 mt-1">Reviewing high-risk transactions flagged by the AI engine</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Alerts</p>
            <p className="text-2xl font-bold text-white">{allAlerts.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {allAlerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center glass rounded-3xl border-dashed border-white/10"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-bold text-white">System Secure</h3>
              <p className="text-slate-500 text-sm">No fraud attempts detected in the current session.</p>
            </motion.div>
          ) : (
            allAlerts.map((alert) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={alert.id}
                className={`p-6 rounded-2xl glass border transition-all hover:border-white/20 ${
                  alert.decision === 'BLOCK' ? 'border-fraud/20 bg-fraud/5' : 'border-warning/20 bg-warning/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      alert.decision === 'BLOCK' ? 'bg-fraud/20 text-fraud' : 'bg-warning/20 text-warning'
                    }`}>
                      {alert.decision === 'BLOCK' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">
                          {alert.decision === 'BLOCK' ? 'Fraud Blocked' : 'Suspicious Activity'}
                        </h3>
                        <Badge variant={alert.decision === 'BLOCK' ? 'fraud' : 'warning'}>
                          RISK {alert.risk_score}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed max-w-xl">
                        {alert.reason}
                      </p>
                      <div className="flex flex-wrap gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-primary" /> {format(new Date(alert.timestamp), 'HH:mm:ss')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" /> {alert.location}
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          ID: #{alert.id.split('-')[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
