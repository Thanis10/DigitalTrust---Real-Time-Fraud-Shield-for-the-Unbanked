"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactionStore } from '@/store';
import { useMemo } from 'react';

export default function StatusPieChart() {
  const { transactions } = useTransactionStore();

  const data = useMemo(() => {
    const counts = transactions.reduce((acc, t) => {
      acc[t.decision] = (acc[t.decision] || 0) + 1;
      return acc;
    }, { APPROVE: 0, FLAG: 0, BLOCK: 0 } as Record<string, number>);

    return [
      { name: 'Approved', value: counts.APPROVE || 1, color: '#10b981' }, // Success
      { name: 'Flagged', value: counts.FLAG || 0, color: '#fbbf24' },   // Warning
      { name: 'Blocked', value: counts.BLOCK || 0, color: '#ef4444' },   // Fraud
    ];
  }, [transactions]);

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#0c021a', border: '1px solid #ffffff10', borderRadius: '12px' }}
             itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
