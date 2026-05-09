'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Mail, Lock, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Attempting signup for:', email);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) {
        console.error('Signup Error details:', signupError);
        setError(signupError.message);
        setLoading(false);
      } else {
        console.log('Signup successful, verification email sent.');
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected fetch error during signup:', err);
      setError(`Connection failed: ${err.message}. Ensure your Supabase project allows your domain.`);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-card p-8 rounded-[2rem] w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ rotate: 15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="p-4 bg-primary/10 rounded-2xl mb-5 border border-primary/20"
          >
            <UserPlus className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight heading-shadow">Create Account</h2>
          <p className="text-white/50 text-sm mt-3 font-light text-center">Join the enterprise AI revolution</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-8 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center"
          >
            <p className="font-semibold mb-2">Success!</p>
            <p className="text-sm font-light leading-relaxed">Check your inbox for a confirmation link to complete your registration.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 font-light"
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 font-light"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center hover:opacity-90 transition-all mt-8 shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 active:scale-95 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  Get Started <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </span>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-white/40 mt-10 font-light">
          Already have an account? <Link href="/login" className="text-primary hover:text-blue-400 transition-colors font-medium underline underline-offset-4">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}