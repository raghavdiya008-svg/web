'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Access denied');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#070708] text-white">
      <div className="max-w-md w-full bg-[#0E0E11] border border-[#1F1F24] p-8 space-y-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F24]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00FF41] animate-pulse" />
            <span className="font-mono text-[9px] font-black text-[#00FF41] tracking-[0.2em] uppercase">
              ENCLAVE // MASTER CLEARANCE
            </span>
          </div>
          <span className="font-mono text-[8px] text-[#A1A1AA] uppercase tracking-wider">
            PORTAL 2026
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 bg-[#16161A] border border-[#27272A] flex items-center justify-center mb-3 text-white">
            <Lock size={18} />
          </div>
          <h1 className="font-display font-black text-2xl uppercase tracking-tight">
            ADMINISTRATOR ACCESS
          </h1>
          <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed">
            Enter your private Master Key to unlock the control center. No third-party OAuth required.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound size={11} />
              MASTER KEY
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter AUTH_SECRET or ADMIN_KEY"
              autoFocus
              className="w-full px-3.5 py-3 bg-[#070708] border border-[#27272A] text-white font-mono text-xs focus:outline-none focus:border-[#FFFFFF] placeholder:text-[#3F3F46] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 font-mono text-[10px]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !key.trim()}
            variant="primary"
            className="w-full py-3.5 bg-white hover:bg-[#E4E4E7] text-black font-mono text-xs font-black uppercase tracking-[0.16em] flex items-center justify-center gap-2"
          >
            {loading ? 'VERIFYING CREDENTIAL...' : 'AUTHENTICATE & ENTER'}
            <ArrowRight size={13} />
          </Button>
        </form>

        <div className="pt-4 border-t border-[#1F1F24] flex items-center justify-between text-[9px] font-mono text-[#52525B]">
          <span>PROTECTED BY HARDWARE KEY</span>
          <a href="/" className="text-[#A1A1AA] hover:text-white transition-colors">
            ← BACK TO VAULT
          </a>
        </div>
      </div>
    </div>
  );
}
