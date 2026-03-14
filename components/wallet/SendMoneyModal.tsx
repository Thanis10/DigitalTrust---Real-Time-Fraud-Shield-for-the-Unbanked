import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Lock, Mic, Waves, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { user_id: string; amount: number; location: string; device_id: string; recipient: string; account_type: 'MAIN' | 'VAULT' }) => void;
  loading: boolean;
}

export default function SendMoneyModal({ isOpen, onClose, onSend, loading }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState<'MAIN' | 'VAULT'>('MAIN');
  const [listening, setListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<string>('en');
  const [nlpPayload, setNlpPayload] = useState<{ amount?: number; recipient?: string } | null>(null);

  const malayNumberToFloat = (text: string): number | null => {
    const words = text.toLowerCase().split(/\s+/);
    const ones: Record<string, number> = {
      kosong: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5,
      enam: 6, tujuh: 7, lapan: 8, sembilan: 9, sembilanbelas: 19, sepuluh: 10
    };
    const tens: Record<string, number> = {
      sepuluh: 10, sebelas: 11, dua: 20, dua_puluh: 20, tiga: 30, tiga_puluh: 30,
      empat: 40, empat_puluh: 40, lima: 50, lima_puluh: 50, enam: 60, enam_puluh: 60,
      tujuh: 70, tujuh_puluh: 70, lapan: 80, lapan_puluh: 80, sembilan: 90, sembilan_puluh: 90
    };

    const normalized = words.join('_');
    if (tens[normalized] !== undefined) return tens[normalized];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    onSend({
      user_id: 'USR-8821',
      amount: parseFloat(amount),
      location: 'Singapore',
      device_id: 'iPhone 15 Pro',
      recipient,
      account_type: accountType
    });
  };

  const parseVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();
    // Detect Malay/Indonesian phrases like "tolong hantar lima puluh ringgit kat ali"
    const numberFromDigits = text.match(/(?:rm|\$)?\s*(\d+(?:\.\d+)?)/i)?.[1];
    const numberFromWords = malayNumberToFloat(text);
    const amountVal = Number(numberFromDigits || numberFromWords);

    const recipientMatchMalay = text.match(/kat\s+([a-z0-9@._-]+)/i);
    const recipientMatchTo = text.match(/to\s+([a-z0-9@._-]+)/i);
    const receiver = recipientMatchMalay?.[1] || recipientMatchTo?.[1];

    if (!Number.isNaN(amountVal) && amountVal > 0) {
      setAmount(String(amountVal));
    }
    if (receiver) setRecipient(receiver);

    const detectedLang = /ringgit|kat|tolong|hantar|puluh|ratus/.test(text) ? 'ms' : 'en';
    setVoiceLang(detectedLang);

    const payload = {
      amount: !Number.isNaN(amountVal) ? amountVal : undefined,
      recipient: receiver || undefined
    };
    setNlpPayload(payload.amount || payload.recipient ? payload : null);

    setVoiceHint(`Heard (${detectedLang === 'ms' ? 'Malay/BI' : 'English'}): "${transcript.trim()}"`);
  };

  const handleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceHint('Voice input not supported on this device.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setVoiceHint('Could not capture audio. Try again in a quieter place.');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      parseVoiceCommand(transcript);
      setListening(false);
    };

    recognition.start();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50 bg-slate-950 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-8 relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Send Money</h2>
            <button 
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-0 left-0 right-0 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Main Wallet', value: 'MAIN' as const, desc: 'Daily spend', icon: Send },
                  { label: 'Daily Wage Vault', value: 'VAULT' as const, desc: 'Rent & savings', icon: Shield },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAccountType(item.value)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                      accountType === item.value
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient</label>
                <div className="flex gap-3">
                  <Input 
                    placeholder="@username or Wallet ID" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-14 bg-slate-900/80 border-white/10 text-white rounded-2xl focus:border-indigo-500 shadow-inner px-4 placeholder:text-slate-600 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleVoice}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                      listening
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    aria-label="Voice fill recipient and amount"
                  >
                    {listening ? <Waves className="w-6 h-6 text-emerald-400 animate-pulse" /> : <Mic className="w-6 h-6 text-white" />}
                  </button>
                </div>
                {voiceHint && <p className="text-[11px] text-indigo-200/80 font-medium">{voiceHint}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    className="h-20 pl-12 bg-slate-900/80 border-white/10 text-3xl font-bold text-white rounded-2xl focus:border-indigo-500 shadow-inner placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex gap-4 shadow-inner mt-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-300 mb-1">AI Shield Active</h4>
                  <p className="text-[11px] text-indigo-200/80 leading-relaxed font-medium">
                    Transaction will be evaluated by our AI shield before processing to ensure maximum security.
                  </p>
                </div>
              </div>

              {nlpPayload && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Mic className="w-4 h-4" /> NLP Payload Preview
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30">
                      {voiceLang === 'ms' ? 'Malay/BI' : 'English'}
                    </span>
                  </div>
                  <pre className="bg-black/30 rounded-lg p-3 border border-white/5 text-[11px] overflow-x-auto">
{`{
  "amount": ${nlpPayload.amount ?? 'null'},
  "receiver": "${nlpPayload.recipient ?? ''}"
}`}
                  </pre>
                  <p className="text-[11px] text-slate-400">Tap send to route this JSON through the FastAPI fraud shield.</p>
                </div>
              )}

              <div className="mt-auto pt-8">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_4px_30px_rgba(99,102,241,0.4)] transition-all overflow-hidden relative"
                >
                  {loading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 relative z-10"
                    >
                      <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                      </span>
                      Evaluating Risk...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2 relative z-10">
                      <Send className="w-5 h-5" /> Send Transaction
                    </div>
                  )}
                  {loading && (
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
