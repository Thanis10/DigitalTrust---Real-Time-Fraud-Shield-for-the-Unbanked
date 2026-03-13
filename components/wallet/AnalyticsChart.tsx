import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Shopping', value: 450, color: '#8b5cf6' },
  { name: 'Transfers', value: 300, color: '#6366f1' },
  { name: 'Electronics', value: 150, color: '#ec4899' },
  { name: 'Food', value: 100, color: '#10b981' },
];

export default function AnalyticsChart() {
  return (
    <div className="mb-12 relative rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent blur-[1px]" />
      <div className="relative bg-slate-900/60 rounded-3xl p-6 border border-white/5 shadow-xl backdrop-blur-xl z-10">
        <h3 className="text-sm font-bold text-white mb-6 tracking-wide">Monthly Spending</h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 relative flex-shrink-0 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
              <span className="text-base font-black text-white">$1.0k</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-3.5">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shadow-md" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <span className="text-xs font-medium text-slate-300">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}