import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg tracking-tight text-white">OmniScale</span>
        </div>
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} OmniScale Technologies. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Status</Link>
        </div>
      </div>
    </footer>
  );
}