'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter">
          Omni<span className="text-blue-500">Scale</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <Link href="/signup" className="bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          OmniScale Gateway v2.0 is Live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-8"
        >
          Stop burning cash on <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            unoptimized LLM tokens.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The enterprise API routing and caching layer that intelligently analyzes prompts and saves up to 40% on your OpenAI bills automatically.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/pricing" 
            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-2 text-zinc-300"
          >
            View Pricing
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
