'use client';
import { useEffect } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#070708] overflow-hidden">
      <div className="max-w-md w-full metal-chassis p-8 border border-[#1F1F24] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF3333] animate-pulse" />
            <span className="font-mono text-[9px] font-black text-[#FF3333] tracking-[0.2em] uppercase">
              ERROR // HARDWARE ENCLAVE FAULT
            </span>
          </div>
          <span className="font-mono text-[8px] text-[#A1A1AA] uppercase tracking-wider">
            CODE 500
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl text-[#FFFFFF] uppercase tracking-tight">
            INSTRUMENT FAILURE
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed">
            The telemetry processor encountered an unhandled exception during rendering.
          </p>
          {error.digest && (
            <p className="font-mono text-[9px] text-[#52525B] truncate pt-1">
              DIGEST: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#1F1F24] flex items-center gap-4">
          <button
            onClick={() => reset()}
            aria-label="Reload module"
            className="flex-1 py-3 px-4 bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-mono text-xs font-black uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all cursor-pointer select-none focus-visible:ring-1 focus-visible:ring-white"
          >
            <RotateCcw size={12} />
            RELOAD MODULE
          </button>
        </div>
      </div>
    </div>
  );
}
