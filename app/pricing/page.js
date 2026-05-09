'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles, Zap, Shield, Crown, ArrowRight } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

const TIERS = [
  {
    name: 'Hobby',
    price: '$0',
    description: 'Perfect for exploring the future.',
    features: ['100 API Calls / mo', 'Community Support', 'Shared Edge Network', 'Basic Analytics'],
    buttonText: 'Start Building',
    variantId: 'hobby',
    isFree: true,
    icon: Zap
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/mo',
    description: 'For production-grade AI scale.',
    features: ['50,000 API Calls / mo', 'Priority Support', 'Dedicated Edge Nodes', 'Advanced Usage Metrics', 'Custom Rate Limits'],
    buttonText: 'Upgrade to Pro',
    variantId: '634281', // Actual variant ID if known
    isPopular: true,
    icon: Shield
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Bespoke infrastructure for giants.',
    features: ['Unlimited Throughput', '24/7 White-glove Support', 'Dedicated IP Whitelisting', 'SSO & Custom Auth', 'On-premise Deployment'],
    buttonText: 'Contact Sales',
    variantId: 'enterprise',
    icon: Crown
  }
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const supabase = createClient();

  const handleSubscribe = async (tier) => {
    if (tier.isFree || tier.variantId === 'enterprise') {
      window.location.href = '/signup';
      return;
    }

    try {
      setLoading(tier.name);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = `/login?next=/pricing`;
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          variantId: tier.variantId,
          userEmail: session?.user?.email 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Checkout initiation failed.');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      alert(`Subscription Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-32"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Architecture
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none heading-shadow">
          Scale your cost, <br className="hidden md:block"/> not your overhead.
        </h1>
        <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
          Premium pricing designed for engineering teams who value speed and reliability above all else.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
            className={`glass-card p-12 rounded-[3.5rem] relative flex flex-col border border-white/[0.03] ${
              tier.isPopular ? 'ring-2 ring-primary shadow-[0_0_100px_rgba(59,130,246,0.15)] bg-white/[0.04]' : ''
            }`}
          >
            {tier.isPopular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                Most Powerful
              </div>
            )}
            
            <div className="mb-12">
              <div className="p-4 bg-white/[0.03] rounded-2xl w-fit border border-white/[0.05] mb-8">
                <tier.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">{tier.name}</h3>
              <p className="text-base text-white/40 mb-10 h-12 leading-snug font-light">{tier.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">{tier.price}</span>
                {tier.period && <span className="text-xl text-white/30 font-light">{tier.period}</span>}
              </div>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Included Features</p>
              <ul className="space-y-5">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center gap-4 text-white/70 font-light tracking-tight">
                    <div className="p-1 bg-primary/20 rounded-full text-primary shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[4]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe(tier)}
              disabled={loading === tier.name}
              className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                tier.isPopular 
                  ? 'bg-primary text-primary-foreground hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]' 
                  : 'glass border border-white/10 text-white hover:bg-white/[0.08]'
              }`}
            >
              {loading === tier.name ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {tier.buttonText}
                  <ArrowRight className="w-5 h-5 opacity-50" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}