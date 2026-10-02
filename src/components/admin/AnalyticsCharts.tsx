'use client';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DOWNLOADS_BY_CATEGORY = [
  { category: 'SFX Packs', count: 18400, color: '#06B6D4' },
  { category: 'LUTs', count: 14200, color: '#A78BFA' },
  { category: 'Contracts', count: 9800, color: '#F59E0B' },
  { category: 'Animations', count: 8600, color: '#10B981' },
  { category: 'Overlays', count: 16500, color: '#EF4444' },
  { category: 'Hooks', count: 7200, color: '#EC4899' },
  { category: 'Typography', count: 5400, color: '#8B5CF6' },
  { category: 'Icons', count: 4300, color: '#6366F1' },
];

const REGISTRATIONS_DATA = [
  { date: 'Sep 1', users: 45 },
  { date: 'Sep 5', users: 82 },
  { date: 'Sep 10', users: 110 },
  { date: 'Sep 15', users: 95 },
  { date: 'Sep 20', users: 160 },
  { date: 'Sep 25', users: 210 },
  { date: 'Sep 30', users: 285 },
];

const TRAFFIC_SOURCES = [
  { name: 'Discord Communities', value: 48, color: '#5865F2' },
  { name: 'Direct / Bookmarks', value: 24, color: '#06B6D4' },
  { name: 'Twitter / X', value: 18, color: '#A78BFA' },
  { name: 'Organic Search', value: 10, color: '#10B981' },
];

const TOP_SEARCH_QUERIES = [
  { query: '16mm grain 4k', searches: 1420, growth: '+34%' },
  { query: 'kodak 500t lut', searches: 1180, growth: '+18%' },
  { query: 'trailer sub impact', searches: 980, growth: '+22%' },
  { query: 'mogrt lower third', searches: 870, growth: '+12%' },
  { query: 'freelance invoice', searches: 640, growth: '+5%' },
  { query: 'kinetic typography', searches: 590, growth: '+27%' },
];

export function AnalyticsCharts() {
  return (
    <div className="space-y-8">
      {/* OVERVIEW STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '30-Day Total Grabs', value: '84,400', delta: '+18.4% vs last mo' },
          { label: 'Registered Creators', value: '2,480', delta: '+340 this week' },
          { label: 'Public Conversion', value: '71.2%', delta: 'Visitor to download' },
          { label: 'Top Category', value: 'SFX Packs', delta: '21.8% of all grabs' },
        ].map((item) => (
          <div key={item.label} className="bg-[#111111] border border-[#1A1A1A] p-5 rounded-[2px] space-y-1">
            <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block">
              {item.label}
            </span>
            <div className="font-display text-2xl lg:text-3xl text-white font-medium">{item.value}</div>
            <p className="font-mono text-[11px] text-accent">{item.delta}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DOWNLOADS BY CATEGORY (BAR) */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Downloads by Category</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">All-time volume</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DOWNLOADS_BY_CATEGORY} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#3F3F46"
                  tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#3F3F46" tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#1A1A1A',
                    borderRadius: '2px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGISTRATIONS PER DAY (LINE) */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">New User Signups</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">30-day velocity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REGISTRATIONS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#3F3F46"
                  tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis stroke="#3F3F46" tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: '#1A1A1A',
                    borderRadius: '2px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#A78BFA' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: TRAFFIC & SEARCH QUERIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TRAFFIC SOURCES */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Traffic Acquisition</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">Referral share</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRAFFIC_SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {TRAFFIC_SOURCES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {TRAFFIC_SOURCES.map((src) => (
                <div key={src.name} className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                    <span className="text-[#71717A]">{src.name}</span>
                  </div>
                  <span className="text-white font-medium">{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP SEARCH QUERIES IN /VAULT */}
        <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
            <h3 className="font-display text-base text-white">Top Vault Search Queries</h3>
            <span className="font-mono text-[10px] text-[#71717A] uppercase">Creator intent</span>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {TOP_SEARCH_QUERIES.map((q, idx) => (
              <div key={q.query} className="py-2.5 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#3F3F46] w-4">{idx + 1}.</span>
                  <span className="text-white">&ldquo;{q.query}&rdquo;</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#71717A]">{q.searches.toLocaleString()}</span>
                  <span className="text-accent text-[10px]">{q.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}