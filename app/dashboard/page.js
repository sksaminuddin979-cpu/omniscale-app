'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, LogOut, TerminalSquare, User, Bot, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        // Add a welcome message
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: 'Welcome to the OmniScale AI Gateway. How can I assist you with your enterprise workloads today?'
        }]);
      }
      setAuthLoading(false);
    };
    checkUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: prompt.trim() };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gateway error');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.result
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `System Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gateway Console</h1>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="glass px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-all border border-white/5"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Main Chat Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden border border-white/10"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 
                    msg.role === 'system' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : msg.role === 'system'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-sm'
                      : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm leading-relaxed'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <form onSubmit={handleGenerate} className="relative">
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Message the OmniScale Gateway..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/30"
              />
              <button 
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-3xl border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-6">Subscription Status</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-lg">Pro Tier</span>
              <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Active</span>
            </div>
            <p className="text-white/40 text-sm mb-6">Billing cycle renews in 14 days.</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">API Requests</span>
                <span className="text-white font-mono">1,248 / 10,000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[12%] rounded-full" />
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-white/10 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors">
              Manage Billing
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/10"
          >
             <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">System Status</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-white/70">Edge Nodes</span>
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-sm text-white font-mono">Online</span>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-white/70">Latency</span>
                 <span className="text-sm text-white font-mono">12ms</span>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}