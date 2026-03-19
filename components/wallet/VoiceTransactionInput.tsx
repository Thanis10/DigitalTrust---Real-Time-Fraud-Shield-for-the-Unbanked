"use client";

import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";

type Props = {
  onStartVoice: () => void;
};

export default function VoiceTransactionInput({ onStartVoice }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onStartVoice}
      whileTap={{ scale: 0.98 }}
      className="w-full rounded-[1.75rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 text-left shadow-lg hover:border-indigo-400/40 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20">
            <Mic className="h-5 w-5 text-indigo-300" />
            <div className="absolute inset-0 rounded-2xl border border-indigo-400/20" />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-widest text-indigo-300">
              Voice Transfer
            </p>
            <p className="mt-1 text-sm text-white">
              Start a voice transfer using natural language
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Example: “Send 50 ringgit to Ali”
            </p>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </motion.button>
  );
}