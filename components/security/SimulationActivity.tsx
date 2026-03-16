import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationContent, SimulationStep } from '@/data/lessonsContent';
import { ShieldCheck, ShieldAlert, ArrowRight, User } from 'lucide-react';

interface Props {
  content: SimulationContent;
  onComplete: () => void;
}

export default function SimulationActivity({ content, onComplete }: Props) {
  const [currentStepId, setCurrentStepId] = useState('start');
  const [history, setHistory] = useState<SimulationStep[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentStep = content.steps.find(s => s.id === currentStepId);

  const handleOptionClick = (option: { text: string; isCorrect: boolean; result: string; nextStep?: string }) => {
    setFeedback({ isCorrect: option.isCorrect, text: option.result });
    
    if (option.isCorrect && option.nextStep) {
      setTimeout(() => {
        setHistory([...history, currentStep!]);
        setCurrentStepId(option.nextStep!);
        setFeedback(null);
      }, 2000);
    }
  };

  if (!currentStep) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pb-4 px-1 scrollbar-hide">
        {history.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-2xl ${
              step.type === 'message' ? 'bg-indigo-500/10 border border-indigo-500/20 mr-12' : 'bg-white/5 border border-white/10'
            }`}
          >
             {step.sender && <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">{step.sender}</p>}
             <p className="text-sm text-slate-300">{step.content}</p>
          </motion.div>
        ))}

        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-3xl border ${
            currentStep.type === 'message' 
              ? 'bg-indigo-500/20 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Incoming {currentStep.type}</p>
              <h4 className="text-xs font-bold text-white">{currentStep.sender || 'System Action'}</h4>
            </div>
          </div>
          <p className="text-lg font-bold text-white leading-relaxed">
            "{currentStep.content}"
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-3"
          >
            {currentStep.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all text-left group"
              >
                <p className="text-sm font-bold text-white group-hover:text-indigo-300">
                  {option.text}
                </p>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-[2rem] border ${
              feedback.isCorrect 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {feedback.isCorrect ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              )}
              <h4 className={`font-black uppercase tracking-widest text-xs ${
                feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {feedback.isCorrect ? 'Correct Decision' : 'Security Risk Detected'}
              </h4>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {feedback.text}
            </p>
            
            {(!feedback.isCorrect || !currentStep.options.find(o => o.text === feedback.text)?.nextStep) && (
              <button
                onClick={onComplete}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                  feedback.isCorrect 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                }`}
              >
                {feedback.isCorrect ? 'Finish Simulation' : 'Try Again'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
