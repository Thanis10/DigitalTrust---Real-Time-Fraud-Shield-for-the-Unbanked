import { Eye, EyeOff, Nfc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/store';

interface Props {
  card: Card;
}

export default function PaymentCard({ card }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mb-6">
      <motion.div 
        whileHover={{ y: -5, rotateX: 2, rotateY: 5 }}
        style={{ transformPerspective: 1000 }}
        className="relative rounded-3xl p-[1px] group cursor-pointer"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/40 via-purple-500/20 to-fuchsia-400/40 blur-[2px]" />

        <div className="relative bg-gradient-to-br from-[#13072e] to-[#0c021a] rounded-3xl p-6 overflow-hidden shadow-2xl z-10 h-48 flex flex-col justify-between border border-white/5">
          {/* Glass refractions */}
          <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-bl from-white/10 to-transparent -translate-y-1/2 translate-x-1/3 rotate-12 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tighter drop-shadow-md">{card.type}</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Virtual Card</p>
            </div>
            <Nfc className="w-6 h-6 text-indigo-300/80" />
          </div>

          <div className="relative z-10">
            <p className="text-lg font-mono text-slate-200 mb-2 tracking-[0.2em] drop-shadow-md h-[28px] flex items-center">
              <AnimatePresence mode="wait">
                {showDetails ? (
                  <motion.span key="visible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {card.number}
                  </motion.span>
                ) : (
                  <motion.span key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    •••• •••• •••• {card.number.slice(-4)}
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Cardholder</p>
                  <p className="text-xs text-white font-medium">{card.holder}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Expires</p>
                  <p className="text-xs text-white font-medium font-mono">{card.expiry}</p>
                </div>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                      <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">CVV</p>
                      <p className="text-xs text-white font-medium font-mono">{card.cvv}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                className="text-[10px] font-bold text-white flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
              >
                {showDetails ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}