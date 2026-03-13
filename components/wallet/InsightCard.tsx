import { motion } from 'framer-motion';
import { Gift, Zap, Percent, ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const promos = [
  {
    id: 1,
    title: 'Explore your financial report and make insights',
    icon: Zap,
    color: 'from-purple-500/30 to-indigo-500/30',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20 border-indigo-500/30',
    glow: 'bg-fuchsia-500/20',
    action: 'Learn More'
  },
  {
    id: 2,
    title: 'Get 5% Cashback on your next grocery payment',
    icon: Percent,
    color: 'from-emerald-500/30 to-teal-500/30',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 border-emerald-500/30',
    glow: 'bg-teal-500/20',
    action: 'Claim Now'
  },
  {
    id: 3,
    title: 'Invite a friend and earn up to $50 reward',
    icon: Gift,
    color: 'from-amber-500/30 to-orange-500/30',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    glow: 'bg-orange-500/20',
    action: 'Invite Now'
  }
];

export default function InsightCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <div ref={containerRef} className="overflow-hidden">
        <motion.div 
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-4 cursor-grab active:cursor-grabbing px-1"
        >
          {promos.map((promo) => (
            <div key={promo.id} className="relative min-w-[280px] sm:min-w-[320px] rounded-[2rem] p-[1px] group shrink-0">
              <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${promo.color} blur-[2px]`} />
              <div className="relative bg-[#0c021a]/90 backdrop-blur-md rounded-[2rem] p-5 flex items-center gap-4 overflow-hidden border border-white/5 shadow-lg h-full">
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[30px] pointer-events-none ${promo.glow}`} />
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${promo.iconBg}`}>
                  <promo.icon className={`w-6 h-6 ${promo.iconColor}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1.5 leading-snug pr-2">
                    {promo.title}
                  </h3>
                  <button className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${promo.iconColor} hover:opacity-80`}>
                    {promo.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}