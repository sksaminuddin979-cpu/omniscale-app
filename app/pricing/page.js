'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

const TIERS = [
  {
    name: 'Hobby',
    price: '$0',
    description: 'Perfect for exploring the API.',
    features: ['100 API Calls / mo', 'Community Support', 'Edge Network'],
    buttonText: 'Start Free',
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_HOBBY_VARIANT || 'hobby',
    isFree: true
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For production workloads.',
    features: ['10,000 API Calls / mo', 'Priority Support', 'Custom Domains', 'Advanced Analytics'],
    buttonText: 'Subscribe Now',
    variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT || 'pro',
    isPopular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated support and infrastructure.',
    features: ['Unlimited Calls', '24/7 SLA', 'Dedicated Account Manager', 'Custom Contracts'],
    buttonText: 'Contact Sales',
    variantId: 'enterprise'
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
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      alert(`Checkout Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-white/60">Scale your AI infrastructure without scaling your costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel p-8 rounded-3xl relative flex flex-col ${tier.isPopular ? 'border-primary ring-1 ring-primary/50' : 'border-white/10'}`}
          >
            {tier.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-white/60 mb-6 h-10">{tier.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-white/60">{tier.period}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map(feature => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="p-1 bg-primary/20 rounded-full text-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(tier)}
              disabled={loading === tier.name}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
                tier.isPopular 
                  ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                  : 'glass hover:bg-white/10 text-white'
              }`}
            >
              {loading === tier.name ? <Loader2 className="w-5 h-5 animate-spin" /> : tier.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}