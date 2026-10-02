'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Calendar, Upload, Users, Inbox, BarChart, Settings } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/drops', label: 'Drop Schedule', icon: Calendar },
  { href: '/admin/upload', label: 'Upload Asset', icon: Upload },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="font-display text-xl tracking-tight text-white">
          EditX<span className="text-accent">Admin</span>
        </Link>
      </div>
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-body-sm font-medium',
                isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-white hover:bg-[#1A1A1A]'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/" className="text-body-sm text-text-secondary hover:text-white transition-colors flex items-center gap-2">
          ← Back to Vault
        </Link>
      </div>
    </aside>
  );
}