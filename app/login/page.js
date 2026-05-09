'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Attempting login for:', email);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error('Login Error details:', loginError);
        setError(loginError.message);
        setLoading(false);
      } else {
        console.log('Login successful, redirecting...');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Unexpected fetch error during login:', err);
      setError(`Connection failed: ${err.message}. Check your Supabase URL in Cloudflare.`);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-card p-8 rounded-[2rem] w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="p-4 bg-primary/10 rounded-2xl mb-5 border border-primary/20"
          >
            <Sparkles className="w-8 h-8 text-primary shadow-glow" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight heading-shadow">Welcome back</h2>
          <p className="text-white/50 text-sm mt-3 font-light">Enter your credentials to access the gateway</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-8 flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 font-light"
                placeholder="name@company.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20 font-light"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center hover:opacity-90 transition-all mt-8 shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 active:scale-95 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-10 font-light">
          New to OmniScale? <Link href="/signup" className="text-primary hover:text-blue-400 transition-colors font-medium underline underline-offset-4">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}