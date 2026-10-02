'use client';
import { useState } from 'react';
import { UsersTable } from '@/components/admin/UsersTable';
import { Download, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([
    {
      id: 'usr-1',
      email: 'alex.motion@gmail.com',
      username: 'alex_motion',
      full_name: 'Alex Miller',
      avatar_url: null,
      role: 'admin',
      status: 'active',
      email_verified: true,
      last_sign_in_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
      submission_count: 5,
      total_downloads: 142,
    },
    {
      id: 'usr-2',
      email: 'sarah.cut@vfx.studio',
      username: 'sarah_cut',
      full_name: 'Sarah Connor',
      avatar_url: null,
      role: 'user',
      status: 'active',
      email_verified: true,
      last_sign_in_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
      submission_count: 2,
      total_downloads: 89,
    },
    {
      id: 'usr-3',
      email: 'kieran.sound@producer.org',
      username: 'kieran_sound',
      full_name: 'Kieran Scott',
      avatar_url: null,
      role: 'user',
      status: 'active',
      email_verified: true,
      last_sign_in_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      submission_count: 3,
      total_downloads: 41,
    },
    {
      id: 'usr-4',
      email: 'bot_scrapex@shadow.io',
      username: 'crawler_99',
      full_name: 'Scraper Bot',
      avatar_url: null,
      role: 'user',
      status: 'suspended',
      email_verified: false,
      last_sign_in_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      submission_count: 0,
      total_downloads: 50,
    },
  ]);

  const handleUpdateUser = async (id: string, data: any) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    toast.success('User updated.');
  };

  const handleDeleteUser = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error('User deleted.');
  };

  const handleImpersonate = (id: string) => {
    toast.info(`Session impersonated for user ID: ${id}`);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['id,email,username,role,status,total_downloads,created_at']
        .concat(
          users.map((u) =>
            [u.id, u.email, u.username, u.role, u.status, u.total_downloads, u.created_at].join(',')
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'editx_users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported.');
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
        <div>
          <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block mb-1">
            Community Registry
          </span>
          <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
            User Management
          </h1>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCsv}
          className="gap-1.5 font-mono text-xs"
        >
          <Download size={14} />
          Export to CSV
        </Button>
      </div>

      {/* USERS TABLE */}
      <UsersTable
        users={users}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onImpersonate={handleImpersonate}
      />
    </div>
  );
}
