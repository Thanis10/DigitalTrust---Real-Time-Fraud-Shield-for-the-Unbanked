"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Scan, Fingerprint, Keyboard, ShieldCheck, X, Camera } from 'lucide-react';

interface SecurityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export default function SecurityVerificationModal({ isOpen, onClose, onVerify }: SecurityVerificationModalProps) {
  const [method, setMethod] = useState<'face' | 'pin'>('face');
  const [isScanning, setIsScanning] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (isOpen && method === 'face') {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsScanning(false);
        onVerify();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, method, onVerify]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      onVerify();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
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
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security Check</h2>
                <p className="text-sm text-slate-400 font-medium">Verify your identity to access this section</p>
              </div>

              {method === 'face' ? (
                <div className="space-y-8 py-4">
                  <div className="relative mx-auto w-40 h-40">
                    {/* Face Scan UI */}
                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-pulse" />
                    <div className="absolute inset-2 border-2 border-indigo-500/50 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-indigo-400" />
                    </div>
                    
                    {/* Scanning Bar */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] z-10"
                    />
                    
                    {/* Scan Points */}
                    <div className="absolute inset-0">
                      {[0, 90, 180, 270].map((deg) => (
                        <div 
                          key={deg} 
                          className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                          style={{ 
                            top: '50%', 
                            left: '50%', 
                            transform: `rotate(${deg}deg) translateY(-80px) translateX(-50%)` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">
                      {isScanning ? 'Scanning Face...' : 'Identity Confirmed'}
                    </p>
                    <button 
                      onClick={() => setMethod('pin')}
                      className="text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors"
                    >
                      Use Secret PIN Instead
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePinSubmit} className="space-y-8 py-4">
                  <div className="flex justify-center gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          pin.length > i ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((val) => (
                      <button
                        key={val.toString()}
                        type="button"
                        onClick={() => {
                          if (val === 'C') setPin('');
                          else if (val === '✓') { if (pin.length === 4) onVerify(); }
                          else if (pin.length < 4) setPin(p => p + val);
                        }}
                        className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white hover:bg-white/10 transition-colors active:scale-95"
                      >
                        {val}
                      </button>
                    ))}
                  </div>

                  <button 
                    type="button"
                    onClick={() => setMethod('face')}
                    className="text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors"
                  >
                    Switch to Face Scan
                  </button>
                </form>
              )}

              <div className="pt-4 flex items-center justify-center gap-2 text-emerald-400/60">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure AI Authentication</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}