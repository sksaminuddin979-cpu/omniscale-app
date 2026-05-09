'use client';
import Link from 'next/link';
import { createClient } from '../lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 glass border-b-0 border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">OmniScale</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
          {user ? (
            <Link href="/dashboard" className="glass px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium text-white hover:bg-white/10 transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}