"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useWalletStore, Transaction } from '@/store';
import Link from 'next/link';
import { 
  ChevronLeft, UserCircle, Eye, EyeOff, 
  ArrowUpRight, ArrowDownToLine, Plus, MoreHorizontal, 
  Zap, Percent, Gift, ArrowRight, ShoppingBag, ArrowDownLeft,
  CreditCard, TrendingUp, Award
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';

// Keep non-dashboard views imported
import AnalyticsView from '@/components/wallet/AnalyticsView';
import CardsView from '@/components/wallet/CardsView';
import ProfileView from '@/components/wallet/ProfileView';

// Modals & Nav
import SendMoneyModal from '@/components/wallet/SendMoneyModal';
import RiskResultModal from '@/components/wallet/RiskResultModal';
import BottomNavigation, { TabType } from '@/components/wallet/BottomNavigation';
import TopUpModal from '@/components/wallet/TopUpModal';
import TransactionDetailsModal from '@/components/wallet/TransactionDetailsModal';

const PROMOS = [
  {
    id: 1,
    title: 'Explore your financial report and make insights',
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20 border-indigo-500/30',
    glow: 'bg-fuchsia-500/20',
    action: 'Learn More'
  },
  {
    id: 2,
    title: 'Get 5% Cashback on your next grocery payment',
    icon: Percent,
    color: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 border-emerald-500/30',
    glow: 'bg-teal-500/20',
    action: 'Claim Now'
  },
  {
    id: 3,
    title: 'Invite a friend and earn up to $50 reward',
    icon: Gift,
    color: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    glow: 'bg-orange-500/20',
    action: 'Invite Now'
  }
];

const STATIC_MOCK_TXNS = [
  { id: '1', name: 'Online Shopping', desc: 'Today', amount: -120.00, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: '2', name: 'Taxi Ride', desc: 'Today', amount: -25.00, icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: '3', name: 'Salary', desc: 'Yesterday', amount: 2000.00, icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

function HomeDashboard({ onSendClick }: { onSendClick: () => void }) {
  const { walletBalance, transactionHistory } = useWalletStore();
  
  // Header State
  const currentDate = format(new Date(), 'MMMM d, yyyy');

  // Balance State
  const [displayBalance, setDisplayBalance] = useState(0);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Slider State
  const sliderRef = useRef<HTMLDivElement>(null);

  // Transactions State
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Balance Animation
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setDisplayBalance(walletBalance * (currentStep / steps));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [walletBalance]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMOS.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* 1. HEADER - Adjusted spacing */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-1.5">
            Hello, Alex
          </h1>
          <p className="text-sm font-medium text-slate-400">
            {currentDate}
          </p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden shadow-xl"
        >
          <UserCircle className="w-8 h-8 text-slate-300 relative z-10" />
          <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 z-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        </motion.div>
      </motion.div>

      {/* 2. TOTAL BALANCE CARD - Enhanced design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-[2.5rem] p-[1px] group"
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
        
        <div className="relative w-full bg-gradient-to-br from-[#0c021a] to-[#1a0f2e] backdrop-blur-2xl rounded-[2.5rem] p-8 overflow-hidden z-10 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.3)]">
          {/* Animated background orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-[60px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none animate-pulse delay-1000" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-indigo-200 tracking-wide">
                  Total Balance
                </p>
                <button 
                  onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                  className="text-slate-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full backdrop-blur-sm"
                >
                  {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              
              <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-lg h-[72px] sm:h-[80px] flex items-center">
                <AnimatePresence mode="wait">
                  {isBalanceHidden ? (
                    <motion.span 
                      key="hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="tracking-widest text-4xl"
                    >
                      ••••••
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="visible"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      ${displayBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.span>
                  )}
                </AnimatePresence>
              </h2>
            </div>
            
            {/* Added small stats */}
            <div className="bg-white/5 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          
          {/* Added mini graph visualization */}
          <div className="mt-6 flex items-end gap-1 h-8">
            {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
              <div key={i} className="flex-1 flex justify-center">
                <div 
                  className="w-full max-w-[8px] bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg opacity-60 hover:opacity-100 transition-opacity"
                  style={{ height: `${height * 0.5}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. QUICK ACTIONS - Improved spacing and design */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: CreditCard, label: 'Cards', onClick: () => {}, gradient: 'from-blue-500 to-indigo-500' },
          { icon: ArrowUpRight, label: 'Send', onClick: onSendClick, gradient: 'from-indigo-500 to-purple-500' },
          { icon: Plus, label: 'Top Up', onClick: () => setIsTopUpOpen(true), gradient: 'from-purple-500 to-pink-500' },
          { icon: Award, label: 'Rewards', onClick: () => {}, gradient: 'from-amber-500 to-orange-500' },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} p-[1px] shadow-xl`}>
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center group-hover:bg-opacity-80 transition-all">
                <action.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* 4. PROMO SLIDER - Enhanced cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Special Offers</h3>
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">3 Active</span>
        </div>
        
        <div ref={sliderRef} className="overflow-hidden rounded-2xl">
          <motion.div 
            animate={{ x: `-${currentSlide * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex w-full"
          >
            {PROMOS.map((promo) => (
              <div key={promo.id} className="relative w-full min-w-full p-[1px] shrink-0">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${promo.color} opacity-50 blur-sm`} />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-5 flex items-center gap-4 overflow-hidden border border-white/5 shadow-xl">
                  <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[40px] pointer-events-none ${promo.glow}`} />
                  
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${promo.iconBg} backdrop-blur-sm`}>
                    <promo.icon className={`w-7 h-7 ${promo.iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug pr-2">
                      {promo.title}
                    </h3>
                    <button className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${promo.iconColor} hover:opacity-80 group/btn`}>
                      {promo.action} 
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Pagination Dots - Improved */}
        <div className="flex justify-center gap-2 mt-4">
          {PROMOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'w-8 bg-gradient-to-r from-indigo-400 to-purple-400' 
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* 5. TRANSACTIONS - Enhanced styling */}
      <div className="pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {allTxns.map((tx, i) => {
            const isPositive = tx.amount > 0 && !tx.isDynamic;
            const Icon = tx.icon || ArrowUpRight;

            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.4 }}
                whileTap={{ scale: 0.98 }}
                key={tx.id}
                onClick={() => setSelectedTx(tx.originalTx)}
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-900/70 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.bg || 'bg-indigo-500/10'} shadow-inner group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${tx.color || 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {tx.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      {tx.desc}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-black ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
                    {isPositive ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                  {tx.isDynamic && tx.originalTx?.decision && (
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded mt-1.5 inline-block ${
                      tx.originalTx.decision === 'APPROVE' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                      tx.originalTx.decision === 'FLAG' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
                      'text-red-400 bg-red-500/10 border border-red-500/20'
                    }`}>
                      {tx.originalTx.decision === 'APPROVE' ? '✓ Protected' : `⚠ ${tx.originalTx.decision}`}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <TransactionDetailsModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </motion.div>
  );
}

export default function WalletPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const { 
    latestRiskScore, latestDecision, latestExplanation, 
    setTransactionResult, clearTransactionResult,
    deductBalance, addWalletTransaction 
  } = useWalletStore();

  const handleSendTransaction = async (data: { user_id: string; amount: number; location: string; device_id: string; recipient: string }) => {
    setLoading(true);
    try {
      const payload = {
        user_id: data.user_id,
        amount: data.amount,
        location: data.location,
        device_id: data.device_id,
        timestamp: new Date().toISOString()
      };

      const res = await axios.post('/api/risk-score', payload);
      const result = res.data;

      setTransactionResult(result.risk_score, result.decision, result.reason);
      
      if (result.decision === 'APPROVE') {
        deductBalance(data.amount);
        addWalletTransaction({
          id: `WTX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          user_id: payload.user_id,
          amount: data.amount, 
          location: payload.location,
          device_id: payload.device_id,
          timestamp: payload.timestamp,
          risk_score: result.risk_score,
          decision: result.decision,
        });
      }
      
      setIsSendModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02000a] to-[#040012] flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-indigo-500/30 relative">
      
      {/* Desktop Exit to Home - Enhanced */}
      <Link href="/" className="absolute top-8 left-8 hidden sm:flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-20 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Website</span>
      </Link>

      {/* Mobile Frame Container - Enhanced */}
      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] relative bg-gradient-to-b from-slate-950 to-[#030014] sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col">
        
        {/* Mobile Exit to Home */}
        <Link href="/" className="sm:hidden absolute top-12 left-5 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors z-50 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Exit</span>
        </Link>
        
        {/* Background Gradients - Enhanced */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-transparent pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" />
        <div className="absolute top-60 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse delay-700" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id=%22grid%22%20width=%2260%22%20height=%2260%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2060%200%20L%200%200%200%2060%22%20fill=%22none%22%20stroke=%22rgba(99,102,241,0.03)%22%20stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-50 pointer-events-none z-0" />

        {/* Content Scrollable Area - Adjusted padding */}
        <div className="flex-1 overflow-y-auto px-5 pt-20 sm:pt-12 pb-40 scrollbar-hide relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <HomeDashboard key="home" onSendClick={() => setIsSendModalOpen(true)} />}
            {activeTab === 'analytics' && <AnalyticsView key="analytics" />}
            {activeTab === 'cards' && <CardsView key="cards" />}
            {activeTab === 'profile' && <ProfileView key="profile" />}
          </AnimatePresence>
        </div>

        {/* Floating Bottom Nav - Enhanced */}
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddClick={() => setIsSendModalOpen(true)} 
        />

        {/* Modals */}
        <SendMoneyModal 
          isOpen={isSendModalOpen} 
          onClose={() => setIsSendModalOpen(false)} 
          onSend={handleSendTransaction}
          loading={loading}
        />
        
        <RiskResultModal 
          decision={latestDecision}
          score={latestRiskScore}
          explanation={latestExplanation}
          onClose={clearTransactionResult}
        />

        {/* Splash Screen - Enhanced */}
        <AnimatePresence>
          {showSplash && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-[100] bg-gradient-to-b from-slate-950 to-[#030014] flex flex-col items-center justify-center"
            >
              <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none" />
              
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-indigo-500/20 animate-ping absolute" />
                <div className="w-48 h-48 rounded-full border border-purple-500/20 animate-ping delay-300 absolute" />
              </div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center relative z-10"
              >
                <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_60px_rgba(99,102,241,0.6)] mb-6 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2rem] flex items-center justify-center p-5">
                    <Image src="/logo.png" alt="DigitalTrust Logo" width={64} height={64} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight drop-shadow-md mb-2">
                  DigitalTrust
                </h1>
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">
                  Secure Wallet
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}