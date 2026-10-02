'use client';
import { useState } from 'react';
import { Save, RefreshCw, Plus, Trash2, Shield, Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function SettingsForm() {
  const [loading, setLoading] = useState(false);

  // Settings state
  const [dropTime, setDropTime] = useState('14:00');
  const [dropTimezone, setDropTimezone] = useState('Asia/Kolkata');
  const [discordServerId, setDiscordServerId] = useState('1538957031455596544');
  const [discordInviteUrl, setDiscordInviteUrl] = useState('https://discord.gg/editx');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(500);
  const [rateLimitHour, setRateLimitHour] = useState(50);
  const [emailWelcome, setEmailWelcome] = useState(true);
  const [emailDropAlert, setEmailDropAlert] = useState(true);

  // Categories list
  const [categories, setCategories] = useState([
    { id: '1', slug: 'sfx', name: 'SFX Packs', color: '#06B6D4' },
    { id: '2', slug: 'luts', name: 'Color Grading LUTs', color: '#A78BFA' },
    { id: '3', slug: 'contracts', name: 'Contracts & Templates', color: '#F59E0B' },
    { id: '4', slug: 'animations', name: 'Animation Presets', color: '#10B981' },
    { id: '5', slug: 'overlays', name: 'Motion Overlays', color: '#EF4444' },
    { id: '6', slug: 'hooks', name: 'Hook Scripts', color: '#EC4899' },
    { id: '7', slug: 'typography', name: 'Typography Packs', color: '#8B5CF6' },
    { id: '8', slug: 'icons', name: 'Icon Sets', color: '#6366F1' },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Platform configuration saved successfully.');
    } catch {
      toast.error('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        slug: newCatSlug.toLowerCase().trim(),
        name: newCatName.trim(),
        color: '#06B6D4',
      },
    ]);
    setNewCatName('');
    setNewCatSlug('');
    toast.success('Category added.');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.info('Category removed.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* SECTION 1: DROP SCHEDULE ENGINE */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div>
            <h2 className="font-display text-base text-white">Daily Drop Schedule Engine</h2>
            <p className="font-mono text-xs text-[#71717A]">Configure global cron release timing</p>
          </div>
          <ClockIcon className="text-accent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Daily Drop Time (24h)
            </label>
            <input
              type="time"
              value={dropTime}
              onChange={(e) => setDropTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Engine Timezone
            </label>
            <select
              value={dropTimezone}
              onChange={(e) => setDropTimezone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
              <option value="America/New_York">America/New_York (EST - UTC-5)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-8)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: DISCORD & OAUTH INTEGRATION */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div>
            <h2 className="font-display text-base text-white">Discord Community & OAuth</h2>
            <p className="font-mono text-xs text-[#71717A]">Guild connection and public invite targets</p>
          </div>
          <Shield className="text-accent w-4 h-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Discord Server ID (Guild ID)
            </label>
            <input
              type="text"
              value={discordServerId}
              onChange={(e) => setDiscordServerId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Public Discord Invite URL
            </label>
            <input
              type="url"
              value={discordInviteUrl}
              onChange={(e) => setDiscordInviteUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: SYSTEM LIMITS & MAINTENANCE */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div>
            <h2 className="font-display text-base text-white">System Limits & Access Control</h2>
            <p className="font-mono text-xs text-[#71717A]">Rate limiting and emergency maintenance switches</p>
          </div>
          <Globe className="text-accent w-4 h-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Max Upload Size (MB)
            </label>
            <input
              type="number"
              value={maxFileSizeMb}
              onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Max Downloads per User / Hour
            </label>
            <input
              type="number"
              value={rateLimitHour}
              onChange={(e) => setRateLimitHour(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#1A1A1A]">
          <div>
            <div className="text-white text-sm font-medium">Maintenance Mode</div>
            <div className="font-mono text-xs text-[#71717A]">
              Temporarily renders maintenance page for non-admin visitors
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              maintenanceMode ? 'bg-red-500 justify-end' : 'bg-[#1A1A1A] justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white" />
          </button>
        </div>
      </div>

      {/* SECTION 4: CATEGORY MANAGER */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div>
            <h2 className="font-display text-base text-white">Asset Categories</h2>
            <p className="font-mono text-xs text-[#71717A]">Add or remove tags available in the Vault</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2px]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-mono text-xs text-white">{c.name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCategory(c.id)}
                className="text-[#3F3F46] hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            placeholder="Category Name (e.g. 3D Models)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-white text-xs font-mono rounded-[2px] focus:outline-none focus:border-accent"
          />
          <input
            placeholder="slug (e.g. 3d-models)"
            value={newCatSlug}
            onChange={(e) => setNewCatSlug(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-white text-xs font-mono rounded-[2px] focus:outline-none focus:border-accent"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            className="gap-1.5 font-mono text-xs shrink-0"
          >
            <Plus size={13} />
            Add Tag
          </Button>
        </div>
      </div>

      {/* SAVE ACTION */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1A1A1A]">
        <Button type="submit" variant="primary" size="lg" loading={loading} className="gap-2">
          <Save size={16} />
          Save Platform Settings
        </Button>
      </div>
    </form>
  );
}

function ClockIcon(props: any) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}