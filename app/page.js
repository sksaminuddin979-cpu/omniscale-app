'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full flex flex-col items-center text-center z-10"
      >
        <motion.div variants={item} className="mb-6 px-4 py-1.5 rounded-full glass border-primary/30 text-primary text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Omni-SaaS Master Protocol Active</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-8 leading-tight">
          Scale your enterprise AI <br/> without the infrastructure.
        </motion.h1>
        
        <motion.p variants={item} className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl leading-relaxed">
          The ultimate edge-native AI Gateway. Route, rate-limit, and monetize your LLM traffic with zero latency on Cloudflare's global network.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/signup" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            Start Building Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="glass px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            View Pricing
          </Link>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          {[
            { icon: Globe, title: "Edge Native", desc: "Runs on Cloudflare Pages. Zero cold starts." },
            { icon: Shield, title: "Enterprise Auth", desc: "Supabase integration out of the box." },
            { icon: Zap, title: "Instant Monetization", desc: "Lemon Squeezy billing ready on day one." }
          ].map((feature, i) => (
            <motion.div key={i} variants={item} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="p-3 bg-white/5 rounded-xl mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}