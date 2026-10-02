// src/components/admin/UsersTable.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, Search, MoreHorizontal, Shield, User, Mail, Calendar, Trash2, Edit2, Ban, Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { UserRole, UserStatus } from '@/types/database';

interface UserRow {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  submission_count: number;
  total_downloads: number;
}

interface UsersTableProps {
  users: UserRow[];
  onUpdateUser: (id: string, data: Partial<UserRow>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onImpersonate: (id: string) => void;
}

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  moderator: { label: 'Moderator', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  contributor: { label: 'Contributor', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  user: { label: 'User', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

const STATUS_BADGES: Record<string, { label: string; className: string; icon: any }> = {
  active: { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <Activity className="w-3 h-3 mr-1" /> },
  pending: { label: 'Pending', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <Calendar className="w-3 h-3 mr-1" /> },
  suspended: { label: 'Suspended', className: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <Ban className="w-3 h-3 mr-1" /> },
  banned: { label: 'Banned', className: 'bg-gray-500/20 text-gray-500 border-gray-500/30', icon: <User className="w-3 h-3 mr-1" /> },
};

export function UsersTable({ users, onUpdateUser, onDeleteUser, onImpersonate }: UsersTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserRow; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = 
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, roleFilter, statusFilter, sortConfig]);

  const handleSort = (key: keyof UserRow) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'ban' | 'delete') => {
    for (const id of selectedUsers) {
      if (action === 'delete') {
        await onDeleteUser(id);
      } else {
        await onUpdateUser(id, { status: action === 'activate' ? 'active' : action as any });
      }
    }
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
