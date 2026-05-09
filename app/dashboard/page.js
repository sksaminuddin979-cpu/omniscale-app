'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Loader2, LogOut, TerminalSquare } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setAuthLoading(false);
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      // Get the session to pass the token securely if needed in a real app
      // const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gateway error');
      }

      setResponse(data.result);
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gateway Console</h1>
          <p className="text-white/60">Welcome back, {user.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="glass px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <TerminalSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Playground</h2>
            </div>
            
            <form onSubmit={handleGenerate}>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt for the AI..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/30 resize-none mb-4"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Generate
                </button>
              </div>
            </form>
          </motion.div>

          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-3xl"
            >
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Response</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-white whitespace-pre-wrap">{response}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Usage Limits</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">API Calls</span>
                  <span className="text-white">12 / 100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[12%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}