"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { useWalletStore } from '@/store';

const SPENDING_DATA = [
  { name: 'Food', value: 450, color: '#8b5cf6' },
  { name: 'Transport', value: 300, color: '#6366f1' },
  { name: 'Bills', value: 150, color: '#ec4899' },
  { name: 'Personal', value: 100, color: '#10b981' },
];

const TREND_DATA = [
  { day: 'Mon', income: 400, expense: 240 },
  { day: 'Tue', income: 300, expense: 139 },
  { day: 'Wed', income: 200, expense: 980 },
  { day: 'Thu', income: 278, expense: 390 },
  { day: 'Fri', income: 189, expense: 480 },
  { day: 'Sat', income: 239, expense: 380 },
  { day: 'Sun', income: 349, expense: 430 },
];

export default function AnalyticsChart() {
  const { t, locationCurrency } = useWalletStore();
  const [view, setActiveView] = useState<'spending' | 'trend'>('spending');

  return (
    <div className="space-y-6">
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mx-1">
        <button
          onClick={() => setActiveView('spending')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            view === 'spending' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <PieIcon className="w-4 h-4" /> {t('spending_breakdown')}
        </button>
        <button
          onClick={() => setActiveView('trend')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            view === 'trend' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> {t('transaction_trend')}
        </button>
      </div>

      <motion.div 
        layout
        className="relative bg-slate-900/60 rounded-[2.5rem] p-6 border border-white/5 shadow-2xl backdrop-blur-xl overflow-hidden mx-1"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {view === 'spending' ? (
            <motion.div
              key="spending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Reduced size chart to make space for labels */}
              <div className="w-40 h-40 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SPENDING_DATA}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      {SPENDING_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{t('expenses')}</span>
                  <span className="text-lg font-black text-white">{locationCurrency.symbol}1,000</span>
                </div>
              </div>

              {/* Grid layout for labels to ensure visibility */}
              <div className="w-full grid grid-cols-2 gap-3">
                {SPENDING_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                      <span className="text-[10px] font-bold text-slate-300 truncate max-w-[60px]">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-white">{locationCurrency.symbol}{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="trend"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="h-64 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}