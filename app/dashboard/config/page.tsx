"use client";
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Brain, Sliders, Zap, Globe, Lock, Save } from 'lucide-react';

const ConfigSlider = ({ label, value, desc }: any) => (
  <div className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-bold text-white">{label}</h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="text-lg font-bold text-primary">{value}%</div>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default function ConfigPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Configuration</h2>
        <p className="text-slate-400 mt-1">Adjust AI engine thresholds and security parameters</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Engine Thresholds</h3>
          </div>
          
          <ConfigSlider 
            label="Fraud Detection Sensitivity" 
            value={85} 
            desc="Lower values reduce false positives but might miss subtle fraud."
          />
          <ConfigSlider 
            label="Flagging Threshold" 
            value={50} 
            desc="Minimum risk score to flag a transaction for manual review."
          />
          <ConfigSlider 
            label="Blocking Threshold" 
            value={80} 
            desc="Minimum risk score to automatically block a transaction."
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Simulation Parameters</h3>
          </div>

          <div className="p-6 rounded-2xl glass border-white/5 space-y-6">
             <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Live Stream Frequency</h4>
                  <p className="text-[10px] text-slate-500">Interval between new mock transactions.</p>
                </div>
                <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white">
                  <option>1.0s</option>
                  <option selected>2.5s</option>
                  <option>5.0s</option>
                </select>
             </div>

             <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">Anomaly Probability</h4>
                  <p className="text-[10px] text-slate-500">Frequency of high-risk events in stream.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10">Low</button>
                  <button className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/50 text-xs text-primary font-bold">Medium</button>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10">High</button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white">ASEAN Optimized</p>
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Active Module</p>
                </div>
             </div>
             <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white">TLS 1.3 Encryption</p>
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Encrypted</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
        <Button variant="outline" className="font-bold">Reset Defaults</Button>
        <Button onClick={handleSave} className="font-bold px-10 shadow-lg shadow-primary/20">
          {saving ? 'Applying...' : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Configuration
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
