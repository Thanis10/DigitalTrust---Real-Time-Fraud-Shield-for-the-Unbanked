"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Copy, Share2, Check, X, Download, Info } from 'lucide-react';
import { useWalletStore } from '@/store';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiveMoneyModal({ isOpen, onClose }: ReceiveMoneyModalProps) {
  const [copied, setCopied] = useState(false);
  const { locationCurrency } = useWalletStore();
  const digitalTrustId = "DT-MARIA-9921";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Receive Money</h2>
                <p className="text-sm text-slate-400 font-medium">Show this QR code to the sender</p>
              </div>

              {/* Mock QR Code Container */}
              <div className="relative mx-auto w-64 h-64 bg-white p-4 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.3)] group">
                <div className="w-full h-full border-4 border-slate-900 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden">
                  <QrCode className="w-48 h-48 text-slate-900" />
                  
                  {/* Subtle AI Shield Overlay on QR */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                     <div className="w-32 h-32 border-[20px] border-indigo-500 rounded-full" />
                  </div>
                  
                  {/* Center Logo Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border-4 border-white">
                       <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* DigitalTrust ID Section */}
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your DigitalTrust ID</p>
                    <p className="text-lg font-black text-white tracking-widest">{digitalTrustId}</p>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      copied ? 'bg-emerald-500 text-white' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 px-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <Share2 className="w-4 h-4 text-indigo-400" /> Share QR
                  </button>
                  <button className="py-4 px-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4 text-emerald-400" /> Save Image
                  </button>
                </div>
              </div>

              {/* Merchant / Gig Worker Tip */}
              <div className="flex gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-left">
                <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  Tip: Keep this QR handy for quick payments from customers. Payments are **AI-Verified** instantly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}