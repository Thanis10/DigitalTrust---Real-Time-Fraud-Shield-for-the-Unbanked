"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Zap, PieChart, ArrowRight, UserCheck, Globe, Smartphone, Activity, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-lg px-8 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="DigitalTrust Logo" className="h-8 w-auto" />
      <span className="font-bold text-xl tracking-tight text-white">DigitalTrust</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
      <Link href="#what-is-digital-trust" className="hover:text-primary transition-colors">What is DigitalTrust?</Link>
      <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
      <Link href="#security" className="hover:text-primary transition-colors">Security</Link>
      <Link href="#case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
    </div>
    <Link href="/dashboard">
      <button className="px-5 py-2 rounded-md border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors text-white">
        Get a Demo
      </button>
    </Link>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl bg-card border border-card-border hover:border-primary/50 transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 text-slate-200 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section / What is DigitalTrust? */}
      <section id="what-is-digital-trust" className="relative pt-44 pb-32 px-8 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-hero-gradient pointer-events-none opacity-50" />
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Protecting the Next Billion Users
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 text-white">
              Financial Trust for the <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Unbanked in ASEAN</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
              DigitalTrust provides real-time AI fraud protection for digital wallets, ensuring secure financial inclusion for millions of underrepresented users across Southeast Asia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
                  Open Ops Center <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/wallet">
                <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold transition-all">
                  Launch Wallet Simulator
                </button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-800" />
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Trusted by <span className="text-white font-bold">12+ Super Apps</span> in the region
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="relative z-10 animate-float">
              <div className="w-[300px] md:w-[320px] h-[600px] md:h-[640px] mx-auto rounded-[3rem] border-[12px] border-slate-900 bg-slate-950 overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.3)] relative group">
                {/* Simulated Screen */}
                <div className="h-full bg-background flex flex-col p-6 overflow-hidden">
                   {/* Wallet Header */}
                   <div className="flex justify-between items-center mb-10">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30 p-1.5">
                      <img src="/logo.png" alt="Logo" className="w-full h-auto" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800" />
                   </div>
                   
                   <p className="text-xs text-slate-500 mb-1">Total Balance</p>
                   <h2 className="text-3xl font-bold mb-8">₱12,542.00</h2>
                   
                   <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span className="text-[10px] font-bold uppercase">Safe</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-fraud" />
                      <span className="text-[10px] font-bold uppercase">Shielded</span>
                    </div>
                   </div>

                   <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800" />
                          <div>
                            <div className="w-16 h-2 bg-slate-800 rounded mb-1" />
                            <div className="w-10 h-1.5 bg-slate-900 rounded" />
                          </div>
                        </div>
                        <div className="w-8 h-2 bg-slate-800 rounded" />
                      </div>
                    ))}
                   </div>

                   {/* Risk Badge Overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 p-4 rounded-2xl glass border-primary/30 shadow-2xl backdrop-blur-xl scale-110 group-hover:scale-125 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary">REAL-TIME SHIELD</span>
                      </div>
                      <div className="text-xs font-bold mb-1">Threat Status: Low</div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[15%] h-full bg-success" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Decorative 3D elements (Floating Orbs) */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary rounded-full blur-[60px] animate-pulse" />
              <div className="absolute top-1/2 -left-10 w-32 h-32 bg-secondary rounded-full blur-[80px] animate-pulse-slow" />
            </div>
            
            {/* Presale Counter Style from image - repurposed as Monitoring status */}
            <div className="absolute bottom-10 -right-6 md:-right-12 z-20 p-6 rounded-2xl glass border-white/10 shadow-2xl w-60 md:w-64">
              <p className="text-xs text-slate-400 mb-4 font-bold text-center uppercase tracking-tighter">Regional Threat Monitor</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center border-r border-white/10">
                  <div className="text-xl font-bold text-success">99.9%</div>
                  <div className="text-[8px] text-slate-500 font-bold uppercase">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">200ms</div>
                  <div className="text-[8px] text-slate-500 font-bold uppercase">Latency</div>
                </div>
              </div>
              <button className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-[10px] font-bold tracking-widest transition-colors uppercase">
                Systems Nominal
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="px-8 py-20 border-y border-white/5 bg-surface/50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Globe className="w-6 h-6" /> ASEANPAY</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Lock className="w-6 h-6" /> INDOWALLET</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Shield className="w-6 h-6" /> THAISEC</div>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><Zap className="w-6 h-6" /> PH-GO</div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Advanced Protection Layer</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI-driven shield operates at the intersection of biometric security and behavioral analysis to protect every transaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity} 
              title="Predictive ML Models" 
              desc="Analyzes spending patterns to identify anomalies before they become fraudulent, specifically tuned for local ASEAN micro-transactions."
            />
            <FeatureCard 
              icon={UserCheck} 
              title="Identity Proofing" 
              desc="Uses low-bandwidth biometric verification to ensure users in remote areas can access their funds securely."
            />
            <FeatureCard 
              icon={Globe} 
              title="Regional Intelligence" 
              desc="Real-time data sharing across the ASEAN corridor to track and block cross-border fraud syndicates."
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Low-End Device Support" 
              desc="Proprietary fingerprinting technology optimized for budget smartphones commonly used by the unbanked population."
            />
            <FeatureCard 
              icon={Zap} 
              title="Instant Safeguard" 
              desc="Automatically freezes suspicious accounts within milliseconds, preventing fund drain in real-time."
            />
            <FeatureCard 
              icon={PieChart} 
              title="Audit Transparency" 
              desc="Explainable AI provides clear reasoning for every decision, allowing local regulators to audit system fairness."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-8 bg-surface/50 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">Unmatched Regional Security</h2>
            <p className="text-slate-400 mb-12 leading-relaxed text-lg">
              DigitalTrust is more than just a fraud filter. It's a comprehensive security ecosystem designed to build financial confidence in emerging markets.
            </p>
            
            <div className="space-y-8">
              {[
                { label: "Successful Identifications", value: "99.2%", color: "bg-success" },
                { label: "Fraud Prevention Rate", value: "94.5%", color: "bg-primary" },
                { label: "False Positive Reduction", value: "88.0%", color: "bg-secondary" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-300 font-medium">{stat.label}</span>
                    <span className="font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: stat.value }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_rgba(139,92,246,0.3)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative flex justify-center items-center h-[400px]">
             {/* Large Pie Chart Graphic */}
             <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="140" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-white/5" />
                  <circle 
                    cx="160" 
                    cy="160" 
                    r="140" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="20" 
                    strokeDasharray="880" 
                    strokeDashoffset="88" 
                    className="text-primary" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-10 border-[1px] border-secondary/30 rounded-full animate-pulse-slow" />
                <div className="absolute inset-14 border-[1px] border-primary/20 rounded-full" />
                
                <div className="text-center z-10">
                  <div className="text-5xl md:text-6xl font-bold text-white tracking-tighter">94%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Efficacy</div>
                </div>
             </div>
             
             {/* Stats floating boxes - Adjusted positioning for better alignment */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-0 right-0 md:-right-4 p-5 rounded-2xl glass border-white/5 backdrop-blur-xl shadow-2xl z-20"
             >
                <div className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">Total Shielded</div>
                <div className="text-2xl font-bold text-success">₱14.2B</div>
             </motion.div>
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute bottom-0 left-0 md:-left-4 p-5 rounded-2xl glass border-white/5 backdrop-blur-xl shadow-2xl z-20"
             >
                <div className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">Threats Blocked</div>
                <div className="text-2xl font-bold text-fraud">1.2M+</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Voices of Trust</h2>
              <p className="text-slate-400 max-w-xl">
                See how DigitalTrust is transforming financial security for partners and users across the ASEAN region.
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-white transition-all w-fit">
              View All Partners
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] glass border-white/5 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Zap key={i} className="w-4 h-4 text-warning fill-warning" />)}
                </div>
                <p className="text-xl text-slate-200 font-medium leading-relaxed italic">
                  "Implementing DigitalTrust allowed us to expand our wallet services to rural areas without fear of fund drain. Our user confidence has skyrocketed."
                </p>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800" />
                <div>
                  <p className="font-bold text-white">Siti Nurhaliza</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">CTO, IndoWallet</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] glass border-white/5 flex flex-col justify-between bg-primary/5"
            >
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Zap key={i} className="w-4 h-4 text-warning fill-warning" />)}
                </div>
                <p className="text-xl text-slate-200 font-medium leading-relaxed italic">
                  "The AI reasoning is a game-changer. We finally have a 'white-box' solution that our compliance officers can understand and verify."
                </p>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800" />
                <div>
                  <p className="font-bold text-white">Ananda Krishnan</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Head of Risk, ASEANPay</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", val: "4.2M" },
              { label: "Transactions Scanned", val: "850M+" },
              { label: "Markets Covered", val: "6 Nations" },
              { label: "Uptime SLA", val: "99.99%" },
            ].map((m, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
                <p className="text-3xl font-bold text-white">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-background relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="DigitalTrust Logo" className="h-6 w-auto" />
            <span className="font-bold text-lg text-white">DigitalTrust</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          <p className="text-xs text-slate-600">
            &copy; 2026 DigitalTrust AI. Built for VHack 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
