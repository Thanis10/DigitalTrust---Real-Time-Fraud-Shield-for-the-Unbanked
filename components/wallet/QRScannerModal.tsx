"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Camera, Zap, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: { recipient: string; amount?: string; reference?: string }) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      // Simulate a successful scan after 3 seconds
      const timer = setTimeout(() => {
        setIsScanning(false);
        onScan({
          recipient: 'DT-MARKET-VENDOR-88',
          amount: '125.00',
          reference: 'Payment for groceries'
        });
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onScan, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[400] flex flex-col bg-slate-950">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-12 pb-6 relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Scan QR Code</h2>
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Camera View Simulator */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
            {/* Background "Camera" view */}
            <div className="absolute inset-0 bg-slate-900 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-indigo-500/10" />
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)]"
               />
            </div>

            {/* Scanning Frame */}
            <div className="relative w-full aspect-square max-w-[280px]">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl" />
              
              {/* Scan Bar */}
              <motion.div 
                animate={{ top: ['5%', '95%', '5%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-4 right-4 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-10 rounded-full"
              />

              {/* Central Target */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <QrCode className="w-32 h-32 text-indigo-400" />
              </div>
            </div>

            {/* AI Verification Badge */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
               <div className="bg-emerald-500/20 border border-emerald-500/30 px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md shadow-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Real-time AI Shield Active</span>
               </div>
            </div>
          </div>

          {/* Footer Instructions */}
          <div className="p-10 bg-slate-900/50 backdrop-blur-sm text-center space-y-2">
            <p className="text-lg font-black text-white">Center the code to scan</p>
            <p className="text-xs text-slate-400 font-medium">Keep your phone steady for faster payment</p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}