"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Shield, Lock, ArrowRight, UserCheck, Smartphone, Activity, 
  CloudOff, BarChart3, Building2, AlertTriangle, Database, 
  CheckCircle2, Eye, Zap, Globe, Github, Server, 
  Wallet, Fingerprint, Link as LinkIcon, Check, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.15 }
};

const staggerItem = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, type: "spring", bounce: 0.3 }
};

const Navbar = () => (
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
        <Shield className="w-5 h-5 text-primary" />
      </div>
      <span className="font-bold text-xl tracking-tight text-white">DigitalTrust</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
      <Link href="#problem" className="hover:text-primary transition-colors">The Problem</Link>
      <Link href="#solution" className="hover:text-primary transition-colors">Platform</Link>
      <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
      <Link href="#security" className="hover:text-primary transition-colors">Security</Link>
    </div>
    <div className="flex gap-4">
      <Link href="/wallet" className="hidden sm:block">
         <Button variant="ghost">Simulator</Button>
      </Link>
      <Link href="/dashboard">
        <Button className="bg-primary text-white hover:bg-primary/90">Dashboard</Button>
      </Link>
    </div>
  </motion.nav>
);

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative pt-40 pb-24 px-6 overflow-hidden min-h-screen flex items-center">
      <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-hero-gradient opacity-60" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10 w-full">
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Shield className="w-4 h-4 text-success" />
            <span>🛡 AI Protection Active</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
            Real-Time Fraud Protection for the <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse-slow">
              Next Billion Wallet Users
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            AI-powered fraud detection designed specifically for gig workers, rural merchants, and first-time digital wallet users across ASEAN.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/wallet">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white text-black hover:bg-slate-200 hover:scale-105 transition-transform duration-300">
                View Live Demo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base group hover:scale-105 transition-transform duration-300">
                Explore Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> No friction UX
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Low latency API
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 relative w-full max-w-lg lg:max-w-none perspective-1000"
          initial={{ opacity: 0, rotateY: 20, x: 50 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
        >
          <div className="relative animate-float mx-auto w-full max-w-[380px]">
            {/* Mobile Mockup */}
            <div className="relative rounded-[2.5rem] border-[8px] border-slate-800 bg-background overflow-hidden aspect-[9/19] shadow-2xl shadow-primary/20">
              {/* Top Bar */}
              <div className="absolute top-0 w-full h-7 bg-slate-900 flex justify-center items-center z-20">
                <div className="w-20 h-5 bg-background rounded-b-xl" />
              </div>
              
              {/* App UI */}
              <div className="pt-12 px-6 h-full flex flex-col relative z-10 bg-gradient-to-b from-background to-surface">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-slate-400 text-xs">Total Balance</div>
                    <div className="text-2xl font-bold text-white">₱12,450.00</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Send Money</div>
                      <div className="text-xs text-slate-400">To Maria Santos</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">₱5,000.00</div>
                  
                  {/* Animated Fraud Alert inside mock */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, repeatDelay: 1 }}
                    className="bg-fraud/10 border border-fraud/30 rounded-xl p-3 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    <AlertTriangle className="w-5 h-5 text-fraud shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-fraud">Suspicious Transfer Blocked</div>
                      <div className="text-[10px] text-fraud/80 mt-1">Recipient account flagged for recent scam activity.</div>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-auto pb-6 space-y-3">
                   <div className="h-14 rounded-xl bg-primary flex justify-center items-center text-white font-bold text-sm shadow-lg shadow-primary/20 opacity-50">Confirm Transfer</div>
                </div>
              </div>
            </div>
            
            {/* Dashboard overlay widget */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 bottom-20 bg-surface/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-bold text-slate-300">Live Risk Score</span>
              </div>
              <div className="text-3xl font-bold text-fraud mb-1">94%</div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: "20%" }}
                   animate={{ width: "94%" }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="bg-fraud h-full rounded-full"
                 />
              </div>
              <div className="mt-2 text-[10px] text-slate-500 font-medium">Anomaly Detected • Device Mismatch</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const ProblemSection = () => (
  <section id="problem" className="py-24 px-6 bg-surface/50 border-y border-white/5 relative overflow-hidden">
    <div className="max-w-5xl mx-auto text-center">
      <motion.div {...fadeIn}>
        <Badge variant="outline" className="border-fraud/30 text-fraud mb-6 px-3 py-1">The Reality</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          One Fraud Can Wipe Out a Day's Income
        </h2>
        <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed">
          Traditional block-and-hold fraud systems fail low-literacy users. Complex security questions lock genuine gig workers out of their daily earnings while sophisticated phishing easily bypasses basic SMS OTPs.
        </p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        className="grid md:grid-cols-3 gap-8"
      >
        {[
          { icon: Lock, title: "Account Takeovers", desc: "Syndicates easily trick new digital users into sharing OTPs and taking over accounts." },
          { icon: LinkIcon, title: "Phishing Attacks", desc: "Fake links designed to steal funds immediately from vulnerable users." },
          { icon: AlertTriangle, title: "Suspicious Transfers", desc: "Abnormal transaction patterns missed by rigid legacy banking rules." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={staggerItem}
            whileHover={{ y: -10, scale: 1.02, borderColor: "rgba(239, 68, 68, 0.4)" }}
            className="p-8 rounded-3xl bg-background border border-white/5 transition-all duration-300 text-left shadow-lg"
          >
            <div className="w-12 h-12 bg-fraud/10 rounded-2xl flex items-center justify-center mb-6">
              <item.icon className="w-6 h-6 text-fraud" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const SolutionSection = () => (
  <section id="solution" className="py-32 px-6 overflow-hidden relative">
    {/* Background glowing orb */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" 
    />
    
    <div className="max-w-7xl mx-auto z-10 relative">
      <motion.div className="text-center mb-20" {...fadeIn}>
        <Badge variant="outline" className="border-primary/30 text-primary mb-6 px-3 py-1">The Solution</Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Built for Real-Time Protection</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          An end-to-end ecosystem that secures user funds instantly without adding unnecessary friction.
        </p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: "Wallet App", desc: "User-facing SDK with seamless integration and transparent security feedback.", icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/10", glow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.15)]", border: "hover:border-blue-400/50" },
          { title: "Risk API", desc: "Ultra-low latency inference API checking every transaction in < 200ms.", icon: Server, color: "text-primary", bg: "bg-primary/10", glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]", border: "hover:border-primary/50" },
          { title: "Fraud Detection Engine", desc: "Behavioral ML models trained on local market transaction data.", icon: BrainCircuitIcon, color: "text-secondary", bg: "bg-secondary/10", glow: "hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]", border: "hover:border-secondary/50" },
          { title: "Ops Dashboard", desc: "Real-time command center for fintech compliance and risk teams.", icon: BarChart3, color: "text-success", bg: "bg-success/10", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", border: "hover:border-success/50" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={staggerItem}
            whileHover={{ y: -10 }}
            className={`p-6 rounded-3xl glass border border-white/5 ${item.border} ${item.glow} transition-all duration-300 relative group overflow-hidden`}
          >
            {/* Hover reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            
            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
              <item.icon className={`w-7 h-7 ${item.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// Fallback for missing brain icon in lucide
const BrainCircuitIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
    <path d="M16 8V5c0-1.1.9-2 2-2" />
    <path d="M12 13h4" />
    <path d="M12 18h6a2 2 0 0 1 2 2v1" />
    <path d="M19 15v-3a2 2 0 0 0-2-2h-1" />
  </svg>
)

const FeaturesGridSection = () => (
  <section className="py-24 px-6 bg-surface/30">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { icon: Activity, title: "AI Fraud Detection", desc: "Real-time anomaly scoring evaluating hundreds of variables instantly." },
          { icon: Lock, title: "Secure Vault", desc: "Time-locked extra protection for user savings and critical funds." },
          { icon: BarChart3, title: "Fraud Ops Dashboard", desc: "Live transaction monitoring with geographic tracing." },
          { icon: Zap, title: "Low Friction UX", desc: "No unnecessary blocking. Smart authentication only when anomalous behavior is detected." },
          { icon: CloudOff, title: "Offline Fallback", desc: "Resilient architecture that maintains baseline security flags even with low connectivity." },
          { icon: Eye, title: "Explainable AI", desc: "Human-readable decisions ensuring transparency for compliance and support teams." }
        ].map((feat, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="bg-background/80 border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 border-0 ring-1 ring-white/5 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-[1.8] duration-700 ease-out" />
              <CardContent className="p-8 relative z-10">
                <feat.icon className="w-8 h-8 text-primary mb-6 transition-transform group-hover:scale-110 duration-300" />
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm">{feat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const TargetUsersSection = () => (
   <section className="py-32 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <motion.div className="text-center mb-16" {...fadeIn}>
        <h2 className="text-4xl font-bold mb-6 text-white">Protecting the Vulnerable</h2>
        <p className="text-xl text-slate-400">Designed intimately for those who need financial security the most.</p>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        className="grid md:grid-cols-3 gap-8"
      >
        {[
          { title: "Gig Worker", icon: Smartphone, tag: "Daily Earnings", desc: "Secures ride fares and tips from instant drain out attacks." },
          { title: "Rural Merchant", icon: Building2, tag: "Small Business", desc: "Protects settlement accounts from supplier spoofing and invoice fraud." },
          { title: "First-Time User", icon: UserCheck, tag: "Low Digital Literacy", desc: "Blocks social engineering attempts without requiring complex 2FA setups." }
        ].map((user, i) => (
          <motion.div 
            key={i}
            variants={staggerItem}
            whileHover={{ scale: 1.03, y: -10 }}
            className="group relative overflow-hidden rounded-3xl bg-surface border border-white/5 p-8 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -mr-20 -mt-20 transition-transform group-hover:scale-125 duration-700" />
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-inner"
            >
              <user.icon className="w-8 h-8 text-primary" />
            </motion.div>
            <Badge variant="outline" className="mb-4 bg-background border-white/10 group-hover:border-primary/30 transition-colors">{user.tag}</Badge>
            <h3 className="text-2xl font-bold text-white mb-3">{user.title}</h3>
            <p className="text-slate-400 leading-relaxed">{user.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
   </section>
);

const HowItWorksSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });
  
  const scaleLine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" ref={ref} className="py-32 px-6 bg-surface/50 border-y border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-20" {...fadeIn}>
          <h2 className="text-4xl font-bold mb-6 text-white">How It Works in Milliseconds</h2>
        </motion.div>

        <div className="relative">
          {/* Animated Connection Line */}
          <div className="hidden md:block absolute top-[44px] left-0 w-full h-[2px] bg-white/5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-transparent via-primary to-transparent" 
              style={{ scaleX: scaleLine, transformOrigin: "left" }}
            />
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-5 gap-8"
          >
            {[
              { step: "1", title: "Transaction", subtitle: "User Initiates", icon: Smartphone },
              { step: "2", title: "Data Stream", subtitle: "Sent to Risk API", icon: Activity },
              { step: "3", title: "AI Modeler", subtitle: "Scores Risk", icon: BrainCircuitIcon },
              { step: "4", title: "Decision API", subtitle: "Approve/Flag", icon: ShieldAlert },
              { step: "5", title: "Resolution", subtitle: "Clear Explanation", icon: CheckCircle2 }
            ].map((step, i) => (
              <motion.div 
                key={i}
                variants={staggerItem}
                className="relative flex flex-col items-center text-center z-10 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center mb-6 shadow-xl shadow-primary/10 relative"
                >
                  <div className="absolute inset-0 rounded-full border border-primary/40 animate-[ping_3s_ease-in-out_infinite] opacity-20" />
                  <step.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                </motion.div>
                <h4 className="text-white font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400">{step.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const SecurityTrustSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="security" ref={ref} className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="flex-1 space-y-8"
        >
          <h2 className="text-4xl font-bold text-white leading-tight">Empowering Trust with Bulletproof Architecture</h2>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="space-y-6"
          >
            {[
              { title: "Privacy-First Architecture", desc: "Zero PII stored permanently. Federated learning ensures data stays sovereign." },
              { title: "Explainable Decisions", desc: "Every flagged transaction comes with human-readable rationale code." },
              { title: "Vault Protection for Critical Funds", desc: "Self-custodial lockboxes for life-savings that require multi-party or delayed withdrawal." },
              { title: "Designed for Low Digital Literacy", desc: "No jargon. No complex steps. Just clear red/green indicators natively placed." }
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} className="flex gap-4 items-start group">
                <div className="mt-1 p-1 rounded bg-success/10 border border-success/20 group-hover:bg-success/20 transition-colors">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          style={{ y: yParallax }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-square max-h-[500px] w-full bg-surface border border-white/10 rounded-[3rem] overflow-hidden p-8 flex flex-col justify-center shadow-[0_0_50px_rgba(139,92,246,0.15)] group hover:border-primary/30 transition-colors duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
             <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm mx-auto">
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2, duration: 0.6 }}
               >
                 <motion.div 
                   animate={{ x: [0, 5, 0], y: [0, -5, 0] }} 
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center backdrop-blur-md shadow-lg"
                 >
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Risk API Status</span>
                      <span className="text-white font-bold">Encrypted Pipeline</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-success" />
                    </div>
                 </motion.div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4, duration: 0.6 }}
               >
                 <motion.div 
                   animate={{ x: [0, -5, 0], y: [0, 5, 0] }} 
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center backdrop-blur-md shadow-lg"
                 >
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Decision Engine</span>
                      <span className="text-white font-bold">White-box Auditable</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                 </motion.div>
               </motion.div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const BusinessScaleSection = () => (
  <section className="py-24 px-6 bg-primary/5 border-y border-primary/10 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring" }}
      className="max-w-4xl mx-auto relative z-10"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto mb-8"
      >
        <Globe className="w-full h-full text-primary opacity-80" />
      </motion.div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Built for Fintechs Across ASEAN</h2>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
        A highly scalable B2B SaaS architecture ready for mass integration. Plug into our resilient Risk API globally.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          "B2B SaaS Model", "Scalable API Infrastructure", "99.99% Uptime"
        ].map((badge, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          >
            <Badge variant="outline" className="text-base px-4 py-2 border-primary/20 bg-background/50 backdrop-blur-md text-white hover:bg-primary/10 transition-colors">
              {badge}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

const CTASection = () => (
   <section className="py-32 px-6">
     <motion.div 
       initial={{ opacity: 0, y: 60, scale: 0.95 }}
       whileInView={{ opacity: 1, y: 0, scale: 1 }}
       viewport={{ once: true }}
       transition={{ duration: 0.8 }}
       className="max-w-5xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group"
     >
        <div className="absolute inset-0 bg-hero-gradient mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-white/5 skew-x-12 translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-1000" />
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Start Protecting Your Users Today.</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Integrate DigitalTrust into your wallet application and provide world-class security for every user, regardless of their background.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/wallet">
              <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto bg-white text-black hover:bg-slate-200 font-bold hover:scale-105 transition-transform">
                Try Demo Wallet
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold border-0 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 transition-transform">
                View Ops Dashboard
              </Button>
            </Link>
          </div>
        </div>
     </motion.div>
   </section>
);

const Footer = () => (
  <footer className="border-t border-white/5 bg-background py-16 px-6 relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <span className="font-bold text-xl text-white">DigitalTrust</span>
      </div>
      <div className="flex gap-8 text-sm font-medium">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <Github className="w-4 h-4" /> GitHub
        </a>
        <Link href="/wallet" className="text-slate-400 hover:text-white transition-colors">Demo</Link>
        <Link href="#" className="text-slate-400 hover:text-white transition-colors">Team</Link>
      </div>
      <div className="text-slate-600 text-sm">
        © 2026 DigitalTrust AI. VHack 2026.
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 text-slate-200 overflow-x-hidden font-sans">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGridSection />
      <TargetUsersSection />
      <HowItWorksSection />
      <SecurityTrustSection />
      <BusinessScaleSection />
      <CTASection />
      <Footer />
    </div>
  );
}
