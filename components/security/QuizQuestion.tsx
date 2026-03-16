import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizContent, QuizOption } from '@/data/lessonsContent';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  content: QuizContent;
  onComplete: () => void;
}

export default function QuizQuestion({ content, onComplete }: Props) {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (option: QuizOption) => {
    if (showExplanation) return;
    setSelectedOption(option);
    setShowExplanation(true);
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
      >
        <h2 className="text-xl font-bold text-white leading-tight mb-8">
          {content.question}
        </h2>

        <div className="space-y-4">
          {content.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              disabled={showExplanation}
              className={`w-full p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                showExplanation
                  ? option.isCorrect
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100'
                    : selectedOption?.id === option.id
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-100'
                      : 'bg-white/5 border-white/5 opacity-40'
                  : 'bg-white/5 border-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className="font-medium">{option.text}</span>
                {showExplanation && option.isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                {showExplanation && !option.isCorrect && selectedOption?.id === option.id && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-3xl border ${
              selectedOption?.isCorrect 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              <p className={`text-sm leading-relaxed ${
                selectedOption?.isCorrect ? 'text-emerald-200/80' : 'text-rose-200/80'
              }`}>
                {selectedOption?.explanation}
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all"
            >
              {selectedOption?.isCorrect ? 'Awesome! Next' : 'Got it! Next'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
