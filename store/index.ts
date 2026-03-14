import { create } from 'zustand';

export type Transaction = {
  id: string;
  user_id: string;
  recipient?: string;
  amount: number;
  location: string;
  device_id: string;
  account_type?: 'MAIN' | 'VAULT';
  timestamp: string;
  risk_score: number;
  decision: 'APPROVE' | 'FLAG' | 'BLOCK';
  reason?: string;
  confidence?: number;
};

// Initial mock data to prevent "empty" states on first load
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-K82J91L',
    user_id: 'USR-1029',
    amount: 1250.00,
    location: 'Singapore',
    device_id: 'iPhone 15 Pro',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    risk_score: 12,
    decision: 'APPROVE',
    confidence: 99.2,
  },
  {
    id: 'TXN-M72N83P',
    user_id: 'USR-8821',
    amount: 4200.50,
    location: 'Moscow',
    device_id: 'Android Emulator',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    risk_score: 88,
    decision: 'BLOCK',
    reason: 'High-risk location and device fingerprint mismatch.',
    confidence: 94.5,
  },
  {
    id: 'TXN-B12Q64Z',
    user_id: 'USR-3042',
    amount: 85.00,
    location: 'Jakarta',
    device_id: 'Samsung Galaxy S23',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    risk_score: 54,
    decision: 'FLAG',
    reason: 'Unusual late-night transaction frequency.',
    confidence: 82.1,
  }
];

export type Alert = {
  id: string;
  message: string;
  type: 'FLAG' | 'BLOCK';
  timestamp: string;
};

interface TransactionStore {
  transactions: Transaction[];
  flaggedTransactions: Transaction[];
  blockedTransactions: Transaction[];
  liveStreamEnabled: boolean;
  addTransaction: (t: Transaction) => void;
  toggleLiveStream: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: INITIAL_TRANSACTIONS,
  flaggedTransactions: INITIAL_TRANSACTIONS.filter(t => t.decision === 'FLAG'),
  blockedTransactions: INITIAL_TRANSACTIONS.filter(t => t.decision === 'BLOCK'),
  liveStreamEnabled: false,
  addTransaction: (t) =>
    set((state) => {
      const newTransactions = [t, ...state.transactions].slice(0, 100);
      return {
        transactions: newTransactions,
        flaggedTransactions: t.decision === 'FLAG' ? [t, ...state.flaggedTransactions].slice(0, 50) : state.flaggedTransactions,
        blockedTransactions: t.decision === 'BLOCK' ? [t, ...state.blockedTransactions].slice(0, 50) : state.blockedTransactions,
      };
    }),
  toggleLiveStream: () => set((state) => ({ liveStreamEnabled: !state.liveStreamEnabled })),
}));

interface WalletStore {
  walletBalance: number;
  vaultBalance: number;
  vaultLocked: boolean;
  transactionHistory: Transaction[];
  latestRiskScore: number | null;
  latestDecision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  latestExplanation: string | null;
  latestUserMessage: string | null;
  latestVerification: 'biometric' | 'whatsapp_otp' | 'none' | null;
  latestChannel: 'MAIN' | 'VAULT' | null;
  latestConfidence: number | null;
  latestAgentReport: string | null;
  edgeFallbackUsed: boolean;
  addWalletTransaction: (t: Transaction) => void;
  deductBalance: (amount: number) => void;
  deductVault: (amount: number) => void;
  moveToVault: (amount: number) => void;
  releaseFromVault: (amount: number) => void;
  lockVault: () => void;
  unlockVault: () => void;
  setTransactionResult: (data: {
    score: number;
    decision: 'APPROVE' | 'FLAG' | 'BLOCK';
    explanation?: string;
    userMessage?: string;
    verification?: 'biometric' | 'whatsapp_otp' | 'none';
    channel?: 'MAIN' | 'VAULT';
    confidence?: number;
    edgeFallbackUsed?: boolean;
    agentReport?: string;
  }) => void;
  clearTransactionResult: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  walletBalance: 18475.00,
  vaultBalance: 4800.00,
  vaultLocked: false,
  transactionHistory: INITIAL_TRANSACTIONS.filter(t => t.user_id === 'USR-8821' && t.decision === 'APPROVE'),
  latestRiskScore: null,
  latestDecision: null,
  latestExplanation: null,
  latestUserMessage: null,
  latestVerification: null,
  latestChannel: null,
  latestConfidence: null,
  latestAgentReport: null,
  edgeFallbackUsed: false,
  addWalletTransaction: (t) =>
    set((state) => ({ transactionHistory: [t, ...state.transactionHistory] })),
  deductBalance: (amount) =>
    set((state) => ({ walletBalance: Math.max(0, state.walletBalance - amount) })),
  deductVault: (amount) =>
    set((state) => state.vaultLocked ? state : ({ vaultBalance: Math.max(0, state.vaultBalance - amount) })),
  moveToVault: (amount) =>
    set((state) => {
      if (amount <= 0 || amount > state.walletBalance) return state;
      return {
        walletBalance: state.walletBalance - amount,
        vaultBalance: state.vaultBalance + amount
      };
    }),
  releaseFromVault: (amount) =>
    set((state) => {
      if (state.vaultLocked || amount <= 0 || amount > state.vaultBalance) return state;
      return {
        walletBalance: state.walletBalance + amount,
        vaultBalance: state.vaultBalance - amount
      };
    }),
  lockVault: () => set({ vaultLocked: true }),
  unlockVault: () => set({ vaultLocked: false }),
  setTransactionResult: ({ score, decision, explanation, userMessage, verification, channel, confidence, edgeFallbackUsed, agentReport }) =>
    set({ 
      latestRiskScore: score, 
      latestDecision: decision, 
      latestExplanation: explanation || null,
      latestUserMessage: userMessage || null,
      latestVerification: verification || null,
      latestChannel: channel || null,
      latestConfidence: typeof confidence === 'number' ? confidence : null,
      latestAgentReport: agentReport || null,
      edgeFallbackUsed: Boolean(edgeFallbackUsed)
    }),    
  clearTransactionResult: () =>
    set({ 
      latestRiskScore: null, 
      latestDecision: null, 
      latestExplanation: null,
      latestUserMessage: null,
      latestVerification: null,
      latestChannel: null,
      latestConfidence: null,
      latestAgentReport: null,
      edgeFallbackUsed: false
    })
}));

interface RiskStore {
  latestRiskScore: number;
  latestDecision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  fraudAlerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  setLatestEvaluation: (score: number, decision: 'APPROVE' | 'FLAG' | 'BLOCK') => void;
}

export const useRiskStore = create<RiskStore>((set) => ({
  latestRiskScore: 0,
  latestDecision: null,
  fraudAlerts: [],
  addAlert: (alert) =>
    set((state) => ({ fraudAlerts: [alert, ...state.fraudAlerts].slice(0, 5) })),
  removeAlert: (id) =>
    set((state) => ({ fraudAlerts: state.fraudAlerts.filter(a => a.id !== id) })),
  setLatestEvaluation: (score, decision) =>
    set({ latestRiskScore: score, latestDecision: decision }),
}));
