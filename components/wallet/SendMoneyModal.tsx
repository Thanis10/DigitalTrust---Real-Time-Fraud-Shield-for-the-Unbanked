"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Lock, QrCode, Clipboard, ShoppingBag, Truck, Home, User, Mic, Waves } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store';
import QRScannerModal from './QRScannerModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { 
    user_id: string; 
    amount: number; 
    location: string; 
    device_id: string; 
    recipient: string; 
    reference: string; 
    category: string;
    account_type: 'MAIN' | 'VAULT'
  }) => void;
  loading: boolean;
}

const CATEGORIES = [
  { id: 'personal', name: 'Personal', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'food', name: 'Food/Market', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'transport', name: 'Transport', icon: Truck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'rent', name: 'Rent/Bills', icon: Home, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function SendMoneyModal({ isOpen, onClose, onSend, loading }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState('personal');
  const [accountType, setAccountType] = useState<'MAIN' | 'VAULT'>('MAIN');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  
  const { locationCurrency } = useWalletStore();

  const malayNumberToFloat = (text: string): number | null => {
    const words = text.toLowerCase().split(/\s+/);
    const ones: Record<string, number> = {
      kosong: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5,
      enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sepuluh: 10
    };
    const tens: Record<string, number> = {
      sepuluh: 10, sebelas: 11, dua_puluh: 20, tiga_puluh: 30,
      empat_puluh: 40, lima_puluh: 50, enam_puluh: 60, tujuh_puluh: 70, 
      lapan_puluh: 80, sembilan_puluh: 90
    };
    
    let total = 0;
    let current = 0;
    for (const w of words) {
      if (w === 'ratus') {
        if (current === 0) current = 1;
        current *= 100;
        total += current;
        current = 0;
        continue;
      }
      if (w === 'puluh') {
        if (current === 0) current = 1;
        current *= 10;
        continue;
      }
      if (ones[w] !== undefined) {
        current += ones[w];
        continue;
      }
    }
    total += current;
    return total > 0 ? total : null;
  };

  const parseVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    const numberFromDigits = text.match(/(?:rm|₱|\$)?\s*(\d+(?:\.\d+)?)/i)?.[1];
    const numberFromWords = malayNumberToFloat(text);
    const amountVal = Number(numberFromDigits || numberFromWords);

    const recipientMatchMalay = text.match(/kat\s+([a-z0-9@._-]+)/i);
    const recipientMatchTo = text.match(/to\s+([a-z0-9@._-]+)/i);
    const receiver = recipientMatchMalay?.[1] || recipientMatchTo?.[1];

    if (!Number.isNaN(amountVal) && amountVal > 0) setAmount(String(amountVal));
    if (receiver) setRecipient(receiver);
    
    setVoiceHint(`Heard: "${transcript.trim()}"`);
  };

  const handleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceHint('Voice not supported');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => parseVoiceCommand(event.results[0][0].transcript);
    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    onSend({
      user_id: 'USR-8821',
      amount: parseFloat(amount),
      location: 'Singapore',
      device_id: 'iPhone 15 Pro',
      recipient,
      reference,
      category,
      account_type: accountType
    });
  };

  const handleScanResult = (data: { recipient: string; amount?: string; reference?: string }) => {
    setRecipient(data.recipient);
    if (data.amount) setAmount(data.amount);
    if (data.reference) setReference(data.reference);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[250] bg-slate-950 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-12 pb-6 relative z-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Send Money</h2>
              <button 
                type="button"
                onClick={onClose}
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-0 left-0 right-0 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />

            <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Account Type Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Main Wallet', value: 'MAIN' as const, icon: User },
                    { label: 'Secure Vault', value: 'VAULT' as const, icon: Lock },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setAccountType(item.value)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        accountType === item.value ? 'bg-indigo-500 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Recipient with Voice & Scan */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleVoice} className={`p-2 rounded-full border ${listening ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/10'}`}>
                        {listening ? <Waves className="w-3 h-3 text-white animate-pulse" /> : <Mic className="w-3 h-3 text-indigo-400" />}
                      </button>
                      <button type="button" onClick={() => setIsScannerOpen(true)} className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                        <QrCode className="w-3 h-3" /> Scan QR
                      </button>
                    </div>
                  </div>
                  <Input 
                    placeholder="Enter @username or Wallet ID" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-16 bg-slate-900/80 border-white/10 text-white rounded-2xl focus:border-indigo-500 shadow-inner px-5 font-bold"
                  />
                  {voiceHint && <p className="text-[10px] text-indigo-300 font-medium px-1">{voiceHint}</p>}
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-400">{locationCurrency.symbol}</span>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-24 pl-14 bg-slate-900/80 border-white/10 text-5xl font-black text-white rounded-[2rem] focus:border-indigo-500 shadow-inner"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Category</label>
                  <div className="grid grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          category === cat.id ? 'bg-indigo-500 border-indigo-400' : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <cat.icon className={`w-5 h-5 ${category === cat.id ? 'text-white' : cat.color}`} />
                        <span className={`text-[8px] font-black uppercase tracking-tighter ${category === cat.id ? 'text-white' : 'text-slate-500'}`}>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reference Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Reference</label>
                  <div className="relative">
                     <Clipboard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                     <Input 
                      placeholder="What is this for?" 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="h-16 pl-12 bg-slate-900/80 border-white/10 text-white rounded-2xl focus:border-indigo-500 shadow-inner font-medium"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-20 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black text-xl rounded-[2rem] shadow-[0_10px_40px_rgba(99,102,241,0.4)] transition-all active:scale-95"
                  >
                    {loading ? "Evaluating..." : "Confirm & Verify"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
          
          <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScanResult} />
        </>
      )}
    </AnimatePresence>
  );
}
