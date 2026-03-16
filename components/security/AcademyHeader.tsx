import { ChevronLeft, GraduationCap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAcademyStore } from '@/store/academyStore';

export default function AcademyHeader() {
  const totalPoints = useAcademyStore(state => state.totalPoints);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/wallet" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
          <Trophy className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-black text-white">{totalPoints} PTS</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Security Academy</h1>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Learn how to protect your money and earn rewards.
        </p>
      </div>
    </div>
  );
}
