import { Home, PieChart, CreditCard, User, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'analytics' | 'cards' | 'profile';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

export default function BottomNavigation({ activeTab, onTabChange, onAddClick }: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[350px] z-40">
      <div className="bg-[#0f0722]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-6 py-4 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
        {/* Buttons */}
        <button onClick={() => onTabChange('home')} className={`relative p-2 transition-colors ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home className="w-6 h-6" />
          {activeTab === 'home' && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]" />}
        </button>
        
        <button onClick={() => onTabChange('analytics')} className={`relative p-2 transition-colors ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <PieChart className="w-6 h-6" />
          {activeTab === 'analytics' && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]" />}
        </button>
        
        {/* FAB */}
        <div className="relative -top-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 shadow-[0_10px_25px_rgba(139,92,246,0.5)] flex items-center justify-center text-white border border-white/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Send className="w-6 h-6 relative z-10" />
          </motion.button>
        </div>

        <button onClick={() => onTabChange('cards')} className={`relative p-2 transition-colors ${activeTab === 'cards' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <CreditCard className="w-6 h-6" />
          {activeTab === 'cards' && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]" />}
        </button>
        
        <button onClick={() => onTabChange('profile')} className={`relative p-2 transition-colors ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <User className="w-6 h-6" />
          {activeTab === 'profile' && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]" />}
        </button>
      </div>
    </div>
  );
}