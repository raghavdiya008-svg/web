-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (synced with Discord OAuth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discord_id TEXT UNIQUE NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    discord_access_token TEXT,          -- Encrypted
    discord_refresh_token TEXT,         -- Encrypted
    is_server_member BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'banned')),
    email TEXT,
    email_notifications BOOLEAN DEFAULT TRUE,
    total_downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_server_member ON users(is_server_member);

-- Categories (managed by admin)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,                          -- Lucide icon name
    color TEXT DEFAULT '#06B6D4',       -- Accent color for category
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drops (the daily assets)
CREATE TABLE drops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,             -- Supabase Storage path
    file_size BIGINT NOT NULL,          -- Bytes
    file_format TEXT NOT NULL,          -- zip, json, mp3, wav, lut, etc.
    preview_url TEXT,                   -- Preview asset (waveform json, lottie json, image)
    license TEXT NOT NULL,              -- MIT, Apache-2.0, CC0, CC-BY-4.0, OFL, EditX-Community
    tags TEXT[] DEFAULT '{}',
    compatible_software TEXT[] DEFAULT '{}',
    instructions TEXT,                  -- Markdown usage instructions
    scheduled_for TIMESTAMPTZ NOT NULL,
    is_live BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drops_scheduled_for ON drops(scheduled_for);
CREATE INDEX idx_drops_is_live ON drops(is_live);
CREATE INDEX idx_drops_category ON drops(category_id);
CREATE INDEX idx_drops_tags ON drops USING GIN(tags);

-- Download logs
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash TEXT,                       -- Hashed IP for rate limiting
    user_agent TEXT
);

CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_downloads_drop ON downloads(drop_id);
CREATE INDEX idx_downloads_downloaded_at ON downloads(downloaded_at);

-- Community submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    source_url TEXT,
    file_url TEXT,                      -- If uploaded directly
    license TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitter ON submissions(submitter_id);

-- Admin audit logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,               -- create_drop, update_drop, delete_drop, ban_user, etc.
    target_type TEXT,                   -- drop, user, submission, settings
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at);

-- Platform settings (key-value, admin managed)
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (slug, name, description, icon, color, sort_order) VALUES
('sfx', 'SFX Packs', 'Sound effects, Foley, impacts, risers, transitions', 'volume-2', '#06B6D4', 1),
('luts', 'Color Grading LUTs', 'Creative and technical LUTs for Rec.709, Log, HLG', 'palette', '#A78BFA', 2),
('contracts', 'Contracts & Templates', 'Freelance agreements, NDAs, invoices, release forms', 'file-text', '#F59E0B', 3),
('animations', 'Animation Presets', 'After Effects, Motion, Cavalry, Rive presets', 'cube', '#10B981', 4),
('overlays', 'Motion Overlays', 'Lower thirds, transitions, textures, light leaks', 'layers', '#EF4444', 5),
('hooks', 'Hook Scripts', 'Short-form retention hooks, CTA scripts, storytelling frameworks', 'mouse-pointer-2', '#EC4899', 6),
('typography', 'Typography Packs', 'Font pairings, type scales, variable font specs', 'type', '#8B5CF6', 7),
('icons', 'Icon Sets', 'UI icon packs, animated icons, system icon replacements', 'square-pen', '#6366F1', 8);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('drop_time', '"14:00"', 'Daily drop time in 24h format (IST)'),
('drop_timezone', '"Asia/Kolkata"', 'Timezone for scheduled drops'),
('discord_server_id', '"1538957031455596544"', 'EditX Discord server ID for membership verification'),
('discord_invite_url', '"https://discord.gg/editx"', 'Public Discord invite link'),
('maintenance_mode', 'false', 'Enable maintenance mode for non-admins'),
('max_file_size_mb', '500', 'Maximum upload size in MB'),
('rate_limit_downloads_per_hour', '50', 'Max downloads per user per hour'),
('email_welcome_enabled', 'true', 'Send welcome email on first login'),
('email_drop_notifications_enabled', 'true', 'Send email when new drop goes live');

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Users: users can read/update their own record
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Drops: public can read live drops; admins manage all
CREATE POLICY "Public can view live drops" ON drops FOR SELECT USING (is_live = TRUE);
CREATE POLICY "Admins manage drops" ON drops FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Downloads: users can view own downloads; admins view all
CREATE POLICY "Users view own downloads" ON downloads FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins view all downloads" ON downloads FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System inserts downloads" ON downloads FOR INSERT WITH CHECK (TRUE);

-- Submissions: users can create and view own; admins manage all
CREATE POLICY "Users create submissions" ON submissions FOR INSERT WITH CHECK (submitter_id = auth.uid());
CREATE POLICY "Users view own submissions" ON submissions FOR SELECT USING (submitter_id = auth.uid());
CREATE POLICY "Admins manage submissions" ON submissions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Admin logs: admins only
CREATE POLICY "Admins view logs" ON admin_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System inserts logs" ON admin_logs FOR INSERT WITH CHECK (TRUE);

-- Settings: admins only
CREATE POLICY "Admins manage settings" ON settings FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Categories: public read active; admins manage
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drops_updated_at BEFORE UPDATE ON drops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
