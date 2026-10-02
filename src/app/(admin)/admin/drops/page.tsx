'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Zap,
  Trash2,
  Edit,
  ArrowUpDown,
  Plus,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface DropQueueItem {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  scheduled_for: string;
  file_format: string;
  status: 'live' | 'scheduled' | 'expired';
}

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<DropQueueItem[]>([
    {
      id: 'd-1',
      title: 'Cinematic Sub Bass & Impact Suite 01',
      category: 'SFX PACK',
      categoryColor: '#06B6D4',
      scheduled_for: new Date().toISOString(),
      file_format: 'WAV',
      status: 'live',
    },
    {
      id: 'd-2',
      title: 'Kodak 5219 500T Emulation LUT',
      category: 'LUT',
      categoryColor: '#A78BFA',
      scheduled_for: new Date(Date.now() + 86400000).toISOString(),
      file_format: 'CUBE',
      status: 'scheduled',
    },
    {
      id: 'd-3',
      title: 'Kinetic Typography Presets v2',
      category: 'ANIMATION',
      categoryColor: '#10B981',
      scheduled_for: new Date(Date.now() + 86400000 * 2).toISOString(),
      file_format: 'JSX',
      status: 'scheduled',
    },
    {
      id: 'd-4',
      title: 'Freelance Production Retainer Agreement',
      category: 'CONTRACT',
      categoryColor: '#F59E0B',
      scheduled_for: new Date(Date.now() + 86400000 * 3).toISOString(),
      file_format: 'DOCX',
      status: 'scheduled',
    },
    {
      id: 'd-5',
      title: '16mm Grain Overlays 4K ProRes',
      category: 'OVERLAYS',
      categoryColor: '#EF4444',
      scheduled_for: new Date(Date.now() + 86400000 * 4).toISOString(),
      file_format: 'MOV',
      status: 'scheduled',
    },
  ]);

  const handleEmergencyLive = (id: string, title: string) => {
    setDrops((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'live' as const } : d))
    );
    toast.success(`EMERGENCY: "${title}" is now published LIVE to the Vault immediately!`);
  };

  const handleDelete = (id: string, title: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
    toast.error(`Removed "${title}" from schedule.`);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newDrops = [...drops];
    const temp = newDrops[index];
    newDrops[index] = newDrops[index - 1];
    newDrops[index - 1] = temp;
    setDrops(newDrops);
    toast.success('Queue order updated.');
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Scheduling Engine
          </span>
          <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
            Drop Schedule Manager
          </h1>
        </div>

        <Link href="/admin/upload">
          <Button size="sm" variant="primary" className="gap-1.5 font-medium">
            <Plus size={14} />
            Schedule New Asset
          </Button>
        </Link>
      </div>

      {/* SCHEDULE QUEUE LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <h2 className="font-display text-base text-white">Upcoming Drop Pipeline ({drops.length})</h2>
          <span className="font-mono text-xs text-[#71717A]">Auto-unlocks at daily drop hour</span>
        </div>

        <div className="space-y-3">
          {drops.map((drop, index) => (
            <div
              key={drop.id}
              className={`p-5 bg-[#111111] border rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                drop.status === 'live'
                  ? 'border-accent/40 bg-[#111111]/80 shadow-[0_0_15px_rgba(6,182,212,0.06)]'
                  : 'border-[#1A1A1A] hover:border-[#2A2A2A]'
              }`}
            >
              {/* LEFT INFO */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#3F3F46] w-6 shrink-0">
                  0{index + 1}
                </span>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] border"
                      style={{
                        borderColor: `${drop.categoryColor}40`,
                        color: drop.categoryColor,
                        backgroundColor: `${drop.categoryColor}10`,
                      }}
                    >
                      {drop.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#71717A] uppercase">
                      {drop.file_format}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] ${
                        drop.status === 'live'
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'bg-[#1A1A1A] text-[#71717A]'
                      }`}
                    >
                      {drop.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base text-white font-medium">{drop.title}</h3>

                  <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
                    <Clock size={12} />
                    <span suppressHydrationWarning>
                      Scheduled: {new Date(drop.scheduled_for).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1A1A1A]">
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveUp(index)}
                    title="Move up in queue"
                    className="p-2 text-[#71717A] hover:text-white"
                  >
                    <ArrowUpDown size={14} />
                  </Button>
                )}

                {drop.status !== 'live' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEmergencyLive(drop.id, drop.title)}
                    className="gap-1.5 font-mono text-xs text-amber-400 hover:border-amber-400/50"
                  >
                    <Zap size={13} />
                    Emergency Live
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(drop.id, drop.title)}
                  className="p-2 text-[#3F3F46] hover:text-red-400"
                  title="Delete scheduled drop"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}