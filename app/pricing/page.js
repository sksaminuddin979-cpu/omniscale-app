'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Failed to generate checkout link');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          Omni<span className="text-blue-500">Scale</span>
        </Link>
      </nav>

      <section className="pt-20 pb-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Transparent, usage-based pricing.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Scale your AI operations without breaking the bank.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-zinc-300"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Up to 100k requests/mo</li>
              <li className="flex gap-3 text-zinc-300"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Basic Gateway routing</li>
              <li className="flex gap-3 text-zinc-300"><Check className="w-5 h-5 text-blue-500 shrink-0" /> Community support</li>
            </ul>
            <Link 
              href="/signup"
              className="block w-full py-3 px-4 rounded-xl border border-white/20 text-center font-medium hover:bg-white/5 transition"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative p-8 rounded-3xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
          >
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$999</span>
              <span className="text-blue-300/70">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-zinc-200"><Check className="w-5 h-5 text-blue-400 shrink-0" /> Unlimited requests</li>
              <li className="flex gap-3 text-zinc-200"><Check className="w-5 h-5 text-blue-400 shrink-0" /> Advanced token optimization</li>
              <li className="flex gap-3 text-zinc-200"><Check className="w-5 h-5 text-blue-400 shrink-0" /> Dedicated SLA & Support</li>
            </ul>
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade to Enterprise'}
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
