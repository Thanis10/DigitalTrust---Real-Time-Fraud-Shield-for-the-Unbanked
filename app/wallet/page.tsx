"use client";
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletStore, useRiskStore } from '@/store';
import { Shield, Send, ArrowRightLeft, ShieldAlert, CheckCircle, Smartphone, Wifi, Battery, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';

export default function WalletSimulator() {
  const { walletBalance, transactionHistory, addWalletTransaction, deductBalance } = useWalletStore();
  const { setLatestEvaluation } = useRiskStore();
  
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    
    setLoading(true);
    const parsedAmount = parseFloat(amount);

    try {
      const payload = {
        user_id: 'USR-8821',
        amount: parsedAmount,
        location: 'Singapore',
        device_id: 'iPhone 15 Pro',
      };

      const res = await axios.post('/api/risk-score', payload);
      const data = res.data;

      setLatestEvaluation(data.risk_score, data.decision);
      setModalData({ ...data, amount: parsedAmount, recipient });

      if (data.decision === 'APPROVE') {
        deductBalance(parsedAmount);
        addWalletTransaction({
          id: `WTX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          user_id: payload.user_id,
          amount: parsedAmount,
          location: payload.location,
          device_id: payload.device_id,
          timestamp: new Date().toISOString(),
          risk_score: data.risk_score,
          decision: data.decision,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setAmount('');
      setRecipient('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
        <ArrowRightLeft className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        Back to Website
      </Link>

      <div className="w-full max-w-[380px] relative animate-float">
        {/* Phone Frame */}
        <div className="relative z-10 w-full rounded-[3rem] border-[12px] border-slate-900 bg-slate-950 overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.2)]">
          {/* Status Bar */}
          <div className="px-8 pt-4 pb-2 flex justify-between items-center text-[10px] font-bold text-white/40">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* App Header */}
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 p-2">
              <img src="/logo.png" alt="DigitalTrust Logo" className="w-full h-auto" />
            </div>
            <Menu className="w-6 h-6 text-slate-500" />
          </div>

          <div className="px-6 pb-6">
            <div className="mb-8">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Available Balance</p>
              <h1 className="text-4xl font-bold text-white tracking-tight">${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient ID</label>
                <Input 
                  placeholder="Wallet address or ID" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="h-12 bg-white/5 border-white/5 focus:border-primary/50 text-sm rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">$</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-14 pl-8 bg-white/5 border-white/5 focus:border-primary/50 text-xl font-bold rounded-xl"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4" disabled={loading}>
                {loading ? 'Evaluating Risk...' : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Transaction
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Recent Activity</h3>
                <span className="text-[10px] text-primary font-bold">See All</span>
              </div>
              <div className="space-y-3">
                {transactionHistory.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-slate-500 text-xs">
                    No transactions yet
                  </div>
                ) : (
                  transactionHistory.map((tx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={tx.id} 
                      className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
                          <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Payment Sent</p>
                          <p className="text-[9px] text-slate-500">{format(new Date(tx.timestamp), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white">-${tx.amount.toFixed(2)}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-1.5 w-32 bg-white/10 rounded-full mx-auto mb-2 mt-4" />
        </div>

        {/* Result Overlay */}
        <AnimatePresence>
          {modalData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md rounded-[3rem]"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center w-full"
              >
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${
                  modalData.decision === 'APPROVE' ? 'bg-success/20 text-success' : 
                  modalData.decision === 'FLAG' ? 'bg-warning/20 text-warning' : 'bg-fraud/20 text-fraud'
                }`}>
                  {modalData.decision === 'APPROVE' ? <CheckCircle className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-white">
                  {modalData.decision === 'APPROVE' ? 'Transaction Success' : 
                   modalData.decision === 'FLAG' ? 'Transaction Flagged' : 'Transaction Blocked'}
                </h2>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed px-4">
                  {modalData.reason || 'Our AI engine has evaluated this transaction for security risk.'}
                </p>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-8 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Score</span>
                    <span className={`text-sm font-bold ${
                      modalData.risk_score >= 80 ? 'text-fraud' : modalData.risk_score >= 50 ? 'text-warning' : 'text-success'
                    }`}>{modalData.risk_score}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</span>
                    <span className="text-sm font-bold text-white">${modalData.amount.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold" onClick={() => setModalData(null)}>
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-[20%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 left-[20%] w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" />
    </div>
  );
}
