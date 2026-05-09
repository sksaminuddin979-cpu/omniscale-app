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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 } 
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden" ref={targetRef}>
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[160px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full mix-blend-screen opacity-50" />
      </div>
      
      <main className="flex-1 flex flex-col items-center pt-40 px-6 z-10 w-full max-w-7xl mx-auto">
        <motion.div 
          style={{ y, opacity }} 
          className="w-full flex flex-col items-center text-center mb-40"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="mb-10 px-6 py-2 rounded-full glass border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          >
            <Zap className="w-3.5 h-3.5 fill-primary" />
            <span>Enterprise Intelligence Protocol 2.0</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 mb-10 leading-[0.95] max-w-6xl"
          >
            The Future <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">of AI Scale.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-3xl text-white/50 mb-16 max-w-4xl leading-relaxed font-light text-balance"
          >
            Architected for zero-latency. Deployed globally. <br className="hidden md:block"/>
            Route and monetize LLM traffic with absolute precision on the global edge.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link href="/signup" className="group relative bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 overflow-hidden transition-all shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Launch Console <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/pricing" className="glass px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center hover:bg-white/[0.08] transition-all border border-white/10 hover:border-white/20 active:scale-95">
              Explore Pricing
            </Link>
          </motion.div>
        </motion.div>

        {/* Cinematic Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-60"
        >
          {[
            { icon: Globe, title: "Global Mesh", desc: "0ms cold starts via Cloudflare's massive edge infrastructure." },
            { icon: Shield, title: "Hardened Security", desc: "Enterprise-grade RLS and JWT protection powered by Supabase SSR." },
            { icon: Zap, title: "Instant Revenue", desc: "Monetize API keys in seconds with our Lemon Squeezy integration." },
            { icon: Cpu, title: "Omni-Models", desc: "One gateway for OpenAI, Gemini, Claude, and your private models." },
            { icon: Lock, title: "Zero Data-Retention", desc: "Privacy is not a feature; it's our foundation. End-to-end encryption." },
            { icon: Layers, title: "Deep Context", desc: "Smart caching and routing for long-context windows and large batch files." }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title} 
              variants={itemVariants} 
              className="glass-card p-10 rounded-[2.5rem] flex flex-col group hover:-translate-y-2 transition-all border border-white/[0.03]"
            >
              <div className="p-4 bg-primary/10 rounded-2xl mb-8 w-fit border border-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <feature.icon className="w-8 h-8 text-primary shadow-glow" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-white/40 text-lg leading-relaxed font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}