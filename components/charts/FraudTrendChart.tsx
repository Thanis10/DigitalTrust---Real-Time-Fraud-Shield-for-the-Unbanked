"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTransactionStore } from '@/store';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function FraudTrendChart() {
  const { transactions } = useTransactionStore();

  const data = useMemo(() => {
    // Generate some trend data based on current transactions + some historical noise
    const baseData = [
      { time: '10:00', risk: 12 },
      { time: '11:00', risk: 15 },
      { time: '12:00', risk: 8 },
      { time: '13:00', risk: 45 },
      { time: '14:00', risk: 32 },
      { time: '15:00', risk: 20 },
    ];

    const liveData = transactions.slice(0, 10).reverse().map(t => ({
      time: format(new Date(t.timestamp), 'HH:mm'),
      risk: t.risk_score
    }));

    return [...baseData, ...liveData].slice(-10);
  }, [transactions]);

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0c021a', border: '1px solid #ffffff10', borderRadius: '12px' }}
            itemStyle={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="risk" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRisk)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
