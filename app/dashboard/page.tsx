"use client";
import { useState } from 'react';
import MetricsCards from '@/components/dashboard/MetricsCards';
import TransactionTable from '@/components/dashboard/TransactionTable';
import AIExplanationPanel from '@/components/dashboard/AIExplanationPanel';
import FraudTrendChart from '@/components/charts/FraudTrendChart';
import StatusPieChart from '@/components/charts/StatusPieChart';
import RiskDistributionChart from '@/components/charts/RiskDistributionChart';
import FraudHeatmap from '@/components/dashboard/FraudHeatmap';
import { Transaction } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, PieChart, BarChart3, Globe } from 'lucide-react';

export default function Dashboard() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Metrics Row */}
      <MetricsCards />

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              FRAUD RISK TREND (LAST 10 EVENTS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FraudTrendChart />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              DECISION DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Row */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Inference latency: ~180ms</span>
          </div>
          <TransactionTable onSelect={setSelectedTxn} />
        </div>
        
        {/* Risk Intel Row */}
        <div className="space-y-8">
          <Card className="glass">
            <CardHeader className="pb-2 text-primary font-bold">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                GLOBAL FRAUD HEATMAP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FraudHeatmap />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                RISK SCORE DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskDistributionChart />
            </CardContent>
          </Card>

          <Card className="glass border-primary/20 bg-primary/5">
             <CardHeader className="pb-2">
               <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-4 h-4" />
                 AI SYSTEM STATUS
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-slate-400 uppercase font-bold">Model Version</span>
                   <span className="text-xs font-bold text-white">ieee-hybrid-v4</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-slate-400 uppercase font-bold">TPU Load</span>
                   <span className="text-xs font-bold text-success">Optimal (24%)</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-slate-400 uppercase font-bold">Uptime</span>
                   <span className="text-xs font-bold text-white">12.4 Days</span>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {selectedTxn && (
          <AIExplanationPanel 
            transaction={selectedTxn} 
            onClose={() => setSelectedTxn(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
