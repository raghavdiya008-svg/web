'use client';
import { useState } from 'react';
import { Check, X, ExternalLink, Clock, MessageSquare, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export interface SubmissionItem {
  id: string;
  submitter_id?: string;
  submitter_username: string;
  title: string;
  category_name: string;
  category_color?: string;
  source_url?: string;
  license: string;
  description: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SubmissionsQueueProps {
  initialSubmissions?: SubmissionItem[];
}

export function SubmissionsQueue({ initialSubmissions }: SubmissionsQueueProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(
    initialSubmissions || [
      {
        id: 'sub-1',
        submitter_username: 'marcus_vfx#2918',
        title: 'Analog VHS Glitch Textures & Static',
        category_name: 'Motion Overlays',
        category_color: '#EF4444',
        source_url: 'https://drive.google.com/drive/folders/demo-vhs-pack',
        license: 'MIT',
        description: 'Captured from real 1994 Panasonic tape decks. 20 loopable ProRes 422 overlays with authentic tracking distortion and luminance roll-off.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'pending',
      },
      {
        id: 'sub-2',
        submitter_username: 'elena_grade#1022',
        title: 'Kodachrome 64 Vintage Cine LUT',
        category_name: 'Color Grading LUTs',
        category_color: '#A78BFA',
        source_url: 'https://github.com/elena/kodachrome-lut-pack',
        license: 'CC0',
        description: 'Meticulous 3D cube LUT modeled on Kodachrome 64 slide film. High red saturation with distinctive cyan shadow split-toning.',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
        status: 'pending',
      },
      {
        id: 'sub-3',
        submitter_username: 'kieran_sound#8841',
        title: 'Deep Cinema Sub Drops & Earth Rumbles',
        category_name: 'SFX Packs',
        category_color: '#06B6D4',
        source_url: 'https://dropbox.com/s/subdrops-pack-v1.zip',
        license: 'MIT',
        description: 'Synthesized using Moog Sub 37 hardware. 30 stereo stems tuned between 25Hz and 65Hz for theatrical sound systems.',
        created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
        status: 'pending',
      },
    ]
  );

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (id: string, title: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const } : s))
    );
    toast.success(`"${title}" approved and scheduled into drop queue.`);
  };

  const handleReject = async (id: string, title: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s))
    );
    setRejectingId(null);
    setRejectionReason('');
    toast.error(`"${title}" rejected. Notification prepared.`);
  };

  const pendingList = submissions.filter((s) => s.status === 'pending');
  const processedList = submissions.filter((s) => s.status !== 'pending');

  return (
    <div className="space-y-8">
      {/* QUEUE HEADER STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px]">
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Pending Review
          </span>
          <div className="font-display text-2xl text-accent font-medium">{pendingList.length}</div>
        </div>
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px]">
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Approved This Month
          </span>
          <div className="font-display text-2xl text-green-400 font-medium">14</div>
        </div>
        <div className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px]">
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Avg Turnaround
          </span>
          <div className="font-display text-2xl text-white font-medium">18 hrs</div>
        </div>
      </div>

      {/* PENDING SUBMISSIONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <h2 className="font-display text-lg text-white">Pending Submissions ({pendingList.length})</h2>
          <span className="font-mono text-xs text-[#71717A]">Requires editorial approval</span>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-12 text-center border border-[#1A1A1A] bg-[#111111] rounded-[2px]">
            <p className="font-mono text-xs text-[#71717A]">The review queue is empty. Good job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingList.map((item) => (
              <div
                key={item.id}
                className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-5 hover:border-[#2A2A2A] transition-colors"
              >
                {/* TOP META ROW */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 border rounded-[2px] uppercase"
                      style={{
                        borderColor: `${item.category_color || '#06B6D4'}40`,
                        color: item.category_color || '#06B6D4',
                        backgroundColor: `${item.category_color || '#06B6D4'}10`,
                      }}
                    >
                      {item.category_name}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-[#2A2A2A] text-[#71717A] rounded-[2px]">
                      {item.license}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs text-[#71717A]">
                    <span>By @{item.submitter_username}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Clock size={12} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* TITLE & DESCRIPTION */}
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-white font-medium">{item.title}</h3>
                  <p className="text-sm text-[#71717A] leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                </div>

                {/* SOURCE LINK */}
                {item.source_url && (
                  <div className="pt-2">
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                    >
                      <ExternalLink size={12} />
                      Inspect Source Files ({item.source_url})
                    </a>
                  </div>
                )}

                {/* REJECTION REASON MODAL INLINE */}
                {rejectingId === item.id && (
                  <div className="p-4 bg-[#0A0A0A] border border-red-500/30 rounded-[2px] space-y-3">
                    <label className="block font-mono text-xs text-red-400">
                      Reason for Rejection (sent to user via Discord bot):
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Asset quality does not meet our minimum bitrate guidelines..."
                      rows={3}
                      className="w-full p-3 bg-[#111111] border border-[#1A1A1A] text-white text-xs rounded-[2px] focus:outline-none focus:border-red-400"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(item.id, item.title)}
                      >
                        Confirm Rejection
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRejectingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* ACTION BAR */}
                {rejectingId !== item.id && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A1A1A]">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setRejectingId(item.id)}
                      className="gap-1.5 font-mono text-xs"
                    >
                      <X size={13} />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApprove(item.id, item.title)}
                      className="gap-1.5 font-mono text-xs"
                    >
                      <Check size={13} />
                      Approve for Drop Queue
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESOLVED ARCHIVE */}
      {processedList.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="font-display text-base text-[#71717A]">Recently Resolved ({processedList.length})</h3>
          <div className="divide-y divide-[#1A1A1A] border border-[#1A1A1A] bg-[#111111] rounded-[2px]">
            {processedList.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono uppercase px-1.5 py-0.5 rounded-[2px] text-[10px] ${
                      item.status === 'approved'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-white font-medium">{item.title}</span>
                  <span className="text-[#3F3F46]">by @{item.submitter_username}</span>
                </div>
                <span className="font-mono text-[#3F3F46] text-[10px]" suppressHydrationWarning>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}