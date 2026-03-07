"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTransactionStore } from '@/store';
import { useMemo } from 'react';

export default function RiskDistributionChart() {
  const { transactions } = useTransactionStore();

  const data = useMemo(() => {
    // Group risk scores into buckets of 20 (0-20, 21-40, etc.)
    const buckets = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ];

    transactions.forEach(t => {
      if (t.risk_score <= 20) buckets[0].count++;
      else if (t.risk_score <= 40) buckets[1].count++;
      else if (t.risk_score <= 60) buckets[2].count++;
      else if (t.risk_score <= 80) buckets[3].count++;
      else buckets[4].count++;
    });

    return buckets;
  }, [transactions]);

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="range" 
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
             cursor={{ fill: '#ffffff05' }}
             contentStyle={{ backgroundColor: '#0c021a', border: '1px solid #ffffff10', borderRadius: '12px' }}
             itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 4 ? '#ef4444' : index === 3 ? '#fbbf24' : '#8b5cf6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
