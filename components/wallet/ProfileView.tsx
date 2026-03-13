import { motion } from 'framer-motion';
import { UserCircle, Shield, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';

export default function ProfileView() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-4">
          <UserCircle className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Alex User</h2>
        <p className="text-sm text-slate-400 mt-1">alex@digitaltrust.app</p>
        <span className="mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Fully Verified
        </span>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        {[
          { icon: Bell, label: 'Notifications', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Lock, label: 'Security & Privacy', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { icon: HelpCircle, label: 'Help & Support', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <span className="text-sm font-medium text-slate-200">{item.label}</span>
          </button>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm mt-4">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </motion.div>
  );
}