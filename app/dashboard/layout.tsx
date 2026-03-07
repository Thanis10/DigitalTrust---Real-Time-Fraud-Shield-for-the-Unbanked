"use client";
import { useEffect } from 'react';
import { Shield, LayoutDashboard, AlertCircle, Settings, LogOut, Radio } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTransactionStore } from '@/store';
import { generateMockTransaction } from '@/data/mockGenerator';
import { Button } from '@/components/ui/button';
import AlertSystem from '@/components/alerts/AlertSystem';

const SidebarItem = ({ icon: Icon, label, href, active }: any) => (
  <Link href={href}>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${active ? 'bg-primary/20 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,1)]" />}
    </div>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { liveStreamEnabled, toggleLiveStream, addTransaction } = useTransactionStore();

  // Unified simulation engine
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (liveStreamEnabled) {
      // Background generator: adds a new transaction every 2.5 seconds
      interval = setInterval(() => {
        addTransaction(generateMockTransaction());
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [liveStreamEnabled, addTransaction]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Operations Center', href: '/dashboard' },
    { icon: AlertCircle, label: 'Fraud Alerts', href: '/dashboard/alerts' },
    { icon: Radio, label: 'Live Stream', href: '/dashboard/live' },
    { icon: Settings, label: 'System Config', href: '/dashboard/config' },
  ];

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Sidebar - Fixed Height */}
      <aside className="w-64 h-full border-r border-white/5 bg-surface/50 backdrop-blur-xl flex flex-col p-6 shrink-0 z-40">
        <Link href="/" className="flex items-center gap-2 mb-10 px-2 group">
          <img src="/logo.png" alt="DigitalTrust Logo" className="h-8 w-auto group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl tracking-tight text-white">DigitalTrust</span>
        </Link>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Exit to Website</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {menuItems.find(i => i.href === pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-slate-400">
              {pathname === '/dashboard' ? 'Monitoring real-time transaction anomalies' : 
               pathname === '/dashboard/alerts' ? 'Reviewing high-priority security incidents' :
               pathname === '/dashboard/live' ? 'High-density raw transaction feed' :
               'Configure AI thresholds and system parameters'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-400 font-bold tracking-wider">
              <span className={`w-2 h-2 rounded-full ${liveStreamEnabled ? 'bg-success animate-pulse shadow-[0_0_100px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
              {liveStreamEnabled ? 'LIVE' : 'STANDBY'}
            </div>
            <Button 
              onClick={toggleLiveStream}
              variant={liveStreamEnabled ? 'fraud' : 'default'}
              size="sm"
              className="font-bold px-6"
            >
              {liveStreamEnabled ? 'Stop Feed' : 'Start Feed'}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        
        <AlertSystem />
      </main>
    </div>
  );
}
