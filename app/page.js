'use client';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe, Cpu, Lock, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const targetRef = useRef(null);
  const [mounted, setuseState] = useState(false);

  useEffect(() => {
    setuseState(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20, 
        duration: 0.8 
      } 
    }
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] relative selection:bg-primary/30 selection:text-white" ref={targetRef}>
      {/* Cinematic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[180px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[180px] rounded-full mix-blend-screen animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,10,20,0),rgba(2,2,5,1))]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center pt-48 px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <motion.div 
          style={{ opacity, scale, y: textY }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center flex flex-col items-center mb-60"
        >
          <motion.div 
            variants={itemVariants}
            className="mb-12 px-6 py-2 rounded-full glass border border-white/10 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 shadow-[0_0_40px_rgba(59,130,246,0.1)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Enterprise Intelligence Protocol v3.0
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-[10rem] font-black tracking-[-0.05em] text-white leading-[0.85] mb-12 heading-shadow"
          >
            AI WITHOUT <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary via-blue-400 to-blue-600">LIMITS.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-white/40 mb-16 max-w-3xl font-light tracking-tight leading-relaxed text-balance"
          >
            The world&apos;s most sophisticated AI Gateway. Securely route, rate-limit, and monetize your LLM infrastructure at the global edge.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 w-full sm:w-auto"
          >
            <Link href="/signup" className="group relative bg-white text-black px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Launch Console <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
            <Link href="/pricing" className="glass px-12 py-5 rounded-2xl font-bold text-xl text-white flex items-center justify-center border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.02]">
              Explore Plans
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
            { icon: Globe, title: "Global Mesh", desc: "Instantly deployed to 300+ edge locations with 0ms cold starts." },
            { icon: Shield, title: "Hardened Auth", desc: "Enterprise-grade RLS protection powered by Supabase Edge integration." },
            { icon: Zap, title: "Auto-Billing", desc: "Turn on monetization with a single click via Lemon Squeezy." },
            { icon: Cpu, title: "Multi-Model", desc: "Uniform API for OpenAI, Gemini, Claude, and private deployments." },
            { icon: Lock, title: "Quantum Privacy", desc: "End-to-end encryption. Your data never touches our disks." },
            { icon: Sparkles, title: "Self-Healing", desc: "AI-driven circuit breaking and automatic failover for 99.99% uptime." }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title} 
              variants={itemVariants} 
              className="glass-card p-12 rounded-[3rem] flex flex-col group border border-white/[0.02] hover:border-primary/20 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-primary/10 transition-colors" />
              <div className="p-5 bg-white/[0.03] rounded-3xl mb-10 w-fit border border-white/[0.05] group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500">
                <feature.icon className="w-8 h-8 text-primary shadow-glow" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{feature.title}</h3>
              <p className="text-white/30 text-lg leading-relaxed font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}