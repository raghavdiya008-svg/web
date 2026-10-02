import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Download,
  Inbox,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export const metadata: Metadata = {
  title: 'Admin Overview — EditX Vault',
};

export default async function AdminOverviewPage() {
  const session = await auth();

  // In production Supabase counts, or mock fallbacks
  const stats = [
    { label: 'Registered Creators', value: '2,480', icon: Users, change: '+18% this month' },
    { label: 'Total Asset Downloads', value: '84,400', icon: Download, change: '+2,140 today' },
    { label: 'Pending Submissions', value: '3', icon: Inbox, change: 'Requires review' },
    { label: 'Vault Health', value: '99.9%', icon: Sparkles, change: 'Cron operational' },
  ];

  const todayLiveDrop = {
    id: 'mock-1',
    title: 'Cinematic Sub Bass & Impact Suite 01',
    category: 'SFX PACK',
    downloads: 842,
    scheduled_for: 'Live Today',
  };

  const topDrops = [
    { id: '1', title: 'Teal & Orange LUT Grading Pack', category: 'LUTs', grabs: 3340 },
    { id: '2', title: 'High-Retention TikTok Hook Formulas', category: 'Hooks', grabs: 2210 },
    { id: '3', title: 'Freelance Invoice Template 2025', category: 'Contracts', grabs: 2100 },
    { id: '4', title: 'Vintage Anamorphic Lens Flare Mattes', category: 'Overlays', grabs: 1830 },
    { id: '5', title: '16mm Grain Overlays 4K ProRes', category: 'Overlays', grabs: 1540 },
  ];

  return (
    <div className="space-y-10">
      {/* TITLE & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Control Center
          </span>
          <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
            Platform Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/upload">
            <Button size="sm" variant="primary" className="gap-1.5 font-medium">
              <Plus size={14} />
              Schedule New Drop
            </Button>
          </Link>
          <Link href="/admin/submissions">
            <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
              <Inbox size={14} />
              Review Queue (3)
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider">
                  {s.label}
                </span>
                <Icon size={16} className="text-accent" />
              </div>
              <div className="font-display text-2xl lg:text-3xl text-white font-medium">
                {s.value}
              </div>
              <div className="font-mono text-[10px] text-[#71717A] flex items-center gap-1">
                <TrendingUp size={11} className="text-accent" />
                {s.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* TODAY'S DROP STATUS CARD */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
              Currently Live Today
            </span>
          </div>
          <h3 className="font-display text-xl text-white font-medium">{todayLiveDrop.title}</h3>
          <p className="font-mono text-xs text-[#71717A]">
            {todayLiveDrop.category} · {todayLiveDrop.downloads.toLocaleString()} downloads recorded today
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin/drops">
            <Button size="sm" variant="outline" className="font-mono text-xs">
              Manage Queue
            </Button>
          </Link>
          <Link href="/today">
            <Button size="sm" variant="ghost" className="gap-1 font-mono text-xs text-[#71717A] hover:text-white">
              View Public Page
              <ArrowUpRight size={13} />
            </Button>
          </Link>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <AnalyticsCharts />

      {/* TOP 5 ALL-TIME DROPS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <h2 className="font-display text-lg text-white">Top 5 All-Time Drops</h2>
          <span className="font-mono text-xs text-[#71717A]">Ranked by total downloads</span>
        </div>

        <div className="divide-y divide-[#1A1A1A] border border-[#1A1A1A] bg-[#111111] rounded-[2px]">
          {topDrops.map((d, i) => (
            <div key={d.id} className="p-4 flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[#3F3F46] font-mono text-sm w-4">#{i + 1}</span>
                <span className="text-white font-medium">{d.title}</span>
                <span className="text-[10px] text-[#71717A] uppercase px-1.5 py-0.5 border border-[#2A2A2A] rounded-[2px]">
                  {d.category}
                </span>
              </div>
              <span className="text-accent font-medium">
                {d.grabs.toLocaleString()} downloads
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}