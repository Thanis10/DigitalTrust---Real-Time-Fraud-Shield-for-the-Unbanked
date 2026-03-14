"use client";
import { UserCircle, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWalletStore } from '@/store';

export default function WalletHeader() {
  const { locationCurrency, userLanguage, supportedLanguages, setUserLanguage } = useWalletStore();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLang = supportedLanguages.find(l => l.code === userLanguage) || supportedLanguages[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-start"
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-1">
            Good Morning, Maria
          </h1>
          <p className="text-sm font-bold text-slate-400">
             Today's Earnings: <span className="text-emerald-400 font-black">{locationCurrency.symbol}1,250</span>
          </p>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">{currentLang.flag}</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{currentLang.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-40 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
              >
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setUserLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${
                      userLanguage === lang.code ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden shadow-xl"
      >
        <UserCircle className="w-8 h-8 text-slate-300 relative z-10" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 z-20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
      </motion.div>
    </motion.div>
  );
}