import { Landmark, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { BankAccount } from '@/store';

interface Props {
  bank: BankAccount;
}

export default function BankCard({ bank }: Props) {
  return (
    <div className="mb-6">
      <motion.div 
        whileHover={{ y: -5, rotateX: 2, rotateY: 5 }}
        style={{ transformPerspective: 1000 }}
        className="relative rounded-3xl p-[1px] group cursor-pointer"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/40 via-teal-500/20 to-cyan-400/40 blur-[2px]" />
        
        <div className="relative bg-gradient-to-br from-[#072e22] to-[#021a14] rounded-3xl p-6 overflow-hidden shadow-2xl z-10 h-48 flex flex-col justify-between border border-white/5">
          {/* Glass refractions */}
          <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-gradient-to-bl from-white/10 to-transparent -translate-y-1/2 translate-x-1/3 rotate-12 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tighter drop-shadow-md">FPX</div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">{bank.bankName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               <Landmark className="w-6 h-6 text-emerald-300/80" />
               <div className="flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] font-black text-emerald-400 uppercase tracking-tighter border border-emerald-500/30">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
               </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className="text-xl font-mono text-slate-200 mb-2 tracking-[0.1em] drop-shadow-md h-[28px] flex items-center">
               •••• •••• •••• {bank.accountNumber.slice(-4)}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Account Holder</p>
                <p className="text-xs text-white font-medium">{bank.accountHolder}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Linked Since</p>
                <p className="text-xs text-white font-medium">Mar 2026</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
