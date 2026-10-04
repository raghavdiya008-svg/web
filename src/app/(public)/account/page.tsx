import { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { User, ShieldCheck, Download, Bell, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account — EditX Vault',
  description: 'Manage your EditX Vault profile, downloads history, and preferences.',
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-[#111111] border border-[#1A1A1A] flex items-center justify-center text-accent mb-6 rounded-[2px]">
          <User size={24} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-white mb-3 tracking-tight">
          Creator Account
        </h1>
        <p className="text-sm text-[#71717A] max-w-sm mb-8 leading-relaxed">
          Log in with your Discord account to view your download history, manage notification alerts, and claim creator credits.
        </p>
        <Link href="/api/auth/signin?callbackUrl=/account">
          <Button size="lg" variant="primary" className="gap-2.5 font-medium">
            <svg width="16" height="12" viewBox="0 0 14 11" fill="currentColor">
              <path d="M11.868 0.875C10.983 0.458 10.036 0.156 9.041 0C8.908 0.236 8.755 0.549 8.649 0.796C7.592 0.651 6.545 0.651 5.506 0.796C5.4 0.549 5.244 0.236 5.11 0C4.114 0.156 3.166 0.459 2.281 0.877C0.328 3.771 -0.201 6.594 0.063 9.378C1.258 10.264 2.417 10.801 3.557 11C3.853 10.593 4.117 10.162 4.343 9.708C3.91 9.541 3.495 9.336 3.104 9.093C3.21 9.015 3.313 8.934 3.413 8.851C5.835 9.966 8.451 9.966 10.845 8.851C10.947 8.934 11.05 9.015 11.154 9.093C10.761 9.337 10.344 9.543 9.91 9.709C10.136 10.163 10.399 10.594 10.697 11C11.838 10.801 12.998 10.264 14.193 9.377C14.502 6.15 13.646 3.354 11.868 0.875ZM4.676 7.671C3.95 7.671 3.357 7.003 3.357 6.186C3.357 5.37 3.937 4.701 4.676 4.701C5.415 4.701 6.008 5.369 5.995 6.186C5.996 7.003 5.415 7.671 4.676 7.671ZM9.585 7.671C8.859 7.671 8.266 7.003 8.266 6.186C8.266 5.37 8.846 4.701 9.585 4.701C10.324 4.701 10.917 5.369 10.904 6.186C10.904 7.003 10.324 7.671 9.585 7.671Z" />
            </svg>
            Login with Discord
          </Button>
        </Link>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  let profile: any = null;
  let downloadHistory: any[] = [];

  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('discord_id', session.user.discordId)
      .maybeSingle();
    profile = data;

    if (profile?.id) {
      const { data: dls } = await supabase
        .from('downloads')
        .select('drop_id, downloaded_at, drops(title, categories(name, color), file_format)')
        .eq('user_id', profile.id)
        .order('downloaded_at', { ascending: false })
        .limit(20);
      downloadHistory = dls || [];
    }
  } catch (err) {
    console.warn('Could not query account profile', err);
  }

  const username = session.user.discordUsername || session.user.name || 'Creator';
  const avatar = session.user.discordAvatar || session.user.image;

  return (
    <div className="max-w-[800px] mx-auto px-5 lg:px-8 py-14 space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Account Settings
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Creator Profile
        </h1>
      </div>

      {/* USER CARD */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatar}
              alt={username}
              className="w-14 h-14 rounded-full border border-[#1A1A1A] object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center font-mono text-lg text-white">
              {username[0]?.toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg text-white font-medium">{username}</h2>
              <span className="font-mono text-[10px] px-1.5 py-0.5 border border-accent/40 text-accent rounded-[2px] uppercase">
                {session.user.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
            <p className="font-mono text-xs text-[#71717A]">
              Discord ID: {session.user.discordId || 'Connected'}
            </p>
          </div>
        </div>

        <Link href="/api/auth/signout">
          <Button variant="outline" size="sm" className="font-mono text-xs text-[#71717A] hover:text-white">
            Log Out
          </Button>
        </Link>
      </div>

      {/* STATS & PREFERENCES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-2">
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block">
            Total Assets Grabbed
          </span>
          <div className="font-display text-3xl text-white">
            {profile?.total_downloads ?? downloadHistory.length}
          </div>
          <p className="font-mono text-xs text-[#71717A]">Lifetime downloads from the vault</p>
        </div>

        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-2">
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block">
            Discord Server Status
          </span>
          <div className="font-display text-3xl text-green-400 flex items-center gap-2">
            <ShieldCheck size={26} />
            Verified
          </div>
          <p className="font-mono text-xs text-[#71717A]">Unlimited public download access</p>
        </div>
      </div>

      {/* DOWNLOAD HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <h2 className="font-display text-lg text-white">Recent Downloads</h2>
          <span className="font-mono text-xs text-[#3F3F46]">
            {downloadHistory.length} entries
          </span>
        </div>

        {downloadHistory.length > 0 ? (
          <div className="divide-y divide-[#1A1A1A] border border-[#1A1A1A] bg-[#111111] rounded-[2px]">
            {downloadHistory.map((dl, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-display text-sm text-white">{dl.drops?.title || 'Asset'}</div>
                  <div className="font-mono text-[10px] text-[#71717A]">
                    {dl.drops?.file_format?.toUpperCase()} · {new Date(dl.downloaded_at).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/today`}>
                  <Button size="sm" variant="outline" className="font-mono text-[10px]">
                    Re-download
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-[#1A1A1A] bg-[#111111] rounded-[2px]">
            <p className="font-mono text-xs text-[#71717A]">No downloads recorded yet.</p>
            <Link href="/vault" className="font-mono text-xs text-accent hover:underline mt-2 inline-block">
              Browse the Vault Archive →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}