"use client";
import { useEffect, useState } from 'react';
import { useTransactionStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function FraudHeatmap() {
  const { transactions } = useTransactionStore();
  const [points, setPoints] = useState<any[]>([]);

  // Map region coordinates (simplified mock mapping)
  const LOCATION_MAP: Record<string, { x: string, y: string }> = {
    'Singapore': { x: '75%', y: '65%' },
    'Kuala Lumpur': { x: '73%', y: '63%' },
    'Jakarta': { x: '74%', y: '72%' },
    'Bangkok': { x: '70%', y: '60%' },
    'Manila': { x: '78%', y: '58%' },
    'Ho Chi Minh': { x: '73%', y: '61%' },
    'London (VPN)': { x: '45%', y: '30%' },
    'Lagos': { x: '48%', y: '60%' },
    'Moscow': { x: '55%', y: '25%' },
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const latest = transactions[0];
      const coords = LOCATION_MAP[latest.location] || { x: '50%', y: '50%' };
      const newPoint = {
        id: Math.random().toString(36).substr(2, 9),
        ...coords,
        decision: latest.decision
      };
      
      setPoints(prev => [newPoint, ...prev].slice(0, 5));
      
      setTimeout(() => {
        setPoints(prev => prev.filter(p => p.id !== newPoint.id));
      }, 3000);
    }
  }, [transactions]);

  return (
    <div className="relative w-full aspect-square bg-slate-900/20 rounded-2xl border border-white/5 overflow-hidden">
      {/* Mock World Map SVG */}
      <svg className="w-full h-full opacity-20 grayscale" viewBox="0 0 800 400" fill="currentColor">
        <path d="M150,100 Q200,80 250,110 T350,100 T450,120 T550,100 T650,110 T750,100 V300 Q700,320 600,290 T450,310 T300,290 T150,310 Z" fill="#1e293b" />
        {/* Simplified continents */}
        <circle cx="200" cy="150" r="40" fill="#334155" />
        <circle cx="450" cy="120" r="50" fill="#334155" />
        <circle cx="600" cy="250" r="60" fill="#334155" />
        <circle cx="150" cy="280" r="30" fill="#334155" />
      </svg>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Dynamic Heat Points */}
      <AnimatePresence>
        {points.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: p.x, top: p.y }}
          >
            <div className={`w-3 h-3 rounded-full blur-[2px] ${
              p.decision === 'BLOCK' ? 'bg-fraud' : 
              p.decision === 'FLAG' ? 'bg-warning' : 'bg-primary'
            }`} />
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`absolute inset-0 rounded-full border ${
                p.decision === 'BLOCK' ? 'border-fraud' : 
                p.decision === 'FLAG' ? 'border-warning' : 'border-primary'
              }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Monitoring</p>
        <p className="text-xs font-bold text-white">ASEAN Security Corridor</p>
      </div>
    </div>
  );
}
