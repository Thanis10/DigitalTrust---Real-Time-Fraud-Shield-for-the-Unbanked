"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint, Camera, MessageSquare, X } from 'lucide-react';
import { useWalletStore } from '@/store';

interface FriendlyFraudAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (method: string) => void;
}

export default function FriendlyFraudAlertModal({ isOpen, onClose, onVerify }: FriendlyFraudAlertModalProps) {
  const { t } = useWalletStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]"
          >
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500/30 relative">
                <ShieldAlert className="w-10 h-10 text-amber-500" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-amber-500 rounded-full blur-xl"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white leading-tight">Hold on! 🛡</h2>
                <p className="text-slate-400 font-medium">
                  This transfer looks a little unusual for you. To keep your earnings safe, please confirm it&apos;s really you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'fingerprint', label: 'Use Fingerprint', icon: Fingerprint, color: 'bg-indigo-500' },
                  { id: 'selfie', label: 'Quick Selfie', icon: Camera, color: 'bg-emerald-500' },
                  { id: 'whatsapp', label: 'WhatsApp OTP', icon: MessageSquare, color: 'bg-green-500' },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onVerify(method.id)}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color} shadow-lg`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-white group-hover:translate-x-1 transition-transform">{method.label}</span>
                  </motion.button>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
              >
                Cancel Transaction
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}