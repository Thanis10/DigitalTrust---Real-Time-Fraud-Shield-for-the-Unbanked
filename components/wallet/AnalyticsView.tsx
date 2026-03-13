import AnalyticsChart from './AnalyticsChart';
import { motion } from 'framer-motion';

export default function AnalyticsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Analytics</h2>
        <p className="text-sm text-slate-400">Track your spending patterns</p>
      </div>

      <AnalyticsChart />

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-4">Monthly Overview</h3>
        <div className="flex items-end gap-2 h-32 mt-4">
          {/* Simple mock bar chart */}
          {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-indigo-500/20 rounded-t-sm relative group hover:bg-indigo-500/40 transition-colors cursor-pointer"
                style={{ height: `${height}%` }}
              >
                {height === 100 && (
                  <div className="absolute -top-1 left-0 right-0 h-1 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}