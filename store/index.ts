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

// Initial mock data
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-K82J91L',
    user_id: 'USR-1029',
    amount: 1250.00,
    location: 'Singapore',
    device_id: 'iPhone 15 Pro',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    risk_score: 12,
    decision: 'APPROVE',
    confidence: 99.2,
  }
];

export const TRANSLATIONS: Record<string, Record<string, any>> = {
  'en-PH': {
    greeting: 'Good Morning',
    earnings: "Today's Earnings",
    main_wallet: 'Main Wallet',
    secure_vault: 'Secure Vault',
    shield_active: 'Shield Status: Active',
    shield_alert: 'Shield Alert',
    send: 'Send',
    receive: 'Receive',
    topup: 'Top Up',
    to_vault: 'To Vault',
    recent_activity: 'Recent Activity',
    see_all: 'See All',
    daily_spend: 'Daily Spending Money',
    savings_protected: 'Savings Protected by AI',
    stricter_rules: 'Stricter AI Rules',
    move_in: 'Move Money In',
    withdraw: 'Withdraw',
    verification_req: 'Verification Required',
    security_academy: 'Security Academy',
    helpful_tips: 'Helpful Tips',
    spent_today: 'Spent Today',
    shield_mastery: 'Shield Mastery',
    points: 'Points',
    lessons_ready: 'Lessons Ready',
    tap_to_learn: 'Tap to learn',
    lesson_mastered: 'Lesson Mastered',
    take_quiz: 'Take Quiz',
    collect_reward: 'Collect Reward',
    correct: 'Correct!',
    correct_desc: "You've mastered this safety lesson and earned 50 points.",
    understood: 'Understood',
    analytics: 'Analytics',
    spending_breakdown: 'Spending Breakdown',
    transaction_trend: 'Transaction Trend',
    income: 'Income',
    expenses: 'Expenses',
    ai_savings: 'AI Savings',
    total_balance: 'Total Balance',
    weekly_overview: 'Weekly Overview',
    monthly_overview: 'Monthly Overview',
    ai_insights: 'AI Insights',
    tips: [
      {
        title: 'Safety Tip',
        text: 'Never send money to someone who calls you first.',
        fullStory: "Scammers often pretend to be your delivery company or bank. Real companies will never ask for your PIN or OTP over the phone."
      },
      {
        title: 'Savings Tip',
        text: 'Moving RM100/day to the Vault pays your rent in 2 months.',
        fullStory: "The Secure Vault is your 'Digital Piggy Bank'. By setting aside small amounts, you build a safety net for emergencies."
      }
    ],
    lessons: [
      {
        title: "Your Digital Bodyguard",
        summary: "How our AI works for you.",
        detail: "Imagine a bodyguard who knows exactly how you spend money. If someone tries to spend RM10,000 at 3 AM in a different city, your bodyguard stops them instantly.",
        question: "Will the AI bodyguard let a scammer take your money at 3 AM?",
        options: ["No, it stops them", "Yes, it is sleeping"]
      },
      {
        title: "Spotting the Fake 'Customer'",
        summary: "Protect your market stall.",
        detail: "If a customer shows you a screenshot of a 'successful' payment but it doesn't show up in your app, it's likely a fake image. Trust your app, not their screen.",
        question: "Should you trust a customer's screenshot of payment?",
        options: ["Yes, screenshots are real", "No, check your own app"]
      }
    ]
  },
  'ms-MY': {
    greeting: 'Selamat Pagi',
    earnings: 'Pendapatan Hari Ini',
    main_wallet: 'Dompet Utama',
    secure_vault: 'Simpanan Selamat',
    shield_active: 'Status Perisai: Aktif',
    shield_alert: 'Amaran Perisai',
    send: 'Hantar',
    receive: 'Terima',
    topup: 'Tambah Nilai',
    to_vault: 'Ke Simpanan',
    recent_activity: 'Aktiviti Terkini',
    see_all: 'Lihat Semua',
    daily_spend: 'Wang Belanja Harian',
    savings_protected: 'Simpanan Dilindungi AI',
    stricter_rules: 'Peraturan AI Lebih Ketat',
    move_in: 'Masuk Wang',
    withdraw: 'Keluarkan',
    verification_req: 'Pengesahan Diperlukan',
    security_academy: 'Akademi Keselamatan',
    helpful_tips: 'Tip Bermanfaat',
    spent_today: 'Dibelanjakan Hari Ini',
    shield_mastery: 'Penguasaan Perisai',
    points: 'Mata',
    lessons_ready: 'Pelajaran Sedia',
    tap_to_learn: 'Ketik untuk belajar',
    lesson_mastered: 'Pelajaran Dikuasai',
    take_quiz: 'Ambil Kuiz',
    collect_reward: 'Ambil Ganjaran',
    correct: 'Betul!',
    correct_desc: "Anda telah menguasai pelajaran keselamatan ini dan mendapat 50 mata.",
    understood: 'Faham',
    analytics: 'Analisis',
    spending_breakdown: 'Pecahan Perbelanjaan',
    transaction_trend: 'Trend Transaksi',
    income: 'Pendapatan',
    expenses: 'Perbelanjaan',
    ai_savings: 'Simpanan AI',
    total_balance: 'Jumlah Baki',
    weekly_overview: 'Gambaran Mingguan',
    monthly_overview: 'Gambaran Bulanan',
    ai_insights: 'Wawasan AI',
    tips: [
      {
        title: 'Tip Keselamatan',
        text: 'Jangan hantar wang kepada pemanggil yang tidak dikenali.',
        fullStory: "Penipu sering menyamar sebagai syarikat penghantaran atau bank. Syarikat sebenar tidak akan meminta PIN atau OTP anda melalui telefon."
      },
      {
        title: 'Tip Simpanan',
        text: 'Simpan RM100 sehari dalam Simpanan untuk bayar sewa.',
        fullStory: "Simpanan Selamat adalah 'Tabung Digital' anda. Dengan menyimpan sedikit demi sedikit, anda membina tabung kecemasan."
      }
    ],
    lessons: [
      {
        title: "Pengawal Peribadi Digital",
        summary: "Bagaimana AI kami membantu anda.",
        detail: "Bayangkan seorang pengawal yang tahu cara anda belanja. Jika seseorang cuba belanja RM10,000 pada pukul 3 pagi di bandar lain, pengawal anda akan menghalangnya.",
        question: "Adakah pengawal AI akan membiarkan penipu mengambil wang anda pada pukul 3 pagi?",
        options: ["Tidak, ia akan halang", "Ya, ia sedang tidur"]
      },
      {
        title: "Kesan 'Pelanggan' Palsu",
        summary: "Lindungi gerai jualan anda.",
        detail: "Jika pelanggan tunjuk bukti bayaran tapi wang tidak masuk dalam aplikasi anda, itu mungkin gambar palsu. Percaya aplikasi anda, bukan skrin mereka.",
        question: "Patutkah anda percaya gambar bukti bayaran pelanggan?",
        options: ["Ya, gambar itu benar", "Tidak, semak aplikasi sendiri"]
      }
    ]
  }
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
  shieldStatus: 'active' | 'alert';
  locationCurrency: { code: string; symbol: string; name: string };
  userLanguage: string;
  supportedLanguages: { code: string; name: string; flag: string }[];
  fraudProtectionActive: boolean;
  isUserVerified: boolean;
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
  setTransactionResult: (data: any) => void;
  clearTransactionResult: () => void;
  setShieldStatus: (status: 'active' | 'alert') => void;
  setLocationInfo: (currency: { code: string; symbol: string; name: string }, lang: string) => void;
  setUserLanguage: (lang: string) => void;
  setVerified: (verified: boolean) => void;
  setFraudProtection: (active: boolean) => void;
  t: (key: string) => any;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  walletBalance: 18475.00,
  vaultBalance: 5800.00,
  vaultLocked: false,
  shieldStatus: 'active',
  locationCurrency: { code: 'MYR', symbol: 'RM', name: 'Malaysia' },
  userLanguage: 'ms-MY',
  supportedLanguages: [
    { code: 'ms-MY', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'en-PH', name: 'English', flag: '🇺🇸' },
  ],
  fraudProtectionActive: true,
  isUserVerified: false,
  transactionHistory: [],
  latestRiskScore: null,
  latestDecision: null,
  latestExplanation: null,
  latestUserMessage: null,
  latestVerification: null,
  latestChannel: null,
  latestConfidence: null,
  latestAgentReport: null,
  edgeFallbackUsed: false,
  t: (key) => {
    const lang = get().userLanguage;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en-PH'][key] || key;
  },
  addWalletTransaction: (t) =>
    set((state) => ({ transactionHistory: [t, ...state.transactionHistory] })),
  deductBalance: (amount) =>
    set((state) => ({ walletBalance: Math.max(0, state.walletBalance - amount) })),
  deductVault: (amount) =>
    set((state) => state.vaultLocked ? state : ({ vaultBalance: Math.max(0, state.vaultBalance - amount) })),
  moveToVault: (amount) =>
    set((state) => ({
      walletBalance: state.walletBalance - amount,
      vaultBalance: state.vaultBalance + amount
    })),
  releaseFromVault: (amount) =>
    set((state) => ({
      walletBalance: state.walletBalance + amount,
      vaultBalance: state.vaultBalance - amount
    })),
  lockVault: () => set({ vaultLocked: true }),
  unlockVault: () => set({ vaultLocked: false }),
  setTransactionResult: (data) => set({ 
    latestRiskScore: data.score, 
    latestDecision: data.decision,
    latestExplanation: data.explanation,
    latestUserMessage: data.userMessage,
    latestVerification: data.verification,
    latestChannel: data.channel,
    latestConfidence: data.confidence,
    latestAgentReport: data.agentReport,
    edgeFallbackUsed: data.edgeFallbackUsed
  }),
  clearTransactionResult: () => set({ latestRiskScore: null, latestDecision: null }),
  setShieldStatus: (status) => set({ shieldStatus: status }),
  setLocationInfo: (currency, lang) => set({ locationCurrency: currency, userLanguage: lang }),
  setUserLanguage: (lang) => set({ userLanguage: lang }),
  setVerified: (verified) => set({ isUserVerified: verified }),
  setFraudProtection: (active) => set({ fraudProtectionActive: active }),
}));

interface RiskStore {
  latestRiskScore: number;
  latestDecision: 'APPROVE' | 'FLAG' | 'BLOCK' | null;
  fraudAlerts: any[];
  addAlert: (alert: any) => void;
  removeAlert: (id: string) => void;
  setLatestEvaluation: (score: number, decision: 'APPROVE' | 'FLAG' | 'BLOCK') => void;
}

export const useRiskStore = create<RiskStore>((set) => ({
  latestRiskScore: 0,
  latestDecision: null,
  fraudAlerts: [],
  addAlert: (alert) => set((state) => ({ fraudAlerts: [alert, ...state.fraudAlerts] })),
  removeAlert: (id) => set((state) => ({ fraudAlerts: state.fraudAlerts.filter(a => a.id !== id) })),
  setLatestEvaluation: (score, decision) => set({ latestRiskScore: score, latestDecision: decision }),
}));