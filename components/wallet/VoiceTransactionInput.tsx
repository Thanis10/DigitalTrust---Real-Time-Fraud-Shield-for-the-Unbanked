"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send } from 'lucide-react';

export default function VoiceTransactionInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate listening
      setTimeout(() => setTranscript('Send 50 pesos to Ali'), 2000);
    } else {
      setTranscript('');
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between border-2 transition-all ${
          isListening 
            ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
            : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isListening ? 'bg-white/20' : 'bg-indigo-500/20'}`}>
            <Mic className={`w-5 h-5 ${isListening ? 'text-white' : 'text-indigo-400'}`} />
          </div>
          <span className="font-bold">
            {isListening ? 'Listening...' : 'Tap to speak a command'}
          </span>
        </div>
        {!isListening && (
          <span className="text-xs opacity-60 italic">"Send 50 to Ali"</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Voice Command</p>
              <button onClick={() => setIsListening(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="min-h-[60px] flex flex-col justify-center">
              {transcript ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-xl font-bold text-white">"{transcript}"</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Confirm
                    </button>
                    <button onClick={() => setTranscript('')} className="px-4 py-2 bg-white/10 rounded-xl font-bold">
                      Retry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 bg-indigo-500 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}