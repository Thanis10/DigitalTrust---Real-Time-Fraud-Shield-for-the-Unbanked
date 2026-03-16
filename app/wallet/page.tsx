"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useWalletStore, Transaction, useTransactionStore } from '@/store';
import Link from 'next/link';
import { 
  ChevronLeft, ArrowUpRight, ArrowDownLeft, ShoppingBag, Lock, Wifi, WifiOff, CreditCard, Wallet
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';

// New Components
import WalletHeader from '@/components/wallet/WalletHeader';
import MainWalletCard from '@/components/wallet/MainWalletCard';
import SecureVaultCard from '@/components/wallet/SecureVaultCard';
import TrustShieldIndicator from '@/components/wallet/TrustShieldIndicator';
import QuickActionButtons from '@/components/wallet/QuickActionButtons';
import VoiceTransactionInput from '@/components/wallet/VoiceTransactionInput';
import FriendlyFraudAlertModal from '@/components/wallet/FriendlyFraudAlertModal';
import UserFriendlyAIExplanation from '@/components/wallet/UserFriendlyAIExplanation';
import FinancialTipsCard from '@/components/wallet/FinancialTipsCard';
import LocationAwareWallet from '@/components/wallet/LocationAwareWallet';
import SecurityVerificationModal from '@/components/wallet/SecurityVerificationModal';
import ReceiveMoneyModal from '@/components/wallet/ReceiveMoneyModal';
import FriendlyRiskResultModal from '@/components/wallet/FriendlyRiskResultModal';
import VaultTransferModal from '@/components/wallet/VaultTransferModal';

// Existing Views
import AnalyticsView from '@/components/wallet/AnalyticsView';
import CardsView from '@/components/wallet/CardsView';
import ProfileView from '@/components/wallet/ProfileView';

// Modals & Nav
import SendMoneyModal from '@/components/wallet/SendMoneyModal';
import BottomNavigation, { TabType } from '@/components/wallet/BottomNavigation';
import TopUpModal from '@/components/wallet/TopUpModal';
import TransactionDetailsModal from '@/components/wallet/TransactionDetailsModal';

const STATIC_MOCK_TXNS = [
  { id: '1', name: 'Online Shopping', desc: 'Today', amount: -120.00, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: '2', name: 'Taxi Ride', desc: 'Today', amount: -25.00, icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: '3', name: 'Salary', desc: 'Yesterday', amount: 2000.00, icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

function HomeDashboard({ 
  onSendClick, 
  onTopUpClick, 
  onReceiveClick, 
  onVaultTransferClick,
  onVerifyClick,
  isOffline
}: { 
  onSendClick: () => void;
  onTopUpClick: () => void;
  onReceiveClick: () => void;
  onVaultTransferClick: (mode: 'deposit' | 'withdraw') => void;
  onVerifyClick: () => void;
  isOffline: boolean;
}) {
  const { transactionHistory, locationCurrency, latestDecision, latestExplanation, isUserVerified, t } = useWalletStore();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [activeCard, setActiveCard] = useState<'main' | 'vault'>('main');

  const allTxns = [
    ...transactionHistory.map(t => ({
      id: t.id,
      name: t.reason || 'Transfer',
      desc: `${format(new Date(t.timestamp), 'MMM d, h:mm a')}${t.account_type === 'VAULT' ? ' • Vault' : ''}`,
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
        id: t.id, user_id: 'me', amount: t.amount, location: 'Local', device_id: 'Current Device',
        timestamp: new Date().toISOString(), risk_score: 0, decision: 'APPROVE' as const, reason: t.name
      }
    }))
  ].slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <WalletHeader isOffline={isOffline} />
      
      <div className="relative h-[330px] w-full mt-10 mb-4">
        {/* Secure Vault Card Slot */}
        <motion.div 
          animate={{ 
            y: activeCard === 'vault' ? 30 : 0,
            scale: activeCard === 'vault' ? 1 : 0.96,
            zIndex: activeCard === 'vault' ? 30 : 10,
            opacity: activeCard === 'vault' ? 1 : 0.85
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={() => setActiveCard('vault')}
          className="absolute inset-0 cursor-pointer"
        >
          <div className={`absolute -top-7 right-8 px-4 py-1.5 rounded-t-xl border-t border-x border-indigo-500/30 bg-slate-900 flex items-center gap-2 transition-all ${activeCard === 'vault' ? 'opacity-0' : 'opacity-100 shadow-[0_-5px_15px_rgba(99,102,241,0.2)]'}`}>
             <Lock className="w-2.5 h-2.5 text-indigo-400" />
             <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">{t('secure_vault')}</span>
          </div>
          <SecureVaultCard onMoveMoney={onVaultTransferClick} onVerifyClick={onVerifyClick} />
        </motion.div>

        {/* Main Wallet Card Slot */}
        <motion.div 
          animate={{ 
            y: activeCard === 'main' ? 30 : 0,
            scale: activeCard === 'main' ? 1 : 0.96,
            zIndex: activeCard === 'main' ? 30 : 10,
            opacity: activeCard === 'main' ? 1 : 0.85
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={() => setActiveCard('main')}
          className="absolute inset-0 cursor-pointer"
        >
          <div className={`absolute -top-7 left-8 px-4 py-1.5 rounded-t-xl border-t border-x border-purple-500/30 bg-slate-900 flex items-center gap-2 transition-all ${activeCard === 'main' ? 'opacity-0' : 'opacity-100 shadow-[0_-5px_15px_rgba(168,85,247,0.2)]'}`}>
             <Wallet className="w-2.5 h-2.5 text-purple-400" />
             <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">{t('main_wallet')}</span>
          </div>
          <MainWalletCard />
        </motion.div>
      </div>

      <div className="space-y-8 relative z-40 bg-slate-950 pt-2">
        <QuickActionButtons 
          onSendClick={onSendClick}
          onTopUpClick={onTopUpClick}
          onReceiveClick={onReceiveClick}
          onMoveToVaultClick={() => onVaultTransferClick('deposit')}
        />

        <TrustShieldIndicator />
      </div>

      <VoiceTransactionInput />

      {latestDecision === 'BLOCK' && latestExplanation && (
        <UserFriendlyAIExplanation reasons={latestExplanation.split('.').filter(r => r.trim())} />
      )}

      <FinancialTipsCard />

      <div className="pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-white">{t('recent_activity')}</h3>
          <button className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{t('see_all')}</button>
        </div>
        
        <div className="space-y-3">
          {allTxns.map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedTx(tx.originalTx)}
              className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.bg}`}>
                  <tx.icon className={`w-5 h-5 ${tx.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tx.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{locationCurrency.symbol}{Math.abs(tx.amount).toFixed(0)}
                </p>
                {tx.isDynamic && (
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">✓ AI Protected</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <TransactionDetailsModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </motion.div>
  );
}

export default function WalletPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isFraudAlertOpen, setIsFraudAlertOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [vaultMode, setVaultMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [showResultModal, setShowResultModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabType | null>(null);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [pendingVaultTransfer, setPendingVaultTransfer] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isOffline, setIsOffline] = useState(false);
  
  const addToDashboardFeed = useTransactionStore((state) => state.addTransaction);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOffline(!window.navigator.onLine);
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const { 
    latestDecision, latestRiskScore, latestExplanation, 
    latestUserMessage, latestVerification, latestChannel, latestConfidence, latestAgentReport, edgeFallbackUsed,
    setTransactionResult, clearTransactionResult,
    deductBalance, deductVault, addWalletTransaction, setShieldStatus, 
    isUserVerified, setVerified, walletBalance, vaultBalance, lockVault, unlockVault, locationCurrency, t,
    fraudEngineActive, setFraudEngineActive
  } = useWalletStore();

  useEffect(() => {
    const checkFraudStatus = async () => {
      try {
        const res = await axios.get('/api/fraud-status');
        setFraudEngineActive(res.data.active);
      } catch (e) {
        setFraudEngineActive(false);
      }
    };
    
    checkFraudStatus();
    const interval = setInterval(checkFraudStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [setFraudEngineActive]);

  const processTransaction = async (data: any) => {
    setLoading(true);
    try {
      const nowIso = new Date().toISOString();
      const sourceBalance = data.account_type === 'VAULT' ? vaultBalance : walletBalance;

      if (data.amount > sourceBalance) {
        alert('Not enough balance.');
        setLoading(false);
        return;
      }

      const payload: any = {
        user_id: data.user_id,
        amount: data.amount,
        location: data.location,
        device_id: data.device_id,
        recipient: data.recipient,
        transaction_type: data.account_type === 'VAULT' ? 'VAULT_WITHDRAWAL' : 'TRANSFER',
        account_type: data.account_type,
        currency: locationCurrency.code,
        timestamp: nowIso,
        oldbalance: sourceBalance,
        newbalance: sourceBalance - data.amount
      };

      const suspectedPhish = (() => {
        if (typeof window === 'undefined') return false;
        const recent = window.localStorage.getItem('recent_msg_text') || 'Your parcel is stuck, pay RM5 to unlock.';
        return /parcel.*unlock|click.*link|verify.*account|bonus.*claim/i.test(recent);
      })();

      if (suspectedPhish) {
        payload['phishing_flag'] = true;
        payload['phishing_text'] = 'Recent suspicious message detected.';
      }

      const res = await axios.post('/api/risk-score', payload);
      const result = res.data;

      setTransactionResult({
        score: result.risk_score,
        decision: result.decision,
        explanation: result.reason,
        userMessage: result.user_message,
        verification: result.verification?.method,
        channel: result.channel || data.account_type,
        confidence: result.confidence,
        agentReport: result.agent_report,
        edgeFallbackUsed: result.edge_fallback_used
      });
      
      const txId = `WTX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const newTx: Transaction = {
        id: txId, user_id: payload.user_id, recipient: data.recipient, amount: data.amount, 
        location: payload.location, device_id: payload.device_id, timestamp: payload.timestamp,
        risk_score: result.risk_score, decision: result.decision,
        reason: result.reason || data.reference || 'Transfer',
        confidence: result.confidence, account_type: data.account_type
      };

      if (result.decision === 'APPROVE') {
        if (data.account_type === 'VAULT') {
          deductVault(data.amount);
          unlockVault();
        } else {
          deductBalance(data.amount);
        }
        addWalletTransaction(newTx);
        addToDashboardFeed(newTx);
        setIsSendModalOpen(false);
        setPendingTransaction(null);
        setShowResultModal(true);
      } else if (result.decision === 'FLAG') {
        setShieldStatus('alert');
        setIsFraudAlertOpen(true);
        setIsSendModalOpen(false);
      } else if (result.decision === 'BLOCK') {
        if (data.account_type === 'VAULT' || result.vault_locked) {
          lockVault();
        }
        setIsSendModalOpen(false);
        setPendingTransaction(null);
        setShowResultModal(true);
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransactionRequest = (data: any) => {
    setPendingTransaction(data);
    setIsSecurityOpen(true);
  };

  const handleVaultTransferRequest = (mode: 'deposit' | 'withdraw') => {
    setVaultMode(mode);
    if (!isUserVerified) {
      setPendingVaultTransfer(true);
      setIsSecurityOpen(true);
    } else {
      setIsVaultModalOpen(true);
    }
  };

  const handleVerify = (method: string) => {
    setIsFraudAlertOpen(false);
    setShieldStatus('active');
    clearTransactionResult();
  };

  const handleSecurityVerify = () => {
    setVerified(true);
    setIsSecurityOpen(false);
    if (pendingTransaction) {
      processTransaction(pendingTransaction);
    } else if (pendingVaultTransfer) {
      setIsVaultModalOpen(true);
      setPendingVaultTransfer(false);
    } else if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'cards' && !isUserVerified) {
      setPendingTab('cards');
      setIsSecurityOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#02000a] flex items-center justify-center p(0 sm:p-4 font-sans selection:bg-indigo-500/30 relative">
      <LocationAwareWallet />
      
      <Link href="/" className="absolute top-8 left-8 hidden sm:flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-20 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Exit</span>
      </Link>

      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] relative bg-slate-950 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col">
        <Link href="/" className="sm:hidden absolute top-12 left-5 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors z-50 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Exit</span>
        </Link>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" />
        
        <div className="flex-1 overflow-y-auto px-5 pt-24 sm:pt-12 pb-40 scrollbar-hide relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <HomeDashboard 
                key="home" 
                onSendClick={() => setIsSendModalOpen(true)}
                onTopUpClick={() => setIsTopUpOpen(true)}
                onReceiveClick={() => setIsReceiveModalOpen(true)}
                onVaultTransferClick={handleVaultTransferRequest}
                onVerifyClick={() => setIsSecurityOpen(true)}
                isOffline={isOffline}
              />
            )}
            {activeTab === 'analytics' && <AnalyticsView key="analytics" />}
            {activeTab === 'cards' && <CardsView key="cards" />}
            {activeTab === 'profile' && <ProfileView key="profile" />}
          </AnimatePresence>
        </div>

        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} onAddClick={() => setIsSendModalOpen(true)} />

        <SendMoneyModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} onSend={handleSendTransactionRequest} loading={loading} />
        <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
        <ReceiveMoneyModal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} />
        <VaultTransferModal isOpen={isVaultModalOpen} onClose={() => setIsVaultModalOpen(false)} mode={vaultMode} />
        <FriendlyFraudAlertModal isOpen={isFraudAlertOpen} onClose={() => setIsFraudAlertOpen(false)} onVerify={handleVerify} />
        <SecurityVerificationModal isOpen={isSecurityOpen} onClose={() => { setIsSecurityOpen(false); setPendingTab(null); setPendingTransaction(null); setPendingVaultTransfer(false); }} onVerify={handleSecurityVerify} />
        {showResultModal && (
          <FriendlyRiskResultModal 
            decision={latestDecision} score={latestRiskScore} explanation={latestExplanation} userMessage={latestUserMessage}
            verification={latestVerification} channel={latestChannel} confidence={latestConfidence}
            edgeFallbackUsed={edgeFallbackUsed} agentReport={latestAgentReport}
            onClose={() => { setShowResultModal(false); clearTransactionResult(); }}
          />
        )}

        <AnimatePresence>
          {showSplash && (
            <motion.div 
              initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="absolute inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
            >
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_60px_rgba(99,102,241,0.4)] mb-6">
                  <div className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center p-5">
                    <Image src="/logo.png" alt="Logo" width={48} height={48} />
                  </div>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1">DigitalTrust</h1>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Secure Gig Wallet</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}