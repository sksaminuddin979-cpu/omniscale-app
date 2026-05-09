'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, LogOut, TerminalSquare, User, Bot, 
  Sparkles, Activity, BarChart3, Database, Globe, 
  ShieldCheck, ArrowUpRight, Zap
} from 'lucide-react';

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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.log('No active session, redirecting to login');
          router.push('/login');
        } else {
          setUser(session.user);
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: `Session established. Accessing OmniScale Edge Node [US-EAST-1]. Ready for enterprise AI routing. How can I help you today?`
          }]);
        }
      } catch (err) {
        console.error('Session retrieval error:', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
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
      
      if (!res.ok) throw new Error(data.error || 'Edge Gateway Timeout');

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.result
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `GATEWAY_ERROR: ${err.message}. Check Cloudflare Dashboard logs for detail.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020205]">
      <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[calc(100vh-5rem)] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] glass">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 relative">
            <Sparkles className="w-8 h-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-4 border-[#020205] animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Gateway Console</h1>
            <p className="text-sm text-white/30 font-mono tracking-widest">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5 mr-4">
             <div className="text-center">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Status</p>
               <p className="text-xs font-bold text-green-400 font-mono">ENCRYPTED</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Node</p>
               <p className="text-xs font-bold text-white font-mono">CF-EDGE-01</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="glass-button px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white/80 hover:text-white flex items-center gap-3 transition-all border border-white/5 w-full md:w-auto"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Disconnect
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Playgorund / Chat */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 glass-card rounded-[3rem] flex flex-col overflow-hidden border border-white/[0.03] shadow-inner"
        >
          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                    msg.role === 'user' ? 'bg-primary/10 border-primary/20 text-primary' : 
                    msg.role === 'system' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/60'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[85%] rounded-[2rem] px-8 py-5 shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm font-semibold' 
                      : msg.role === 'system'
                      ? 'bg-red-500/5 border border-red-500/10 text-red-200/80 rounded-tl-sm font-mono text-xs'
                      : 'bg-white/[0.03] border border-white/[0.05] text-white/90 rounded-tl-sm font-light'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-sm px-8 py-5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Routing through Edge...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-8 border-t border-white/5 bg-white/[0.02]">
            <form onSubmit={handleGenerate} className="relative max-w-4xl mx-auto group">
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Submit prompt to OmniScale Protocol..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-8 pr-20 py-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-white/20 font-light relative z-10"
              />
              <button 
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 z-20 shadow-xl"
              >
                <Send className="w-6 h-6 ml-1" />
              </button>
            </form>
          </div>
        </motion.section>

        {/* Analytics Sidebar */}
        <aside className="w-full lg:w-[380px] space-y-8 shrink-0">
          {/* Subscription Analytics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-[3rem] border border-white/[0.03] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Quota Management</p>
               <Activity className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex items-end justify-between mb-4">
              <h3 className="text-4xl font-black text-white tracking-tighter">PRO TIER</h3>
              <span className="text-primary font-bold flex items-center gap-1 text-xs">
                ACTIVE <ShieldCheck className="w-3 h-3" />
              </span>
            </div>
            <p className="text-white/30 text-sm mb-12 font-light">Renews in 24 days. No disruptions detected.</p>
            
            <div className="space-y-8 mb-12">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 font-medium">API REQUESTS</span>
                  <span className="text-white font-mono font-bold italic">1,248 / 10k</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '12.48%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 font-medium">DATA THROUGHPUT</span>
                  <span className="text-white font-mono font-bold italic">4.2 GB / 50 GB</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '8.4%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white/20 rounded-full" 
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl glass-button text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white">
              Configure Infrastructure
            </button>
          </motion.div>

          {/* Infrastructure Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 rounded-[3rem] border border-white/[0.03]"
          >
             <div className="flex items-center justify-between mb-8">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Network Pulse</p>
               <Globe className="w-4 h-4 text-blue-400" />
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05]">
                   <p className="text-[8px] font-black text-white/20 uppercase mb-2">Avg Latency</p>
                   <p className="text-2xl font-black text-white tracking-tighter">12ms</p>
                </div>
                <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05]">
                   <p className="text-[8px] font-black text-white/20 uppercase mb-2">Uptime</p>
                   <p className="text-2xl font-black text-green-400 tracking-tighter">99.9%</p>
                </div>
                <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05]">
                   <p className="text-[8px] font-black text-white/20 uppercase mb-2">Active Nodes</p>
                   <p className="text-2xl font-black text-white tracking-tighter">312</p>
                </div>
                <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/[0.05]">
                   <p className="text-[8px] font-black text-white/20 uppercase mb-2">P50 Speed</p>
                   <p className="text-2xl font-black text-primary tracking-tighter">0.4s</p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}