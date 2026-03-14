"use client";
import AnalyticsChart from './AnalyticsChart';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, ArrowDownRight, ShieldCheck, TrendingUp, 
  Wallet, DollarSign, Zap, Info, ChevronRight 
} from 'lucide-react';
import { useWalletStore } from '@/store';

export default function AnalyticsView() {
  const { t, locationCurrency } = useWalletStore();

  const SUMMARY_CARDS = [
    { 
      label: t('income'), 
      value: '2,400', 
      trend: '+15%', 
      icon: ArrowUpRight, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      label: t('expenses'), 
      value: '1,000', 
      trend: '+5%', 
      icon: ArrowDownRight, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    { 
      label: t('ai_savings'), 
      value: '150', 
      trend: 'Protected', 
      icon: ShieldCheck, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-32"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">{t('analytics')}</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('monthly_overview')}</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
           <TrendingUp className="w-4 h-4 text-indigo-400" />
           <span className="text-xs font-black text-white">+12.5%</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {SUMMARY_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-[2rem] border ${card.border} ${card.bg} flex items-center justify-between relative overflow-hidden`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{card.label}</p>
                <h3 className="text-xl font-black text-white">{locationCurrency.symbol}{card.value}</h3>
              </div>
            </div>
            <div className="text-right relative z-10">
               <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${card.bg} ${card.color} border ${card.border}`}>
                 {card.trend}
               </span>
            </div>
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl ${card.bg} opacity-50`} />
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <AnalyticsChart />

      {/* AI Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-xs">{t('ai_insights')}</h3>
        </div>

        <div className="space-y-3">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-start gap-4 relative overflow-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
               <Info className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 space-y-1">
               <h4 className="text-sm font-black text-white uppercase tracking-tight">Spending Alert</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                 Your spending on <strong>Food/Market</strong> is up by 15% compared to last week. Consider moving extra funds to your Secure Vault.
               </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 mt-2 group-hover:text-white transition-colors" />
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-4 relative overflow-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
               <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 space-y-1">
               <h4 className="text-sm font-black text-white uppercase tracking-tight">Security Milestone</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                 You've successfully protected <strong>{locationCurrency.symbol}150</strong> from potential phishing attempts this month using the AI Shield.
               </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 mt-2 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}