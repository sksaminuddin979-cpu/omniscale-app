'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe, Cpu, Lock, Layers } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden" ref={targetRef}>
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>
      
      <main className="flex-1 flex flex-col items-center pt-32 px-6 z-10 w-full max-w-7xl mx-auto">
        <motion.div style={{ y, opacity }} className="w-full flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-5 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <Zap className="w-4 h-4 fill-primary" />
            <span className="tracking-wide">Omni-SaaS Master Protocol Active v2.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-8 leading-[1.1] max-w-5xl"
          >
            Intelligence at the edge. <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Zero latency.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl leading-relaxed font-light"
          >
            The world's most advanced AI Gateway. Route, rate-limit, and monetize your LLM traffic with absolute precision on Cloudflare's global network.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link href="/signup" className="group relative bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 overflow-hidden transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Start Building Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/pricing" className="glass px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
              View Enterprise Pricing
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full pb-32"
        >
          {[
            { icon: Globe, title: "Global Edge Network", desc: "Deployed directly to Cloudflare Pages. 0ms cold starts globally." },
            { icon: Shield, title: "Enterprise Security", desc: "Supabase row-level security and JWT authentication out of the box." },
            { icon: Zap, title: "Instant Monetization", desc: "Bulletproof Lemon Squeezy integration for subscription billing." },
            { icon: Cpu, title: "Model Agnostic", desc: "Seamlessly route between OpenAI, Gemini, Claude, and local models." },
            { icon: Lock, title: "Privacy First", desc: "End-to-end encryption. We never store your users' prompts or completions." },
            { icon: Layers, title: "Infinite Scalability", desc: "Architecture designed to handle millions of requests without breaking a sweat." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              variants={item} 
              className="glass-panel p-8 rounded-3xl flex flex-col group hover:bg-white/[0.08] transition-colors border border-white/[0.05] hover:border-white/10"
            >
              <div className="p-3.5 bg-primary/10 rounded-2xl mb-6 w-fit group-hover:bg-primary/20 transition-colors border border-primary/20">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-white/50 text-base leading-relaxed font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}